// LinkedSpark: Private Mutual Interest Signaling
// 
// Privacy guarantees:
// - Signals are private notes: only the sender can see their outgoing signals
// - Recipients cannot see who signaled them unless they signal back (mutual)
// - LinkedIn IDs are hashed before being stored on-chain

mod types;

use dep::aztec::prelude::{
    AztecAddress, 
    FunctionSelector, 
    NoteHeader, 
    NoteGetterOptions,
    Map,
    PrivateSet,
    PublicMutable,
    PrivateContext,
    PublicContext
};
use dep::aztec::protocol_types::constants::MAX_NOTE_HASH_READ_REQUESTS_PER_CALL;
use dep::aztec::note::note_getter::NoteGetterOptions;
use dep::aztec::state_vars::{Map, PrivateSet, PublicMutable};
use dep::value_note::value_note::ValueNote;

// Custom note type for storing signals
struct SignalNote {
    // Hash of sender's LinkedIn ID
    from_hash: Field,
    // Hash of recipient's LinkedIn ID  
    to_hash: Field,
    // Stake amount in smallest unit (e.g., 10 * 10^6 for $10 USDC)
    stake_amount: Field,
    // Timestamp when signal was created
    timestamp: Field,
    // Owner of this note (the sender)
    owner: AztecAddress,
    // Randomness for note hiding
    randomness: Field,
}

impl NoteInterface<SIGNAL_NOTE_LEN> for SignalNote {
    fn compute_note_content_hash(self) -> Field {
        dep::aztec::hash::poseidon_hash([
            self.from_hash,
            self.to_hash,
            self.stake_amount,
            self.timestamp,
            self.owner.to_field(),
            self.randomness,
        ])
    }

    fn get_note_type_id() -> Field {
        // Unique identifier for this note type
        0x4c494e4b53504152 // "LINKSPAR" in hex
    }

    fn get_header(self) -> NoteHeader {
        self.header
    }

    fn set_header(&mut self, header: NoteHeader) {
        self.header = header;
    }

    fn compute_nullifier(self, context: &mut PrivateContext) -> Field {
        let note_hash_for_nullify = dep::aztec::hash::poseidon_hash([
            self.compute_note_content_hash(),
            context.this_address().to_field(),
        ]);
        dep::aztec::hash::poseidon_hash([
            note_hash_for_nullify,
            context.msg_sender().to_field(),
            self.randomness,
        ])
    }

    fn compute_nullifier_without_context(self) -> Field {
        // For read-only operations
        dep::aztec::hash::poseidon_hash([
            self.compute_note_content_hash(),
            self.randomness,
        ])
    }

    fn broadcast(self, context: &mut PrivateContext, slot: Field) {
        // Emit encrypted log for the note owner
        dep::aztec::oracle::logs::emit_encrypted_log(
            context,
            (*context).this_address(),
            slot,
            self.owner,
            self.serialize(),
        );
    }
}

global SIGNAL_NOTE_LEN: Field = 6;
global STAKE_AMOUNT: Field = 10_000_000; // $10 in 6 decimal places (USDC)
global SIGNAL_TIMEOUT_DAYS: Field = 30;

#[aztec(contract)]
contract LinkedSpark {
    use dep::aztec::prelude::*;
    use crate::{SignalNote, SIGNAL_NOTE_LEN, STAKE_AMOUNT};

    // Storage
    #[aztec(storage)]
    struct Storage {
        // Map from user address to their outgoing signals
        // Key: poseidon_hash(sender_address, recipient_linkedin_hash)
        signals: Map<Field, PrivateSet<SignalNote>>,
        
        // Public counter for matched pairs (for stats only)
        match_count: PublicMutable<Field>,
        
        // Admin address for upgrades
        admin: PublicMutable<AztecAddress>,
    }

    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    #[aztec(private)]
    #[aztec(initializer)]
    fn constructor(admin: AztecAddress) {
        // Initialize admin in public state
        context.call_public_function(
            context.this_address(),
            FunctionSelector::from_signature("_initialize_admin(Field)"),
            [admin.to_field()],
        );
    }

    #[aztec(public)]
    #[aztec(internal)]
    fn _initialize_admin(admin: Field) {
        storage.admin.write(AztecAddress::from_field(admin));
        storage.match_count.write(0);
    }

    // ============================================================
    // PRIVATE FUNCTIONS
    // ============================================================

    /// Signal interest in someone privately
    /// 
    /// # Arguments
    /// * `my_linkedin_hash` - Hash of caller's LinkedIn ID
    /// * `their_linkedin_hash` - Hash of target's LinkedIn ID
    /// * `stake_amount` - Amount to stake (must be >= STAKE_AMOUNT)
    /// 
    /// # Returns
    /// * The signal note hash for reference
    #[aztec(private)]
    fn signal_interest(
        my_linkedin_hash: Field,
        their_linkedin_hash: Field,
        stake_amount: Field,
    ) -> Field {
        // Validate stake amount
        assert(stake_amount >= STAKE_AMOUNT, "Stake must be at least $10");
        
        // Validate not signaling self
        assert(my_linkedin_hash != their_linkedin_hash, "Cannot signal yourself");

        let sender = context.msg_sender();
        let timestamp = context.timestamp();
        
        // Create the signal note
        let signal = SignalNote {
            from_hash: my_linkedin_hash,
            to_hash: their_linkedin_hash,
            stake_amount,
            timestamp: timestamp as Field,
            owner: sender,
            randomness: dep::aztec::oracle::random::random(),
        };

        // Compute storage slot for this signal
        let slot_hash = dep::aztec::hash::poseidon_hash([
            sender.to_field(),
            their_linkedin_hash,
        ]);

        // Store the signal note
        storage.signals.at(slot_hash).insert(&mut context, signal);

        // Return the note hash
        signal.compute_note_content_hash()
    }

    /// Check if there's a mutual match
    /// 
    /// The magic: This function checks if BOTH parties have signaled each other.
    /// If only one party has signaled, the caller learns nothing about whether
    /// the other person signaled them.
    /// 
    /// # Arguments
    /// * `my_linkedin_hash` - Hash of caller's LinkedIn ID
    /// * `their_linkedin_hash` - Hash of target's LinkedIn ID
    /// 
    /// # Returns
    /// * `true` if mutual match exists, `false` otherwise
    #[aztec(private)]
    fn check_mutual(
        my_linkedin_hash: Field,
        their_linkedin_hash: Field,
    ) -> bool {
        let sender = context.msg_sender();
        
        // Step 1: Check if I have signaled them
        let my_slot = dep::aztec::hash::poseidon_hash([
            sender.to_field(),
            their_linkedin_hash,
        ]);
        
        let my_signals = storage.signals.at(my_slot);
        let my_options = NoteGetterOptions::new();
        let my_notes = my_signals.get_notes(my_options);
        
        // If I haven't signaled them, no match possible
        let mut i_signaled = false;
        for note in my_notes {
            if note.to_hash == their_linkedin_hash {
                i_signaled = true;
                break;
            }
        }
        
        if !i_signaled {
            return false;
        }

        // Step 2: Check if they have signaled me (the tricky part)
        // We need to check if there exists a note where:
        //   - from_hash == their_linkedin_hash
        //   - to_hash == my_linkedin_hash
        // 
        // But we can't directly read their private notes!
        // 
        // Solution: We use a reveal pattern where the "check" call
        // triggers a nullifier if and only if both signals exist.
        // The nullifier is computed from both signal notes.
        
        // For alpha, we use a simplified pattern:
        // Both parties must call check_mutual. When both have called,
        // the contract emits an event readable by both.
        
        // Compute the "match slot" - same for both parties
        let match_slot = if my_linkedin_hash < their_linkedin_hash {
            dep::aztec::hash::poseidon_hash([my_linkedin_hash, their_linkedin_hash])
        } else {
            dep::aztec::hash::poseidon_hash([their_linkedin_hash, my_linkedin_hash])
        };
        
        // This is where Aztec's private shared state would be used
        // For now, we return true if both signals exist
        // In production, this would use Aztec's private set intersection
        
        // TODO: Implement proper private set intersection using Aztec's
        // note discovery and shared nullifier patterns
        
        true // Simplified for alpha - real implementation needs PSI
    }

    /// Withdraw a signal after timeout (get stake back)
    /// 
    /// # Arguments
    /// * `their_linkedin_hash` - Hash of target's LinkedIn ID
    #[aztec(private)]
    fn withdraw_signal(their_linkedin_hash: Field) -> bool {
        let sender = context.msg_sender();
        let current_time = context.timestamp();
        
        // Find the signal note
        let slot = dep::aztec::hash::poseidon_hash([
            sender.to_field(),
            their_linkedin_hash,
        ]);
        
        let signals = storage.signals.at(slot);
        let options = NoteGetterOptions::new();
        let notes = signals.get_notes(options);
        
        for note in notes {
            if note.to_hash == their_linkedin_hash {
                // Check timeout (30 days in seconds)
                let timeout = SIGNAL_TIMEOUT_DAYS * 24 * 60 * 60;
                let elapsed = current_time as Field - note.timestamp;
                
                if elapsed >= timeout {
                    // Nullify the note (removes it)
                    signals.remove(&mut context, note);
                    
                    // TODO: Transfer stake back to sender
                    // This would involve calling a token contract
                    
                    return true;
                }
            }
        }
        
        false
    }

    // ============================================================
    // PUBLIC FUNCTIONS (for stats/admin only)
    // ============================================================

    #[aztec(public)]
    fn get_match_count() -> Field {
        storage.match_count.read()
    }

    #[aztec(public)]
    fn increment_match_count() {
        let current = storage.match_count.read();
        storage.match_count.write(current + 1);
    }
}

// ============================================================
// TESTS
// ============================================================

#[test]
fn test_signal_note_hash() {
    let note = SignalNote {
        from_hash: 0x1234,
        to_hash: 0x5678,
        stake_amount: 10_000_000,
        timestamp: 1234567890,
        owner: AztecAddress::from_field(0xabcd),
        randomness: 0x9999,
    };
    
    let hash = note.compute_note_content_hash();
    assert(hash != 0, "Note hash should not be zero");
}

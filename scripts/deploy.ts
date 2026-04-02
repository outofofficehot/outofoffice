/**
 * LinkedSpark Contract Deployment Script
 * 
 * Usage:
 *   npm run deploy:local    # Deploy to local sandbox
 *   npm run deploy:alpha    # Deploy to Aztec Alpha mainnet
 */

import {
  createPXEClient,
  getSchnorrAccount,
  Fr,
  AztecAddress,
} from '@aztec/aztec.js';
import { LinkedSparkContract } from '../src/artifacts/LinkedSpark';

const NETWORKS = {
  sandbox: 'http://localhost:8080',
  alpha: 'https://pxe.alpha.aztec.network',
};

async function main() {
  const network = process.env.NETWORK || 'sandbox';
  const pxeUrl = NETWORKS[network as keyof typeof NETWORKS];
  
  console.log(`\n🔐 LinkedSpark Deployment`);
  console.log(`   Network: ${network}`);
  console.log(`   PXE: ${pxeUrl}\n`);

  // Connect to PXE
  console.log('📡 Connecting to PXE...');
  const pxe = createPXEClient(pxeUrl);
  
  // Wait for PXE to be ready
  await pxe.getPXEInfo();
  console.log('   ✓ PXE connected\n');

  // Create deployer account
  console.log('🔑 Setting up deployer account...');
  const secretKey = process.env.DEPLOYER_SECRET_KEY 
    ? Fr.fromString(process.env.DEPLOYER_SECRET_KEY)
    : Fr.random();
  
  const account = getSchnorrAccount(pxe, secretKey, Fr.random());
  const wallet = await account.waitSetup();
  const deployerAddress = wallet.getAddress();
  console.log(`   ✓ Deployer: ${deployerAddress.toString()}\n`);

  // Deploy contract
  console.log('📄 Deploying LinkedSpark contract...');
  const contract = await LinkedSparkContract.deploy(
    wallet,
    deployerAddress, // Admin address
  )
    .send()
    .deployed();

  const contractAddress = contract.address;
  console.log(`   ✓ Contract deployed!\n`);
  
  // Output results
  console.log('═══════════════════════════════════════════════════════');
  console.log('  DEPLOYMENT SUCCESSFUL');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Contract Address: ${contractAddress.toString()}`);
  console.log(`  Network: ${network}`);
  console.log(`  Deployer: ${deployerAddress.toString()}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n📝 Add this to your .env file:');
  console.log(`   VITE_CONTRACT_ADDRESS=${contractAddress.toString()}`);
  console.log('\n');

  // Save deployment info
  const deployment = {
    network,
    contractAddress: contractAddress.toString(),
    deployerAddress: deployerAddress.toString(),
    deployedAt: new Date().toISOString(),
    secretKey: secretKey.toString(), // Save for local dev only!
  };

  // Only save secret key for sandbox
  if (network !== 'sandbox') {
    delete (deployment as any).secretKey;
  }

  const fs = await import('fs');
  fs.writeFileSync(
    `deployments/${network}.json`,
    JSON.stringify(deployment, null, 2)
  );
  console.log(`💾 Deployment info saved to deployments/${network}.json\n`);
}

main().catch((err) => {
  console.error('❌ Deployment failed:', err);
  process.exit(1);
});

// Out Of Office - Brand Configuration
// "LinkedIn meets dating. Premium discretion. Slightly playful."

export const brand = {
  name: 'Out Of Office',
  shortName: 'OOO',
  tagline: 'Signal interest. Stay discreet.',
  
  colors: {
    // Core palette
    base: '#FFECF4',        // Soft pink
    rust: '#C8422A',        // Primary accent - romantic but not harsh
    gold: '#C9A96E',        // Optional accent - premium feel
    
    // Derived colors
    rustLight: '#D4604A',   // Lighter rust for hover states
    rustDark: '#A33620',    // Darker rust for active states
    pinkDark: '#FFD9E8',    // Slightly darker pink for depth
    pinkLight: '#FFF5F9',   // Near white for cards
    
    // Text
    textPrimary: '#2D1F1F', // Warm dark brown
    textSecondary: '#6B5454', // Muted brown
    textMuted: '#9A8585',   // Light brown
    
    // Functional
    success: '#4A7C59',     // Muted green
    error: '#C8422A',       // Uses rust
    white: '#FFFFFF',
  },
  
  fonts: {
    // Logo/headings: Prata - modern serif, romantic
    display: "'Prata', Georgia, serif",
    // Body: Suggesting "DM Sans" - clean, modern, pairs well
    body: "'DM Sans', system-ui, sans-serif",
    // Alternative body options that work with Prata:
    // - "Inter" - clean and modern
    // - "Outfit" - geometric, contemporary
    // - "Plus Jakarta Sans" - sophisticated
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '32px',
    full: '9999px',
  },
  
  shadows: {
    soft: '0 4px 20px rgba(200, 66, 42, 0.08)',
    glow: '0 0 20px rgba(200, 66, 42, 0.15)',
    card: '0 8px 32px rgba(45, 31, 31, 0.06)',
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #FFECF4 0%, #FFD9E8 100%)',
    button: 'linear-gradient(135deg, #C8422A 0%, #D4604A 100%)',
    subtle: 'linear-gradient(180deg, #FFF5F9 0%, #FFECF4 100%)',
  },
} as const;

// Copy suggestions for different contexts
export const copy = {
  hero: {
    headline: 'Out Of Office',
    tagline: 'Signal interest. Stay discreet.',
    subline: 'For the colleague you can\'t stop thinking about.',
  },
  
  cta: {
    primary: 'Signal Someone',
    secondary: 'See How It Works',
    connect: 'Connect Wallet',
  },
  
  howItWorks: {
    title: 'How it works',
    steps: [
      {
        title: 'Find them on LinkedIn',
        desc: 'Paste their LinkedIn URL. We hash it—never store names.',
      },
      {
        title: 'Put your money where your heart is',
        desc: 'Stake $10. It keeps things serious and spam-free.',
      },
      {
        title: 'Your secret stays safe',
        desc: 'Your signal is encrypted. Even we can\'t see it.',
      },
      {
        title: 'Mutual? You\'ll know.',
        desc: 'If they signal you too, you both find out. If not, nobody does.',
      },
    ],
  },
  
  features: {
    title: 'Why OOO?',
    items: [
      {
        title: 'Zero rejection risk',
        desc: 'If it\'s not mutual, they\'ll never know you were interested.',
      },
      {
        title: 'Cryptographically private',
        desc: 'Built on Aztec. Your signal is mathematically hidden.',
      },
      {
        title: 'No awkward conversations',
        desc: 'Let the math do the talking.',
      },
      {
        title: 'Stake recovery',
        desc: 'No match in 30 days? Get your $10 back.',
      },
    ],
  },
  
  trust: {
    title: 'Built for discretion',
    points: [
      'Your identity is hashed—never stored',
      'Open source smart contracts',
      'No accounts, no emails, no trace',
    ],
  },
  
  footer: {
    tagline: 'What happens out of office, stays out of office.',
  },
} as const;

export type Brand = typeof brand;
export type Copy = typeof copy;

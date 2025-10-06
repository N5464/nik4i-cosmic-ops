export interface ContentItem {
  type: 'paragraph' | 'subheader';
  text: string;
  typingDelay?: number;
  className?: string;
  href?: string;
}

export interface ProfileSection {
  id: string;
  title: string;
  icon: string;
  staggeredItemDelay: number;
  typingDelay?: number;
  content: (string | ContentItem)[];
}

export interface OperatorProfileData {
  mainHeader: {
    text: string;
    typingDelay: number;
  };
  subtitle: {
    text: string;
  };
  sections: ProfileSection[];
}

export const operatorProfileData: OperatorProfileData = {
  mainHeader: {
    text: "OPERATOR PROFILE",
    typingDelay: 100
  },
  subtitle: {
    text: "🛠️ PSY ARCHITECT | AI SYSTEMS ENGINEER | WEB3 WARFARE"
  },
  sections: [
    {
      id: "who-i-am",
      title: "🧠 WHO I AM",
      icon: "🧠",
      staggeredItemDelay: 500,
      typingDelay: 1200,
      content: [
        "I don't run with agencies.\nI don't rep collectives.",
        "",
        "I'm a solo operator — built from scratch, wired for execution.",
        "",
        "I move quiet.\nI build lethal.\nI ship real.",
        "",
        "Neural architect. Behavioral systems engineer.\nWeb3 warfare operative. DAO intelligence architect.",
        "",
        "Frontend to backend. Webhooks to workflows. Psychology to automation.\nSmart contracts to governance engines. On-chain behavior to cross-chain ops.",
        "",
        "No dashboards.\nNo noise.\nJust live ops that read minds and execute on-chain.",
        "",
        "You won't find me on LinkedIn."
      ]
    },
    {
      id: "what-i-build",
      title: "🧱 WHAT I BUILD",
      icon: "💻",
      staggeredItemDelay: 1000,
      typingDelay: 1700,
      content: [
        "➤ Behavioral warfare platforms\n(psychological profiling + automation)",
        "➤ Multi-AI orchestration systems\n(Claude + OpenAI coordination)",
        "➤ Full-stack tactical operations\n(Bolt + Supabase + Make)",
        "➤ Async outreach engines\n(email, DMs, triggered followups)",
        "➤ Psychological trigger systems\n(behavioral pattern detection)",
        "➤ Multi-agent relays via webhook orchestration",
        "➤ Sniper bots\n(Zoom mods, Telegram triggers, UI macros)",
        "➤ Black-ops async systems",
        "➤ Real-time automations firing on behavior + psychology",
        "➤ DAO governance warfare systems\n(proposal engines + voting intelligence)",
        "➤ Cross-chain behavioral tracking\n(wallet pattern analysis)",
        "➤ Web3 grant sniping platforms\n(automated proposal generation)",
        "➤ Smart contract psychological triggers\n(on-chain behavior detection)",
        "➤ DeFi intelligence systems\n(liquidity behavior + market psychology)"
      ]
    },
    {
      id: "stack",
      title: "⚙️ STACK",
      icon: "⚙️",
      staggeredItemDelay: 2070,
      typingDelay: 2270,
      content: [
        "Neural Networks • API Integration\nBehavioral Analytics\nBolt • Supabase • Make • Node.js • Python\nAI Agent Orchestration • Multi-Model Coordination\nTesseract OCR • Telegram Bots • OpenAI Agents\nNative webhook choreography • UI sniper flows\nPsychological Pattern Recognition\nReal-time Intelligence\nCoordinate-based macros • Visual region triggers"
      ]
    },
    {
      id: "web3-arsenal",
      title: "🛡️ WEB3 WARFARE ARSENAL",
      icon: "🛡️",
      staggeredItemDelay: 2750,
      typingDelay: 2950,
      content: [
        "➤ Solidity\n(smart contract warfare)",
        "➤ ethers.js\n(blockchain interaction ops)",
        "➤ wagmi (React Web3 hooks)",
        "➤ web3.js\n(native blockchain coordination)",
        "➤ Hardhat\n(contract deployment ops)",
        "➤ OpenZeppelin\n(security-grade contracts)",
        "➤ The Graph\n(on-chain data intelligence)",
        "➤ IPFS\n(decentralized storage ops)",
        "➤ MetaMask integration\n(wallet warfare)",
        "➤ WalletConnect\n(multi-wallet coordination)",
        "➤ Chainlink (oracle intelligence)",
        "➤ Uniswap SDK\n(DeFi integration ops)",
        "➤ Snapshot (governance intelligence)",
        "➤ Aragon (DAO architecture)",
        "➤ Gnosis Safe (multi-sig coordination)"
      ]
    },
    {
      id: "psy-architect",
      title: "🧠 PSY ARCHITECT APPROACH",
      icon: "🧠",
      staggeredItemDelay: 3850,
      typingDelay: 4050,
      content: [
        "➤ I don't build tools —\nI architect digital psychology",
        "➤ Systems that understand human behavior,\nnot just data",
        "➤ Neural networks that predict,\nnot just respond",
        "➤ Deep AI collaboration mastery (Claude partnership)",
        "➤ Behavioral automation across all builds",
        "➤ On-chain psychology —\nwallet behavior never lies",
        "➤ DAO governance intelligence —\nvoting patterns reveal intent",
        "➤ Cross-chain behavioral profiling —\nmulti-network ops",
        "➤ Behavior doesn't lie —\nand neither do ops designed to detect it"
      ]
    },
    {
      id: "how-i-move",
      title: "🔒 HOW I MOVE",
      icon: "🔒",
      staggeredItemDelay: 4770,
      typingDelay: 4970,
      content: [
        "➤ No teams. No templates. Every line is handwired.",
        "➤ Systems aren't pitched — they're deployed.",
        "➤ I don't build for civilians. I weaponize psychology for operators.",
        "➤ Intelligence systems + behavioral profiling = tactical advantage",
        "➤ Web3 native. DAO warfare ready.\nCross-chain behavioral ops.",
        "➤ You bring the mission.\nI return with intelligence-grade systems.",
        "➤ Built from midnight sessions and pressure.\nZero corporate thinking."
      ]
    },
    {
      id: "contact",
      title: "💬 CONTACT",
      icon: "💬",
      staggeredItemDelay: 5630,
      typingDelay: 5830,
      content: [
        "I'm not out here making noise.",
        "",
        "But if this intelligence warfare approach resonates —\nyou already know how to reach me.",
        "",
        "Message with intent.\nI move on signal, not small talk.",
        "",
        {
          type: 'link' as const,
          text: "📡 t.me/intence_heat22",
          href: "https://t.me/intence_heat22"
        }
      ]
    },
    {
      id: "operative-code",
      title: "⚡ OPERATIVE CODE",
      icon: "⚡",
      staggeredItemDelay: 6400,
      typingDelay: 6600,
      content: [
        "Every build I drop is war-tuned with behavioral intelligence.",
        "",
        "Every line wired without noise, every system reads minds.",
        "",
        "Every smart contract weaponized with psychological triggers.",
        "",
        "I don't clone tools. I weaponize workflows with AI networks.",
        "",
        "I don't build apps. I architect digital psychology.",
        "",
        "I don't deploy contracts. I architect on-chain warfare.",
        "",
        "Precision only.",
        "",
        "I'm not waiting for opportunity —\nI'm building the systems they didn't know they needed"
      ]
    },
    {
      id: "operative-id",
      title: "",
      icon: "",
      staggeredItemDelay: 7290,
      content: [
        {
          type: 'subheader' as const,
          text: "🔐 OPERATIVE ID",
          typingDelay: 7490,
          className: "text-cyan-400 font-cinzel text-base sm:text-lg lg:text-xl leading-relaxed"
        },
        "",
        "PSY ARCHITECT | WEB3 WARFARE ACTIVE",
        "",
        {
          type: 'subheader' as const,
          text: "🧭 NORTH STAR",
          typingDelay: 7520,
          className: "text-cyan-400 font-cinzel text-base sm:text-lg lg:text-xl leading-relaxed"
        },
        "",
        "$100K intelligence systems contract"
      ]
    },
    {
      id: "current-targets",
      title: "🎯 CURRENT TARGETS",
      icon: "🎯",
      staggeredItemDelay: 7580,
      typingDelay: 7780,
      content: [
        "➤ Closing a $100K behavioral\nintelligence contract",
        "➤ Architecting intelligence warfare systems\nfor enterprise operations",
        "➤ Deploying AI-human\nhybrid platforms",
        "➤ Web3 DAO governance\nintelligence contracts",
        "➤ Cross-chain behavioral\nprofiling systems",
        "➤ Seeking one mission-critical partnership,\nnot many clients"
      ]
    },
    {
      id: "recent-deployment",
      title: "🕸️ RECENT DEPLOYMENT",
      icon: "🕸️",
      staggeredItemDelay: 8410,
      typingDelay: 8610,
      content: [
        "nik4i.ai — Intelligence Portfolio"
      ]
    }
  ]
};
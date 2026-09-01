// Landing translations (EN). The brand "tepidolacuenta" is NOT translated.
// Keep this structure identical to es.ts.
export const en = {
  nav: {
    login: "Log in",
  },
  hero: {
    titleLine1: "Asking for the bill",
    titleAccent: "just got simpler",
    subtitle:
      "Your guests scan the table's QR code. You get the request instantly. No apps, no confusion.",
    ctaStart: "Start free",
    ctaPlans: "See plans →",
    trust: ["No app for guests", "No card to try it", "Ready in minutes"],
  },
  features: {
    heading: "Everything you need",
    subtitle:
      'Built for restaurants that want to stop depending on "can we get the check?"',
    items: [
      {
        title: "A QR per table",
        description:
          "Each table has its own QR code. Guests scan it without installing any app, in seconds.",
      },
      {
        title: "Real-time requests",
        description:
          "You get the notification the moment a guest sends it. No need to watch every table.",
      },
      {
        title: "Multi-branch",
        description:
          "Manage all your branches from a single dashboard. Each with its own tables and QRs.",
      },
      {
        title: "Admin dashboard",
        description:
          "Set up your tables, review history and handle bill requests all from one place.",
      },
    ],
  },
  how: {
    heading: "Three steps and done",
    subtitle: "Set up in minutes, results from day one.",
    steps: [
      {
        title: "Set up your tables",
        description:
          "Create your account, add your restaurant and generate the QR codes for each table in minutes.",
      },
      {
        title: "The guest scans",
        description:
          "When they want the bill, they scan the table's QR and pick a payment method. No apps.",
      },
      {
        title: "You get the request",
        description:
          "The request appears on your dashboard in real time. One tap and it's handled.",
      },
    ],
  },
  showcase: {
    heading: "Everything you can manage",
    subtitle: "From a single screen, in real time and hassle-free.",
    rows: [
      {
        eyebrow: "Real time",
        title: "Get requests instantly",
        body: "When a guest asks for the bill, the request appears on your panel right away with the table and payment method. One tap and it's handled.",
      },
      {
        eyebrow: "Team",
        title: "Add your team with a code",
        body: "Generate an invite code and your employee signs up with access only to the branch you assign. No emails or setup: it expires in 7 days and is single-use.",
      },
      {
        eyebrow: "Branches",
        title: "Manage all your locations",
        body: "Run multiple branches from a single account, each with its own tables, team and requests. Switch locations with one tap.",
      },
      {
        eyebrow: "Tables",
        title: "One table, one QR",
        body: "Create your tables in minutes and each gets its own unique QR code. Guests scan the one at their table and you know exactly who's asking for the bill.",
      },
      {
        eyebrow: "Print QRs",
        title: "Bring them to the table as a PDF",
        body: "Download the QR codes for all your tables ready to print. Stick one on each table and guests can ask for the bill without apps.",
      },
    ],
  },
  plans: {
    heading: "Plans",
    subtitle: "Choose the plan that best fits your business.",
    trialNote:
      "All plans include a {{count}}-day free trial. Cancel anytime.",
  },
  billing: {
    monthly: "Monthly",
    annual: "Annual",
    freeMonths: "2 months free",
  },
  planCard: {
    perMonth: "/mo",
    perYear: "/yr",
    annualEquiv: "That's 2 months free",
    trialStart: "{{count}} days free to start",
    recommended: "Recommended",
    branchesLabel: "Branches",
    addBranch: "Add branch",
    removeBranch: "Remove branch",
    ctaStart: "Start free",
  },
  planFeatures: {
    branchesIncluded:
      "Includes {{count}} branches · add more at US${{price}} each",
    branchesUnlimited: "Unlimited branches",
    branchesUpTo_one: "Up to {{count}} branch",
    branchesUpTo_other: "Up to {{count}} branches",
    tablesUnlimited: "Unlimited tables",
    tablesUpTo: "Up to {{count}} tables",
    perBranchSuffix: " per branch",
    teamUnlimited: "Unlimited team",
    qrOrders: "Bill requests via QR",
    reportsIncluded: "Reports & analytics",
    reportsAdvanced: "Advanced reports",
    reportsConsolidated: "Advanced + consolidated reports",
  },
  enterprise: {
    title: "Does your business have many branches?",
    subtitle: "Get in touch and we'll build a plan for you.",
    button: "Contact us",
    whatsapp: "Chat on WhatsApp",
  },
  faq: {
    heading: "Frequently asked questions",
    subtitle: "What people usually ask before starting.",
    items: [
      {
        question: "Does the guest have to download an app?",
        answer:
          "No. Guests scan the table's QR with their phone camera and ask for the bill from the browser. Nothing to install.",
      },
      {
        question: "Do I need to buy any hardware?",
        answer:
          "No need. You print the QR codes the system generates and place them on each table. That's it.",
      },
      {
        question: "How do I find out when a guest asks for the bill?",
        answer:
          "You get an instant notification on your panel with the table number. Handle it with one tap.",
      },
      {
        question: "Can I manage more than one branch?",
        answer:
          "Yes. You manage all your branches from the same panel, each with its own tables and QRs.",
      },
      {
        question: "Can I cancel anytime?",
        answer:
          "Yes. You start with free trial days and cancel whenever you want, with no commitment or lock-in.",
      },
    ],
  },
  finalCta: {
    heading: "Start using it today",
    subtitle: "{{count}} days free. Cancel anytime.",
    button: "Create free account",
  },
  footer: {
    tagline:
      "Ask for the bill via QR: simple for your guests, organized for your team.",
    product: "Product",
    account: "Account",
    contact: "Contact",
    linkHow: "How it works",
    linkPlans: "Plans",
    linkFaq: "FAQ",
    login: "Log in",
    createAccount: "Create free account",
    whatsapp: "WhatsApp",
    whatsappFabAria: "Message us on WhatsApp",
    madeIn: "Made in Argentina 🇦🇷",
  },
  // Sample text inside the demos and mockups (phone, orders, cards).
  // "La Parrilla" (sample venue name) and addresses are not translated.
  demo: {
    table: "Table {{n}}",
    tablesCount_one: "{{count}} table",
    tablesCount_other: "{{count}} tables",
    branchCentro: "Centro Branch",
    branchPalermo: "Palermo Branch",
    branchCostanera: "Costanera Branch",
    yourTables: "Your tables",
    askBill: "Ask for the bill",
    noApp: "No app to download",
    pendingRequests: "Pending requests",
    justNow: "just now",
    justNowNoApps: "just now · no apps",
    tableAskedBill: "Table {{n}} asked for the bill",
    ago1min: "1 min ago",
    ago2min: "2 min ago",
    cash: "Cash",
    cashLower: "cash",
    creditLower: "credit",
    debitLower: "debit",
    askedBill: "Asked for the bill",
    markHandled: "Mark as handled",
    live: "{{count}} live",
    paysWith: "Pays with {{label}}",
    deliverBill: "Deliver bill",
    inviteDesc:
      "Generate a code so an employee signs up with access to that branch only. It expires in 7 days and is single-use.",
    copy: "Copy",
    accessTo: "Access to:",
    tablesTitle: "Tables",
    readyToPrint: "Ready to print",
    print: "Print",
    scanToOrder: "Scan to ask for the bill",
  },
} as const;

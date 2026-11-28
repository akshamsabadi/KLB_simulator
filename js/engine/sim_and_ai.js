// KLB Simulator — Master Simulation, Autonomous Multi-Agent AI, Collision, Rare Poisson Hazards & Meters
window.KLB = window.KLB || {};

(() => {
  const ARCHIVE_KEY = 'klb_simulator_archive_v1';
  const ACTIVE_RUN_KEY = 'klb_active_run_v1';
  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const CLOCK_MINS_PER_REAL_SEC = 2.5; // ~21m active clock (~25m/week with modals & minigames)
  const CURFEW_MINS = 19.5 * 60; // 19:30 KLB Security Lockup
  const WALKABLE_TILES = new Set([1, 2, 3, 4, 7, 8]);
  const NON_BLOCKING_OBJS = new Set([
    'npc_marker', 'specs_holder', 'fire_ext', 'black_tub_key', 'lab_speakers', 'chair', 'exit_stairs'
  ]);
  const SHARED_STATION_TYPES = new Set([
    'cafe_table', 'cafe_counter', 'tea_drawer', 'pc_terminal', 'chem_cupboard',
    'fridge_4c', 'freezer_20c', 'balance_table', 'tlc_station', 'drying_oven',
    'argon_cyl', 'base_bath', 'sink', 'waste_bin', 'chair', 'ph_probe'
  ]);

  const PERMADEATH_MESSAGES = {
    MORALE_ZERO: 'Stepped out onto Gordon Street after morale hit zero.',
    CONDITION_ZERO: 'Lab Condition hit 0% — KLB Lab 230 closed for emergency cleanup and formal review.',
    SAFETY_ZERO: 'Lab Condition hit 0% — KLB Lab 230 closed for emergency cleanup and formal review.',
    PATIENCE_ZERO: "Vijay's patience hit zero after missed deadlines and poor group-meeting data."
  };

  // Memoryless Poisson rare event model: ~18% per workday (~0.9x per 5-day week / ~36 per 200 days)
  const DAILY_TARGET_PROB = 0.18;
  const RATE_SWEEP_PER_MIN = -Math.log(1 - DAILY_TARGET_PROB) / 480; // 09:30..17:30 (480 mins)
  const RATE_ALARM_PER_MIN = -Math.log(1 - DAILY_TARGET_PROB) / 480; // 09:30..17:30 (480 mins)
  const RATE_ALEX_PER_MIN = -Math.log(1 - DAILY_TARGET_PROB) / 40;   // 17:05..17:45 (40 mins)
  const DAILY_LCMS_DOWN_PROB = 0.30;
  const RATE_LCMS_PER_MIN = -Math.log(1 - DAILY_LCMS_DOWN_PROB) / 480; // 09:00..17:00 (480 mins)
  const RARE_SIGNATURE_IDS = new Set(['safety_sweep', 'fire_alarm_test', 'alex_king_1718']);

  const DEFAULT_BIG_CHUDS_IDS = [
    'daniel_richards',
    'maximillian_lee',
    'antoine_maruani',
    'andre_shamsabadi',
    'peter_szijj',
    'joao_nogueira',
    'faiza_javaid',
    'calise_bahou',
    'richard_spears',
    'marcos_fernandez'
  ];

  const DEFAULT_PREFERENCES = {
    daniel_richards: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    maximillian_lee: { pref: 'gaming', requiresCaffeine: false, label: 'Video Games' },
    antoine_maruani: { pref: 'gaming', requiresCaffeine: false, label: 'Video Games' },
    andre_shamsabadi: { pref: 'gaming', requiresCaffeine: false, label: 'Video Games' },
    peter_szijj: { pref: 'gaming', requiresCaffeine: false, label: 'Video Games' },
    joao_nogueira: { pref: 'coffee', requiresCaffeine: true, label: 'Coffee' },
    faiza_javaid: { pref: 'coffee', requiresCaffeine: true, label: 'Coffee' },
    calise_bahou: { pref: 'coffee', requiresCaffeine: true, label: 'Coffee' },
    richard_spears: { pref: 'tea', requiresCaffeine: true, label: 'Tea' },
    marcos_fernandez: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' }
  };

  // Verified walkable open cluster centers (away from 1-tile doorways)
  const HUDDLE_CLUSTERS = {
    klb_2f: [
      { x: 15, y: 3 },
      { x: 21, y: 3 },
      { x: 15, y: 6 },
      { x: 18, y: 17 },
      { x: 15, y: 22 }
    ],
    klb_3f: [
      { x: 15, y: 4 },
      { x: 22, y: 3 },
      { x: 24, y: 3 },
      { x: 15, y: 2 }
    ],
    gordons_cafe: [
      { x: 9, y: 4 },
      { x: 10, y: 6 },
      { x: 10, y: 9 },
      { x: 6, y: 9 }
    ],
    meeting_room: [
      { x: 11, y: 2 },
      { x: 11, y: 5 },
      { x: 11, y: 8 },
      { x: 4, y: 5 }
    ],
    cib_lg11_ms: [
      { x: 8, y: 10 },
      { x: 7, y: 6 }
    ],
    cib_lg1b_nmr: [
      { x: 7, y: 4 },
      { x: 4, y: 9 }
    ]
  };

  // Fallback ambient speech lines (82% casual / 18% bench), emoji-free and ellipsis-free
  const DEFAULT_SPEECH_LINES = {
    daniel_richards: {
      casual: [
        'In since 07:45 and nobody has asked me to fix the LC-MS yet.',
        'Nothing beats a quiet egg and cress triangle at lunch.',
        'Packing up sharp at 17:45 — anything after 18:00 is Peter territory.',
        'Is that Max marker artwork still on Cupboard 6?'
      ],
      bench: [
        'Keeping MES buffer strictly at pH 5.20 so the 40 nm AuNPs stay ruby red.',
        'Pepsin at pH 3.1 first, then thoroughly washed Papain resin.',
        'Never put Trastuzumab Fab on Protein A — VH3 binds straight to resin.',
        'Desalting 6x into LC-MS water before taking this down to LG11.'
      ]
    },
    maximillian_lee: {
      casual: [
        'Anyone got 50 µL of buffered TCEP? Asking for a lazy silverback.',
        'Slow-reduced beans in chorizo fat is genuine Michelin cuisine.',
        'If there is a spider on my 3F chair again I am working from Gordon Street.',
        'Remember when Lemon Boy dropped 14 reduced lemons by the Biotage?'
      ],
      bench: [
        'Slapping the non-reducing gel into Blue Party Mix now.',
        'Checking 150 kDa HHLL rebridged band vs 75 kDa half-antibody.',
        'Running the ~25 A bis-diBrPD azide stapling reaction under Argon.',
        'Keeping TCEP buffered at pH 8.0 in BBS + EDTA so it stays clean.'
      ]
    },
    antoine_maruani: {
      casual: [
        'Who sliced a croissant horizontally like bread?! Calling the French embassy.',
        'Mount 128.40.76.1 remotely before walking three flights to LG1b.',
        '#AskAntoine clinic is open — bring me your cursed LC-MS adducts.',
        'Bonne journée team, let us keep the spectra baseline-resolved.'
      ],
      bench: [
        'Sequential SPAAC first, then CuAAC with 5:1 THPTA to protect thiols.',
        'Packing a quick Sephadex G-25 mini-column inside a cut P2 tip.',
        'Checking Ellman DTNB assay to confirm zero free thiols remain.',
        'Oven-dried flask, Argon purge, dry solvent from Cupboard 1.'
      ]
    },
    andre_shamsabadi: {
      casual: [
        'Quick poll: Gordon coffee right now or suffer for twenty more minutes?',
        'How much entropy did GCSEs waste on all of us honestly?',
        'Has anyone seen my presentation laser clicker up on 3F?',
        'Please tell me Abil did not lock my 700 MHz tube in the fridge again.'
      ],
      bench: [
        '5.7 µL/min on the syringe pump — nobody breathe near the Chudasama hood.',
        'On-water aldehyde plus DIAD hydroacylation ticking along nicely.',
        'Need oven-dried glassware and TBAT under Argon for this -78 °C step.',
        'Waiting for 120 °C VT-NMR to coalesce those hydrazide rotamer humps.'
      ]
    },
    peter_szijj: {
      casual: [
        'Putting Howard Shore Shire theme on the speakers once 18:00 hits.',
        'Prolly fine as long as I do not pipette blue LDS dye into pure Fab.',
        'Nafsika and I holding down Lab 230 for the evening shift.',
        'Anyone got a spare black whiteboard marker before Friday audit?'
      ],
      bench: [
        'Running Trastuzumab, Rituximab and OKT3 Fab digests in parallel.',
        'Keeping S. typhimurium sialidase SPIEDAC click gently at pH 7.0.',
        'Superdex 200 SEC dripping cleanly at 0.4 mL/min.',
        'Casting a 12% gel to check intact 147 kDa bispecific SynAb assembly.'
      ]
    },
    joao_nogueira: {
      casual: [
        '10:27 — Gordon coffee run? Cold triangle sandwiches should be illegal.',
        'Pastel de nata and double espresso solves half the PhD.',
        '20:02 and loading a silica column — pray for my Biotage cartridges.',
        'Vamos Big-Chuds, big Friday audit energy this week.'
      ],
      bench: [
        'Checking Malvern Zetasizer DLS — aiming for PDI under 0.12.',
        'Coupling monoBrPD-PEG2-BCN(endo) onto 11 kDa shark VNAR E4.',
        'Formulating Nile-Red PLGA-PEG-azide nanoparticles dropwise.',
        'Adding 0.05% Tween 80 so TIPS microparticles disperse cleanly.'
      ]
    },
    faiza_javaid: {
      casual: [
        'Guys what is the LG11 Mass Spec door code again? Hands full outside!',
        'My morning train stalled outside Euston again, not late by choice!',
        'Need my A280 numbers checked before 17:00?',
        'Half this chat is beans or Worms ninja ropes and I love it.'
      ],
      bench: [
        'Pre-clicking diBrPD-BCN + MMAE-azide in DMSO before touching IgG4.',
        'IgG4 S228P reduction and PAR 4.0 rebridging looking clean on HIC.',
        'Running Cathepsin B pH 6.5 cleavage and bioassays today.',
        'Checking A280/A335 recovery cleanly on the 2F bench.'
      ]
    },
    calise_bahou: {
      casual: [
        'Look, those reduced bags of lemons were a bargain — Dan bought them!',
        'Just demolished a steak pie, Morale is at 110% right now.',
        'Why does my VivaSpin dilution spreadsheet claim 125% yield again?',
        'Remember to shut the 4 °C fridge in the cold room properly so the seal clicks.'
      ],
      bench: [
        'Reflux with p-TsOH in toluene — never TFA or bromide exchanges out!',
        'Kneeling by the 4 °C fridge for 95% HHLL Trastuzumab homogeneity.',
        'Checking GFP S147C C-S vs C-N cleavability switch on Q-TOF.',
        'Logging 7-day 37 °C human serum stability vs maleimide control.'
      ]
    },
    richard_spears: {
      casual: [
        'Put the kettle on upstairs on 3F — Bettys biscuits in the tin.',
        'Welcome back to Soluble or Not Soluble: spoiler, white precipitate.',
        'Microwaved beans for 3.5 mins; cooking them in a pan unsettles me.',
        'Always disclose 0.08 eq EtOAc honestly on Slide 4 rather than cropping.'
      ],
      bench: [
        'Using bench-stable CDMP at pH 8.0 for Dha — never touch explosive MSH.',
        'Monitoring 4:1 Fab competition and reversible GSH exchange by LC-MS.',
        '8-arm star PEG-SH + 5DiBr hydrogel gelled in under 8 seconds.',
        'Checking clean 600 MHz integration and residual solvent wt%.'
      ]
    },
    marcos_fernandez: {
      casual: [
        'Claire and the Safety Inspector are in KLB #headsup — specs on!',
        'Five out of six of us turned up with identical haircuts again.',
        'Door buzzed. Next time carry your UCL card.',
        'Just smelled diethyl ether fumes along the south-east Baker bay near Cupboard 20.'
      ],
      bench: [
        'Opening Cupboard 5 for 30s — the bleach bath in the Chudasama hood is fresh.',
        'PyBOP self-immolative coumarin and folate SMDC coupling underway.',
        '40 mg/mL HSA stays dark while 5 mM GSH triggers coumarin turn-on.',
        'Quenching all thiol glassware in aqueous hypochlorite immediately.'
      ]
    },
    nafsika_forte: {
      casual: [
        'In Lab 230 until 19:15 — shout if anyone needs a flask pulled off heat.',
        'First-aid kit is stocked if anyone gets a dry-ice nick.',
        'Best twenty minutes of the day is away from the rotavaps at Gordon.'
      ],
      bench: [
        'Setting up bromomaleimide selective disulfide rebridging.',
        'Checking anhydrous DMF stocks and Baker fridge aliquots.',
        'Running Baker bay SDS-PAGE QC lanes next to Archie.'
      ]
    },
    archie_wall: {
      casual: [
        'The shared centrifuge is balanced and free in five minutes.',
        'Got two spare lanes on the right side of my 12% gel if anyone needs them.',
        'Büchi vacuum is pulling strong today.'
      ],
      bench: [
        'Spinning down albumin-maleimide conjugates in the microcentrifuge.',
        'Staining non-reducing SDS-PAGE bands on the Baker bench.',
        'Evaporating volatile organic fractions cleanly on Büchi 2.'
      ]
    },
    marco_sabatini: {
      casual: [
        'Tiny spritz of Sabatini by Sabatini and even Kersti smiles.',
        'Treat the heirloom TLC jar with museum reverence please.',
        'Coffee and crisp chromatography make a fine afternoon.'
      ],
      bench: [
        'Setting up catalytic B(OMe)3 direct amidation in the Sheppard bay.',
        'Checking razor-sharp Rf separation on 254 nm UV silica.',
        'Drying 4 A molecular sieves before starting the condensation.'
      ]
    },
    charlotte_coomber: {
      casual: [
        'SO AT THE WEEKEND WE WALKED ALL THE WAY ACROSS LONDON AND—',
        'Doing a £2 card collection at the Sheppard desks if anyone has coins!',
        'Need a working black whiteboard marker or fresh TLC capillary?'
      ],
      bench: [
        'Grabbing borate coupling reagents from Cupboard 14.',
        'Screening aqueous catalytic amide conditions in the Sheppard hood.',
        'Pulling solvent off on the rotary evaporator before 17:30.'
      ]
    },
    vijay_chudasama: {
      casual: [
        'Ten minutes of proper coffee clears the head for sharper science.',
        'Good energy across Lab 230 today — keep Friday 09:00 in sight.',
        'How is the 4-slide storyline shaping up this week?'
      ],
      bench: [
        'Where is the unreduced control lane on that SDS-PAGE gel?',
        'Make sure the HRMS and NMR controls are completely watertight.',
        'Good momentum — crisp data beats hand-waving every time.'
      ]
    },
    jamie_baker: {
      casual: [
        'Safety specs on as soon as you step past the Lab 230 door.',
        'Keep the shared central balance table spotless after weighing.',
        'Great seeing Baker and Chudasama bays running smoothly together.'
      ],
      bench: [
        'Checking maleimide-thiol hydrolysis kinetics across pH 7.4.',
        'Ensuring every Winchester in the bay is capped and labelled.'
      ]
    },
    tom_sheppard: {
      casual: [
        'Checking in on the Sheppard hoods — hope the Biotage queue is clear.',
        "Bumped into half of KLB in the Gordon's coffee queue earlier."
      ],
      bench: [
        'Dry glassware and active sieves make or break borate amidations.',
        'Clean baseline NMR before scaling up the amidation.'
      ]
    },
    kersti_karu: {
      casual: [
        'Log onto uplc2011 PC properly and write your sample code in the book.',
        'Please do not inject PEG or PBS buffer into my Q-TOF source.'
      ],
      bench: [
        'Flushing PLRP-S column mobile phase — keep samples 10x desalted.',
        'Deconvoluting protein charge envelopes on Agilent MassHunter.'
      ]
    },
    abil_aliev: {
      casual: [
        'Collect NMR tubes promptly or they go in the Sample Fridge — £130 fine!',
        'Check 128.40.76.1 remotely before walking down to LG1b.'
      ],
      bench: [
        'Minimum 4.0 cm deuterated solvent depth for 700 MHz Neo shimming.',
        'Checking VT-NMR nitrogen flow and field lock stability.'
      ]
    },
    claire_carmalt: {
      casual: [
        'Conducting a quick Departmental Safety walkthrough of KLB 2nd Floor.',
        'Good to see safety specs and lowered fume hood sashes.'
      ],
      bench: [
        'Inspecting COSHH cupboards, fire exits, and solvent storage.',
        'Checking waste Winchester caps and spill kit readiness.'
      ]
    },
    safety_inspector: {
      casual: [
        'Checking eye protection, Fire Exit clearance, and silica waste lids.',
        'Keep the left fire exit corridor unobstructed at all times.'
      ],
      bench: [
        'Logging fume hood sash heights and bleach bath status.',
        'Verifying fire extinguisher placement along the west bench wall.'
      ]
    },
    alex_king: {
      casual: [
        "Hi there, are you guys heading to Gordon's Café later? Where is everyone?",
        'I was just passing the second floor corridor around 17:18.'
      ],
      bench: [
        'Waiting quietly by the KLB 2nd floor corridor door.'
      ]
    }
  };

  // Fallback social group huddles (up to 3 speakers, klb_2f / klb_3f / gordons_cafe, emoji-free)
  const DEFAULT_GROUP_HUDDLES = [
    {
      id: 'huddle_2f_adduct',
      roomId: 'klb_2f',
      lines: [
        { speakerId: 'daniel_richards', text: 'Got a weird +69 Da peak on the Waters Xevo trace again.' },
        { speakerId: 'antoine_maruani', text: 'Classic acetonitrile adduct — wash once more with water on VivaSpin.' },
        { speakerId: 'marcos_fernandez', text: 'And do not tell Kersti until it is 10x desalted.' }
      ]
    },
    {
      id: 'huddle_2f_fridge',
      roomId: 'klb_2f',
      lines: [
        { speakerId: 'calise_bahou', text: 'Running my Herceptin rebridging right at 4 °C for 95% HHLL.' },
        { speakerId: 'maximillian_lee', text: 'Compare that with my 25 A bis-PD linker on Blue Party Mix!' },
        { speakerId: 'peter_szijj', text: 'Keep both gels on the lightbox so we can check the 150 kDa band.' }
      ]
    },
    {
      id: 'huddle_2f_cupboard5',
      roomId: 'klb_2f',
      lines: [
        { speakerId: 'marcos_fernandez', text: 'Cracking Cupboard 5 for 20s — bleach bath is fresh and ready.' },
        { speakerId: 'richard_spears', text: 'Appreciate the warning, my aryl-thiol controls are capped tight.' },
        { speakerId: 'andre_shamsabadi', text: 'Syringe pump is humming, keeping the sash pulled right down.' }
      ]
    },
    {
      id: 'huddle_2f_baker_gel',
      roomId: 'klb_2f',
      lines: [
        { speakerId: 'archie_wall', text: 'Got two empty wells on my 12% gel if anyone wants a quick QC lane.' },
        { speakerId: 'calise_bahou', text: 'Yes please Archie — got a fresh 4 °C Herceptin aliquot ready.' },
        { speakerId: 'nafsika_forte', text: 'Just keep the salt low so the bands do not smile into lane 8!' }
      ]
    },
    {
      id: 'huddle_2f_sheppard_tlc',
      roomId: 'klb_2f',
      lines: [
        { speakerId: 'marco_sabatini', text: 'My heirloom TLC jar gives razor-straight Rf separation at 254 nm.' },
        { speakerId: 'andre_shamsabadi', text: 'Best piece of glassware in Lab 230, treated like museum crystal.' },
        { speakerId: 'charlotte_coomber', text: 'Has anyone seen my black marker before Friday Group Meeting?' }
      ]
    },
    {
      id: 'huddle_2f_tcep',
      roomId: 'klb_2f',
      lines: [
        { speakerId: 'maximillian_lee', text: 'Anyone weighed fresh 10 mM TCEP at pH 8.0 yet?' },
        { speakerId: 'antoine_maruani', text: 'Top shelf of my rack in BBS + EDTA. Never use unbuffered water.' },
        { speakerId: 'faiza_javaid', text: 'Grabbing 30 µL for my IgG4 reduction too, legends!' }
      ]
    },
    {
      id: 'huddle_2f_pnp',
      roomId: 'klb_2f',
      lines: [
        { speakerId: 'joao_nogueira', text: 'VNAR-PLGA nanoparticles hit PDI 0.098 on the Zetasizer!' },
        { speakerId: 'daniel_richards', text: 'Sub-0.10 PDI on polymeric NPs is proper clean formulation, fair play.' },
        { speakerId: 'faiza_javaid', text: 'Save that figure straight into Slide 3 before Friday!' }
      ]
    },
    {
      id: 'huddle_3f_kettle',
      roomId: 'klb_3f',
      lines: [
        { speakerId: 'richard_spears', text: 'Kettle is boiled upstairs and I opened the Bettys biscuit tin.' },
        { speakerId: 'andre_shamsabadi', text: 'Legend Rich — also spotted my laser clicker behind the tea caddy.' },
        { speakerId: 'peter_szijj', text: 'Quick tea break then back to finishing Supporting Information schemes.' }
      ]
    },
    {
      id: 'huddle_3f_croissant',
      roomId: 'klb_3f',
      lines: [
        { speakerId: 'antoine_maruani', text: 'Someone put a horizontally sliced ham croissant in the 3F microwave.' },
        { speakerId: 'calise_bahou', text: 'Pairs delightfully with a three quid triangle meal deal mate.' },
        { speakerId: 'joao_nogueira', text: 'Cold wet triangle bread should genuinely be banned by Parliament.' }
      ]
    },
    {
      id: 'huddle_3f_slides',
      roomId: 'klb_3f',
      lines: [
        { speakerId: 'daniel_richards', text: 'Thursday sanity check: four real figures ready for Vijay tomorrow?' },
        { speakerId: 'maximillian_lee', text: 'Wait until I clear that giant Bloomsbury spider off my office chair first.' },
        { speakerId: 'richard_spears', text: 'Remember: disclose residual EtOAc honestly on Slide 4!' }
      ]
    },
    {
      id: 'huddle_cafe_catchup',
      roomId: 'gordons_cafe',
      lines: [
        { speakerId: 'joao_nogueira', text: 'Double espresso and a warm pastel de nata beats Lab 230 fumes.' },
        { speakerId: 'faiza_javaid', text: 'Iced oat latte is the only thing powering my morning train.' },
        { speakerId: 'nafsika_forte', text: 'Twenty quiet minutes here resets the whole afternoon.' }
      ]
    },
    {
      id: 'huddle_cafe_debrief',
      roomId: 'gordons_cafe',
      lines: [
        { speakerId: 'calise_bahou', text: 'Honestly a Gordon flat white fixes every Biotage setback.' },
        { speakerId: 'daniel_richards', text: 'Just keep an eye on the clock so nothing boils dry back in 230.' }
      ]
    }
  ];

  const DEFAULT_BIRTHDAY_GREETINGS = {
    whatsapp: [
      'Happy birthday {shortName} ({initials})! Cake and Gordon pastries on the 3F desk later!',
      'Big happy birthday to {name} today! Nobody tell Vijay how many candles are on the 3F cake.'
    ],
    npcToTarget: {
      default: [
        'Happy birthday {target}! Hope your NMR and LC-MS stay spotless today.',
        'Happy birthday {initials}! Saving you an almond croissant from Gordon\'s later.'
      ]
    },
    replies: [
      'Cheers {greeter}! Appreciate it, saving you a slice of cake on 3F later.',
      'Thanks {greeter}! Just praying my Friday slides behave as a birthday present.'
    ]
  };

  const DEFAULT_SAMPLE_RUN_LINES = {
    nmr: {
      ask: [
        'Heading down to LG1b NMR — {target}, got any tubes you need dropped on the 600 MHz?',
        'Walking down to Abil in LG1b now, {target} — want me to submit an NMR tube for you?'
      ],
      yes: [
        'Legend {sender}, yes please — grab the CDCl3 tube in the rack by my hood!',
        'Yes please {sender}, tube is labelled in my rack — watch out for Abil!'
      ],
      no: [
        'All sorted for now {sender}, cheers for asking though!',
        'Just pulled mine earlier {sender}, appreciate the shout though!'
      ]
    },
    ms: {
      ask: [
        'Heading down to LG11 Mass Spec — {target}, want me to drop a desalted vial on the Q-TOF?',
        'Nipping down to Kersti in LG11, {target} — got any LC-MS vials ready?'
      ],
      yes: [
        'Lifesaver {sender} — 10x desalted vial is right here on the bench, cheers!',
        'Yes please {sender}, already logged on uplc2011 — grab it off my rack!'
      ],
      no: [
        'Still desalting on VivaSpin {sender}, thanks for checking though!',
        'All good for LG11 right now {sender}, catch you upstairs!'
      ]
    }
  };

  // Authentic workflows for non-playable lab neighbours (and Archie fallback)
  const NEIGHBOUR_WORKFLOWS = {
    nafsika_forte: [
      { title: 'Maleimide Stock Prep', roomId: 'klb_2f', stationTypes: ['fumehood'], group: 'baker', mins: 28 },
      { title: 'Herceptin Fab Reduction', roomId: 'klb_2f', stationTypes: ['tcep_bench', 'lab_bench'], group: 'baker', mins: 30 },
      { title: 'Baker Bench Data & Write-Up', roomId: 'klb_2f', stationTypes: ['writeup_desk'], group: 'baker', mins: 32 },
      { title: 'Anhydrous DMF Coupling', roomId: 'klb_2f', stationTypes: ['fumehood', 'buchi'], group: 'baker', mins: 32 },
      { title: 'Baker SDS-PAGE QC', roomId: 'klb_2f', stationTypes: ['gel_tank', 'centrifuge'], group: 'baker', mins: 24 },
      { title: 'Baker Write-Up & Safety Log', roomId: 'klb_3f', stationTypes: ['writeup_desk'], group: 'none', mins: 34 }
    ],
    archie_wall: [
      { title: 'Bromomaleimide Albumin Rxn', roomId: 'klb_2f', stationTypes: ['fumehood'], group: 'baker', mins: 30 },
      { title: 'VivaSpin Desalting', roomId: 'klb_2f', stationTypes: ['centrifuge'], group: 'baker', mins: 20 },
      { title: '12% Non-Reducing Gel', roomId: 'klb_2f', stationTypes: ['gel_tank'], group: 'baker', mins: 25 },
      { title: 'Büchi Solvent Evaporation', roomId: 'klb_2f', stationTypes: ['buchi'], group: 'none', mins: 22 },
      { title: 'Baker Desk Data Review', roomId: 'klb_2f', stationTypes: ['writeup_desk'], group: 'baker', mins: 22 }
    ],
    marco_sabatini: [
      { title: 'Borate Amidation Weighing', roomId: 'klb_2f', stationTypes: ['balance_table'], group: 'sheppard', mins: 18 },
      { title: 'B(OMe)3 Catalytic Amidation', roomId: 'klb_2f', stationTypes: ['fumehood'], group: 'sheppard', mins: 34 },
      { title: 'Heirloom TLC Check', roomId: 'klb_2f', stationTypes: ['tlc_station'], group: 'none', mins: 14 },
      { title: 'Sheppard Bench Write-Up', roomId: 'klb_2f', stationTypes: ['writeup_desk'], group: 'sheppard', mins: 30 },
      { title: 'Biotage Flash Column', roomId: 'klb_2f', stationTypes: ['biotage'], group: 'none', mins: 26 },
      { title: 'Sheppard NMR Processing', roomId: 'klb_3f', stationTypes: ['writeup_desk'], group: 'none', mins: 34 }
    ],
    charlotte_coomber: [
      { title: 'Cupboard 14 Borate Prep', roomId: 'klb_2f', stationTypes: ['fumehood'], group: 'sheppard', mins: 26 },
      { title: 'Aqueous Catalytic Screen', roomId: 'klb_2f', stationTypes: ['fumehood'], group: 'sheppard', mins: 32 },
      { title: 'Rotary Evaporator Workup', roomId: 'klb_2f', stationTypes: ['buchi'], group: 'none', mins: 22 },
      { title: 'Sheppard Bench Write-Up', roomId: 'klb_2f', stationTypes: ['writeup_desk'], group: 'sheppard', mins: 30 },
      { title: 'Sheppard 3F Report & Lit Review', roomId: 'klb_3f', stationTypes: ['writeup_desk'], group: 'none', mins: 34 },
      { title: 'Gordon Afternoon Break', roomId: 'gordons_cafe', stationTypes: ['cafe_table', 'cafe_counter'], group: 'none', mins: 23 }
    ]
  };

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function getBigChudsIds() {
    if (Array.isArray(window.KLB?.BIG_CHUDS_IDS) && window.KLB.BIG_CHUDS_IDS.length) {
      return window.KLB.BIG_CHUDS_IDS;
    }
    return DEFAULT_BIG_CHUDS_IDS;
  }

  function getPreferencesSpec(charMeta) {
    if (!charMeta) return { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' };
    if (charMeta.preferences && typeof charMeta.preferences === 'object') {
      return {
        pref: charMeta.preferences.pref || 'balanced',
        requiresCaffeine: Boolean(charMeta.preferences.requiresCaffeine),
        label: charMeta.preferences.label || 'Balanced'
      };
    }
    const def = DEFAULT_PREFERENCES[charMeta.id];
    return def ? { ...def } : { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' };
  }

  function resolveMeterTarget(target) {
    if (!target || typeof target !== 'object') return null;
    if (target.sim && typeof target.sim === 'object') return target.sim;
    return target;
  }

  function getViewRoom(state) {
    if (!state) return 'klb_2f';
    if (state.spectatorMode) return state.cameraRoomId || 'klb_2f';
    return state.player?.roomId || 'klb_2f';
  }

  function getStorage() {
    try {
      if (typeof localStorage !== 'undefined' && localStorage) return localStorage;
      if (typeof window !== 'undefined' && window?.localStorage) return window.localStorage;
    } catch (_) {}
    return null;
  }

  function loadArchive() {
    try {
      const storage = getStorage();
      const raw = storage?.getItem?.(ARCHIVE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      clearedChars: {},
      discoveredEvents: {},
      unlockedMutators: {
        vijays_not_in: false,
        lcms_chaos: false,
        eternal_heatwave: false,
        infinite_espresso: false,
        strict_coshh: false
      },
      totalRuns: 0,
      bestScore: 0
    };
  }

  function saveArchive(arch) {
    try {
      const storage = getStorage();
      storage?.setItem?.(ARCHIVE_KEY, JSON.stringify(arch));
    } catch (_) {}
  }

  function reconcileArchive(mutatorFn) {
    const arch = loadArchive();
    if (typeof mutatorFn === 'function') mutatorFn(arch);
    saveArchive(arch);
    return arch;
  }

  function saveRunSnapshot(state) {
    if (!state || state.spectatorMode || state.gameOver || state._headlessVerify) return false;
    const storage = getStorage();
    if (!storage) return false;
    const charId = state.player?.id || state.charId;
    if (!charId || typeof state.dayIdx !== 'number' || !state.player || !state.npcs) return false;
    try {
      const copy = {};
      for (const [k, v] of Object.entries(state)) {
        if (k === '_activeCallbacks' || k === '_tickingRealTime' || typeof v === 'function') continue;
        copy[k] = v;
      }
      copy.charId = charId;
      copy.version = 1;
      copy.savedAt = Date.now();
      const serialized = JSON.stringify(copy, (key, val) => {
        if (key === '_activeCallbacks' || key === '_tickingRealTime' || typeof val === 'function') return undefined;
        return val;
      });
      storage.setItem(ACTIVE_RUN_KEY, serialized);
      return true;
    } catch (_) {
      return false;
    }
  }

  function loadRunSnapshot() {
    const storage = getStorage();
    if (!storage) return null;
    try {
      const raw = storage.getItem(ACTIVE_RUN_KEY);
      if (!raw) return null;
      const snap = JSON.parse(raw);
      if (!snap || typeof snap !== 'object') return null;
      const charId = snap.charId || snap.player?.id;
      if (
        typeof charId !== 'string' ||
        !charId ||
        typeof snap.dayIdx !== 'number' ||
        !Number.isFinite(snap.dayIdx) ||
        snap.dayIdx < 0 ||
        snap.dayIdx > 4 ||
        !snap.player ||
        typeof snap.player !== 'object' ||
        typeof snap.player.id !== 'string' ||
        !snap.npcs ||
        typeof snap.npcs !== 'object' ||
        Array.isArray(snap.npcs)
      ) {
        return null;
      }
      snap.charId = charId;
      return snap;
    } catch (_) {
      return null;
    }
  }

  function clearRunSnapshot() {
    const storage = getStorage();
    if (!storage) return false;
    try {
      storage.removeItem(ACTIVE_RUN_KEY);
      return true;
    } catch (_) {
      return false;
    }
  }

  const DIALOGUE_HISTORY_KEY = 'klb_dialogue_history_v1';
  let _dialogueHistoryCache = null;

  function getDialogueStorage() {
    try {
      if (typeof localStorage !== 'undefined' && localStorage) return localStorage;
      if (typeof window !== 'undefined' && window?.localStorage) return window.localStorage;
    } catch (_) {}
    return null;
  }

  function loadDialogueHistory() {
    if (_dialogueHistoryCache && typeof _dialogueHistoryCache === 'object') {
      if (!_dialogueHistoryCache.pools || typeof _dialogueHistoryCache.pools !== 'object') {
        _dialogueHistoryCache.pools = {};
      }
      return _dialogueHistoryCache;
    }
    let parsed = null;
    try {
      const storage = getDialogueStorage();
      const raw = storage?.getItem?.(DIALOGUE_HISTORY_KEY);
      if (raw) parsed = JSON.parse(raw);
    } catch (_) {}
    if (!parsed || typeof parsed !== 'object' || !parsed.pools || typeof parsed.pools !== 'object') {
      parsed = { pools: {} };
    }
    _dialogueHistoryCache = parsed;
    return _dialogueHistoryCache;
  }

  function saveDialogueHistory(hist) {
    const normalized = (hist && typeof hist === 'object') ? hist : { pools: {} };
    if (!normalized.pools || typeof normalized.pools !== 'object') {
      normalized.pools = {};
    }
    _dialogueHistoryCache = normalized;
    try {
      const storage = getDialogueStorage();
      storage?.setItem?.(DIALOGUE_HISTORY_KEY, JSON.stringify(normalized));
    } catch (_) {}
  }

  function resetDialogueHistory() {
    _dialogueHistoryCache = null;
    try {
      const storage = getDialogueStorage();
      storage?.removeItem?.(DIALOGUE_HISTORY_KEY);
    } catch (_) {}
  }

  function getCurrentDialogueVibe(state) {
    if (!state) return 'midday';
    const dayIdx = Number(state.dayIdx ?? 0);
    const hour = Number.isFinite(Number(state.timeMins)) ? Number(state.timeMins) / 60 : 12;
    if (dayIdx === 0 && hour < 12) return 'monday';
    if ((dayIdx === 3 && hour >= 13) || dayIdx === 4) return 'late_week';
    if (hour < 11) return 'morning';
    if (hour >= 17) return 'evening';
    return 'midday';
  }

  function pickFromShuffleBag(state, poolKey, items, getIdFn, opts = {}) {
    if (!Array.isArray(items) || !items.length) return null;
    const isHeadless = Boolean(state && state._headlessVerify);
    const hist = isHeadless
      ? (state._runDialogueHistory || (state._runDialogueHistory = { pools: {} }))
      : loadDialogueHistory();
    if (!hist.pools || typeof hist.pools !== 'object') hist.pools = {};

    let entry = hist.pools[poolKey];
    if (!entry || typeof entry !== 'object') {
      entry = { seen: [], last: null };
      hist.pools[poolKey] = entry;
    }
    if (!Array.isArray(entry.seen)) entry.seen = [];

    const idOf = (it, idx) => {
      const raw = getIdFn ? getIdFn(it, idx) : it;
      return raw == null ? String(idx) : String(raw);
    };
    const entries = items.map((item, idx) => ({ item, idx, id: idOf(item, idx) }));

    const seenSet = new Set(entry.seen);
    let unseen = entries.filter(e => !seenSet.has(e.id));

    if (unseen.length === 0) {
      const poolIds = new Set(entries.map(e => e.id));
      entry.seen = entry.seen.filter(id => !poolIds.has(id));
      unseen = entries.filter(e => e.id !== entry.last);
      if (!unseen.length) unseen = entries;
    }

    let pool = unseen;
    if (Array.isArray(opts.preferFns) && opts.preferFns.length) {
      for (const fn of opts.preferFns) {
        if (typeof fn !== 'function') continue;
        const preferred = unseen.filter(e => fn(e.item, e.idx));
        if (preferred.length) {
          pool = preferred;
          break;
        }
      }
    } else if (typeof opts.preferFn === 'function') {
      const preferred = unseen.filter(e => opts.preferFn(e.item, e.idx));
      if (preferred.length) pool = preferred;
    }

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (!entry.seen.includes(chosen.id)) {
      entry.seen.push(chosen.id);
    }
    entry.last = chosen.id;

    if (!isHeadless) {
      saveDialogueHistory(hist);
    }
    return chosen.item;
  }

  function getTimeHours(state) {
    if (!state || !Number.isFinite(Number(state.timeMins))) return 12;
    return Number(state.timeMins) / 60;
  }

  function extractDialogueText(itemOrText) {
    if (typeof itemOrText === 'string') return itemOrText;
    if (!itemOrText || typeof itemOrText !== 'object') return '';
    const parts = [];
    if (typeof itemOrText.text === 'string') parts.push(itemOrText.text);
    if (typeof itemOrText.template === 'string') parts.push(itemOrText.template);
    if (typeof itemOrText.replyText === 'string') parts.push(itemOrText.replyText);
    const seq = itemOrText.turns || itemOrText.lines || itemOrText.exchanges;
    if (Array.isArray(seq)) {
      for (const entry of seq) {
        if (typeof entry === 'string') parts.push(entry);
        else if (entry && typeof entry.text === 'string') parts.push(entry.text);
      }
    }
    return parts.join(' ');
  }

  const RX_GATE_MORNING = /\b(morning train|tube in|northern line|just got in|commute in|coming in late|before noon|this morning|start of the day|morning espresso|powering my morning|ten twenty-seven|before ten thirty|ten-fifteen|before the afternoon rush)\b/i;
  const RX_GATE_LUNCH = /\b(lunchtime|grab lunch|off to lunch|pret|gordon's lunch|lunch break)\b/i;
  const RX_GATE_THREE_PM = /\b(three pm|three o'clock|half three|3 pm|3 o'clock)\b/i;
  const RX_GATE_AFTERWORK = /\b(after work|pint later|down the pub|institute of education bar|head home|heading home|going home|packing up|called it a day|see you tomorrow|tonight|this evening)\b|\b(?:past three|after 3)(?!(?:\s*(?:hours?|hrs?|mins?|minutes?|days?|weeks?|%|°|\.\d)))\b/i;
  const RX_GATE_CURFEW = /\b(?:curfew|building closes|locking up|late shift)\b|\bpast (?:5|five)(?!(?:\s*(?:mins?|minutes?|secs?|seconds?|hours?|hrs?|days?|weeks?|%|°|\.\d)))\b/i;

  function isDialogueAllowedAtTime(itemOrText, hourDecimal, dayIdx = null) {
    const h = typeof hourDecimal === 'number' && Number.isFinite(hourDecimal)
      ? hourDecimal
      : (hourDecimal && typeof hourDecimal === 'object' ? getTimeHours(hourDecimal) : 12);

    if (itemOrText && typeof itemOrText === 'object') {
      if (itemOrText.minHour != null && h < Number(itemOrText.minHour)) return false;
      if (itemOrText.maxHour != null && h >= Number(itemOrText.maxHour)) return false;
      if (dayIdx != null && Number.isFinite(Number(dayIdx))) {
        const d = Number(dayIdx);
        if (itemOrText.dayOnly != null && d !== Number(itemOrText.dayOnly)) return false;
        if (itemOrText.minDay != null && d < Number(itemOrText.minDay)) return false;
        if (itemOrText.maxDay != null && d > Number(itemOrText.maxDay)) return false;
      }
    }

    const txt = extractDialogueText(itemOrText);
    if (!txt) return true;
    if (h >= 12.0 && RX_GATE_MORNING.test(txt)) return false;
    if ((h < 11.4 || h > 14.25) && RX_GATE_LUNCH.test(txt)) return false;
    if (h < 14.5 && RX_GATE_THREE_PM.test(txt)) return false;
    if (h < 15.0 && RX_GATE_AFTERWORK.test(txt)) return false;
    if (h < 16.5 && RX_GATE_CURFEW.test(txt)) return false;
    return true;
  }

  function pickQuoteForNpc(state, npcId) {
    const meta = window.KLB.CAST_BY_ID?.[npcId];
    const quotes = Array.isArray(meta?.quotes) ? meta.quotes : [];
    if (!quotes.length) return null;
    const curHour = getTimeHours(state);
    const dayIdx = state?.dayIdx ?? null;
    const timeFiltered = quotes.filter(q => isDialogueAllowedAtTime(q, curHour, dayIdx));
    const pool = timeFiltered.length ? timeFiltered : quotes;
    const picked = pickFromShuffleBag(
      state,
      'quotes_' + npcId,
      pool,
      q => (typeof q === 'string' ? q : (q?.text || JSON.stringify(q)))
    );
    if (!picked) return null;
    return typeof picked === 'string' ? picked : (picked.text || null);
  }

  function formatClock(dayIdx, minsFromMidnight) {
    const d = DAYS[Math.min(4, Math.max(0, dayIdx))] || `D${dayIdx + 1}`;
    const hh = String(Math.floor(minsFromMidnight / 60) % 24).padStart(2, '0');
    const mm = String(Math.floor(minsFromMidnight % 60)).padStart(2, '0');
    return `${d} ${hh}:${mm}`;
  }

  function formatHHMM(minsFromMidnight) {
    const hh = String(Math.floor(minsFromMidnight / 60) % 24).padStart(2, '0');
    const mm = String(Math.floor(minsFromMidnight % 60)).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  // ==================== 1. ENTITY COLLISION, SPATIAL HELPERS & BFS ====================
  const _roomChokepointWeakCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;

  function isCellWalkable(roomId, gx, gy, fireAlarmActive = false) {
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    if (!rm || gx < 0 || gy < 0 || gx >= rm.w || gy >= rm.h) return false;
    const t = rm.tiles[gy]?.[gx];
    if (!WALKABLE_TILES.has(t)) return false;
    // Tile 8 (Fire Exit (9,2)) is closed unless fireAlarmActive is true
    if (t === 8 && !fireAlarmActive) return false;

    for (const o of rm.objects || []) {
      if (NON_BLOCKING_OBJS.has(o.type)) continue;
      if (gx >= o.x && gx < o.x + o.w && gy >= o.y && gy < o.y + o.h) return false;
    }
    return true;
  }

  function getRoomChokepointSet(roomId) {
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    if (!rm) return null;
    if (rm._chokepointCache instanceof Set) return rm._chokepointCache;
    if (_roomChokepointWeakCache && _roomChokepointWeakCache.has(rm)) {
      return _roomChokepointWeakCache.get(rm);
    }

    const set = new Set();
    const doorwayCells = [];
    for (let cy = 0; cy < rm.h; cy++) {
      const row = rm.tiles?.[cy];
      if (!row) continue;
      for (let cx = 0; cx < rm.w; cx++) {
        if (row[cx] === 7) doorwayCells.push({ x: cx, y: cy });
      }
    }

    for (let cy = 0; cy < rm.h; cy++) {
      for (let cx = 0; cx < rm.w; cx++) {
        const tile = rm.tiles?.[cy]?.[cx];
        if (tile === 7) {
          set.add(`${cx},${cy}`);
          continue;
        }
        if (!isCellWalkable(roomId, cx, cy, false)) continue;
        const nearDoor = doorwayCells.some(d => (Math.abs(d.x - cx) + Math.abs(d.y - cy)) <= 1);
        if (nearDoor) {
          set.add(`${cx},${cy}`);
          continue;
        }
        const northWalk = isCellWalkable(roomId, cx, cy - 1, false);
        const southWalk = isCellWalkable(roomId, cx, cy + 1, false);
        const eastWalk = isCellWalkable(roomId, cx + 1, cy, false);
        const westWalk = isCellWalkable(roomId, cx - 1, cy, false);
        if ((!northWalk && !southWalk) || (!eastWalk && !westWalk)) {
          set.add(`${cx},${cy}`);
        }
      }
    }

    if (!Object.isFrozen(rm) && Object.isExtensible(rm)) {
      rm._chokepointCache = set;
    } else if (_roomChokepointWeakCache) {
      _roomChokepointWeakCache.set(rm, set);
    }
    return set;
  }

  function isChokepointOrDoorway(roomId, x, y) {
    const set = getRoomChokepointSet(roomId);
    if (!set) return false;
    return set.has(`${Math.round(x)},${Math.round(y)}`);
  }

  function findDeskChair(roomId, deskObj) {
    if (!roomId || !deskObj) return null;
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    if (!rm || !Array.isArray(rm.objects)) return null;
    const chairs = rm.objects.filter(o => o && o.type === 'chair');
    if (!chairs.length) return null;

    if (deskObj.id) {
      const exact = chairs.find(c => c.deskId && c.deskId === deskObj.id);
      if (exact) return exact;
    }

    const minX = deskObj.x;
    const maxX = deskObj.x + Math.max(1, deskObj.w || 1) - 1;
    const minY = deskObj.y;
    const maxY = deskObj.y + Math.max(1, deskObj.h || 1) - 1;
    const deskCenterX = (minX + maxX) * 0.5;
    const deskCenterY = (minY + maxY) * 0.5;

    let best = null;
    let bestScore = Infinity;
    for (const c of chairs) {
      if (c.group !== 'desk_chair') continue;
      const cx = clamp(c.x, minX, maxX);
      const cy = clamp(c.y, minY, maxY);
      const manhattan = Math.abs(c.x - cx) + Math.abs(c.y - cy);
      if (manhattan <= 1) {
        const centerDist = Math.hypot(c.x - deskCenterX, c.y - deskCenterY);
        if (centerDist < bestScore) {
          bestScore = centerDist;
          best = c;
        }
      }
    }
    return best;
  }

  const getDeskChairForObj = findDeskChair;

  function isNpcOnChair(npc) {
    if (!npc || !npc.roomId || npc.roomId === 'offsite') return false;
    const rm = window.KLB.WORLD_MAPS?.rooms?.[npc.roomId];
    if (!rm || !Array.isArray(rm.objects)) return false;
    const rx = Math.round(npc.x);
    const ry = Math.round(npc.y);
    return rm.objects.some(
      o => o && o.type === 'chair' && rx >= o.x && rx < o.x + (o.w || 1) && ry >= o.y && ry < o.y + (o.h || 1)
    );
  }

  function isOccupiedByCharacter(state, roomId, fx, fy, ignoreId = null, minDist = 0.50) {
    if (!state || !roomId) return false;
    if (!state.spectatorMode && state.player && state.player.roomId === roomId && state.player.id !== ignoreId) {
      if (Math.hypot(state.player.x - fx, state.player.y - fy) < minDist) return true;
    }
    const npcs = state.npcs || {};
    for (const n of Object.values(npcs)) {
      if (!n || n.roomId !== roomId || n.id === ignoreId) continue;
      if (Math.hypot(n.x - fx, n.y - fy) < minDist) return true;
    }
    return false;
  }

  function isOccupiedByStationaryCharacter(state, roomId, fx, fy, ignoreId = null, minDist = 0.48) {
    if (!state || !roomId) return false;
    if (
      !state.spectatorMode &&
      state.player &&
      state.player.roomId === roomId &&
      state.player.id !== ignoreId &&
      !state.player.isMoving
    ) {
      if (Math.hypot(state.player.x - fx, state.player.y - fy) < minDist) return true;
    }
    const npcs = state.npcs || {};
    for (const n of Object.values(npcs)) {
      if (!n || n.roomId !== roomId || n.id === ignoreId) continue;
      if (n.path && n.path.length > 0) continue;
      if (Math.hypot(n.x - fx, n.y - fy) < minDist) return true;
    }
    return false;
  }

  function findFreeWalkableNear(state, roomId, gx, gy, ignoreId = null, allowOrigin = true, opts = {}) {
    const ox = Math.round(gx);
    const oy = Math.round(gy);
    const alarmOn = Boolean(state?.fireAlarm?.active);
    const allowChokepoints = Boolean(opts && opts.allowChokepoints);
    const isClean = (x, y) => allowChokepoints || !isChokepointOrDoorway(roomId, x, y);

    let fallback = null;
    const consider = (x, y) => {
      if (!isCellWalkable(roomId, x, y, alarmOn)) return null;
      if (isOccupiedByCharacter(state, roomId, x, y, ignoreId, 0.50)) return null;
      if (isClean(x, y)) return { x, y };
      if (!fallback) fallback = { x, y };
      return null;
    };

    if (allowOrigin) {
      const hit = consider(ox, oy);
      if (hit) return hit;
    }

    const dirs = [
      [0, 1], [-1, 0], [1, 0], [0, -1],
      [-1, 1], [1, 1], [-1, -1], [1, -1]
    ];

    for (let i = 0; i < 4; i++) {
      const hit = consider(ox + dirs[i][0], oy + dirs[i][1]);
      if (hit) return hit;
    }

    const q = [{ x: ox, y: oy }];
    const seen = new Set([`${ox},${oy}`]);
    let visited = 0;
    while (q.length && visited < 72) {
      const cur = q.shift();
      visited++;
      for (let i = 0; i < 4; i++) {
        const nx = cur.x + dirs[i][0];
        const ny = cur.y + dirs[i][1];
        const key = `${nx},${ny}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
        if (!rm || nx < 0 || ny < 0 || nx >= rm.w || ny >= rm.h) continue;
        if (isCellWalkable(roomId, nx, ny, alarmOn)) {
          if (!isOccupiedByCharacter(state, roomId, nx, ny, ignoreId, 0.50)) {
            if (isClean(nx, ny)) return { x: nx, y: ny };
            if (!fallback) fallback = { x: nx, y: ny };
          }
          q.push({ x: nx, y: ny });
        }
      }
    }

    for (let i = 4; i < dirs.length; i++) {
      const hit = consider(ox + dirs[i][0], oy + dirs[i][1]);
      if (hit) return hit;
    }

    if (fallback) return fallback;
    return allowOrigin && isCellWalkable(roomId, ox, oy, alarmOn) ? { x: ox, y: oy } : null;
  }

  function findAdjacentWalkable(roomId, obj) {
    if (!obj) return null;
    const candidates = [];
    for (let y = obj.y - 1; y <= obj.y + obj.h; y++) {
      for (let x = obj.x - 1; x <= obj.x + obj.w; x++) {
        const inside = x >= obj.x && x < obj.x + obj.w && y >= obj.y && y < obj.y + obj.h;
        if (!inside && isCellWalkable(roomId, x, y, false)) {
          const cardinal = (x >= obj.x && x < obj.x + obj.w) || (y >= obj.y && y < obj.y + obj.h);
          candidates.push({ x, y, cardinal });
        }
      }
    }
    candidates.sort((a, b) => (b.cardinal ? 1 : 0) - (a.cardinal ? 1 : 0));
    return candidates[0] || null;
  }

  function findFreeAdjacentWalkable(state, roomId, obj, ignoreId = null) {
    if (!obj) return null;
    if (obj.type === 'writeup_desk') {
      const chair = findDeskChair(roomId, obj);
      if (
        chair &&
        isCellWalkable(roomId, chair.x, chair.y, false) &&
        !isOccupiedByCharacter(state, roomId, chair.x, chair.y, ignoreId, 0.50)
      ) {
        return { x: chair.x, y: chair.y, cardinal: true };
      }
    }
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    const cardinalCands = [];
    const diagCands = [];
    const doorCardinalCands = [];
    const doorDiagCands = [];
    for (let y = obj.y - 1; y <= obj.y + obj.h; y++) {
      for (let x = obj.x - 1; x <= obj.x + obj.w; x++) {
        const inside = x >= obj.x && x < obj.x + obj.w && y >= obj.y && y < obj.y + obj.h;
        if (inside) continue;
        if (!isCellWalkable(roomId, x, y, false)) continue;
        if (isOccupiedByCharacter(state, roomId, x, y, ignoreId, 0.50)) continue;
        const isDoorway = rm?.tiles?.[y]?.[x] === 7 || isChokepointOrDoorway(roomId, x, y);
        const cardinal = (x >= obj.x && x < obj.x + obj.w) || (y >= obj.y && y < obj.y + obj.h);
        if (isDoorway) {
          if (cardinal) doorCardinalCands.push({ x, y, cardinal: true });
          else doorDiagCands.push({ x, y, cardinal: false });
        } else {
          if (cardinal) cardinalCands.push({ x, y, cardinal: true });
          else diagCands.push({ x, y, cardinal: false });
        }
      }
    }
    if (cardinalCands.length) {
      return cardinalCands[Math.floor(Math.random() * cardinalCands.length)];
    }
    if (diagCands.length) {
      return diagCands[Math.floor(Math.random() * diagCands.length)];
    }
    if (doorCardinalCands.length) {
      return doorCardinalCands[Math.floor(Math.random() * doorCardinalCands.length)];
    }
    if (doorDiagCands.length) {
      return doorDiagCands[Math.floor(Math.random() * doorDiagCands.length)];
    }
    return null;
  }

  function findPathBFS(roomId, sx, sy, tx, ty, maxSteps = 65, state = null, ignoreId = null) {
    sx = Math.round(sx);
    sy = Math.round(sy);
    tx = Math.round(tx);
    ty = Math.round(ty);
    if (sx === tx && sy === ty) return [];

    const alarmOn = Boolean(state?.fireAlarm?.active);
    const targetOccupied = Boolean(
      state && isOccupiedByCharacter(state, roomId, tx, ty, ignoreId, 0.48)
    );

    const reconstruct = node => {
      const path = new Array(node.len);
      let cur = node;
      for (let idx = node.len - 1; idx >= 0; idx--) {
        path[idx] = { x: cur.x, y: cur.y, dir: cur.dir };
        cur = cur.parent;
      }
      return path;
    };

    const q = [{ x: sx, y: sy, dir: null, parent: null, len: 0 }];
    const seen = new Set([`${sx},${sy}`]);
    const dirs = [
      { dx: 0, dy: 1, dir: 'S' },
      { dx: -1, dy: 0, dir: 'W' },
      { dx: 1, dy: 0, dir: 'E' },
      { dx: 0, dy: -1, dir: 'N' }
    ];

    let head = 0;
    while (head < q.length) {
      const cur = q[head++];
      if (cur.len >= maxSteps) continue;
      for (let i = 0; i < 4; i++) {
        const d = dirs[i];
        const nx = cur.x + d.dx;
        const ny = cur.y + d.dy;
        const key = `${nx},${ny}`;
        if (seen.has(key)) continue;
        if (!isCellWalkable(roomId, nx, ny, alarmOn)) continue;

        const isGoal = nx === tx && ny === ty;
        if (isGoal) {
          if (targetOccupied) {
            return reconstruct(cur);
          }
          return reconstruct({ x: nx, y: ny, dir: d.dir, parent: cur, len: cur.len + 1 });
        }

        if (
          state &&
          isOccupiedByStationaryCharacter(state, roomId, nx, ny, ignoreId, 0.48) &&
          !isChokepointOrDoorway(roomId, nx, ny)
        ) {
          continue;
        }

        seen.add(key);
        q.push({ x: nx, y: ny, dir: d.dir, parent: cur, len: cur.len + 1 });
      }
    }
    return [];
  }

  function dirBetween(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) return null;
    if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'W' : 'E';
    return dy < 0 ? 'N' : 'S';
  }

  function faceTowards(entity, tx, ty) {
    if (!entity) return;
    const d = dirBetween(entity.x, entity.y, tx, ty);
    if (d) entity.dir = d;
  }

  function faceEachOther(entities) {
    if (!Array.isArray(entities) || entities.length < 2) return;
    for (let i = 0; i < entities.length; i++) {
      const me = entities[i];
      if (!me) continue;
      let sumX = 0;
      let sumY = 0;
      let cnt = 0;
      for (let j = 0; j < entities.length; j++) {
        if (i === j || !entities[j]) continue;
        sumX += entities[j].x;
        sumY += entities[j].y;
        cnt++;
      }
      if (cnt > 0) faceTowards(me, sumX / cnt, sumY / cnt);
    }
  }

  function faceObject(npc, obj) {
    if (!npc || !obj) return;
    faceTowards(npc, obj.x + (obj.w - 1) * 0.5, obj.y + (obj.h - 1) * 0.5);
  }

  function faceNpcTowardCurrentAction(npc) {
    if (!npc) return;
    const act = npc.sim?.currentAction;
    const objId = act?.objId || npc.busyObjId || null;
    if (objId) {
      const rm = window.KLB.WORLD_MAPS?.rooms?.[npc.roomId];
      const obj = rm?.objects?.find(o => o.id === objId);
      if (obj) {
        if (obj.type === 'writeup_desk') {
          const chair = findDeskChair(npc.roomId, obj);
          if (chair && chair.dir && Math.round(npc.x) === chair.x && Math.round(npc.y) === chair.y) {
            npc.dir = chair.dir;
            return;
          }
        }
        faceObject(npc, obj);
        return;
      }
    }
    if (act && act.x != null && act.y != null) {
      faceTowards(npc, act.x, act.y);
    }
  }

  function faceNpcsTowardNearbyPartners(state, npcIds, partnerIds, roomId, maxDist = 3.5) {
    if (!state || !Array.isArray(npcIds) || !Array.isArray(partnerIds) || !roomId) return;
    const playerId = state.spectatorMode ? null : state.player?.id;
    const resolvedPartners = partnerIds
      .map(id => (playerId && id === playerId) ? state.player : state.npcs?.[id])
      .filter(p => p && p.roomId === roomId);
    if (resolvedPartners.length < 2) return;

    for (const npcId of npcIds) {
      if (playerId && npcId === playerId) continue;
      const npc = state.npcs?.[npcId];
      if (!npc || npc.roomId !== roomId) continue;
      let sumX = 0;
      let sumY = 0;
      let cnt = 0;
      for (const other of resolvedPartners) {
        if (other === npc || other.id === npc.id) continue;
        if (Math.hypot(other.x - npc.x, other.y - npc.y) <= maxDist) {
          sumX += other.x;
          sumY += other.y;
          cnt++;
        }
      }
      if (cnt > 0) faceTowards(npc, sumX / cnt, sumY / cnt);
    }
  }

  function distToActionTarget(npc, target) {
    if (!npc || !target) return Infinity;
    if (target.roomId && target.roomId !== npc.roomId) return Infinity;
    if (target.objId) {
      const rm = window.KLB.WORLD_MAPS?.rooms?.[npc.roomId];
      const obj = rm?.objects?.find(o => o.id === target.objId);
      if (obj) {
        const cx = clamp(npc.x, obj.x, obj.x + Math.max(0, (obj.w || 1) - 1));
        const cy = clamp(npc.y, obj.y, obj.y + Math.max(0, (obj.h || 1) - 1));
        return Math.hypot(npc.x - cx, npc.y - cy);
      }
    }
    if (target.x != null && target.y != null) {
      return Math.hypot(npc.x - target.x, npc.y - target.y);
    }
    return 0;
  }

  function matchesCupboardHint(label, hint) {
    const lbl = String(label || '');
    const h = String(hint || '').trim();
    if (!h) return true;
    const m = h.match(/^cupboard\s+(\d+)$/i);
    if (m) {
      const re = new RegExp(`\\bcupboard\\s+${m[1]}\\b(?!\\d)`, 'i');
      return re.test(lbl);
    }
    return lbl.toLowerCase().includes(h.toLowerCase());
  }

  // ==================== 2. METER HELPERS (ENERGY, MORALE, SOCIAL, PATIENCE) ====================
  function getCravingText(prefOrTarget) {
    const pref = typeof prefOrTarget === 'string'
      ? prefOrTarget
      : (prefOrTarget?.preferences?.pref || prefOrTarget?.pref || prefOrTarget?.key || prefOrTarget?.type || 'balanced');
    if (pref === 'coffee') return 'Need a proper Gordon espresso soon.';
    if (pref === 'tea') return 'Could really use a mug of Yorkshire tea upstairs.';
    if (pref === 'gaming') return 'Brain fried — itching for an AoE2 or Worms match on 3F.';
    return 'Need a quick breather.';
  }

  function isNeglectingPreferredBreak(target, timeMins) {
    const t = resolveMeterTarget(target);
    if (!t) return false;
    const pref = t.preferences?.pref || 'balanced';
    if (pref === 'balanced') return false;
    const last = Number.isFinite(t.lastPreferredBreakMins) ? t.lastPreferredBreakMins : timeMins;
    const elapsed = timeMins - last;
    const hour = timeMins / 60;
    if (pref === 'coffee' || pref === 'tea') return elapsed > 210;
    if (pref === 'gaming') return hour >= 13.5 && elapsed > 240;
    return false;
  }

  function getWriteupEnergyFactor(energy) {
    const e = Number.isFinite(Number(energy)) ? Number(energy) : 80;
    return 0.35 + 0.65 * (clamp(e, 0, 100) / 100);
  }

  function getLabCondition(target) {
    const t = resolveMeterTarget(target);
    if (!t) return 95;
    if (t.labCondition != null && Number.isFinite(Number(t.labCondition))) return Number(t.labCondition);
    if (t.safety != null && Number.isFinite(Number(t.safety))) return Number(t.safety);
    return 95;
  }

  function setLabCondition(target, nextVal) {
    const t = resolveMeterTarget(target);
    if (!t) return 95;
    const v = clamp(Number.isFinite(Number(nextVal)) ? Number(nextVal) : 95, 0, 100);
    t.labCondition = v;
    t.safety = v;
    return v;
  }

  function applyWorkspaceMess(target, amount = 10, flags = {}) {
    const t = resolveMeterTarget(target);
    if (!t) return { labCondition: 95, safety: 95, delta: 0 };
    const drop = Number.isFinite(Number(amount)) ? Math.max(0, Number(amount)) : 10;
    const prev = getLabCondition(t);
    const next = setLabCondition(t, prev - drop);
    if (flags && typeof flags === 'object') {
      const hasThiol = Boolean(flags.thiol_dirty || flags.thiolDirty);
      const hasWaste = Boolean(flags.uncapped_waste || flags.uncappedWaste);
      if (t.prep && typeof t.prep === 'object' && ('thiol_dirty' in t.prep || 'uncapped_waste' in t.prep)) {
        if (hasThiol) t.prep.thiol_dirty = true;
        if (hasWaste) t.prep.uncapped_waste = true;
      } else {
        if (hasThiol) t.thiolDirty = true;
        if (hasWaste) t.uncappedWaste = true;
      }
    }
    return { labCondition: next, safety: next, delta: next - prev };
  }

  function applyWorkspaceCleaning(target, cleanKind) {
    const t = resolveMeterTarget(target);
    if (!t) return { labCondition: 95, safety: 95, delta: 0, cleanKind };
    const kind = String(cleanKind || 'bench');
    let bonus = 18;
    if (kind === 'sink') bonus = 24;
    else if (kind === 'base_bath' || kind === 'bleach_clean') bonus = 28;
    else if (kind === 'waste_bin') bonus = 20;
    else if (kind === 'bench') bonus = 18;

    const prev = getLabCondition(t);
    const next = setLabCondition(t, prev + bonus);

    if (kind === 'base_bath' || kind === 'bleach_clean') {
      if (t.prep && typeof t.prep === 'object') {
        t.prep.bleach_bath = true;
        if ('thiol_dirty' in t.prep) t.prep.thiol_dirty = false;
      }
      if ('thiolDirty' in t) t.thiolDirty = false;
    } else if (kind === 'waste_bin') {
      if (t.prep && typeof t.prep === 'object') {
        if ('uncapped_waste' in t.prep) t.prep.uncapped_waste = false;
        if ('extinguisher_displaced' in t.prep) t.prep.extinguisher_displaced = false;
      }
      if ('uncappedWaste' in t) t.uncappedWaste = false;
    }

    return { labCondition: next, safety: next, delta: next - prev, cleanKind: kind };
  }

  function computeEnergyDrain(state, entityId, preferences, roomId, headphonesOn, hour, deltaMins) {
    let base = 0.11 * deltaMins;
    if (roomId === 'klb_2f' && !headphonesOn && !state?.fireAlarm?.active) {
      base += 0.045 * deltaMins;
    }
    if (preferences?.requiresCaffeine === true) base *= 1.55;
    if (entityId === 'daniel_richards' && hour >= 18.0) base *= 2.0;
    if (entityId === 'peter_szijj' && hour >= 18.0 && state?.lotrPlaying) base *= 0.45;
    if (state?.mutators?.infinite_espresso) base *= 0.55;
    if (headphonesOn) base *= 0.65;
    return base;
  }

  function applySocialInteraction(target, amount = 7, npcId = null) {
    const t = resolveMeterTarget(target);
    if (!t) return { applied: false, social: 0, morale: 0 };

    if (npcId && t.npcChatCooldowns && typeof t.npcChatCooldowns === 'object') {
      const rem = Number(t.npcChatCooldowns[npcId]) || 0;
      if (rem > 0) {
        return {
          applied: false,
          cooldownRemaining: rem,
          social: t.social ?? 84,
          morale: t.morale ?? 50
        };
      }
      t.npcChatCooldowns[npcId] = 20;
    }

    let add = Number.isFinite(Number(amount)) ? Number(amount) : 7;
    if (add > 0 && !t.spectatorMode && t.player?.headphonesOn) {
      add = Math.max(1, Math.round(add * 0.8));
    }
    t.social = clamp((t.social != null ? Number(t.social) : 84) + add, 0, 100);
    t.morale = clamp((t.morale != null ? Number(t.morale) : 50) + 3, 0, 100);
    return { applied: true, social: t.social, morale: t.morale };
  }

  function applyBreakEffects(target, breakKind, withColleagues = false, nowMins = null, calisePresent = false) {
    const t = resolveMeterTarget(target);
    if (!t) return { energyDelta: 0, moraleDelta: 0, socialDelta: 0, isPreferred: false };

    const pref = t.preferences?.pref || 'balanced';
    const currentMins = (nowMins != null && Number.isFinite(Number(nowMins)))
      ? Number(nowMins)
      : (Number.isFinite(t.timeMins) ? t.timeMins : (Number.isFinite(t._currentTimeMins) ? t._currentTimeMins : 0));

    let eDelta = 0;
    let mDelta = 0;
    let sDelta = 0;
    let isPreferred = false;

    if (breakKind === 'coffee') {
      isPreferred = pref === 'coffee';
      eDelta = isPreferred ? 38 : 30;
      mDelta = isPreferred ? 22 : 8;
      sDelta = withColleagues ? 8 : 2;
      if (isPreferred) t.lastPreferredBreakMins = currentMins;
    } else if (breakKind === 'tea') {
      isPreferred = pref === 'tea';
      eDelta = isPreferred ? 36 : 22;
      mDelta = isPreferred ? 22 : 7;
      sDelta = 3;
      if (isPreferred) t.lastPreferredBreakMins = currentMins;
    } else if (breakKind === 'gaming') {
      isPreferred = pref === 'gaming';
      eDelta = -4;
      mDelta = isPreferred ? 24 : 8;
      sDelta = 6;
      if (isPreferred) t.lastPreferredBreakMins = currentMins;
    } else if (breakKind === 'lunch') {
      eDelta = 42;
      mDelta = withColleagues ? 14 : 10;
      sDelta = withColleagues ? 10 : 3;
      t.hadLunchToday = true;
    } else if (breakKind === 'packed_lunch') {
      eDelta = 34;
      mDelta = 8;
      sDelta = withColleagues ? 6 : 1;
      t.hadLunchToday = true;
    }

    if (breakKind === 'lunch' || breakKind === 'packed_lunch') {
      const pRoom = !t.spectatorMode ? t.player?.roomId : null;
      const caliseNpcHere = Boolean(pRoom && t.npcs?.calise_bahou?.roomId === pRoom);
      const isCalisePlayer = Boolean(!t.spectatorMode && t.player?.id === 'calise_bahou');
      if (calisePresent || caliseNpcHere || (isCalisePlayer && withColleagues)) {
        mDelta += 3;
      }
      if (isCalisePlayer && pRoom && withColleagues && t.npcs) {
        for (const n of Object.values(t.npcs)) {
          if (n && n.roomId === pRoom && n.sim) {
            n.sim.morale = clamp((n.sim.morale ?? 50) + 3, 0, 100);
          }
        }
      }
    }

    t.energy = clamp((t.energy != null ? Number(t.energy) : 80) + eDelta, 0, 100);
    t.morale = clamp((t.morale != null ? Number(t.morale) : 50) + mDelta, 0, 100);
    t.social = clamp((t.social != null ? Number(t.social) : 84) + sDelta, 0, 100);

    return { energyDelta: eDelta, moraleDelta: mDelta, socialDelta: sDelta, isPreferred };
  }

  function applyExperimentOutcomeToMorale(target, quality, yieldPct) {
    const t = resolveMeterTarget(target);
    if (!t) return 0;
    const q = Number(quality) || 0;
    const y = yieldPct != null ? (Number(yieldPct) || 0) : q;
    const perf = Math.round(q * 0.6 + y * 0.4);
    let delta = 0;
    if (perf >= 88) delta = 12;
    else if (perf >= 78) delta = 6;
    else if (perf >= 65) delta = -5;
    else delta = -12;

    const charId = (!t.spectatorMode ? t.player?.id : null) || target?.id || t.charId || t.id;
    if (delta < 0 && charId === 'calise_bahou') {
      delta = Math.round(delta * 0.5);
    }

    t.morale = clamp((t.morale != null ? Number(t.morale) : 50) + delta, 0, 100);
    return delta;
  }

  function applyFridayAuditPatience(target, auditResult, opts = {}) {
    const t = resolveMeterTarget(target);
    if (!t || !auditResult) return 0;
    const delta = Number(auditResult.patienceDelta) || 0;
    const hasPrev = Boolean(opts && opts.prevAuditResult);
    const prevDelta = hasPrev ? (Number(opts.prevAuditResult.patienceDelta) || 0) : 0;
    const netDelta = hasPrev ? (delta - prevDelta) : delta;
    t.patience = clamp((t.patience != null ? Number(t.patience) : 82) + netDelta, 0, 100);
    return netDelta;
  }

  function satisfyHabit() {
    // Separate coffee/tea/gaming habit meters removed; kept as safe compatibility stub.
    return null;
  }

  function hasColleaguesInRoom(state, roomId, excludeId) {
    if (!state || !roomId || roomId === 'offsite') return false;
    if (!state.spectatorMode && state.player && state.player.roomId === roomId && state.player.id !== excludeId) {
      return true;
    }
    for (const n of Object.values(state.npcs || {})) {
      if (!n || n.id === excludeId) continue;
      if (n.roomId === roomId) return true;
    }
    return false;
  }

  // ==================== 3. STATE CREATION & AUTONOMOUS NPC INIT ====================
  function makeInitialNpcSim(charMeta) {
    const id = charMeta.id;
    const prefs = getPreferencesSpec(charMeta);
    const arriveMins = Math.round((charMeta.arriveHour || 9.0) * 60);
    return {
      charId: id,
      stepIdx: 0,
      subTaskIdx: 0,
      completedSteps: [],
      phase: 'subtask',
      preferences: prefs,
      prep: {
        oven_flask: false,
        argon_balloon: false,
        dry_solvent: false,
        bleach_bath: false,
        tcep_buffered: id !== 'maximillian_lee',
        sabatini_spritz: false,
        tlc_check: false,
        has_clicker: id !== 'andre_shamsabadi'
      },
      weeklyReportProgress: 0,
      weeklyReportChecked: false,
      manuscriptProgress: 0,
      manuscriptChecked: false,
      labBook: [],
      slideDeck: {
        ready: false,
        framing: 'mechanistic',
        fig1Id: null,
        fig2Id: null,
        honestDisclosure: true
      },
      activeJob: null,
      activeRxn: null,
      pendingJobStart: null,
      currentAction: null,
      stepPerf: null,
      failures: [],
      auditResult: null,
      energy: 68 + Math.floor(Math.random() * 20),
      morale: 50,
      social: 84,
      labCondition: 95,
      safety: 95,
      patience: 82,
      favours: 1,
      lcmsBroken: false,
      abilFineOwed: false,
      thiolDirty: false,
      uncappedWaste: false,
      hadLunchToday: false,
      lastPreferredBreakMins: arriveMins,
      _currentTimeMins: arriveMins,
      _quartetDoneKey: null,
      stepCooldownMins: 0,
      cleanSkipCooldownMins: 0,
      retryingStep: -1,
      toughWeek: Math.random() < 0.23,
      cravingCooldownMins: 0,
      socialBubbleCooldownMins: 0,
      socialCooldownMins: 0,
      weeklyStats: {
        stepsCompleted: 0,
        subTasksCompleted: 0,
        lunchesTaken: 0,
        overcooks: 0,
        prepFailures: 0,
        quirkFailures: 0,
        facilityFailures: 0,
        weeklyReportsOnTime: 0,
        weeklyReportsMissed: 0,
        manuscriptsOnTime: 0,
        manuscriptsMissed: 0,
        auditsPassed: 0,
        auditsFailed: 0
      }
    };
  }

  function rollDailyWeather(state) {
    if (!state) return;
    if (state.mutators?.eternal_heatwave) {
      state.weatherMode = 'heatwave';
      state.tempC = 30.2;
    } else if (Math.random() < 0.25) {
      state.weatherMode = 'rain';
      state.tempC = 14.0;
    } else {
      state.weatherMode = 'normal';
      state.tempC = 21.0;
    }
    state._weatherStats = state._weatherStats || { normal: 0, rain: 0, heatwave: 0, cold_230: 0 };
    state._weatherStats[state.weatherMode] = (state._weatherStats[state.weatherMode] || 0) + 1;
  }

  function createRunState(playerCharId, activeMutators = {}, options = {}) {
    const spectatorMode = Boolean(options && options.spectatorMode) || playerCharId === 'spectator';
    const resolvedPlayerId = spectatorMode ? 'spectator' : (playerCharId || 'daniel_richards');
    const charMeta = window.KLB.CAST_BY_ID?.[resolvedPlayerId] || null;
    const startHour = spectatorMode ? 9.5 : (charMeta?.arriveHour || 8.5);
    const startMins = Math.round(startHour * 60);
    const knowsCodes = ['antoine_maruani', 'marcos_fernandez', 'daniel_richards'].includes(resolvedPlayerId);
    const preferences = spectatorMode
      ? { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' }
      : getPreferencesSpec(charMeta);

    const state = {
      charId: resolvedPlayerId,
      weekNum: 1,
      dayIdx: 0,
      timeMins: startMins,
      realSecAccum: 0,
      paused: false,
      isPaused: false,
      gameOver: false,
      victory: false,
      spectatorMode,
      _headlessVerify: Boolean(options?.headlessVerify),
      cameraRoomId: 'klb_2f',
      mutators: { ...activeMutators },

      tempC: activeMutators.eternal_heatwave ? 30.2 : 21.0,
      weatherMode: activeMutators.eternal_heatwave ? 'heatwave' : 'normal',
      _weatherStats: { normal: 0, rain: 0, heatwave: 0, cold_230: 0 },

      morale: 50,
      labCondition: 95,
      safety: 95,
      energy: 92,
      social: 84,
      patience: 82,
      favours: 1,
      preferences,
      habit: null,
      lastPreferredBreakMins: startMins,
      hadLunchToday: false,
      npcChatCooldowns: {},

      weeklyReportProgress: 0,
      weeklyReportChecked: false,
      manuscriptProgress: 0,
      manuscriptChecked: false,

      player: {
        id: resolvedPlayerId,
        roomId: spectatorMode ? 'spectator' : 'klb_2f',
        visible: !spectatorMode,
        x: 27,
        y: 12,
        dir: 'W',
        walkFrame: 0,
        walkAnimTimer: 0,
        isMoving: false,
        specsOn: !spectatorMode,
        headphonesOn: false
      },

      prep: {
        oven_flask: false,
        argon_balloon: false,
        dry_solvent: false,
        bleach_bath: false,
        tlc_check: false,
        ph_calibrated: false,
        tcep_buffered: resolvedPlayerId !== 'maximillian_lee',
        has_clicker: resolvedPlayerId !== 'andre_shamsabadi',
        sabatini_spritz: false,
        sabatini_tlc_jar: false,
        darwin_pass: resolvedPlayerId === 'faiza_javaid',
        knows_1965: knowsCodes,
        knows_2145: knowsCodes,
        lemons_count: resolvedPlayerId === 'calise_bahou' ? 3 : 0,
        thiol_dirty: false,
        uncapped_waste: false,
        extinguisher_displaced: false
      },

      lotrPlaying: false,
      fireAlarm: { active: false, remainingMins: 0, elapsedMins: 0 },
      safetySweep: { active: false, countdownSec: 0, countdownMins: 0 },
      aoe2Event: { active: false, endMins: 0 },
      vijayRound: { active: false, checkedPlayer: false },
      doorPls: { active: false, requesterId: null, expireMins: 0 },
      lcmsBroken: false,
      abilFineOwed: false,

      campaignStepIdx: 0,
      completedSteps: [],
      activeStationJobs: [],
      activeReactions: [],
      activePlayerAction: null,
      npcReactions: [],
      npcActions: [],
      labBook: [],
      slideDeck: {
        ready: false,
        framing: 'mechanistic',
        fig1Id: null,
        fig2Id: null,
        honestDisclosure: true
      },
      fridayAuditDone: false,
      fridayFinalAuditDone: false,
      abilFineOwed: false,
      lastAuditResult: null,

      npcs: {},
      speechBubbles: [],
      whatsapp: [],
      _queuedBubbles: [],
      _queuedWaReplies: [],
      _seenEventsThisWeek: {},
      _recentHuddles: [],
      _recentPlayerConvos: [],
      birthday: null,
      _birthdayStats: { days: 0, greetings: 0 },
      _weeklySigDone: {},
      _weeklySigStats: {},
      _lastWeeklySigMins: -999,
      _lastWeeklySigDay: -1,
      _sampleRunAskCount: 0,
      _sampleAskCooldowns: {},
      _trackedDayIdx: 0,
      _trackedWeekNum: 1,
      _weeklyAudits: [],
      _weeklyReportRecords: [],
      _manuscriptRecords: [],
      _lunchCount: 0,
      _lunchDetails: { gordons: 0, packed: 0, withColleagues: 0 },
      _subTasksCompleted: 0,
      _subTaskModeCounts: { action: 0, wait: 0, collect: 0 },
      _socialStats: {
        min: 84,
        max: 84,
        sum: 0,
        samples: 0,
        below30Ticks: 0,
        recoveries: 0,
        chatCount: 0
      },
      _moraleFromExpStats: {
        upCount: 0,
        downCount: 0,
        neutralCount: 0,
        totalUp: 0,
        totalDown: 0
      },
      _caffeineEnergySamples: {
        caffeineSum: 0,
        caffeineCount: 0,
        standardSum: 0,
        standardCount: 0,
        caffeineDrainSum: 0,
        caffeineDrainMins: 0,
        standardDrainSum: 0,
        standardDrainMins: 0
      },

      eventCooldownMins: 120 + Math.random() * 80,
      banterCooldownMins: 95 + Math.random() * 55,
      huddleCooldownSec: 2.5,
      _coffeeConvoCooldownSec: 1.8,
      _lunchConvoCooldownSec: 2.0,
      _aoe2ConvoCooldownSec: 1.8,
      _lastCoffeeSpeakerId: null,
      _lastLunchSpeakerId: null,
      _lastAoe2SpeakerId: null,
      aoe2UsedToday: false,
      coffeeUsedToday: false,
      _aoe2CheckedDayKey: null,
      _aoe2EventCount: 0,
      _lcmsHazardToday: false,
      _lcmsDownEvents: 0,
      _portalHopsCompleted: 0,
      _labConditionStats: {
        messEvents: 0,
        messAmountSum: 0,
        cleanActions: 0,
        cleanByKind: { sink: 0, base_bath: 0, waste_bin: 0, bench: 0 },
        sweepInfractions: 0,
        samples: 0,
        sum: 0,
        min: 95
      },
      _pollToday: false,
      _sweepToday: false,
      _fireAlarmToday: false,
      _alexToday: false,
      _coffeePingToday: false,
      _quartetWaToday: false,
      _eveningToastToday: false,
      _playerCravingCooldownMins: 0,
      _playerSocialBubbleCooldownMins: 0,
      _lastPlayerRoomId: spectatorMode ? null : 'klb_2f',
      marcosBombUsed: false
    };

    rollDailyWeather(state);
    initNPCs(state);
    rollDailyBirthday(state, options?.callbacks || options);
    seedOpeningWhatsApp(state);
    syncVisibleReactionsCache(state);
    return state;
  }

  function initNPCs(state) {
    const cast = window.KLB.CAST || [];
    for (const c of cast) {
      if (!state.spectatorMode && c.id === state.player.id) continue;
      const isNeighbour = Boolean(NEIGHBOUR_WORKFLOWS[c.id]);
      const prefs = getPreferencesSpec(c);

      if (c.fixedRoom && c.fixedPos) {
        state.npcs[c.id] = {
          id: c.id,
          roomId: c.fixedRoom,
          x: c.fixedPos.x,
          y: c.fixedPos.y,
          dir: c.fixedPos.dir || 'S',
          walkFrame: 0,
          walkAnimTimer: 0,
          path: [],
          pendingRoomTravel: null,
          busyObjId: null,
          aiTimer: 4 + Math.random() * 8,
          blockedSec: 0,
          blockedCount: 0,
          huddleLockTimer: 0,
          huddleTarget: null,
          specsOn: false,
          currentTaskText: c.id === 'kersti_karu' ? 'Monitoring LG11 Q-TOF' : 'Monitoring LG1b NMR',
          currentTaskSpeech: '',
          preferences: prefs,
          habit: null,
          sim: null
        };
      } else {
        state.npcs[c.id] = {
          id: c.id,
          roomId: 'offsite',
          x: 27,
          y: 12,
          dir: 'S',
          walkFrame: 0,
          walkAnimTimer: 0,
          path: [],
          pendingRoomTravel: null,
          busyObjId: null,
          aiTimer: 3 + Math.random() * 7,
          blockedSec: 0,
          blockedCount: 0,
          huddleLockTimer: 0,
          huddleTarget: null,
          specsOn: true,
          currentTaskText: 'Arriving at KLB',
          currentTaskSpeech: '',
          preferences: prefs,
          habit: null,
          sim: c.playable
            ? makeInitialNpcSim(c)
            : isNeighbour
              ? {
                  stageIdx: 0,
                  activeJob: null,
                  activeRxn: null,
                  currentAction: null,
                  energy: 90,
                  morale: 50,
                  social: 84,
                  labCondition: 95,
                  safety: 95,
                  hadLunchToday: false,
                  preferences: prefs
                }
              : null
        };
      }
    }
    syncNPCSchedules(state, true);
  }

  // ==================== 4. WHATSAPP / KLBchat & BUBBLES ====================
  function isKlbChatMode(state) {
    return Boolean(state && (state.spectatorMode || state.player?.id === 'archie_wall'));
  }

  function pickNonPlayerBigChud(state, preferredId, fallbackId = 'daniel_richards') {
    const chuds = getBigChudsIds();
    const playerId = state?.spectatorMode ? null : state?.player?.id;
    if (preferredId && preferredId !== playerId && chuds.includes(preferredId)) return preferredId;
    if (fallbackId && fallbackId !== playerId && chuds.includes(fallbackId)) return fallbackId;
    return chuds.find(id => id !== playerId) || preferredId || 'marcos_fernandez';
  }

  function resolveBigChudsSender(state, senderId, excludeSenderId = null) {
    const chuds = getBigChudsIds();
    const klbChat = isKlbChatMode(state);
    if (senderId && senderId !== excludeSenderId) {
      if (chuds.includes(senderId)) return senderId;
      if (klbChat && window.KLB.CAST_BY_ID?.[senderId]) return senderId;
    }
    const playerId = state?.spectatorMode ? null : state?.player?.id;
    const poolBase = klbChat
      ? Array.from(new Set(chuds.concat(['nafsika_forte', 'archie_wall', 'marco_sabatini', 'charlotte_coomber'])))
      : chuds;
    const preferredOrder = ['marcos_fernandez', 'daniel_richards', 'maximillian_lee', 'antoine_maruani'];
    const preferred = preferredOrder.filter(id => id !== playerId && id !== excludeSenderId && poolBase.includes(id));
    const candidates = preferred.length
      ? preferred
      : poolBase.filter(id => id !== playerId && id !== excludeSenderId);
    if (candidates.length) {
      const idx = Math.floor((state?.timeMins || 0) / 7) % candidates.length;
      return candidates[idx];
    }
    return chuds.find(id => id !== excludeSenderId) || 'marcos_fernandez';
  }

  function pushWhatsApp(state, senderId, text, callbacks = null, excludeSenderId = null) {
    if (!state) return;
    const resolvedId = resolveBigChudsSender(state, senderId, excludeSenderId);
    const c = window.KLB.CAST_BY_ID?.[resolvedId] || { shortName: resolvedId, waColor: '#93c5fd', id: resolvedId };
    state.whatsapp.push({
      id: 'wa_' + Math.random().toString(36).slice(2, 9),
      senderId: resolvedId,
      senderName: c.shortName || c.name || resolvedId,
      color: c.waColor || '#93c5fd',
      timeStr: formatClock(state.dayIdx, state.timeMins),
      text,
      isSelf: !state.spectatorMode && resolvedId === state.player?.id
    });
    if (state.whatsapp.length > 90) state.whatsapp.shift();
    if (
      typeof window !== 'undefined' &&
      window.KLB.Audio &&
      typeof window.KLB.Audio.playSfx === 'function' &&
      !state.spectatorMode &&
      !state._headlessVerify &&
      resolvedId !== state.player?.id
    ) {
      window.KLB.Audio.playSfx('whatsapp');
    }
    const cb = callbacks || state._activeCallbacks;
    cb?.onWhatsApp?.(resolvedId, text);
  }

  function calcBubbleTtl(text) {
    return Math.max(5.0, Math.min(7.2, 4.0 + String(text || '').length * 0.048));
  }

  function pickRandomTemplate(entry) {
    let picked = null;
    if (Array.isArray(entry)) {
      picked = entry.length ? entry[Math.floor(Math.random() * entry.length)] : null;
    } else if (typeof entry === 'string' && entry.length) {
      picked = entry;
    } else if (entry && typeof entry === 'object') {
      picked = entry;
    }
    if (!picked) return null;
    if (typeof picked === 'string') return picked;
    if (typeof picked === 'object') {
      return typeof picked.template === 'string'
        ? picked.template
        : (typeof picked.text === 'string' ? picked.text : null);
    }
    return null;
  }

  function resolveEntityById(state, entityId) {
    if (!state || !entityId) return null;
    if (!state.spectatorMode && state.player?.id === entityId) return state.player;
    return state.npcs?.[entityId] || null;
  }

  function pushBubble(state, entityId, roomId, text, ttlSec = null, meta = null) {
    if (!state || !entityId || !roomId || !text) return;
    const resolvedTtl = (ttlSec == null || !Number.isFinite(Number(ttlSec)))
      ? calcBubbleTtl(text)
      : Number(ttlSec);
    const convoId = meta?.convoId || null;
    const partnerIds = Array.isArray(meta?.partnerIds) ? meta.partnerIds.slice() : null;
    state.speechBubbles = (state.speechBubbles || []).filter(b => {
      if (b.entityId === entityId) return false;
      if (convoId && b.convoId === convoId) return false;
      if (partnerIds && partnerIds.includes(b.entityId)) return false;
      if (Array.isArray(b.partnerIds) && b.partnerIds.includes(entityId)) return false;
      return true;
    });
    state.speechBubbles.push({
      entityId,
      roomId,
      text,
      ttlSec: resolvedTtl,
      convoId,
      partnerIds
    });
  }

  function seedOpeningWhatsApp(state) {
    if (!state.spectatorMode && state.player?.id === 'archie_wall') {
      const camp = window.KLB.CAMPAIGNS?.archie_wall;
      pushWhatsApp(state, 'jamie_baker', 'Morning Baker bay! Safety specs on as soon as you step across the 2F threshold and keep the central balance spotless.');
      pushWhatsApp(state, 'nafsika_forte', 'Central Line running slow this morning @Archie — dry DMF and fresh albumin aliquots are ready in Baker bay, plus remember Thu 18:00 Report & Fri 09:00 Meeting!');
      if (camp) {
        pushWhatsApp(state, 'daniel_richards', `Good luck on "${camp.title}" this week @Archie! Shout /AskKLBchat if a protocol gets spicy.`);
      }
      return;
    }
    const danSender = pickNonPlayerBigChud(state, 'daniel_richards', 'peter_szijj');
    const marcosSender = pickNonPlayerBigChud(state, 'marcos_fernandez', 'daniel_richards');
    const antoineSender = pickNonPlayerBigChud(state, 'antoine_maruani', 'daniel_richards');
    pushWhatsApp(state, danSender, 'Morning Chuds! Lab 230 ovens are hot and Büchi 1 water bath is topped up.');
    pushWhatsApp(state, marcosSender, 'Reminder: Thu 18:00 Weekly Report, Fri 09:00 Group Meeting & Fri 18:00 Manuscript Draft.');
    if (!state.spectatorMode && state.player?.id) {
      const camp = window.KLB.CAMPAIGNS?.[state.player.id];
      const playerShort = window.KLB.CAST_BY_ID?.[state.player.id]?.shortName || 'team';
      if (camp) {
        const askHint = state.player.id === 'antoine_maruani'
          ? 'Shout /AskBigChuds if a protocol gets spicy.'
          : 'Shout #AskAntoine or /AskBigChuds if a protocol gets spicy.';
        pushWhatsApp(state, antoineSender, `Good luck on "${camp.title}" this week @${playerShort}! ${askHint}`);
      }
    } else {
      pushWhatsApp(state, antoineSender, 'Full bench lineup in KLB today. Keep glassware dry and flasks under Argon.');
    }
  }

  // ==================== 5. COFFEE QUARTET & GROUP HUDDLES ====================
  function isCoffeeQuartetWindow(state) {
    if (!state || state.fireAlarm?.active) return null;
    if (state.dayIdx < 0 || state.dayIdx > 4) return null;
    const hour = (state.timeMins || 0) / 60;
    const windows = window.KLB.COFFEE_QUARTET?.windows || [
      { id: 'morning', startHour: 10.5, endHour: 11.17, label: '10:30 Morning Coffee' },
      { id: 'afternoon', startHour: 15.0, endHour: 15.58, label: '15:00 Afternoon Coffee' }
    ];
    for (const w of windows) {
      if (hour >= w.startHour && hour <= w.endHour) return w;
    }
    return null;
  }

  function syncCoffeeQuartet(state, teleport = false, deltaMins = 0) {
    const win = isCoffeeQuartetWindow(state);
    if (!win) return false;

    const cq = window.KLB.COFFEE_QUARTET || {
      members: ['joao_nogueira', 'nafsika_forte', 'vijay_chudasama', 'faiza_javaid'],
      roomId: 'gordons_cafe',
      seats: {
        joao_nogueira: { x: 6, y: 10, dir: 'S' },
        nafsika_forte: { x: 8, y: 11, dir: 'W' },
        vijay_chudasama: { x: 10, y: 10, dir: 'S' },
        faiza_javaid: { x: 12, y: 11, dir: 'W' }
      },
      chatLines: {}
    };

    const roomId = cq.roomId || 'gordons_cafe';
    const members = cq.members || [];
    const winKey = `${state.dayIdx}_${win.id}`;

    for (const memberId of members) {
      if (memberId === 'vijay_chudasama' && state.mutators?.vijays_not_in) continue;
      if (!state.spectatorMode && memberId === state.player?.id) continue;
      const npc = state.npcs?.[memberId];
      if (!npc) continue;

      if (!teleport && npc.pendingRoomTravel) continue;

      const seat = cq.seats?.[memberId] || { x: 7, y: 10, dir: 'S' };
      npc.busyObjId = null;
      npc.huddleLockTimer = 0;
      npc.specsOn = false;
      npc.currentTaskText = `${win.label} at Gordon's Café`;
      if (memberId === 'vijay_chudasama') {
        const winEndMins = win.endMins || Math.round((win.endHour ?? 11.17) * 60);
        if (!npc.departAtMins || npc.departAtMins < state.timeMins) {
          npc.departAtMins = winEndMins;
        }
      }
      if (npc.sim) {
        npc.sim.currentAction = null;
        npc.sim.pendingJobStart = null;
      }

      if (teleport) {
        npc.pendingRoomTravel = null;
        const spot = findFreeWalkableNear(state, roomId, seat.x, seat.y, memberId, true);
        npc.roomId = roomId;
        if (spot) {
          npc.x = spot.x;
          npc.y = spot.y;
        }
        npc.dir = seat.dir || 'S';
        npc.path = [];
      } else if (npc.roomId !== roomId) {
        moveNpcToRoomAndPoint(state, npc, roomId, seat.x, seat.y, false);
      } else if ((!npc.path || npc.path.length === 0) && Math.hypot(npc.x - seat.x, npc.y - seat.y) > 1.5) {
        const target = findFreeWalkableNear(state, roomId, seat.x, seat.y, memberId, true) || seat;
        npc.path = findPathBFS(roomId, npc.x, npc.y, target.x, target.y, 45, state, memberId);
      } else if (!npc.path || npc.path.length === 0) {
        npc.dir = seat.dir || npc.dir;
        if (npc.sim && npc.sim._quartetDoneKey !== winKey) {
          npc.sim._quartetDoneKey = winKey;
          if (win.id === 'morning' && (npc.sim.energy < 62 || npc.sim.preferences?.requiresCaffeine)) {
            applyBreakEffects(npc.sim, 'coffee', true, state.timeMins);
          } else {
            applySocialInteraction(npc.sim, 7);
            if (npc.sim.preferences?.pref === 'coffee') {
              npc.sim.lastPreferredBreakMins = state.timeMins;
            }
          }
          if (state._socialStats) state._socialStats.recoveries += 1;
        } else if (npc.sim && deltaMins > 0) {
          npc.sim.social = clamp((npc.sim.social ?? 84) + 0.12 * deltaMins, 0, 100);
        }
      }
    }
    return true;
  }

  function getActiveRoomConversationInfo(state, roomId) {
    const activeConvoIds = new Set();
    const busySpeakerIds = new Set();
    for (const b of state?.speechBubbles || []) {
      if (!b || b.roomId !== roomId) continue;
      if (b.convoId) activeConvoIds.add(b.convoId);
      if (b.entityId) busySpeakerIds.add(b.entityId);
      if (Array.isArray(b.partnerIds)) b.partnerIds.forEach(id => busySpeakerIds.add(id));
    }
    for (const qb of state?._queuedBubbles || []) {
      if (!qb || qb.roomId !== roomId) continue;
      if (qb.convoId) activeConvoIds.add(qb.convoId);
      if (qb.entityId) busySpeakerIds.add(qb.entityId);
      if (Array.isArray(qb.partnerIds)) qb.partnerIds.forEach(id => busySpeakerIds.add(id));
    }
    return { activeConvoIds, busySpeakerIds };
  }

  function allocateHuddleClusterSlots(state, roomId, spkIds) {
    const clusters = HUDDLE_CLUSTERS[roomId];
    if (!clusters || !clusters.length) return null;
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    const deskChairs = (rm?.objects || []).filter(
      o => o && o.type === 'chair' && o.group === 'desk_chair'
    );
    const isDeskChairTile = (tx, ty) => deskChairs.some(
      ch => tx >= ch.x && tx < ch.x + (ch.w || 1) && ty >= ch.y && ty < ch.y + (ch.h || 1)
    );

    const activeHuddlers = Object.values(state.npcs || {}).filter(
      n => n && n.roomId === roomId && (n.huddleLockTimer || 0) > 0
    );
    const shuffledClusters = clusters.slice().sort(() => Math.random() - 0.5);
    for (const c of shuffledClusters) {
      if (activeHuddlers.some(h => Math.hypot(h.x - c.x, h.y - c.y) < 3.5)) continue;
      const rawSlots = [
        { x: c.x, y: c.y },
        { x: c.x + 1, y: c.y },
        { x: c.x, y: c.y + 1 },
        { x: c.x - 1, y: c.y },
        { x: c.x, y: c.y - 1 }
      ].filter(s =>
        isCellWalkable(roomId, s.x, s.y, false) &&
        !isChokepointOrDoorway(roomId, s.x, s.y) &&
        !isDeskChairTile(s.x, s.y)
      );

      const freeSlots = [];
      for (const s of rawSlots) {
        let blockedByOther = false;
        if (!state.spectatorMode && state.player?.roomId === roomId && !spkIds.includes(state.player.id)) {
          if (Math.hypot(state.player.x - s.x, state.player.y - s.y) < 0.56) blockedByOther = true;
        }
        for (const n of Object.values(state.npcs || {})) {
          if (n.roomId !== roomId || spkIds.includes(n.id)) continue;
          if (Math.hypot(n.x - s.x, n.y - s.y) < 0.56) {
            blockedByOther = true;
            break;
          }
        }
        if (!blockedByOther) freeSlots.push(s);
      }
      if (freeSlots.length >= spkIds.length) {
        return freeSlots.slice(0, spkIds.length);
      }
    }
    return null;
  }

  function endPlayerConversations(state, keepNpcId = null, opts = {}) {
    if (!state || state.spectatorMode || !state.player?.id) return { unlockedIds: [] };
    const playerId = state.player.id;
    const unlockedIds = new Set();

    for (const npc of Object.values(state.npcs || {})) {
      if (!npc || npc.id === keepNpcId) continue;
      if (npc.huddleTarget?.partnerIds?.includes(playerId)) {
        unlockedIds.add(npc.id);
        npc.huddleLockTimer = 0;
        npc.huddleTarget = null;
      }
    }

    if (Array.isArray(state._queuedBubbles) && state._queuedBubbles.length) {
      state._queuedBubbles = state._queuedBubbles.filter(qb => {
        if (!qb) return false;
        const involvesKeep = Boolean(
          keepNpcId &&
          (qb.entityId === keepNpcId || (Array.isArray(qb.partnerIds) && qb.partnerIds.includes(keepNpcId)))
        );
        if (involvesKeep) return true;
        const involvesPlayer = qb.entityId === playerId ||
          (Array.isArray(qb.partnerIds) && qb.partnerIds.includes(playerId));
        const involvesUnlocked = unlockedIds.has(qb.entityId) ||
          (Array.isArray(qb.partnerIds) && qb.partnerIds.some(id => unlockedIds.has(id)));
        if (involvesPlayer || involvesUnlocked) return false;
        return true;
      });
    }

    const roomChanged = opts === true || Boolean(opts?.changingRooms || opts?.roomChanged);
    if (Array.isArray(state.speechBubbles) && state.speechBubbles.length) {
      state.speechBubbles = state.speechBubbles.filter(b => {
        if (!b) return false;
        const involvesKeep = Boolean(
          keepNpcId &&
          (b.entityId === keepNpcId || (Array.isArray(b.partnerIds) && b.partnerIds.includes(keepNpcId)))
        );
        if (involvesKeep) return true;
        const involvesPlayer = b.entityId === playerId ||
          (Array.isArray(b.partnerIds) && b.partnerIds.includes(playerId));
        const involvesUnlocked = unlockedIds.has(b.entityId) ||
          (Array.isArray(b.partnerIds) && b.partnerIds.some(id => unlockedIds.has(id)));
        if (!involvesPlayer && !involvesUnlocked) return true;
        const diffRoom = Boolean(state.player.roomId && b.roomId && b.roomId !== state.player.roomId);
        if (roomChanged || diffRoom) return false;
        return true;
      });
    }

    return { unlockedIds: Array.from(unlockedIds) };
  }

  function isNpcEvacuating(state, npc) {
    return Boolean(state?.evacuating || state?.fireAlarm?.active || npc?.evacuating || npc?.pendingRoomTravel?.isFireEvac);
  }

  function scheduleMultiTurnConversation(state, roomId, speakers, turns, convoId, opts = {}) {
    if (!state || !roomId) return null;
    const validSpeakers = (speakers || []).filter(Boolean);
    const partnerIds = Array.from(new Set(validSpeakers.map(s => s.id).filter(Boolean)));
    const validTurns = [];
    let cumDelay = 0;

    for (let i = 0; i < (turns || []).length; i++) {
      const t = turns[i];
      const sid = t?.speakerId || t?.id || t?.charId;
      const text = t?.text;
      if (!sid || !text) continue;
      const ttl = calcBubbleTtl(text);
      const delaySec = cumDelay;
      cumDelay += ttl + 0.55;
      validTurns.push({ speakerId: sid, text, ttl, delaySec });
    }
    if (!validTurns.length) return null;

    const lockDur = Math.max(15, cumDelay + 1.5);
    const slots = Array.isArray(opts.slots) ? opts.slots : null;
    const inPlace = Boolean(opts.inPlace);
    const preserveDeskAction = Boolean(opts.preserveDeskAction);

    const hasPlayerSpeaker = validSpeakers.some(s => Boolean(s.isPlayer || (!state.spectatorMode && state.player?.id === s.id)));
    if (hasPlayerSpeaker || opts?.cancelPendingTravel) {
      for (let i = 0; i < validSpeakers.length; i++) {
        const s = validSpeakers[i];
        const isPlayerSpk = Boolean(s.isPlayer || (!state.spectatorMode && state.player?.id === s.id));
        if (isPlayerSpk) continue;
        const npc = state.npcs?.[s.id] || s;
        if (npc && npc.pendingRoomTravel && !isNpcEvacuating(state, npc)) {
          npc.pendingRoomTravel = null;
        }
      }
    }

    const assignedByIdx = new Array(validSpeakers.length).fill(null);
    if (!inPlace && !preserveDeskAction && slots && slots.length) {
      const remSlots = slots.slice();
      const remSpkIdxs = [];
      for (let i = 0; i < validSpeakers.length; i++) {
        const s = validSpeakers[i];
        const isPlayerSpk = Boolean(s.isPlayer || (!state.spectatorMode && state.player?.id === s.id));
        const npc = state.npcs?.[s.id] || s;
        if (!isPlayerSpk && npc && !npc.pendingRoomTravel) remSpkIdxs.push(i);
      }
      while (remSpkIdxs.length && remSlots.length) {
        let bestSpkPos = 0;
        let bestSlotPos = 0;
        let bestDist = Infinity;
        for (let a = 0; a < remSpkIdxs.length; a++) {
          const s = validSpeakers[remSpkIdxs[a]];
          const npc = state.npcs?.[s.id] || s;
          for (let b = 0; b < remSlots.length; b++) {
            const d = Math.hypot(npc.x - remSlots[b].x, npc.y - remSlots[b].y);
            if (d < bestDist) {
              bestDist = d;
              bestSpkPos = a;
              bestSlotPos = b;
            }
          }
        }
        const spkIdx = remSpkIdxs.splice(bestSpkPos, 1)[0];
        assignedByIdx[spkIdx] = remSlots.splice(bestSlotPos, 1)[0];
      }
    }

    for (let i = 0; i < validSpeakers.length; i++) {
      const s = validSpeakers[i];
      const isPlayerSpk = Boolean(s.isPlayer || (!state.spectatorMode && state.player?.id === s.id));
      if (isPlayerSpk) continue;
      const npc = state.npcs?.[s.id] || s;
      if (!npc || npc.pendingRoomTravel) continue;
      const chosenSlot = assignedByIdx[i];
      const slot = (!inPlace && !preserveDeskAction && chosenSlot) ? chosenSlot : { x: npc.x, y: npc.y };
      if (!preserveDeskAction) {
        npc.busyObjId = null;
      }
      npc.huddleLockTimer = lockDur;
      npc.huddleTarget = {
        x: slot.x,
        y: slot.y,
        convoId,
        partnerIds,
        postAction: opts.postAction || null,
        preserveDeskAction
      };
      if (!inPlace && !preserveDeskAction && chosenSlot) {
        npc.path = findPathBFS(roomId, npc.x, npc.y, slot.x, slot.y, 45, state, npc.id);
      }
      if (opts.applyNpcSocial && npc.sim) {
        applySocialInteraction(npc.sim, 7);
        if (state._socialStats) state._socialStats.recoveries += 1;
      }
    }

    const npcSpeakerIds = validSpeakers
      .filter(s => state.spectatorMode || (s !== state.player && s.id !== state.player?.id))
      .map(s => s.id);
    if (!preserveDeskAction) {
      faceNpcsTowardNearbyPartners(state, npcSpeakerIds, partnerIds, roomId, 3.5);
    } else {
      for (const sid of npcSpeakerIds) {
        faceNpcTowardCurrentAction(state.npcs?.[sid]);
      }
    }

    state._queuedBubbles = state._queuedBubbles || [];
    for (let i = 0; i < validTurns.length; i++) {
      const vt = validTurns[i];
      if (opts.immediateFirst && i === 0) {
        pushBubble(state, vt.speakerId, roomId, vt.text, vt.ttl, {
          convoId,
          partnerIds
        });
        const firstEnt = resolveEntityById(state, vt.speakerId);
        if (firstEnt && (state.spectatorMode || firstEnt !== state.player)) {
          firstEnt.currentTaskSpeech = vt.text;
        }
      } else {
        state._queuedBubbles.push({
          delaySec: vt.delaySec,
          entityId: vt.speakerId,
          roomId,
          text: vt.text,
          ttlSec: vt.ttl,
          convoId,
          partnerIds
        });
      }
    }

    return { convoId, partnerIds, turns: validTurns, lockDur };
  }

  function rollDailyBirthday(state, callbacks = {}) {
    if (!state) return null;
    state.birthday = null;
    state._birthdayStats = state._birthdayStats || { days: 0, greetings: 0 };
    if (Math.random() >= 0.10) return null;

    const pool = Array.from(new Set(
      getBigChudsIds().concat(['nafsika_forte', 'archie_wall', 'marco_sabatini', 'charlotte_coomber'])
    )).filter(id => Boolean(window.KLB.CAST_BY_ID?.[id]));
    if (!pool.length) return null;

    const charId = pool[Math.floor(Math.random() * pool.length)];
    const meta = window.KLB.CAST_BY_ID?.[charId];
    if (!meta) return null;

    const initials = String(meta.name || meta.shortName || charId)
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .toUpperCase();

    state.birthday = {
      charId,
      name: meta.name,
      shortName: meta.shortName || meta.name,
      initials,
      dayKey: 'w' + (state.weekNum || 1) + '_d' + (state.dayIdx || 0),
      greetedBy: {}
    };
    state._birthdayStats.days += 1;

    const chuds = getBigChudsIds();
    if (chuds.includes(charId)) {
      const playerId = state.spectatorMode ? null : state.player?.id;
      const friends = chuds.filter(id => id !== charId && id !== playerId);
      const fallbackFriends = chuds.filter(id => id !== charId);
      const friendPool = friends.length ? friends : fallbackFriends;
      const friendId = friendPool[Math.floor(Math.random() * friendPool.length)];
      const bg = window.KLB.BIRTHDAY_GREETINGS || DEFAULT_BIRTHDAY_GREETINGS;
      const waPool = Array.isArray(bg?.whatsapp) && bg.whatsapp.length
        ? bg.whatsapp
        : DEFAULT_BIRTHDAY_GREETINGS.whatsapp;
      const waPicked = pickFromShuffleBag(
        state,
        'bday_wa',
        waPool,
        it => (typeof it === 'string' ? it : (it?.template || it?.text || JSON.stringify(it)))
      );
      const rawWa = pickRandomTemplate(waPicked) || DEFAULT_BIRTHDAY_GREETINGS.whatsapp[0];
      if (friendId && rawWa) {
        const waText = rawWa
          .replace(/\{shortName\}/g, state.birthday.shortName)
          .replace(/\{name\}/g, state.birthday.name)
          .replace(/\{initials\}/g, state.birthday.initials);
        pushWhatsApp(state, friendId, waText, callbacks);
      }
    }

    callbacks?.onBirthday?.(state.birthday);
    return state.birthday;
  }

  function maybeTriggerBirthdayGreeting(state, greeterId, targetId, roomId, opts = {}) {
    if (!state?.birthday || state.birthday.charId !== targetId || !greeterId || greeterId === targetId) {
      return { triggered: false };
    }
    state.birthday.greetedBy = state.birthday.greetedBy || {};
    if (state.birthday.greetedBy[greeterId]) {
      return { triggered: false };
    }

    const greeterEnt = resolveEntityById(state, greeterId);
    const targetEnt = resolveEntityById(state, targetId);
    if (!greeterEnt || !targetEnt || greeterEnt.roomId !== roomId || targetEnt.roomId !== roomId) {
      return { triggered: false };
    }

    if (!opts.force && !state.spectatorMode && state.player && (greeterEnt === state.player || targetEnt === state.player)) {
      if (state.player.isMoving || state.activePlayerAction) {
        return { triggered: false };
      }
      if (Math.hypot(greeterEnt.x - targetEnt.x, greeterEnt.y - targetEnt.y) > 4.2) {
        return { triggered: false };
      }
    }

    state.birthday.greetedBy[greeterId] = true;
    if (!opts.force && Math.random() > 0.80) {
      return { triggered: false };
    }

    const bg = window.KLB.BIRTHDAY_GREETINGS || DEFAULT_BIRTHDAY_GREETINGS;
    const npcToTargetMap = bg?.npcToTarget || DEFAULT_BIRTHDAY_GREETINGS.npcToTarget;
    const hasGreeterPool = Array.isArray(npcToTargetMap[greeterId]) && npcToTargetMap[greeterId].length > 0;
    const openerPool = hasGreeterPool
      ? npcToTargetMap[greeterId]
      : (npcToTargetMap.default || DEFAULT_BIRTHDAY_GREETINGS.npcToTarget.default);
    const openerPicked = pickFromShuffleBag(
      state,
      'bday_open_' + (hasGreeterPool ? greeterId : 'default'),
      openerPool,
      it => (typeof it === 'string' ? it : (it?.template || it?.text || JSON.stringify(it)))
    );
    const rawOpener = pickRandomTemplate(openerPicked) || DEFAULT_BIRTHDAY_GREETINGS.npcToTarget.default[0];
    const greeterLine = rawOpener
      .replace(/\{target\}/g, state.birthday.shortName)
      .replace(/\{name\}/g, state.birthday.name)
      .replace(/\{initials\}/g, state.birthday.initials);

    const replySource = bg?.replies || DEFAULT_BIRTHDAY_GREETINGS.replies;
    const hasTargetReplyPool = !Array.isArray(replySource) && Array.isArray(replySource?.[targetId]) && replySource[targetId].length > 0;
    const replyPool = Array.isArray(replySource)
      ? replySource
      : (hasTargetReplyPool ? replySource[targetId] : (replySource?.default || DEFAULT_BIRTHDAY_GREETINGS.replies));
    const replyPicked = pickFromShuffleBag(
      state,
      'bday_reply_' + (hasTargetReplyPool ? targetId : 'default'),
      replyPool,
      it => (typeof it === 'string' ? it : (it?.template || it?.text || JSON.stringify(it)))
    );
    const rawReply = pickRandomTemplate(replyPicked) || DEFAULT_BIRTHDAY_GREETINGS.replies[0];
    const greeterMeta = window.KLB.CAST_BY_ID?.[greeterId];
    const replyLine = rawReply
      .replace(/\{greeter\}/g, greeterMeta?.shortName || 'mate')
      .replace(/\{target\}/g, state.birthday.shortName)
      .replace(/\{initials\}/g, state.birthday.initials);

    const convoId = `bday_${targetId}_${greeterId}_${Math.floor((state.timeMins || 0) * 10)}_${Math.random().toString(36).slice(2, 5)}`;
    const turns = [
      { speakerId: greeterId, text: greeterLine },
      { speakerId: targetId, text: replyLine }
    ];
    scheduleMultiTurnConversation(state, roomId, [greeterEnt, targetEnt], turns, convoId, {
      immediateFirst: true,
      inPlace: true,
      applyNpcSocial: true
    });

    state._birthdayStats = state._birthdayStats || { days: 0, greetings: 0 };
    state._birthdayStats.greetings += 1;
    if (!state.spectatorMode && (greeterId === state.player?.id || targetId === state.player?.id)) {
      state.morale = clamp((state.morale ?? 50) + 4, 0, 100);
      state.social = clamp((state.social ?? 84) + 5, 0, 100);
    }

    return { triggered: true, targetId, greeterId, greeterLine, replyLine, turns, convoId };
  }

  function interpolateWeeklyText(text) {
    return String(text || '')
      .replace(/\{KNIGHT_MINS\}/g, () => String(16 + Math.floor(Math.random() * 5)))
      .replace(/\{KNIGHT_MINS_2\}/g, () => String(16 + Math.floor(Math.random() * 5)));
  }

  function triggerWeeklySignatureInteraction(state, forceRoomId = null, opts = {}) {
    const roomId = forceRoomId || getViewRoom(state);
    if (!state || !roomId || roomId === 'offsite' || state.fireAlarm?.active) return null;

    state._weeklySigDone = state._weeklySigDone || {};
    state._weeklySigStats = state._weeklySigStats || {};
    const allSigs = Array.isArray(window.KLB.WEEKLY_SIGNATURE_CONVERSATIONS)
      ? window.KLB.WEEKLY_SIGNATURE_CONVERSATIONS
      : [];
    const unplayed = allSigs.filter(sig => sig && sig.weeklyKey && !state._weeklySigDone[sig.weeklyKey]);
    if (!unplayed.length) return null;

    const sameDay = state.dayIdx === state._lastWeeklySigDay;
    const gap = (state.timeMins || 0) - (state._lastWeeklySigMins ?? -999);
    const shortGapBlock = Boolean(!opts.ignoreSpacing && sameDay && gap < 55);
    if (!opts.ignoreSpacing && sameDay && gap < 15) return null;

    const { activeConvoIds, busySpeakerIds } = getActiveRoomConversationInfo(state, roomId);
    const maxConvos = (roomId === 'klb_2f' || roomId === 'gordons_cafe') ? 2 : 1;
    if (!opts.inPlace && activeConvoIds.size >= maxConvos) return null;

    const freeMap = {};
    for (const n of Object.values(state.npcs || {})) {
      if (!n || n.roomId !== roomId) continue;
      if (n.pendingRoomTravel || (n.path && n.path.length > 0) || (n.huddleLockTimer || 0) > 0) continue;
      if (busySpeakerIds.has(n.id)) continue;
      const actKind = n.sim?.currentAction?.kind;
      if (actKind === 'quench' || actKind === 'smoke_break') continue;
      freeMap[n.id] = n;
    }
    if (
      !state.spectatorMode &&
      state.player?.roomId === roomId &&
      !busySpeakerIds.has(state.player.id) &&
      !state.player.isMoving &&
      !state.activePlayerAction
    ) {
      freeMap[state.player.id] = state.player;
    }

    const curHour = getTimeHours(state);
    const dayIdx = state.dayIdx ?? null;
    const eligible = unplayed.filter(sig => {
      if (!Array.isArray(sig.roomIds) || !sig.roomIds.includes(roomId)) return false;
      if (shortGapBlock && sig.minHour == null && sig.maxHour == null) return false;
      if (!isDialogueAllowedAtTime(sig, curHour, dayIdx)) return false;
      const reqIds = Array.isArray(sig.requiredIds) ? sig.requiredIds : [];
      for (const rid of reqIds) {
        if (!freeMap[rid]) return false;
      }
      const parts = Array.isArray(sig.participants) ? sig.participants : reqIds;
      const presentCount = parts.filter(id => Boolean(freeMap[id])).length;
      return presentCount >= (sig.minPresent || 2);
    });
    if (!eligible.length) return null;

    const validEligible = [];
    for (const sig of eligible) {
      const rawVariants = Array.isArray(sig.variants) && sig.variants.length
        ? sig.variants
        : (Array.isArray(sig.turns) ? [{ turns: sig.turns }] : []);
      const validVariants = [];
      for (let varIdx = 0; varIdx < rawVariants.length; varIdx++) {
        const v = rawVariants[varIdx];
        const vTurns = Array.isArray(v) ? v : (v?.turns || v?.lines || []);
        if (!vTurns.length) continue;
        const gateObj = Array.isArray(v) ? { turns: vTurns } : { ...v, turns: vTurns };
        if (!isDialogueAllowedAtTime(gateObj, curHour, dayIdx)) continue;
        const spkIds = [];
        for (const t of vTurns) {
          const sid = t?.speakerId || t?.id || t?.charId;
          if (sid && !spkIds.includes(sid)) spkIds.push(sid);
        }
        if (spkIds.length < 2) continue;
        if (!spkIds.every(id => Boolean(freeMap[id]))) continue;
        if (sig.postAction === 'smoke_break') {
          const smokeReady = spkIds.every(id => {
            const ent = freeMap[id];
            if (!ent?.sim) return true;
            if (ent.sim.activeJob?.canOvercook) return false;
            const k = ent.sim.currentAction?.kind;
            return !k || k === 'tidy_bench' || k === 'socialize';
          });
          if (!smokeReady) continue;
        }
        if (!opts.force && !state.spectatorMode && state.player && spkIds.includes(state.player.id)) {
          const allNearPlayer = spkIds.every(id => {
            if (id === state.player.id) return true;
            const ent = freeMap[id];
            return Boolean(ent && Math.hypot(ent.x - state.player.x, ent.y - state.player.y) <= 4.2);
          });
          if (!allNearPlayer) continue;
        }
        validVariants.push({ varIdx: v?.varIdx ?? varIdx, turns: vTurns, spkIds, vibe: v?.vibe || null });
      }
      if (!validVariants.length) continue;
      const maxCount = Math.max(...validVariants.map(v => v.spkIds.length));
      const topVariants = validVariants.filter(v => v.spkIds.length === maxCount);
      validEligible.push({ sig, topVariants });
    }
    if (!validEligible.length) return null;

    const curVibe = getCurrentDialogueVibe(state);
    const hasTimeWindow = sig => Boolean(sig && (sig.minHour != null || sig.maxHour != null));
    const pickedEntry = pickFromShuffleBag(
      state,
      'weekly_themes',
      validEligible,
      entry => entry.sig.weeklyKey,
      {
        preferFns: [
          entry => hasTimeWindow(entry.sig) && Boolean(curVibe && entry.sig.vibe === curVibe),
          entry => hasTimeWindow(entry.sig),
          entry => Boolean(curVibe && entry.sig.vibe === curVibe)
        ]
      }
    );
    const pickedSig = pickedEntry?.sig || null;
    const chosenVar = pickedSig
      ? pickFromShuffleBag(
          state,
          'wsig_var_' + pickedSig.weeklyKey,
          pickedEntry.topVariants,
          v => v.varIdx ?? JSON.stringify(v.turns),
          { preferFn: v => Boolean(curVibe && v.vibe === curVibe) }
        )
      : null;
    const pickedTurns = chosenVar?.turns || null;
    const pickedSpkIds = chosenVar?.spkIds || null;
    if (!pickedSig || !pickedTurns || !pickedSpkIds) return null;

    const hasPlayer = !state.spectatorMode && state.player && pickedSpkIds.includes(state.player.id);
    const useInPlace = Boolean(opts.inPlace || hasPlayer);
    let assignedSlots = null;
    if (!useInPlace) {
      assignedSlots = allocateHuddleClusterSlots(state, roomId, pickedSpkIds);
      if (!assignedSlots) return null;
    }

    const speakers = pickedSpkIds.map(id => freeMap[id]).filter(Boolean);
    const turns = pickedTurns.map(t => ({
      speakerId: t.speakerId || t.id || t.charId,
      text: interpolateWeeklyText(t.text)
    }));

    state._weeklySigDone[pickedSig.weeklyKey] = true;
    state._lastWeeklySigMins = state.timeMins || 0;
    state._lastWeeklySigDay = state.dayIdx ?? 0;
    state._weeklySigStats[pickedSig.weeklyKey] = (state._weeklySigStats[pickedSig.weeklyKey] || 0) + 1;

    const convoId = `wsig_${pickedSig.weeklyKey}_${Math.floor((state.timeMins || 0) * 10)}_${Math.random().toString(36).slice(2, 6)}`;
    scheduleMultiTurnConversation(state, roomId, speakers, turns, convoId, {
      slots: assignedSlots,
      postAction: pickedSig.postAction || null,
      immediateFirst: Boolean(opts.immediateFirst),
      inPlace: useInPlace,
      applyNpcSocial: true
    });

    return {
      triggered: true,
      weeklyKey: pickedSig.weeklyKey,
      speakers: speakers.map(s => s.id),
      turns
    };
  }

  function areTurnsAlternatingPair(turns, idA, idB) {
    if (!Array.isArray(turns) || turns.length < 2) return false;
    const seen = new Set();
    for (let i = 0; i < turns.length; i++) {
      const sid = turns[i].speakerId || turns[i].id || turns[i].charId;
      if (sid !== idA && sid !== idB) return false;
      seen.add(sid);
      if (i > 0) {
        const prevSid = turns[i - 1].speakerId || turns[i - 1].id || turns[i - 1].charId;
        if (sid === prevSid) return false;
      }
    }
    return seen.has(idA) && seen.has(idB);
  }

  function startPairConversation(state, playerId, npcId, roomId) {
    if (!state || !npcId) return null;
    const pId = playerId || state.player?.id;
    const player = (!state.spectatorMode && state.player && state.player.id === pId)
      ? state.player
      : resolveEntityById(state, pId);
    const npc = state.npcs?.[npcId];
    if (!player || !npc) return null;
    const convRoomId = roomId || player.roomId || npc.roomId;

    if (!state.spectatorMode && state.player && pId === state.player.id) {
      endPlayerConversations(state, npcId);
    }

    if (npc.roomId === convRoomId && player.roomId === convRoomId && Math.hypot(player.x - npc.x, player.y - npc.y) <= 3.5) {
      faceTowards(npc, player.x, player.y);
      if (state.spectatorMode || player !== state.player || !player.isMoving) {
        faceTowards(player, npc.x, npc.y);
      }
    }
    if (npc.pendingRoomTravel && !isNpcEvacuating(state, npc)) {
      npc.pendingRoomTravel = null;
    }
    if ((state.spectatorMode || player !== state.player) && player.pendingRoomTravel && !isNpcEvacuating(state, player)) {
      player.pendingRoomTravel = null;
    }
    if (!npc.pendingRoomTravel?.isFireEvac) {
      npc.path = [];
    }

    const curHour = getTimeHours(state);
    const dayIdx = state.dayIdx ?? null;

    if (Array.isArray(state._queuedBubbles) && state._queuedBubbles.length) {
      state._queuedBubbles = state._queuedBubbles.filter(qb => {
        if (qb.entityId === pId || qb.entityId === npcId) return false;
        if (Array.isArray(qb.partnerIds) && (qb.partnerIds.includes(pId) || qb.partnerIds.includes(npcId))) return false;
        return true;
      });
    }

    const isPlayerInitiated = !state.spectatorMode && state.player && pId === state.player.id;
    const socialRes = isPlayerInitiated ? applySocialInteraction(state, 7, npcId) : null;
    const socialApplied = Boolean(socialRes?.applied);

    // Priority 1: Birthday
    if (
      (state.birthday?.charId === npcId && !state.birthday.greetedBy?.[pId]) ||
      (state.birthday?.charId === pId && !state.birthday.greetedBy?.[npcId])
    ) {
      const greeterId = state.birthday.charId === npcId ? pId : npcId;
      const targetId = state.birthday.charId;
      const bRes = maybeTriggerBirthdayGreeting(state, greeterId, targetId, convRoomId, { force: true });
      if (bRes && bRes.triggered) {
        return { mode: 'birthday', socialApplied, ...bRes };
      }
    }

    // Priority 2: Weekly Signature featuring {playerId, npcId}
    state._weeklySigDone = state._weeklySigDone || {};
    state._weeklySigStats = state._weeklySigStats || {};
    const allSigs = Array.isArray(window.KLB.WEEKLY_SIGNATURE_CONVERSATIONS)
      ? window.KLB.WEEKLY_SIGNATURE_CONVERSATIONS
      : [];
    const sigMatches = [];
    for (const sig of allSigs) {
      if (!sig || !sig.weeklyKey || state._weeklySigDone[sig.weeklyKey]) continue;
      if (!isDialogueAllowedAtTime(sig, curHour, dayIdx)) continue;
      if (Array.isArray(sig.roomIds) && sig.roomIds.length && !sig.roomIds.includes(convRoomId)) continue;
      const rawVariants = Array.isArray(sig.variants) && sig.variants.length
        ? sig.variants
        : (Array.isArray(sig.turns) ? [{ turns: sig.turns }] : []);
      const matchingVars = [];
      for (let varIdx = 0; varIdx < rawVariants.length; varIdx++) {
        const v = rawVariants[varIdx];
        const vTurns = Array.isArray(v) ? v : (v?.turns || v?.lines || []);
        if (vTurns.length < 2) continue;
        const gateObj = Array.isArray(v) ? { turns: vTurns } : { ...v, turns: vTurns };
        if (!isDialogueAllowedAtTime(gateObj, curHour, dayIdx)) continue;
        const spkIds = [];
        for (const t of vTurns) {
          const sid = t?.speakerId || t?.id || t?.charId;
          if (sid && !spkIds.includes(sid)) spkIds.push(sid);
        }
        if (!spkIds.includes(pId) || !spkIds.includes(npcId)) continue;
        const allPresent = spkIds.every(id => {
          if (id === pId || id === npcId) {
            if (id === pId) return true;
            return Boolean(npc && npc.roomId === convRoomId && !npc.pendingRoomTravel?.isFireEvac);
          }
          const ent = state.npcs?.[id];
          return Boolean(
            ent &&
            ent.roomId === convRoomId &&
            !ent.pendingRoomTravel?.isFireEvac &&
            Math.hypot(ent.x - player.x, ent.y - player.y) <= 4.2
          );
        });
        if (!allPresent) continue;
        if (!isPlayerInitiated && sig.postAction === 'smoke_break') {
          const smokeReady = spkIds.every(id => {
            const ent = resolveEntityById(state, id);
            if (!ent?.sim) return true;
            if (ent.sim.activeJob?.canOvercook) return false;
            const k = ent.sim.currentAction?.kind;
            return !k || k === 'tidy_bench' || k === 'socialize';
          });
          if (!smokeReady) continue;
        }
        matchingVars.push({ varIdx: v?.varIdx ?? varIdx, turns: vTurns, spkIds, vibe: v?.vibe || null });
      }
      if (matchingVars.length) {
        const maxLen = Math.max(...matchingVars.map(m => m.spkIds.length));
        const bestVars = matchingVars.filter(m => m.spkIds.length === maxLen);
        sigMatches.push({ sig, topVariants: bestVars });
      }
    }
    if (sigMatches.length) {
      const curVibe = getCurrentDialogueVibe(state);
      const pickedMatch = pickFromShuffleBag(
        state,
        'weekly_themes',
        sigMatches,
        m => m.sig.weeklyKey,
        { preferFn: m => Boolean(curVibe && m.sig.vibe === curVibe) }
      );
      const pickedSig = pickedMatch?.sig || null;
      const chosenVar = pickedSig
        ? pickFromShuffleBag(
            state,
            'wsig_var_' + pickedSig.weeklyKey,
            pickedMatch.topVariants,
            v => v.varIdx ?? JSON.stringify(v.turns),
            { preferFn: v => Boolean(curVibe && v.vibe === curVibe) }
          )
        : null;
      if (pickedSig && chosenVar) {
        const speakers = chosenVar.spkIds.map(id => (id === pId ? player : state.npcs?.[id])).filter(Boolean);
        const turns = chosenVar.turns.map(t => ({
          speakerId: t.speakerId || t.id || t.charId,
          text: interpolateWeeklyText(t.text)
        }));
        state._weeklySigDone[pickedSig.weeklyKey] = true;
        state._lastWeeklySigMins = state.timeMins || 0;
        state._lastWeeklySigDay = state.dayIdx ?? 0;
        state._weeklySigStats[pickedSig.weeklyKey] = (state._weeklySigStats[pickedSig.weeklyKey] || 0) + 1;
        const convoId = `pair_wsig_${pickedSig.weeklyKey}_${Math.floor((state.timeMins || 0) * 10)}_${Math.random().toString(36).slice(2, 5)}`;
        scheduleMultiTurnConversation(state, convRoomId, speakers, turns, convoId, {
          postAction: pickedSig.postAction || null,
          immediateFirst: true,
          inPlace: true
        });
        return {
          mode: 'weekly',
          weeklyKey: pickedSig.weeklyKey,
          speakers: speakers.map(s => s.id),
          turns,
          convoId,
          socialApplied
        };
      }
    }

    // Priority 3: Pair-matched GROUP_HUDDLES
    const normalizeAccents = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const escapeRx = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const huddlePool = (Array.isArray(window.KLB.GROUP_HUDDLES) && window.KLB.GROUP_HUDDLES.length)
      ? window.KLB.GROUP_HUDDLES
      : DEFAULT_GROUP_HUDDLES;
    const huddleMatches = [];
    for (const h of huddlePool) {
      if (!h) continue;
      if (!isDialogueAllowedAtTime(h, curHour, dayIdx)) continue;
      const rawTurns = h.lines || h.turns || h.exchanges || [];
      if (rawTurns.length < 2) continue;
      const rawSpkIds = [];
      for (const t of rawTurns) {
        const sid = t?.speakerId || t?.id || t?.charId;
        if (sid && !rawSpkIds.includes(sid)) rawSpkIds.push(sid);
      }
      if (!rawSpkIds.includes(pId) || !rawSpkIds.includes(npcId)) continue;

      const thirdIds = rawSpkIds.filter(id => id !== pId && id !== npcId);
      const allThirdPresent = thirdIds.every(id => {
        const ent = state.npcs?.[id];
        return Boolean(
          ent &&
          ent.roomId === convRoomId &&
          !ent.pendingRoomTravel?.isFireEvac &&
          Math.hypot(ent.x - player.x, ent.y - player.y) <= 4.2
        );
      });

      if (allThirdPresent) {
        const turns = rawTurns.map(t => ({
          speakerId: t.speakerId || t.id || t.charId,
          text: t.text
        }));
        huddleMatches.push({ huddle: h, turns, spkIds: rawSpkIds });
      } else {
        const kept = rawTurns
          .filter(t => {
            const sid = t?.speakerId || t?.id || t?.charId;
            return sid === pId || sid === npcId;
          })
          .map(t => ({ speakerId: t.speakerId || t.id || t.charId, text: t.text }));
        const mentionsAbsentThird = thirdIds.some(tid => {
          const shortNorm = normalizeAccents(window.KLB.CAST_BY_ID?.[tid]?.shortName || '').trim();
          if (!shortNorm) return false;
          const re = new RegExp(`\\b${escapeRx(shortNorm)}\\b`, 'i');
          return kept.some(k => re.test(normalizeAccents(k.text)));
        });
        if (!mentionsAbsentThird && areTurnsAlternatingPair(kept, pId, npcId)) {
          huddleMatches.push({ huddle: h, turns: kept, spkIds: [pId, npcId] });
        }
      }
    }

    if (huddleMatches.length) {
      const curVibe = getCurrentDialogueVibe(state);
      const pairKey = 'pair_' + [pId, npcId].sort().join('__');
      const picked = pickFromShuffleBag(
        state,
        pairKey,
        huddleMatches,
        m => m.huddle.id || m.turns?.[0]?.text,
        {
          preferFns: [
            m => m.huddle.roomId === convRoomId && !m.huddle.work && !m.huddle.isWork && Boolean(curVibe && m.huddle.vibe === curVibe),
            m => m.huddle.roomId === convRoomId && Boolean(curVibe && m.huddle.vibe === curVibe),
            m => m.huddle.roomId === convRoomId && !m.huddle.work && !m.huddle.isWork,
            m => m.huddle.roomId === convRoomId,
            m => !m.huddle.work && !m.huddle.isWork && Boolean(curVibe && m.huddle.vibe === curVibe),
            m => !m.huddle.work && !m.huddle.isWork
          ]
        }
      );

      if (picked) {
        state._recentPlayerConvos = state._recentPlayerConvos || [];
        if (picked.huddle.id) {
          state._recentPlayerConvos.push(picked.huddle.id);
          if (state._recentPlayerConvos.length > 20) state._recentPlayerConvos.shift();
        }
        const speakers = picked.spkIds.map(id => (id === pId ? player : state.npcs?.[id])).filter(Boolean);
        const convoId = `pair_hud_${picked.huddle.id || 'grp'}_${Math.floor((state.timeMins || 0) * 10)}_${Math.random().toString(36).slice(2, 5)}`;
        scheduleMultiTurnConversation(state, convRoomId, speakers, picked.turns, convoId, {
          immediateFirst: true,
          inPlace: true
        });
        return {
          mode: 'huddle',
          huddleId: picked.huddle.id,
          turns: picked.turns,
          convoId,
          socialApplied
        };
      }
    }

    // Priority 4: Dynamic Character Pair Fallback
    const npcMeta = window.KLB.CAST_BY_ID?.[npcId] || { shortName: npcId };
    const playerMeta = window.KLB.CAST_BY_ID?.[pId] || { shortName: pId };
    const npcShort = npcMeta.shortName || npcMeta.name || npcId;
    const playerShort = playerMeta.shortName || playerMeta.name || pId;

    const hasRealTask = Boolean(npc.currentTaskText && npc.currentTaskText !== 'Arriving at KLB');
    const taskTxt = npc.currentTaskText;
    const greetingWord = curHour < 12 ? 'Morning' : (curHour < 17 ? 'Afternoon' : 'Evening');
    const isArchiePlayer = !state.spectatorMode && state.player?.id === 'archie_wall';
    const roundPiName = isArchiePlayer ? 'Jamie' : (state.mutators?.vijays_not_in ? 'Claire' : 'Vijay');
    const openerPool = hasRealTask
      ? [
          `${npcShort}, how is ${taskTxt} going?`,
          `Still on ${taskTxt}, ${npcShort}?`,
          `Need a hand on ${taskTxt}, ${npcShort}?`,
          `${npcShort}, wrap ${taskTxt} up soon?`,
          `Is ${taskTxt} behaving, ${npcShort}?`,
          `${npcShort}, break after ${taskTxt}?`,
          `Progress on ${taskTxt}, ${npcShort}?`,
          `${npcShort}, surviving ${taskTxt}?`,
          `Tea after ${taskTxt}, ${npcShort}?`
        ]
      : [
          `Hey ${npcShort}, how is your shift going today?`,
          `${npcShort}, fancy a coffee at Gordon's shortly?`,
          `${greetingWord} ${npcShort}, everything behaving in KLB?`,
          `${npcShort}, surviving the lab today or hiding upstairs?`,
          `Quick sanity check ${npcShort}, any dramas on your bench?`,
          `${npcShort}, reckon ${roundPiName} is doing bench rounds soon?`,
          `Got five minutes ${npcShort}, or chained to the hood?`,
          `${npcShort}, seen anyone claim the last biscuit upstairs?`,
          `Everything still running cleanly over there, ${npcShort}?`
        ];
    const openText = pickFromShuffleBag(
      state,
      'fallback_openers_' + (hasRealTask ? 'task' : 'gen'),
      openerPool,
      s => s
    ) || openerPool[0];
    const rawReply = getSpeechLineForNpc(npc, null, state).text;
    const replyText = rawReply.includes(playerShort)
      ? rawReply
      : `${playerShort} — ${rawReply}`;

    const turns = [
      { speakerId: pId, text: openText },
      { speakerId: npcId, text: replyText }
    ];
    const convoId = `pair_fb_${pId}_${npcId}_${Math.floor((state.timeMins || 0) * 10)}_${Math.random().toString(36).slice(2, 5)}`;
    scheduleMultiTurnConversation(state, convRoomId, [player, npc], turns, convoId, {
      immediateFirst: true,
      inPlace: true
    });
    return {
      mode: 'fallback',
      speakers: [pId, npcId],
      turns,
      convoId,
      socialApplied
    };
  }

  function triggerSampleRunCourtesy(state, senderId, targetRoom, roomId, opts = {}) {
    if (!state || !senderId || state.fireAlarm?.active) return { asked: false };
    if (targetRoom !== 'cib_lg1b_nmr' && targetRoom !== 'cib_lg11_ms') return { asked: false };
    if (roomId !== 'klb_2f' && roomId !== 'klb_3f') return { asked: false };

    const senderEnt = resolveEntityById(state, senderId);
    if (!senderEnt) return { asked: false };

    state._sampleAskCooldowns = state._sampleAskCooldowns || {};
    const nowMins = state.timeMins || 0;
    const lastAsk = state._sampleAskCooldowns[senderId];
    if (!opts.force && lastAsk != null && nowMins >= lastAsk && (nowMins - lastAsk) < 90) {
      return { asked: false };
    }

    const excludedIds = new Set(['alex_king', 'claire_carmalt', 'safety_inspector']);
    const colleagues = Object.values(state.npcs || {}).filter(
      n => n && n.roomId === roomId && n.id !== senderId && !excludedIds.has(n.id)
    );
    if (
      !state.spectatorMode &&
      state.player &&
      state.player.roomId === roomId &&
      senderId !== state.player.id &&
      (opts.force || (!state.player.isMoving && !state.activePlayerAction && Math.hypot(senderEnt.x - state.player.x, senderEnt.y - state.player.y) <= 4.2))
    ) {
      colleagues.push(state.player);
    }
    if (!colleagues.length) return { asked: false };

    const freeColleagues = colleagues.filter(ent => {
      if (!state.spectatorMode && ent === state.player) return true;
      return !ent.pendingRoomTravel && (ent.huddleLockTimer || 0) <= 0 &&
        ent.sim?.currentAction?.kind !== 'quench' && !ent.sim?.activeJob?.canOvercook;
    });
    const responderPool = freeColleagues.length ? freeColleagues : colleagues;
    const responderEnt = responderPool[Math.floor(Math.random() * responderPool.length)];
    const responderId = responderEnt.id;

    const senderName = window.KLB.CAST_BY_ID?.[senderId]?.shortName || senderId;
    const responderName = window.KLB.CAST_BY_ID?.[responderId]?.shortName || responderId;
    const kindKey = targetRoom === 'cib_lg1b_nmr' ? 'nmr' : 'ms';
    const srBank = window.KLB.SAMPLE_RUN_LINES?.[kindKey] || DEFAULT_SAMPLE_RUN_LINES[kindKey];
    const askPool = srBank?.ask || srBank?.asks || srBank?.askLines || DEFAULT_SAMPLE_RUN_LINES[kindKey].ask;
    const gaveSample = Math.random() < 0.55;
    const replyPool = gaveSample
      ? (srBank?.yes || srBank?.replyYes || srBank?.yesReplies || srBank?.accept || DEFAULT_SAMPLE_RUN_LINES[kindKey].yes)
      : (srBank?.no || srBank?.replyNo || srBank?.noReplies || srBank?.decline || DEFAULT_SAMPLE_RUN_LINES[kindKey].no);

    const interp = s => String(s || '')
      .replace(/\{target\}/g, responderName)
      .replace(/\{sender\}/g, senderName);
    const rawAsk = pickFromShuffleBag(
      state,
      'sample_' + kindKey + '_ask',
      askPool,
      s => s
    );
    const rawReply = pickFromShuffleBag(
      state,
      'sample_' + kindKey + '_' + (gaveSample ? 'yes' : 'no'),
      replyPool,
      s => s
    );
    const askLine = interp(pickRandomTemplate(rawAsk) || DEFAULT_SAMPLE_RUN_LINES[kindKey].ask[0]);
    const replyLine = interp(pickRandomTemplate(rawReply) || (gaveSample ? DEFAULT_SAMPLE_RUN_LINES[kindKey].yes[0] : DEFAULT_SAMPLE_RUN_LINES[kindKey].no[0]));

    state._sampleAskCooldowns[senderId] = nowMins;
    state._sampleRunAskCount = (state._sampleRunAskCount || 0) + 1;

    const convoId = `samplerun_${kindKey}_${senderId}_${Math.floor(nowMins * 10)}_${Math.random().toString(36).slice(2, 5)}`;
    const turns = [
      { speakerId: senderId, text: askLine },
      { speakerId: responderId, text: replyLine }
    ];
    scheduleMultiTurnConversation(state, roomId, [senderEnt, responderEnt], turns, convoId, {
      immediateFirst: true,
      inPlace: true
    });

    return { asked: true, responderId, responderName, askLine, replyLine, gaveSample };
  }

  function spendWhatsAppMinutes(state, mins = 10, callbacks = {}) {
    if (!state || state.spectatorMode || state.gameOver || state.victory) {
      return { elapsedMins: 0 };
    }
    const delta = Math.max(0, Number(mins) || 0);
    if (delta > 0) {
      advanceMinutes(state, delta, Object.assign({}, callbacks, {
        onRandomEvent: null,
        onFireAlarm: null,
        onSafetySweep: null,
        suppressRandomEvents: true
      }));
    }
    return {
      elapsedMins: delta,
      timeMins: state.timeMins,
      dayIdx: state.dayIdx,
      clockText: formatClock(state.dayIdx, state.timeMins)
    };
  }

  function triggerGroupHuddle(state) {
    if (!state || state.fireAlarm?.active) return false;
    const viewRoom = getViewRoom(state);
    const ALLOWED_HUDDLE_ROOMS = new Set([
      'klb_2f', 'klb_3f', 'gordons_cafe', 'meeting_room', 'cib_lg11_ms', 'cib_lg1b_nmr'
    ]);
    if (!viewRoom || !ALLOWED_HUDDLE_ROOMS.has(viewRoom)) {
      return false;
    }

    const clusters = HUDDLE_CLUSTERS[viewRoom];
    if (!clusters || !clusters.length) return false;

    const maxConvos = (viewRoom === 'klb_2f' || viewRoom === 'gordons_cafe') ? 2 : 1;
    const { activeConvoIds, busySpeakerIds } = getActiveRoomConversationInfo(state, viewRoom);
    if (activeConvoIds.size >= maxConvos) return false;

    // Autonomous Birthday Wishes Check
    if (state.birthday?.charId) {
      const targetId = state.birthday.charId;
      const targetEnt = resolveEntityById(state, targetId);
      const isPlayerTarget = !state.spectatorMode && targetEnt === state.player;
      const targetFree = targetEnt && targetEnt.roomId === viewRoom && !busySpeakerIds.has(targetId) &&
        (isPlayerTarget
          ? (!state.player.isMoving && !state.activePlayerAction)
          : (!isChokepointOrDoorway(viewRoom, targetEnt.x, targetEnt.y) && !targetEnt.pendingRoomTravel && (!targetEnt.path || targetEnt.path.length === 0) && (targetEnt.huddleLockTimer || 0) <= 0));
      if (targetFree && Math.random() < 0.45) {
        const greeters = Object.values(state.npcs || {}).filter(n =>
          n &&
          n.id !== targetId &&
          n.roomId === viewRoom &&
          !['alex_king', 'claire_carmalt', 'safety_inspector'].includes(n.id) &&
          !state.birthday.greetedBy?.[n.id] &&
          !busySpeakerIds.has(n.id) &&
          !isChokepointOrDoorway(viewRoom, n.x, n.y) &&
          !n.pendingRoomTravel &&
          (!n.path || n.path.length === 0) &&
          (n.huddleLockTimer || 0) <= 0 &&
          n.sim?.currentAction?.kind !== 'quench' &&
          (!isPlayerTarget || Math.hypot(n.x - state.player.x, n.y - state.player.y) <= 4.2)
        );
        if (greeters.length > 0) {
          const g = greeters[Math.floor(Math.random() * greeters.length)];
          const bRes = maybeTriggerBirthdayGreeting(state, g.id, targetId, viewRoom);
          if (bRes && bRes.triggered) return true;
        }
      }
    }

    // High-priority Weekly Signature Interaction (~60% when eligible) — defer if a fresh seated deskChat is ready
    const pool = (Array.isArray(window.KLB.GROUP_HUDDLES) && window.KLB.GROUP_HUDDLES.length)
      ? window.KLB.GROUP_HUDDLES
      : DEFAULT_GROUP_HUDDLES;

    const cqActive = Boolean(isCoffeeQuartetWindow(state));
    const cqMembers = new Set(window.KLB.COFFEE_QUARTET?.members || []);
    const recent = state._recentHuddles || [];

    const extractSpkIds = h => {
      const lines = (h.lines || h.turns || h.exchanges || []).slice(0, 4);
      const spkIds = [];
      for (const l of lines) {
        const sid = l.speakerId || l.id || l.charId;
        if (sid && !spkIds.includes(sid)) spkIds.push(sid);
      }
      return { lines, spkIds };
    };

    const isDeskSeatedNpc = n => Boolean(
      n &&
      (!n.path || n.path.length === 0) &&
      (
        ['weekly_report', 'manuscript_draft'].includes(n.sim?.currentAction?.kind) ||
        (n.sim?.currentAction?.kind === 'neighbour_stage' && n.sim?.currentAction?.stationType === 'writeup_desk')
      )
    );

    const areAllDeskSeatedClose = spkIds => {
      if (viewRoom !== 'klb_2f' && viewRoom !== 'klb_3f') return false;
      const spkNpcs = spkIds.map(id => state.npcs?.[id]).filter(Boolean);
      if (spkNpcs.length < 2 || spkNpcs.length !== spkIds.length || !spkNpcs.every(isDeskSeatedNpc)) return false;
      for (let i = 0; i < spkNpcs.length; i++) {
        for (let j = i + 1; j < spkNpcs.length; j++) {
          if (Math.hypot(spkNpcs[i].x - spkNpcs[j].x, spkNpcs[i].y - spkNpcs[j].y) > 6.5) return false;
        }
      }
      return true;
    };

    const curHour = getTimeHours(state);
    const dayIdx = state.dayIdx ?? null;

    const candidates = pool.filter(h => {
      if (!h || h.roomId !== viewRoom) return false;
      if (!isDialogueAllowedAtTime(h, curHour, dayIdx)) return false;
      const { lines, spkIds } = extractSpkIds(h);
      if (lines.length < 2) return false;
      if (spkIds.length < 2 || spkIds.length > 4) return false;

      for (const sid of spkIds) {
        if (busySpeakerIds.has(sid)) return false;
        const npc = state.npcs?.[sid];
        if (!npc || npc.roomId !== viewRoom || npc.pendingRoomTravel) return false;
        if ((npc.huddleLockTimer || 0) > 0) return false;
        if (npc.sim?.pendingJobStart) return false;
        if (cqActive && viewRoom === 'gordons_cafe' && cqMembers.has(sid)) return false;
        const job = npc.sim?.activeJob;
        if (job && job.canOvercook && job.status !== 'running') return false;
        if (npc.sim?.currentAction && ['quench', 'subtask_action', 'lunch', 'packed_lunch', 'aoe2_event', 'clean_workspace', 'smoke_break'].includes(npc.sim.currentAction.kind)) {
          return false;
        }
      }
      if (h.deskChat && !areAllDeskSeatedClose(spkIds)) return false;
      return true;
    });

    const deskChatCandidates = candidates.filter(h => Boolean(h.deskChat));
    const freshDeskChats = deskChatCandidates.filter(h => !h.id || !recent.slice(0, 6).includes(h.id));
    const seatedDeskCandidates = candidates.filter(h => areAllDeskSeatedClose(extractSpkIds(h).spkIds));
    const curVibe = getCurrentDialogueVibe(state);

    const launchChosenHuddle = (chosen, isInPlaceDesk) => {
      if (!chosen) return false;
      const { lines, spkIds } = extractSpkIds(chosen);
      const speakers = spkIds.map(id => state.npcs[id]).filter(Boolean);
      if (speakers.length < 2) return false;

      let assignedSlots = null;
      if (!isInPlaceDesk) {
        assignedSlots = allocateHuddleClusterSlots(state, viewRoom, spkIds);
        if (!assignedSlots) return false;
      }

      const convoId = `huddle_${chosen.id || 'grp'}_${Math.floor((state.timeMins || 0) * 10)}_${Math.random().toString(36).slice(2, 6)}`;
      const turns = lines.map(l => ({
        speakerId: l.speakerId || l.id || l.charId,
        text: l.text
      }));
      scheduleMultiTurnConversation(state, viewRoom, speakers, turns, convoId, isInPlaceDesk
        ? { inPlace: true, preserveDeskAction: true, applyNpcSocial: true }
        : { slots: assignedSlots, applyNpcSocial: true });

      if (chosen.id) {
        state._recentHuddles = [chosen.id].concat(recent).slice(0, 24);
      }
      state._huddleCount = (state._huddleCount || 0) + 1;
      return true;
    };

    if (freshDeskChats.length > 0) {
      const pickedDesk = pickFromShuffleBag(
        state,
        'huddles_' + viewRoom,
        freshDeskChats,
        h => h.id || (h.turns || h.lines || h.exchanges)?.[0]?.text,
        { preferFn: h => Boolean(curVibe && h.vibe === curVibe) }
      );
      if (launchChosenHuddle(pickedDesk, true)) return true;
    }

    if (Math.random() < 0.60) {
      const wsig = triggerWeeklySignatureInteraction(state, viewRoom);
      if (wsig && wsig.triggered) return true;
    }

    if (deskChatCandidates.length > 0) {
      const pickedDesk = pickFromShuffleBag(
        state,
        'huddles_' + viewRoom,
        deskChatCandidates,
        h => h.id || (h.turns || h.lines || h.exchanges)?.[0]?.text,
        { preferFn: h => Boolean(curVibe && h.vibe === curVibe) }
      );
      if (launchChosenHuddle(pickedDesk, true)) return true;
    }

    if (seatedDeskCandidates.length > 0) {
      const pickedSeated = pickFromShuffleBag(
        state,
        'huddles_' + viewRoom,
        seatedDeskCandidates,
        h => h.id || (h.turns || h.lines || h.exchanges)?.[0]?.text,
        { preferFn: h => Boolean(curVibe && h.vibe === curVibe) }
      );
      if (launchChosenHuddle(pickedSeated, true)) return true;
    }

    if (!candidates.length) return false;
    const chosen = pickFromShuffleBag(
      state,
      'huddles_' + viewRoom,
      candidates,
      h => h.id || (h.turns || h.lines || h.exchanges)?.[0]?.text,
      { preferFn: h => Boolean(curVibe && h.vibe === curVibe) }
    );
    return launchChosenHuddle(chosen, false);
  }

  function getSpeechLineForNpc(npc, preferCasualOverride = null, state = null) {
    if (!npc) return { text: 'Busy shift in KLB.', kind: 'casual' };
    const id = npc.id;
    const ext = window.KLB.SPEECH_LINES?.[id];
    const def = DEFAULT_SPEECH_LINES[id];
    const rawCasual = (ext?.casual && ext.casual.length) ? ext.casual : (def?.casual || []);
    const rawBench = (ext?.bench && ext.bench.length) ? ext.bench : (def?.bench || []);
    const meta = window.KLB.CAST_BY_ID?.[id];
    const curHour = getTimeHours(state);
    const dayIdx = state?.dayIdx ?? null;

    const filterTime = arr => arr.filter(item => isDialogueAllowedAtTime(item, curHour, dayIdx));
    const casualPool = filterTime(rawCasual);
    const benchPool = filterTime(rawBench);

    const preferCasual = preferCasualOverride !== null ? preferCasualOverride : (Math.random() < 0.82);
    let pool = preferCasual ? casualPool : benchPool;
    let kind = preferCasual ? 'casual' : 'bench';
    if (!pool.length) {
      pool = preferCasual ? benchPool : casualPool;
      kind = preferCasual ? 'bench' : 'casual';
    }
    if (!pool.length) pool = filterTime(Array.isArray(meta?.quotes) ? meta.quotes : []);
    if (!pool.length) pool = preferCasual ? rawCasual : rawBench;
    if (!pool.length) pool = preferCasual ? rawBench : rawCasual;
    if (!pool.length) pool = Array.isArray(meta?.quotes) ? meta.quotes : [];
    if (!pool.length) return { text: 'Busy shift in KLB.', kind: 'casual' };
    const picked = pickFromShuffleBag(
      state,
      'speech_' + id + '_' + kind,
      pool,
      item => (typeof item === 'string' ? item : (item?.text || JSON.stringify(item)))
    ) || pool[0];
    const text = typeof picked === 'string' ? picked : (picked?.text || 'Busy shift in KLB.');
    return { text, kind };
  }

  // ==================== 6. AUTONOMOUS SUB-TASK, LUNCH & SOCIAL AI ====================
  function isObjClaimed(state, roomId, objId, excludeNpcId) {
    for (const j of state.activeStationJobs || []) {
      if (j && j.roomId === roomId && j.objId === objId) return true;
    }
    for (const r of state.activeReactions || []) {
      if (r && r.roomId === roomId && r.objId === objId) return true;
    }
    for (const n of Object.values(state.npcs || {})) {
      if (!n || n.id === excludeNpcId) continue;
      if (n.sim?.activeJob && n.sim.activeJob.roomId === roomId && n.sim.activeJob.objId === objId) {
        return true;
      }
      if (n.sim?.pendingJobStart && n.sim.pendingJobStart.roomId === roomId && n.sim.pendingJobStart.objId === objId) {
        return true;
      }
      if (n.pendingRoomTravel?.finalRoom === roomId && n.pendingRoomTravel?.destObj?.id === objId) {
        return true;
      }
      if (n.roomId === roomId && n.busyObjId === objId) return true;
    }
    return false;
  }

  function isObjJobClaimedOnly(state, roomId, objId, excludeNpcId) {
    for (const j of state.activeStationJobs || []) {
      if (j && j.roomId === roomId && j.objId === objId) return true;
    }
    for (const r of state.activeReactions || []) {
      if (r && r.roomId === roomId && r.objId === objId) return true;
    }
    for (const n of Object.values(state.npcs || {})) {
      if (!n || n.id === excludeNpcId) continue;
      if (n.sim?.activeJob && n.sim.activeJob.roomId === roomId && n.sim.activeJob.objId === objId) {
        return true;
      }
    }
    return false;
  }

  function pickStationForStep(state, npc, roomId, stationTypes, groupPref, options = {}) {
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    if (!rm) return null;

    const types = Array.isArray(stationTypes) && stationTypes.length ? stationTypes : ['fumehood'];
    const cupboardHint = options.cupboardHint || null;
    const allowShared = Boolean(options.allowShared);

    const tryPick = (allowedTypes, enforceGroup, respectHint, claimMode) => {
      const candidates = [];
      for (const o of rm.objects || []) {
        if (!allowedTypes.includes(o.type)) continue;
        if (respectHint && cupboardHint && o.type === 'chem_cupboard' && !matchesCupboardHint(o.label, cupboardHint)) {
          continue;
        }
        if (enforceGroup && o.group && o.group !== 'none' && groupPref && o.group !== groupPref) continue;
        if (claimMode === 'strict' && isObjClaimed(state, roomId, o.id, npc.id)) continue;
        if (claimMode === 'job_only' && isObjJobClaimedOnly(state, roomId, o.id, npc.id)) continue;
        const adj = findFreeAdjacentWalkable(state, roomId, o, npc.id);
        if (adj) candidates.push({ obj: o, adj, roomId });
      }
      if (!candidates.length) return null;
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    // 1. Exact type, cupboardHint, group, unclaimed
    let picked = tryPick(types, true, true, 'strict');
    if (picked) return picked;

    // 2. Exact type, cupboardHint, any group, unclaimed
    picked = tryPick(types, false, true, 'strict');
    if (picked) return picked;

    // 3. For shared/short actions (PCs, cupboards, cafés, tables), allow sharing when no activeJob owns it
    if (allowShared || types.some(t => SHARED_STATION_TYPES.has(t))) {
      picked = tryPick(types, false, true, 'job_only');
      if (picked) return picked;
    }

    // 4. Fallback equivalent stations inside the room so nobody deadlocks
    const fallbackTypes = new Set(types);
    if (roomId === 'klb_2f') {
      if (types.includes('syringe_pump')) fallbackTypes.add('fumehood');
      if (types.some(t => ['heatblock', 'tcep_bench', 'gel_tank', 'centrifuge', 'biotage', 'buchi', 'tlc_station', 'balance_table'].includes(t))) {
        fallbackTypes.add('lab_bench');
      }
      if (types.includes('writeup_desk')) fallbackTypes.add('pc_terminal');
    }
    if (roomId === 'cib_lg11_ms') {
      if (types.includes('lcms_unit')) fallbackTypes.add('maldi_unit');
      if (types.includes('maldi_unit')) fallbackTypes.add('lcms_unit');
      if (types.includes('pc_terminal')) fallbackTypes.add('lab_bench');
    }
    if (roomId === 'cib_lg1b_nmr') {
      if (types.includes('nmr_magnet')) fallbackTypes.add('nmr_magnet');
      if (types.includes('pc_terminal')) fallbackTypes.add('lab_bench');
    }
    if (roomId === 'gordons_cafe') {
      fallbackTypes.add('cafe_table').add('cafe_counter');
    }

    const fbList = Array.from(fallbackTypes);
    picked = tryPick(fbList, true, false, 'strict')
      || tryPick(fbList, false, false, 'strict')
      || tryPick(fbList, false, false, 'job_only')
      || tryPick(fbList, false, false, 'none');
    return picked;
  }

  function pickStationForNPC(state, npcMeta, roomId) {
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    if (!rm) return null;
    const pool = (rm.objects || []).filter(o => {
      if (isObjClaimed(state, roomId, o.id, npcMeta.id)) return false;
      if (roomId === 'klb_2f') {
        const validType = [
          'fumehood', 'lab_bench', 'writeup_desk', 'buchi',
          'biotage', 'gel_tank', 'tcep_bench', 'balance_table'
        ].includes(o.type);
        if (!validType) return false;
        if (o.group && o.group !== 'none' && npcMeta.group && o.group !== npcMeta.group) return false;
        return true;
      }
      if (roomId === 'klb_3f') {
        if (o.type !== 'writeup_desk' && o.type !== 'tea_drawer') return false;
        if (o.group && o.group !== 'none' && npcMeta.group !== 'chudasama' && o.group === 'chudasama') return false;
        return true;
      }
      if (roomId === 'gordons_cafe') return o.type === 'cafe_table' || o.type === 'cafe_counter';
      return false;
    });
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function findObjectByTypeOrLabel(roomId, type, labelSub = null) {
    const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
    if (!rm) return null;
    const list = (rm.objects || []).filter(o => {
      if (o.type !== type) return false;
      if (labelSub && !matchesCupboardHint(o.label, labelSub)) return false;
      return true;
    });
    if (!list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  function getPortalCaptureRadius(roomId, travel) {
    if (travel?.isSpiralStairs) return 0.85;
    const meta = window.KLB.ROOM_META || {};
    const stairs = meta[roomId]?.stairsSpawn;
    if (stairs && travel?.portalCell && Math.hypot(travel.portalCell.x - stairs.x, travel.portalCell.y - stairs.y) <= 0.6) {
      return 0.85;
    }
    return 0.65;
  }

  function getDoorwaySpawn(state, roomId, npcId, customSpawn = null) {
    const base = customSpawn || window.KLB.ROOM_META?.[roomId]?.entrySpawn || { x: 15, y: 12, dir: 'W' };
    if (state?._headlessVerify) {
      const free = findFreeWalkableNear(state, roomId, base.x, base.y, npcId, true) || base;
      return { x: free.x, y: free.y, dir: base.dir || 'S' };
    }
    const free = findFreeWalkableNear(state, roomId, base.x, base.y, npcId, true, { allowChokepoints: true });
    if (free && Math.hypot(free.x - base.x, free.y - base.y) <= 1.5) {
      return { x: free.x, y: free.y, dir: base.dir || 'S' };
    }
    return { x: base.x, y: base.y, dir: base.dir || 'S' };
  }

  function computePortalPath(state, roomId, sx, sy, portalCell, npcId, forceCollisionFree = false) {
    if (!portalCell) return [];
    if (state?._headlessVerify) {
      const portalFree = findFreeWalkableNear(state, roomId, portalCell.x, portalCell.y, npcId, true, { allowChokepoints: true }) || portalCell;
      return findPathBFS(roomId, sx, sy, portalFree.x, portalFree.y, 65, state, npcId);
    }
    let path = forceCollisionFree
      ? findPathBFS(roomId, sx, sy, portalCell.x, portalCell.y, 65, null, null)
      : findPathBFS(roomId, sx, sy, portalCell.x, portalCell.y, 65, state, npcId);
    const reachesPortal = path.length > 0 &&
      path[path.length - 1].x === portalCell.x &&
      path[path.length - 1].y === portalCell.y;
    if (!reachesPortal) {
      const fallbackPath = findPathBFS(roomId, sx, sy, portalCell.x, portalCell.y, 65, null, null);
      if (fallbackPath.length > 0) path = fallbackPath;
    }
    if (path.length === 0 && Math.round(sx) === portalCell.x && Math.round(sy) === portalCell.y) {
      if (Math.hypot(sx - portalCell.x, sy - portalCell.y) > 0.45) {
        path = [{
          x: portalCell.x,
          y: portalCell.y,
          dir: dirBetween(sx, sy, portalCell.x, portalCell.y) || 'S'
        }];
      }
    }
    return path;
  }

  function getPortalHop(currentRoom, finalRoom, fireAlarmActive = false) {
    const meta = window.KLB.ROOM_META || {};
    const stairs2f = meta.klb_2f?.stairsSpawn || { x: 18, y: 2, dir: 'S' };
    const stairs3f = meta.klb_3f?.stairsSpawn || { x: 18, y: 2, dir: 'S' };
    const entry2f = meta.klb_2f?.entrySpawn || { x: 28, y: 12, dir: 'W' };
    const fireExit2f = meta.klb_2f?.fireExitCell || { x: 10, y: 2 };

    if (currentRoom === 'klb_3f') {
      return {
        nextRoom: 'klb_2f',
        portalCell: { x: stairs3f.x, y: stairs3f.y },
        arrivalSpawn: { x: stairs2f.x, y: stairs2f.y, dir: stairs2f.dir || 'S' },
        isFireEvac: false,
        isSpiralStairs: true
      };
    }

    if (currentRoom === 'klb_2f') {
      if (finalRoom === 'klb_3f') {
        return {
          nextRoom: 'klb_3f',
          portalCell: { x: stairs2f.x, y: stairs2f.y },
          arrivalSpawn: { x: stairs3f.x, y: stairs3f.y, dir: stairs3f.dir || 'S' },
          isFireEvac: false,
          isSpiralStairs: true
        };
      }
      if (finalRoom === 'offsite' && fireAlarmActive) {
        return {
          nextRoom: 'offsite',
          portalCell: { x: fireExit2f.x, y: fireExit2f.y },
          arrivalSpawn: null,
          isFireEvac: true,
          isSpiralStairs: false
        };
      }
      const destEntry = finalRoom === 'offsite' ? null : (meta[finalRoom]?.entrySpawn || null);
      return {
        nextRoom: finalRoom,
        portalCell: { x: entry2f.x, y: entry2f.y },
        arrivalSpawn: destEntry ? { ...destEntry } : null,
        isFireEvac: false,
        isSpiralStairs: false
      };
    }

    const curEntry = meta[currentRoom]?.entrySpawn || { x: 15, y: 12 };
    if (finalRoom === 'klb_3f') {
      return {
        nextRoom: 'klb_2f',
        portalCell: { x: curEntry.x, y: curEntry.y },
        arrivalSpawn: { x: entry2f.x, y: entry2f.y, dir: entry2f.dir || 'W' },
        isFireEvac: false,
        isSpiralStairs: false
      };
    }
    const destEntry = finalRoom === 'offsite' ? null : (meta[finalRoom]?.entrySpawn || null);
    return {
      nextRoom: finalRoom,
      portalCell: { x: curEntry.x, y: curEntry.y },
      arrivalSpawn: destEntry ? { ...destEntry } : null,
      isFireEvac: false,
      isSpiralStairs: false
    };
  }

  function completeNpcPortalHop(state, npc) {
    if (!state || !npc || !npc.pendingRoomTravel) return false;
    const travel = npc.pendingRoomTravel;
    const nextRoom = travel.nextRoom;
    state._portalHopsCompleted = (state._portalHopsCompleted || 0) + 1;

    if (nextRoom === 'offsite') {
      npc.roomId = 'offsite';
      npc.path = [];
      npc.pendingRoomTravel = null;
      npc.busyObjId = null;
      npc.huddleLockTimer = 0;
      npc.huddleTarget = null;
      npc.specsOn = false;
      if (travel.isFireEvac) {
        npc.currentTaskText = 'Evacuated outside KLB (Fire Alarm)';
      }
      return true;
    }

    const spawn = travel.arrivalSpawn || window.KLB.ROOM_META?.[nextRoom]?.entrySpawn || { x: 15, y: 12 };
    const freeSpawn = getDoorwaySpawn(state, nextRoom, npc.id, spawn);
    npc.roomId = nextRoom;
    npc.x = freeSpawn.x;
    npc.y = freeSpawn.y;
    npc.dir = spawn.dir || freeSpawn.dir || npc.dir;
    npc.huddleLockTimer = 0;
    npc.huddleTarget = null;
    npc.specsOn = nextRoom === 'klb_2f';

    if (nextRoom === travel.finalRoom) {
      npc.pendingRoomTravel = null;
      if (travel.destObj) {
        const adj = findFreeAdjacentWalkable(state, nextRoom, travel.destObj, npc.id)
          || findFreeWalkableNear(state, nextRoom, travel.destObj.x, travel.destObj.y, npc.id, false);
        if (adj) {
          npc.path = findPathBFS(nextRoom, npc.x, npc.y, adj.x, adj.y, 65, state, npc.id);
          if (npc.path.length === 0 && (Math.round(npc.x) !== adj.x || Math.round(npc.y) !== adj.y)) {
            npc.path = findPathBFS(nextRoom, npc.x, npc.y, adj.x, adj.y, 65, null, null);
          }
          if (npc.path.length === 0) faceObject(npc, travel.destObj);
        } else {
          npc.path = [];
        }
      } else if (travel.destPoint) {
        const ft = findFreeWalkableNear(state, nextRoom, travel.destPoint.x, travel.destPoint.y, npc.id, true) || travel.destPoint;
        npc.path = findPathBFS(nextRoom, npc.x, npc.y, ft.x, ft.y, 65, state, npc.id);
        if (npc.path.length === 0 && (Math.round(npc.x) !== ft.x || Math.round(npc.y) !== ft.y)) {
          npc.path = findPathBFS(nextRoom, npc.x, npc.y, ft.x, ft.y, 65, null, null);
        }
      } else {
        npc.path = [];
      }
      return true;
    }

    const nextHop = getPortalHop(nextRoom, travel.finalRoom, Boolean(state.fireAlarm?.active));
    npc.pendingRoomTravel = {
      finalRoom: travel.finalRoom,
      nextRoom: nextHop.nextRoom,
      portalCell: nextHop.portalCell,
      arrivalSpawn: nextHop.arrivalSpawn,
      destObj: travel.destObj || null,
      destPoint: travel.destPoint || null,
      isFireEvac: Boolean(nextHop.isFireEvac),
      isSpiralStairs: Boolean(nextHop.isSpiralStairs),
      waitSec: 0
    };
    npc.path = computePortalPath(state, nextRoom, npc.x, npc.y, nextHop.portalCell, npc.id, false);
    return true;
  }

  function beginNpcPortalTravel(state, npc, prevRoom, targetRoom, destObj, destPoint) {
    const alreadyTarget = npc.pendingRoomTravel?.finalRoom === targetRoom;
    const hop = getPortalHop(prevRoom, targetRoom, Boolean(state.fireAlarm?.active));
    npc.pendingRoomTravel = {
      finalRoom: targetRoom,
      nextRoom: hop.nextRoom,
      portalCell: hop.portalCell,
      arrivalSpawn: hop.arrivalSpawn,
      destObj: destObj || null,
      destPoint: destPoint || null,
      isFireEvac: Boolean(hop.isFireEvac),
      isSpiralStairs: Boolean(hop.isSpiralStairs),
      waitSec: 0
    };
    npc.path = computePortalPath(state, prevRoom, npc.x, npc.y, hop.portalCell, npc.id, false);
    if (!alreadyTarget && (prevRoom === 'klb_2f' || prevRoom === 'klb_3f') && (targetRoom === 'cib_lg1b_nmr' || targetRoom === 'cib_lg11_ms')) {
      triggerSampleRunCourtesy(state, npc.id, targetRoom, prevRoom);
    }
  }

  function moveNpcToRoomAndPoint(state, npc, targetRoom, tx, ty, teleport = false) {
    const prevRoom = npc.roomId;

    if (teleport) {
      npc.pendingRoomTravel = null;
      if (targetRoom === 'offsite') {
        npc.roomId = 'offsite';
        npc.path = [];
        npc.specsOn = false;
        return true;
      }
      const free = findFreeWalkableNear(state, targetRoom, tx, ty, npc.id, true) || { x: tx, y: ty };
      npc.roomId = targetRoom;
      npc.x = free.x;
      npc.y = free.y;
      npc.path = [];
      npc.specsOn = targetRoom === 'klb_2f';
      return true;
    }

    if (prevRoom === 'offsite') {
      npc.pendingRoomTravel = null;
      if (targetRoom === 'offsite') {
        npc.path = [];
        return true;
      }
      const freeSpawn = getDoorwaySpawn(state, targetRoom, npc.id);
      npc.roomId = targetRoom;
      npc.x = freeSpawn.x;
      npc.y = freeSpawn.y;
      npc.dir = freeSpawn.dir || npc.dir;
      npc.specsOn = targetRoom === 'klb_2f';
      const freeTarget = findFreeWalkableNear(state, targetRoom, tx, ty, npc.id, true) || { x: tx, y: ty };
      npc.path = findPathBFS(targetRoom, npc.x, npc.y, freeTarget.x, freeTarget.y, 65, state, npc.id);
      if (npc.path.length === 0 && (Math.round(npc.x) !== freeTarget.x || Math.round(npc.y) !== freeTarget.y)) {
        npc.path = findPathBFS(targetRoom, npc.x, npc.y, freeTarget.x, freeTarget.y, 65, null, null);
      }
      return true;
    }

    if (prevRoom !== targetRoom) {
      beginNpcPortalTravel(state, npc, prevRoom, targetRoom, null, targetRoom === 'offsite' ? null : { x: tx, y: ty });
      return true;
    }

    npc.pendingRoomTravel = null;
    if (targetRoom === 'offsite') {
      npc.path = [];
      return true;
    }
    const freeTarget = findFreeWalkableNear(state, targetRoom, tx, ty, npc.id, true) || { x: tx, y: ty };
    npc.path = findPathBFS(targetRoom, npc.x, npc.y, freeTarget.x, freeTarget.y, 65, state, npc.id);
    if (npc.path.length === 0 && (Math.round(npc.x) !== freeTarget.x || Math.round(npc.y) !== freeTarget.y)) {
      npc.path = findPathBFS(targetRoom, npc.x, npc.y, freeTarget.x, freeTarget.y, 65, null, null);
    }
    return true;
  }

  function moveNpcToRoomAndObj(state, npc, targetRoom, obj, teleport = false, precomputedAdj = null) {
    const prevRoom = npc.roomId;
    npc.busyObjId = obj ? obj.id : null;

    if (targetRoom === 'offsite') {
      return moveNpcToRoomAndPoint(state, npc, 'offsite', 0, 0, teleport);
    }

    const fallbackSpot = window.KLB.ROOM_META?.[targetRoom]?.entrySpawn || { x: 15, y: 12 };
    const adj = precomputedAdj || (obj
      ? (findFreeAdjacentWalkable(state, targetRoom, obj, npc.id) || findFreeWalkableNear(state, targetRoom, obj.x, obj.y, npc.id, false))
      : findFreeWalkableNear(state, targetRoom, fallbackSpot.x, fallbackSpot.y, npc.id, true));

    if (!adj) return false;

    if (teleport) {
      npc.pendingRoomTravel = null;
      npc.roomId = targetRoom;
      npc.x = adj.x;
      npc.y = adj.y;
      npc.path = [];
      npc.specsOn = targetRoom === 'klb_2f';
      if (obj) faceObject(npc, obj);
      return true;
    }

    if (prevRoom === 'offsite') {
      npc.pendingRoomTravel = null;
      const freeSpawn = getDoorwaySpawn(state, targetRoom, npc.id);
      npc.roomId = targetRoom;
      npc.x = freeSpawn.x;
      npc.y = freeSpawn.y;
      npc.dir = freeSpawn.dir || npc.dir;
      npc.specsOn = targetRoom === 'klb_2f';
      npc.path = findPathBFS(targetRoom, npc.x, npc.y, adj.x, adj.y, 65, state, npc.id);
      if (npc.path.length === 0 && (Math.round(npc.x) !== adj.x || Math.round(npc.y) !== adj.y)) {
        npc.path = findPathBFS(targetRoom, npc.x, npc.y, adj.x, adj.y, 65, null, null);
      }
      if (npc.path.length === 0 && obj) faceObject(npc, obj);
      return true;
    }

    if (prevRoom !== targetRoom) {
      beginNpcPortalTravel(state, npc, prevRoom, targetRoom, obj || null, { x: adj.x, y: adj.y });
      return true;
    }

    npc.pendingRoomTravel = null;
    npc.path = findPathBFS(targetRoom, npc.x, npc.y, adj.x, adj.y, 65, state, npc.id);
    if (npc.path.length === 0 && (Math.round(npc.x) !== adj.x || Math.round(npc.y) !== adj.y)) {
      npc.path = findPathBFS(targetRoom, npc.x, npc.y, adj.x, adj.y, 65, null, null);
    }
    if (npc.path.length === 0 && obj) faceObject(npc, obj);
    return true;
  }

  function recordMoraleFromExpStat(state, delta) {
    if (!state?._moraleFromExpStats) return;
    const s = state._moraleFromExpStats;
    if (delta > 0) {
      s.upCount += 1;
      s.totalUp += delta;
    } else if (delta < 0) {
      s.downCount += 1;
      s.totalDown += Math.abs(delta);
    } else {
      s.neutralCount += 1;
    }
  }

  function recordNpcLabBookItem(state, npc, step, quality, yieldPct, blueDyeMishap, overrideType = null) {
    const sim = npc.sim;
    const outSpec = step.dataOutput || {
      type: 'lcms',
      label: step.title,
      productPeak: 'Target Product',
      metricLabel: 'Conversion'
    };
    const figType = overrideType || outSpec.type || 'lcms';
    const q = clamp(Math.round(Number(quality) || 0), 0, 100);
    const y = clamp(Math.round(Number(yieldPct != null ? yieldPct : q) || 0), 0, 100);
    const item = {
      id: `npc_${npc.id}_fig_${sim.labBook.length + 1}_${step.index}`,
      stepIdx: step.index,
      type: figType,
      label: overrideType && outSpec.type !== overrideType ? `In-Process TLC: ${step.title}` : (outSpec.label || step.title),
      productPeak: outSpec.productPeak || 'Target Product',
      quality: q,
      yieldPct: y,
      hasSolventPeak: q < 76 && figType === 'nmr',
      hasAdduct: q < 78 && figType === 'lcms',
      hasOverReduction: q < 75 && figType === 'gel',
      hasBlueDyeMishap: Boolean(blueDyeMishap),
      notes: q >= 78 ? 'Autonomous clean conversion.' : 'Impurities / overcook detected.'
    };
    sim.labBook.push(item);

    const moraleDelta = applyExperimentOutcomeToMorale(sim, q, y);
    recordMoraleFromExpStat(state, moraleDelta);
    return item;
  }

  function completeNpcCampaignStep(state, npc, step, quality, yieldPct, blueDyeMishap, alreadyLoggedThisStep = false) {
    const sim = npc.sim;
    const q = clamp(Math.round(Number(quality) || 82), 20, 100);
    const y = clamp(Math.round(Number(yieldPct != null ? yieldPct : q) || 80), 20, 100);

    if (!alreadyLoggedThisStep) {
      recordNpcLabBookItem(state, npc, step, q, y, blueDyeMishap);
    }

    const severeFail = (q < 64 || (sim.toughWeek && q < 74)) && sim.retryingStep !== step.index && Math.random() < 0.55;
    if (severeFail) {
      sim.retryingStep = step.index;
      sim.subTaskIdx = 0;
      sim.stepPerf = null;
      sim.stepCooldownMins = 24 + Math.floor(Math.random() * 14);
      return;
    }

    if (!sim.completedSteps.includes(step.index)) {
      sim.completedSteps.push(step.index);
      sim.weeklyStats.stepsCompleted += 1;
    }
    const camp = window.KLB.CAMPAIGNS?.[npc.id];
    if (camp && sim.stepIdx < camp.steps.length - 1) {
      sim.stepIdx += 1;
    }
    sim.subTaskIdx = 0;
    sim.stepPerf = null;
    sim.manuscriptProgress = clamp(sim.manuscriptProgress + 2, 0, 100);
    if (sim.failures.length >= 2 && q < 72) sim.toughWeek = true;
    sim.stepCooldownMins = (sim.toughWeek ? 78 : q < 74 ? 42 : 18) + Math.floor(Math.random() * 16);
    refreshNpcSlideDeck(npc);
  }

  function refreshNpcSlideDeck(npc) {
    const sim = npc.sim;
    const lb = sim.labBook;
    if (!lb.length) return;

    const rushed = sim.toughWeek || sim.energy < 46 || sim.failures.length >= 2;
    const ordered = rushed
      ? lb.slice().reverse()
      : lb.slice().sort((a, b) => (b.quality || 0) - (a.quality || 0));
    const fig1 = ordered[0];
    const fig2 = ordered.find(f => f.id !== fig1.id && f.type !== fig1.type)
      || ordered.find(f => f.id !== fig1.id)
      || null;
    sim.slideDeck.fig1Id = fig1 ? fig1.id : null;
    sim.slideDeck.fig2Id = fig2 ? fig2.id : null;
    sim.slideDeck.ready = Boolean(fig1 && fig2 && sim.manuscriptProgress >= 55 && (!sim.toughWeek || Math.random() < 0.25));

    const avgQ = lb.reduce((s, f) => s + (f.quality || 0), 0) / lb.length;
    if (sim.completedSteps.length >= 5 && avgQ >= 84) {
      sim.slideDeck.framing = 'bold';
    } else if (sim.completedSteps.length < 4) {
      sim.slideDeck.framing = 'humble';
    } else {
      sim.slideDeck.framing = 'mechanistic';
    }

    if (npc.id === 'richard_spears') {
      sim.slideDeck.honestDisclosure = true;
    } else {
      const selFlawed = [fig1, fig2].some(
        f => f && (f.quality < 78 || f.hasBlueDyeMishap || f.hasSolventPeak || f.hasAdduct || f.hasOverReduction)
      );
      if (selFlawed && (sim.toughWeek || sim.energy < 52 || sim.manuscriptProgress < 50 || sim.failures.length >= 2) && Math.random() < 0.55) {
        sim.slideDeck.honestDisclosure = false;
      } else {
        sim.slideDeck.honestDisclosure = true;
      }
    }
  }

  function evaluateAutonomousFridayAudit(state, npc) {
    const sim = npc.sim;
    if (!sim || sim.auditResult) return;

    if (!sim.slideDeck.fig1Id && sim.labBook.length >= 1) {
      sim.slideDeck.fig1Id = sim.labBook[0].id;
    }
    if (!sim.slideDeck.fig2Id && sim.labBook.length >= 2) {
      sim.slideDeck.fig2Id = sim.labBook.find(f => f.id !== sim.slideDeck.fig1Id)?.id || null;
    }

    const mockState = {
      player: { id: npc.id },
      timeMins: state.timeMins,
      completedSteps: sim.completedSteps.slice(),
      labBook: sim.labBook.slice(),
      slideDeck: { ...sim.slideDeck },
      activeReactions: sim.activeJob ? [sim.activeJob] : [],
      weeklyReportProgress: sim.weeklyReportProgress,
      manuscriptProgress: sim.manuscriptProgress,
      patience: sim.patience,
      labCondition: getLabCondition(sim),
      safety: getLabCondition(sim),
      favours: sim.favours,
      abilFineOwed: sim.abilFineOwed,
      prep: {
        ...sim.prep,
        thiol_dirty: sim.thiolDirty,
        uncapped_waste: sim.uncappedWaste
      }
    };

    let res;
    if (window.KLB.SlideBuilder && typeof window.KLB.SlideBuilder.evaluateFridayAudit === 'function') {
      res = window.KLB.SlideBuilder.evaluateFridayAudit(mockState);
    } else {
      const stepScore = (sim.completedSteps.length / 5) * 2.0;
      const msScore = ((sim.weeklyReportProgress / 100) * 0.65 + (sim.manuscriptProgress / 100) * 0.85);
      const total = Math.round(clamp(stepScore + msScore + 4.5, 0, 10) * 10) / 10;
      res = { total, passed: total >= 6.0, patienceDelta: total >= 6.0 ? 5 : -8, breakdown: {}, vijayVerdictLines: [], chudReactions: [] };
    }

    const pDelta = applyFridayAuditPatience(sim, res);
    sim.auditResult = res;
    if (res.passed) sim.weeklyStats.auditsPassed += 1;
    else sim.weeklyStats.auditsFailed += 1;

    state._weeklyAudits = state._weeklyAudits || [];
    state._weeklyAudits.push({
      weekNum: state.weekNum,
      charId: npc.id,
      auditTimeMins: state.timeMins,
      total: res.total,
      passed: res.passed,
      patienceDelta: pDelta,
      avgQuality: res.avgQuality ?? 0,
      avgYield: res.avgYield ?? 0,
      steps: sim.completedSteps.length,
      weeklyReportProgress: Math.round(sim.weeklyReportProgress),
      manuscriptProgress: Math.round(sim.manuscriptProgress),
      labCondition: Math.round(getLabCondition(sim)),
      failures: sim.failures.slice()
    });
  }

  // ==================== 7. DEADLINES (THU 18:00 WEEKLY REPORT & FRI 18:00 MANUSCRIPT) ====================
  function evaluateWeeklyReportDeadline(state, callbacks = {}) {
    if (!state) return;
    const isArchiePlayer = !state.spectatorMode && state.player?.id === 'archie_wall';
    const piName = isArchiePlayer ? 'Jamie' : 'Vijay';
    if (!state.spectatorMode && !state.weeklyReportChecked) {
      const pct = clamp(Number(state.weeklyReportProgress) || 0, 0, 100);
      const sender = isArchiePlayer
        ? 'nafsika_forte'
        : pickNonPlayerBigChud(state, 'marcos_fernandez', 'daniel_richards');
      if (pct >= 100) {
        state.patience = clamp((state.patience ?? 82) + 6, 0, 100);
        pushWhatsApp(state, sender, `${piName} clocked your Thursday Weekly Report at 100% before 18:00 — solid.`, callbacks);
        callbacks.onToast?.(`Thursday Weekly Report submitted on time! (+6 ${piName} Patience)`);
      } else {
        const missingRatio = (100 - pct) / 100;
        const drop = Math.max(6, Math.round(18 * missingRatio));
        state.patience = clamp((state.patience ?? 82) - drop, 0, 100);
        pushWhatsApp(state, sender, `${piName} emailed asking why your Thursday Weekly Report was only ${Math.round(pct)}% at 18:00 (-${drop} Patience).`, callbacks);
        callbacks.onToast?.(`Missed Thu 18:00 Weekly Report (${Math.round(pct)}%) — -${drop} ${piName} Patience!`);
      }
      state.weeklyReportChecked = true;
    }

    const bigChudsSet = new Set(getBigChudsIds());
    for (const npc of Object.values(state.npcs || {})) {
      const sim = npc?.sim;
      if (!sim || !window.KLB.CAST_BY_ID?.[npc.id]?.playable || sim.weeklyReportChecked) continue;
      if (!bigChudsSet.has(npc.id)) {
        sim.weeklyReportChecked = true;
        continue;
      }
      const pct = clamp(Number(sim.weeklyReportProgress) || 0, 0, 100);
      let delta = 0;
      if (pct >= 100) {
        delta = 6;
        sim.patience = clamp((sim.patience ?? 82) + 6, 0, 100);
        sim.weeklyStats.weeklyReportsOnTime += 1;
      } else {
        const missingRatio = (100 - pct) / 100;
        delta = -Math.max(6, Math.round(18 * missingRatio));
        sim.patience = clamp((sim.patience ?? 82) + delta, 0, 100);
        sim.failures.push('missed_weekly_report');
        sim.weeklyStats.weeklyReportsMissed += 1;
      }
      sim.weeklyReportChecked = true;
      state._weeklyReportRecords = state._weeklyReportRecords || [];
      state._weeklyReportRecords.push({
        weekNum: state.weekNum,
        charId: npc.id,
        progress: Math.round(pct),
        onTime: pct >= 100,
        patienceDelta: delta
      });
    }
  }

  function evaluateManuscriptDeadline(state, callbacks = {}) {
    if (!state) return;
    const isArchiePlayer = !state.spectatorMode && state.player?.id === 'archie_wall';
    const piName = isArchiePlayer ? 'Jamie' : 'Vijay';
    if (!state.spectatorMode && !state.manuscriptChecked) {
      const pct = clamp(Number(state.manuscriptProgress) || 0, 0, 100);
      const sender = isArchiePlayer
        ? 'nafsika_forte'
        : pickNonPlayerBigChud(state, 'marcos_fernandez', 'daniel_richards');
      if (pct >= 100) {
        state.patience = clamp((state.patience ?? 82) + 6, 0, 100);
        pushWhatsApp(state, sender, `${piName} approved your Friday Manuscript Draft at 100% before 18:00.`, callbacks);
        callbacks.onToast?.(`Friday Manuscript Draft complete on time! (+6 ${piName} Patience)`);
      } else {
        const missingRatio = (100 - pct) / 100;
        const drop = Math.max(1, Math.round(24 * missingRatio));
        state.patience = clamp((state.patience ?? 82) - drop, 0, 100);
        pushWhatsApp(state, sender, `${piName} flagged your Friday Manuscript Draft at ${Math.round(pct)}% at 18:00 (-${drop} Patience).`, callbacks);
        callbacks.onToast?.(`Incomplete Fri 18:00 Manuscript Draft (${Math.round(pct)}%) — -${drop} ${piName} Patience!`);
      }
      state.manuscriptChecked = true;
    }

    const bigChudsSet = new Set(getBigChudsIds());
    for (const npc of Object.values(state.npcs || {})) {
      const sim = npc?.sim;
      if (!sim || !window.KLB.CAST_BY_ID?.[npc.id]?.playable || sim.manuscriptChecked) continue;
      if (!bigChudsSet.has(npc.id)) {
        sim.manuscriptChecked = true;
        continue;
      }
      const pct = clamp(Number(sim.manuscriptProgress) || 0, 0, 100);
      let delta = 0;
      if (pct >= 100) {
        delta = 6;
        sim.patience = clamp((sim.patience ?? 82) + 6, 0, 100);
        sim.weeklyStats.manuscriptsOnTime += 1;
      } else {
        const missingRatio = (100 - pct) / 100;
        delta = -Math.max(1, Math.round(24 * missingRatio));
        sim.patience = clamp((sim.patience ?? 82) + delta, 0, 100);
        sim.failures.push('missed_manuscript');
        sim.weeklyStats.manuscriptsMissed += 1;
      }
      sim.manuscriptChecked = true;
      state._manuscriptRecords = state._manuscriptRecords || [];
      state._manuscriptRecords.push({
        weekNum: state.weekNum,
        charId: npc.id,
        progress: Math.round(pct),
        onTime: pct >= 100,
        patienceDelta: delta
      });
    }
  }

  // ==================== 8. SMOOTH JOB / ACTION ADVANCEMENT (60 FPS + HEADLESS) ====================
  function updateSingleJobStatus(state, job, deltaMins, callbacks) {
    if (!job || deltaMins <= 0) return;
    job.elapsedMins = (job.elapsedMins || 0) + deltaMins;
    if (state.weatherMode === 'heatwave' && job.isCold4C && Math.random() < 0.03 * deltaMins) {
      job.prepScore = Math.max(30, (job.prepScore || 85) - 2);
    }

    const canOvercook = job.canOvercook !== undefined ? Boolean(job.canOvercook) : (Number(job.sweetSpotMins) > 0);
    const targetMins = Number(job.targetMins) || 15;
    const sweetSpotMins = Number(job.sweetSpotMins) || 55;
    const prevStatus = job.status || 'running';
    let nextStatus = prevStatus;
    const elapsedCheck = job.elapsedMins + 1e-9;

    if (canOvercook) {
      if (elapsedCheck >= targetMins + sweetSpotMins) nextStatus = 'overcooked';
      else if (elapsedCheck >= targetMins) nextStatus = 'sweet';
      else nextStatus = 'running';
    } else {
      if (elapsedCheck >= targetMins) nextStatus = 'ready';
      else nextStatus = 'running';
    }

    if (nextStatus !== prevStatus) {
      job.status = nextStatus;
      if (nextStatus === 'ready') {
        job.readyMins = (job.readyMins || 0) + Math.max(0, job.elapsedMins - targetMins);
      }
      callbacks?.onJobStatusChange?.(job, prevStatus, nextStatus);
      if (nextStatus === 'overcooked') {
        const pShort = window.KLB.CAST_BY_ID?.[state.player?.id]?.shortName || 'team';
        const sender = pickNonPlayerBigChud(state, 'marcos_fernandez', 'daniel_richards');
        pushWhatsApp(state, sender, `Heads up @${pShort} — Nafsika spotted your "${job.title || job.label || 'reaction'}" going past its sweet-spot window!`, callbacks);
        if (typeof window !== 'undefined' && window.KLB.Audio) window.KLB.Audio.playSfx('warning');
      } else if (nextStatus === 'sweet' || nextStatus === 'ready') {
        if (typeof window !== 'undefined' && window.KLB.Audio) window.KLB.Audio.playSfx('success');
        if (!callbacks?.onJobStatusChange && callbacks?.onToast) {
          callbacks.onToast(
            nextStatus === 'sweet'
              ? `"${job.title || job.label}" reached its Sweet-Spot Window! Work it up before it overcooks.`
              : `"${job.title || job.label}" is ready for collection!`
          );
        }
      }
    } else if (nextStatus === 'ready') {
      job.readyMins = (job.readyMins || 0) + deltaMins;
    }

    if (
      !state.spectatorMode &&
      job.roomId === 'cib_lg1b_nmr' &&
      job.status === 'ready' &&
      (job.readyMins || 0) > 45 &&
      !job._abilFineApplied
    ) {
      job._abilFineApplied = true;
      state.abilFineOwed = true;
      pushWhatsApp(
        state,
        'abil_aliev',
        'Abil (LG1b NMR): "Your NMR tube stayed uncollected >45 mins and is now in the Sample Fridge (£130 fine). Collect your NMR tube or settle the fine!"',
        callbacks
      );
      callbacks?.onToast?.('Dr Abil Aliev locked your uncollected NMR tube in the Sample Fridge! Collect your NMR tube or settle the fine.');
    }
  }

  function advanceActiveJobs(state, deltaMins, callbacks = {}) {
    if (!state || deltaMins <= 0) return;
    const seen = new Set();
    for (const job of state.activeStationJobs || []) {
      if (!job) continue;
      seen.add(job);
      if (job.id) seen.add(job.id);
      updateSingleJobStatus(state, job, deltaMins, callbacks);
    }
    for (const rxn of state.activeReactions || []) {
      if (!rxn || seen.has(rxn) || (rxn.id && seen.has(rxn.id))) continue;
      seen.add(rxn);
      updateSingleJobStatus(state, rxn, deltaMins, callbacks);
    }
  }

  function advancePlayerAction(state, deltaMins, callbacks = {}) {
    if (!state || state.spectatorMode || !state.activePlayerAction || deltaMins <= 0) return;
    const act = state.activePlayerAction;
    act.elapsedMins = (act.elapsedMins || 0) + deltaMins;

    if (act.kind === 'weekly_report') {
      const baseRate = Number(act.ratePerMin) > 0 ? Number(act.ratePerMin) : 1.14;
      const rate = baseRate * getWriteupEnergyFactor(state.energy);
      state.weeklyReportProgress = clamp((Number(state.weeklyReportProgress) || 0) + deltaMins * rate, 0, 100);
      state.energy = clamp((state.energy ?? 80) - 0.045 * deltaMins, 0, 100);
      act.progress = clamp(state.weeklyReportProgress / 100, 0, 1);
      if (state.weeklyReportProgress + 1e-9 >= 100) {
        state.weeklyReportProgress = 100;
        state.activePlayerAction = null;
        callbacks?.onPlayerActionComplete?.(act);
      }
      return;
    }

    if (act.kind === 'manuscript_draft') {
      const baseRate = Number(act.ratePerMin) > 0 ? Number(act.ratePerMin) : 0.88;
      const rate = baseRate * getWriteupEnergyFactor(state.energy);
      state.manuscriptProgress = clamp((Number(state.manuscriptProgress) || 0) + deltaMins * rate, 0, 100);
      state.energy = clamp((state.energy ?? 80) - 0.045 * deltaMins, 0, 100);
      act.progress = clamp(state.manuscriptProgress / 100, 0, 1);
      if (state.manuscriptProgress + 1e-9 >= 100) {
        state.manuscriptProgress = 100;
        state.activePlayerAction = null;
        callbacks?.onPlayerActionComplete?.(act);
      }
      return;
    }

    const targetMins = Number(act.targetMins) || 0;
    if (targetMins > 0 && act.elapsedMins + 1e-9 >= targetMins) {
      act.elapsedMins = targetMins;
      state.activePlayerAction = null;
      callbacks?.onPlayerActionComplete?.(act);
    }
  }

  function advanceFireAlarm(state, deltaMins, callbacks = {}) {
    if (!state?.fireAlarm?.active || deltaMins <= 0) return;
    const prevElapsed = state.fireAlarm.elapsedMins || 0;
    state.fireAlarm.elapsedMins = prevElapsed + deltaMins;

    if (
      !state.spectatorMode &&
      (state.player?.roomId === 'klb_2f' || state.player?.roomId === 'klb_3f') &&
      state.fireAlarm.elapsedMins > 15
    ) {
      const overdueMins = Math.max(0, state.fireAlarm.elapsedMins - Math.max(15, prevElapsed));
      if (overdueMins > 0) {
        setLabCondition(state, getLabCondition(state) - 0.75 * overdueMins);
      }
    }

    state.fireAlarm.remainingMins = Math.max(0, (state.fireAlarm.remainingMins || 0) - deltaMins);
    if (state.fireAlarm.remainingMins <= 1e-9) {
      state.fireAlarm.remainingMins = 0;
      state.fireAlarm.active = false;
      for (const npc of Object.values(state.npcs || {})) {
        if (npc?.pendingRoomTravel?.isFireEvac) {
          npc.pendingRoomTravel = null;
          npc.path = [];
        }
      }
      const sender = pickNonPlayerBigChud(state, 'marcos_fernandez', 'daniel_richards');
      pushWhatsApp(state, sender, 'All clear! Fire alarm test finished — everyone back into Lab 230 (check your reactions).', callbacks);
      if (callbacks?.onAlertClear) callbacks.onAlertClear();
      syncNPCSchedules(state, false, callbacks);
    }
  }

  function tickNpcJobsAndActions(state, deltaMins) {
    if (!state || deltaMins <= 0) return;
    for (const npc of Object.values(state.npcs || {})) {
      const sim = npc?.sim;
      if (!sim) continue;

      const job = sim.activeJob || sim.activeRxn;
      if (job) {
        job.elapsedMins = (job.elapsedMins || 0) + deltaMins;
        if (state.weatherMode === 'heatwave' && job.isCold4C && Math.random() < 0.03 * deltaMins) {
          job.prepScore = Math.max(30, (job.prepScore || 85) - 2);
        }
        const prevStatus = job.status || 'running';
        const canOvercook = Boolean(job.canOvercook);
        const elapsedCheck = job.elapsedMins + 1e-9;
        if (canOvercook) {
          if (elapsedCheck >= job.targetMins + job.sweetSpotMins) {
            job.status = 'overcooked';
            if (prevStatus !== 'overcooked') {
              if (Array.isArray(sim.failures)) sim.failures.push('overcook');
              if (sim.weeklyStats) sim.weeklyStats.overcooks += 1;
            }
          } else if (elapsedCheck >= job.targetMins) {
            job.status = 'sweet';
          }
        } else {
          if (elapsedCheck >= job.targetMins) {
            job.status = 'ready';
          }
        }
        if (job.targetMins > 0) {
          job.progress = clamp(job.elapsedMins / job.targetMins, 0, 1);
        }
      }

      const act = sim.currentAction;
      const atActionStation = Boolean(
        act && (act.kind === 'smoke_break' || (!npc._retryTarget && distToActionTarget(npc, act) <= 2.4))
      );
      if (act && atActionStation && !npc.pendingRoomTravel && (!npc.path || npc.path.length === 0)) {
        act.elapsedMins = (act.elapsedMins || 0) + deltaMins;
        if (act.kind === 'weekly_report') {
          const baseRate = Number(act.ratePerMin) > 0 ? Number(act.ratePerMin) : 1.14;
          const rate = baseRate * getWriteupEnergyFactor(sim.energy);
          sim.weeklyReportProgress = clamp((sim.weeklyReportProgress || 0) + deltaMins * rate, 0, 100);
          sim.energy = clamp((sim.energy ?? 80) - 0.035 * deltaMins, 0, 100);
          if (sim.weeklyReportProgress + 1e-9 >= 100) {
            sim.weeklyReportProgress = 100;
            act.elapsedMins = Math.max(act.elapsedMins, Number(act.targetMins) || 0);
          }
        } else if (act.kind === 'manuscript_draft') {
          const baseRate = Number(act.ratePerMin) > 0 ? Number(act.ratePerMin) : 0.88;
          const rate = baseRate * getWriteupEnergyFactor(sim.energy);
          sim.manuscriptProgress = clamp((sim.manuscriptProgress || 0) + deltaMins * rate, 0, 100);
          sim.energy = clamp((sim.energy ?? 80) - 0.035 * deltaMins, 0, 100);
          if (sim.manuscriptProgress + 1e-9 >= 100) {
            sim.manuscriptProgress = 100;
            act.elapsedMins = Math.max(act.elapsedMins, Number(act.targetMins) || 0);
          }
        }
        if (act.targetMins > 0) {
          act.progress = clamp(act.elapsedMins / act.targetMins, 0, 1);
        }
      }
    }
  }

  // ==================== 9. BIG-CHUD AUTONOMOUS AI ====================
  function computeSubTaskChoiceStats(state, npc, step, subTask) {
    const sim = npc.sim;
    const rushed = sim.energy < 42 || sim.morale < 42 || isNeglectingPreferredBreak(sim, state.timeMins);
    let mistakeProb = 0.04;
    if (rushed) mistakeProb += 0.14;
    if (sim.toughWeek) mistakeProb += 0.16;

    const optimal = Math.random() >= mistakeProb;
    let baseQ = optimal
      ? clamp(Math.round(86 + Math.random() * 11 - (rushed ? 5 : 0)), 72, 98)
      : clamp(Math.round(54 + Math.random() * 18), 38, 73);
    let baseY = optimal
      ? clamp(Math.round(83 + Math.random() * 13 - (rushed ? 6 : 0)), 66, 98)
      : clamp(Math.round(48 + Math.random() * 20), 32, 71);

    if (!optimal) {
      sim.failures.push('wrong_choice');
      sim.weeklyStats.prepFailures += 1;
    }

    // Max TCEP quirk on TCEP/rebridging steps
    if (npc.id === 'maximillian_lee' && /rebridg|tcep|stapling/i.test(step.title || '') && !sim.prep.tcep_buffered) {
      if (Math.random() < 0.22) {
        sim.failures.push('tcep_gamble');
        sim.weeklyStats.quirkFailures += 1;
        baseQ = Math.max(35, baseQ - 15);
        baseY = Math.max(30, baseY - 14);
      } else {
        sim.prep.tcep_buffered = true;
      }
    }

    // Peter low-energy / late-shift blue LDS dye spill
    let blueDyeMishap = false;
    const peterHour = (state.timeMins || 600) / 60;
    if (npc.id === 'peter_szijj' && (sim.energy < 68 || (peterHour >= 16.5 && sim.energy < 78)) && Math.random() < 0.22) {
      blueDyeMishap = true;
      sim.failures.push('blue_dye_spill');
      sim.weeklyStats.quirkFailures += 1;
      baseQ = Math.max(30, baseQ - 16);
    }

    // Occasional careless bench hazard (uncapped waste / specs off) on tough weeks or fatigue
    if ((sim.toughWeek || sim.energy < 48) && Math.random() < 0.16) {
      sim.uncappedWaste = true;
    }
    if ((sim.toughWeek || sim.energy < 45) && Math.random() < 0.10) {
      npc.specsOn = false;
    } else if (subTask.roomId === 'klb_2f') {
      npc.specsOn = true;
    }

    // Minigame contribution
    if (subTask.minigame) {
      const mgScore = rushed ? (66 + Math.random() * 18) : (82 + Math.random() * 15);
      baseQ = clamp(Math.round(baseQ * 0.8 + mgScore * 0.2), 25, 99);
      baseY = clamp(Math.round(baseY * 0.85 + mgScore * 0.15), 25, 99);
    }

    // Character perks
    if (npc.id === 'andre_shamsabadi' && subTask.stationTypes?.includes('biotage')) {
      baseQ = clamp(baseQ + 4, 25, 99);
    }

    return { quality: baseQ, yieldPct: baseY, blueDyeMishap };
  }

  function startNpcSubTask(state, npc, meta, step, subTask) {
    const sim = npc.sim;
    const roomId = subTask.roomId || 'klb_2f';

    // Handle CIB facility blockers before submitting NMR / LC-MS
    if (roomId === 'cib_lg11_ms' && sim.lcmsBroken) {
      const kerstiDesk = findObjectByTypeOrLabel('cib_lg11_ms', 'writeup_desk');
      if (kerstiDesk && moveNpcToRoomAndObj(state, npc, 'cib_lg11_ms', kerstiDesk, false)) {
        sim.currentAction = {
          kind: 'fix_lcms',
          label: 'Flushing LG11 LC-MS',
          roomId: 'cib_lg11_ms',
          objId: kerstiDesk.id,
          x: kerstiDesk.x,
          y: kerstiDesk.y,
          elapsedMins: 0,
          targetMins: npc.id === 'daniel_richards' ? 10 : 20
        };
        npc.currentTaskText = 'Flushing PEG from LG11 LC-MS';
        return true;
      }
    }

    if (roomId === 'cib_lg1b_nmr' && sim.abilFineOwed) {
      const abilDesk = findObjectByTypeOrLabel('cib_lg1b_nmr', 'writeup_desk');
      if (abilDesk && moveNpcToRoomAndObj(state, npc, 'cib_lg1b_nmr', abilDesk, false)) {
        sim.currentAction = {
          kind: 'fix_abil',
          label: 'Retrieving NMR Tube',
          roomId: 'cib_lg1b_nmr',
          objId: abilDesk.id,
          x: abilDesk.x,
          y: abilDesk.y,
          elapsedMins: 0,
          targetMins: 14
        };
        npc.currentTaskText = 'Collecting NMR tube from Abil Fridge';
        return true;
      }
    }

    if (subTask.mode === 'action') {
      const picked = pickStationForStep(state, npc, roomId, subTask.stationTypes, meta.group || 'chudasama', {
        cupboardHint: subTask.cupboardHint,
        allowShared: true
      });
      if (!picked || !moveNpcToRoomAndObj(state, npc, roomId, picked.obj, false, picked.adj)) {
        return false;
      }
      sim.currentAction = {
        kind: 'subtask_action',
        label: subTask.label,
        roomId,
        objId: picked.obj.id,
        x: picked.obj.x,
        y: picked.obj.y,
        elapsedMins: 0,
        targetMins: Math.max(2, Number(subTask.durationMins) || 4),
        subTask
      };
      npc.currentTaskText = subTask.label;
      return true;
    }

    if (subTask.mode === 'wait') {
      // LC-MS glitch chance on submission (~10%)
      if (roomId === 'cib_lg11_ms' && subTask.stationTypes?.includes('lcms_unit')) {
        const baseChance = state.mutators?.lcms_chaos ? 0.25 : 0.10;
        const failChance = npc.id === 'daniel_richards' ? baseChance * 0.6 : baseChance;
        if (Math.random() < failChance) {
          sim.lcmsBroken = true;
          sim.failures.push('lcms_broken');
          sim.weeklyStats.facilityFailures += 1;
          const kerstiDesk = findObjectByTypeOrLabel('cib_lg11_ms', 'writeup_desk');
          if (kerstiDesk && moveNpcToRoomAndObj(state, npc, 'cib_lg11_ms', kerstiDesk, false)) {
            sim.currentAction = {
              kind: 'fix_lcms',
              label: 'Flushing LG11 LC-MS',
              roomId: 'cib_lg11_ms',
              objId: kerstiDesk.id,
              x: kerstiDesk.x,
              y: kerstiDesk.y,
              elapsedMins: 0,
              targetMins: npc.id === 'daniel_richards' ? 10 : 18
            };
            npc.currentTaskText = 'LG11 LC-MS down — flushing source';
            return true;
          }
        }
      }

      const picked = pickStationForStep(state, npc, roomId, subTask.stationTypes, roomId === 'klb_2f' ? (meta.group || 'chudasama') : 'none', {
        allowShared: false
      });
      if (!picked || !moveNpcToRoomAndObj(state, npc, roomId, picked.obj, false, picked.adj)) {
        return false;
      }

      // Evaluate choice / minigame quality for this step or sub-task
      if (subTask.triggersChoice || !sim.stepPerf) {
        const stats = computeSubTaskChoiceStats(state, npc, step, subTask);
        sim.stepPerf = {
          ...(sim.stepPerf || {}),
          quality: stats.quality,
          yieldPct: stats.yieldPct,
          blueDyeMishap: Boolean(sim.stepPerf?.blueDyeMishap || stats.blueDyeMishap)
        };
      } else {
        // Check Max TCEP quirk even when TCEP is a secondary wait subtask (e.g. step 2 sub 2)
        if (npc.id === 'maximillian_lee' && !sim.prep.tcep_buffered &&
            (subTask.stationTypes?.includes('tcep_bench') || /rebridg|tcep|stapling/i.test(subTask.label || step.title || ''))) {
          if (Math.random() < 0.24) {
            sim.failures.push('tcep_gamble');
            sim.weeklyStats.quirkFailures += 1;
            sim.stepPerf.quality = Math.max(35, sim.stepPerf.quality - 16);
            sim.stepPerf.yieldPct = Math.max(30, sim.stepPerf.yieldPct - 14);
          } else {
            sim.prep.tcep_buffered = true;
          }
        }
        // Check Peter low-energy / late-shift blue dye spill on gel_tank / heatblock / tcep_bench
        const pHour = (state.timeMins || 600) / 60;
        if (npc.id === 'peter_szijj' && (sim.energy < 68 || (pHour >= 16.5 && sim.energy < 78)) &&
            subTask.stationTypes?.some(t => ['gel_tank', 'heatblock', 'tcep_bench'].includes(t)) &&
            !sim.stepPerf.blueDyeMishap && Math.random() < 0.22) {
          sim.stepPerf.blueDyeMishap = true;
          sim.failures.push('blue_dye_spill');
          sim.weeklyStats.quirkFailures += 1;
          sim.stepPerf.quality = Math.max(30, sim.stepPerf.quality - 16);
        }
        if (subTask.minigame) {
          const rushed = sim.energy < 42 || sim.morale < 42;
          const mgScore = rushed ? (68 + Math.random() * 16) : (84 + Math.random() * 13);
          sim.stepPerf.quality = clamp(Math.round(sim.stepPerf.quality * 0.85 + mgScore * 0.15), 25, 99);
          if (npc.id === 'andre_shamsabadi' && subTask.minigame === 'biotage') {
            sim.stepPerf.quality = clamp(sim.stepPerf.quality + 4, 25, 99);
          }
        }
      }

      const durMult = (npc.id === 'andre_shamsabadi' && subTask.stationTypes?.includes('biotage')) ? 0.8 : 1.0;
      const sweetMult = state.mutators?.eternal_heatwave ? 0.8 : 1.0;

      const jobSpec = {
        id: `npc_job_${npc.id}_${step.index}_${sim.subTaskIdx}`,
        stepIdx: step.index,
        subTaskIdx: sim.subTaskIdx,
        ownerId: npc.id,
        ownerName: meta.shortName || npc.id,
        kind: subTask.canOvercook ? 'reaction' : 'instrument',
        title: subTask.label,
        label: subTask.label,
        roomId,
        objId: picked.obj.id,
        stationType: picked.obj.type,
        x: picked.obj.x,
        y: picked.obj.y,
        elapsedMins: 0,
        targetMins: Math.max(4, Math.round((Number(subTask.durationMins) || 14) * durMult)),
        sweetSpotMins: subTask.canOvercook
          ? Math.max(15, Math.round((Number(subTask.sweetSpotMins) || 55) * sweetMult))
          : (Number(subTask.sweetSpotMins) || 180),
        canOvercook: Boolean(subTask.canOvercook),
        prepScore: sim.stepPerf?.quality ?? 86,
        yieldScore: sim.stepPerf?.yieldPct ?? 84,
        blueDyeMishap: Boolean(sim.stepPerf?.blueDyeMishap),
        isCold4C: picked.obj.type === 'fridge_4c' || /4\s*°?\s*C/i.test(step.title || ''),
        status: 'running',
        progress: 0
      };

      if (!npc.path || npc.path.length === 0) {
        sim.activeJob = jobSpec;
        sim.activeRxn = jobSpec;
        npc.currentTaskText = subTask.label;
      } else {
        sim.pendingJobStart = { jobSpec, obj: picked.obj };
        npc.currentTaskText = `Walking to ${subTask.label}`;
      }
      return true;
    }

    if (subTask.mode === 'collect') {
      if (!sim.activeJob || sim.activeJob.status !== 'ready') {
        return false;
      }
      // Abil NMR tube hostage check when collecting NMR
      const hour = state.timeMins / 60;
      if (roomId === 'cib_lg1b_nmr' && !sim.abilFineOwed) {
        const abilChance = hour >= 15.5 ? 0.11 : 0.05;
        if (Math.random() < abilChance) {
          sim.abilFineOwed = true;
          sim.failures.push('abil_fine');
          sim.weeklyStats.facilityFailures += 1;
        }
      }

      // Prefer exact PC terminal or same gel tank where job ran
      const rm = window.KLB.WORLD_MAPS?.rooms?.[roomId];
      let targetObj = null;
      let targetAdj = null;
      if (roomId === 'klb_2f' && sim.activeJob.objId) {
        const sameObj = rm?.objects?.find(o => o.id === sim.activeJob.objId);
        if (sameObj) {
          targetObj = sameObj;
          targetAdj = findFreeAdjacentWalkable(state, roomId, sameObj, npc.id)
            || findFreeWalkableNear(state, roomId, sameObj.x, sameObj.y, npc.id, false);
        }
      }
      if (!targetObj) {
        const picked = pickStationForStep(state, npc, roomId, subTask.stationTypes, 'none', { allowShared: true });
        if (picked) {
          targetObj = picked.obj;
          targetAdj = picked.adj;
        }
      }
      if (!targetObj || !moveNpcToRoomAndObj(state, npc, roomId, targetObj, false, targetAdj)) {
        return false;
      }

      sim.currentAction = {
        kind: 'subtask_collect',
        label: subTask.label,
        roomId,
        objId: targetObj.id,
        x: targetObj.x,
        y: targetObj.y,
        elapsedMins: 0,
        targetMins: Math.max(2, Number(subTask.durationMins) || 3),
        subTask
      };
      npc.currentTaskText = subTask.label;
      return true;
    }

    return false;
  }

  function advanceSubTaskOrFinishStep(state, npc, step, completedSubIdx) {
    const sim = npc.sim;
    const totalSubs = step?.subTasks?.length || 0;
    sim.weeklyStats.subTasksCompleted += 1;
    state._subTasksCompleted = (state._subTasksCompleted || 0) + 1;
    const modeKey = step?.subTasks?.[completedSubIdx]?.mode;
    if (modeKey && state._subTaskModeCounts && state._subTaskModeCounts[modeKey] !== undefined) {
      state._subTaskModeCounts[modeKey] += 1;
    }

    if (completedSubIdx >= totalSubs - 1) {
      const q = sim.stepPerf?.quality ?? 85;
      const y = sim.stepPerf?.yieldPct ?? 83;
      const mishap = Boolean(sim.stepPerf?.blueDyeMishap);
      const alreadyLogged = Boolean(sim.stepPerf?.tlcLogged);
      completeNpcCampaignStep(state, npc, step, q, y, mishap, alreadyLogged);
    } else {
      sim.subTaskIdx = completedSubIdx + 1;
    }
  }

  function handleNpcActionComplete(state, npc, meta, act) {
    const sim = npc.sim;
    sim.currentAction = null;
    npc.busyObjId = null;

    const camp = window.KLB.CAMPAIGNS?.[npc.id];
    const step = camp?.steps?.[sim.stepIdx];

    if (act.kind === 'lunch' || act.kind === 'packed_lunch') {
      const withColleagues = hasColleaguesInRoom(state, npc.roomId, npc.id);
      const calisePresent = Boolean(
        (npc.id !== 'calise_bahou' && state.npcs?.calise_bahou?.roomId === npc.roomId) ||
        (!state.spectatorMode && state.player?.id === 'calise_bahou' && state.player?.roomId === npc.roomId)
      );
      applyBreakEffects(sim, act.kind, withColleagues, state.timeMins, calisePresent);
      if (npc.id === 'calise_bahou' && withColleagues) {
        for (const other of Object.values(state.npcs || {})) {
          if (other && other.id !== 'calise_bahou' && other.roomId === npc.roomId && other.sim) {
            other.sim.morale = clamp((other.sim.morale ?? 50) + 3, 0, 100);
          }
        }
        if (!state.spectatorMode && state.player?.roomId === npc.roomId) {
          state.morale = clamp((state.morale ?? 50) + 3, 0, 100);
        }
      }
      sim.weeklyStats.lunchesTaken += 1;
      state._lunchCount = (state._lunchCount || 0) + 1;
      if (state._lunchDetails) {
        if (act.kind === 'lunch') state._lunchDetails.gordons += 1;
        else state._lunchDetails.packed += 1;
        if (withColleagues) state._lunchDetails.withColleagues += 1;
      }
      if (withColleagues && state._socialStats) state._socialStats.recoveries += 1;
      return;
    }

    if (act.kind === 'coffee' || act.kind === 'tea' || act.kind === 'gaming' || act.kind === 'aoe2_event') {
      const breakKind = act.kind === 'aoe2_event' ? 'gaming' : act.kind;
      const withColleagues = act.kind === 'aoe2_event' ? true : hasColleaguesInRoom(state, npc.roomId, npc.id);
      applyBreakEffects(sim, breakKind, withColleagues, state.timeMins);
      if (withColleagues && state._socialStats) state._socialStats.recoveries += 1;
      return;
    }

    if (act.kind === 'smoke_break') {
      npc.sim.morale = clamp((npc.sim.morale ?? 50) + 5, 0, 100);
      npc.sim.social = clamp((npc.sim.social ?? 84) + 5, 0, 100);
      npc.sim.currentAction = null;
      return;
    }

    if (act.kind === 'socialize') {
      applySocialInteraction(sim, 7);
      if (state._socialStats) {
        state._socialStats.recoveries += 1;
        state._socialStats.chatCount += 1;
      }
      const partner = act.partnerId ? state.npcs?.[act.partnerId] : null;
      if (partner && partner.roomId === npc.roomId) {
        faceTowards(npc, partner.x, partner.y);
        if (partner.sim) applySocialInteraction(partner.sim, 6);
        if (npc.roomId === getViewRoom(state)) {
          const activeBubble = (state.speechBubbles || []).some(b =>
            b && b.roomId === npc.roomId && (
              b.entityId === npc.id ||
              b.entityId === partner.id ||
              (Array.isArray(b.partnerIds) && (b.partnerIds.includes(npc.id) || b.partnerIds.includes(partner.id)))
            )
          ) || (state._queuedBubbles || []).some(qb =>
            qb && qb.roomId === npc.roomId && (
              qb.entityId === npc.id ||
              qb.entityId === partner.id ||
              (Array.isArray(qb.partnerIds) && (qb.partnerIds.includes(npc.id) || qb.partnerIds.includes(partner.id)))
            )
          );
          if (!activeBubble) {
            let pairConvo = null;
            if (!(npc.huddleLockTimer > 0) && !(partner.huddleLockTimer > 0) && !partner.pendingRoomTravel) {
              pairConvo = startPairConversation(state, npc.id, partner.id, npc.roomId);
            }
            if (!pairConvo) {
              const line = getSpeechLineForNpc(npc, true, state).text;
              const pairIds = [npc.id, partner.id].sort();
              pushBubble(state, npc.id, npc.roomId, line, calcBubbleTtl(line), {
                convoId: `social_${pairIds[0]}_${pairIds[1]}`,
                partnerIds: pairIds
              });
              npc.currentTaskSpeech = line;
            }
          }
        }
      }
      sim.socialCooldownMins = 35;
      return;
    }

    if (act.kind === 'fix_lcms') {
      sim.lcmsBroken = false;
      sim.favours += 1;
      state.lcmsBroken = false;
      return;
    }

    if (act.kind === 'fix_abil') {
      sim.abilFineOwed = false;
      return;
    }

    if (act.kind === 'bleach_clean' || act.kind === 'clean_workspace') {
      const cKind = act.kind === 'bleach_clean' ? 'base_bath' : (act.cleanKind || 'sink');
      applyWorkspaceCleaning(sim, cKind);
      if (state._labConditionStats) {
        state._labConditionStats.cleanActions += 1;
        state._labConditionStats.cleanByKind[cKind] = (state._labConditionStats.cleanByKind[cKind] || 0) + 1;
      }
      return;
    }

    if (act.kind === 'weekly_report' || act.kind === 'manuscript_draft') {
      if (npc.id === 'andre_shamsabadi' && npc.roomId === 'klb_3f' && !sim.prep.has_clicker) {
        if (sim.energy >= 44 || Math.random() < 0.65) {
          sim.prep.has_clicker = true;
        }
      }
      refreshNpcSlideDeck(npc);
      return;
    }

    if (act.kind === 'quench') {
      const job = sim.activeJob;
      if (job) {
        const overcooked = job.status === 'overcooked';
        const q = overcooked ? Math.max(25, (job.prepScore || 85) - 26) : clamp((job.prepScore || 85) + 4, 0, 100);
        const y = overcooked ? Math.max(20, (job.yieldScore || 83) - 24) : clamp((job.yieldScore || 83) + 3, 0, 100);
        sim.stepPerf = {
          ...(sim.stepPerf || {}),
          quality: q,
          yieldPct: y,
          blueDyeMishap: Boolean(job.blueDyeMishap)
        };
        const mDelta = applyExperimentOutcomeToMorale(sim, q, y);
        recordMoraleFromExpStat(state, mDelta);
        if (job.roomId === 'klb_2f') {
          const messAmt = 8 + Math.floor(Math.random() * 9);
          const setWaste = (sim.toughWeek || sim.energy < 48) && Math.random() < 0.14;
          applyWorkspaceMess(sim, messAmt, setWaste ? { uncapped_waste: true } : {});
          if (state._labConditionStats) {
            state._labConditionStats.messEvents += 1;
            state._labConditionStats.messAmountSum += messAmt;
          }
        }
        sim.activeJob = null;
        sim.activeRxn = null;
        if (step && job.stepIdx === step.index) {
          advanceSubTaskOrFinishStep(state, npc, step, job.subTaskIdx);
        }
      }
      return;
    }

    if (act.kind === 'subtask_action' && act.subTask) {
      const st = act.subTask;
      if (st.stationTypes?.includes('drying_oven')) sim.prep.oven_flask = true;
      if (st.stationTypes?.includes('argon_cyl')) sim.prep.argon_balloon = true;
      if (st.stationTypes?.includes('chem_cupboard')) {
        if (matchesCupboardHint(st.cupboardHint, 'Cupboard 1')) sim.prep.dry_solvent = true;
        if (matchesCupboardHint(st.cupboardHint, 'Cupboard 5') && !sim.prep.bleach_bath) {
          applyWorkspaceMess(sim, 10, { thiol_dirty: true });
          if (state._labConditionStats) {
            state._labConditionStats.messEvents += 1;
            state._labConditionStats.messAmountSum += 10;
          }
        }
      }
      if (st.stationTypes?.includes('base_bath')) {
        applyWorkspaceCleaning(sim, 'base_bath');
        if (state._labConditionStats) {
          state._labConditionStats.cleanActions += 1;
          state._labConditionStats.cleanByKind.base_bath += 1;
        }
      }
      if (st.stationTypes?.includes('tlc_station')) {
        sim.prep.tlc_check = true;
      }
      if (st.stationTypes?.includes('tcep_bench')) {
        if (npc.id !== 'maximillian_lee') sim.prep.tcep_buffered = true;
      }

      if (st.viewOutput === 'tlc' && step) {
        const q = sim.stepPerf?.quality ?? clamp(Math.round(86 + Math.random() * 10), 68, 97);
        const y = sim.stepPerf?.yieldPct ?? clamp(Math.round(83 + Math.random() * 12), 62, 97);
        recordNpcLabBookItem(state, npc, step, q, y, Boolean(sim.stepPerf?.blueDyeMishap), 'tlc');
        sim.stepPerf = { ...(sim.stepPerf || {}), quality: q, yieldPct: y, tlcLogged: true };
      }

      if (step) {
        advanceSubTaskOrFinishStep(state, npc, step, sim.subTaskIdx);
      }
      return;
    }

    if (act.kind === 'subtask_collect' && act.subTask) {
      const job = sim.activeJob;
      let q = job?.prepScore ?? sim.stepPerf?.quality ?? 85;
      let y = job?.yieldScore ?? sim.stepPerf?.yieldPct ?? 83;
      const mishap = Boolean(job?.blueDyeMishap || sim.stepPerf?.blueDyeMishap);

      if (sim.abilFineOwed && act.roomId === 'cib_lg1b_nmr') {
        q = Math.max(40, q - 8);
      }
      if (sim.lcmsBroken && act.roomId === 'cib_lg11_ms') {
        q = Math.max(40, q - 8);
      }

      sim.activeJob = null;
      sim.activeRxn = null;

      if (step) {
        const totalSubs = step.subTasks?.length || 0;
        if (sim.subTaskIdx >= totalSubs - 1) {
          sim.weeklyStats.subTasksCompleted += 1;
          state._subTasksCompleted = (state._subTasksCompleted || 0) + 1;
          if (state._subTaskModeCounts) state._subTaskModeCounts.collect += 1;
          completeNpcCampaignStep(state, npc, step, q, y, mishap, Boolean(sim.stepPerf?.tlcLogged));
        } else {
          recordNpcLabBookItem(state, npc, step, q, y, mishap);
          sim.stepPerf = { ...(sim.stepPerf || {}), quality: q, yieldPct: y, tlcLogged: true };
          advanceSubTaskOrFinishStep(state, npc, step, sim.subTaskIdx);
        }
      }
    }
  }

  function stepBigChudAI(state, npc, meta, deltaMins, viewRoom) {
    const sim = npc.sim;
    if (!sim) return;

    sim._currentTimeMins = state.timeMins;
    const hour = state.timeMins / 60;
    const arrive = meta.arriveHour || 9.0;
    const depart = meta.departHour || 18.0;
    const inFridayAuditGroup = getBigChudsIds().includes(npc.id) || Boolean(state.spectatorMode);
    const isFridayMeeting = inFridayAuditGroup && state.dayIdx === 4 && state.timeMins >= 540 && state.timeMins <= 585;
    const effectiveArrive = (state.dayIdx === 4 && inFridayAuditGroup) ? Math.min(arrive, 9.0) : arrive;
    const effectiveDepart = sim.currentAction?.kind === 'aoe2_event' ? Math.max(depart, 18.08) : depart;
    const cqActive = Boolean(isCoffeeQuartetWindow(state));
    const cqMembers = window.KLB.COFFEE_QUARTET?.members || [];
    const inWorkHours = (hour >= effectiveArrive && hour <= effectiveDepart) || isFridayMeeting;

    // 1. Energy, Social, Morale & Lab Condition meters during workday (paused during celebration)
    if (inWorkHours && !state.postAuditCelebration) {
      const drain = computeEnergyDrain(state, npc.id, sim.preferences, npc.roomId, false, hour, deltaMins);
      sim.energy = clamp(sim.energy - drain, 0, 100);

      if (state._caffeineEnergySamples) {
        if (sim.preferences?.requiresCaffeine) {
          state._caffeineEnergySamples.caffeineSum += sim.energy;
          state._caffeineEnergySamples.caffeineCount += 1;
          state._caffeineEnergySamples.caffeineDrainSum += drain;
          state._caffeineEnergySamples.caffeineDrainMins += deltaMins;
        } else {
          state._caffeineEnergySamples.standardSum += sim.energy;
          state._caffeineEnergySamples.standardCount += 1;
          state._caffeineEnergySamples.standardDrainSum += drain;
          state._caffeineEnergySamples.standardDrainMins += deltaMins;
        }
      }

      const inHuddle = (npc.huddleLockTimer || 0) > 0;
      const inQuartet = cqActive && cqMembers.includes(npc.id) && npc.roomId === 'gordons_cafe';
      const inSharedLunch = sim.currentAction &&
        (sim.currentAction.kind === 'lunch' || sim.currentAction.kind === 'packed_lunch') &&
        hasColleaguesInRoom(state, npc.roomId, npc.id);

      if (!inHuddle && !inQuartet && !inSharedLunch) {
        sim.social = clamp((sim.social ?? 84) - 0.085 * deltaMins, 0, 100);
      }

      if (state._socialStats) {
        const sVal = sim.social ?? 84;
        state._socialStats.min = Math.min(state._socialStats.min, sVal);
        state._socialStats.max = Math.max(state._socialStats.max, sVal);
        state._socialStats.sum += sVal;
        state._socialStats.samples += 1;
        if (sVal < 30) state._socialStats.below30Ticks += 1;
      }

      let passiveMoraleDrain = 0;
      if ((npc.roomId === 'klb_2f' || String(npc.roomId || '').startsWith('cib_')) && !state.fireAlarm?.active) {
        passiveMoraleDrain += 0.025 * deltaMins;
      }
      if (sim.social < 30) {
        passiveMoraleDrain += 0.04 * deltaMins;
      }
      if (isNeglectingPreferredBreak(sim, state.timeMins)) {
        passiveMoraleDrain += 0.025 * deltaMins;
      }
      if (npc.specsOn === false) {
        passiveMoraleDrain *= 0.60;
      }
      if (passiveMoraleDrain > 0) {
        sim.morale = clamp(sim.morale - passiveMoraleDrain, 0, 100);
      }

      if (sim.thiolDirty || sim.uncappedWaste) {
        setLabCondition(sim, getLabCondition(sim) - 0.08 * deltaMins);
      }
      if (state._labConditionStats) {
        const lc = getLabCondition(sim);
        state._labConditionStats.samples += 1;
        state._labConditionStats.sum += lc;
        state._labConditionStats.min = Math.min(state._labConditionStats.min, lc);
      }

      if (sim.stepCooldownMins > 0) sim.stepCooldownMins = Math.max(0, sim.stepCooldownMins - deltaMins);
      if (sim.socialCooldownMins > 0) sim.socialCooldownMins = Math.max(0, sim.socialCooldownMins - deltaMins);
      if (sim.cleanSkipCooldownMins > 0) sim.cleanSkipCooldownMins = Math.max(0, sim.cleanSkipCooldownMins - deltaMins);
    }

    // 2. Fire Alarm evacuation (overrides room travel)
    if (state.fireAlarm.active) {
      if (npc.roomId === 'klb_2f' || npc.roomId === 'klb_3f') {
        if (!npc.pendingRoomTravel || npc.pendingRoomTravel.finalRoom !== 'offsite' || !npc.pendingRoomTravel.isFireEvac) {
          npc.busyObjId = null;
          npc.huddleLockTimer = 0;
          npc.huddleTarget = null;
          sim.currentAction = null;
          sim.pendingJobStart = null;
          npc.currentTaskText = 'Evacuating KLB (Fire Alarm)';
          moveNpcToRoomAndPoint(state, npc, 'offsite', 0, 0, false);
        }
      }
      return;
    }

    // 3. Friday 09:00-09:45 Audit evaluation (once per week for the 10 core Big-Chuds)
    if (state.dayIdx === 4 && state.timeMins >= 540 && !sim.auditResult && getBigChudsIds().includes(npc.id)) {
      evaluateAutonomousFridayAudit(state, npc);
    }

    // Guard: let in-transit NPC finish walking to their portal/door/stairs
    if (npc.pendingRoomTravel) return;

    // 3b. Post-Audit Celebration holds Big-Chuds in Gordon's Café
    if (state.postAuditCelebration) {
      if (npc.roomId !== 'gordons_cafe') {
        const cPicked = pickStationForStep(state, npc, 'gordons_cafe', ['cafe_table', 'cafe_counter'], 'none', { allowShared: true });
        if (cPicked) moveNpcToRoomAndObj(state, npc, 'gordons_cafe', cPicked.obj, false, cPicked.adj);
        else moveNpcToRoomAndPoint(state, npc, 'gordons_cafe', 8, 10, false);
      }
      npc.specsOn = false;
      npc.currentTaskText = "Celebrating at Gordon's Café";
      return;
    }

    // 4. Off-hours handling
    if (!inWorkHours) {
      if (npc.roomId !== 'offsite') {
        if (sim.activeJob && sim.activeJob.canOvercook && sim.activeJob.status === 'sweet' && Math.random() < 0.72) {
          const camp = window.KLB.CAMPAIGNS?.[npc.id];
          const step = camp?.steps?.[sim.activeJob.stepIdx];
          if (step) {
            const q = clamp((sim.activeJob.prepScore || 85) + 4, 0, 100);
            const y = clamp((sim.activeJob.yieldScore || 83) + 3, 0, 100);
            const mDelta = applyExperimentOutcomeToMorale(sim, q, y);
            recordMoraleFromExpStat(state, mDelta);
            sim.stepPerf = { ...(sim.stepPerf || {}), quality: q, yieldPct: y };
            const doneSub = sim.activeJob.subTaskIdx;
            sim.activeJob = null;
            sim.activeRxn = null;
            advanceSubTaskOrFinishStep(state, npc, step, doneSub);
          }
        }
        npc.busyObjId = null;
        npc.huddleLockTimer = 0;
        npc.huddleTarget = null;
        sim.currentAction = null;
        sim.pendingJobStart = null;
        npc.currentTaskText = 'Heading home for the evening';
        moveNpcToRoomAndPoint(state, npc, 'offsite', 0, 0, false);
      }
      return;
    }

    // 5. Friday 09:00-09:45 Group Meeting
    if (isFridayMeeting) {
      if (npc.roomId !== 'meeting_room') {
        const chair = findObjectByTypeOrLabel('meeting_room', 'chair');
        if (chair) moveNpcToRoomAndObj(state, npc, 'meeting_room', chair, false);
        else moveNpcToRoomAndPoint(state, npc, 'meeting_room', 8, 4, false);
      }
      npc.specsOn = false;
      sim.currentAction = null;
      sim.pendingJobStart = null;
      npc.currentTaskText = 'Friday 09:00 Group Meeting Audit';
      return;
    }

    // 6. Coffee Quartet holds members at Gordon's Café
    if (cqActive && cqMembers.includes(npc.id)) {
      return;
    }

    // 7. Social huddle lock
    if ((npc.huddleLockTimer || 0) > 0) return;

    // 8. Finish walking to current target (or pending collision retry)
    if ((npc.path && npc.path.length > 0) || npc._retryTarget) return;

    // 9. Activate pending wait-subtask job on arrival
    if (sim.pendingJobStart) {
      const pend = sim.pendingJobStart;
      if (distToActionTarget(npc, pend.jobSpec) > 2.4) {
        if (!moveNpcToRoomAndObj(state, npc, pend.jobSpec.roomId, pend.obj, false)) {
          sim.pendingJobStart = null;
          npc.busyObjId = null;
        }
        return;
      }
      sim.pendingJobStart = null;
      if (isObjClaimed(state, pend.jobSpec.roomId, pend.jobSpec.objId, npc.id)) {
        const alt = pickStationForStep(state, npc, pend.jobSpec.roomId, [pend.jobSpec.stationType], 'none', { allowShared: false });
        if (alt) {
          pend.jobSpec.objId = alt.obj.id;
          pend.jobSpec.stationType = alt.obj.type;
          pend.jobSpec.x = alt.obj.x;
          pend.jobSpec.y = alt.obj.y;
          npc.busyObjId = alt.obj.id;
        }
      }
      sim.activeJob = pend.jobSpec;
      sim.activeRxn = pend.jobSpec;
      npc.currentTaskText = pend.jobSpec.label;
    }

    // 10. Tick / complete active currentAction
    if (sim.currentAction) {
      const act = sim.currentAction;
      if (act.kind === 'socialize' && act.partnerId) {
        const partner = state.npcs?.[act.partnerId];
        if (partner && partner.roomId === npc.roomId) {
          act.x = partner.x;
          act.y = partner.y;
        }
      }
      if (act.kind !== 'smoke_break' && distToActionTarget(npc, act) > 2.4) {
        const targetRoom = act.roomId || npc.roomId;
        const rm = window.KLB.WORLD_MAPS?.rooms?.[targetRoom];
        const actObj = act.objId ? rm?.objects?.find(o => o.id === act.objId) : null;
        const repathed = actObj
          ? moveNpcToRoomAndObj(state, npc, targetRoom, actObj, false)
          : (act.x != null && act.y != null && moveNpcToRoomAndPoint(state, npc, targetRoom, Math.round(act.x), Math.round(act.y), false));
        if (repathed && ((npc.path && npc.path.length > 0) || npc.pendingRoomTravel)) {
          return;
        }
        sim.currentAction = null;
        npc.busyObjId = null;
      } else if ((act.kind === 'weekly_report' || act.kind === 'manuscript_draft') &&
          sim.activeJob && sim.activeJob.canOvercook &&
          (sim.activeJob.status === 'sweet' || sim.activeJob.status === 'overcooked')) {
        if (!(sim.toughWeek && Math.random() < 0.45)) {
          sim.currentAction = null;
          npc.busyObjId = null;
        }
      } else if (act.elapsedMins >= act.targetMins) {
        handleNpcActionComplete(state, npc, meta, act);
      } else {
        return;
      }
    }

    // 11. Spawn into klb_2f if still offsite
    if (npc.roomId === 'offsite') {
      const free = getDoorwaySpawn(state, 'klb_2f', npc.id);
      npc.roomId = 'klb_2f';
      npc.x = free.x;
      npc.y = free.y;
      npc.dir = free.dir || 'W';
      npc.specsOn = true;
      npc.path = [];
    }

    // 12. Decide next priority
    const camp = window.KLB.CAMPAIGNS?.[npc.id];
    const step = camp?.steps?.[sim.stepIdx];
    const subTasks = step?.subTasks || [];
    const curSub = subTasks[sim.subTaskIdx] || null;
    const nextSub = subTasks[sim.subTaskIdx + 1] || null;

    // A) Quench active overcookable job once in sweet spot or overcooked (with realistic distraction risk)
    if (sim.activeJob && sim.activeJob.canOvercook && (sim.activeJob.status === 'sweet' || sim.activeJob.status === 'overcooked')) {
      if (sim.activeJob.status === 'sweet' && !sim.activeJob._sweetDistractChecked) {
        sim.activeJob._sweetDistractChecked = true;
        if ((sim.toughWeek || sim.energy < 50 || (sim.social ?? 84) < 38) && Math.random() < 0.45) {
          sim.activeJob._distractedOvercook = true;
        }
      }
      if (!sim.activeJob._distractedOvercook || sim.activeJob.status === 'overcooked') {
        const rm = window.KLB.WORLD_MAPS?.rooms?.[sim.activeJob.roomId];
        const rxnObj = rm?.objects?.find(o => o.id === sim.activeJob.objId) || null;
        if (moveNpcToRoomAndObj(state, npc, sim.activeJob.roomId, rxnObj, false)) {
          sim.currentAction = {
            kind: 'quench',
            label: `Quenching ${sim.activeJob.title}`,
            roomId: sim.activeJob.roomId,
            objId: sim.activeJob.objId,
            x: sim.activeJob.x,
            y: sim.activeJob.y,
            elapsedMins: 0,
            targetMins: 4
          };
          npc.currentTaskText = `Quenching ${sim.activeJob.title}`;
          return;
        }
      }
    }

    // B) Advance completed non-overcook activeJob
    if (sim.activeJob && !sim.activeJob.canOvercook && sim.activeJob.status === 'ready') {
      if (!sim.activeJob._messApplied && sim.activeJob.roomId === 'klb_2f') {
        sim.activeJob._messApplied = true;
        const messAmt = 8 + Math.floor(Math.random() * 9);
        const setWaste = (sim.toughWeek || sim.energy < 48) && Math.random() < 0.14;
        applyWorkspaceMess(sim, messAmt, setWaste ? { uncapped_waste: true } : {});
        if (state._labConditionStats) {
          state._labConditionStats.messEvents += 1;
          state._labConditionStats.messAmountSum += messAmt;
        }
      }
      if (curSub && curSub.mode === 'wait') {
        if (nextSub?.requiresJobFromPrev) {
          sim.subTaskIdx += 1;
        } else {
          const doneSubIdx = sim.activeJob.subTaskIdx;
          sim.activeJob = null;
          sim.activeRxn = null;
          npc.busyObjId = null;
          if (step) advanceSubTaskOrFinishStep(state, npc, step, doneSubIdx);
        }
      }
    }

    // Re-read curSub in case B advanced subTaskIdx
    const activeStep = camp?.steps?.[sim.stepIdx];
    const activeSub = activeStep?.subTasks?.[sim.subTaskIdx] || null;

    // C) Staggered Lunch AI (1.25x duration: 28m)
    const lunchStart = meta.lunchHour || 12.4;
    if (hour >= lunchStart && hour <= lunchStart + 0.85 && !sim.hadLunchToday) {
      const lRoom = meta.lunchRoom === 'klb_3f' ? 'klb_3f' : 'gordons_cafe';
      const lTypes = lRoom === 'gordons_cafe' ? ['cafe_table', 'cafe_counter'] : ['writeup_desk'];
      const lPicked = pickStationForStep(state, npc, lRoom, lTypes, 'none', { allowShared: true });
      const moved = lPicked
        ? moveNpcToRoomAndObj(state, npc, lRoom, lPicked.obj, false, lPicked.adj)
        : moveNpcToRoomAndPoint(state, npc, lRoom, lRoom === 'gordons_cafe' ? 10 : 22, lRoom === 'gordons_cafe' ? 8 : 3, false);
      if (moved) {
        sim.currentAction = {
          kind: lRoom === 'gordons_cafe' ? 'lunch' : 'packed_lunch',
          label: 'Having Lunch',
          roomId: lRoom,
          objId: lPicked?.obj?.id || null,
          x: lPicked?.obj?.x ?? npc.x,
          y: lPicked?.obj?.y ?? npc.y,
          elapsedMins: 0,
          targetMins: 28
        };
        npc.currentTaskText = 'Having Lunch';
        return;
      }
    }

    // D) Workspace cleaning when Lab Condition < 58, thiolDirty, or uncappedWaste (with occasional neglect when tired/rushed)
    const needsThiolClean = Boolean(sim.thiolDirty) && !activeSub?.stationTypes?.includes('base_bath') &&
      !(activeStep && (activeStep.subTasks || []).slice(sim.subTaskIdx, sim.subTaskIdx + 2).some(s => s.stationTypes?.includes('base_bath')));
    const needsWasteClean = Boolean(sim.uncappedWaste);
    const needsConditionClean = getLabCondition(sim) < 58;
    const safeToClean = !sim.activeJob || !sim.activeJob.canOvercook || (sim.activeJob.targetMins - sim.activeJob.elapsedMins > 16);

    if ((needsThiolClean || needsWasteClean || needsConditionClean) && safeToClean && (sim.cleanSkipCooldownMins || 0) <= 0) {
      if ((sim.toughWeek || sim.energy < 44) && Math.random() < 0.30) {
        sim.cleanSkipCooldownMins = 45;
      } else {
        let cleanKind = 'sink';
        let cleanType = 'sink';
        let label = 'Washing Glassware at Sink';
        let taskTxt = 'Cleaning glassware at 2F Sink';
        if (needsThiolClean) {
          cleanKind = 'base_bath';
          cleanType = 'base_bath';
          label = 'Bleaching Thiol Glassware';
          taskTxt = 'Quenching thiols in Bleach Bath';
        } else if (needsWasteClean) {
          cleanKind = 'waste_bin';
          cleanType = 'waste_bin';
          label = 'Capping & Clearing Waste';
          taskTxt = 'Capping waste at 2F Bin';
        } else {
          const r = Math.random();
          if (r < 0.22) {
            cleanKind = 'base_bath';
            cleanType = 'base_bath';
            label = 'Refreshing Bleach Bath';
            taskTxt = 'Tidying hood at Base Bath';
          } else if (r < 0.42) {
            cleanKind = 'waste_bin';
            cleanType = 'waste_bin';
            label = 'Tidying Waste Station';
            taskTxt = 'Clearing waste at 2F Bin';
          }
        }
        const cPicked = pickStationForStep(state, npc, 'klb_2f', [cleanType], 'none', { allowShared: true });
        if (cPicked && moveNpcToRoomAndObj(state, npc, 'klb_2f', cPicked.obj, false, cPicked.adj)) {
          sim.currentAction = {
            kind: 'clean_workspace',
            cleanKind,
            label,
            roomId: 'klb_2f',
            objId: cPicked.obj.id,
            x: cPicked.obj.x,
            y: cPicked.obj.y,
            elapsedMins: 0,
            targetMins: 10 + Math.floor(Math.random() * 4)
          };
          npc.currentTaskText = taskTxt;
          return;
        }
      }
    }

    // E) Preferred Break (1.25x duration: coffee 18m, tea 13m, gaming 28m)
    const pref = sim.preferences?.pref || 'balanced';
    const neglecting = isNeglectingPreferredBreak(sim, state.timeMins);
    const lowCaffeine = sim.preferences?.requiresCaffeine && sim.energy < 38;
    const standardCoffee = !sim.preferences?.requiresCaffeine && sim.energy < 68 && Math.random() < 0.45;
    const gamingWindow = pref === 'gaming' && hour >= 16.75 && sim.energy >= 52 && (state.timeMins - (sim.lastPreferredBreakMins || 0)) > 180 && Math.random() < 0.25;
    const safeToPauseJob = !sim.activeJob || !sim.activeJob.canOvercook || (sim.activeJob.targetMins - sim.activeJob.elapsedMins > 18) || sim.toughWeek;

    if ((lowCaffeine || (neglecting && (!sim.preferences?.requiresCaffeine || sim.energy < 54)) || standardCoffee || gamingWindow) && safeToPauseJob) {
      if (pref === 'coffee' || (standardCoffee && !gamingWindow)) {
        const picked = pickStationForStep(state, npc, 'gordons_cafe', ['cafe_table', 'cafe_counter'], 'none', { allowShared: true });
        if (picked && moveNpcToRoomAndObj(state, npc, 'gordons_cafe', picked.obj, false, picked.adj)) {
          sim.currentAction = {
            kind: 'coffee',
            label: "Coffee at Gordon's",
            roomId: 'gordons_cafe',
            objId: picked.obj.id,
            x: picked.obj.x,
            y: picked.obj.y,
            elapsedMins: 0,
            targetMins: 18
          };
          npc.currentTaskText = "Coffee run at Gordon's Café";
          return;
        }
      } else if (pref === 'tea') {
        const picked = pickStationForStep(state, npc, 'klb_3f', ['tea_drawer'], 'none', { allowShared: true });
        if (picked && moveNpcToRoomAndObj(state, npc, 'klb_3f', picked.obj, false, picked.adj)) {
          sim.currentAction = {
            kind: 'tea',
            label: 'Brewing Yorkshire Tea',
            roomId: 'klb_3f',
            objId: picked.obj.id,
            x: picked.obj.x,
            y: picked.obj.y,
            elapsedMins: 0,
            targetMins: 13
          };
          npc.currentTaskText = "Brewing tea at Richard's Kettle";
          return;
        }
      } else if (pref === 'gaming' && (hour >= 15.5 || neglecting)) {
        const picked = pickStationForStep(state, npc, 'klb_3f', ['writeup_desk'], meta.group || 'chudasama', { allowShared: true });
        if (picked && moveNpcToRoomAndObj(state, npc, 'klb_3f', picked.obj, false, picked.adj)) {
          sim.currentAction = {
            kind: 'gaming',
            label: '3F AoE2 / Worms Break',
            roomId: 'klb_3f',
            objId: picked.obj.id,
            x: picked.obj.x,
            y: picked.obj.y,
            elapsedMins: 0,
            targetMins: 28
          };
          npc.currentTaskText = '3F AoE2 / Worms break';
          return;
        }
      }
    }

    // F) Autonomous Social AI when social < 34 (or < 25 on toughWeek so < 30 drag triggers occasionally)
    const socialThreshold = sim.toughWeek ? 25 : 34;
    if ((sim.social ?? 84) < socialThreshold && (sim.socialCooldownMins || 0) <= 0) {
      const socialRooms = ['klb_2f', 'klb_3f', 'gordons_cafe'];
      const colleagues = Object.values(state.npcs || {}).filter(other =>
        other && other.id !== npc.id && socialRooms.includes(other.roomId)
      );
      if (colleagues.length > 0) {
        const sameRoom = colleagues.filter(c => c.roomId === npc.roomId);
        const pool = sameRoom.length ? sameRoom : colleagues;
        const target = pool[Math.floor(Math.random() * pool.length)];
        const targetName = window.KLB.CAST_BY_ID?.[target.id]?.shortName || target.id;
        if (moveNpcToRoomAndPoint(state, npc, target.roomId, Math.round(target.x), Math.round(target.y), false)) {
          sim.currentAction = {
            kind: 'socialize',
            label: `Chatting with ${targetName}`,
            roomId: target.roomId,
            objId: null,
            x: target.x,
            y: target.y,
            partnerId: target.id,
            elapsedMins: 0,
            targetMins: 6
          };
          npc.currentTaskText = `Catching up with ${targetName}`;
          return;
        }
      }
    }

    // G / H ordering: collect ready jobs first; prioritize urgent Thu/Fri 18:00 write-ups & natural mid-shift desk blocks
    const wrUrgentThu = state.dayIdx === 3 && hour >= 15.0 && !sim.weeklyReportChecked && sim.weeklyReportProgress < 100;
    const msUrgentFri = state.dayIdx === 4 && hour >= 13.5 && !sim.manuscriptChecked && sim.manuscriptProgress < 100 && sim.completedSteps.length >= 3;
    const urgentWriteupFirst = (wrUrgentThu || msUrgentFri) && !sim.activeJob && !sim.toughWeek && !(activeSub?.mode === 'collect');
    const tiredSkipWriteup = (sim.toughWeek && Math.random() < (wrUrgentThu || msUrgentFri ? 0.72 : 0.56))
      || (!wrUrgentThu && !msUrgentFri && sim.energy < 28 && Math.random() < 0.45);
    const wrTargets = [35, 65, 90, 100, 100];
    const msTargets = [26, 52, 76, 94, 100];
    const needWeeklyReport = state.dayIdx <= 3 && !sim.weeklyReportChecked && sim.weeklyReportProgress < wrTargets[state.dayIdx];
    const needManuscript = !sim.manuscriptChecked && (sim.manuscriptProgress < msTargets[Math.min(4, state.dayIdx)] || (state.dayIdx === 4 && !sim.slideDeck.ready && sim.labBook.length >= 2));
    const needClickerOnThuFri = npc.id === 'andre_shamsabadi' && !sim.prep.has_clicker && state.dayIdx >= 3 && !sim.toughWeek;
    const midWriteupKey = `${state.weekNum || 1}_${state.dayIdx}_${sim.stepIdx}`;
    const canMidWriteup = sim._midWriteupKey !== midWriteupKey;
    const midShiftWriteup = canMidWriteup && !sim.activeJob && (!activeSub || activeSub.mode !== 'collect') && !urgentWriteupFirst &&
      !tiredSkipWriteup && (needWeeklyReport || needManuscript) && (sim.stepCooldownMins || 0) <= 0 &&
      sim.completedSteps.length >= Math.min(4, state.dayIdx) && Math.random() < 0.48;

    if (!urgentWriteupFirst && !midShiftWriteup && activeStep && activeSub && !sim.completedSteps.includes(activeStep.index)) {
      if (activeSub.mode === 'collect' && sim.activeJob?.status === 'ready') {
        if (startNpcSubTask(state, npc, meta, activeStep, activeSub)) return;
      } else if (activeSub.mode !== 'collect' && !sim.activeJob && (sim.stepCooldownMins || 0) <= 0) {
        if (startNpcSubTask(state, npc, meta, activeStep, activeSub)) return;
      }
    }

    // H) Weekly Report (Mon-Thu) & Manuscript Draft (All week, sustained desk sessions across 2F & 3F)
    if (!tiredSkipWriteup && (needWeeklyReport || needManuscript || needClickerOnThuFri || sim.activeJob)) {
      const deskRoom = (needClickerOnThuFri || Math.random() < 0.52) ? 'klb_3f' : 'klb_2f';
      const picked = pickStationForStep(state, npc, deskRoom, ['writeup_desk'], meta.group || 'chudasama', { allowShared: true });
      if (picked && moveNpcToRoomAndObj(state, npc, deskRoom, picked.obj, false, picked.adj)) {
        if (midShiftWriteup) sim._midWriteupKey = midWriteupKey;
        const doWeeklyReport = state.dayIdx <= 3 && sim.weeklyReportProgress < 100 && (wrUrgentThu || sim.weeklyReportProgress <= sim.manuscriptProgress + 16 || needWeeklyReport);
        const kind = doWeeklyReport ? 'weekly_report' : 'manuscript_draft';
        const label = doWeeklyReport ? 'Writing Weekly Report' : 'Drafting Manuscript';
        const paceMult = sim.toughWeek ? 0.45 : 1.0;
        const jobRem = (sim.activeJob && sim.activeJob.canOvercook)
          ? Math.max(8, Math.floor((sim.activeJob.targetMins - sim.activeJob.elapsedMins) - 3))
          : 30;
        sim.currentAction = {
          kind,
          label,
          roomId: deskRoom,
          objId: picked.obj.id,
          x: picked.obj.x,
          y: picked.obj.y,
          elapsedMins: 0,
          targetMins: sim.activeJob ? Math.min(26, jobRem) : (38 + Math.floor(Math.random() * 14)),
          ratePerMin: (doWeeklyReport ? 1.14 : 0.88) * paceMult
        };
        npc.currentTaskText = doWeeklyReport
          ? `Writing Weekly Report (${Math.round(sim.weeklyReportProgress)}%)`
          : `Drafting Manuscript (${Math.round(sim.manuscriptProgress)}%)`;
        return;
      }
    }

    // Fallback G if urgent or mid-shift write-up was skipped or couldn't place
    if ((urgentWriteupFirst || midShiftWriteup) && activeStep && activeSub && !sim.completedSteps.includes(activeStep.index)) {
      if (activeSub.mode !== 'collect' && !sim.activeJob && (sim.stepCooldownMins || 0) <= 0) {
        if (startNpcSubTask(state, npc, meta, activeStep, activeSub)) return;
      }
    }

    // I) Idle bench / TLC / slide review fallback
    const benchPicked = pickStationForStep(state, npc, 'klb_2f', ['lab_bench', 'tlc_station'], meta.group || 'chudasama', { allowShared: true });
    if (benchPicked && moveNpcToRoomAndObj(state, npc, 'klb_2f', benchPicked.obj, false, benchPicked.adj)) {
      if (!sim.toughWeek) sim.uncappedWaste = false;
      sim.currentAction = {
        kind: 'tidy_bench',
        label: tiredSkipWriteup ? 'Taking a Breather' : 'Reviewing Lab Book',
        roomId: 'klb_2f',
        objId: benchPicked.obj.id,
        x: benchPicked.obj.x,
        y: benchPicked.obj.y,
        elapsedMins: 0,
        targetMins: 12
      };
      npc.currentTaskText = sim.currentAction.label;
      return;
    }

    npc.currentTaskText = 'Reviewing slides & lab book';
  }

  function stepNeighbourAI(state, npc, meta, deltaMins) {
    const wf = NEIGHBOUR_WORKFLOWS[npc.id];
    if (!wf) return;
    const hour = state.timeMins / 60;
    const arrive = meta.arriveHour || 9.25;
    const depart = meta.departHour || 18.0;
    const cqActive = Boolean(isCoffeeQuartetWindow(state));
    const cqMembers = window.KLB.COFFEE_QUARTET?.members || [];

    if (state.fireAlarm.active) {
      if (npc.roomId === 'klb_2f' || npc.roomId === 'klb_3f') {
        if (!npc.pendingRoomTravel || npc.pendingRoomTravel.finalRoom !== 'offsite' || !npc.pendingRoomTravel.isFireEvac) {
          npc.busyObjId = null;
          npc.huddleLockTimer = 0;
          npc.huddleTarget = null;
          if (npc.sim) npc.sim.currentAction = null;
          npc.currentTaskText = 'Evacuating KLB';
          moveNpcToRoomAndPoint(state, npc, 'offsite', 0, 0, false);
        }
      }
      return;
    }

    if (npc.pendingRoomTravel) return;

    const includeBakerMeeting = Boolean(state.spectatorMode || state.player?.id === 'archie_wall');
    const isFridayMeeting = state.dayIdx === 4 && state.timeMins >= 540 && state.timeMins <= 585;
    if (isFridayMeeting && includeBakerMeeting && (npc.id === 'nafsika_forte' || npc.id === 'archie_wall')) {
      npc.specsOn = false;
      if (npc.sim) npc.sim.currentAction = null;
      npc.currentTaskText = 'Friday 09:00 Group Meeting';
      return;
    }

    if (hour < arrive || hour > depart) {
      if (npc.roomId !== 'offsite') {
        npc.busyObjId = null;
        npc.huddleLockTimer = 0;
        npc.huddleTarget = null;
        if (npc.sim) {
          npc.sim.activeJob = null;
          npc.sim.activeRxn = null;
          npc.sim.currentAction = null;
        }
        npc.currentTaskText = 'Heading out for the evening';
        moveNpcToRoomAndPoint(state, npc, 'offsite', 0, 0, false);
      }
      return;
    }

    if (cqActive && cqMembers.includes(npc.id)) return;
    if ((npc.huddleLockTimer || 0) > 0) return;
    if ((npc.path && npc.path.length > 0) || npc._retryTarget) return;

    const sim = npc.sim;
    if (!sim) return;

    // Advance/complete smoke_break BEFORE sim.activeJob check so neighbours cleanly return to KLB 2F
    if (sim.currentAction?.kind === 'smoke_break') {
      const act = sim.currentAction;
      if (act.elapsedMins >= act.targetMins) {
        sim.morale = clamp((sim.morale ?? 50) + 5, 0, 100);
        sim.social = clamp((sim.social ?? 84) + 5, 0, 100);
        sim.currentAction = null;
        npc.busyObjId = null;
        if (npc.roomId === 'offsite' && sim.activeJob) {
          const jRm = sim.activeJob.roomId || 'klb_2f';
          const rm = window.KLB.WORLD_MAPS?.rooms?.[jRm];
          const jObj = sim.activeJob.objId ? rm?.objects?.find(o => o.id === sim.activeJob.objId) : null;
          if (jObj) moveNpcToRoomAndObj(state, npc, jRm, jObj, false);
          else moveNpcToRoomAndPoint(state, npc, jRm, 28, 12, false);
          npc.currentTaskText = sim.activeJob.title || 'Returning to bench';
          return;
        }
      } else {
        return;
      }
    }

    // Neighbour lunch window (1.25x duration: 28m)
    const lunchStart = meta.lunchHour || 12.3;
    if (hour >= lunchStart && hour <= lunchStart + 0.85 && !sim.hadLunchToday && !sim.currentAction) {
      const lRoom = meta.lunchRoom === 'klb_3f' ? 'klb_3f' : 'gordons_cafe';
      const lTypes = lRoom === 'gordons_cafe' ? ['cafe_table', 'cafe_counter'] : ['writeup_desk'];
      const picked = pickStationForStep(state, npc, lRoom, lTypes, 'none', { allowShared: true });
      if (picked && moveNpcToRoomAndObj(state, npc, lRoom, picked.obj, false, picked.adj)) {
        sim.currentAction = {
          kind: lRoom === 'gordons_cafe' ? 'lunch' : 'packed_lunch',
          label: 'Having Lunch',
          roomId: lRoom,
          objId: picked.obj.id,
          x: picked.obj.x,
          y: picked.obj.y,
          elapsedMins: 0,
          targetMins: 28
        };
        npc.currentTaskText = 'Having Lunch';
        return;
      }
    }

    if (sim.activeJob) {
      if (sim.activeJob.status === 'sweet' || sim.activeJob.status === 'ready' || sim.activeJob.status === 'overcooked') {
        sim.activeJob = null;
        sim.activeRxn = null;
        npc.busyObjId = null;
        sim.stageIdx = (sim.stageIdx + 1) % wf.length;
      } else {
        if (npc.roomId === 'offsite') {
          const jRm = sim.activeJob.roomId || 'klb_2f';
          const rm = window.KLB.WORLD_MAPS?.rooms?.[jRm];
          const jObj = sim.activeJob.objId ? rm?.objects?.find(o => o.id === sim.activeJob.objId) : null;
          if (jObj) moveNpcToRoomAndObj(state, npc, jRm, jObj, false);
          else moveNpcToRoomAndPoint(state, npc, jRm, 28, 12, false);
          npc.currentTaskText = sim.activeJob.title || 'Returning to bench';
        }
        return;
      }
    }

    if (sim.currentAction) {
      const act = sim.currentAction;
      if (act.kind !== 'smoke_break' && distToActionTarget(npc, act) > 2.4) {
        const targetRoom = act.roomId || npc.roomId;
        const rm = window.KLB.WORLD_MAPS?.rooms?.[targetRoom];
        const actObj = act.objId ? rm?.objects?.find(o => o.id === act.objId) : null;
        const repathed = actObj
          ? moveNpcToRoomAndObj(state, npc, targetRoom, actObj, false)
          : (act.x != null && act.y != null && moveNpcToRoomAndPoint(state, npc, targetRoom, Math.round(act.x), Math.round(act.y), false));
        if (repathed && ((npc.path && npc.path.length > 0) || npc.pendingRoomTravel)) {
          return;
        }
        sim.currentAction = null;
        npc.busyObjId = null;
      } else if (act.elapsedMins >= act.targetMins) {
        if (act.kind === 'lunch' || act.kind === 'packed_lunch') {
          const calisePresent = Boolean(
            state.npcs?.calise_bahou?.roomId === npc.roomId ||
            (!state.spectatorMode && state.player?.id === 'calise_bahou' && state.player?.roomId === npc.roomId)
          );
          applyBreakEffects(sim, act.kind, hasColleaguesInRoom(state, npc.roomId, npc.id), state.timeMins, calisePresent);
          state._lunchCount = (state._lunchCount || 0) + 1;
        } else if (act.kind === 'smoke_break') {
          sim.morale = clamp((sim.morale ?? 50) + 5, 0, 100);
          sim.social = clamp((sim.social ?? 84) + 5, 0, 100);
        }
        sim.currentAction = null;
        npc.busyObjId = null;
        if (act.kind === 'neighbour_stage') {
          sim.stageIdx = (sim.stageIdx + 1) % wf.length;
        }
      } else {
        return;
      }
    }

    const stage = wf[sim.stageIdx % wf.length];
    const picked = pickStationForStep(state, npc, stage.roomId, stage.stationTypes, stage.group, {
      allowShared: stage.roomId !== 'klb_2f' || Boolean(stage.stationTypes?.includes('writeup_desk'))
    });
    if (picked && moveNpcToRoomAndObj(state, npc, stage.roomId, picked.obj, false, picked.adj)) {
      const wetTypes = ['fumehood', 'buchi', 'biotage', 'gel_tank'];
      if (stage.roomId === 'klb_2f' && picked.obj && wetTypes.includes(picked.obj.type)) {
        sim.activeJob = {
          id: `nbr_job_${npc.id}_${sim.stageIdx}`,
          ownerId: npc.id,
          ownerName: meta.shortName || npc.id,
          kind: 'reaction',
          roomId: 'klb_2f',
          objId: picked.obj.id,
          stationType: picked.obj.type,
          x: picked.obj.x,
          y: picked.obj.y,
          title: stage.title,
          label: stage.title,
          elapsedMins: 0,
          targetMins: stage.mins || 25,
          sweetSpotMins: 25,
          canOvercook: true,
          status: 'running',
          progress: 0
        };
        sim.activeRxn = sim.activeJob;
      } else {
        sim.currentAction = {
          kind: 'neighbour_stage',
          label: stage.title,
          roomId: stage.roomId,
          objId: picked.obj.id,
          stationType: picked.obj.type,
          x: picked.obj.x,
          y: picked.obj.y,
          elapsedMins: 0,
          targetMins: stage.mins || 22
        };
      }
      npc.currentTaskText = stage.title;
    }
  }

  const VISITING_PI_PATROLS = [
    {
      id: 'jamie_baker',
      group: 'baker',
      stationTypes: ['fumehood', 'balance_table', 'lab_bench', 'writeup_desk'],
      taskText: 'Patrolling Baker bay & checking specs',
      windows: [
        { startMins: 10 * 60, endMins: 10 * 60 + 35 },
        { startMins: 14 * 60 + 30, endMins: 15 * 60 + 5 }
      ]
    },
    {
      id: 'tom_sheppard',
      group: 'sheppard',
      stationTypes: ['fumehood', 'balance_table', 'biotage', 'writeup_desk'],
      taskText: 'Checking Sheppard bay hoods & benches',
      windows: [
        { startMins: 11 * 60 + 30, endMins: 12 * 60 },
        { startMins: 15 * 60 + 45, endMins: 16 * 60 + 15 }
      ]
    }
  ];

  function stepVisitingPIPatrol(state, deltaMins) {
    if (!state || state.fireAlarm?.active || state.postAuditCelebration) return;
    if (state.dayIdx < 0 || state.dayIdx > 4) return;
    const isBakerMeeting = state.dayIdx === 4 && state.timeMins >= 540 && state.timeMins <= 585 &&
      Boolean(state.spectatorMode || state.player?.id === 'archie_wall');
    for (const cfg of VISITING_PI_PATROLS) {
      if (isBakerMeeting && cfg.id === 'jamie_baker') continue;
      const pi = state.npcs?.[cfg.id];
      if (!pi || pi.pendingRoomTravel) continue;
      const activeWin = cfg.windows.find(w => state.timeMins >= w.startMins && state.timeMins <= w.endMins);
      if (activeWin) {
        pi.specsOn = true;
        pi.departAtMins = Math.max(pi.departAtMins || 0, activeWin.endMins);
        if (pi.roomId === 'offsite') {
          const free = getDoorwaySpawn(state, 'klb_2f', cfg.id);
          pi.pendingRoomTravel = null;
          pi.roomId = 'klb_2f';
          pi.x = free.x;
          pi.y = free.y;
          pi.dir = free.dir || 'W';
          pi.path = [];
          const picked = pickStationForStep(state, pi, 'klb_2f', cfg.stationTypes, cfg.group, { allowShared: true });
          if (picked?.adj) {
            pi.path = findPathBFS('klb_2f', pi.x, pi.y, picked.adj.x, picked.adj.y, 45, state, cfg.id);
          }
          pi.currentTaskText = cfg.taskText;
        } else if (pi.roomId !== 'klb_2f') {
          const picked = pickStationForStep(state, pi, 'klb_2f', cfg.stationTypes, cfg.group, { allowShared: true });
          if (picked) moveNpcToRoomAndObj(state, pi, 'klb_2f', picked.obj, false, picked.adj);
          else moveNpcToRoomAndPoint(state, pi, 'klb_2f', 17, 16, false);
          pi.currentTaskText = cfg.taskText;
        } else if ((!pi.path || pi.path.length === 0) && (pi.huddleLockTimer || 0) <= 0 && Math.random() < 0.08 * deltaMins) {
          const picked = pickStationForStep(state, pi, 'klb_2f', cfg.stationTypes, cfg.group, { allowShared: true });
          if (picked?.adj) {
            pi.path = findPathBFS('klb_2f', pi.x, pi.y, picked.adj.x, picked.adj.y, 45, state, cfg.id);
          }
          pi.currentTaskText = cfg.taskText;
        }
      } else if (
        pi.roomId !== 'offsite' &&
        (!pi.departAtMins || state.timeMins >= pi.departAtMins) &&
        (pi.huddleLockTimer || 0) <= 0
      ) {
        pi.departAtMins = null;
        pi.busyObjId = null;
        pi.huddleLockTimer = 0;
        pi.huddleTarget = null;
        pi.currentTaskText = 'Heading back to KLB office';
        moveNpcToRoomAndPoint(state, pi, 'offsite', 0, 0, false);
      }
    }
  }

  function stepAllNpcAI(state, deltaMins) {
    const viewRoom = getViewRoom(state);
    const cast = window.KLB.CAST || [];

    // Advance delayed NPC departure timers via physical portal walk
    for (const npc of Object.values(state.npcs || {})) {
      if (state.postAuditCelebration && npc.roomId === 'gordons_cafe') continue;
      if (npc.departAtMins && state.timeMins >= npc.departAtMins) {
        npc.departAtMins = null;
        if ((!state.vijayRound?.active || npc.id !== 'vijay_chudasama') && npc.roomId !== 'offsite') {
          npc.busyObjId = null;
          npc.huddleLockTimer = 0;
          npc.huddleTarget = null;
          npc.currentTaskText = 'Leaving KLB';
          moveNpcToRoomAndPoint(state, npc, 'offsite', 0, 0, false);
        }
      }
    }

    // Coffee Quartet takes priority during active windows
    syncCoffeeQuartet(state, false, deltaMins);

    // Vijay lunch at Gordon's Café around 12:36-13:00 (and 2F walkthroughs / clean departure)
    const vj = state.npcs?.vijay_chudasama;
    if (vj && !state.mutators?.vijays_not_in && !state.fireAlarm?.active && !state.postAuditCelebration && !isCoffeeQuartetWindow(state)) {
      const hour = state.timeMins / 60;
      const isFridayMeeting = state.dayIdx === 4 && state.timeMins >= 540 && state.timeMins <= 585;
      if (!isFridayMeeting && !vj.pendingRoomTravel) {
        if (hour >= 12.6 && hour < 13.0) {
          if (vj.roomId !== 'gordons_cafe') {
            const picked = pickStationForStep(state, vj, 'gordons_cafe', ['cafe_table', 'cafe_counter'], 'none', { allowShared: true });
            if (picked) {
              moveNpcToRoomAndObj(state, vj, 'gordons_cafe', picked.obj, false, picked.adj);
            } else {
              moveNpcToRoomAndPoint(state, vj, 'gordons_cafe', 10, 8, false);
            }
            vj.specsOn = false;
            vj.departAtMins = Math.round(13.02 * 60);
            vj.currentTaskText = "Having Lunch at Gordon's Café";
          }
        } else {
          const inWalkWindow = (hour >= 11.3 && hour <= 11.8) || (hour >= 14.1 && hour <= 14.55);
          if (
            inWalkWindow &&
            !state.vijayRound?.active &&
            ['offsite', 'gordons_cafe', 'meeting_room'].includes(vj.roomId) &&
            Math.random() < 0.08 * deltaMins
          ) {
            vj.specsOn = true;
            vj.departAtMins = state.timeMins + 20;
            vj.currentTaskText = 'Walking through KLB 2F bays';
            if (vj.roomId === 'offsite') {
              const free = getDoorwaySpawn(state, 'klb_2f', 'vijay_chudasama');
              vj.pendingRoomTravel = null;
              vj.roomId = 'klb_2f';
              vj.x = free.x;
              vj.y = free.y;
              vj.dir = free.dir || 'W';
              const hood = findObjectByTypeOrLabel('klb_2f', 'fumehood');
              if (hood) {
                const adj = findFreeAdjacentWalkable(state, 'klb_2f', hood, 'vijay_chudasama');
                if (adj) vj.path = findPathBFS('klb_2f', vj.x, vj.y, adj.x, adj.y, 45, state, 'vijay_chudasama');
              }
            } else {
              const hood = findObjectByTypeOrLabel('klb_2f', 'fumehood');
              if (hood) moveNpcToRoomAndObj(state, vj, 'klb_2f', hood, false);
              else moveNpcToRoomAndPoint(state, vj, 'klb_2f', 18, 12, false);
            }
          } else if (
            !state.vijayRound?.active &&
            (vj.roomId === 'gordons_cafe' || vj.roomId === 'meeting_room') &&
            (!vj.departAtMins || state.timeMins >= vj.departAtMins) &&
            (!vj.path || vj.path.length === 0) &&
            (vj.huddleLockTimer || 0) <= 0
          ) {
            vj.departAtMins = null;
            vj.busyObjId = null;
            vj.huddleLockTimer = 0;
            vj.huddleTarget = null;
            vj.currentTaskText = 'Returning to KLB office';
            moveNpcToRoomAndPoint(state, vj, 'offsite', 0, 0, false);
          } else if (
            vj.roomId === 'klb_2f' &&
            !state.vijayRound?.active &&
            vj.departAtMins &&
            state.timeMins < vj.departAtMins &&
            (!vj.path || vj.path.length === 0) &&
            (vj.huddleLockTimer || 0) <= 0 &&
            Math.random() < 0.06 * deltaMins
          ) {
            const hood = findObjectByTypeOrLabel('klb_2f', 'fumehood');
            if (hood) {
              const adj = findFreeAdjacentWalkable(state, 'klb_2f', hood, 'vijay_chudasama');
              if (adj) vj.path = findPathBFS('klb_2f', vj.x, vj.y, adj.x, adj.y, 45, state, 'vijay_chudasama');
            }
          }
        }
      }
    }

    // Jamie Baker & Tom Sheppard daily KLB 2F bay patrols
    stepVisitingPIPatrol(state, deltaMins);

    for (const meta of cast) {
      if (!state.spectatorMode && meta.id === state.player?.id) continue;
      if (meta.fixedRoom) continue;
      if (meta.isPI || ['claire_carmalt', 'safety_inspector', 'alex_king'].includes(meta.id)) continue;
      const npc = state.npcs?.[meta.id];
      if (!npc) continue;

      if (meta.playable) {
        if (window.KLB.CAMPAIGNS?.[meta.id] || !NEIGHBOUR_WORKFLOWS[meta.id]) {
          stepBigChudAI(state, npc, meta, deltaMins, viewRoom);
        } else {
          stepNeighbourAI(state, npc, meta, deltaMins);
        }
      } else if (NEIGHBOUR_WORKFLOWS[meta.id]) {
        stepNeighbourAI(state, npc, meta, deltaMins);
      }
    }
  }

  function syncNPCSchedules(state, teleport = false, callbacks = {}) {
    if (!state) return;
    syncDayWeekRolloverFlags(state, callbacks);

    const hour = state.timeMins / 60;
    const cqActive = Boolean(isCoffeeQuartetWindow(state));
    const cqMembers = new Set(window.KLB.COFFEE_QUARTET?.members || []);
    const isFridayMorningMeeting = state.dayIdx === 4 && state.timeMins >= 540 && state.timeMins <= 585;
    const isArchiePlayer = !state.spectatorMode && state.player?.id === 'archie_wall';
    const includeBakerMeeting = isArchiePlayer || Boolean(state.spectatorMode);

    if (!state.fireAlarm?.active) {
      for (const npc of Object.values(state.npcs || {})) {
        if (npc?.pendingRoomTravel?.isFireEvac) {
          npc.pendingRoomTravel = null;
          npc.path = [];
        }
      }
    }

    if (isFridayMorningMeeting && !state.fireAlarm?.active) {
      const mRoom = 'meeting_room';
      const rm = window.KLB.WORLD_MAPS?.rooms?.[mRoom];
      const allChairs = (rm?.objects || []).filter(o => o.type === 'chair');
      const vijayChair = allChairs.find(o => (o.label || '').toLowerCase().includes('vijay') || o.group === 'chudasama')
        || allChairs[1] || { x: 10, y: 4, dir: 'N' };
      const jamieChair = allChairs.find(o => (o.label || '').toLowerCase().includes('jamie')) || null;
      const nafsikaChair = allChairs.find(o => (o.label || '').toLowerCase().includes('nafsika')) || null;
      const archieChair = allChairs.find(o => (o.label || '').toLowerCase().includes('archie')) || null;
      const reservedChairs = new Set([vijayChair, jamieChair, nafsikaChair, archieChair].filter(Boolean));
      const chudChairs = allChairs.filter(o => !reservedChairs.has(o));
      const overflowSpots = [
        { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 11, y: 2 },
        { x: 12, y: 2 }, { x: 4, y: 5 }, { x: 18, y: 5 }
      ];

      const seatNpcInMeeting = (cid, targetSeat, taskText) => {
        const npc = state.npcs?.[cid];
        if (!npc) return null;
        npc.busyObjId = null;
        npc.huddleLockTimer = 0;
        npc.huddleTarget = null;
        npc.specsOn = false;
        npc.currentTaskText = taskText || 'Friday 09:00 Group Meeting';
        if (npc.sim) {
          npc.sim.currentAction = null;
          npc.sim.pendingJobStart = null;
        }
        if (teleport) {
          npc.pendingRoomTravel = null;
          npc.roomId = mRoom;
          const freeS = findFreeWalkableNear(state, mRoom, targetSeat.x, targetSeat.y, cid, true, { allowChokepoints: true }) || targetSeat;
          npc.x = freeS.x;
          npc.y = freeS.y;
          npc.dir = targetSeat.dir || 'N';
          npc.path = [];
        } else if (npc.roomId !== mRoom && !npc.pendingRoomTravel) {
          moveNpcToRoomAndPoint(state, npc, mRoom, targetSeat.x, targetSeat.y, false);
        }
        return npc;
      };

      const vj = seatNpcInMeeting(
        'vijay_chudasama',
        vijayChair,
        state.mutators?.vijays_not_in
          ? 'Friday 09:00 Group Meeting (Back from Conference)'
          : 'Friday 09:00 Group Meeting'
      );
      if (vj) {
        vj.departAtMins = state.mutators?.vijays_not_in ? 586 : null;
      }

      let seatIdx = 0;
      const nextSeat = () => {
        const seat = chudChairs[seatIdx] || overflowSpots[(seatIdx - chudChairs.length) % overflowSpots.length];
        seatIdx++;
        return seat;
      };

      for (const cid of getBigChudsIds()) {
        if (!state.spectatorMode && cid === state.player?.id) continue;
        if (!state.npcs?.[cid]) continue;
        seatNpcInMeeting(cid, nextSeat(), 'Friday 09:00 Group Meeting');
      }

      if (includeBakerMeeting) {
        const jb = seatNpcInMeeting('jamie_baker', jamieChair || nextSeat(), 'Friday 09:00 Group Meeting');
        if (jb) jb.departAtMins = 586;
        seatNpcInMeeting('nafsika_forte', nafsikaChair || nextSeat(), 'Friday 09:00 Group Meeting');
        if (state.spectatorMode || state.player?.id !== 'archie_wall') {
          seatNpcInMeeting('archie_wall', archieChair || nextSeat(), 'Friday 09:00 Group Meeting');
        }
      }
    }

    if (cqActive && !isFridayMorningMeeting) {
      syncCoffeeQuartet(state, teleport, 0);
    }

    const bigChudsSet = new Set(getBigChudsIds());
    for (const c of window.KLB.CAST || []) {
      if (!state.spectatorMode && c.id === state.player?.id) continue;
      if (c.fixedRoom) continue;
      const npc = state.npcs?.[c.id];
      if (!npc) continue;

      if (state.fireAlarm?.active && (npc.roomId === 'klb_2f' || npc.roomId === 'klb_3f')) {
        if (teleport) {
          npc.pendingRoomTravel = null;
          npc.roomId = 'offsite';
          npc.busyObjId = null;
          npc.path = [];
        } else if (!npc.pendingRoomTravel || npc.pendingRoomTravel.finalRoom !== 'offsite' || !npc.pendingRoomTravel.isFireEvac) {
          npc.busyObjId = null;
          npc.huddleLockTimer = 0;
          npc.huddleTarget = null;
          moveNpcToRoomAndPoint(state, npc, 'offsite', 0, 0, false);
        }
        continue;
      }

      const keepInBakerMeeting = Boolean(
        isFridayMorningMeeting &&
        includeBakerMeeting &&
        (c.id === 'jamie_baker' || c.id === 'nafsika_forte' || c.id === 'archie_wall')
      );
      if (keepInBakerMeeting) continue;

      if (c.isPI || ['claire_carmalt', 'safety_inspector', 'alex_king'].includes(c.id)) {
        continue;
      }

      if (isFridayMorningMeeting && bigChudsSet.has(c.id)) continue;
      if (!teleport && npc.pendingRoomTravel) continue;
      if (cqActive && cqMembers.has(c.id)) continue;

      const isFridayMeetingChud = state.dayIdx === 4 && (bigChudsSet.has(c.id) || (includeBakerMeeting && c.id === 'archie_wall'));
      const arrive = isFridayMeetingChud ? Math.min(c.arriveHour || 9.0, 9.0) : (c.arriveHour || 9.0);
      const inHours = hour >= arrive && hour <= (c.departHour || 18.0);
      if (!inHours) {
        if (teleport && !(state.postAuditCelebration && c.playable)) {
          npc.pendingRoomTravel = null;
          npc.roomId = 'offsite';
          npc.busyObjId = null;
          npc.path = [];
        }
        continue;
      }

      if (teleport && npc.roomId === 'offsite') {
        const targetRoom = Math.random() < 0.80 ? 'klb_2f' : 'klb_3f';
        const st = pickStationForNPC(state, c, targetRoom);
        if (st) {
          moveNpcToRoomAndObj(state, npc, targetRoom, st, true);
        } else {
          const sp = window.KLB.ROOM_META?.[targetRoom]?.entrySpawn || { x: 15, y: 12 };
          const free = findFreeWalkableNear(state, targetRoom, sp.x, sp.y, c.id, true) || sp;
          npc.pendingRoomTravel = null;
          npc.roomId = targetRoom;
          npc.x = free.x;
          npc.y = free.y;
          npc.specsOn = targetRoom === 'klb_2f';
          npc.path = [];
        }
      }
    }
  }

  function getVisibleNPCActions(state, roomId) {
    if (!state || !state.npcs) return [];
    const out = [];
    for (const npc of Object.values(state.npcs)) {
      const act = npc?.sim?.currentAction;
      if (!act) continue;
      if (npc.pendingRoomTravel || (npc.path && npc.path.length > 0)) continue;
      const actRoom = act.roomId || npc.roomId;
      if (roomId && actRoom !== roomId) continue;
      const meta = window.KLB.CAST_BY_ID?.[npc.id];
      const targetMins = Number(act.targetMins) || 0;
      const elapsedMins = Number(act.elapsedMins) || 0;
      out.push({
        id: `npc_act_${npc.id}`,
        npcId: npc.id,
        ownerId: npc.id,
        npcName: meta?.shortName || npc.id,
        ownerName: meta?.shortName || npc.id,
        kind: act.kind,
        roomId: actRoom,
        objId: act.objId || npc.busyObjId || null,
        x: act.x != null ? act.x : npc.x,
        y: act.y != null ? act.y : npc.y,
        title: act.label,
        label: act.label,
        status: 'running',
        progress: targetMins > 0 ? clamp(elapsedMins / targetMins, 0, 1) : 0,
        elapsedMins,
        targetMins,
        sweetSpotMins: 0
      });
    }
    return out;
  }

  function getVisibleNPCReactions(state, roomId) {
    if (!state || !state.npcs) return [];
    const out = [];
    const seenNpcObj = new Set();

    for (const npc of Object.values(state.npcs)) {
      const job = npc?.sim?.activeJob || npc?.sim?.activeRxn;
      if (!job) continue;
      if (roomId && job.roomId !== roomId) continue;
      const meta = window.KLB.CAST_BY_ID?.[npc.id];
      const targetMins = Number(job.targetMins) || 15;
      const elapsedMins = Number(job.elapsedMins) || 0;
      if (job.objId) seenNpcObj.add(`${npc.id}:${job.objId}`);
      out.push({
        id: job.id,
        npcId: npc.id,
        ownerId: npc.id,
        npcName: meta?.shortName || npc.id,
        ownerName: meta?.shortName || npc.id,
        roomId: job.roomId,
        objId: job.objId,
        stationType: job.stationType,
        kind: job.kind || (job.canOvercook ? 'reaction' : 'instrument'),
        x: job.x,
        y: job.y,
        title: job.title || job.label,
        label: job.label || job.title,
        status: job.status || 'running',
        progress: clamp(elapsedMins / Math.max(1, targetMins), 0, 1),
        elapsedMins,
        targetMins,
        sweetSpotMins: job.canOvercook ? (job.sweetSpotMins || 55) : 0
      });
    }

    for (const actEntry of getVisibleNPCActions(state, roomId)) {
      if (actEntry.objId && seenNpcObj.has(`${actEntry.npcId}:${actEntry.objId}`)) continue;
      out.push({
        ...actEntry,
        kind: 'workup'
      });
    }
    return out;
  }

  function syncVisibleReactionsCache(state) {
    if (!state) return;
    const viewRoom = getViewRoom(state);
    state.npcReactions = getVisibleNPCReactions(state, viewRoom);
    state.npcActions = getVisibleNPCActions(state, viewRoom);
  }

  // ==================== 10. RARE POISSON HAZARDS, EVENTS & BANTER ====================
  function overlapWindowMins(prevHour, curHour, winStart, winEnd) {
    const start = Math.max(prevHour, winStart);
    const end = Math.min(curHour, winEnd);
    return end > start ? (end - start) * 60 : 0;
  }

  function triggerSafetySweep(state, callbacks) {
    state._sweepToday = true;
    const entry2f = window.KLB.ROOM_META?.klb_2f?.entrySpawn || { x: 28, y: 12, dir: 'W' };
    const cc = state.npcs?.claire_carmalt;
    const si = state.npcs?.safety_inspector;
    if (cc) {
      cc.departAtMins = null;
      cc.busyObjId = null;
      cc.huddleLockTimer = 0;
      cc.huddleTarget = null;
      cc.specsOn = true;
      cc.currentTaskText = 'Departmental Safety Sweep';
      moveNpcToRoomAndPoint(state, cc, 'klb_2f', Math.max(0, entry2f.x - 4), entry2f.y, false);
    }
    if (si) {
      si.departAtMins = null;
      si.busyObjId = null;
      si.huddleLockTimer = 0;
      si.huddleTarget = null;
      si.specsOn = true;
      si.currentTaskText = 'Safety Inspection';
      moveNpcToRoomAndPoint(state, si, 'klb_2f', Math.max(0, entry2f.x - 4), entry2f.y + 1, false);
    }

    const countdownSec = (!state.spectatorMode && state.player?.id === 'marcos_fernandez') ? 90 : 45;
    state.safetySweep = {
      active: true,
      countdownSec,
      countdownMins: Math.round(countdownSec * CLOCK_MINS_PER_REAL_SEC * 10) / 10
    };

    reconcileArchive(arch => {
      arch.discoveredEvents = arch.discoveredEvents || {};
      arch.discoveredEvents.safety_sweep = (arch.discoveredEvents.safety_sweep || 0) + 1;
    });

    state._rareEventCounts = state._rareEventCounts || { safety_sweep: 0, fire_alarm_test: 0, alex_king_1718: 0 };
    state._rareEventCounts.safety_sweep += 1;

    if (!state.spectatorMode && state.player?.roomId === 'klb_2f') {
      const sender = pickNonPlayerBigChud(state, 'marcos_fernandez', 'daniel_richards');
      pushWhatsApp(state, sender, 'Claire and the Safety Inspector are in KLB 2F #headsup — Specs ON (G), Headphones OFF (H), and clean workspace!', callbacks);
      if (callbacks?.onToast) {
        callbacks.onToast(`SAFETY INSPECTION IN ${countdownSec}s! Put Specs ON (G), take Headphones OFF (H), and clean workspace!`);
      }
    }
    callbacks?.onSweepAlert?.(state.safetySweep);
    if (callbacks?.onRareEvent) callbacks.onRareEvent('safety_sweep');
  }

  function triggerLcmsDownHazard(state, callbacks = {}) {
    state._lcmsHazardToday = true;
    state.lcmsBroken = true;
    state._seenEventsThisWeek = state._seenEventsThisWeek || {};
    state._seenEventsThisWeek.kersti_lcms_down = true;
    state._lcmsDownEvents = (state._lcmsDownEvents || 0) + 1;
    state._rareEventCounts = state._rareEventCounts || {
      safety_sweep: 0, fire_alarm_test: 0, alex_king_1718: 0, lcms_down: 0, aoe2_event: 0
    };
    state._rareEventCounts.lcms_down = (state._rareEventCounts.lcms_down || 0) + 1;

    reconcileArchive(arch => {
      arch.discoveredEvents = arch.discoveredEvents || {};
      arch.discoveredEvents.kersti_lcms_down = (arch.discoveredEvents.kersti_lcms_down || 0) + 1;
    });

    const ev = (window.KLB.RANDOM_EVENTS || []).find(e => e.id === 'kersti_lcms_down');
    const waSender = pickNonPlayerBigChud(state, ev?.whatsappSender || 'antoine_maruani', 'daniel_richards');
    pushWhatsApp(
      state,
      waSender,
      ev?.whatsappMsg || 'Heads up, Kersti in LG11 just flagged the Q-TOF: "LCMS is out of the operation — PLRP-S column needs conditioning and mobile-phase flushing."',
      callbacks
    );

    const pRoom = state.player?.roomId;
    const modalBlocked = Boolean(
      state.paused || state.isPaused || state.safetySweep?.active || state.fireAlarm?.active || callbacks?.isModalOpen?.()
    );
    if (!state.spectatorMode && !modalBlocked && (pRoom === 'cib_lg11_ms' || pRoom === 'klb_2f')) {
      if (ev && callbacks?.onChoiceEvent) {
        callbacks.onChoiceEvent(ev);
      } else if (callbacks?.onToast) {
        callbacks.onToast('Kersti in CIB LG11: LC-MS is down and needs column conditioning!');
      }
    }
    if (callbacks?.onRareEvent) callbacks.onRareEvent('lcms_down');
  }

  function triggerAoe2Event(state, callbacks = {}) {
    if (!state || state.fireAlarm?.active) return false;
    state._aoe2CheckedDayKey = `${state.weekNum || 1}_${state.dayIdx}`;
    state._seenEventsThisWeek = state._seenEventsThisWeek || {};
    state._seenEventsThisWeek.aoe2_1700_invite = true;
    state.aoe2Event = { active: true, endMins: 18 * 60 };
    state._aoe2EventCount = (state._aoe2EventCount || 0) + 1;
    state._rareEventCounts = state._rareEventCounts || {
      safety_sweep: 0, fire_alarm_test: 0, alex_king_1718: 0, lcms_down: 0, aoe2_event: 0
    };
    state._rareEventCounts.aoe2_event = (state._rareEventCounts.aoe2_event || 0) + 1;

    const ev = (window.KLB.RANDOM_EVENTS || []).find(e => e.id === 'aoe2_1700_invite');
    const playerId = state.spectatorMode ? null : state.player?.id;
    const waSender = playerId === 'andre_shamsabadi' ? 'maximillian_lee' : 'andre_shamsabadi';
    pushWhatsApp(
      state,
      waSender,
      ev?.whatsappMsg || '17:00 AoE2 & Worms Lobby! Max, Antoine, Peter, and I are heading to our 3F desks for an hour of Black Forest and ninja ropes!'
    );
    if (!state.spectatorMode && callbacks?.onToast) {
      callbacks.onToast('17:00 AoE2 Event! Gaming crew heading to desks for an hour.');
    }

    const crewIds = ['peter_szijj', 'andre_shamsabadi', 'antoine_maruani', 'maximillian_lee'];
    const claimedThisEvent = new Set();
    for (const cid of crewIds) {
      if (!state.spectatorMode && playerId === cid) continue;
      const npc = state.npcs?.[cid];
      if (!npc || !npc.sim) continue;

      let chosen = null;
      for (const tryRoom of ['klb_3f', 'klb_2f']) {
        const rm = window.KLB.WORLD_MAPS?.rooms?.[tryRoom];
        const desks = (rm?.objects || []).filter(o =>
          o.type === 'writeup_desk' &&
          !claimedThisEvent.has(`${tryRoom}:${o.id}`) &&
          !isObjClaimed(state, tryRoom, o.id, cid)
        );
        for (const d of desks) {
          const adj = findFreeAdjacentWalkable(state, tryRoom, d, cid);
          if (adj) {
            chosen = { roomId: tryRoom, obj: d, adj };
            break;
          }
        }
        if (chosen) break;
      }
      if (!chosen) {
        const fb = pickStationForStep(state, npc, 'klb_3f', ['writeup_desk'], 'chudasama', { allowShared: true })
          || pickStationForStep(state, npc, 'klb_2f', ['writeup_desk'], 'chudasama', { allowShared: true });
        if (fb) chosen = { roomId: fb.roomId, obj: fb.obj, adj: fb.adj };
      }
      if (!chosen) continue;

      claimedThisEvent.add(`${chosen.roomId}:${chosen.obj.id}`);
      npc.huddleLockTimer = 0;
      npc.huddleTarget = null;
      npc.departAtMins = null;
      npc.sim.pendingJobStart = null;
      if (moveNpcToRoomAndObj(state, npc, chosen.roomId, chosen.obj, false, chosen.adj)) {
        npc.sim.currentAction = {
          kind: 'aoe2_event',
          label: 'Playing AoE2',
          roomId: chosen.roomId,
          objId: chosen.obj.id,
          x: chosen.obj.x,
          y: chosen.obj.y,
          elapsedMins: 0,
          targetMins: 60
        };
        npc.currentTaskText = 'Playing AoE2';
      }
    }
    if (callbacks?.onRareEvent) callbacks.onRareEvent('aoe2_event');
    return true;
  }

  function triggerFireAlarmTest(state, callbacks) {
    state._fireAlarmToday = true;
    state.fireAlarm = {
      active: true,
      remainingMins: 30,
      elapsedMins: 0
    };

    reconcileArchive(arch => {
      arch.discoveredEvents = arch.discoveredEvents || {};
      arch.discoveredEvents.fire_alarm_test = (arch.discoveredEvents.fire_alarm_test || 0) + 1;
    });

    state._rareEventCounts = state._rareEventCounts || { safety_sweep: 0, fire_alarm_test: 0, alex_king_1718: 0 };
    state._rareEventCounts.fire_alarm_test += 1;

    const senderFire = pickNonPlayerBigChud(state, 'marcos_fernandez', 'daniel_richards');
    pushWhatsApp(state, senderFire, 'FIRE ALARM RINGING IN KLB! Everyone out via the left fire exit — bench reactions keep ticking.', callbacks);

    if (!state.spectatorMode && callbacks?.onSpecialEvent) {
      const ev = (window.KLB.RANDOM_EVENTS || []).find(e => e.id === 'fire_alarm_test');
      callbacks.onSpecialEvent('fire_alarm_test', ev);
    }
    if (callbacks?.onRareEvent) callbacks.onRareEvent('fire_alarm_test');
    syncNPCSchedules(state, false, callbacks);
  }

  function triggerAlexKing1718(state, callbacks) {
    state._alexToday = true;
    const entry2f = window.KLB.ROOM_META?.klb_2f?.entrySpawn || { x: 28, y: 12, dir: 'W' };
    const ak = state.npcs?.alex_king;
    if (ak) {
      ak.busyObjId = null;
      ak.huddleLockTimer = 0;
      ak.huddleTarget = null;
      ak.specsOn = false;
      ak.departAtMins = state.timeMins + 10;
      ak.currentTaskText = 'Hovering outside Lab 230';
      moveNpcToRoomAndPoint(state, ak, 'klb_2f', Math.max(0, entry2f.x - 2), entry2f.y, false);
    }

    reconcileArchive(arch => {
      arch.discoveredEvents = arch.discoveredEvents || {};
      arch.discoveredEvents.alex_king_1718 = (arch.discoveredEvents.alex_king_1718 || 0) + 1;
    });

    state._rareEventCounts = state._rareEventCounts || { safety_sweep: 0, fire_alarm_test: 0, alex_king_1718: 0 };
    state._rareEventCounts.alex_king_1718 += 1;

    const senderAlex = pickNonPlayerBigChud(state, 'daniel_richards', 'marcos_fernandez');
    pushWhatsApp(state, senderAlex, "17:18 ALERT: Alex King is hovering by the Lab 230 door asking about Gordon's Café — do not lead her up to 3F.", callbacks);

    if (!state.spectatorMode && state.player?.roomId === 'klb_2f') {
      if (callbacks?.onSpecialEvent) callbacks.onSpecialEvent('alex_king_1718');
    }
    if (callbacks?.onRareEvent) callbacks.onRareEvent('alex_king_1718');
  }

  function evaluateRarePoissonHazards(state, prevMins, curMins, callbacks) {
    const prevHour = prevMins / 60;
    const curHour = curMins / 60;
    const coshhMult = state.mutators?.strict_coshh ? 2.0 : 1.0;
    const lcmsMut = state.mutators?.lcms_chaos ? 1.5 : 1.0;

    if (!state._sweepToday && !state.safetySweep?.active && !state.fireAlarm?.active) {
      const minsInWin = overlapWindowMins(prevHour, curHour, 9.5, 17.5);
      if (minsInWin > 0) {
        const pSweep = 1 - Math.exp(-(RATE_SWEEP_PER_MIN * coshhMult) * minsInWin);
        if (Math.random() < pSweep) {
          triggerSafetySweep(state, callbacks);
        }
      }
    }

    if (!state._fireAlarmToday && !state.fireAlarm?.active) {
      const minsInWin = overlapWindowMins(prevHour, curHour, 9.5, 17.5);
      if (minsInWin > 0) {
        const pAlarm = 1 - Math.exp(-RATE_ALARM_PER_MIN * minsInWin);
        if (Math.random() < pAlarm) {
          triggerFireAlarmTest(state, callbacks);
        }
      }
    }

    if (!state._alexToday && !state.fireAlarm?.active) {
      const minsInWin = overlapWindowMins(prevHour, curHour, 17.08, 17.75);
      if (minsInWin > 0) {
        const pAlex = 1 - Math.exp(-RATE_ALEX_PER_MIN * minsInWin);
        if (Math.random() < pAlex) {
          triggerAlexKing1718(state, callbacks);
        }
      }
    }

    if (!state._lcmsHazardToday && !state.lcmsBroken && !state.fireAlarm?.active) {
      const minsInWin = overlapWindowMins(prevHour, curHour, 9.0, 17.0);
      if (minsInWin > 0) {
        const pLcms = 1 - Math.exp(-(RATE_LCMS_PER_MIN * lcmsMut) * minsInWin);
        if (Math.random() < pLcms) {
          triggerLcmsDownHazard(state, callbacks);
        }
      }
    }
  }

  function evaluateSafetySweep(state, callbacks = {}) {
    const cc = state.npcs?.claire_carmalt;
    const si = state.npcs?.safety_inspector;
    const coshhMult = state.mutators?.strict_coshh ? 2.0 : 1.0;
    const playerViolations = [];
    const npcViolations = [];

    if (!state.spectatorMode) {
      const in2f = state.player?.roomId === 'klb_2f';
      if (in2f && !state.player?.specsOn) {
        playerViolations.push('not wearing Safety Specs');
      }
      if (in2f && state.player?.headphonesOn) {
        playerViolations.push('wearing Headphones during safety inspection');
      }
      if (getLabCondition(state) < 40) {
        playerViolations.push('messy workspace / dirty glassware');
      }
      if (state.prep?.thiol_dirty) {
        playerViolations.push('unquenched Cupboard 5 thiol glassware');
      }
      if (state.prep?.uncapped_waste) {
        playerViolations.push('uncapped solvent waste Winchester');
      }
    }

    for (const npc of Object.values(state.npcs || {})) {
      if (!npc || npc.roomId !== 'klb_2f' || !npc.sim) continue;
      const short = window.KLB.CAST_BY_ID?.[npc.id]?.shortName || npc.id;
      if (npc.sim.thiolDirty) {
        setLabCondition(npc.sim, getLabCondition(npc.sim) - 14 * coshhMult);
        if (Array.isArray(npc.sim.failures)) npc.sim.failures.push('safety_infraction');
        npcViolations.push(`${short} left thiol glassware unbleached`);
      }
      if (npc.specsOn === false) {
        setLabCondition(npc.sim, getLabCondition(npc.sim) - 12 * coshhMult);
        if (Array.isArray(npc.sim.failures)) npc.sim.failures.push('safety_infraction');
        npcViolations.push(`${short} bare-eyed in 2F`);
      }
      if (npc.headphonesOn === true) {
        setLabCondition(npc.sim, getLabCondition(npc.sim) - 10 * coshhMult);
        if (Array.isArray(npc.sim.failures)) npc.sim.failures.push('safety_infraction');
        npcViolations.push(`${short} wearing headphones in 2F`);
      }
      if (getLabCondition(npc.sim) < 40) {
        setLabCondition(npc.sim, getLabCondition(npc.sim) - 10 * coshhMult);
        if (Array.isArray(npc.sim.failures)) npc.sim.failures.push('safety_infraction');
        npcViolations.push(`${short} messy workspace in 2F`);
      }
      if (npc.sim.uncappedWaste) {
        setLabCondition(npc.sim, getLabCondition(npc.sim) - 10 * coshhMult);
        if (Array.isArray(npc.sim.failures)) npc.sim.failures.push('safety_infraction');
        npcViolations.push(`${short} uncapped silica waste`);
        npc.sim.uncappedWaste = false;
      }
    }

    if (state._labConditionStats && npcViolations.length > 0) {
      state._labConditionStats.sweepInfractions = (state._labConditionStats.sweepInfractions || 0) + npcViolations.length;
    }

    if (!state.spectatorMode) {
      if (playerViolations.length === 0) {
        setLabCondition(state, getLabCondition(state) + 8);
        state.patience = Math.min(100, state.patience + 5);
        if (state.player?.roomId === 'klb_2f') {
          const senderPass = pickNonPlayerBigChud(state, 'marcos_fernandez', 'daniel_richards');
          pushWhatsApp(state, senderPass, 'Passed Claire and the Safety Inspector sweep with zero infractions. Exemplary bay.', callbacks);
          if (callbacks.onToast) callbacks.onToast('Passed Departmental Safety Inspection! (+8 Lab Condition, +5 Patience)');
        }
      } else {
        const pen = Math.round(16 * coshhMult * playerViolations.length);
        setLabCondition(state, getLabCondition(state) - pen);
        state.patience = Math.max(0, state.patience - 10);
        state.morale = Math.max(0, state.morale - 10);
        const senderFail = pickNonPlayerBigChud(state, 'daniel_richards', 'marcos_fernandez');
        pushWhatsApp(state, senderFail, `Safety Inspector logged infractions: ${playerViolations.join('; ')}.`, callbacks);
        if (state.player?.roomId === 'klb_2f' && callbacks.onToast) {
          callbacks.onToast(`Safety Inspection Penalty (-${pen} Lab Condition, -10 Patience, -10 Morale): ${playerViolations[0]}`);
        }
      }
    }

    if (cc) cc.departAtMins = state.timeMins + 4;
    if (si) si.departAtMins = state.timeMins + 4;
    checkPermadeath(state, callbacks);
  }

  function isRemoteBanterRealistic(state, b, curHour) {
    if (!b) return false;
    if (!isDialogueAllowedAtTime(b, curHour, state?.dayIdx)) return false;
    const effectiveSenderId = resolveBigChudsSender(state, b.senderId);
    const sender = state.npcs?.[effectiveSenderId];
    const origSender = b.senderId !== effectiveSenderId ? state.npcs?.[b.senderId] : sender;
    const playerRoom = state.spectatorMode ? null : state.player?.roomId;
    const tag = b.context || b.remoteType || b.banterType || b.kind || b.category || b.tag || b.type || '';
    const sameRoom = Boolean(playerRoom && sender && sender.roomId === playerRoom);
    const farApart = !sameRoom || !state.player || Math.hypot(sender.x - state.player.x, sender.y - state.player.y) > 5.0;

    const arrivesFrom = b.senderId;
    if (tag === 'commute_late') {
      const arrive = window.KLB.CAST_BY_ID?.[effectiveSenderId]?.arriveHour || window.KLB.CAST_BY_ID?.[arrivesFrom]?.arriveHour || 9.25;
      return (!sender || sender.roomId === 'offsite') && (!origSender || origSender.roomId === 'offsite') && curHour <= (arrive + 0.75);
    }
    if (tag === 'gone_home') {
      return (!sender || sender.roomId === 'offsite') && (!origSender || origSender.roomId === 'offsite') && curHour >= 16.5;
    }
    if (tag === 'door_codes' || tag === 'cross_floor' || tag === 'facility_alert') {
      return !playerRoom || !sender || sender.roomId !== playerRoom;
    }
    if (tag === 'lunch_call') {
      return curHour >= 11.75 && curHour <= 13.75 && farApart;
    }
    if (tag === 'coffee_call') {
      const inWindow = (curHour >= 10.0 && curHour <= 11.25) || (curHour >= 14.5 && curHour <= 15.75);
      return inWindow && farApart;
    }
    if (tag === 'pub_call') {
      return curHour >= 16.5 && curHour <= 19.25 && farApart;
    }
    return !playerRoom || !sender || sender.roomId !== playerRoom || !state.player ||
      Math.hypot(sender.x - state.player.x, sender.y - state.player.y) > 6.0;
  }

  function triggerAmbientBanter(state, opts = {}) {
    const all = window.KLB.WHATSAPP_BANTER || [];
    if (!all.length) return false;
    const curHour = getTimeHours(state);
    const dayIdx = state.dayIdx ?? null;
    const curVibe = getCurrentDialogueVibe(state);
    state._usedBanter = state._usedBanter || {};
    const playerId = state.spectatorMode ? null : state.player?.id;
    const isKlbChat = isKlbChatMode(state);
    const vijayOut = Boolean(state.mutators?.vijays_not_in);
    const chudSet = new Set(getBigChudsIds());

    const banterAllowed = b => {
      if (!b || b.senderId === playerId) return false;
      if (!isKlbChat) {
        if (b.klbchatOnly) return false;
        if (b.senderId && !chudSet.has(b.senderId)) return false;
        if (b.replySenderId && !chudSet.has(b.replySenderId)) return false;
      }
      if (vijayOut && (b.senderId === 'vijay_chudasama' || b.replySenderId === 'vijay_chudasama')) return false;
      return isDialogueAllowedAtTime(b, curHour, dayIdx);
    };

    const hourEligible = all.filter(b =>
      banterAllowed(b) &&
      (b.hourHint === undefined || b.hourHint === null || Math.abs(b.hourHint - curHour) <= 3.5) &&
      (opts?.ignoreSpatial || isRemoteBanterRealistic(state, b, curHour))
    );
    const allEligible = hourEligible.length
      ? hourEligible
      : (opts?.ignoreSpatial ? all.filter(banterAllowed) : []);
    if (!allEligible.length) return false;

    const item = pickFromShuffleBag(state, 'whatsapp_banter', allEligible, b => b.text, {
      preferFns: [
        b => (b.hourHint === undefined || b.hourHint === null || Math.abs(b.hourHint - curHour) <= 2.25) && Boolean(curVibe && b.vibe === curVibe),
        b => b.hourHint === undefined || b.hourHint === null || Math.abs(b.hourHint - curHour) <= 2.25
      ]
    });
    if (!item) return false;
    const origIdx = all.indexOf(item);
    if (origIdx >= 0) state._usedBanter[origIdx] = true;

    const effectiveSenderId = item.senderId ? resolveBigChudsSender(state, item.senderId) : null;
    if (effectiveSenderId && effectiveSenderId !== playerId) {
      pushWhatsApp(state, effectiveSenderId, item.text);
      if (item.replySenderId && item.replyText) {
        const effectiveReplyId = resolveBigChudsSender(state, item.replySenderId, effectiveSenderId);
        if (effectiveReplyId && effectiveReplyId !== playerId && effectiveReplyId !== effectiveSenderId) {
          state._queuedWaReplies = state._queuedWaReplies || [];
          state._queuedWaReplies.push({
            delayMins: 1,
            senderId: effectiveReplyId,
            replyToId: effectiveSenderId,
            text: item.replyText
          });
        }
      }
      return true;
    }
    return false;
  }

  const SPAWN_ON_TRIGGER_EVENT_IDS = new Set(['vijay_bench_round', 'jamie_specs_check', 'door_pls']);
  const ALLOW_AS_PLAYER_EVENT_IDS = new Set(['calise_lemons_spill']);

  function triggerRandomKLBEvent(state, callbacks = {}) {
    if (!state || state.spectatorMode || state.fireAlarm?.active) return false;
    const playerRoom = state.player?.roomId;
    const playerId = state.player?.id;
    const hour = (state.timeMins || 0) / 60;
    state._seenEventsThisWeek = state._seenEventsThisWeek || {};

    const eligible = (window.KLB.RANDOM_EVENTS || []).filter(ev => {
      if (!ev) return false;
      if (ev.isRareSignature || RARE_SIGNATURE_IDS.has(ev.id)) return false;
      if (ev.id === 'vijay_bench_round' && (state.mutators?.vijays_not_in || playerId === 'archie_wall')) return false;
      if (ev.id === 'cold_in_230' && state.mutators?.eternal_heatwave) return false;
      if (!Array.isArray(ev.validRooms) || !ev.validRooms.includes(playerRoom)) return false;
      if (state.dayIdx < (ev.minDay || 0)) return false;
      if (ev.dayOnly != null && state.dayIdx !== ev.dayOnly) return false;
      if (ev.minHour != null && hour < ev.minHour) return false;
      if (ev.maxHour != null && hour > ev.maxHour) return false;
      if (ev.beforeFridayAudit && state.fridayAuditDone) return false;
      if (state._seenEventsThisWeek[ev.id]) return false;

      const allowAsPlayer = ev.allowAsPlayer === true || (ev.allowAsPlayer !== false && ALLOW_AS_PLAYER_EVENT_IDS.has(ev.id));
      if (!allowAsPlayer && ev.whatsappSender === playerId) return false;

      const canSpawnActor = Boolean(ev.spawnActorOnTrigger === true || SPAWN_ON_TRIGGER_EVENT_IDS.has(ev.id));
      if (ev.actorId) {
        if (ev.actorId === playerId) {
          if (!allowAsPlayer) return false;
        } else if (!canSpawnActor) {
          const actor = state.npcs?.[ev.actorId];
          if (!actor || actor.roomId !== playerRoom) return false;
          if (Math.hypot(actor.x - state.player.x, actor.y - state.player.y) > 9.0) return false;
        }
      }
      return true;
    });

    if (!eligible.length) return false;

    const ev = pickFromShuffleBag(state, 'random_events', eligible, e => e.id);
    if (!ev) return false;

    state._seenEventsThisWeek[ev.id] = true;
    reconcileArchive(arch => {
      arch.discoveredEvents = arch.discoveredEvents || {};
      arch.discoveredEvents[ev.id] = (arch.discoveredEvents[ev.id] || 0) + 1;
    });

    if (ev.id === 'vijay_bench_round' && !state.mutators?.vijays_not_in) {
      state.vijayRound = { active: true, checkedPlayer: false };
      const vj = state.npcs?.vijay_chudasama;
      if (vj) {
        vj.huddleLockTimer = 0;
        vj.huddleTarget = null;
        vj.busyObjId = null;
        vj.specsOn = true;
        vj.departAtMins = Math.max(vj.departAtMins || 0, state.timeMins + 20);
        vj.currentTaskText = 'Doing KLB 2F bench rounds';
        if (vj.roomId === 'offsite') {
          const freeSp = getDoorwaySpawn(state, 'klb_2f', 'vijay_chudasama');
          vj.pendingRoomTravel = null;
          vj.roomId = 'klb_2f';
          vj.x = freeSp.x;
          vj.y = freeSp.y;
          vj.dir = freeSp.dir || 'W';
        }
        moveNpcToRoomAndPoint(state, vj, 'klb_2f', Math.round(state.player.x), Math.round(state.player.y), false);
      }
      const vjSender = pickNonPlayerBigChud(state, 'marcos_fernandez', 'daniel_richards');
      pushWhatsApp(state, vjSender, 'Vijay just walked into KLB 2nd Floor doing hood-to-hood bench checks #headsup.', callbacks);
      if (callbacks.onToast) callbacks.onToast('Prof. Vijay Chudasama entered KLB 2nd Floor for bench rounds!');
      return true;
    }

    if (ev.id === 'door_pls') {
      const chuds = ['faiza_javaid', 'calise_bahou', 'peter_szijj', 'andre_shamsabadi'].filter(id => id !== playerId);
      const req = chuds[Math.floor(Math.random() * chuds.length)] || 'faiza_javaid';
      state.doorPls = { active: true, requesterId: req, expireMins: state.timeMins + 25 };
      pushWhatsApp(state, req, 'Door pls! Forgot my UCL card upstairs (Interact with the main 2F exit door within 25m for +1 Favour).', callbacks);
      return true;
    }

    if ((ev.spawnActorOnTrigger === true || ev.id === 'jamie_specs_check') && ev.actorId) {
      const actor = state.npcs?.[ev.actorId];
      if (actor) {
        actor.huddleLockTimer = 0;
        actor.huddleTarget = null;
        actor.busyObjId = null;
        actor.specsOn = playerRoom === 'klb_2f';
        actor.departAtMins = Math.max(actor.departAtMins || 0, state.timeMins + 15);
        if (ev.id === 'jamie_specs_check') {
          actor.currentTaskText = 'Patrolling Baker bay & checking specs';
        }
        if (actor.roomId === 'offsite') {
          const freeSp = getDoorwaySpawn(state, playerRoom, actor.id);
          actor.pendingRoomTravel = null;
          actor.roomId = playerRoom;
          actor.x = freeSp.x;
          actor.y = freeSp.y;
          actor.dir = freeSp.dir || 'W';
        }
        moveNpcToRoomAndPoint(state, actor, playerRoom, Math.round(state.player.x), Math.round(state.player.y), false);
      }
    }

    if (ev.id === 'cold_in_230') {
      state.weatherMode = 'cold_230';
      state.tempC = 16.3;
      const sCold = pickNonPlayerBigChud(state, 'richard_spears', 'daniel_richards');
      pushWhatsApp(state, sCold, 'HVAC broken again — it is 16 °C in Lab 230 and the anhydrous DMSO bottles are frozen solid.', callbacks);
      if (ev.choices && ev.choices.length && callbacks.onChoiceEvent) callbacks.onChoiceEvent(ev);
      return true;
    }

    if (ev.id === 'may_heatwave') {
      state.weatherMode = 'heatwave';
      state.tempC = 30.1;
      const sHeat = pickNonPlayerBigChud(state, 'calise_bahou', 'daniel_richards');
      pushWhatsApp(state, sHeat, '30.1 °C in Lab 230 today! Keep the 4 °C fridge doors shut or cold PD reactions will warm up.', callbacks);
      if (ev.choices && ev.choices.length && callbacks.onChoiceEvent) callbacks.onChoiceEvent(ev);
      return true;
    }

    if (ev.id === 'kersti_lcms_down') {
      state.lcmsBroken = true;
      const sLcms = pickNonPlayerBigChud(state, 'antoine_maruani', 'daniel_richards');
      pushWhatsApp(state, sLcms, 'Kersti email: LCMS is out of the operation — PEG in mobile phase. Visit LG11 to flush or wait it out.', callbacks);
      if (ev.choices && ev.choices.length && callbacks.onChoiceEvent) callbacks.onChoiceEvent(ev);
      return true;
    }

    if (ev.id === 'solvent_cupboard_low') {
      const sSolv = pickNonPlayerBigChud(state, ev.whatsappSender || 'andre_shamsabadi', 'daniel_richards');
      pushWhatsApp(state, sSolv, ev.whatsappMsg || 'Cupboard 9 column solvents and Cupboard 1 dry THF Winchesters are running low!', callbacks);
      if (ev.choices && ev.choices.length && callbacks.onChoiceEvent) callbacks.onChoiceEvent(ev);
      return true;
    }

    if (ev.id === 'north_bench_ether_smell') {
      const sEther = pickNonPlayerBigChud(state, ev.whatsappSender || 'marcos_fernandez', 'daniel_richards');
      pushWhatsApp(state, sEther, ev.whatsappMsg || 'Strong diethyl ether fumes wafting from the south-east Baker bay near Cupboard 20!', callbacks);
      if (ev.choices && ev.choices.length && callbacks.onChoiceEvent) callbacks.onChoiceEvent(ev);
      return true;
    }

    if (ev.whatsappSender && ev.whatsappMsg) {
      const allowAsPlayer = ev.allowAsPlayer === true || (ev.allowAsPlayer !== false && ALLOW_AS_PLAYER_EVENT_IDS.has(ev.id));
      const sEv = (allowAsPlayer && ev.whatsappSender === playerId)
        ? ev.whatsappSender
        : pickNonPlayerBigChud(state, ev.whatsappSender, 'daniel_richards');
      pushWhatsApp(state, sEv, ev.whatsappMsg, callbacks);
    }
    if (ev.choices && ev.choices.length && callbacks.onChoiceEvent) {
      callbacks.onChoiceEvent(ev);
    }
    return true;
  }

  // ==================== 11. DAY / WEEK ROLLOVER & MAIN STEP ====================
  function finishNpcHuddleLock(state, npc) {
    const hTarget = npc.huddleTarget;
    const postAction = hTarget?.postAction;
    const preserveDeskAction = Boolean(hTarget?.preserveDeskAction);
    npc.huddleTarget = null;
    if (preserveDeskAction && npc.sim?.currentAction) {
      faceNpcTowardCurrentAction(npc);
    }
    if (postAction === 'smoke_break' && !state.fireAlarm?.active && npc.sim) {
      npc.sim.currentAction = {
        kind: 'smoke_break',
        label: 'Smoke Break Outside KLB',
        roomId: 'offsite',
        objId: null,
        x: 28,
        y: 12,
        elapsedMins: 0,
        targetMins: 8
      };
      npc.currentTaskText = 'Smoke break outside KLB';
      moveNpcToRoomAndPoint(state, npc, 'offsite', 0, 0, false);
      return;
    }
    const meta = window.KLB.CAST_BY_ID?.[npc.id];
    if (meta?.fixedRoom && meta?.fixedPos && npc.roomId === meta.fixedRoom) {
      if (Math.hypot(npc.x - meta.fixedPos.x, npc.y - meta.fixedPos.y) > 0.5) {
        npc.path = findPathBFS(meta.fixedRoom, npc.x, npc.y, meta.fixedPos.x, meta.fixedPos.y, 45, state, npc.id);
      } else {
        npc.dir = meta.fixedPos.dir || npc.dir;
      }
    }
  }

  function resetBigChudsWeeklySims(state) {
    if (!state) return;
    for (const npc of Object.values(state.npcs || {})) {
      if (!npc || (!state.spectatorMode && npc.id === state.player?.id)) continue;
      const meta = window.KLB.CAST_BY_ID?.[npc.id];
      if (!npc.sim || !meta?.playable) continue;
      const prevStats = npc.sim.weeklyStats;
      const prevPatience = npc.sim.patience ?? 82;
      const fresh = makeInitialNpcSim(meta);
      fresh.weeklyStats = prevStats;
      fresh.patience = prevPatience;
      npc.sim = fresh;
    }
  }

  function syncDayWeekRolloverFlags(state, callbacks = {}) {
    if (state._trackedWeekNum !== state.weekNum) {
      state._trackedWeekNum = state.weekNum;
      state._seenEventsThisWeek = {};
      state._weeklySigDone = {};
      state._lastWeeklySigMins = -999;
      state._lastWeeklySigDay = -1;
      state.abilFineOwed = false;
      state.fridayFinalAuditDone = false;
      resetBigChudsWeeklySims(state);
    }
    if (state._trackedDayIdx !== state.dayIdx) {
      state._trackedDayIdx = state.dayIdx;
      state.aoe2UsedToday = false;
      state.coffeeUsedToday = false;
      state._prevAoe2UsedToday = false;
      state._lcmsHazardToday = false;
      state.aoe2Event = { active: false, endMins: 0 };
      state.vijayRound = { active: false, checkedPlayer: false };
      state.doorPls = { active: false, requesterId: null, expireMins: 0 };
      state._pollToday = false;
      state._sweepToday = false;
      state._fireAlarmToday = false;
      state._alexToday = false;
      state._coffeePingToday = false;
      state._quartetWaToday = false;
      state._eveningToastToday = false;
      state._salveToday = false;
      state._speakersMoraleToday = false;
      state._tcepFavourToday = false;
      state._sampleAskCooldowns = {};
      if (state.prep) {
        state.prep.ph_calibrated = false;
      }
      rollDailyWeather(state);
      rollDailyBirthday(state, callbacks);
    }
  }

  function rollToNextDay(state, callbacks = {}, forcedCurfew = true) {
    // Fallback deadline checks before leaving Thursday or wrapping Friday -> Monday
    if (state.dayIdx === 3) {
      evaluateWeeklyReportDeadline(state, callbacks);
    }
    if (state.dayIdx === 4) {
      evaluateManuscriptDeadline(state, callbacks);
    }

    // Overcook unattended non-cold jobs left past 19:30 curfew & flag uncollected NMR tubes
    const overcookJob = j => {
      if (!j) return;
      if (j.roomId === 'cib_lg1b_nmr' && !j._abilFineApplied && !state.spectatorMode) {
        j._abilFineApplied = true;
        state.abilFineOwed = true;
        pushWhatsApp(
          state,
          'abil_aliev',
          'Abil (LG1b NMR): "Uncollected NMR tube left past curfew — moved to the Sample Fridge (£130 fine). Collect your NMR tube or settle the fine!"',
          callbacks
        );
      }
      if (!j.isCold4C && (j.canOvercook !== false)) j.status = 'overcooked';
    };
    (state.activeStationJobs || []).forEach(overcookJob);
    (state.activeReactions || []).forEach(overcookJob);

    if (!state.spectatorMode) {
      state.activePlayerAction = null;
      state.hadLunchToday = false;
      state._salveToday = false;
      state._speakersMoraleToday = false;
      state._tcepFavourToday = false;
      state._prevAoe2UsedToday = false;
      state.npcChatCooldowns = {};
      if (state.prep) {
        state.prep.ph_calibrated = false;
      }
    }

    for (const npc of Object.values(state.npcs || {})) {
      if (npc.sim?.activeJob) {
        const job = npc.sim.activeJob;
        if (!job.isCold4C && job.canOvercook && job.status !== 'overcooked') {
          job.status = 'overcooked';
          if (Array.isArray(npc.sim.failures)) npc.sim.failures.push('overcook');
          if (npc.sim.weeklyStats) npc.sim.weeklyStats.overcooks += 1;
        }
      }
      if (npc.sim) {
        const roughNight = Math.random() < 0.28;
        npc.sim.energy = roughNight ? (46 + Math.floor(Math.random() * 18)) : (70 + Math.floor(Math.random() * 20));
        npc.sim.morale = clamp((npc.sim.morale ?? 50) + 4, 0, 100);
        npc.sim.social = clamp((npc.sim.social ?? 84) + 6, 0, 100);
        npc.sim.hadLunchToday = false;
        npc.sim.currentAction = null;
        npc.sim.pendingJobStart = null;
        npc.sim._quartetDoneKey = null;
      }
      if (!window.KLB.CAST_BY_ID?.[npc.id]?.fixedRoom) {
        npc.pendingRoomTravel = null;
        npc.roomId = 'offsite';
        npc.path = [];
        npc.busyObjId = null;
        npc.huddleLockTimer = 0;
        npc.huddleTarget = null;
      }
    }

    state.fireAlarm = { active: false, remainingMins: 0, elapsedMins: 0 };
    state.safetySweep = { active: false, countdownSec: 0, countdownMins: 0 };
    state.aoe2Event = { active: false, endMins: 0 };
    state.vijayRound = { active: false, checkedPlayer: false };
    state.doorPls = { active: false, requesterId: null, expireMins: 0 };
    state.lcmsBroken = false;
    state._lcmsHazardToday = false;

    if (state.dayIdx >= 4) {
      state.weekNum = (state.weekNum || 1) + 1;
      state.dayIdx = 0;
      if (!state.spectatorMode) {
        state.weeklyReportProgress = 0;
        state.weeklyReportChecked = false;
        state.manuscriptProgress = 0;
        state.manuscriptChecked = false;
      }
    } else {
      state.dayIdx += 1;
    }

    syncDayWeekRolloverFlags(state, callbacks);

    const charMeta = window.KLB.CAST_BY_ID?.[state.player?.id];
    const isFridayRollout = state.dayIdx === 4;
    const startHour = isFridayRollout ? 9.0 : (state.spectatorMode ? 7.75 : (charMeta?.arriveHour || 9.0));
    state.timeMins = Math.round(startHour * 60);

    if (!state.spectatorMode) {
      state.energy = forcedCurfew ? 78 : 95;
      state.morale = clamp((state.morale ?? 50) + (forcedCurfew ? -4 : 4), 0, 100);
      state.social = Math.min(100, (state.social ?? 84) + 6);
      state.lastPreferredBreakMins = state.timeMins;
      if (isFridayRollout) {
        const mSpawn = window.KLB.ROOM_META?.meeting_room?.entrySpawn || { x: 6, y: 6, dir: 'N' };
        state.player.roomId = 'meeting_room';
        state.player.x = mSpawn.x;
        state.player.y = mSpawn.y;
        state.player.dir = mSpawn.dir || 'N';
        state.player.specsOn = false;
      } else {
        state.player.roomId = 'klb_2f';
        state.player.x = 27;
        state.player.y = 12;
        state.player.dir = 'W';
        state.player.specsOn = true;
      }
    }

    for (const npc of Object.values(state.npcs || {})) {
      if (npc.sim && npc.sim.lastPreferredBreakMins !== undefined) {
        const meta = window.KLB.CAST_BY_ID?.[npc.id];
        npc.sim.lastPreferredBreakMins = Math.round((meta?.arriveHour || 9.0) * 60);
      }
    }

    syncNPCSchedules(state, true, callbacks);
    syncVisibleReactionsCache(state);
    if (isFridayRollout) {
      callbacks.onFridayMorningMeeting?.();
    }
    if (!state.spectatorMode && callbacks.onToast) {
      callbacks.onToast(isFridayRollout
        ? 'FRI 09:00 — Group Meeting starting in the Seminar Room!'
        : `19:30 KLB Security Lockup — rolled to ${DAYS[state.dayIdx]} morning.`);
    }
    checkPermadeath(state, callbacks);
  }

  function advanceMinutes(state, deltaMins, callbacks = {}) {
    if (!state || state.gameOver || state.victory || deltaMins <= 0) return;

    const prevCb = state._activeCallbacks;
    state._activeCallbacks = callbacks;
    try {
      syncDayWeekRolloverFlags(state, callbacks);

      const prevTimeMins = state.timeMins;
      state.timeMins += deltaMins;
      const hour = state.timeMins / 60;

      // 1. Float job/action/alarm progression ONLY when not called from tickRealTime (prevents double-counting)
      if (!state._tickingRealTime) {
        advanceActiveJobs(state, deltaMins, callbacks);
        advancePlayerAction(state, deltaMins, callbacks);
        advanceFireAlarm(state, deltaMins, callbacks);
        tickNpcJobsAndActions(state, deltaMins);
      }

      // 2. Evaluate headless/non-realtime Safety Sweep countdown (paused during WhatsApp time spend)
      if (state.safetySweep?.active && !state._tickingRealTime && !callbacks?.suppressRandomEvents) {
        state.safetySweep.countdownMins = Math.max(0, (state.safetySweep.countdownMins ?? 2) - deltaMins);
        state.safetySweep.countdownSec = Math.max(0, state.safetySweep.countdownMins / CLOCK_MINS_PER_REAL_SEC);
        if (state.safetySweep.countdownMins <= 0) {
          state.safetySweep.active = false;
          evaluateSafetySweep(state, callbacks);
        }
      }

      // 3. Evaluate stochastic rare Poisson hazards (~18% per day each; LC-MS ~30% per day)
      if (!callbacks?.suppressRandomEvents && !state.postAuditCelebration) {
        evaluateRarePoissonHazards(state, prevTimeMins, state.timeMins, callbacks);
      }

      // 3b. 17:00 AoE2 Event (25% daily chance Mon-Fri, skipped when random events suppressed)
      if (!callbacks?.suppressRandomEvents && !state.postAuditCelebration && state.dayIdx >= 0 && state.dayIdx <= 4 && state.timeMins >= 17 * 60) {
        const weekDayKey = `${state.weekNum || 1}_${state.dayIdx}`;
        if (state._aoe2CheckedDayKey !== weekDayKey) {
          state._aoe2CheckedDayKey = weekDayKey;
          if (!state.fireAlarm?.active && Math.random() < 0.25) {
            triggerAoe2Event(state, callbacks);
          }
        }
      }
      if (state.aoe2Event?.active && state.timeMins >= (state.aoe2Event.endMins || 18 * 60)) {
        state.aoe2Event.active = false;
      }

      // 4. Morning Coffee Quartet WhatsApp drop (10:27 - 10:36)
      if (!state._quartetWaToday && state.dayIdx >= 0 && state.dayIdx <= 4 && hour >= 10.45 && hour <= 10.62) {
        state._quartetWaToday = true;
        state._coffeePingToday = true;
        const sender = pickNonPlayerBigChud(state, 'joao_nogueira', 'faiza_javaid');
        const coffeeMsg = state.mutators?.vijays_not_in
          ? "Coffee Quartet heading to Gordon's Café — grab a flat white!"
          : "10:30 Gordon's coffee run leaving now — heading over with Nafsika and Vijay for twenty minutes.";
        pushWhatsApp(state, sender, coffeeMsg, callbacks);
      }

      // 5. 18:15 Evening Shift Toast
      if (!state._eveningToastToday && hour >= 18.25) {
        state._eveningToastToday = true;
        const evSender = pickNonPlayerBigChud(state, 'daniel_richards', 'marcos_fernandez');
        pushWhatsApp(state, evSender, '18:15 update: daytime shift heading out — Peter and Nafsika holding the fort in Lab 230.', callbacks);
        if (!state.spectatorMode && callbacks.onToast) {
          callbacks.onToast('18:15 Evening Shift: daytime crew packing up; Peter and Nafsika holding Lab 230.');
        }
      }

      // 6. Thursday 18:00 Weekly Report Deadline & Friday 18:00 Manuscript Deadline
      if (state.dayIdx === 3 && state.timeMins >= 18 * 60) {
        evaluateWeeklyReportDeadline(state, callbacks);
      }
      if (state.dayIdx === 4 && state.timeMins >= 18 * 60) {
        evaluateManuscriptDeadline(state, callbacks);
      }

      // 7. Decrement per-NPC player chat cooldowns
      if (state.npcChatCooldowns) {
        for (const [npcId, rem] of Object.entries(state.npcChatCooldowns)) {
          const next = (Number(rem) || 0) - deltaMins;
          if (next <= 0) delete state.npcChatCooldowns[npcId];
          else state.npcChatCooldowns[npcId] = next;
        }
      }

      // 8. Player Energy, Social, Morale & Lab Condition (paused during post-audit celebration)
      if (!state.spectatorMode && !state.postAuditCelebration) {
        const energyDrain = computeEnergyDrain(
          state,
          state.player?.id,
          state.preferences,
          state.player?.roomId,
          Boolean(state.player?.headphonesOn),
          hour,
          deltaMins
        );
        state.energy = clamp(state.energy - energyDrain, 0, 100);

        // Social drain when not actively in Coffee Quartet or shared Gordon's Café lunch
        const inPlayerQuartet = Boolean(isCoffeeQuartetWindow(state)) && state.player?.roomId === 'gordons_cafe';
        const inSharedLunch = state.activePlayerAction?.kind === 'lunch' && hasColleaguesInRoom(state, 'gordons_cafe', state.player?.id);
        if (!inPlayerQuartet && !inSharedLunch) {
          state.social = clamp((state.social ?? 84) - 0.085 * deltaMins, 0, 100);
        }

        // Passive Morale drain (lab stress in 2F/CIB + low social + preference neglect); Specs OFF reduces by 40%
        const pRoom = state.player?.roomId || 'klb_2f';
        let passiveMoraleDrain = 0;
        if ((pRoom === 'klb_2f' || String(pRoom).startsWith('cib_')) && !state.fireAlarm?.active) {
          passiveMoraleDrain += 0.025 * deltaMins;
        }
        if ((state.social ?? 84) < 30) {
          passiveMoraleDrain += 0.04 * deltaMins;
        }
        if (isNeglectingPreferredBreak(state, state.timeMins)) {
          passiveMoraleDrain += 0.025 * deltaMins;
        }
        if (state.player?.specsOn === false) {
          passiveMoraleDrain *= 0.60;
        }
        if (passiveMoraleDrain > 0) {
          state.morale = clamp(state.morale - passiveMoraleDrain, 0, 100);
        }

        // Uncleaned Cupboard 5 thiol glassware or uncapped waste drags Lab Condition
        if (state.prep?.thiol_dirty || state.prep?.uncapped_waste) {
          setLabCondition(state, getLabCondition(state) - 0.08 * deltaMins);
        }
        if (state.prep?.thiol_dirty) {
          state.morale = Math.max(0, state.morale - 0.20 * deltaMins);
        }
      }

      // 9. Door pls expiry
      if (state.doorPls?.active && state.timeMins >= state.doorPls.expireMins) {
        state.doorPls.active = false;
      }

      // 10. Advance NPC paths, portal hops & huddle locks proportionally during headless steps
      if (!state._tickingRealTime) {
        const stepsToAdvance = Math.max(1, Math.round(deltaMins * 1.65));
        const headlessFast = Boolean(state._headlessVerify);
        for (const npc of Object.values(state.npcs || {})) {
          if ((npc.huddleLockTimer || 0) > 0) {
            npc.huddleLockTimer = Math.max(0, npc.huddleLockTimer - deltaMins * 0.5);
            if (npc.huddleLockTimer <= 0) finishNpcHuddleLock(state, npc);
          }
          if (npc.roomId === 'offsite') continue;
          let remSteps = stepsToAdvance;
          while (remSteps > 0) {
            if (npc.path && npc.path.length > 0) {
              const step = npc.path[0];
              const canStepSqueeze = isChokepointOrDoorway(npc.roomId, step.x, step.y)
                || Boolean(npc.pendingRoomTravel && (npc.pendingRoomTravel.waitSec || 0) >= 1.5);
              if (canStepSqueeze || npc.path.length > 1 || !isOccupiedByCharacter(state, npc.roomId, step.x, step.y, npc.id, 0.48)) {
                npc.x = step.x;
                npc.y = step.y;
                npc.dir = step.dir || npc.dir;
                npc.path.shift();
                if (npc.path.length === 0 && npc.busyObjId) {
                  faceNpcTowardCurrentAction(npc);
                }
                if (!headlessFast && npc.pendingRoomTravel) {
                  const travel = npc.pendingRoomTravel;
                  const dist = Math.hypot(npc.x - travel.portalCell.x, npc.y - travel.portalCell.y);
                  if (dist <= getPortalCaptureRadius(npc.roomId, travel)) {
                    completeNpcPortalHop(state, npc);
                    if (npc.roomId === 'offsite') break;
                    remSteps--;
                    continue;
                  }
                }
                remSteps--;
                continue;
              } else {
                if (npc.pendingRoomTravel) {
                  const travel = npc.pendingRoomTravel;
                  const dist = Math.hypot(npc.x - travel.portalCell.x, npc.y - travel.portalCell.y);
                  travel.waitSec = (travel.waitSec || 0) + (deltaMins / CLOCK_MINS_PER_REAL_SEC);
                  const shouldHop = headlessFast
                    ? (dist <= 1.85 || travel.waitSec >= 4.0)
                    : (dist <= getPortalCaptureRadius(npc.roomId, travel));
                  if (shouldHop) {
                    completeNpcPortalHop(state, npc);
                    if (npc.roomId === 'offsite') break;
                    continue;
                  }
                }
                if (headlessFast) {
                  const alt = findFreeWalkableNear(state, npc.roomId, step.x, step.y, npc.id, true);
                  if (alt) {
                    npc.x = alt.x;
                    npc.y = alt.y;
                  }
                  npc.path = [];
                } else {
                  const goal = npc.path[npc.path.length - 1];
                  const alt = findFreeWalkableNear(state, npc.roomId, npc.x, npc.y, npc.id, false);
                  if (alt && Math.hypot(alt.x - npc.x, alt.y - npc.y) <= 1.5) {
                    npc.x = alt.x;
                    npc.y = alt.y;
                    npc.path = goal ? findPathBFS(npc.roomId, npc.x, npc.y, goal.x, goal.y, 65, null, null) : [];
                  } else {
                    npc.path = goal ? findPathBFS(npc.roomId, npc.x, npc.y, goal.x, goal.y, 65, null, null) : [];
                    if (!npc.path || npc.path.length === 0) break;
                  }
                  remSteps--;
                }
              }
            }
            if (npc.pendingRoomTravel && (!npc.path || npc.path.length === 0)) {
              const travel = npc.pendingRoomTravel;
              const dist = Math.hypot(npc.x - travel.portalCell.x, npc.y - travel.portalCell.y);
              const capR = headlessFast ? 1.85 : getPortalCaptureRadius(npc.roomId, travel);
              const shouldHop = headlessFast
                ? (dist <= 1.85 || (travel.waitSec || 0) >= 4.0)
                : (dist <= capR);
              if (shouldHop) {
                completeNpcPortalHop(state, npc);
                if (npc.roomId === 'offsite') break;
                continue;
              } else {
                travel.waitSec = (travel.waitSec || 0) + (deltaMins / CLOCK_MINS_PER_REAL_SEC);
                if (headlessFast) {
                  const portalFree = findFreeWalkableNear(state, npc.roomId, travel.portalCell.x, travel.portalCell.y, npc.id, true, { allowChokepoints: true }) || travel.portalCell;
                  npc.path = findPathBFS(npc.roomId, npc.x, npc.y, portalFree.x, portalFree.y, 65, state, npc.id);
                } else {
                  npc.path = computePortalPath(state, npc.roomId, npc.x, npc.y, travel.portalCell, npc.id, (travel.waitSec || 0) >= 1.5);
                }
                if (!npc.path || npc.path.length === 0) break;
                continue;
              }
            }
            break;
          }
        }
      }

      // 11. Step autonomous NPCs & Coffee Quartet
      syncNPCSchedules(state, false, callbacks);
      stepAllNpcAI(state, deltaMins);
      if (!state._tickingRealTime && !callbacks?.suppressRandomEvents) {
        // Headless weekly signature interactions across KLB 2F, 3F, and Gordon's Café
        if (Math.random() < 0.08 * deltaMins) {
          const sigRooms = ['klb_2f', 'klb_3f', 'gordons_cafe'].sort(() => Math.random() - 0.5);
          for (const rm of sigRooms) {
            const wRes = triggerWeeklySignatureInteraction(state, rm, { inPlace: true });
            if (wRes && wRes.triggered) {
              if (state.spectatorMode) {
                state._queuedBubbles = [];
                state.speechBubbles = [];
              }
              break;
            }
          }
        }
        // Headless autonomous birthday wishes when active
        if (state.birthday?.charId && Math.random() < 0.08 * deltaMins) {
          const bId = state.birthday.charId;
          const bEnt = resolveEntityById(state, bId);
          const bRooms = ['klb_2f', 'klb_3f', 'gordons_cafe'];
          const bFree = bEnt && bRooms.includes(bEnt.roomId) && (
            (!state.spectatorMode && bEnt === state.player)
              ? (!state.player.isMoving && !state.activePlayerAction)
              : (!bEnt.pendingRoomTravel && (!bEnt.path || bEnt.path.length === 0) && (bEnt.huddleLockTimer || 0) <= 0)
          );
          if (bFree) {
            const greeters = Object.values(state.npcs || {}).filter(n =>
              n &&
              n.id !== bId &&
              n.roomId === bEnt.roomId &&
              !['alex_king', 'claire_carmalt', 'safety_inspector'].includes(n.id) &&
              !state.birthday.greetedBy?.[n.id] &&
              !n.pendingRoomTravel &&
              (!n.path || n.path.length === 0) &&
              (n.huddleLockTimer || 0) <= 0 &&
              n.sim?.currentAction?.kind !== 'quench' &&
              (state.spectatorMode || bEnt !== state.player || Math.hypot(n.x - state.player.x, n.y - state.player.y) <= 4.2)
            );
            if (greeters.length > 0) {
              const g = greeters[Math.floor(Math.random() * greeters.length)];
              const bRes = maybeTriggerBirthdayGreeting(state, g.id, bId, bEnt.roomId);
              if (bRes && bRes.triggered && state.spectatorMode) {
                state._queuedBubbles = [];
                state.speechBubbles = [];
              }
            }
          }
        }
        if (state.spectatorMode && Math.random() < 0.04 * deltaMins) {
          if (triggerGroupHuddle(state)) {
            state._queuedBubbles = [];
            state.speechBubbles = [];
          }
        }
        if (state.spectatorMode) {
          const headlessDt = deltaMins / CLOCK_MINS_PER_REAL_SEC;
          for (const b of state.speechBubbles || []) b.ttlSec -= headlessDt;
          state.speechBubbles = (state.speechBubbles || []).filter(b => b.ttlSec > 0);
          for (const qb of state._queuedBubbles || []) qb.delaySec -= headlessDt;
          state._queuedBubbles = (state._queuedBubbles || []).filter(qb => qb.delaySec > 0);
        }
      }
      syncVisibleReactionsCache(state);

      // 12. Queued WhatsApp banter replies
      if (state._queuedWaReplies && state._queuedWaReplies.length) {
        const remaining = [];
        for (const q of state._queuedWaReplies) {
          q.delayMins -= deltaMins;
          if (q.delayMins <= 0) {
            pushWhatsApp(state, q.senderId, q.text, callbacks, q.replyToId || null);
          } else {
            remaining.push(q);
          }
        }
        state._queuedWaReplies = remaining;
      }

      // 13. Ambient WhatsApp banter & environment/proximity events
      state.banterCooldownMins -= deltaMins;
      if (state.banterCooldownMins <= 0) {
        state.banterCooldownMins = 155 + Math.random() * 85;
        triggerAmbientBanter(state);
      }

      state.eventCooldownMins -= deltaMins;
      if (
        state.eventCooldownMins <= 0 &&
        !callbacks?.suppressRandomEvents &&
        !state.postAuditCelebration &&
        !state.spectatorMode &&
        !state.fireAlarm?.active &&
        hour >= 8.5 &&
        hour <= 19.2
      ) {
        state.eventCooldownMins = 175 + Math.random() * 110;
        triggerRandomKLBEvent(state, callbacks);
      }

      // 14. 19:30 Daily Security Lockup / Rollover (paused during celebration)
      if (!state.postAuditCelebration && state.timeMins >= CURFEW_MINS) {
        if (!state.spectatorMode && callbacks.onForceEndOfDay) {
          callbacks.onForceEndOfDay();
        } else {
          rollToNextDay(state, callbacks, true);
        }
      }

      // 15. Permadeath check (player mode only)
      checkPermadeath(state, callbacks);
    } finally {
      if (prevCb) state._activeCallbacks = prevCb;
      else delete state._activeCallbacks;
    }
  }

  const AOE2_BANTER_LINES = {
    peter_szijj: [
      'Hungarian Hussar raids incoming, guard your lumberjacks!',
      'Wait until Imperial Age, nobody survives these Paladin waves.',
      'Knights hitting your woodline in sixteen mins, brace yourself!',
      'Leaving LotR synth on while my Magyars micro around your TC.',
      'Forgot Loom again, praying nobody drushes my gold villagers!',
      'Send the Stellaris lobby after this, my economy is booming.'
    ],
    andre_shamsabadi: [
      'Walling the choke point now — do NOT look at my eco score!',
      'Quick poll: Black Forest treaty 20 mins or immediate feudal rush?',
      'Who hid four trebuchets behind the Black Forest tree line?!',
      'Saving my CK3 dynastic chaos until after we win this 2v2.',
      'Ignore the sheep I accidentally deleted at minute two, focus!',
      'Waistcoat on, Valorant warmup done, ready to rush Feudal!'
    ],
    antoine_maruani: [
      'Windows 95 Worms ninja-rope reflexes active, watch your sheep!',
      'Stop booming behind stone walls and fight me mid-map!',
      'My Franks knights will reach your gold pile before lunch.',
      'Dropping a Holy Hand Grenade straight onto your Worm squad!',
      'One Castle drop on your berries and it is au revoir, mon gars.',
      'Wait until you hear the #Hackerman monk wololo rush coming.'
    ],
    maximillian_lee: [
      'Massing 60 English longbowmen behind two layers of palisades.',
      'Hold on, a giant 3F spider nearly walked across my mousepad!',
      'Zero villagers on stone, pure silverback castle rush instead.',
      'Longbow range beats your mangonels from across the Thames.',
      'Wait, did someone just steal my two wild boars with a scout?!',
      'Pass the Blue Party Mix, my Britons eco is finally ticking.'
    ]
  };

  function tickGroupRoomConversations(state, dt, viewRoom) {
    if (!state || !viewRoom || state.fireAlarm?.active) return;
    if (viewRoom === 'offsite' || viewRoom === 'meeting_room' || viewRoom.startsWith('cib_')) return;

    const maxConvos = (viewRoom === 'klb_2f' || viewRoom === 'gordons_cafe') ? 2 : 1;
    const { activeConvoIds, busySpeakerIds } = getActiveRoomConversationInfo(state, viewRoom);

    const playerHere = !state.spectatorMode && state.player?.roomId === viewRoom;
    const cqWin = isCoffeeQuartetWindow(state);
    const cqMembers = window.KLB.COFFEE_QUARTET?.members || [];

    // 1. Coffee Quartet single-bubble turn-taking in Gordon's Café
    if (cqWin && viewRoom === 'gordons_cafe') {
      const cqNpcs = cqMembers
        .map(id => state.npcs?.[id])
        .filter(n => n && n.roomId === 'gordons_cafe' && !n.pendingRoomTravel && (!n.path || n.path.length === 0) && (n.huddleLockTimer || 0) <= 0);
      const totalPresent = cqNpcs.length + (playerHere ? 1 : 0);
      if (cqNpcs.length >= 1 && totalPresent >= 2 && !activeConvoIds.has('coffee_quartet') && activeConvoIds.size < maxConvos) {
        state._coffeeConvoCooldownSec = (state._coffeeConvoCooldownSec ?? 1.8) - dt;
        if (state._coffeeConvoCooldownSec <= 0) {
          const avail = cqNpcs.filter(n => !busySpeakerIds.has(n.id));
          if (avail.length > 0) {
            const rot = avail.filter(n => n.id !== state._lastCoffeeSpeakerId);
            const pool = rot.length ? rot : avail;
            const spk = pool[Math.floor(Math.random() * pool.length)];
            const curHour = getTimeHours(state);
            const dayIdx = state.dayIdx ?? null;
            const rawLines = window.KLB.COFFEE_QUARTET?.chatLines?.[spk.id] || [];
            const gatedLines = rawLines.filter(item => isDialogueAllowedAtTime(item, curHour, dayIdx));
            const linePool = gatedLines.length ? gatedLines : rawLines;
            const pickedLine = linePool.length
              ? pickFromShuffleBag(
                  state,
                  'coffee_' + spk.id,
                  linePool,
                  s => (typeof s === 'string' ? s : (s?.text || JSON.stringify(s)))
                )
              : null;
            const line = (typeof pickedLine === 'string' ? pickedLine : pickedLine?.text)
              || getSpeechLineForNpc(spk, true, state).text;
            const partnerIds = cqNpcs.map(n => n.id).concat(playerHere ? [state.player.id] : []);
            pushBubble(state, spk.id, 'gordons_cafe', line, calcBubbleTtl(line), { convoId: 'coffee_quartet', partnerIds });
            spk.currentTaskSpeech = line;
            state._lastCoffeeSpeakerId = spk.id;
            state._coffeeConvoCooldownSec = 3.6 + Math.random() * 2.2;
            activeConvoIds.add('coffee_quartet');
            partnerIds.forEach(id => busySpeakerIds.add(id));
          }
        }
      }
    }

    // 2. 17:00 AoE2 Lobby / Gaming crew single-bubble turn-taking
    if (viewRoom === 'klb_3f' || viewRoom === 'klb_2f') {
      const gamingNpcs = Object.values(state.npcs || {}).filter(n =>
        n &&
        n.roomId === viewRoom &&
        !n.pendingRoomTravel &&
        (!n.path || n.path.length === 0) &&
        (n.huddleLockTimer || 0) <= 0 &&
        ['aoe2_event', 'gaming'].includes(n.sim?.currentAction?.kind)
      );
      const totalGamers = gamingNpcs.length + (playerHere ? 1 : 0);
      if (gamingNpcs.length >= 1 && totalGamers >= 2 && !activeConvoIds.has('aoe2_lobby') && activeConvoIds.size < maxConvos) {
        state._aoe2ConvoCooldownSec = (state._aoe2ConvoCooldownSec ?? 1.8) - dt;
        if (state._aoe2ConvoCooldownSec <= 0) {
          const avail = gamingNpcs.filter(n => !busySpeakerIds.has(n.id));
          if (avail.length > 0) {
            const rot = avail.filter(n => n.id !== state._lastAoe2SpeakerId);
            const pool = rot.length ? rot : avail;
            const spk = pool[Math.floor(Math.random() * pool.length)];
            const lines = AOE2_BANTER_LINES[spk.id] || ['GGs on Black Forest!'];
            const line = pickFromShuffleBag(state, 'aoe2_' + spk.id, lines, s => s) || lines[0];
            const partnerIds = gamingNpcs.map(n => n.id).concat(playerHere ? [state.player.id] : []);
            pushBubble(state, spk.id, viewRoom, line, calcBubbleTtl(line), { convoId: 'aoe2_lobby', partnerIds });
            spk.currentTaskSpeech = line;
            state._lastAoe2SpeakerId = spk.id;
            state._aoe2ConvoCooldownSec = 3.6 + Math.random() * 2.2;
            activeConvoIds.add('aoe2_lobby');
            partnerIds.forEach(id => busySpeakerIds.add(id));
          }
        }
      }
    }

    // 3. Shared Lunch Tables single-bubble turn-taking
    if (viewRoom === 'gordons_cafe' || viewRoom === 'klb_3f') {
      const lunchNpcs = Object.values(state.npcs || {}).filter(n =>
        n &&
        n.roomId === viewRoom &&
        !n.pendingRoomTravel &&
        (!n.path || n.path.length === 0) &&
        (n.huddleLockTimer || 0) <= 0 &&
        ['lunch', 'packed_lunch'].includes(n.sim?.currentAction?.kind) &&
        !(cqWin && viewRoom === 'gordons_cafe' && cqMembers.includes(n.id))
      );
      const playerAtLunch = playerHere && !(cqWin && viewRoom === 'gordons_cafe');
      const totalLunchers = lunchNpcs.length + (playerAtLunch ? 1 : 0);
      if (lunchNpcs.length >= 1 && totalLunchers >= 2 && !activeConvoIds.has('lunch_convo') && activeConvoIds.size < maxConvos) {
        state._lunchConvoCooldownSec = (state._lunchConvoCooldownSec ?? 2.0) - dt;
        if (state._lunchConvoCooldownSec <= 0) {
          const avail = lunchNpcs.filter(n => !busySpeakerIds.has(n.id));
          if (avail.length > 0) {
            const rot = avail.filter(n => n.id !== state._lastLunchSpeakerId);
            const pool = rot.length ? rot : avail;
            const spk = pool[Math.floor(Math.random() * pool.length)];
            const line = getSpeechLineForNpc(spk, true, state).text;
            const partnerIds = lunchNpcs.map(n => n.id).concat(playerAtLunch ? [state.player.id] : []);
            pushBubble(state, spk.id, viewRoom, line, calcBubbleTtl(line), { convoId: 'lunch_convo', partnerIds });
            spk.currentTaskSpeech = line;
            state._lastLunchSpeakerId = spk.id;
            state._lunchConvoCooldownSec = 3.6 + Math.random() * 2.2;
          }
        }
      }
    }
  }

  // ==================== 12. REAL-TIME 60 FPS TICK & ANTI-DEADLOCK ====================
  function tickRealTime(state, dt, callbacks = {}) {
    if (!state || state.paused || state.isPaused || state.gameOver || state.victory) return;

    dt = Math.min(0.1, Math.max(0, Number(dt) || 0));
    if (dt <= 0) return;

    const prevCb = state._activeCallbacks;
    state._activeCallbacks = callbacks;
    try {
      // Release player-locked NPCs when changing rooms or walking > 4.2 tiles away
      if (!state.spectatorMode && state.player) {
        const curPRoom = state.player.roomId;
        const roomChanged = Boolean(state._lastPlayerRoomId && state._lastPlayerRoomId !== curPRoom);
        state._lastPlayerRoomId = curPRoom;
        if (roomChanged) {
          endPlayerConversations(state, null, { changingRooms: true });
        }
        for (const npc of Object.values(state.npcs || {})) {
          if (!npc?.huddleTarget?.partnerIds?.includes(state.player.id)) continue;
          const dist = Math.hypot(npc.x - state.player.x, npc.y - state.player.y);
          if (npc.roomId !== curPRoom || dist > 4.2) {
            const diffRoom = npc.roomId !== curPRoom;
            npc.huddleLockTimer = 0;
            npc.huddleTarget = null;
            if (Array.isArray(state._queuedBubbles) && state._queuedBubbles.length) {
              state._queuedBubbles = state._queuedBubbles.filter(qb => {
                if (!qb) return false;
                const involvesNpc = qb.entityId === npc.id || (Array.isArray(qb.partnerIds) && qb.partnerIds.includes(npc.id));
                const involvesPlayer = qb.entityId === state.player.id || (Array.isArray(qb.partnerIds) && qb.partnerIds.includes(state.player.id));
                if (involvesNpc || (diffRoom && involvesPlayer)) return false;
                return true;
              });
            }
            if (diffRoom && Array.isArray(state.speechBubbles) && state.speechBubbles.length) {
              state.speechBubbles = state.speechBubbles.filter(b => {
                if (!b) return false;
                const involves = b.entityId === npc.id || b.entityId === state.player.id ||
                  (Array.isArray(b.partnerIds) && (b.partnerIds.includes(npc.id) || b.partnerIds.includes(state.player.id)));
                if (involves && b.roomId && b.roomId !== curPRoom) return false;
                return true;
              });
            }
          }
        }
      }

      const simDelta = dt * CLOCK_MINS_PER_REAL_SEC;

      // Smooth 60 FPS float progression for jobs, player actions, fire alarm & NPC strips
      advanceActiveJobs(state, simDelta, callbacks);
      advancePlayerAction(state, simDelta, callbacks);
      advanceFireAlarm(state, simDelta, callbacks);
      tickNpcJobsAndActions(state, simDelta);

      // Integer-minute accumulator for AI scheduling, meters, events & clock
      state.realSecAccum = (state.realSecAccum || 0) + simDelta;
      if (state.realSecAccum + 1e-9 >= 1.0) {
        const mins = Math.floor(state.realSecAccum + 1e-9);
        state.realSecAccum = Math.max(0, state.realSecAccum - mins);
        state._tickingRealTime = true;
        try {
          advanceMinutes(state, mins, callbacks);
        } finally {
          state._tickingRealTime = false;
        }
      }

      // Decay speech bubbles & process staggered huddle bubbles
      for (const b of state.speechBubbles) b.ttlSec -= dt;
      state.speechBubbles = state.speechBubbles.filter(b => b.ttlSec > 0);

      if (state._queuedBubbles && state._queuedBubbles.length) {
        const keep = [];
        for (const qb of state._queuedBubbles) {
          qb.delaySec -= dt;
          if (qb.delaySec <= 0) {
            const isPlayerSpk = !state.spectatorMode && state.player?.id === qb.entityId;
            const spk = isPlayerSpk ? state.player : state.npcs?.[qb.entityId];
            if (spk && spk.roomId === qb.roomId && !state.fireAlarm?.active) {
              if (qb.partnerIds) {
                const npcPartnerIds = qb.partnerIds.filter(id =>
                  (state.spectatorMode || id !== state.player?.id) &&
                  !state.npcs?.[id]?.huddleTarget?.preserveDeskAction
                );
                if (npcPartnerIds.length) {
                  faceNpcsTowardNearbyPartners(state, npcPartnerIds, qb.partnerIds, qb.roomId, 3.5);
                }
              }
              const bubbleTtl = qb.ttlSec || calcBubbleTtl(qb.text);
              pushBubble(state, qb.entityId, qb.roomId, qb.text, bubbleTtl, {
                convoId: qb.convoId || null,
                partnerIds: qb.partnerIds || null
              });
              if (!isPlayerSpk) spk.currentTaskSpeech = qb.text;
            }
          } else {
            keep.push(qb);
          }
        }
        state._queuedBubbles = keep;
      }

      // Safety sweep real-time countdown
      if (state.safetySweep?.active) {
        state.safetySweep.countdownSec -= dt;
        state.safetySweep.countdownMins = Math.max(0, Math.round(state.safetySweep.countdownSec * CLOCK_MINS_PER_REAL_SEC * 10) / 10);
        if (state.safetySweep.countdownSec <= 0) {
          state.safetySweep.active = false;
          evaluateSafetySweep(state, callbacks);
        }
      }

      const viewRoom = getViewRoom(state);

      // Group turn-taking conversations & social group huddles in the viewed room
      tickGroupRoomConversations(state, dt, viewRoom);
      state.huddleCooldownSec = (state.huddleCooldownSec ?? 2.5) - dt;
      if (state.huddleCooldownSec <= 0) {
        state.huddleCooldownSec = 5.5 + Math.random() * 3.5;
        triggerGroupHuddle(state);
      }

      // Move autonomous NPCs along BFS paths with energy-scaled speed, entity collision, portal hops & anti-deadlock
      for (const npc of Object.values(state.npcs || {})) {
        if (npc.roomId === 'offsite' || !window.KLB.WORLD_MAPS?.rooms?.[npc.roomId]) continue;

        if ((npc.huddleLockTimer || 0) > 0) {
          npc.huddleLockTimer = Math.max(0, npc.huddleLockTimer - dt);
          if (npc.huddleLockTimer <= 0) finishNpcHuddleLock(state, npc);
        }

        if (npc.path && npc.path.length > 0) {
          const next = npc.path[0];
          const npcEnergy = npc.sim?.energy ?? 85;
          const energyFactor = 0.75 + 0.25 * (clamp(npcEnergy, 0, 100) / 100);
          const speed = (state.mutators?.infinite_espresso ? 4.1 : 3.3) * energyFactor * dt;
          const dx = next.x - npc.x;
          const dy = next.y - npc.y;
          const dist = Math.hypot(dx, dy);
          npc.dir = next.dir || npc.dir;

          let nx;
          let ny;
          if (dist <= speed) {
            nx = next.x;
            ny = next.y;
          } else {
            nx = npc.x + (dx / dist) * speed;
            ny = npc.y + (dy / dist) * speed;
          }

          const headlessFast = Boolean(state._headlessVerify);
          const cellFree = !isOccupiedByCharacter(state, npc.roomId, nx, ny, npc.id, 0.48);
          const travelUrgent = Boolean(npc.pendingRoomTravel && ((npc.pendingRoomTravel.waitSec || 0) >= 1.5 || isChokepointOrDoorway(npc.roomId, next.x, next.y)));
          const crowdSqueeze = Boolean(!headlessFast && (npc.totalBlockedSec || 0) >= 1.5);
          const canSqueezePast = !cellFree && (
            travelUrgent ||
            crowdSqueeze ||
            ((isChokepointOrDoorway(npc.roomId, next.x, next.y) || (npc.blockedSec || 0) > 0.45) &&
              (npc.path.length > 1 || dist > speed || Boolean(npc.pendingRoomTravel)))
          );
          if (cellFree || canSqueezePast) {
            npc.x = nx;
            npc.y = ny;
            if (cellFree) {
              npc.blockedSec = 0;
              npc.blockedCount = 0;
              npc.totalBlockedSec = 0;
            }
            npc.walkAnimTimer = (npc.walkAnimTimer || 0) + dt * 7;
            npc.walkFrame = Math.floor(npc.walkAnimTimer) % 4;
            if (!headlessFast && npc.pendingRoomTravel) {
              const travel = npc.pendingRoomTravel;
              const pDist = Math.hypot(npc.x - travel.portalCell.x, npc.y - travel.portalCell.y);
              if (pDist <= getPortalCaptureRadius(npc.roomId, travel)) {
                completeNpcPortalHop(state, npc);
                continue;
              }
            }
            if (dist <= speed) {
              npc.path.shift();
              if (npc.path.length === 0) {
                npc._retryTarget = null;
                npc._retryCount = 0;
                if (npc.busyObjId) faceNpcTowardCurrentAction(npc);
              }
            }
          } else {
            npc.walkFrame = 0;
            npc.blockedSec = (npc.blockedSec || 0) + dt;
            npc.totalBlockedSec = (npc.totalBlockedSec || 0) + dt;
            if (npc.pendingRoomTravel) {
              const travel = npc.pendingRoomTravel;
              travel.waitSec = (travel.waitSec || 0) + dt;
              const pDist = Math.hypot(npc.x - travel.portalCell.x, npc.y - travel.portalCell.y);
              const capR = headlessFast ? 1.85 : getPortalCaptureRadius(npc.roomId, travel);
              if (headlessFast ? (pDist <= 1.85 || travel.waitSec >= 5.5) : (pDist <= capR)) {
                completeNpcPortalHop(state, npc);
                continue;
              }
              if (!headlessFast && travel.waitSec >= 1.5) {
                const freePortalPath = computePortalPath(state, npc.roomId, npc.x, npc.y, travel.portalCell, npc.id, true);
                if (freePortalPath.length > 0) {
                  npc.path = freePortalPath;
                  continue;
                }
              }
            }
            if (npc.blockedSec > 0.55) {
              npc.blockedSec = 0;
              npc.blockedCount = (npc.blockedCount || 0) + 1;
              const goal = npc.path[npc.path.length - 1] || npc._retryTarget;
              if (goal) {
                npc._retryTarget = { roomId: npc.roomId, x: goal.x, y: goal.y };
              }
              let newPath = goal
                ? findPathBFS(npc.roomId, npc.x, npc.y, goal.x, goal.y, 65, state, npc.id)
                : [];
              if (!headlessFast && goal && (newPath.length === 0 || (npc.blockedCount || 0) >= 2)) {
                const freePath = findPathBFS(npc.roomId, npc.x, npc.y, goal.x, goal.y, 65, null, null);
                if (freePath.length > 0) newPath = freePath;
              }

              if (newPath.length > 0 && (npc.totalBlockedSec >= 1.5 || !isOccupiedByCharacter(state, npc.roomId, newPath[0].x, newPath[0].y, npc.id, 0.48))) {
                npc.path = newPath;
              } else {
                const aside = findFreeWalkableNear(state, npc.roomId, Math.round(npc.x), Math.round(npc.y), npc.id, false);
                if (aside && (aside.x !== Math.round(npc.x) || aside.y !== Math.round(npc.y))) {
                  const asideDir = dirBetween(npc.x, npc.y, aside.x, aside.y) || npc.dir;
                  const afterAside = goal
                    ? findPathBFS(npc.roomId, aside.x, aside.y, goal.x, goal.y, 65, state, npc.id)
                    : [];
                  if (afterAside.length > 0) {
                    npc.path = [{ x: aside.x, y: aside.y, dir: asideDir }].concat(afterAside);
                    npc.blockedCount = 0;
                  } else {
                    npc.path = [{ x: aside.x, y: aside.y, dir: asideDir }];
                    npc.blockedCount = 0;
                    npc._retryTimerSec = 0.35;
                  }
                } else {
                  npc.path = [];
                  npc.blockedCount = 0;
                  npc._retryTimerSec = 0.45;
                }
              }
            }
          }
        } else {
          npc.walkFrame = 0;

          if (npc.pendingRoomTravel) {
            const headlessFast = Boolean(state._headlessVerify);
            const travel = npc.pendingRoomTravel;
            const dist = Math.hypot(npc.x - travel.portalCell.x, npc.y - travel.portalCell.y);
            const capR = headlessFast ? 1.85 : getPortalCaptureRadius(npc.roomId, travel);
            if (headlessFast ? (dist <= 1.85 || (travel.waitSec || 0) >= 4.0) : (dist <= capR)) {
              completeNpcPortalHop(state, npc);
            } else {
              travel.waitSec = (travel.waitSec || 0) + dt;
              if (headlessFast) {
                const portalFree = findFreeWalkableNear(state, npc.roomId, travel.portalCell.x, travel.portalCell.y, npc.id, true, { allowChokepoints: true }) || travel.portalCell;
                npc.path = findPathBFS(npc.roomId, npc.x, npc.y, portalFree.x, portalFree.y, 65, state, npc.id);
              } else {
                npc.path = computePortalPath(state, npc.roomId, npc.x, npc.y, travel.portalCell, npc.id, (travel.waitSec || 0) >= 1.5);
              }
            }
            continue;
          }

          const rmNow = window.KLB.WORLD_MAPS?.rooms?.[npc.roomId];
          const curTile = rmNow?.tiles?.[Math.round(npc.y)]?.[Math.round(npc.x)];
          if (curTile === 7 && !isNpcOnChair(npc) && !npc._retryTarget) {
            const nudgeTarget = findFreeWalkableNear(state, npc.roomId, npc.x, npc.y, npc.id, false);
            if (nudgeTarget && (nudgeTarget.x !== Math.round(npc.x) || nudgeTarget.y !== Math.round(npc.y))) {
              const nudgePath = findPathBFS(npc.roomId, npc.x, npc.y, nudgeTarget.x, nudgeTarget.y, 12, state, npc.id);
              if (nudgePath.length > 0) {
                npc.path = nudgePath;
                if (npc.huddleTarget && !npc.huddleTarget.preserveDeskAction) {
                  npc.huddleTarget.x = nudgeTarget.x;
                  npc.huddleTarget.y = nudgeTarget.y;
                }
                continue;
              }
            }
          }

          if (npc._retryTarget) {
            if (npc._retryTarget.roomId !== npc.roomId || Math.hypot(npc.x - npc._retryTarget.x, npc.y - npc._retryTarget.y) <= 1.2) {
              npc._retryTarget = null;
              npc._retryCount = 0;
            } else {
              npc._retryTimerSec = (npc._retryTimerSec ?? 0) - dt;
              if (npc._retryTimerSec <= 0) {
                const retryPath = findPathBFS(npc.roomId, npc.x, npc.y, npc._retryTarget.x, npc._retryTarget.y, 65, state, npc.id);
                if (retryPath.length > 0) {
                  npc.path = retryPath;
                  npc._retryCount = 0;
                } else {
                  npc._retryCount = (npc._retryCount || 0) + 1;
                  npc._retryTimerSec = 0.45;
                  if (npc._retryCount >= 8) {
                    npc._retryTarget = null;
                    npc._retryCount = 0;
                    if (npc.sim) {
                      if (npc.sim.currentAction && distToActionTarget(npc, npc.sim.currentAction) > 2.4) {
                        npc.sim.currentAction = null;
                        npc.busyObjId = null;
                      }
                      if (npc.sim.pendingJobStart && distToActionTarget(npc, npc.sim.pendingJobStart.jobSpec) > 2.4) {
                        npc.sim.pendingJobStart = null;
                        npc.busyObjId = null;
                      }
                    }
                  }
                }
              }
            }
          }

          if (npc.huddleTarget && (npc.huddleLockTimer || 0) > 0) {
            if (npc.huddleTarget.preserveDeskAction) {
              faceNpcTowardCurrentAction(npc);
            } else {
              faceNpcsTowardNearbyPartners(state, [npc.id], npc.huddleTarget.partnerIds || [], npc.roomId, 3.5);
            }
          }
        }
      }

      // Check if Vijay reached player during bench round (strictly inside KLB 2F!)
      if (!state.spectatorMode && state.vijayRound?.active && !state.vijayRound.checkedPlayer) {
        const vj = state.npcs?.vijay_chudasama;
        if (vj && vj.roomId === 'klb_2f' && state.player?.roomId === 'klb_2f') {
          const d = Math.hypot(vj.x - state.player.x, vj.y - state.player.y);
          if (d < 2.4 || (!vj.pendingRoomTravel && (!vj.path || vj.path.length === 0))) {
            state.vijayRound.checkedPlayer = true;
            state.vijayRound.active = false;
            resolveVijayBenchCheck(state, callbacks);
            vj.departAtMins = state.timeMins + 4;
          }
        }
      }

      syncVisibleReactionsCache(state);
    } finally {
      if (prevCb) state._activeCallbacks = prevCb;
      else delete state._activeCallbacks;
    }
  }

  function resolveVijayBenchCheck(state, callbacks = {}) {
    const vj = state?.npcs?.vijay_chudasama;
    if (!state || !vj || vj.roomId !== 'klb_2f' || state.player?.roomId !== 'klb_2f') return false;
    const hasRunning = ((state.activeStationJobs || []).length + (state.activeReactions || []).length) > 0;
    const specsOk = Boolean(state.player?.specsOn);
    const convoMeta = {
      convoId: 'vijay_bench_round',
      partnerIds: state.player?.id ? ['vijay_chudasama', state.player.id] : ['vijay_chudasama']
    };
    if (specsOk && (hasRunning || (state.completedSteps || []).length > state.dayIdx)) {
      state.patience = Math.min(100, state.patience + 10);
      state.morale = Math.min(100, state.morale + 6);
      const goodLines = [
        'Good momentum! Keep those controls tight for Friday.',
        'Tidy sash, specs on, reactions ticking. Carry on!',
        'Strong bench pace today, looking sharp for Group Meeting.',
        'Clean hood, clear storyline in sight. Keep pushing!'
      ];
      const vLine = pickFromShuffleBag(state, 'vijay_bench_good', goodLines, s => s) || goodLines[0];
      pushBubble(state, 'vijay_chudasama', 'klb_2f', vLine, calcBubbleTtl(vLine), convoMeta);
      if (callbacks.onToast) callbacks.onToast('Vijay impressed by your active, tidy hood! (+10 Patience, +6 Morale)');
    } else {
      state.patience = Math.max(0, state.patience - 10);
      state.morale = Math.max(0, state.morale - 6);
      const subLines = [
        'That is suboptimal — one word. Pick up the pace!',
        'Idle hood, specs check, Friday 09:00 is rushing closer.',
        'Needs real urgency here if we want four clean figures!',
        'Slightly behind the curve today, tighten up the bench.'
      ];
      const vLine = pickFromShuffleBag(state, 'vijay_bench_suboptimal', subLines, s => s) || subLines[0];
      pushBubble(state, 'vijay_chudasama', 'klb_2f', vLine, calcBubbleTtl(vLine), convoMeta);
      if (callbacks.onToast) callbacks.onToast('Vijay raised an eyebrow at your bench progress (-10 Patience).');
    }
    checkPermadeath(state, callbacks);
    return true;
  }

  function checkPermadeath(state, callbacks = {}) {
    if (!state || state.spectatorMode || state.gameOver || state.victory) return;
    if (state.morale <= 0) {
      state.morale = 0;
      state.gameOver = true;
      state.gameOverReason = 'MORALE_ZERO';
      state.gameOverMessage = PERMADEATH_MESSAGES.MORALE_ZERO;
      if (callbacks.onPermadeath) callbacks.onPermadeath('MORALE_ZERO', state.gameOverMessage);
    } else if (getLabCondition(state) <= 0) {
      setLabCondition(state, 0);
      state.gameOver = true;
      state.gameOverReason = 'CONDITION_ZERO';
      state.gameOverMessage = PERMADEATH_MESSAGES.CONDITION_ZERO;
      if (callbacks.onPermadeath) callbacks.onPermadeath('CONDITION_ZERO', state.gameOverMessage);
    } else if (state.patience <= 0) {
      state.patience = 0;
      state.gameOver = true;
      state.gameOverReason = 'PATIENCE_ZERO';
      state.gameOverMessage = state.player?.id === 'archie_wall'
        ? "Jamie's patience hit zero after missed deadlines and poor group-meeting data."
        : PERMADEATH_MESSAGES.PATIENCE_ZERO;
      if (callbacks.onPermadeath) callbacks.onPermadeath('PATIENCE_ZERO', state.gameOverMessage);
    }
  }

  // ==================== 13. HEADLESS MULTI-WEEK AUTONOMOUS VERIFICATION ====================
  function runAutonomousVerification(numDays = 200) {
    const t0 = Date.now();
    const state = createRunState('spectator', {}, { spectatorMode: true, headlessVerify: true });
    state._headlessVerify = true;
    const rareCounts = {
      safety_sweep: 0,
      fire_alarm_test: 0,
      alex_king_1718: 0,
      lcms_down: 0,
      aoe2_event: 0
    };

    const chudIds = getBigChudsIds();
    const perChar = {};
    for (const id of chudIds) {
      perChar[id] = {
        weeks: 0,
        totalSteps: 0,
        totalWeeklyReport: 0,
        totalManuscript: 0,
        totalScore: 0,
        passed: 0,
        failed: 0,
        overcooks: 0,
        prepFailures: 0,
        quirkFailures: 0,
        facilityFailures: 0
      };
    }

    let daysCompleted = 0;
    let lastDayIdx = state.dayIdx;
    let coffeeQuartetChecks = 0;
    let totalAudits = 0;
    let auditsPassed = 0;
    let auditsFailed = 0;
    let scoreSum = 0;
    let minScore = 10;
    let maxScore = 0;
    let totalStepsCompleted = 0;
    let fiveOfFiveWeeks = 0;

    let auditPatienceUp = 0;
    let auditPatienceDown = 0;
    let auditPatienceNeutral = 0;
    let auditPatienceMin = 999;
    let auditPatienceMax = -999;
    let auditPatienceSum = 0;

    const failureCounts = {
      overcook: 0,
      wrong_choice: 0,
      tcep_gamble: 0,
      blue_dye_spill: 0,
      lcms_broken: 0,
      abil_fine: 0,
      safety_infraction: 0,
      missed_weekly_report: 0,
      missed_manuscript: 0
    };

    const callbacks = {
      onRareEvent: type => {
        if (Object.prototype.hasOwnProperty.call(rareCounts, type)) {
          rareCounts[type] += 1;
        }
      }
    };

    let safetyTicks = 0;
    const maxSafetyTicks = Math.max(1000, numDays * 300);
    while (daysCompleted < numDays && safetyTicks < maxSafetyTicks) {
      safetyTicks++;
      if (isCoffeeQuartetWindow(state)) coffeeQuartetChecks++;

      advanceMinutes(state, 5, callbacks);

      if (state.dayIdx !== lastDayIdx) {
        daysCompleted += 1;
      }
      lastDayIdx = state.dayIdx;
    }

    for (const rec of state._weeklyAudits || []) {
      const c = perChar[rec.charId];
      if (!c) continue;
      c.weeks += 1;
      c.totalSteps += rec.steps;
      c.totalWeeklyReport += rec.weeklyReportProgress || 0;
      c.totalManuscript += rec.manuscriptProgress || 0;
      c.totalScore += rec.total;
      if (rec.passed) {
        c.passed += 1;
        auditsPassed += 1;
      } else {
        c.failed += 1;
        auditsFailed += 1;
      }
      totalAudits += 1;
      scoreSum += rec.total;
      if (rec.total < minScore) minScore = rec.total;
      if (rec.total > maxScore) maxScore = rec.total;
      totalStepsCompleted += rec.steps;
      if (rec.steps >= 5) fiveOfFiveWeeks += 1;

      const pd = Number(rec.patienceDelta) || 0;
      if (pd > 0) auditPatienceUp += 1;
      else if (pd < 0) auditPatienceDown += 1;
      else auditPatienceNeutral += 1;
      if (pd < auditPatienceMin) auditPatienceMin = pd;
      if (pd > auditPatienceMax) auditPatienceMax = pd;
      auditPatienceSum += pd;

      for (const f of rec.failures || []) {
        failureCounts[f] = (failureCounts[f] || 0) + 1;
        if (f === 'overcook') c.overcooks += 1;
        else if (f === 'wrong_choice' || f === 'missed_prep') c.prepFailures += 1;
        else if (f === 'tcep_gamble' || f === 'blue_dye_spill') c.quirkFailures += 1;
        else if (f === 'lcms_broken' || f === 'abil_fine') c.facilityFailures += 1;
      }
    }

    const byCharacter = {};
    for (const [id, c] of Object.entries(perChar)) {
      byCharacter[id] = {
        weeks: c.weeks,
        avgSteps: c.weeks ? Number((c.totalSteps / c.weeks).toFixed(2)) : 0,
        avgWeeklyReport: c.weeks ? Number((c.totalWeeklyReport / c.weeks).toFixed(1)) : 0,
        avgManuscript: c.weeks ? Number((c.totalManuscript / c.weeks).toFixed(1)) : 0,
        avgAuditScore: c.weeks ? Number((c.totalScore / c.weeks).toFixed(2)) : 0,
        passRate: c.weeks ? Number((c.passed / c.weeks).toFixed(3)) : 0,
        overcooks: c.overcooks,
        prepFailures: c.prepFailures,
        quirkFailures: c.quirkFailures,
        facilityFailures: c.facilityFailures
      };
    }

    const wrRecs = state._weeklyReportRecords || [];
    const wrOnTime = wrRecs.filter(r => r.onTime).length;
    const wrMissed = wrRecs.length - wrOnTime;
    const wrAvgPct = wrRecs.length ? wrRecs.reduce((s, r) => s + r.progress, 0) / wrRecs.length : 0;
    const wrPatUp = wrRecs.filter(r => r.patienceDelta > 0).length;
    const wrPatDown = wrRecs.filter(r => r.patienceDelta < 0).length;

    const msRecs = state._manuscriptRecords || [];
    const msOnTime = msRecs.filter(r => r.onTime).length;
    const msMissed = msRecs.length - msOnTime;
    const msAvgPct = msRecs.length ? msRecs.reduce((s, r) => s + r.progress, 0) / msRecs.length : 0;
    const msPatUp = msRecs.filter(r => r.patienceDelta > 0).length;
    const msPatDown = msRecs.filter(r => r.patienceDelta < 0).length;

    const ce = state._caffeineEnergySamples || {};
    const caffAvg = ce.caffeineCount ? Number((ce.caffeineSum / ce.caffeineCount).toFixed(2)) : 0;
    const stdAvg = ce.standardCount ? Number((ce.standardSum / ce.standardCount).toFixed(2)) : 0;
    const caffDrainRate = ce.caffeineDrainMins ? Number((ce.caffeineDrainSum / ce.caffeineDrainMins).toFixed(4)) : 0;
    const stdDrainRate = ce.standardDrainMins ? Number((ce.standardDrainSum / ce.standardDrainMins).toFixed(4)) : 0;

    const ss = state._socialStats || {};
    const mf = state._moraleFromExpStats || {};
    const lcs = state._labConditionStats || {};
    const auditRecords = state._weeklyAudits || [];
    const morningAudits = auditRecords.filter(r => r.auditTimeMins >= 540 && r.auditTimeMins <= 585);
    const avgAuditHour = auditRecords.length
      ? Number((auditRecords.reduce((s, r) => s + ((r.auditTimeMins || 540) / 60), 0) / auditRecords.length).toFixed(2))
      : 0;
    const lcmsDownEvents = state._lcmsDownEvents || rareCounts.lcms_down || 0;
    const aoe2Events = state._aoe2EventCount || rareCounts.aoe2_event || 0;

    failureCounts.missed_weekly_report = Math.max(failureCounts.missed_weekly_report || 0, wrMissed);
    failureCounts.missed_manuscript = Math.max(failureCounts.missed_manuscript || 0, msMissed);
    const totalFailures = Object.values(failureCounts).reduce((a, b) => a + b, 0);

    return {
      numDays: daysCompleted,
      weeksCompleted: Math.floor(daysCompleted / 5),
      lcmsDownEvents,
      aoe2Events,
      portalHopsCompleted: state._portalHopsCompleted || 0,
      events: {
        safety_sweep: {
          count: rareCounts.safety_sweep,
          ratePerDay: Number((rareCounts.safety_sweep / Math.max(1, daysCompleted)).toFixed(4)),
          per10Days: Number(((rareCounts.safety_sweep / Math.max(1, daysCompleted)) * 10).toFixed(2)),
          expectedPerDay: DAILY_TARGET_PROB
        },
        fire_alarm_test: {
          count: rareCounts.fire_alarm_test,
          ratePerDay: Number((rareCounts.fire_alarm_test / Math.max(1, daysCompleted)).toFixed(4)),
          per10Days: Number(((rareCounts.fire_alarm_test / Math.max(1, daysCompleted)) * 10).toFixed(2)),
          expectedPerDay: DAILY_TARGET_PROB
        },
        alex_king_1718: {
          count: rareCounts.alex_king_1718,
          ratePerDay: Number((rareCounts.alex_king_1718 / Math.max(1, daysCompleted)).toFixed(4)),
          per10Days: Number(((rareCounts.alex_king_1718 / Math.max(1, daysCompleted)) * 10).toFixed(2)),
          expectedPerDay: DAILY_TARGET_PROB
        },
        lcms_down: {
          count: lcmsDownEvents,
          ratePerDay: Number((lcmsDownEvents / Math.max(1, daysCompleted)).toFixed(4)),
          per10Days: Number(((lcmsDownEvents / Math.max(1, daysCompleted)) * 10).toFixed(2)),
          expectedPerDay: DAILY_LCMS_DOWN_PROB
        },
        aoe2_event: {
          count: aoe2Events,
          ratePerDay: Number((aoe2Events / Math.max(1, daysCompleted)).toFixed(4)),
          per10Days: Number(((aoe2Events / Math.max(1, daysCompleted)) * 10).toFixed(2)),
          expectedPerDay: 0.25
        }
      },
      labCondition: {
        messEvents: lcs.messEvents || 0,
        avgMessAmount: lcs.messEvents ? Number((lcs.messAmountSum / lcs.messEvents).toFixed(2)) : 0,
        cleanActions: lcs.cleanActions || 0,
        cleanByKind: { ...(lcs.cleanByKind || { sink: 0, base_bath: 0, waste_bin: 0, bench: 0 }) },
        sweepInfractions: lcs.sweepInfractions || 0,
        avgLabCondition: lcs.samples ? Number((lcs.sum / lcs.samples).toFixed(2)) : 95,
        minLabCondition: lcs.samples ? Number((lcs.min ?? 95).toFixed(1)) : 95
      },
      fridayMorningAudits: {
        count: auditRecords.length,
        onTimeCount: morningAudits.length,
        avgHour: avgAuditHour,
        auditsPassed,
        auditsFailed,
        passRate: totalAudits ? Number((auditsPassed / totalAudits).toFixed(3)) : 0
      },
      subTasks: {
        totalCompleted: state._subTasksCompleted || 0,
        avgPerChudWeek: totalAudits ? Number(((state._subTasksCompleted || 0) / totalAudits).toFixed(2)) : 0,
        byMode: { ...(state._subTaskModeCounts || {}) }
      },
      steps: {
        totalCompleted: totalStepsCompleted,
        avgStepsPerChudWeek: totalAudits ? Number((totalStepsCompleted / totalAudits).toFixed(2)) : 0,
        fiveOfFiveRate: totalAudits ? Number((fiveOfFiveWeeks / totalAudits).toFixed(3)) : 0
      },
      lunches: {
        lunchCount: state._lunchCount || 0,
        gordonsCafeCount: state._lunchDetails?.gordons || 0,
        packedLunchCount: state._lunchDetails?.packed || 0,
        withColleaguesCount: state._lunchDetails?.withColleagues || 0,
        avgPerDay: Number(((state._lunchCount || 0) / Math.max(1, daysCompleted)).toFixed(2))
      },
      social: {
        minObserved: Number((ss.min ?? 84).toFixed(1)),
        maxObserved: Number((ss.max ?? 84).toFixed(1)),
        avgSocial: ss.samples ? Number((ss.sum / ss.samples).toFixed(2)) : 84,
        below30Ticks: ss.below30Ticks || 0,
        socialRecoveries: ss.recoveries || 0,
        chatInteractions: ss.chatCount || 0,
        huddleCount: state._huddleCount || 0
      },
      caffeineVsStandardEnergy: {
        caffeineReliantAvgEnergy: caffAvg,
        standardAvgEnergy: stdAvg,
        energyGap: Number((stdAvg - caffAvg).toFixed(2)),
        caffeineAvgDrainPerMin: caffDrainRate,
        standardAvgDrainPerMin: stdDrainRate,
        drainRatio: stdDrainRate ? Number((caffDrainRate / stdDrainRate).toFixed(3)) : 0
      },
      weeklyReports: {
        totalDeadlines: wrRecs.length,
        onTimeCount: wrOnTime,
        missedCount: wrMissed,
        onTimeRate: wrRecs.length ? Number((wrOnTime / wrRecs.length).toFixed(3)) : 0,
        avgProgressAtDeadline: Number(wrAvgPct.toFixed(1)),
        patienceUpCount: wrPatUp,
        patienceDownCount: wrPatDown
      },
      manuscripts: {
        totalDeadlines: msRecs.length,
        onTimeCount: msOnTime,
        missedCount: msMissed,
        onTimeRate: msRecs.length ? Number((msOnTime / msRecs.length).toFixed(3)) : 0,
        avgProgressAtDeadline: Number(msAvgPct.toFixed(1)),
        patienceUpCount: msPatUp,
        patienceDownCount: msPatDown
      },
      moraleFromExp: {
        upCount: mf.upCount || 0,
        downCount: mf.downCount || 0,
        neutralCount: mf.neutralCount || 0,
        totalUp: mf.totalUp || 0,
        totalDown: mf.totalDown || 0,
        netDelta: (mf.totalUp || 0) - (mf.totalDown || 0)
      },
      failures: {
        ...failureCounts,
        totalFailures
      },
      audits: {
        totalAudits,
        passed: auditsPassed,
        failed: auditsFailed,
        passRate: totalAudits ? Number((auditsPassed / totalAudits).toFixed(3)) : 0,
        failRate: totalAudits ? Number((auditsFailed / totalAudits).toFixed(3)) : 0,
        avgScore: totalAudits ? Number((scoreSum / totalAudits).toFixed(2)) : 0,
        minScore: totalAudits ? minScore : 0,
        maxScore: totalAudits ? maxScore : 0,
        patienceUpCount: auditPatienceUp,
        patienceDownCount: auditPatienceDown,
        patienceNeutralCount: auditPatienceNeutral,
        patienceDeltaMin: totalAudits ? auditPatienceMin : 0,
        patienceDeltaMax: totalAudits ? auditPatienceMax : 0,
        patienceDeltaAvg: totalAudits ? Number((auditPatienceSum / totalAudits).toFixed(2)) : 0
      },
      coffeeQuartetTicks: coffeeQuartetChecks,
      weather: { ...(state._weatherStats || { normal: 0, rain: 0, heatwave: 0, cold_230: 0 }) },
      birthdays: { ...(state._birthdayStats || { days: 0, greetings: 0 }) },
      weeklySignatures: { ...(state._weeklySigStats || {}) },
      sampleRunAsks: state._sampleRunAskCount || 0,
      byCharacter,
      elapsedMs: Date.now() - t0
    };
  }

  window.KLB.Sim = {
    DAYS,
    ACTIVE_RUN_KEY,
    CLOCK_MINS_PER_REAL_SEC,
    CURFEW_MINS,
    PERMADEATH_MESSAGES,
    loadArchive,
    saveArchive,
    reconcileArchive,
    saveRunSnapshot,
    loadRunSnapshot,
    clearRunSnapshot,
    rollDailyWeather,
    loadDialogueHistory,
    saveDialogueHistory,
    resetDialogueHistory,
    getCurrentDialogueVibe,
    getTimeHours,
    isDialogueAllowedAtTime,
    pickFromShuffleBag,
    pickQuoteForNpc,
    getSpeechLineForNpc,
    resolveBigChudsSender,
    formatClock,
    formatHHMM,
    isCellWalkable,
    isChokepointOrDoorway,
    findDeskChair,
    getDeskChairForObj,
    isOccupiedByCharacter,
    isOccupiedByStationaryCharacter,
    findFreeWalkableNear,
    findFreeAdjacentWalkable,
    findAdjacentWalkable,
    findPathBFS,
    createRunState,
    advanceMinutes,
    tickRealTime,
    pushWhatsApp,
    pushBubble,
    calcBubbleTtl,
    spendWhatsAppMinutes,
    rollDailyBirthday,
    maybeTriggerBirthdayGreeting,
    triggerWeeklySignatureInteraction,
    startPairConversation,
    endPlayerConversations,
    triggerSampleRunCourtesy,
    interpolateWeeklyText,
    scheduleMultiTurnConversation,
    resetBigChudsWeeklySims,
    satisfyHabit,
    applySocialInteraction,
    applyBreakEffects,
    applyExperimentOutcomeToMorale,
    applyFridayAuditPatience,
    applyWorkspaceMess,
    applyWorkspaceCleaning,
    getWriteupEnergyFactor,
    computeEnergyDrain,
    getLabCondition,
    setLabCondition,
    getPortalHop,
    completeNpcPortalHop,
    moveNpcToRoomAndPoint,
    triggerSafetySweep,
    triggerAlexKing1718,
    evaluateSafetySweep,
    evaluateWeeklyReportDeadline,
    evaluateManuscriptDeadline,
    isCoffeeQuartetWindow,
    triggerGroupHuddle,
    triggerLcmsDownHazard,
    triggerAoe2Event,
    triggerAmbientBanter,
    triggerRandomKLBEvent,
    getVisibleNPCReactions,
    getVisibleNPCActions,
    syncNPCSchedules,
    checkPermadeath,
    runAutonomousVerification
  };
})();

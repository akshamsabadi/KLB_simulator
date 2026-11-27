// Complete 22-Character Vetted Roster for KLB Simulator
window.KLB = window.KLB || {};

window.KLB.CAST = [
  // ==================== A. 10 PLAYABLE BIG-CHUDS ====================
  {
    id: 'daniel_richards',
    name: 'Daniel Richards',
    shortName: 'Dan',
    playable: true,
    group: 'chudasama',
    role: 'Senior PhD / Postdoc • Fab Digests & Lateral Flow AuNPs',
    arriveHour: 7.75,
    departHour: 17.75,
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    lunchHour: 12.0,
    lunchRoom: 'gordons_cafe',
    perkTitle: '07:45 Dawn Patrol & MS Whisperer',
    perkDesc: 'Quiet 07:45 bench start with pre-known CIB keypad codes; 50% faster LG11 LC-MS flush (10m) and fewer Kersti Q-TOF stalls.',
    flawTitle: '18:00 Curfew & Side-Cheek Scissors',
    flawDesc: '2x Energy drain after 18:00 curfew; rare bench fumble with sharp scissors and loud lab laugh lore below 25 Energy.',
    waColor: '#60a5fa',
    quotes: [
      "Morning team — been in since 07:45, Büchi 1 is already warmed up #BCN4Life",
      "Pepsin at pH 3.1 is behaving beautifully today, touch wood.",
      "Honestly if pH drifts 0.2 units on the 40 nm AuNPs they turn purple instantly.",
      "Right, past 18:00, this grandad is heading home before I fall asleep in the hood."
    ],
    hintSpecialty: 'bioconj',
    hintLine: "Dan squints at your notes: 'Watch the digest window — quench Pepsin cleanly before Papain, and keep AuNP MES buffer strictly at pH 5.20!'"
  },
  {
    id: 'maximillian_lee',
    name: 'Maximillian Lee',
    shortName: 'Max',
    playable: true,
    group: 'chudasama',
    role: 'PhD Researcher • Bis-PD Crosslinkers & Native DAR 2 ADCs',
    arriveHour: 9.0,
    departHour: 18.0,
    habit: null,
    preferences: { pref: 'gaming', requiresCaffeine: false, label: 'Video Games' },
    lunchHour: 12.85,
    lunchRoom: 'gordons_cafe',
    perkTitle: '160 kg Silverback & Blue Party Mix',
    perkDesc: '160 kg silverback lab presence and Blue Party Mix magic for 2x faster Coomassie SDS-PAGE gel runs.',
    flawTitle: 'Never Weighs TCEP',
    flawDesc: 'Refuses to weigh fresh TCEP at the balance — must ask a labmate for buffered TCEP or gamble on unlabelled bench TCEP!',
    waColor: '#38bdf8',
    quotes: [
      "Anyone got fresh 10 mM TCEP on the bench? Asking for a lazy silverback.",
      "Slapped the gel in Blue Party Mix, bands will be crystal clear in 10 mins.",
      "DAR 2.0 on the nose! Native Herceptin rebridging for the win.",
      "Wait, is that a spider on my 3rd-floor office chair?! Burn the room down."
    ],
    hintSpecialty: 'gels',
    hintLine: "Max grins: 'Don't over-reduce at 37 °C with unbuffered TCEP or you'll get 75 kDa half-antibody everywhere. Keep it buffered at pH 8.0!'"
  },
  {
    id: 'antoine_maruani',
    name: 'Antoine Maruani',
    shortName: 'Antoine',
    playable: true,
    group: 'chudasama',
    role: 'Postdoc / Lab Sage • Dual-Click Astra-PD & Orthogonal ADCs',
    arriveHour: 9.25,
    departHour: 18.25,
    habit: null,
    preferences: { pref: 'gaming', requiresCaffeine: false, label: 'Video Games' },
    lunchHour: 12.75,
    lunchRoom: 'klb_3f',
    perkTitle: '#Hackerman & P2-Tip SEC MacGyver',
    perkDesc: 'Pre-known CIB keypad/PC codes from Day 1, plus #Hackerman P2-tip mini-SEC (25% faster centrifuge and Biotage runs).',
    flawTitle: '#French&Proud & Sliced-Croissant Trauma',
    flawDesc: 'Spawns 15 mins later in the morning; loses 15 Morale if exposed to British sliced ham-and-cheese croissants or Meal Deals.',
    waColor: '#f87171',
    quotes: [
      "Mon Dieu, who sliced a croissant horizontally like bread?! This is a war crime.",
      "Check 128.40.76.1 remotely from upstairs — saves walking to LG1b before Abil's done.",
      "Sequential SPAAC first, THEN CuAAC with THPTA/aminoguanidine so copper never touches free thiols.",
      "#AskAntoine clinic is open — bring me your weird LC-MS adducts."
    ],
    hintSpecialty: 'all',
    hintLine: "Antoine taps the hood sash (#AskAntoine): 'Oven-dry your flask, purge with Argon, run SPAAC before CuAAC, and check DTNB so no free thiols remain!'"
  },
  {
    id: 'andre_shamsabadi',
    name: 'André Shamsabadi',
    shortName: 'André',
    playable: true,
    group: 'chudasama',
    role: 'PhD Researcher • Aerobic Hydrazides, Arynes & Benzodiazepines',
    arriveHour: 9.5,
    departHour: 18.33,
    habit: null,
    preferences: { pref: 'gaming', requiresCaffeine: false, label: 'Video Games' },
    lunchHour: 12.8,
    lunchRoom: 'klb_3f',
    perkTitle: 'Waistcoat Confidence & Poll Sparkplug',
    perkDesc: '20% faster Biotage flash runs (+5 Quality / +4 Yield polish) and +10 Morale from spicy WhatsApp lab polls.',
    flawTitle: 'Forgotten Clicker & -78 °C Dry-Ice Hazard',
    flawDesc: 'Must grab laser clicker upstairs on 3F before Friday Audit; vulnerable to -78 °C acetone/dry-ice splashes & Abil NMR tube fines.',
    waColor: '#818cf8',
    quotes: [
      "Quick poll for the Big-Chuds: Gordon's coffee now or suffer for another 20 mins?",
      "On-water aldehyde + DIAD ticking away nicely — green chemistry at its finest.",
      "5.7 µL/min on the Chudasama hood syringe pump, do NOT sneeze near my tubing.",
      "Wait, did Abil lock my 700 MHz Phenazepam tube in the LG1b sample fridge again?!"
    ],
    hintSpecialty: 'organic',
    hintLine: "André adjusts his waistcoat: 'For the -78 °C TBAT aryne or NaH E1cB step, grab an oven-dried flask + Argon balloon + Cupboard 1 dry THF, or water kills your yield!'"
  },
  {
    id: 'peter_szijj',
    name: 'Peter Szijj',
    shortName: 'Peter',
    playable: true,
    group: 'chudasama',
    role: 'PhD Researcher • Bispecific SynAbs, CiTEs & Sialidase Conjugates',
    arriveHour: 10.25,
    departHour: 19.5,
    habit: null,
    preferences: { pref: 'gaming', requiresCaffeine: false, label: 'Video Games' },
    lunchHour: 12.65,
    lunchRoom: 'gordons_cafe',
    perkTitle: 'Night-Owl LotR Second Wind',
    perkDesc: 'Playing LotR on the Lab Speakers after 18:00 grants +20% walk speed and 55% slower Energy drain for late-shift runs.',
    flawTitle: 'The 2 µL Blue Loading-Dye Misclick',
    flawDesc: 'If Energy drops below 30, risks accidentally pipetting blue SDS loading dye into pure Fab stock instead of the gel PCR tube!',
    waColor: '#34d399',
    quotes: [
      "6 PM in KLB 230 — lab's finally quiet, putting Howard Shore's Shire theme on the speakers.",
      "Running parallel Trastuzumab, Rituximab and OKT3 digests like a one-man antibody factory.",
      "Please tell me I didn't just pipette 2 µL of blue LDS sample buffer into my pure Fab Eppendorf!",
      "SPIEDAC tetrazine click goes in minutes — cleanest 147 kDa band you'll ever see."
    ],
    hintSpecialty: 'bioconj',
    hintLine: "Peter nods over the gel tank: 'Keep sialidase CiTE clicks gentle at pH 7.0, and never pipette near pure Fab stocks when your Energy is below 30!'"
  },
  {
    id: 'joao_nogueira',
    name: 'João Nogueira',
    shortName: 'João',
    playable: true,
    group: 'chudasama',
    role: 'PhD Researcher • Shark VNARs & Targeted PLGA Nanoparticles',
    arriveHour: 9.67,
    departHour: 18.42,
    habit: null,
    preferences: { pref: 'coffee', requiresCaffeine: true, label: 'Coffee' },
    lunchHour: 12.45,
    lunchRoom: 'gordons_cafe',
    perkTitle: "10:30 Gordon's Coffee Captain",
    perkDesc: "10:30 Coffee Quartet Captain: leading the morning run at Gordon's Café grants 2x Morale and +2 Lab Favours.",
    flawTitle: 'Culinary Purist & 17:30 Late Flash Columns',
    flawDesc: 'Refuses cold triangle Meal Deals & Dr Pepper; starting Biotage flash columns after 17:30 drains extra Energy.',
    waColor: '#fbbf24',
    quotes: [
      "10:27 — Gordon's coffee run? Anyone coming?",
      "How do British people call cold wet triangle bread + crisps + Dr Pepper 'lunch'?!",
      "11 kDa shark VNAR E4 clicked onto PLGA–PEG–N3 nanoparticles — polydispersity < 0.12!",
      "17:30 and I'm just loading a silica column before lockup, pray for me."
    ],
    hintSpecialty: 'nano',
    hintLine: "João gestures with his espresso: 'Dropwise nanoprecipitation needs steady mixing and clean monoBrPD-PEG2-BCN — check DLS PDI before Friday!'"
  },
  {
    id: 'faiza_javaid',
    name: 'Faiza Javaid',
    shortName: 'Faiza',
    playable: true,
    group: 'chudasama',
    role: 'PhD Researcher • Pre-Clicked MMAE IgG4 ADCs & Confocal Bioassays',
    arriveHour: 10.25,
    departHour: 18.0,
    habit: null,
    preferences: { pref: 'coffee', requiresCaffeine: true, label: 'Coffee' },
    lunchHour: 12.5,
    lunchRoom: 'gordons_cafe',
    perkTitle: 'Bio-Assay Precision & PI Charm',
    perkDesc: '2F A280 bench checks add +4 Quality to bioconjugations, plus a +0.5 Friday Audit rescue when Vijay scores are tight.',
    flawTitle: '#HalfDayDaiza Morning Commute',
    flawDesc: 'Spawns at 10:15 after morning commute delays and starts without CIB 1965/2145 keypad codes memorised.',
    waColor: '#f472b6',
    quotes: [
      "Guys what's the Mass Spec door code again?? Standing outside LG11!",
      "I wasn't late, my morning train stalled outside Euston I swear!",
      "Pre-clicking diBrPD-BCN + N3-vc-PABC-MMAE first makes IgG4 DAR 4 rebridging so much cleaner.",
      "Need an A280 antibody check on the 2F bench? Just ask nicely!"
    ],
    hintSpecialty: 'adc',
    hintLine: "Faiza smiles: 'Pre-click your hydrophobic MMAE payload onto diBrPD-BCN BEFORE adding reduced IgG4 — way less aggregation on HIC!'"
  },
  {
    id: 'calise_bahou',
    name: 'Calise Bahou',
    shortName: 'Calise',
    playable: true,
    group: 'chudasama',
    role: 'PhD Researcher • Gram-Scale diBrPD-NHS, 95% HHLL & GFP S147C',
    arriveHour: 9.25,
    departHour: 18.17,
    habit: null,
    preferences: { pref: 'coffee', requiresCaffeine: true, label: 'Coffee' },
    lunchHour: 12.35,
    lunchRoom: 'gordons_cafe',
    perkTitle: 'Samwise Resilience & Steak Pie Morale',
    perkDesc: 'Takes 50% reduced Morale loss from lab disasters and lifts colleagues’ Morale during shared lunches.',
    flawTitle: 'Pocket Lemons & Spin-Filter Dilution Math',
    flawDesc: 'Starts with lucky lemons in pockets; rushing VivaSpin concentration risks comical "125% yield" math errors on slides!',
    waColor: '#2dd4bf',
    quotes: [
      "Use p-TsOH for diBrPD-NHS! TFA swaps a bromine out and gives monobromo-PD — learned the hard way!",
      "Kneeling in front of the 4 °C fridge for 20 mins so my Herceptin hits 95% HHLL homogeneity.",
      "Look, those reduced bags of lemons were a bargain, you never know when you need 14 lemons.",
      "Wait, why does my absorbance spreadsheet say 125% protein recovery?!"
    ],
    hintSpecialty: 'pd_synth',
    hintLine: "Calise warns earnestly: 'NEVER use TFA to deprotect diBrPD-tBu ester — bromide/TFA exchange ruins it! Always reflux with p-TsOH·H2O in toluene, and run Herceptin rebridging at 4 °C!'"
  },
  {
    id: 'richard_spears',
    name: 'Richard Spears',
    shortName: 'Richard',
    playable: true,
    group: 'chudasama',
    role: 'PhD Researcher • Thioaryl-PD GSH Kinetics, PEG Hydrogels & Safe Dha',
    arriveHour: 8.83,
    departHour: 18.0,
    habit: null,
    preferences: { pref: 'tea', requiresCaffeine: true, label: 'Tea' },
    lunchHour: 12.15,
    lunchRoom: 'klb_3f',
    perkTitle: "Richard's Kettle & Meticulous Auditor's Eye",
    perkDesc: "Brewing Yorkshire or Bettys tea at the 3F Kettle restores +36 Energy; honest Friday slide disclosure earns a +0.65 Honest Disclosure Rigor bonus.",
    flawTitle: 'Soluble-or-Not-Soluble DMSO Crash-Out',
    flawDesc: 'Bis-thioaryl PD stocks risk crashing out of aqueous buffer if co-solvent % isn’t balanced; strict 18:00 curfew ahead of 19:30 lockup.',
    waColor: '#c084fc',
    quotes: [
      "Welcome to today's episode of 'Soluble or Not Soluble' — spoiler: there's white precipitate.",
      "Use CDMP for dehydroalanine! MSH is a literal shock-sensitive explosive, Safety would shut KLB down.",
      "Put the kettle on upstairs on 3F — posh biscuits in the tin if everyone behaves.",
      "8-arm PEG-SH hydrogel gelled in 7 seconds flat, nearly glued my magnetic stir bar forever!"
    ],
    hintSpecialty: 'kinetics',
    hintLine: "Richard pushes up his glasses: 'Never touch MSH — use bench-stable CDMP at pH 8.0 for Dha! And if an NMR has trace EtOAc, disclose it honestly on your slide — Vijay respects rigor.'"
  },
  {
    id: 'marcos_fernandez',
    name: 'Marcos Fernández',
    shortName: 'Marcos',
    playable: true,
    group: 'chudasama',
    role: 'PhD Researcher • Thiol-PD Substitutions & Turn-On Fluorescent SMDCs',
    arriveHour: 8.75,
    departHour: 18.0,
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    lunchHour: 12.25,
    lunchRoom: 'gordons_cafe',
    perkTitle: '08:45 Master Doorman & #Headsup Scout',
    perkDesc: 'Early 08:45 arrival with pre-known CIB keypad codes and 90s early #headsup Safety Sweep warnings.',
    flawTitle: 'Cupboard 5 Thiol Stench & Dry-Ice Duty',
    flawDesc: 'Must quench thiol glassware in the bleach bath in the Chudasama hood immediately or trigger lab-wide stench; covers urgent 2F prep sweeps.',
    waColor: '#fb923c',
    quotes: [
      "Claire and the Safety Inspector are in the KLB #headsup — specs on and cap the waste!",
      "Vijay just walked out of CIB heading toward KLB #headsup!",
      "Opening Cupboard 5 for 30 seconds — bleach bath is ready in the Chudasama hood, nobody panic!",
      "5 mM GSH cleaved the self-immolative coumarin linker cleanly while 40 mg/mL HSA stayed dark!"
    ],
    hintSpecialty: 'thiols',
    hintLine: "Marcos whispers: 'Any reaction using Cupboard 5 thiols MUST be quenched in the bleach bath in the Chudasama hood right after workup, or Lab Condition & Morale tank!'"
  },

  // ==================== B. PIs & 3-GROUP LAB NEIGHBOURS ====================
  {
    id: 'vijay_chudasama',
    name: 'Prof. Vijay Chudasama',
    shortName: 'Vijay',
    playable: false,
    isPI: true,
    group: 'chudasama',
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    lunchHour: 12.6,
    lunchRoom: 'gordons_cafe',
    role: 'Chudasama Group PI • Unannounced Lab Rounds & Solo Friday Auditor',
    waColor: '#3b82f6',
    quotes: [
      "How are the reactions looking? Have we got clean LC-MS and NMR yet?",
      "That's suboptimal — one word. Let's make sure the controls are watertight for Friday.",
      "Good momentum! Make sure the 4-slide update tells a crisp, rigorous story.",
      "Where is the HRMS / SDS-PAGE lane for the unreduced control?"
    ]
  },
  {
    id: 'jamie_baker',
    name: 'Prof. Jamie Baker',
    shortName: 'Jamie Baker',
    playable: false,
    isPI: true,
    group: 'baker',
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    role: 'Baker Group PI • Safety-Specs Enforcer',
    waColor: '#10b981',
    quotes: [
      "Morning — safety specs on as soon as you step past the door, please!",
      "Keep the central balance table spotless after weighing, everyone.",
      "Nice seeing the maleimide and PD bays humming along."
    ]
  },
  {
    id: 'tom_sheppard',
    name: 'Prof. Tom Sheppard',
    shortName: 'Tom Sheppard',
    playable: false,
    isPI: true,
    group: 'sheppard',
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    role: 'Sheppard Group PI • Organic Synthesis & Borate Bay',
    waColor: '#f59e0b',
    quotes: [
      "Checking in on the Sheppard hoods — hope the Biotage isn't backed up.",
      "Dry glassware makes all the difference on tricky condensations.",
      "Fancy bumping into half of KLB downstairs at Gordon's Café!"
    ]
  },
  {
    id: 'nafsika_forte',
    name: 'Nafsika Forte',
    shortName: 'Nafsika',
    playable: false,
    group: 'baker',
    arriveHour: 9.5,
    departHour: 19.25,
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    lunchHour: 12.4,
    lunchRoom: 'gordons_cafe',
    role: 'Baker Group Researcher • Official KLB First Aider & Late-Night Rescuer',
    waColor: '#10b981',
    quotes: [
      "Still in Lab 230 until 19:15 — shout if you're stuck in CIB and need your flask pulled off heat!",
      "First-aid kit is stocked if anyone gets a dry-ice burn or glass nick.",
      "Need emergency anhydrous DMF or a tiny aliquot of Herceptin Fab? Cash in a Favour!"
    ]
  },
  {
    id: 'archie_wall',
    name: 'Archie Wall',
    shortName: 'Archie',
    playable: false,
    group: 'baker',
    arriveHour: 9.25,
    departHour: 18.0,
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    lunchHour: 12.2,
    lunchRoom: 'klb_3f',
    role: 'Baker Group Researcher • Maleimide Conjugates & Balanced-Rotor Purist',
    waColor: '#34d399',
    quotes: [
      "Spinning down my albumin-maleimide conjugates — leave that rotor off-balance by 0.2 g and I will find you.",
      "Baker bay rule: human serum albumin foams if you whisper near it, keep the pipette tip submerged!",
      "Büchi vacuum is pulling cleanly below 20 mbar today — shout if you want two spare lanes on my gel."
    ]
  },
  {
    id: 'marco_sabatini',
    name: 'Marco Sabatini',
    shortName: 'Sabatini',
    playable: false,
    group: 'sheppard',
    arriveHour: 9.5,
    departHour: 18.25,
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    lunchHour: 12.7,
    lunchRoom: 'gordons_cafe',
    role: 'Sheppard Group Researcher • Borate Amidations & Style Icon',
    bio: 'Italian borate-amidation chemist who completed a postdoc stint in Paris and Lyon — swaps fluent French lab banter with Antoine while upholding Milanese standards in KLB.',
    waColor: '#f59e0b',
    quotes: [
      "A tiny spritz of 'Sabatini by Sabatini' and even Kersti & Abil will smile at your vials!",
      "Treat the heirloom 'in memoriam Sabatini' TLC chamber with respect — fastest Rf separation in KLB.",
      "Bellissimo spot separation on 254 nm!"
    ]
  },
  {
    id: 'charlotte_coomber',
    name: 'Charlotte Coomber',
    shortName: 'Charlotte',
    playable: false,
    group: 'sheppard',
    arriveHour: 9.0,
    departHour: 17.75,
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    lunchHour: 12.1,
    lunchRoom: 'gordons_cafe',
    role: 'Sheppard Group Researcher • Lab Social Organiser & High-Decibel Chatter',
    waColor: '#fbbf24',
    quotes: [
      "SO THEN AT THE WEEKEND WE WENT ALL THE WAY ACROSS LONDON AND— (put Headphones on to focus!)",
      "Need a working whiteboard marker or spare TLC capillary? Here you go!",
      "Doing a card collection at the Sheppard desks if anyone has £2 coins!"
    ]
  },

  // ==================== C. FACILITY GATEKEEPERS & CANON NPCs ====================
  {
    id: 'kersti_karu',
    name: 'Dr Kersti Karu',
    shortName: 'Kersti',
    playable: false,
    fixedRoom: 'cib_lg11_ms',
    fixedPos: { x: 15, y: 7, dir: 'S' },
    group: 'facility',
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    role: 'CIB LG11 Mass Spec Manager',
    waColor: '#a855f7',
    quotes: [
      "Dear all, LCMS is out of the operation — somebody injected PEG and PBS buffer again. this not good.",
      "Did you desalt this antibody sample 10× on VivaSpin? No salt in my Q-TOF source!",
      "Log onto the Mass Spec PC and write your sample code properly in the book. hope not covid."
    ]
  },
  {
    id: 'abil_aliev',
    name: 'Dr Abil Aliev',
    shortName: 'Abil',
    playable: false,
    fixedRoom: 'cib_lg1b_nmr',
    fixedPos: { x: 15, y: 5, dir: 'S' },
    group: 'facility',
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    role: 'CIB LG1b NMR Manager',
    waColor: '#8b5cf6',
    quotes: [
      "Look at 3.8 ppm — where is CH2?! Check your shimming and solvent peak!",
      "Uncollected NMR tubes left on the rack go into the NMR sample fridge. Collect them on time or £130 charge!",
      "700 MHz Neo is reserved for clean VT-NMR and publication spectra — minimum 4 cm solvent height."
    ]
  },
  {
    id: 'claire_carmalt',
    name: 'Prof. Claire Carmalt',
    shortName: 'Prof. Carmalt',
    playable: false,
    group: 'facility',
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    role: 'Head of UCL Chemistry • Departmental Safety Sweep',
    waColor: '#ec4899',
    quotes: [
      "Afternoon KLB — thirty seconds to inspect your sashes, specs, and bench discipline before my next committee.",
      "Love seeing three groups sharing Lab 230 smoothly, as long as nobody blocks my fire doors.",
      "Winchesters capped, extinguishers home, smiles on — make Chemistry proud on Friday."
    ]
  },
  {
    id: 'safety_inspector',
    name: 'Safety Inspector',
    shortName: 'Safety Inspector',
    playable: false,
    group: 'facility',
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    role: 'Departmental Safety Officer',
    waColor: '#eab308',
    quotes: [
      "*Clicks pen on clipboard* Item one: eye protection. Item two: left fire exit clearance. Item three: COSHH cupboards.",
      "Unattended uncapped silica waste or missing safety specs incurs an immediate Lab Condition deduction.",
      "Section 4.2: the Fire Exit corridor and extinguisher bay must remain unobstructed at all hours."
    ]
  },
  {
    id: 'alex_king',
    name: 'Alex King',
    shortName: 'Alex King',
    playable: false,
    group: 'facility',
    habit: null,
    preferences: { pref: 'balanced', requiresCaffeine: false, label: 'Balanced' },
    role: '17:18 Corridor Pursuer',
    waColor: '#22c55e',
    quotes: [
      "Excuse me, is this the corridor to Gordon's Café or the upstairs tea room?",
      "Wait, does everyone in white coats get priority at the Gordon Street espresso bar?",
      "Sorry to hover by your hood — someone told me the coffee group meets here at 17:18!",
      "*Peers earnestly over your shoulder at a swirling flask* Oh, is that matcha or reaction mix?"
    ]
  }
];

window.KLB.CAST_BY_ID = Object.fromEntries(window.KLB.CAST.map(c => [c.id, c]));

window.KLB.BIG_CHUDS_IDS = [
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

window.KLB.COFFEE_QUARTET = {
  members: ['joao_nogueira', 'nafsika_forte', 'vijay_chudasama', 'faiza_javaid'],
  roomId: 'gordons_cafe',
  windows: [
    { id: 'morning', startHour: 10.5, endHour: 11.17, label: '10:30 Morning Coffee' },
    { id: 'afternoon', startHour: 15.0, endHour: 15.58, label: '15:00 Afternoon Coffee' }
  ],
  seats: {
    joao_nogueira: { x: 6, y: 10, dir: 'S' },
    nafsika_forte: { x: 8, y: 11, dir: 'W' },
    vijay_chudasama: { x: 10, y: 10, dir: 'S' },
    faiza_javaid: { x: 12, y: 11, dir: 'W' }
  },
  chatLines: {
    joao_nogueira: [
      "Double espresso and pastel de nata at Gordon's, proper science.",
      "Every PhD snag shrinks forty percent after a proper espresso.",
      "How do British people call cold triangle bread a full lunch?!",
      "Abolish baby carrots and zero percent yoghurt, eat real food!",
      "Grabbing a second espresso before heading back up to Lab 230.",
      "Tomorrow I bring bacalhau com natas upstairs for the squad.",
      "Ten twenty-seven on the dot, coffeebois and girl assembled.",
      "Never instant granules irmão, Gordon's espresso machine only!"
    ],
    nafsika_forte: [
      "Best twenty minutes of the day, flat whites away from rotavaps.",
      "How is everyone looking for Friday? Shout if you need a hand.",
      "Gordon's almond croissants beat Lab 230 tap water any hour.",
      "I am in Lab 230 till 19:15 tonight, happy to watch your Büchi.",
      "Nothing resets the brain like twenty minutes away from hoods.",
      "Relax João, we ordered warm toasted paninis, zero soggy bread.",
      "Need anhydrous DMF or Fab aliquots later? Just ask after coffee.",
      "Did anyone actually switch the 2F sonicator off before leaving?"
    ],
    vijay_chudasama: [
      "Good breather team, coffee clears the head for Friday slides.",
      "Tell me after espresso how your conjugation controls look.",
      "Ten minutes of Gordon's caffeine, then back to push the story.",
      "Signed two wonderkids on Football Manager on the train in.",
      "Still have not forgotten what Faiza wrote on my hernia card.",
      "Good energy across Lab 230 today, keep the controls watertight.",
      "Arsenal midfield needs serious surgery before Saturday, honestly.",
      "Cold soggy meal deals are suboptimal, one word, stick to paninis."
    ],
    faiza_javaid: [
      "Gordon's iced oat latte is the only thing powering my morning.",
      "Are we doing ten-thirty and three pm coffee runs? Zero complaints.",
      "Quick pastry debrief beats staring at a blank slide deck!",
      "Still pretending I understand what a Football Manager striker is.",
      "Wait did someone bring chocolate cake or am I hallucinating?",
      "Ten-fifteen arrival is basically early on the West Coast line!",
      "Peak artistic expression on that hernia card boss, zero regrets.",
      "Enough work talk at the coffee table, pass the napkins!"
    ]
  }
};

// ============================================================================
// PER-CHARACTER SPEECH-BUBBLE LINES (22 Cast: 8 Casual + 5 Bench Each)
// ============================================================================
window.KLB.SPEECH_LINES = {
  // ==================== 10 BIG-CHUDS ====================
  daniel_richards: {
    casual: [
      "Past nine pm is officially past my bedtime, lads.",
      "Left my lunch in the 3F fridge, praying Max didn't spot it.",
      "Burnley fans are just as miserable when we actually win.",
      "Watery beans swimming on toast should be a criminal offence.",
      "Revisionist history from Lemon Boy, the court record stands.",
      "I miss you idiots already, strictly no homo obviously.",
      "Did Antoine bring French cheese or can I go home?",
      "I have a selfie filter installed on my eyes now."
    ],
    bench: [
      "TLC or it didn't happen, show me the plate.",
      "Spot at Rf 0.45 is glowing under 254 nm, thank goodness.",
      "Buffer drifted and my gold nanoparticles turned Ribena purple.",
      "Is the Waters mass spec still sulking downstairs today?",
      "Clean flash separation, please don't stall on me now column."
    ]
  },

  maximillian_lee: {
    casual: [
      "Slow-cook your beans in chorizo fat until bean plasma forms.",
      "Only football match I ever saw was Barnsley versus Leeds.",
      "A spider claimed my office chair, duel at noon tomorrow.",
      "Are we playing Age of Empires at five or what?",
      "Andrè rocking up in tailoring while I am in hoodie number four.",
      "Evening AoE2 lobby at six, no mercy, brace yourselves.",
      "Northern Line died at Finchley, rode a bus like a mug.",
      "Calise walks like his legs are controlled by remote."
    ],
    bench: [
      "Anyone got buffered TCEP for a very lazy silverback?",
      "Any vagabundas running a gel I can jump onto?",
      "Forgot to peel the bottom sticker off my precast gel.",
      "Nobody uses mass spec anymore Calise, flame tests only.",
      "No way fridge TCEP survives longer than two weeks max."
    ]
  },

  antoine_maruani: {
    casual: [
      "No true Frenchman survives British supermarket viennoiserie.",
      "British giraffe bread is the worst invention of mankind.",
      "Three kilos of birthday chicken nuggets, don't judge me.",
      "One ninja-rope turn in Worms and you are all finished.",
      "Arrived fifteen minutes late, French and proud, mec.",
      "Stuck on the Eurostar since five thirty, entertain me please.",
      "Yes I smuggled Maldon sea salt back to Paris, quiet.",
      "We can't play FarmVille tonight unless Faiza joins us."
    ],
    bench: [
      "Prepared fresh twenty millimolar TCEP, this is the way.",
      "This Biotage is useless, gravity columns are faster honestly.",
      "Check the NMR server before walking down three flights.",
      "Packed a desalting column inside a cut pipette tip.",
      "Bring me your weird acetonitrile adducts, clinic is open."
    ]
  },

  andre_shamsabadi: {
    casual: [
      "Vote on second espresso now or power through till noon?",
      "My dismantling of capitalism would be completely intentional.",
      "Northern Line is immensely cursed again, send help.",
      "Ironed shirt and waistcoat today, feeling suspiciously neat.",
      "Reset the timer, Richard just mentioned Yorkshire again.",
      "My dad's wedding tux was genuinely made in Yugoslavia.",
      "I would rather fast than eat a soggy microwave breakfast.",
      "Stellaris tonight Peter, or are we conquering Europe first?"
    ],
    bench: [
      "TLC looks clean enough, honestly I don't care anymore.",
      "Nobody sneeze near my syringe pump tubing for twenty minutes.",
      "Twenty minutes of my mortal life lost to RiskNET.",
      "Who used the last drop of deuterated chloroform?",
      "Did Abil take my NMR tube hostage in his fridge?"
    ]
  },

  peter_szijj: {
    casual: [
      "That is not a croissant, that is glorious Hungarian sóskifli!",
      "Twenty spicy nuggets and two large fries, zero regrets!",
      "How do people pay London rent without selling a kidney?!",
      "Rain outside, Fellowship soundtrack on, leave me be till six!",
      "Gordon's pastry run before the espresso machine shuts?",
      "Played Hearts of Iron till two am, probably fine!",
      "Walking out of KLB tonight to Intro by The xx!",
      "Beat Antoine twice at AoE2, check on his blood pressure!"
    ],
    bench: [
      "No Max, I am not weighing fresh TCEP for you!",
      "Keeping the SDS loading dye on the far side of the bay!",
      "My reaction actually worked, thought y'all should know!",
      "Never be ashamed of a wonky gel, own those bands!",
      "Please behave Superdex column, beat the 19:30 lockup!"
    ]
  },

  joao_nogueira: {
    casual: [
      "Portuguese espresso hits twice as hard as instant granules.",
      "Real lunch means hot food on a plate, not chilled plastic.",
      "Dr Pepper is genuinely the worst drink on this planet.",
      "Brought bacalhau com natas upstairs if anyone wants proper food!",
      "Coffee at Gordon's, never instant granules, I beg you mates.",
      "Portugal playing tonight, zero lab work happening after seven!",
      "After Portuguese piri-piri, everything else tastes mild.",
      "Food is a privilege irmão, abolish sad desk meal deals!"
    ],
    bench: [
      "17:30 and I am just starting a Biotage column before lockup.",
      "Bad TCEP is going to ruin my whole reputation mate!",
      "Why are my nanoparticles floating on top of the PBS?",
      "Thirty degrees in Lab 230, nothing rebridges cleanly in this!",
      "Anybody running a gel soon so I can squeeze on?"
    ]
  },

  faiza_javaid: {
    casual: [
      "Are the coffeebois heading over to Gordon's soon or what?",
      "Still have zero clue why you lot obsess over football.",
      "My peaceful AoE2 village is thriving, leave my farms alone!",
      "Why is nobody walking like a gorilla or buying chocolate?",
      "Half this chat is just beans, croissants, or sheer chaos.",
      "Grabbing lunch at Gordon's today, try not to miss me.",
      "Dan is going to say something snarky, I can feel it.",
      "Why did you show us hummus when I'm starving?"
    ],
    bench: [
      "Own up, who pinched the P20 off the TCEP bench?",
      "Did I pre-click the linker or add MMAE straight to IgG4?",
      "Is it weird if I carry my gel upstairs?",
      "Enzymes are so dramatic about half a pH unit, honestly.",
      "Grabbing the 2F A280 spectrophotometer for two quick reads!"
    ]
  },

  calise_bahou: {
    casual: [
      "Dan bought the fourteen lemons, I only carried the bags!",
      "Bought lunch thinking it was chicken, turns out it's tofu.",
      "A meal deal gives you almost infinite sandwich choices mate.",
      "Victoria Line is proper cursed this morning, sorry bois.",
      "Just demolished a cow-sized steak pie, morale is sky high.",
      "Anyone else fancy a warm Gordon's sausage roll right now?",
      "Use my referral link bois, free fiver for everyone!",
      "Bought a dodgy second-hand bike, didn't die, pretty chuffed."
    ],
    bench: [
      "Wait, did I forget the dilution factor on this VivaSpin tube?",
      "Checking the 4 °C cold reaction every ten mins, fingers numb.",
      "Refluxing p-TsOH cleanly in toluene, zero bromide exchange.",
      "Who left the fridge door resting open on a rack?",
      "Spinning my tubes five more minutes, save me a coffee!"
    ]
  },

  richard_spears: {
    casual: [
      "Cooking baked beans in a saucepan genuinely unsettles me.",
      "How do you spot a Yorkshireman? Don't worry, he'll say.",
      "Two grades of Bettys tea upstairs, plus emergency posh biscuits.",
      "Quiet supper at eight and fast asleep before ten.",
      "No free biscuits at that conference, writing a stern letter.",
      "So many England goals lately, it is definitely coming home.",
      "Flew business class to Australia once, frankly it ruins economy.",
      "Dread to think what a soggy meal deal costs nowadays."
    ],
    bench: [
      "Welcome to Soluble or Not Soluble, there are no winners.",
      "Spoiler alert: my linker just crashed out as white snow.",
      "Prep TLC it is then, genuinely no other options left.",
      "My hydrogel set in seven seconds and trapped the stirrer.",
      "Better to disclose trace ethyl acetate than crop the spectrum."
    ]
  },

  marcos_fernandez: {
    casual: [
      "My bus is so slow pedestrians are overtaking us outside.",
      "Five of us turned up with identical Monday haircuts again.",
      "Half our WhatsApp polls belong in an Angewandte perspective.",
      "Waiting for a bus in the rain builds character, allegedly.",
      "Fëanor did plenty wrong, don't get me started on Silmarillion.",
      "Nothing clears a rough week like Thursday fencing practice.",
      "Northern Line is suspended again, walking from Euston.",
      "Pretty sure Cupboard 19 has been haunted since twenty seventeen."
    ],
    bench: [
      "That compound is riding straight up the TLC solvent front.",
      "Thiol flasks straight into the Chudasama bleach bath after use!",
      "Dry ice dewar is nearly empty, top up before four!",
      "Count me out for pints, got six NMRs queued downstairs.",
      "Another half hour wasted on peak RiskNET bureaucracy bollox."
    ]
  },

  // ==================== NEIGHBOURS, PIs & FACILITY CAST ====================
  nafsika_forte: {
    casual: [
      "Gordon's flat white and pastry run with João, anyone else?",
      "Skip Santorini, pick a quiet Greek island with proper tavernas.",
      "Still here till 19:15, powered entirely by double espressos.",
      "Peter left the Lord of the Rings soundtrack playing again.",
      "Bloomsbury drizzle has ruined my hair before ten am.",
      "How do you boys argue about beans for three days?",
      "Brunch at Gordon's beats any soggy meal deal, trust me.",
      "Night buses into central test every ounce of patience."
    ],
    bench: [
      "Pulled someone's dry flask out of the Büchi bath again.",
      "First-aid plasters are in my drawer if glass bites anyone.",
      "Emergency dry DMF in my bay, bring it straight back!",
      "Lab 230 around 19:15 is honestly peak column peace.",
      "Just clicked the four degree fridge door shut properly."
    ]
  },

  archie_wall: {
    casual: [
      "Small parcel waiting in the CIB pigeonholes for someone here.",
      "Champions League knockout night, nobody disturb my sofa later.",
      "Central Line felt like a tin of sardines this morning.",
      "Someone raided the 3F biscuit tin and left only crumbs.",
      "Gordon's toasted focaccia wrap is elite Baker-bay fuel.",
      "Friday five pm wrap cannot arrive fast enough this week.",
      "Checking my rotor weight to 0.01 g, habits die hard.",
      "Swear Dan has been at his bench since six thirty am."
    ],
    bench: [
      "Who left an unbalanced centrifuge rattling across Baker bay?",
      "Got two spare lanes on my gel if anyone's quick.",
      "Büchi vacuum is finally pulling below twenty millibar today.",
      "Why does serum albumin froth if you even whisper near it?",
      "Done on the spin filters in five, rotor balanced to the gram."
    ]
  },

  marco_sabatini: {
    casual: [
      "British instant coffee is a crime against the human soul.",
      "Three years postdoc in France, still loyal to Italian espresso.",
      "Never snap spaghetti in half while an Italian is watching.",
      "London rain has zero respect for good leather loafers.",
      "Proper espresso at Gordon's is non-negotiable before noon.",
      "Ironed shirt under the lab coat, standards matter gentlemen.",
      "Six pm in Milan means aperitivo, here it means rain.",
      "Even André's waistcoat approves of Italian tailoring, naturally."
    ],
    bench: [
      "Put the glass lid back on my heirloom TLC chamber!",
      "Spot-to-spot conversion under 254 nm, bellissimo chemistry today.",
      "Borate esters hate wet London air, flame-dry everything twice.",
      "Who drained the ethyl acetate barrel without swapping it over?",
      "Why does my baseline look like the Dolomites this morning?"
    ]
  },

  charlotte_coomber: {
    casual: [
      "Wait till you hear where we ended up Saturday night!",
      "Booked a big booth at the pub for Friday pints!",
      "Why did half the lab suddenly put big headphones on?",
      "Gordon's almond croissant secured, five minutes peace please.",
      "We need two more people for departmental trivia Thursday!",
      "Took three buses from South London because the Tube died.",
      "Is it too early on Wednesday for Gordon's pastries?",
      "Honestly the department tea-point gossip today is wild."
    ],
    bench: [
      "Whose bench timer has been beeping for ten solid minutes?!",
      "Got three working whiteboard markers, guard them with your life!",
      "Just snapped three TLC capillaries in a row, send patience.",
      "Bagging the Sheppard Büchi next, five minutes left right?",
      "Please separate cleanly column, I have dinner plans at seven!"
    ]
  },

  vijay_chudasama: {
    casual: [
      "Walking to Gordon's for a quick coffee, anyone joining?",
      "Morning train ran on time, read three whole manuscripts.",
      "Half the department vanishes the second the sun peeks out.",
      "Managed eighteen holes without losing one golf ball Sunday.",
      "Did Faiza write nonsense on the group card again?",
      "North London derby this weekend, try not to look smug Jamie.",
      "Need two double espressos before Monday admin emails.",
      "Summer group barbecue is on if British weather behaves itself."
    ],
    bench: [
      "Remember everyone, suboptimal is strictly one word on slides.",
      "How is that crude LC-MS trace looking this morning?",
      "Show me the unreduced control lane before popping champagne.",
      "Four crisp slides on Friday, tell a clean clear story.",
      "Did Kersti let your antibody run on the Q-TOF yet?"
    ]
  },

  jamie_baker: {
    casual: [
      "Saw three people sprint for safety specs hearing my footsteps.",
      "Gordon Street coffee queue is halfway down the pavement today.",
      "Cycled in through horizontal Bloomsbury rain, marvellous start.",
      "Late afternoon coffee break sounds thoroughly earned.",
      "Good buzz in Lab 230 today, suspiciously cheerful even.",
      "Who keeps playing Hobbit music on the lab speakers?",
      "Spurs will break your heart every spring like clockwork.",
      "Grabbing a quick flat white before lectures kick off."
    ],
    bench: [
      "Safety specs on before crossing the door line, please!",
      "Let's brush the silica snow off the shared balance table.",
      "Is that gel tank leaking buffer onto the bench again?",
      "Label your Falcon tubes properly or the fridge fairy strikes.",
      "Clean maleimide rebridging trace there, very tidy work."
    ]
  },

  tom_sheppard: {
    casual: [
      "Bumped into half of KLB in the Gordon's coffee queue.",
      "Bloomsbury wind just turned another umbrella inside out outside.",
      "KLB heating has two modes: Arctic tundra or greenhouse.",
      "Nine am organic lecture done, time for serious caffeine.",
      "Piccadilly Line delays kept half the undergrads out today.",
      "Nothing clears the head like escaping admin emails for lab.",
      "Have a proper weekend everyone, step away from ChemDraw.",
      "Gordon's ran out of warm paninis by twelve fifteen."
    ],
    bench: [
      "Flame-dry the glassware properly, London air is sheer soup.",
      "Looks like the Biotage solvent waste needs swapping out.",
      "Clean spot-to-spot TLC beats staring at crude NMR all day.",
      "Someone opened the thiol cupboard, unmistakable aroma in here.",
      "Keep the drying oven stocked so flasks stay bone dry."
    ]
  },

  kersti_karu: {
    casual: [
      "Zero daylight in LG11 basement since Monday, very peaceful.",
      "Somebody coughed near my door, hope not covid honestly.",
      "Strong black coffee is the only buffer working down here.",
      "Estates air-con makes strange rattle again, this not good.",
      "Are those Bettys biscuits from Richard? Leave two on desk.",
      "That Italian cologne beats thiol smell down here, thank you.",
      "Quiet weekend ahead, zero broken pumps and zero student emails.",
      "At least Dan says good morning before breaking my column."
    ],
    bench: [
      "Flushing the Q-TOF line again, somebody forgot to desalt.",
      "No PBS salt in my Q-TOF source, this not good.",
      "Buffer salts clog my spray needle faster than Monday coffee.",
      "Why you click Run when red error light is flashing?",
      "Write your sample code properly in the uplc2011 logbook."
    ]
  },

  abil_aliev: {
    casual: [
      "My magnets are much quieter than the Northern Line crowd.",
      "Students sprint down here at four fifty-five like clockwork.",
      "Quiet cup of tea in LG1b beats upstairs chaos.",
      "Civilised manners and a proper greeting go a long way.",
      "Pouring on Gordon Street? Down here the weather never changes.",
      "Very pleasant Italian cologne, much nicer than pyridine vapour.",
      "Even on Friday evening someone forgets tubes on my rack.",
      "Good weekend to everyone who collected their samples on time."
    ],
    bench: [
      "Check your shimming before blaming the magnet for broad peaks.",
      "Three uncollected tubes already sitting in my sample fridge.",
      "Top up deuterated solvent to four centimetres, not a drop less.",
      "Your baseline rolls like waves because shimming was rushed.",
      "Check 128.40.76.1 from upstairs instead of hovering at my door."
    ]
  },

  claire_carmalt: {
    casual: [
      "Three committee meetings before lunch, glad KLB is humming.",
      "Grabbing an espresso on Gordon Street between Dean calls.",
      "Remember Friday departmental seminar kicks off sharp at four.",
      "Always impressed when Lab 230 stays spotless mid-week.",
      "Tell Vijay and Jamie I expect glowing grant updates soon.",
      "Write-up desks upstairs look suspiciously tidy today.",
      "Zero alarms pulled this morning, small department victories.",
      "Take a proper lunch break at noon, even synthetic chemists."
    ],
    bench: [
      "Specs on before the threshold — yes, I saw you reach just now.",
      "Cap that Winchester cleanly, we like our solvents inside glass.",
      "Sash down to the arrow please, energy bills aren't imaginary.",
      "Sharp lab discipline today, keep Vijay and Jamie on their toes.",
      "Tidy bay, clear corridor — five stars from the Head of Dept."
    ]
  },

  safety_inspector: {
    casual: [
      "Routine walkthrough logged at zero-nine-thirty on clipboard.",
      "Checking laminated hazard posters are straight on every door.",
      "Even tea breaks on 3F require tidy mug-rack compliance.",
      "Lab coat hooks aligned alphabetically? A person can dream.",
      "Visitor safety specs counted and returned to tray fourteen.",
      "Zero incident forms filed this week, thrilling paperwork.",
      "Testing fire marshal stopwatch in case an alarm sounds.",
      "Please initial the monthly eyewash logbook by five pm."
    ],
    bench: [
      "Regulation 12B: eye protection mandatory beyond the blue line.",
      "Extinguisher offset by twelve centimetres; returning to bay.",
      "Uncapped silica container logged as an immediate infraction.",
      "Fire Exit route width checked; zero crates permitted here.",
      "Every sample vial requires date, compound ID, and initials."
    ]
  },

  alex_king: {
    casual: [
      "Excuse me, do these stairs go to 3F or Gordon Street?",
      "Wait, is Gordon's Café still serving warm pastries at five?",
      "What time do people usually wrap up on 3F?",
      "Is everyone still around after five today?",
      "Oh, I was just passing down this corridor.",
      "Wait, is the coffee group downstairs right now?",
      "Sorry, do you know which bay Vijay sits near?",
      "Just checking if anyone else is staying late."
    ],
    bench: [
      "Just standing quietly behind your hood for a bit.",
      "That flask looks busy, what are you making?",
      "Are you heading upstairs to 3F after that step?",
      "Oh, I can wait here until your column finishes.",
      "Everyone seems really busy at the benches today."
    ]
  }
};

// ============================================================================
// 143 MULTI-TURN GROUP HUDDLE EXCHANGES (klb_2f, klb_3f, gordons_cafe, meeting_room)
// ============================================================================
window.KLB.GROUP_HUDDLES = [
  // ==================== 1. KLB 2F WET LAB (57 HUDDLES) ====================
  // --- Dan & Max ---
  {
    id: 'huddle_2f_dan_max_tcep',
    roomId: 'klb_2f',
    tag: 'Dan & Max',
    turns: [
      { speakerId: 'maximillian_lee', text: "Dan, got fifty microlitres of buffered TCEP on the bench?" },
      { speakerId: 'daniel_richards', text: "The balance is three paces away, you lazy silverback." },
      { speakerId: 'maximillian_lee', text: "You weighed it at seven forty-five, let me live pal." }
    ]
  },
  {
    id: 'huddle_2f_dan_max_artwork',
    roomId: 'klb_2f',
    tag: 'Dan & Max',
    turns: [
      { speakerId: 'daniel_richards', text: "Delicate marker symmetry on that fume hood doodle today." },
      { speakerId: 'maximillian_lee', text: "Classic late-2015 silverback realism, belongs in the Tate." },
      { speakerId: 'daniel_richards', text: "Wipe it off with acetone before Prof. Carmalt walks in." }
    ]
  },
  {
    id: 'huddle_2f_dan_max_curfew',
    roomId: 'klb_2f',
    tag: 'Dan & Max',
    turns: [
      { speakerId: 'daniel_richards', text: "Max, quarter to six, packing up before my bedtime hits." },
      { speakerId: 'maximillian_lee', text: "Stay ten mins and help me run this Coomassie gel mate." },
      { speakerId: 'daniel_richards', text: "Strict nine-thirty curfew, this grandad is already yawning." }
    ]
  },
  {
    id: 'huddle_2f_dan_max_scissors',
    roomId: 'klb_2f',
    tag: 'Dan & Max',
    turns: [
      { speakerId: 'maximillian_lee', text: "Dan, remember falling on bed scissors? Rub yoghurt on it!" },
      { speakerId: 'daniel_richards', text: "The nurse gave me a look when I mentioned your yoghurt tip." },
      { speakerId: 'calise_bahou', text: "Proper medical wisdom from Dr Maxito as usual bois." }
    ]
  },

  // --- Dan & Antoine (#Dantoine4life) ---
  {
    id: 'huddle_2f_dantoine_maldon',
    roomId: 'klb_2f',
    tag: '#Dantoine4life',
    turns: [
      { speakerId: 'antoine_maruani', text: "Dan, smuggling three tubs of Maldon sea salt back to Paris." },
      { speakerId: 'daniel_richards', text: "British salt is our finest export, guard it at customs." },
      { speakerId: 'antoine_maruani', text: "Only thing I trust in England besides #Dantoine4life." }
    ]
  },
  {
    id: 'huddle_2f_dantoine_nuggets',
    roomId: 'klb_2f',
    tag: '#Dantoine4life',
    turns: [
      { speakerId: 'antoine_maruani', text: "Dan, bringing three kilos of nuggets for Max's birthday!" },
      { speakerId: 'daniel_richards', text: "Man I want some nuggets right now, strictly no homo." },
      { speakerId: 'andre_shamsabadi', text: "Count me in before Antoine devours the whole bag solo." }
    ]
  },

  // --- Max & Antoine ---
  {
    id: 'huddle_2f_max_antoine_spelling',
    roomId: 'klb_2f',
    tag: 'Max & Antoine',
    turns: [
      { speakerId: 'maximillian_lee', text: "Great reaction work today Andrè, clean organic finesse." },
      { speakerId: 'andre_shamsabadi', text: "Ten years Max and you still spell it with a grave accent." },
      { speakerId: 'antoine_maruani', text: "My French soul dies a little every time Max uses that grave!" }
    ]
  },
  {
    id: 'huddle_2f_max_antoine_gorilla',
    roomId: 'klb_2f',
    tag: 'Max & Antoine',
    turns: [
      { speakerId: 'maximillian_lee', text: "Antoine, watch a silverback open this jammed cap easily." },
      { speakerId: 'antoine_maruani', text: "You grunted for thirty seconds and barely moved the lid." },
      { speakerId: 'faiza_javaid', text: "Hand it over please, one rubber grip pad and done." }
    ]
  },

  // --- André, Dan, Calise & Marcos ---
  {
    id: 'huddle_2f_andre_dan_gcse',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "How much of our lives was wasted worrying over GCSE grades?" },
      { speakerId: 'daniel_richards', text: "Peak life achievement remains my Pool Frog 1 badge." },
      { speakerId: 'richard_spears', text: "Wait till someone asks for my English Literature A level." }
    ]
  },
  {
    id: 'huddle_2f_andre_calise_lemons',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "How many reduced bargain lemons are stuffed in that coat?" },
      { speakerId: 'calise_bahou', text: "For the hundredth time, Dan bought them, I carried them!" },
      { speakerId: 'daniel_richards', text: "Fake news Lemon Boy, history has already rendered its verdict." }
    ]
  },
  {
    id: 'huddle_2f_andre_calise_125',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'calise_bahou', text: "Forgot dilution math, my sheet says 125% yield!" },
      { speakerId: 'faiza_javaid', text: "Move over Vijay, Big C just broke thermodynamics again!" },
      { speakerId: 'daniel_richards', text: "Conservation of mass remains purely optional in this bay." }
    ]
  },
  {
    id: 'huddle_2f_andre_marcos_cupboard19',
    roomId: 'klb_2f',
    tag: 'KLB Folklore',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Marcos, what is that weird smell drifting past Cupboard 19?" },
      { speakerId: 'marcos_fernandez', text: "Probably the vanished MSc student from twenty seventeen." },
      { speakerId: 'daniel_richards', text: "Well, that escalated to dark KLB folklore before lunch." }
    ]
  },
  {
    id: 'huddle_2f_andre_waistcoat',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "When in doubt, bring the waistcoat out under the lab coat." },
      { speakerId: 'maximillian_lee', text: "Sharp look Andrè, nationalising the railways after TLC?" },
      { speakerId: 'andre_shamsabadi', text: "My dismantling of capitalism will be wholly intentional." }
    ]
  },

  // --- Peter, Max, Richard & Neighbours ---
  {
    id: 'huddle_2f_peter_bluedye',
    roomId: 'klb_2f',
    tag: 'Lab 230 Benches',
    turns: [
      { speakerId: 'peter_szijj', text: "Nearly pipetted blue SDS dye into clean Fab stock!" },
      { speakerId: 'maximillian_lee', text: "Keep your eyes peeled Peetah, blue Fab is tragic stuff!" },
      { speakerId: 'richard_spears', text: "Step away for a quick tea before touching the pipette." }
    ]
  },
  {
    id: 'huddle_2f_peter_lotr_6pm',
    roomId: 'klb_2f',
    tag: 'Evening Shift',
    turns: [
      { speakerId: 'peter_szijj', text: "Past six at last, putting Howard Shore's Shire theme on!" },
      { speakerId: 'nafsika_forte', text: "Honestly helps while I babysit this overnight DMF step." },
      { speakerId: 'daniel_richards', text: "Heading out before Frodo even leaves Bag End, good night." }
    ]
  },

  // --- Faiza, Calise, João, Dan & Nafsika ---
  {
    id: 'huddle_2f_faiza_fitbit',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'calise_bahou', text: "Thinking of buying a Fitbit, reckon it is actually worth it?" },
      { speakerId: 'faiza_javaid', text: "Honestly Calise, you should just get a bit fit." },
      { speakerId: 'daniel_richards', text: "Call the paramedics, someone just got flattened in bay two." }
    ]
  },
  {
    id: 'huddle_2f_faiza_girl_star',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Antoine, happy Friday Laboys, let us survive the day!" },
      { speakerId: 'faiza_javaid', text: "Laboys & girl* thank you very much, show respect!" },
      { speakerId: 'antoine_maruani', text: "You are an honorary boi Faiza, stop pretending otherwise." }
    ]
  },
  {
    id: 'huddle_2f_coffee_1027_rally',
    roomId: 'klb_2f',
    tag: 'Coffee Quartet',
    turns: [
      { speakerId: 'joao_nogueira', text: "Ten twenty-seven coffeebois and girl, Gordon's right now!" },
      { speakerId: 'faiza_javaid', text: "Give me two seconds, taking my purple gloves off!" },
      { speakerId: 'nafsika_forte', text: "Count me in, I need a flat white badly." }
    ]
  },
  {
    id: 'huddle_2f_joao_bad_tcep',
    roomId: 'klb_2f',
    tag: 'Sunday Lab Rap',
    turns: [
      { speakerId: 'joao_nogueira', text: "Max, bad TCEP will bring down my rep, dirty cells waitin!" },
      { speakerId: 'maximillian_lee', text: "Drop the Sunday night lab album already irmão!" },
      { speakerId: 'faiza_javaid', text: "Wait till Vijay hears this on the A280 bench." }
    ]
  },

  // --- Marcos, Richard, Calise & Safety ---
  {
    id: 'huddle_2f_marcos_headsup',
    roomId: 'klb_2f',
    tag: '#Headsup',
    turns: [
      { speakerId: 'marcos_fernandez', text: "Safety Inspector just stepped onto the stairs, specs on!" },
      { speakerId: 'andre_shamsabadi', text: "Legend, capping the Winchester and hiding my dry ice." },
      { speakerId: 'faiza_javaid', text: "Quick, someone tell me if my lab coat looks respectable!" }
    ]
  },
  {
    id: 'huddle_2f_marcos_doorbuzz',
    roomId: 'klb_2f',
    tag: 'Early Shift',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Marcos, forgot my UCL card downstairs, can you buzz me in?" },
      { speakerId: 'marcos_fernandez', text: "Door buzzed. Next time bring your pass before nine am." },
      { speakerId: 'daniel_richards', text: "Marcos keeping half of KLB employed since quarter to nine." }
    ]
  },

  // --- Lab 230 Cross-Group Neighbours ---
  {
    id: 'huddle_2f_sabatini_scent',
    roomId: 'klb_2f',
    tag: 'Lab 230 Cross-Group',
    turns: [
      { speakerId: 'marco_sabatini', text: "André, going to CIB NMR? Take one spritz of Sabatini." },
      { speakerId: 'andre_shamsabadi', text: "Does it actually stop Abil fining us for late tubes?" },
      { speakerId: 'daniel_richards', text: "Longing by Sabatini works miracles on basement facility managers." }
    ]
  },
  {
    id: 'huddle_2f_charlotte_decibels',
    roomId: 'klb_2f',
    tag: 'Lab 230 Cross-Group',
    turns: [
      { speakerId: 'charlotte_coomber', text: "SATURDAY WE MISSED THE LAST TRAIN AND WALKED HOME-" },
      { speakerId: 'marcos_fernandez', text: "Noise-cancelling headphones going on, see you on Monday." },
      { speakerId: 'archie_wall', text: "Save me a two-pound slot on that leaving card collection!" }
    ]
  },
  {
    id: 'huddle_2f_nafsika_balance_rescue',
    roomId: 'klb_2f',
    tag: 'Lab 230 Cross-Group',
    turns: [
      { speakerId: 'nafsika_forte', text: "Specs on everyone, and who dusted the balance table today?" },
      { speakerId: 'calise_bahou', text: "Wasn't me, I haven't weighed a single thing today!" },
      { speakerId: 'charlotte_coomber', text: "Sweeping it now, also hiding three working whiteboard markers." }
    ]
  },

  // --- Antoine & Marco (French Lab Banter) ---
  {
    id: 'huddle_fr_antoine_marco_tlc',
    roomId: 'klb_2f',
    tag: 'French Lab Banter',
    turns: [
      { speakerId: 'antoine_maruani', text: "T'as vu ma cuve à CCM sur la paillasse?" },
      { speakerId: 'marco_sabatini', text: "Oui chef, couvercle remis après ta flash, pas de souci." },
      { speakerId: 'antoine_maruani', text: "Merci mon gars, tu me sauves encore une plaque aujourd'hui." }
    ]
  },
  {
    id: 'huddle_fr_antoine_marco_column',
    roomId: 'klb_2f',
    tag: 'French Lab Banter',
    turns: [
      { speakerId: 'marco_sabatini', text: "Antoine, le Biotage tourne encore ou je peux lancer ma colonne?" },
      { speakerId: 'antoine_maruani', text: "Encore cinq minutes et il est tout à toi, promis." },
      { speakerId: 'marco_sabatini', text: "Parfait, je prépare mes tubes au calme en attendant." }
    ]
  },
  {
    id: 'huddle_fr_antoine_marco_vendredi',
    roomId: 'klb_2f',
    tag: 'French Lab Banter',
    turns: [
      { speakerId: 'marco_sabatini', text: "Prêt pour la réunion de vendredi avec Vijay?" },
      { speakerId: 'antoine_maruani', text: "Trois slides et deux beaux spectres, ça passe largement." },
      { speakerId: 'marco_sabatini', text: "Toujours aussi zen, un vrai patron au milieu du chaos." }
    ]
  },

  // --- Casual 2F Lore & Pair Banter ---
  {
    id: 'huddle_2f_defcon1_gyoza_chillioil',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'maximillian_lee', text: "Def Con 1 alert: the freezer is completely out of gyoza!" },
      { speakerId: 'calise_bahou', text: "Panic over mate, my chilli oil smuggling ring delivers Friday." },
      { speakerId: 'joao_nogueira', text: "Guard that chilli jar like bullion, half the floor wants some!" }
    ]
  },
  {
    id: 'huddle_2f_mill_hill_nuclear_blockade',
    roomId: 'klb_2f',
    tag: 'Commute Chaos',
    turns: [
      { speakerId: 'maximillian_lee', text: "Calise, escaped Mill Hill East before the signal meltdown?" },
      { speakerId: 'calise_bahou', text: "Full nuclear blockade on the Northern Line, hopped three buses!" },
      { speakerId: 'maximillian_lee', text: "Zone 4 commute builds silverback calves, respect mate." }
    ]
  },
  {
    id: 'huddle_2f_andre_rice_cooker_lockout',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Just locked myself out with the rice cooker still on!" },
      { speakerId: 'calise_bahou', text: "Forget the keys mate, is the jasmine rice actually OK?!" },
      { speakerId: 'daniel_richards', text: "Priorities crystal clear, rescue the rice before the flat." }
    ]
  },
  {
    id: 'huddle_2f_brent_cross_280_jeans',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Heard a guy at Brent Cross bragging over £280 jeans." },
      { speakerId: 'joao_nogueira', text: "Two hundred eighty pounds for denim on a PhD stipend?!" },
      { speakerId: 'daniel_richards', text: "For £280 those jeans better file my thesis and cook dinner." }
    ]
  },
  {
    id: 'huddle_2f_childhood_poverty_pigeon',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'daniel_richards', text: "Growing up we only had one shared stick to play outside." },
      { speakerId: 'joao_nogueira', text: "Luxury! We kicked an inflated pig bladder down a cobbled lane!" },
      { speakerId: 'maximillian_lee', text: "Calm down lads, my only pet was a feral pigeon named Dog." }
    ]
  },
  {
    id: 'huddle_2f_worms_nokia_snake',
    roomId: 'klb_2f',
    tag: 'Gaming Crew',
    turns: [
      { speakerId: 'richard_spears', text: "Antoine, my Gen-Z student thought Worms was Nokia Snake!" },
      { speakerId: 'antoine_maruani', text: "Blasphemy! Did Nokia Snake ever have holy hand grenades?" },
      { speakerId: 'richard_spears', text: "Kids today never felt the fear of a wind-blown bazooka." }
    ]
  },
  {
    id: 'huddle_2f_marco_lite_identity',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'calise_bahou', text: "Wait, are we all Marco in here or just Marco Lite?" },
      { speakerId: 'marcos_fernandez', text: "There is Marco Sabatini, Marcos with an s, and sheer chaos." },
      { speakerId: 'peter_szijj', text: "Whenever someone yells Marco in Lab 230, three heads turn!" }
    ]
  },
  {
    id: 'huddle_2f_bigchuds_admission_test',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'faiza_javaid', text: "What even is the official Big-Chuds entry exam these days?" },
      { speakerId: 'antoine_maruani', text: "Simple: beat me at AoE2 or survive a Worms deathmatch." },
      { speakerId: 'marcos_fernandez', text: "And carry the bargain lemon bag upstairs without flinching." }
    ]
  },
  {
    id: 'huddle_2f_yoghurt_tapenade_wound',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'daniel_richards', text: "Wait, who actually prescribes olive tapenade on a paper cut?!" },
      { speakerId: 'maximillian_lee', text: "Probiotic yoghurt and tapenade cure everything mate!" },
      { speakerId: 'peter_szijj', text: "Stick to Nafsika's first-aid plasters before Infection City." }
    ]
  },
  {
    id: 'huddle_2f_faiza_peter_farms',
    roomId: 'klb_2f',
    tag: 'Gaming Crew',
    turns: [
      { speakerId: 'peter_szijj', text: "Faiza, spare my peaceful farms in tonight's AoE lobby?" },
      { speakerId: 'faiza_javaid', text: "Only if your Hungarian knights stay miles from my sheep!" },
      { speakerId: 'peter_szijj', text: "Truce signed, neither of us needs Antoine rushing early." }
    ]
  },
  {
    id: 'huddle_2f_faiza_marcos_mute',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'faiza_javaid', text: "Marcos, did you actually mute the main chat again today?" },
      { speakerId: 'marcos_fernandez', text: "Forty chicken stickers before ten am broke my spirit Faiza." },
      { speakerId: 'faiza_javaid', text: "Fair enough, wait until you see my cake close-up later!" }
    ]
  },
  {
    id: 'huddle_2f_calise_marcos_northern',
    roomId: 'klb_2f',
    tag: 'Commute Chaos',
    turns: [
      { speakerId: 'calise_bahou', text: "Marcos, Northern Line cursed this morning or smooth run?" },
      { speakerId: 'marcos_fernandez', text: "Walked from Euston again Calise, faster than three stops." },
      { speakerId: 'calise_bahou', text: "Solid cardio mate, earns us two steak pies at lunch." }
    ]
  },
  {
    id: 'huddle_2f_joao_marcos_derby',
    roomId: 'klb_2f',
    tag: 'Football Banter',
    turns: [
      { speakerId: 'joao_nogueira', text: "Marcos, watching the Iberia derby tonight or staying late?" },
      { speakerId: 'marcos_fernandez', text: "Watching from my sofa João, zero columns after seven pm!" },
      { speakerId: 'joao_nogueira', text: "Smart man, grab an espresso before we dash for the Tube." }
    ]
  },
  {
    id: 'huddle_2f_nafsika_dan_dawn',
    roomId: 'klb_2f',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'nafsika_forte', text: "Dan, how are you functioning since quarter to eight today?" },
      { speakerId: 'daniel_richards', text: "Sheer stubborn Yorkshire grit Nafsika, bedtime by nine sharp." },
      { speakerId: 'nafsika_forte', text: "Respect the curfew, I am guarding Lab 230 till 19:15." }
    ]
  },
  {
    id: 'huddle_2f_archie_calise_ucl',
    roomId: 'klb_2f',
    tag: 'Football Banter',
    turns: [
      { speakerId: 'archie_wall', text: "Calise, catching the Champions League match tonight mate?" },
      { speakerId: 'calise_bahou', text: "Course Archie, straight after demolishing a giant steak pie." },
      { speakerId: 'archie_wall', text: "Save a corner table at the pub if you beat the Central Line." }
    ]
  },
  {
    id: 'huddle_2f_max_nafsika_playlist',
    roomId: 'klb_2f',
    tag: 'Evening Shift',
    turns: [
      { speakerId: 'maximillian_lee', text: "Nafsika, leave Peter's Shire music on or swap to rock?" },
      { speakerId: 'nafsika_forte', text: "Keep the Hobbit flutes Max, keeps evening stress way down!" }
    ]
  },
  {
    id: 'huddle_2f_andre_charlotte_drizzle',
    roomId: 'klb_2f',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Charlotte, horizontal Bloomsbury rain ruin your coat too?" },
      { speakerId: 'charlotte_coomber', text: "Two umbrellas broken this week André, a proper wind tunnel!" }
    ]
  },
  {
    id: 'huddle_2f_faiza_calise_euston',
    roomId: 'klb_2f',
    tag: 'Commute Chaos',
    turns: [
      { speakerId: 'faiza_javaid', text: "Calise, tell me Victoria Line actually moved faster today!" },
      { speakerId: 'calise_bahou', text: "Not a chance Faiza, stalled outside Euston for twenty mins." }
    ]
  },
  {
    id: 'huddle_2f_andre_faiza_poll',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Faiza, should I drop a chaotic WhatsApp poll right now?" },
      { speakerId: 'faiza_javaid', text: "Always yes André, half the lab needs the mid-afternoon laugh!" }
    ]
  },
  {
    id: 'huddle_2f_peter_joao_piri',
    roomId: 'klb_2f',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'joao_nogueira', text: "Have you ever actually survived proper Portuguese piri-piri?" },
      { speakerId: 'peter_szijj', text: "Mate, Hungarian paprika forged me, bring the chillies on!" },
      { speakerId: 'joao_nogueira', text: "Deal, bringing homemade piri-piri oil to lunch tomorrow." }
    ]
  },
  {
    id: 'huddle_2f_max_marcos_gym',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'maximillian_lee', text: "Marcos, fencing footwork tonight or heavy deadlifts?" },
      { speakerId: 'marcos_fernandez', text: "Fencing drills first, then defending my broadsword honour." },
      { speakerId: 'maximillian_lee', text: "Respect, silverback power versus Spanish steel at seven." }
    ]
  },
  {
    id: 'huddle_2f_antoine_marcos_cheese',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'antoine_maruani', text: "Marcos, Spanish Manchego versus French Comté, choose wisely." },
      { speakerId: 'marcos_fernandez', text: "Manchego with crusty bread wins every evening, sorry!" },
      { speakerId: 'antoine_maruani', text: "Wait till I smuggle cave-aged Comté back next Monday." }
    ]
  },
  {
    id: 'huddle_2f_richard_marcos_rain',
    roomId: 'klb_2f',
    tag: 'Commute Chaos',
    turns: [
      { speakerId: 'richard_spears', text: "Marcos, bus gridlock on Gower Street again this morning?" },
      { speakerId: 'marcos_fernandez', text: "Got off two stops early and speed-walked through drizzle." },
      { speakerId: 'richard_spears', text: "Put the kettle on upstairs, that earns an extra biscuit." }
    ]
  },
  {
    id: 'huddle_2f_max_faiza_cake',
    roomId: 'klb_2f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'maximillian_lee', text: "Faiza, tell me there is still leftover chocolate cake up top." },
      { speakerId: 'faiza_javaid', text: "Guard it with your silverback frame, Dan circled twice!" },
      { speakerId: 'maximillian_lee', text: "Saving you the biggest corner slice right by the kettle." }
    ]
  },
  {
    id: 'huddle_2f_archie_nafsika_rotor',
    roomId: 'klb_2f',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'archie_wall', text: "Nafsika, who left the microcentrifuge off-balance by 0.4 g?" },
      { speakerId: 'nafsika_forte', text: "Not Baker group Archie, check the Chudasama bench!" },
      { speakerId: 'archie_wall', text: "Saving that rotor bearing before Jamie hears it rattle." }
    ]
  },
  {
    id: 'huddle_2f_archie_dan_albumin',
    roomId: 'klb_2f',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'archie_wall', text: "Swear human serum albumin foams just from breathing near it." },
      { speakerId: 'daniel_richards', text: "Wait till 40 nm gold turns purple on you mid-pipette." },
      { speakerId: 'archie_wall', text: "Fair, Baker and Chudasama suffering in quiet solidarity." }
    ]
  },
  {
    id: 'huddle_2f_jamie_nafsika_archie_specs',
    roomId: 'klb_2f',
    tag: 'Lab 230 Cross-Group',
    turns: [
      { speakerId: 'jamie_baker', text: "Heard someone drop a spatula, good to see specs firmly on." },
      { speakerId: 'nafsika_forte', text: "Always compliant in Baker bay, zero near-misses today!" },
      { speakerId: 'archie_wall', text: "Even the central balance table is completely spotless today!" }
    ]
  },
  {
    id: 'huddle_2f_jamie_dan_music',
    roomId: 'klb_2f',
    tag: 'Lab 230 Cross-Group',
    turns: [
      { speakerId: 'jamie_baker', text: "Dan, who put Hobbit flute solos back on the lab speakers?" },
      { speakerId: 'daniel_richards', text: "Peter's evening productivity fuel Jamie, keeps him awake." },
      { speakerId: 'jamie_baker', text: "Fair enough, just keep specs on before entering Isengard." }
    ]
  },
  {
    id: 'huddle_2f_tom_marco_oven',
    roomId: 'klb_2f',
    tag: 'Lab 230 Cross-Group',
    turns: [
      { speakerId: 'tom_sheppard', text: "Marco, drying oven stocked with enough round-bottoms today?" },
      { speakerId: 'marco_sabatini', text: "All dry and ready Tom, flame-dried mine twice in this mist." },
      { speakerId: 'tom_sheppard', text: "Splendid, borate ester yields thank you for the diligence." }
    ]
  },
  {
    id: 'huddle_2f_tom_charlotte_tlc',
    roomId: 'klb_2f',
    tag: 'Lab 230 Cross-Group',
    turns: [
      { speakerId: 'charlotte_coomber', text: "Tom, finally got clean spot-to-spot separation on the amide!" },
      { speakerId: 'tom_sheppard', text: "Lovely work Charlotte, saves staring at crude NMR all day." },
      { speakerId: 'charlotte_coomber', text: "Wait till I brag about it at Thursday pub trivia tonight!" }
    ]
  },

  // ==================== 2. KLB 3F WRITE-UP & TEA ROOM (36 HUDDLES) ====================
  {
    id: 'huddle_3f_bettys_yorkshire',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'richard_spears', text: "André, put the kettle on, brought two grades of Bettys tea." },
      { speakerId: 'andre_shamsabadi', text: "Reset the clock, Richard mentioned Yorkshire before eleven." },
      { speakerId: 'richard_spears', text: "Technically Harrogate, André, though I accept the fair cop." }
    ]
  },
  {
    id: 'huddle_3f_bean_plasma',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'richard_spears', text: "Max, microwaved beans only, pans genuinely unsettle me." },
      { speakerId: 'maximillian_lee', text: "Hear me out Rich: chorizo fat reduced into bean plasma." },
      { speakerId: 'daniel_richards', text: "Both of you stop before I call the Northern authorities." }
    ]
  },
  {
    id: 'huddle_3f_posh_biscuits',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'peter_szijj', text: "Richard, could Bettys biscuits bribe journal reviewers?" },
      { speakerId: 'richard_spears', text: "Strictly rationed to one biscuit per clean chromatogram, Peter." },
      { speakerId: 'antoine_maruani', text: "Even after raclette I always have room for Bettys." }
    ]
  },
  {
    id: 'huddle_3f_aoe2_lobby',
    roomId: 'klb_3f',
    tag: 'Gaming Crew',
    turns: [
      { speakerId: 'maximillian_lee', text: "Five pm klaxon just hit, who is booting up Age of Empires?" },
      { speakerId: 'peter_szijj', text: "Ready for my Hungarian hussars again? Look out!" },
      { speakerId: 'antoine_maruani', text: "Say one more word and I wall your berries in." }
    ]
  },
  {
    id: 'huddle_3f_worms_rope',
    roomId: 'klb_3f',
    tag: 'Gaming Crew',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Quick poll: should Antoine's ninja rope be banned under Geneva?" },
      { speakerId: 'maximillian_lee', text: "Hard yes bro, man swings across the map like Tarzan." },
      { speakerId: 'antoine_maruani', text: "Windows 95 Worms Armageddon forged me in total fire." }
    ]
  },
  {
    id: 'huddle_3f_farmville_truce',
    roomId: 'klb_3f',
    tag: 'Gaming Crew',
    turns: [
      { speakerId: 'antoine_maruani', text: "Is Faiza joining AoE tonight or are we warring properly?" },
      { speakerId: 'faiza_javaid', text: "Touch my peaceful windmills and I delete your NanoDrop data!" },
      { speakerId: 'peter_szijj', text: "FarmVille neutral zone agreed, nobody raid the sheep!" }
    ]
  },
  {
    id: 'huddle_3f_ck3_stellaris',
    roomId: 'klb_3f',
    tag: 'Gaming Crew',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Peter, played CK3 and Stellaris till two am, barely alive." },
      { speakerId: 'peter_szijj', text: "Worth it though, our galactic empire crushed the whole map!" },
      { speakerId: 'maximillian_lee', text: "Nerd behaviour, real scholars spam longbowmen until victory." }
    ]
  },
  {
    id: 'huddle_3f_spider_chair',
    roomId: 'klb_3f',
    tag: 'Gaming Crew',
    turns: [
      { speakerId: 'maximillian_lee', text: "Cannot write my report Andrè, a giant spider owns my chair." },
      { speakerId: 'andre_shamsabadi', text: "You weigh a hundred sixty kilos Max, negotiate with it." },
      { speakerId: 'antoine_maruani', text: "Legally the desk belongs to the spider until fair combat." }
    ]
  },
  {
    id: 'huddle_3f_haircut_sync',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'marcos_fernandez', text: "Dan, five of us showed up with matching Monday haircuts." },
      { speakerId: 'daniel_richards', text: "Ah yes, the Chud lab equivalent of a monthly sync." },
      { speakerId: 'marcos_fernandez', text: "Take a Chud out of Chud lab, cannot take Chud lab out of Chud." }
    ]
  },
  {
    id: 'huddle_3f_silmarillion_feanor',
    roomId: 'klb_3f',
    tag: 'Tolkien & Lore',
    turns: [
      { speakerId: 'marcos_fernandez', text: "Peter, sounds like something Fëanor said leaving Valinor." },
      { speakerId: 'peter_szijj', text: "And didn't everything work out wonderfully for him too!" },
      { speakerId: 'andre_shamsabadi', text: "Still cannot believe we have Silmarillion bants before tea." }
    ]
  },
  {
    id: 'huddle_3f_broadsword',
    roomId: 'klb_3f',
    tag: 'Tolkien & Lore',
    turns: [
      { speakerId: 'maximillian_lee', text: "Wait why do both Peter and Marcos actually own swords?" },
      { speakerId: 'peter_szijj', text: "Mine is Tolkien-inspired, never bring less to a gunfight!" },
      { speakerId: 'marcos_fernandez', text: "Mostly for home decor and keeping RiskNET forms away." }
    ]
  },
  {
    id: 'huddle_3f_creaky_30s',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'richard_spears', text: "Calise, early tea and bed before ten tonight, joining?" },
      { speakerId: 'calise_bahou', text: "Sound mate, my knees creak just climbing the KLB stairs." },
      { speakerId: 'daniel_richards', text: "Nine thirty curfew respected, count the old man in." }
    ]
  },
  {
    id: 'huddle_3f_chat_citations',
    roomId: 'klb_3f',
    tag: 'Write-Up Procrastination',
    turns: [
      { speakerId: 'marcos_fernandez', text: "Dan, our group chat gets more reads than half our papers." },
      { speakerId: 'daniel_richards', text: "Higher peer-review standards too, strictly no homo obviously." },
      { speakerId: 'peter_szijj', text: "Back to drafting Supporting Info before Friday catches us!" }
    ]
  },
  {
    id: 'huddle_3f_thesis_clicker',
    roomId: 'klb_3f',
    tag: 'Write-Up Procrastination',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Nafsika, hunting my laser clicker instead of writing up." },
      { speakerId: 'nafsika_forte', text: "Check behind the tea caddy, spotted it ten minutes ago!" },
      { speakerId: 'archie_wall', text: "Grab a biscuit while up here, tin is nearly empty." }
    ]
  },
  {
    id: 'huddle_3f_slides_etoac',
    roomId: 'klb_3f',
    tag: 'Write-Up Procrastination',
    turns: [
      { speakerId: 'daniel_richards', text: "Are four real figures actually ready for Friday audit yet?" },
      { speakerId: 'richard_spears', text: "Yes, and remember to disclose trace EtOAc honestly on Slide 4." },
      { speakerId: 'maximillian_lee', text: "Still negotiating desk custody with the Bloomsbury spider." }
    ]
  },
  {
    id: 'huddle_3f_croissant_microwave',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'antoine_maruani', text: "Calise, someone microwaved a ham and cheese croissant here." },
      { speakerId: 'calise_bahou', text: "Elite scran mate, washes down nicely with a Dr Pepper." },
      { speakerId: 'daniel_richards', text: "Antoine is dialling the French ambassador as we speak." }
    ]
  },
  {
    id: 'huddle_3f_richard_business_class',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'antoine_maruani', text: "Richard, got moved up to train business class in France!" },
      { speakerId: 'richard_spears', text: "Delighted for you. I flew business class to Australia once." },
      { speakerId: 'daniel_richards', text: "Of course you did, Richard. Bettys biscuits at 38,000 feet." }
    ]
  },
  {
    id: 'huddle_3f_buttered_toast_reviewer2',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'antoine_maruani', text: "Reviewer 2 just rejected my manuscript for total nonsense." },
      { speakerId: 'richard_spears', text: "Like buttering toast on the wrong side and blaming gravity." },
      { speakerId: 'daniel_richards', text: "Drop the toast upside down, still cleaner than Reviewer 2." }
    ]
  },
  {
    id: 'huddle_3f_group_breakfast_clickbait',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'maximillian_lee', text: "Did anyone else click that Group Breakfast YouTube link?" },
      { speakerId: 'antoine_maruani', text: "Classic clickbait prank, thought we actually booked pancakes." },
      { speakerId: 'joao_nogueira', text: "Heartless tease bro, my stomach was ready for real breakfast!" }
    ]
  },
  {
    id: 'huddle_3f_eurostar_cheese_bread',
    roomId: 'klb_3f',
    tag: 'Commute Chaos',
    turns: [
      { speakerId: 'antoine_maruani', text: "Peter, Eurostar stuck in Kent, only got cheese and bread!" },
      { speakerId: 'peter_szijj', text: "Honestly sounds like a luxury picnic compared to Tube delays!" },
      { speakerId: 'antoine_maruani', text: "Not when you run out of Comté two hours outside Folkestone." }
    ]
  },
  {
    id: 'huddle_3f_amazon_charger_sennheiser',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'daniel_richards', text: "Antoine, my Amazon laptop charger vanished the day yours died." },
      { speakerId: 'antoine_maruani', text: "Suspicious coincidence, same week your Sennheisers disappeared." },
      { speakerId: 'daniel_richards', text: "Not saying #Hackerman borrowed them, just checking your bag." }
    ]
  },
  {
    id: 'huddle_3f_prime_day_800_whey',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'maximillian_lee', text: "Antoine, accidentally spent eight hundred quid on Prime Day!" },
      { speakerId: 'antoine_maruani', text: "Please tell me half of it was giant tubs of whey protein." },
      { speakerId: 'maximillian_lee', text: "Five kilos of vanilla whey plus a kettlebell, sheer gains!" }
    ]
  },
  {
    id: 'huddle_3f_fortnum_vs_bettys_tea',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'richard_spears', text: "Someone slipped Fortnum tea bags right next to my Bettys tin." },
      { speakerId: 'daniel_richards', text: "Luxury tea arms race on 3F, Yorkshire gold watches in silence." },
      { speakerId: 'faiza_javaid', text: "Pass me whichever tin comes with fancy shortbread!" }
    ]
  },
  {
    id: 'huddle_3f_low_dopamine_dolphin',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Tried that two-hour low-dopamine bedtime routine last night." },
      { speakerId: 'richard_spears', text: "Two hours winding down? Peak Low Dopamine Dolphin energy." },
      { speakerId: 'maximillian_lee', text: "I just stare at my ceiling for five minutes and black out." }
    ]
  },
  {
    id: 'huddle_3f_101_dalmatians_christmas',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Unpopular opinion: 101 Dalmatians is peak Christmas heist." },
      { speakerId: 'joao_nogueira', text: "Die Hard and Home Alone exist mate, wait what?! Dalmatians?!" },
      { speakerId: 'daniel_richards', text: "Snowy London streets, spotted puppies, unbeatable festive plot." }
    ]
  },
  {
    id: 'huddle_3f_agnes_twilight_imperium',
    roomId: 'klb_3f',
    tag: 'Gaming Crew',
    turns: [
      { speakerId: 'antoine_maruani', text: "Peter, Agnès still has trauma from twelve-hour Twilight Imperium." },
      { speakerId: 'peter_szijj', text: "Twelve hours just for space taxes and betrayal at hour eleven!" },
      { speakerId: 'antoine_maruani', text: "Never invite her to another weekend board game marathon." }
    ]
  },
  {
    id: 'huddle_3f_faiza_richard_biscuits',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'faiza_javaid', text: "Richard, sneaking one posh Bettys biscuit or two today?" },
      { speakerId: 'richard_spears', text: "Two today Faiza, Euston trains alone earn danger rations." },
      { speakerId: 'faiza_javaid', text: "Best lab rule on 3F, saving the chocolate ones now!" }
    ]
  },
  {
    id: 'huddle_3f_peter_marcos_broadsword',
    roomId: 'klb_3f',
    tag: 'Tolkien & Lore',
    turns: [
      { speakerId: 'peter_szijj', text: "Marcos, still polishing that home broadsword or reading?" },
      { speakerId: 'marcos_fernandez', text: "Rereading Silmarillion tonight Peter, Fëanor chaos awaits." },
      { speakerId: 'peter_szijj', text: "Keep Gondolin music queued up, beats Bloomsbury drizzle!" }
    ]
  },
  {
    id: 'huddle_3f_richard_marcos_tea',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'richard_spears', text: "Marcos, fancy a quiet mug of tea before heading out?" },
      { speakerId: 'marcos_fernandez', text: "Yes please Richard, my bus took forty mins from Euston." },
      { speakerId: 'richard_spears', text: "Kettle just boiled, emergency shortbread on the top shelf." }
    ]
  },
  {
    id: 'huddle_3f_archie_peter_biscuits',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'archie_wall', text: "Peter, did someone clear out the 3F biscuit tin already?" },
      { speakerId: 'peter_szijj', text: "Check behind Richard's mug Archie, emergency stash stays safe!" }
    ]
  },
  {
    id: 'huddle_3f_antoine_calise_drpepper',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'antoine_maruani', text: "Calise, hide that can of Dr Pepper before I scream." },
      { speakerId: 'calise_bahou', text: "Finest cherry-flavoured fuel in London mate, try a sip!" }
    ]
  },
  {
    id: 'huddle_3f_peter_joao_music',
    roomId: 'klb_3f',
    tag: 'Evening Shift',
    turns: [
      { speakerId: 'joao_nogueira', text: "Peter, still blasting Howard Shore upstairs after six tonight?" },
      { speakerId: 'peter_szijj', text: "Only way to survive late runs, join me at the speakers!" },
      { speakerId: 'joao_nogueira', text: "Swap one track for Portuguese indie rock and it's a deal." }
    ]
  },
  {
    id: 'huddle_3f_max_marcos_tolkien',
    roomId: 'klb_3f',
    tag: 'Tolkien & Lore',
    turns: [
      { speakerId: 'marcos_fernandez', text: "Anyone else feel like Sauron wrote UCL's RiskNET portal?" },
      { speakerId: 'maximillian_lee', text: "Even Mordor had fewer pop-up boxes than RiskNET bro." },
      { speakerId: 'marcos_fernandez', text: "One does not simply click Save without three crashes." }
    ]
  },
  {
    id: 'huddle_3f_joao_richard_kettle',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'richard_spears', text: "João, Yorkshire gold or sneaking an espresso down the road?" },
      { speakerId: 'joao_nogueira', text: "Always espresso Richard, though your posh biscuits tempt me." },
      { speakerId: 'richard_spears', text: "Help yourself to a dark chocolate one, don't tell Dan." }
    ]
  },
  {
    id: 'huddle_3f_richard_marcos_quiet',
    roomId: 'klb_3f',
    tag: 'Kettle & Tea',
    turns: [
      { speakerId: 'marcos_fernandez', text: "Quiet evening on the third floor, rare peace before Friday." },
      { speakerId: 'richard_spears', text: "Best hour of the day, tea steeped and zero group stickers." },
      { speakerId: 'marcos_fernandez', text: "Do not speak too soon, someone will unmute the chat." }
    ]
  },
  {
    id: 'huddle_3f_archie_max_bench',
    roomId: 'klb_3f',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'maximillian_lee', text: "Archie, still pretending you didn't finish the custard creams?" },
      { speakerId: 'archie_wall', text: "Check Richard's emergency tin Max, my hands are spotless." },
      { speakerId: 'maximillian_lee', text: "Sure mate, crumbs on your Baker lab coat say otherwise." }
    ]
  },

  // ==================== 3. GORDON'S CAFE (42 HUDDLES) ====================
  // --- Coffee Quartet / Lunch Hours ---
  {
    id: 'huddle_cafe_joao_abolish_deals',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'joao_nogueira', text: "Meal deals and zero percent yoghurt must be abolished at once!" },
      { speakerId: 'calise_bahou', text: "Mate, meal deals give you almost infinite sandwich choice." },
      { speakerId: 'daniel_richards', text: "Food is fuel lads, warm toastie wins every single time." }
    ]
  },
  {
    id: 'huddle_cafe_joao_bacalhau',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'joao_nogueira', text: "Brought warm pastéis de nata and bacalhau down to the table!" },
      { speakerId: 'faiza_javaid', text: "Say less irmão, saving myself a pastel right now!" },
      { speakerId: 'antoine_maruani', text: "Finally, real pastry inside a British university building." }
    ]
  },
  {
    id: 'huddle_cafe_football_manager',
    roomId: 'gordons_cafe',
    tag: 'Coffee Quartet',
    turns: [
      { speakerId: 'vijay_chudasama', text: "João, double espresso needed, my FM squad just collapsed!" },
      { speakerId: 'joao_nogueira', text: "Buy a Portuguese playmaker boss, solves every problem instantly!" },
      { speakerId: 'faiza_javaid', text: "Still pretending I understand what a playmaker actually does." }
    ]
  },
  {
    id: 'huddle_cafe_panini_purism',
    roomId: 'gordons_cafe',
    tag: 'Coffee Quartet',
    turns: [
      { speakerId: 'joao_nogueira', text: "Promise nobody at this table buys cold triangle sandwiches." },
      { speakerId: 'nafsika_forte', text: "Relax, we ordered warm paninis like civilised Europeans." },
      { speakerId: 'vijay_chudasama', text: "Good call, cold soggy bread is suboptimal, one word." }
    ]
  },
  {
    id: 'huddle_cafe_get_well_card',
    roomId: 'gordons_cafe',
    tag: 'Coffee Quartet',
    turns: [
      { speakerId: 'vijay_chudasama', text: "Still haven't forgotten what Faiza wrote on my get-well card." },
      { speakerId: 'faiza_javaid', text: "Peak artistic expression boss, honestly it brought great morale!" },
      { speakerId: 'joao_nogueira', text: "Nafsika and I nearly choked on our espressos reading it!" }
    ]
  },
  {
    id: 'huddle_cafe_faiza_cake_pic',
    roomId: 'gordons_cafe',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'faiza_javaid', text: "No nonsense today, only thick dark chocolate cake!" },
      { speakerId: 'antoine_maruani', text: "Close-up dessert photos at ten am belong in a gallery." },
      { speakerId: 'joao_nogueira', text: "Chantilli on top! Have a rippa afternoon everyone!" }
    ]
  },

  // --- Non-Quartet Cafe Huddles ---
  {
    id: 'huddle_cafe_calise_stolen_bike',
    roomId: 'gordons_cafe',
    tag: 'Calise Lore',
    turns: [
      { speakerId: 'calise_bahou', text: "Peter, haggled down from 75 to 60 for a stolen bike!" },
      { speakerId: 'peter_szijj', text: "Wait Calise, could you get into trouble riding a stolen bike?" },
      { speakerId: 'calise_bahou', text: "Avoided death in the deal mate, victimless crime really." }
    ]
  },
  {
    id: 'huddle_cafe_calise_souvlaki',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'calise_bahou', text: "Richard, only so much souvlaki before missing meal deals." },
      { speakerId: 'richard_spears', text: "Give me Cyprus bakery halloumi pies over cold bread any day." },
      { speakerId: 'andre_shamsabadi', text: "Please stop praising soggy triangle sandwiches in public." }
    ]
  },
  {
    id: 'huddle_cafe_antoine_croissant_god',
    roomId: 'gordons_cafe',
    tag: 'French Outrage',
    turns: [
      { speakerId: 'antoine_maruani', text: "Calise, I am God and never made a ham and cheese croissant." },
      { speakerId: 'calise_bahou', text: "Tastes pretty godly warmed up beside an espresso mate." },
      { speakerId: 'daniel_richards', text: "End of discussion, Antoine has formally left the table." }
    ]
  },
  {
    id: 'huddle_cafe_antoine_giraffe',
    roomId: 'gordons_cafe',
    tag: 'French Outrage',
    turns: [
      { speakerId: 'antoine_maruani', text: "Peter, British giraffe bread is the worst thing on earth." },
      { speakerId: 'peter_szijj', text: "Try Hungarian sóskifli instead, proper baked perfection!" },
      { speakerId: 'maximillian_lee', text: "Wait till you see me fry bacon in a buttered tiger roll." }
    ]
  },
  {
    id: 'huddle_cafe_peter_nuggets',
    roomId: 'gordons_cafe',
    tag: 'Takeaway Tragedy',
    turns: [
      { speakerId: 'peter_szijj', text: "André, ordered twenty nuggets and got only one large fries!" },
      { speakerId: 'andre_shamsabadi', text: "Seriously? That is genuinely heartbreaking news, Peter." },
      { speakerId: 'calise_bahou', text: "Only noticed back in Clapham as well, sheer pain mate." }
    ]
  },
  {
    id: 'huddle_cafe_dan_egg_cress',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'daniel_richards', text: "Max, egg and cress sandwich and tea, four fifty, sorted." },
      { speakerId: 'maximillian_lee', text: "Victorian workhouse rations while Gordon's sells focaccia." },
      { speakerId: 'daniel_richards', text: "Zero surprises, zero heartburn, back upstairs by twelve thirty." }
    ]
  },
  {
    id: 'huddle_cafe_sabatini_coffee',
    roomId: 'gordons_cafe',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'marco_sabatini', text: "Charlotte, British instant coffee is a crime on the soul." },
      { speakerId: 'charlotte_coomber', text: "Wait until you try Gordon's almond croissants, lifesaver!" },
      { speakerId: 'richard_spears', text: "Quiet pot of proper leaf tea suits me down to the ground." }
    ]
  },
  {
    id: 'huddle_cafe_andre_poll',
    roomId: 'gordons_cafe',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Quick poll: second espresso or suffer back in Lab 230?" },
      { speakerId: 'daniel_richards', text: "We faff for ten minutes, then end up ordering anyway." },
      { speakerId: 'maximillian_lee', text: "Get me a pain au chocolat while you are up there pal." }
    ]
  },
  {
    id: 'huddle_cafe_andre_yugoslavia',
    roomId: 'gordons_cafe',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'calise_bahou', text: "André, borrowing my dad's tux for the ball, grey suit out." },
      { speakerId: 'andre_shamsabadi', text: "Mate, my tux was genuinely manufactured in Yugoslavia." },
      { speakerId: 'marcos_fernandez', text: "Wait, that might actually be older than Cupboard 19." }
    ]
  },
  {
    id: 'huddle_cafe_charlotte_trivia',
    roomId: 'gordons_cafe',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'charlotte_coomber', text: "Still need two more players for Thursday pub trivia!" },
      { speakerId: 'peter_szijj', text: "Count me in for all Lord of the Rings and history rounds!" },
      { speakerId: 'daniel_richards', text: "Only if there is a round on Pool Frog swimming badges." }
    ]
  },
  {
    id: 'huddle_cafe_richard_flatbed',
    roomId: 'gordons_cafe',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'peter_szijj', text: "Richard, still cannot picture a chemist in a flatbed seat!" },
      { speakerId: 'richard_spears', text: "Proper tea in porcelain mid-flight changes a man, honestly." },
      { speakerId: 'maximillian_lee', text: "Cartoon bear eating smoked salmon in pyjamas above Singapore." }
    ]
  },
  {
    id: 'huddle_fr_cafe_croissant',
    roomId: 'gordons_cafe',
    tag: 'French Coffee Banter',
    turns: [
      { speakerId: 'antoine_maruani', text: "Un croissant coupé en deux avec du fromage, c'est légal?" },
      { speakerId: 'marco_sabatini', text: "En France non, à Londres ils appellent ça un petit déjeuner." },
      { speakerId: 'antoine_maruani', text: "Je garde ma baguette et mon espresso, merci bien." }
    ]
  },
  {
    id: 'huddle_fr_cafe_pause',
    roomId: 'gordons_cafe',
    tag: 'French Coffee Banter',
    turns: [
      { speakerId: 'marco_sabatini', text: "Antoine, un double espresso avant de retourner aux hottes?" },
      { speakerId: 'antoine_maruani', text: "Obligé, sinon je fais encore du TCEP à l'œil." },
      { speakerId: 'marco_sabatini', text: "Allez, santé frérot, on finit cette manip avant ce soir." }
    ]
  },
  {
    id: 'huddle_cafe_lidl_kayak_croissant',
    roomId: 'gordons_cafe',
    tag: 'French Outrage',
    turns: [
      { speakerId: 'daniel_richards', text: "Heads up: Lidl is actually selling an inflatable kayak today!" },
      { speakerId: 'antoine_maruani', text: "Forget kayaks while ham-and-cheese croissants walk free here." },
      { speakerId: 'peter_szijj', text: "Paddle down the Regent's Canal eating warm pastry, elite!" }
    ]
  },
  {
    id: 'huddle_cafe_meal_deal_vs_souvlaki',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'joao_nogueira', text: "Steak pie and proper souvlaki crush every sad meal deal!" },
      { speakerId: 'calise_bahou', text: "Steak and ale pie elite mate, though meal deals save fivers." },
      { speakerId: 'daniel_richards', text: "Cypriot souvlaki wins Sunday, egg and cress wins Tuesday." }
    ]
  },
  {
    id: 'huddle_cafe_unesco_baguette_bun',
    roomId: 'gordons_cafe',
    tag: 'French Outrage',
    turns: [
      { speakerId: 'antoine_maruani', text: "Max, UNESCO finally crowned the French baguette as heritage!" },
      { speakerId: 'maximillian_lee', text: "Cute loaf bro, still bows to the noble British iced bun." },
      { speakerId: 'antoine_maruani', text: "One more insult and I ban croissants from your desk." }
    ]
  },
  {
    id: 'huddle_cafe_mcdonalds_reflux',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'calise_bahou', text: "Anyone fancy a quick McDonald's hash brown run right now?" },
      { speakerId: 'andre_shamsabadi', text: "Instant acid reflux in paper wrapping, pass with extreme speed." },
      { speakerId: 'faiza_javaid', text: "Save your stomach, grab a real pastry at Gordon's instead." }
    ]
  },
  {
    id: 'huddle_cafe_accidental_tofu_pringles',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'calise_bahou', text: "Thought I bought roast chicken, turns out it is plain tofu." },
      { speakerId: 'faiza_javaid', text: "Classic blind buy, still eating post-gym Pringles too?" },
      { speakerId: 'peter_szijj', text: "Pringles count as post-workout carbs, peak sports science!" }
    ]
  },
  {
    id: 'huddle_cafe_barbara_bolton_penalties',
    roomId: 'gordons_cafe',
    tag: 'Football Banter',
    turns: [
      { speakerId: 'daniel_richards', text: "Reckon Barbara from Bolton could step up and take penalties?" },
      { speakerId: 'andre_shamsabadi', text: "Barbara bangs it top bins past half the Premier League!" },
      { speakerId: 'maximillian_lee', text: "Sign Barbara immediately, better composure than England lads." }
    ]
  },
  {
    id: 'huddle_cafe_calise_richard_halloumi',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'calise_bahou', text: "Richard, sneaking a halloumi wrap or sticking to leaf tea?" },
      { speakerId: 'richard_spears', text: "Halloumi always tempts me Calise, though tea wins at three." },
      { speakerId: 'calise_bahou', text: "Balanced nutrition mate, pastries count as carbs anyway." }
    ]
  },
  {
    id: 'huddle_cafe_joao_richard_nata',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'joao_nogueira', text: "Richard, admit warm pastel de nata beats every cold scone." },
      { speakerId: 'richard_spears', text: "Warm custard wins João, though Yorkshire tea fights hard." },
      { speakerId: 'joao_nogueira', text: "Deal: Portuguese pastry plus your posh kettle upstairs!" }
    ]
  },
  {
    id: 'huddle_cafe_charlotte_faiza_trivia',
    roomId: 'gordons_cafe',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'charlotte_coomber', text: "Faiza, joining Thursday department pub trivia with us?" },
      { speakerId: 'faiza_javaid', text: "Only if there is a cake round and zero football questions!" },
      { speakerId: 'charlotte_coomber', text: "Deal! Saving you the comfiest booth and an oat latte." }
    ]
  },
  {
    id: 'huddle_cafe_dan_joao_pastry',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'daniel_richards', text: "João, sneaking a second pastel de nata before heading up?" },
      { speakerId: 'joao_nogueira', text: "Strict two-pastry minimum today Dan, morale calls for it." }
    ]
  },
  {
    id: 'huddle_cafe_marco_dan_espresso',
    roomId: 'gordons_cafe',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'marco_sabatini', text: "Dan, how do British kettles survive without espresso?" },
      { speakerId: 'daniel_richards', text: "Instant builders tea built an empire Marco, stay calm." }
    ]
  },
  {
    id: 'huddle_cafe_vijay_dan_golf',
    roomId: 'gordons_cafe',
    tag: 'Coffee Quartet',
    turns: [
      { speakerId: 'vijay_chudasama', text: "Dan, weather looks dry for golf Sunday, fancy nine holes?" },
      { speakerId: 'daniel_richards', text: "As long as we tee off early boss, strict evening curfew!" }
    ]
  },
  {
    id: 'huddle_cafe_nafsika_marco_sun',
    roomId: 'gordons_cafe',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'nafsika_forte', text: "Marco, missing Mediterranean sunshine in this drizzle yet?" },
      { speakerId: 'marco_sabatini', text: "Every single morning Nafsika, only espresso keeps me alive!" }
    ]
  },
  {
    id: 'huddle_cafe_peter_joao_nata',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'peter_szijj', text: "João, tell me Gordon's actually still has pastéis de nata." },
      { speakerId: 'joao_nogueira', text: "Warm out of the tray five minutes ago, grab two fast!" },
      { speakerId: 'peter_szijj', text: "That officially beats twenty nuggets on a rough Thursday." }
    ]
  },
  {
    id: 'huddle_cafe_antoine_marcos_coffee',
    roomId: 'gordons_cafe',
    tag: 'Commute Chaos',
    turns: [
      { speakerId: 'marcos_fernandez', text: "Antoine, walked from Euston again because the Tube died." },
      { speakerId: 'antoine_maruani', text: "Still beats waiting forty minutes on a rainy Eurostar." },
      { speakerId: 'marcos_fernandez', text: "True, Gordon's double espresso rescues both of us today." }
    ]
  },
  {
    id: 'huddle_cafe_joao_richard_weather',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'joao_nogueira', text: "How do you survive horizontal London drizzle without crying?" },
      { speakerId: 'richard_spears', text: "Born in Yorkshire João, this counts as mild spring mist." },
      { speakerId: 'joao_nogueira', text: "Madness, give me Lisbon sunshine and warm custard tarts!" }
    ]
  },
  {
    id: 'huddle_cafe_max_faiza_aoe',
    roomId: 'gordons_cafe',
    tag: 'Gaming Crew',
    turns: [
      { speakerId: 'faiza_javaid', text: "Max, promise not to send trebuchets at my AoE2 windmills." },
      { speakerId: 'maximillian_lee', text: "Only if you leave my gold mines alone during tea breaks!" },
      { speakerId: 'faiza_javaid', text: "Deal, peaceful berry picking and Gordon's brownies today." }
    ]
  },
  {
    id: 'huddle_cafe_andre_joao_lunch',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "João, warm panini downstairs or testing our luck on 3F?" },
      { speakerId: 'joao_nogueira', text: "Always warm panini André, never chilled supermarket plastic!" },
      { speakerId: 'andre_shamsabadi', text: "Lead the way coffee captain, my stomach agrees completely." }
    ]
  },
  {
    id: 'huddle_cafe_joao_marcos_pastry',
    roomId: 'gordons_cafe',
    tag: 'Gordon Food Wars',
    turns: [
      { speakerId: 'marcos_fernandez', text: "Two espressos down and it is not even eleven o'clock yet." },
      { speakerId: 'joao_nogueira', text: "That is standard Iberian pacing Marcos, keep going!" }
    ]
  },
  {
    id: 'huddle_cafe_archie_joao_football',
    roomId: 'gordons_cafe',
    tag: 'Football Banter',
    turns: [
      { speakerId: 'archie_wall', text: "João, Champions League knockout round tonight, fancy our odds?" },
      { speakerId: 'joao_nogueira', text: "Always back Portuguese flair under floodlights Archie!" },
      { speakerId: 'archie_wall', text: "Grabbing an espresso first so I stay awake past nine." }
    ]
  },
  {
    id: 'huddle_cafe_jamie_nafsika_coffee',
    roomId: 'gordons_cafe',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'jamie_baker', text: "Nafsika, flat white queue finally shorter than Gower Street?" },
      { speakerId: 'nafsika_forte', text: "Just beat the afternoon rush Jamie, pastry tray looks good." },
      { speakerId: 'jamie_baker', text: "Marvellous, straight back up before Spurs break my heart." }
    ]
  },
  {
    id: 'huddle_cafe_tom_marco_charlotte',
    roomId: 'gordons_cafe',
    tag: 'Lab Neighbours',
    turns: [
      { speakerId: 'tom_sheppard', text: "Feels like half of KLB migrated down to Gordon's Café today." },
      { speakerId: 'charlotte_coomber', text: "Escape from admin emails and warm pastries, unbeatable!" },
      { speakerId: 'marco_sabatini', text: "And real espresso downstairs, a small mercy in London rain." }
    ]
  },
  {
    id: 'huddle_cafe_dan_faiza_cake',
    roomId: 'gordons_cafe',
    tag: 'Big-Chuds Banter',
    turns: [
      { speakerId: 'daniel_richards', text: "Did someone finish the entire chocolate cake upstairs already?" },
      { speakerId: 'faiza_javaid', text: "Look innocent Dan, saw you lurking by the kettle twice!" },
      { speakerId: 'daniel_richards', text: "Strictly checking the structural integrity of the icing." }
    ]
  },

  // ==================== 4. MEETING ROOM (8 HUDDLES) ====================
  {
    id: 'huddle_meeting_andre_clicker',
    roomId: 'meeting_room',
    tag: 'Friday Audit',
    turns: [
      { speakerId: 'andre_shamsabadi', text: "Left my clicker upstairs and Vijay is already walking in!" },
      { speakerId: 'calise_bahou', text: "Spacebar works fine mate, relax before you melt!" },
      { speakerId: 'daniel_richards', text: "Nothing says calm authority like sprinting before Slide 1." }
    ]
  },
  {
    id: 'huddle_meeting_richard_soluble',
    roomId: 'meeting_room',
    tag: 'Friday Audit',
    turns: [
      { speakerId: 'vijay_chudasama', text: "Richard, how did the aryl-PD kinetic solubility test look?" },
      { speakerId: 'richard_spears', text: "Played Soluble or Not Soluble this week: spoiler, lost." },
      { speakerId: 'daniel_richards', text: "Ninety-nine percent yield plus some mystery white powder." }
    ]
  },
  {
    id: 'huddle_meeting_antoine_three_slides',
    roomId: 'meeting_room',
    tag: 'Friday Audit',
    turns: [
      { speakerId: 'antoine_maruani', text: "André, think I only have three real data slides ready." },
      { speakerId: 'andre_shamsabadi', text: "Hold on, is that including title and acknowledgements?" },
      { speakerId: 'daniel_richards', text: "Uh oh, four with title, time to talk slowly, vieux." }
    ]
  },
  {
    id: 'huddle_meeting_vijay_homogeneity',
    roomId: 'meeting_room',
    tag: 'Friday Audit',
    turns: [
      { speakerId: 'vijay_chudasama', text: "Calise, where is the unreduced control for that 95% HHLL?" },
      { speakerId: 'calise_bahou', text: "Right on Slide 4 boss, kneeling at four degrees paid off!" },
      { speakerId: 'daniel_richards', text: "Clean Q-TOF envelope too, barely any free half-antibody." }
    ]
  },
  {
    id: 'huddle_meeting_dan_suboptimal',
    roomId: 'meeting_room',
    tag: 'Friday Audit',
    turns: [
      { speakerId: 'daniel_richards', text: "Vijay, four plain white slides, straight into the spectra." },
      { speakerId: 'vijay_chudasama', text: "Missing an HRMS label on Slide 2 is suboptimal, one word." },
      { speakerId: 'maximillian_lee', text: "Even Dan gets the one-word verdict, nobody is safe!" }
    ]
  },
  {
    id: 'huddle_meeting_peter_gel_excuse',
    roomId: 'meeting_room',
    tag: 'Friday Audit',
    turns: [
      { speakerId: 'peter_szijj', text: "Faiza, praying Vijay skips the wonky edge of my SynAb gel!" },
      { speakerId: 'faiza_javaid', text: "Just call it dynamic band diffusion and click next slide!" },
      { speakerId: 'richard_spears', text: "Own the bands honestly Peter, Vijay always respects rigor." }
    ]
  },
  {
    id: 'huddle_meeting_marcos_coumarin',
    roomId: 'meeting_room',
    tag: 'Friday Audit',
    turns: [
      { speakerId: 'marcos_fernandez', text: "Vijay, coumarin SMDC stays dark in HSA, lights up in GSH." },
      { speakerId: 'vijay_chudasama', text: "Good momentum! Make sure the selectivity controls stay crisp." },
      { speakerId: 'joao_nogueira', text: "Taking notes for my PLGA nanoparticle release assay too!" }
    ]
  },
  {
    id: 'huddle_meeting_faiza_a280_deck',
    roomId: 'meeting_room',
    tag: 'Friday Audit',
    turns: [
      { speakerId: 'vijay_chudasama', text: "Compare those HIC traces to Faiza's clean PAR 4.0 deck." },
      { speakerId: 'maximillian_lee', text: "Nobody uses mass spec anymore boss, flame tests only!" },
      { speakerId: 'daniel_richards', text: "Please mute the back row before Slide 3 starts." }
    ]
  }
];

// ============================================================================
// WEEKLY SIGNATURE CONVERSATIONS (10 ~1x/Week Canon Moments)
// ============================================================================
window.KLB.WEEKLY_SIGNATURE_CONVERSATIONS = [
  {
    id: 'sig_dan_andre_date',
    weeklyKey: 'dan_andre_date',
    roomIds: ['klb_2f', 'klb_3f', 'gordons_cafe'],
    participants: ['daniel_richards', 'andre_shamsabadi'],
    requiredIds: ['daniel_richards', 'andre_shamsabadi'],
    minPresent: 2,
    variants: [
      [
        { speakerId: 'daniel_richards', text: "Sharp waistcoat today André, got a #DreDate this evening?" },
        { speakerId: 'andre_shamsabadi', text: "Relax Dan, optimizing brackets does not mean a secret date!" },
        { speakerId: 'daniel_richards', text: "Right, the fancy coat only appears on date nights, admit it." }
      ],
      [
        { speakerId: 'daniel_richards', text: "André, looking awfully sharp today, hot date right after lab?" },
        { speakerId: 'andre_shamsabadi', text: "Just a nice coat Dan, stop yelling #DreDate across the bench!" },
        { speakerId: 'daniel_richards', text: "Tell that to your ironed collar mate, have a good evening!" }
      ]
    ]
  },
  {
    id: 'sig_calise_fasting',
    weeklyKey: 'calise_fasting',
    roomIds: ['klb_2f', 'klb_3f', 'gordons_cafe'],
    participants: ['calise_bahou', 'daniel_richards', 'maximillian_lee', 'andre_shamsabadi'],
    requiredIds: ['calise_bahou'],
    minPresent: 2,
    variants: [
      [
        { speakerId: 'calise_bahou', text: "Dan, reckon I might start intermittent fasting next week mate." },
        { speakerId: 'daniel_richards', text: "Lasted four hours before you bought a sausage roll last time." },
        { speakerId: 'calise_bahou', text: "Sixteen-eight easy this round, no lunch till noon, watch me." }
      ],
      [
        { speakerId: 'calise_bahou', text: "Max, genuinely thinking of starting intermittent fasting soon." },
        { speakerId: 'maximillian_lee', text: "Skipping breakfast while smelling steak pies? Brave lad Calise." },
        { speakerId: 'calise_bahou', text: "Black coffee only till twelve, shredded silverback season soon." }
      ],
      [
        { speakerId: 'calise_bahou', text: "André, seriously considering intermittent fasting from Monday." },
        { speakerId: 'andre_shamsabadi', text: "You demolished two Gordon's paninis an hour ago, Calise." },
        { speakerId: 'calise_bahou', text: "That was pre-fasting prep mate, hydration and discipline next!" }
      ]
    ]
  },
  {
    id: 'sig_dan_antoine_vodka',
    weeklyKey: 'dan_antoine_vodka',
    roomIds: ['klb_2f', 'klb_3f', 'gordons_cafe'],
    participants: ['daniel_richards', 'antoine_maruani'],
    requiredIds: ['daniel_richards', 'antoine_maruani'],
    minPresent: 2,
    variants: [
      [
        { speakerId: 'daniel_richards', text: "Antoine, have you seen that Polish vodka bottle anywhere?" },
        { speakerId: 'antoine_maruani', text: "Still stashed away, the Caprice des Dieux of vodka, mon gars." },
        { speakerId: 'daniel_richards', text: "Polish wedding bottles hit different, guard it with your life." }
      ],
      [
        { speakerId: 'antoine_maruani', text: "Dan, have you seen the Polish wedding vodka I brought back?" },
        { speakerId: 'daniel_richards', text: "Last saw that Caprice des Dieux bottle safely tucked upstairs." },
        { speakerId: 'antoine_maruani', text: "Bon, nobody drinks my Polish wedding reserve without #Dantoine!" }
      ]
    ]
  },
  {
    id: 'sig_andre_peter_games',
    weeklyKey: 'andre_peter_games',
    roomIds: ['klb_2f', 'klb_3f', 'gordons_cafe'],
    participants: ['andre_shamsabadi', 'peter_szijj'],
    requiredIds: ['andre_shamsabadi', 'peter_szijj'],
    minPresent: 2,
    variants: [
      [
        { speakerId: 'andre_shamsabadi', text: "Peter, what video games are eating your evenings right now?" },
        { speakerId: 'peter_szijj', text: "Still hooked on Hearts of Iron IV and Stellaris till two am!" },
        { speakerId: 'andre_shamsabadi', text: "Respect, been grinding CK3 dynastic chaos and Valorant all week." }
      ],
      [
        { speakerId: 'peter_szijj', text: "André, what video games are you playing after lab this week?" },
        { speakerId: 'andre_shamsabadi', text: "Deep into a Stellaris campaign and way too much Valorant lately." },
        { speakerId: 'peter_szijj', text: "Send a lobby invite tonight, my CK3 empire can wait till Friday!" }
      ]
    ]
  },
  {
    id: 'sig_max_richard_york',
    weeklyKey: 'max_richard_york',
    roomIds: ['klb_2f', 'klb_3f', 'gordons_cafe'],
    participants: ['maximillian_lee', 'richard_spears'],
    requiredIds: ['maximillian_lee', 'richard_spears'],
    minPresent: 2,
    variants: [
      [
        { speakerId: 'maximillian_lee', text: "Richard, miss our old York undergrad days or just Bettys tea?" },
        { speakerId: 'richard_spears', text: "Bettys fat rascals first, then Martin Fascione lab nostalgia!" },
        { speakerId: 'maximillian_lee', text: "Baby Max and baby Richard surviving Heslington winter like kings." }
      ],
      [
        { speakerId: 'richard_spears', text: "Max, do you remember our first-year York undergrad labs at all?" },
        { speakerId: 'maximillian_lee', text: "Baby Richard and baby Max terrorising Martin Fascione's bay!" },
        { speakerId: 'richard_spears', text: "Simple times, decent York tea and zero Friday slide audits." }
      ]
    ]
  },
  {
    id: 'sig_andre_antoine_ramen',
    weeklyKey: 'andre_antoine_ramen',
    roomIds: ['klb_2f', 'klb_3f', 'gordons_cafe'],
    participants: ['andre_shamsabadi', 'antoine_maruani'],
    requiredIds: ['andre_shamsabadi', 'antoine_maruani'],
    minPresent: 2,
    variants: [
      [
        { speakerId: 'andre_shamsabadi', text: "Antoine, fancy hitting Ippudo for rich tonkotsu ramen tonight?" },
        { speakerId: 'antoine_maruani', text: "Always yes for ramen, extra chashu and kaedama noodles for me." },
        { speakerId: 'andre_shamsabadi', text: "Locked in, rich broth beats microwave beans any day of the week." }
      ],
      [
        { speakerId: 'antoine_maruani', text: "André, craving a steaming bowl of Ippudo ramen after lab today?" },
        { speakerId: 'andre_shamsabadi', text: "Only if we order thick tonkotsu broth plus extra pork chashu." },
        { speakerId: 'antoine_maruani', text: "Done deal, extra noodles too so we survive tomorrow's columns." }
      ]
    ]
  },
  {
    id: 'sig_nafsika_marco_joao_smoke',
    weeklyKey: 'nafsika_marco_joao_smoke',
    roomIds: ['klb_2f', 'gordons_cafe'],
    participants: ['nafsika_forte', 'marco_sabatini', 'joao_nogueira'],
    requiredIds: [],
    minPresent: 2,
    postAction: 'smoke_break',
    variants: [
      [
        { speakerId: 'nafsika_forte', text: "Marco, João, quick smoke break outside before our next step?" },
        { speakerId: 'marco_sabatini', text: "Sì cara, five minutes outside beats staring at the Büchi." },
        { speakerId: 'joao_nogueira', text: "Grabbing my coat now, badly need fresh air off Gordon Street." }
      ],
      [
        { speakerId: 'marco_sabatini', text: "Nafsika, fancy stepping outside for a quick smoke break?" },
        { speakerId: 'nafsika_forte', text: "Desperately Marco, let me just drop my hood sash first." },
        { speakerId: 'marco_sabatini', text: "Meet you by the KLB front steps in two minutes sharp." }
      ],
      [
        { speakerId: 'joao_nogueira', text: "Nafsika, coming down for a quick smoke break out front?" },
        { speakerId: 'nafsika_forte', text: "Always yes João, Lab 230 fumes are melting my brain today." },
        { speakerId: 'joao_nogueira', text: "Five minutes outside, then straight back to the Biotage." }
      ],
      [
        { speakerId: 'marco_sabatini', text: "João fratello, stepping out for a smoke break right now?" },
        { speakerId: 'joao_nogueira', text: "Right behind you Marco, finishing this espresso and coming!" },
        { speakerId: 'marco_sabatini', text: "Perfetto, five minutes in the Bloomsbury breeze." }
      ]
    ]
  },
  {
    id: 'sig_andre_calise_joao_football',
    weeklyKey: 'andre_calise_joao_football',
    roomIds: ['klb_2f', 'klb_3f', 'gordons_cafe'],
    participants: ['andre_shamsabadi', 'calise_bahou', 'joao_nogueira'],
    requiredIds: [],
    minPresent: 2,
    variants: [
      [
        { speakerId: 'andre_shamsabadi', text: "Calise, João, how ruined is your fantasy football team this week?" },
        { speakerId: 'calise_bahou', text: "Captained the wrong striker again mate, Premier League pain!" },
        { speakerId: 'joao_nogueira', text: "At least Benfica and Portugal still know how to play football." }
      ],
      [
        { speakerId: 'calise_bahou', text: "André mate, checking Premier League fantasy points before lunch?" },
        { speakerId: 'andre_shamsabadi', text: "Down twenty points already Calise, wildcard panic incoming." },
        { speakerId: 'calise_bahou', text: "Hold till the World Cup breaks mate, my bench saved me twice." }
      ],
      [
        { speakerId: 'joao_nogueira', text: "André, watching Portugal or the Premier League match tonight?" },
        { speakerId: 'andre_shamsabadi', text: "Both João, plus praying my fantasy midfield actually scores!" },
        { speakerId: 'joao_nogueira', text: "Always back Benfica talent on fantasy, easy points every week." }
      ],
      [
        { speakerId: 'calise_bahou', text: "João, Portugal winning the next World Cup or dreaming again?" },
        { speakerId: 'joao_nogueira', text: "Wait till you see Benfica's midfield shine on the world stage!" },
        { speakerId: 'calise_bahou', text: "Fair play, half my Premier League fantasy team is Portuguese!" }
      ]
    ]
  },
  {
    id: 'sig_marco_max_baby_peetah',
    weeklyKey: 'marco_max_baby_peetah',
    roomIds: ['klb_2f', 'klb_3f', 'gordons_cafe'],
    participants: ['marco_sabatini', 'maximillian_lee', 'peter_szijj'],
    requiredIds: ['peter_szijj'],
    minPresent: 2,
    variants: [
      [
        { speakerId: 'marco_sabatini', text: "Peter, Max, still at the bench? Look at Little baby Peetah!" },
        { speakerId: 'maximillian_lee', text: "Look at Little baby Peetah clutching his clean Fab stock!" },
        { speakerId: 'peter_szijj', text: "Wait till my LotR synth kicks in, laugh at your own risk!" }
      ],
      [
        { speakerId: 'marco_sabatini', text: "Peter mio caro, need a hand? Look at Little baby Peetah go!" },
        { speakerId: 'peter_szijj', text: "Stop calling me Little baby Peetah across the floor Marco!" },
        { speakerId: 'marco_sabatini', text: "Impossible amico, it rolls off the tongue too nicely!" }
      ],
      [
        { speakerId: 'maximillian_lee', text: "Peter, dropped another pipette tip? Little baby Peetah energy!" },
        { speakerId: 'peter_szijj', text: "Come say Little baby Peetah while my hussars raid your town!" },
        { speakerId: 'maximillian_lee', text: "Careful or I tell Dan you used blue dye on buffer again." }
      ]
    ]
  },
  {
    id: 'sig_antoine_peter_knight_rush',
    weeklyKey: 'antoine_peter_knight_rush',
    roomIds: ['klb_2f', 'klb_3f', 'gordons_cafe'],
    participants: ['antoine_maruani', 'peter_szijj'],
    requiredIds: ['antoine_maruani', 'peter_szijj'],
    minPresent: 2,
    variants: [
      [
        { speakerId: 'antoine_maruani', text: "Peter, how fast can you hit an AoE Knight rush lately?" },
        { speakerId: 'peter_szijj', text: "Easy {KNIGHT_MINS} mins if my wood economy stays clean!" },
        { speakerId: 'antoine_maruani', text: "Decent, though my Franks land Knights in {KNIGHT_MINS_2} mins." }
      ],
      [
        { speakerId: 'peter_szijj', text: "Antoine, reckon your AoE Knight rush still hits fast?" },
        { speakerId: 'antoine_maruani', text: "Castle and Knights out by {KNIGHT_MINS} mins, smooth French eco." },
        { speakerId: 'peter_szijj', text: "Brace yourself then, mine hits in {KNIGHT_MINS_2} mins tonight!" }
      ]
    ]
  }
];

// ============================================================================
// BIRTHDAY GREETINGS (WhatsApp, NPC-to-Target & Replies)
// ============================================================================
window.KLB.BIRTHDAY_GREETINGS = {
  whatsapp: [
    { template: "HB {initials}" },
    { template: "HBD {initials}, miss Bettys treats today!" },
    { template: "Happy birthday {shortName}! Gordon's pastries on the squad." },
    { template: "Happy birthday {shortName}, pints at the pub after five!" },
    { template: "Joyeux anniversaire {shortName}! Save us a slice on 3F." },
    { template: "HB {shortName}, may your columns run clean all year!" },
    { template: "Happy birthday {shortName}, zero Abil fines this year!" },
    { template: "HBD {shortName}! Birthday nuggets in the 3F tea room?" }
  ],
  npcToTarget: {
    daniel_richards: [
      "HB {initials}, happy birthday {target}.",
      "Happy 12th birthday, little baby {target}.",
      "HB {target}. Keep your safety specs on today."
    ],
    richard_spears: [
      "Happy birthday {target}, hope it stays far from Christmas!",
      "Many happy returns {target}, posh Bettys biscuit for you!"
    ],
    peter_szijj: [
      "Happy birthday {target}, may destroyers hit max evasion!",
      "Happy birthday {target}! LotR synth in your honour tonight."
    ],
    faiza_javaid: [
      "HBD {initials}, happy birthday {target}! Miss Bettys!",
      "Happy birthday {target}! Bringing dark chocolate cake?"
    ],
    calise_bahou: [
      "Happy birthday {target} mate, pints later?",
      "HB {target} mate! Steak pie and pints on the squad!"
    ],
    maximillian_lee: [
      "Happy birthday {target}, pints after work?",
      "HB {target}, birthday chicken nuggets incoming later!"
    ],
    antoine_maruani: [
      "Joyeux anniversaire {target}, hope there is cake upstairs!",
      "Happy birthday {target}, mec — real croissants today!"
    ],
    andre_shamsabadi: [
      "Happy birthday {target}! Waistcoat out in your honour!",
      "HB {target}! Dropping a celebratory poll on WhatsApp now."
    ],
    joao_nogueira: [
      "Happy birthday {target}! Pastel de nata at Gordon's!",
      "Parabéns {target}! Birthday espresso on me downstairs."
    ],
    marcos_fernandez: [
      "Feliz cumpleaños {target}, zero RiskNET forms today!",
      "Happy birthday {target}! Leaving early for pints tonight."
    ],
    marco_sabatini: [
      "Buon compleanno {target}, espresso on me!",
      "Auguri {target}! Double espresso at Gordon's later!"
    ],
    nafsika_forte: [
      "Happy birthday {target}! Happy to watch your flask late!",
      "HB {target}! Gordon's flat white and pastry on me today."
    ],
    archie_wall: [
      "Happy birthday {target}! Saved the best biscuit for you.",
      "HB {target}, hope your tubes spin cleanly all day!"
    ],
    charlotte_coomber: [
      "Happy birthday {target}! Passed the card round Sheppard bay!",
      "HBD {target}! Birthday drinks after five at the pub!"
    ],
    vijay_chudasama: [
      "Happy birthday {target}! Good momentum this week!",
      "Many happy returns {target}, coffee run on me today!"
    ],
    default: [
      "Happy birthday {target}! Have a brilliant day in KLB!",
      "HB {target}, hope the lab treats you kindly today!"
    ]
  },
  replies: [
    "Cheers {greeter}! Saving you a cake slice on 3F.",
    "Thanks {greeter}, pints after five are on me!",
    "Legend {greeter}, thank you so much!",
    "Nice one {greeter}! Coffee run later?",
    "Cheers {greeter}, zero RiskNET forms today I hope!",
    "Thank you {greeter}, hope Vijay goes easy on slides!",
    "Much appreciated {greeter}, grab a pastry upstairs!",
    "Cheers {greeter}, see you at Gordon's shortly!"
  ]
};

// ============================================================================
// SAMPLE RUN LINES (CIB LG1b NMR & LG11 Mass Spec Favours)
// ============================================================================
window.KLB.SAMPLE_RUN_LINES = {
  nmr: {
    ask: [
      "Hey {target}, heading down to NMR, any tubes to submit?",
      "{target}, popping down to LG1b NMR, got tubes for the rack?",
      "Heading to Abil's NMR room {target}, want a tube dropped?",
      "{target}, walking to 700 MHz NMR now, any samples ready?"
    ],
    replyYes: [
      "Cheers {sender}, grab my numbered NMR tube on the rack!",
      "Legend {sender}, take my labelled CDCl3 tube from bay 2!",
      "Lifesaver {sender}, my topped-up tube is on the 2F rack!",
      "Thanks {sender}, please drop my D2O tube into slot four!"
    ],
    replyNo: [
      "All sorted for now {sender}, thanks for checking!",
      "Nothing waiting {sender}, already fetched from Abil's rack!",
      "Good thanks {sender}, still filtering my sample upstairs.",
      "No tubes yet {sender}, catch you on the next LG1b run!"
    ]
  },
  ms: {
    ask: [
      "{target}, popping over to Mass Spec, got any vials for me?",
      "Hey {target}, walking to LG11 MS, any desalted vials ready?",
      "{target}, heading to Kersti's LC-MS, want a vial queued?",
      "Going to Mass Spec now {target}, need any vials logged?"
    ],
    replyYes: [
      "Legend {sender}, take my labelled LC-MS vial from bay 2!",
      "Cheers {sender}, my 10x desalted vial is on the bench!",
      "Star {sender}, grab my clean Q-TOF vial by the balance!",
      "Thanks {sender}, take the purple-capped vial on my rack!"
    ],
    replyNo: [
      "All sorted for now {sender}, thanks for checking!",
      "Nothing yet {sender}, still desalting on the spin filter!",
      "No PBS-free vials ready {sender}, thanks for asking!",
      "Good for now {sender}, Kersti ran mine earlier today."
    ]
  }
};
window.KLB.SAMPLE_RUN_LINES.nmr.yes = window.KLB.SAMPLE_RUN_LINES.nmr.replyYes;
window.KLB.SAMPLE_RUN_LINES.nmr.no = window.KLB.SAMPLE_RUN_LINES.nmr.replyNo;
window.KLB.SAMPLE_RUN_LINES.ms.yes = window.KLB.SAMPLE_RUN_LINES.ms.replyYes;
window.KLB.SAMPLE_RUN_LINES.ms.no = window.KLB.SAMPLE_RUN_LINES.ms.replyNo;

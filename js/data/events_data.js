// Random Crises, Inspections, Lab Social Events, Live Big-Chuds Banter & Run Mutators
// Strict 22-Character Cast Boundary — Classic Browser Script (window.KLB)
window.KLB = window.KLB || {};

// ============================================================================
// 1. RANDOM LAB, FACILITY, WEATHER & SOCIAL EVENTS (32 Events)
// ============================================================================
window.KLB.RANDOM_EVENTS = [
  {
    id: 'fire_alarm_test',
    title: 'KLB Fire Alarm Evacuation!',
    category: 'crisis',
    isRareSignature: true,
    weight: 7,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: null,
    whatsappSender: 'daniel_richards',
    whatsappMsg: 'KLB klaxon is wailing — everyone out via the left fire exit. Hope nobody left a reflux or papain digest near its sweet spot.',
    bannerText: 'Fire alarm sounding: evacuate via the left fire exit while bench timers keep ticking.',
    durationMins: 30,
    effectType: 'evacuation_30m',
    choices: [
      {
        label: 'Evacuate immediately via Left Fire Exit',
        moraleDelta: -4,
        safetyDelta: 6,
        energyDelta: 5,
        socialDelta: 2,
        patienceDelta: 3,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'You clear the bay smoothly via the Left Fire Exit while timers tick.'
      },
      {
        label: 'Pull flask off heat, then bolt out',
        moraleDelta: -2,
        safetyDelta: -8,
        energyDelta: -6,
        patienceDelta: -2,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'You rescue your yield right before the marshal sweeps Bay 2.'
      },
      {
        label: 'Crouch behind Cupboard 19 and ignore siren',
        moraleDelta: -12,
        safetyDelta: -32,
        energyDelta: -8,
        socialDelta: -4,
        patienceDelta: -8,
        favourDelta: -2,
        timeCostMins: 0,
        resultText: 'The Safety Inspector catches you behind Cupboard 19 for a brutal Lab Condition hit.'
      }
    ]
  },
  {
    id: 'safety_sweep',
    title: 'Surprise Departmental Lab Condition Sweep!',
    category: 'inspection',
    isRareSignature: true,
    weight: 8,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'claire_carmalt',
    whatsappSender: 'marcos_fernandez',
    whatsappMsg: 'Claire and the Safety Inspector are in KLB #headsup — Specs ON (G), Headphones OFF (H), and keep your workspace clean (Lab Condition >= 40)!',
    bannerText: 'Prof. Carmalt and the Safety Inspector enter Lab 230 soon — keep Specs ON (G), Headphones OFF (H), and Lab Condition >= 40.',
    durationMins: 25,
    effectType: 'safety_scramble',
    choices: [
      {
        label: 'Specs ON (G), Headphones OFF (H), tidy workspace',
        moraleDelta: 4,
        safetyDelta: 12,
        energyDelta: -8,
        socialDelta: 2,
        patienceDelta: 5,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Prof. Carmalt beams as the Safety Inspector ticks Exemplary Lab Condition on his clipboard.'
      },
      {
        label: 'Put Specs ON (G) only; leave headphones and clutter',
        moraleDelta: -4,
        safetyDelta: -12,
        energyDelta: -2,
        patienceDelta: -4,
        favourDelta: -1,
        timeCostMins: 0,
        resultText: 'Your specs pass, though the Safety Inspector flags headphones in the lab and an untidy workspace.'
      },
      {
        label: 'Bolt upstairs to 3F until they leave',
        moraleDelta: 2,
        safetyDelta: -18,
        energyDelta: -4,
        socialDelta: -2,
        patienceDelta: -6,
        favourDelta: -1,
        timeCostMins: 0,
        resultText: 'You hide upstairs on 3F while your unattended hood drags Lab Condition down.'
      }
    ]
  },
  {
    id: 'vijay_bench_round',
    title: 'Prof. Vijay Chudasama Bench Round!',
    category: 'inspection',
    weight: 9,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'vijay_chudasama',
    spawnActorOnTrigger: true,
    whatsappSender: 'marcos_fernandez',
    whatsappMsg: 'Vijay just walked into KLB 2nd Floor #headsup!',
    bannerText: 'Vijay is doing hood-to-hood rounds in Lab 230 checking reactions, lab books, and Friday momentum.',
    durationMins: 20,
    effectType: 'pi_bench_round',
    choices: [
      {
        label: 'Walk Vijay through your TLC and controls',
        moraleDelta: 10,
        safetyDelta: 4,
        energyDelta: -6,
        patienceDelta: 8,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Vijay nods and praises your watertight controls for Friday.'
      },
      {
        label: 'Swirl coloured water while mumbling about rotamers',
        moraleDelta: -6,
        safetyDelta: 0,
        energyDelta: -4,
        patienceDelta: -10,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Vijay squints at the unlabelled flask and mutters suboptimal.'
      },
      {
        label: 'Ask Vijay about your Slide 4 controls',
        moraleDelta: 6,
        safetyDelta: 2,
        energyDelta: -5,
        patienceDelta: 5,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Vijay sketches the exact negative control he wants for Friday.'
      }
    ]
  },
  {
    id: 'jamie_specs_check',
    title: 'Prof. Jamie Baker Specs Patrol',
    category: 'inspection',
    weight: 8,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'jamie_baker',
    spawnActorOnTrigger: true,
    whatsappSender: 'marcos_fernandez',
    whatsappMsg: 'Jamie Baker is walking through the bays checking eye protection and the central balance table #headsup!',
    bannerText: 'Prof. Jamie Baker is patrolling Lab 230 — keep your specs on (G) past the door.',
    durationMins: 15,
    effectType: 'specs_check',
    choices: [
      {
        label: 'Tap specs and brush Balance Table silica',
        moraleDelta: 5,
        safetyDelta: 8,
        energyDelta: -3,
        socialDelta: 3,
        patienceDelta: 4,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Jamie Baker thanks you for keeping specs on and the balance bay tidy.'
      },
      {
        label: 'Scramble bare-eyed back to the door holder',
        moraleDelta: -6,
        safetyDelta: -14,
        energyDelta: -4,
        socialDelta: -2,
        patienceDelta: -5,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Jamie catches you mid-stride and reminds you specs go on at the door.'
      }
    ]
  },
  {
    id: 'cold_in_230',
    title: 'KLB HVAC Plunge: Cold in 230 (<17 °C)',
    category: 'weather',
    weight: 7,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: null,
    whatsappSender: 'richard_spears',
    whatsappMsg: 'My goodness, it is 16 °C in Lab 230 — every bottle of anhydrous DMSO and glacial AcOH has frozen into a solid glacier.',
    bannerText: 'Lab 230 dropped below 17 °C, freezing anhydrous DMSO and glacial AcOH solid in the bottles.',
    durationMins: 60,
    effectType: 'hvac_cold',
    choices: [
      {
        label: 'Thaw bottles gently in 28 °C water',
        moraleDelta: 2,
        safetyDelta: 4,
        energyDelta: -4,
        socialDelta: 2,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'You gently thaw frozen DMSO stocks without cracking a single bottle.'
      },
      {
        label: 'Blast frozen DMSO with the heat gun',
        moraleDelta: -8,
        safetyDelta: -20,
        energyDelta: -5,
        patienceDelta: -6,
        favourDelta: -1,
        timeCostMins: 0,
        resultText: 'Thermal shock cracks the bottle bottom as Nafsika hands you spill pads.'
      },
      {
        label: 'Switch to DMF and MeCN stocks',
        moraleDelta: -3,
        safetyDelta: 2,
        energyDelta: -6,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Your fingers are freezing, though DMF stays liquid down to -60 °C.'
      }
    ]
  },
  {
    id: 'may_heatwave',
    title: '30 °C Bloomsbury Heatwave in Lab 230!',
    category: 'weather',
    weight: 7,
    minDay: 1,
    validRooms: ['klb_2f'],
    actorId: null,
    whatsappSender: 'calise_bahou',
    whatsappMsg: 'Bois it is 30 °C in KLB 230 and the 4 °C fridge is creeping up toward 14 °C — keep the fridge doors shut pls!!',
    bannerText: 'A 30 °C heatwave hits Lab 230: Energy drains faster and 4 °C fridges warm if ajar.',
    durationMins: 75,
    effectType: 'hvac_heatwave',
    choices: [
      {
        label: 'Tape fridge shut and pack ice sleeves',
        moraleDelta: 4,
        safetyDelta: 5,
        energyDelta: -7,
        socialDelta: 3,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Ice sleeves keep 4 °C Herceptin cold while Calise and Antoine salute you.'
      },
      {
        label: "Dash to Gordon's for iced espressos",
        moraleDelta: 6,
        safetyDelta: 0,
        energyDelta: 6,
        socialDelta: 4,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Iced caffeine revives Lab 230 and restores Energy despite the heat.'
      },
      {
        label: 'Power through in a buttoned lab coat',
        moraleDelta: -10,
        safetyDelta: -4,
        energyDelta: -16,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'You sweat behind the hood while the 4 °C lab fridge warms toward 13 °C.'
      }
    ]
  },
  {
    id: 'kersti_lcms_down',
    title: 'Kersti in LG11: LC-MS Needs Column Conditioning',
    category: 'facility',
    weight: 9,
    minDay: 0,
    validRooms: ['cib_lg11_ms'],
    actorId: 'kersti_karu',
    whatsappSender: 'antoine_maruani',
    whatsappMsg: 'Heads up, Kersti in LG11 just flagged the Q-TOF: "LCMS is out of the operation — PLRP-S column needs conditioning and mobile-phase flushing to clear PEG and salt. Desalt 10× before queuing."',
    bannerText: 'Kersti in CIB LG11 reports the LC-MS needs column conditioning and mobile-phase flushing.',
    durationMins: 60,
    effectType: 'lcms_offline',
    choices: [
      {
        label: 'Condition column and flush LG11 lines with Kersti',
        moraleDelta: 6,
        safetyDelta: 4,
        energyDelta: -10,
        socialDelta: 4,
        patienceDelta: 4,
        favourDelta: 2,
        timeCostMins: 0,
        clearsLcmsBroken: true,
        resultText: 'You flush and condition the LG11 column with Kersti, restoring clean baselines and earning two Favours.'
      },
      {
        label: 'Ask Kersti for a fast conditioned-line bypass (1 Favour)',
        favourCost: 1,
        moraleDelta: 7,
        safetyDelta: 4,
        energyDelta: 0,
        socialDelta: 4,
        patienceDelta: 5,
        favourDelta: 0,
        timeCostMins: 0,
        clearsLcmsBroken: true,
        resultText: 'Kersti routes your desalted sample onto the conditioned LG11 bypass loop ahead of the backlog.'
      },
      {
        label: 'Pivot to MALDI-TOF or KLB bench work',
        moraleDelta: 0,
        safetyDelta: 2,
        energyDelta: -4,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'You dodge the LG11 flush queue while Kersti conditions the column.'
      },
      {
        label: 'Queue "BLANK_WATER" beside the flashing red LED',
        moraleDelta: -12,
        safetyDelta: -10,
        energyDelta: -4,
        socialDelta: -4,
        patienceDelta: -8,
        favourDelta: -2,
        timeCostMins: 0,
        resultText: 'Kersti catches you at uplc2011 clicking Run during column conditioning.'
      }
    ]
  },
  {
    id: 'abil_nmr_hostage',
    title: 'Dr Abil Aliev NMR Tube Hostage Crisis!',
    category: 'facility',
    weight: 8,
    minDay: 1,
    validRooms: ['cib_lg1b_nmr'],
    actorId: 'abil_aliev',
    whatsappSender: 'calise_bahou',
    whatsappMsg: 'Lads, Abil just emailed — seven uncollected Chudasama NMR tubes left on the 600/700 MHz rack have been moved to the LG1b Sample Fridge. Collect today or £130 grant fine!',
    bannerText: 'Dr Abil Aliev locked uncollected Chud NMR tubes in LG1b Sample Fridge under a £130 fine.',
    durationMins: 45,
    effectType: 'nmr_hostage',
    choices: [
      {
        label: 'Head to LG1b, apologise, retrieve all tubes',
        moraleDelta: 5,
        safetyDelta: 3,
        energyDelta: -8,
        socialDelta: 3,
        patienceDelta: 6,
        favourDelta: 2,
        timeCostMins: 0,
        resultText: 'Abil waives the £130 fine and reminds everyone to check 128.40.76.1.'
      },
      {
        label: 'Ask Abil for a fine waiver and rack rescue (1 Favour)',
        favourCost: 1,
        moraleDelta: 9,
        safetyDelta: 2,
        energyDelta: 0,
        socialDelta: 4,
        patienceDelta: 6,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Abil waives the £130 fine outright and sets your Chudasama NMR tubes aside safely.'
      },
      {
        label: 'Spritz Sabatini cologne and chat NOE shimming',
        moraleDelta: 10,
        safetyDelta: 2,
        energyDelta: -5,
        socialDelta: 5,
        patienceDelta: 3,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Abil appreciates the cologne and shimming chat and returns your tubes.'
      },
      {
        label: 'Ignore the email until tomorrow morning',
        moraleDelta: -14,
        safetyDelta: 0,
        energyDelta: 0,
        socialDelta: -3,
        patienceDelta: -12,
        favourDelta: -1,
        timeCostMins: 0,
        setsAbilFine: true,
        resultText: 'Vijay gets copied on the £130 invoice and his Patience drops hard.'
      }
    ]
  },
  {
    id: 'door_pls',
    title: 'WhatsApp Ping: "Door pls!"',
    category: 'social',
    weight: 11,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: null,
    spawnActorOnTrigger: true,
    whatsappSender: 'faiza_javaid',
    whatsappMsg: 'Door pls!! Hands full with ice box outside KLB 2F!',
    bannerText: 'A labmate pinged "Door pls!" — unlatch the main exit door for them.',
    durationMins: 15,
    effectType: 'door_buzz',
    choices: [
      {
        label: 'Walk to Right Exit and unlatch door',
        moraleDelta: 6,
        safetyDelta: 0,
        energyDelta: -3,
        socialDelta: 6,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'You unlatch the exit door and bank one grateful Lab Favour.'
      },
      {
        label: 'Stay at your hood for someone else',
        moraleDelta: -3,
        safetyDelta: 0,
        energyDelta: 0,
        socialDelta: -4,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Three more door pings chime before Archie walks over to open it.'
      }
    ]
  },
  {
    id: 'gordons_1027',
    title: '10:27 Gordon\'s Café Coffee Call!',
    category: 'social',
    weight: 10,
    minDay: 0,
    validRooms: ['klb_2f', 'klb_3f'],
    actorId: 'joao_nogueira',
    whatsappSender: 'joao_nogueira',
    whatsappMsg: '10:27 — Gordon\'s coffee & pastry run? Who\'s coming?',
    bannerText: 'João called the 10:27 Gordon\'s Café espresso and pastry run on 25 Gordon Street.',
    durationMins: 25,
    effectType: 'coffee_call',
    choices: [
      {
        label: 'Walk to Gordon\'s Café with the squad',
        moraleDelta: 8,
        safetyDelta: 0,
        energyDelta: 8,
        socialDelta: 8,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Flat whites and pastries at Gordon\'s recharge Energy, Morale, and Social.'
      },
      {
        label: 'Ask João for a takeaway espresso (1 Favour)',
        favourCost: 1,
        moraleDelta: 6,
        safetyDelta: 2,
        energyDelta: 10,
        socialDelta: 3,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'João drops a hot Gordon\'s espresso cup right beside your bay.'
      },
      {
        label: 'Stay at KLB and drink tap water',
        moraleDelta: -2,
        safetyDelta: 0,
        energyDelta: 0,
        socialDelta: -3,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'You keep quiet bench space while everyone walks over to Gordon\'s.'
      }
    ]
  },
  {
    id: 'alex_king_1718',
    title: '17:18 Corridor Encounter: Alex King!',
    category: 'crisis',
    isRareSignature: true,
    weight: 8,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'alex_king',
    whatsappSender: 'daniel_richards',
    whatsappMsg: 'Code Poison at 17:18. Alex King is hovering outside Lab 230 asking if everyone is heading to Gordon\'s Café. Do NOT lead her up to 3F.',
    bannerText: 'Alex King is outside Lab 230 asking about Gordon\'s Café — keep her off 3F.',
    durationMins: 20,
    effectType: 'pursuer_1718',
    choices: [
      {
        label: 'Duck to CIB via NMR decoy',
        moraleDelta: 8,
        safetyDelta: 0,
        energyDelta: -5,
        socialDelta: 4,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'You slip into CIB basement while keeping the 3F office sanctuary hidden.'
      },
      {
        label: 'Keep headphones on in stony silence',
        moraleDelta: -14,
        safetyDelta: 0,
        energyDelta: -6,
        socialDelta: -2,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'She stands behind your stool staring silently while you pipette.'
      },
      {
        label: 'Panic and sprint up to 3F Office',
        moraleDelta: -22,
        safetyDelta: 0,
        energyDelta: -8,
        socialDelta: -8,
        patienceDelta: -4,
        favourDelta: -2,
        timeCostMins: 0,
        resultText: 'She follows you straight onto 3F and nine Chuds roast you.'
      }
    ]
  },
  {
    id: 'cupboard_5_stench',
    title: 'Cupboard 5 Thiol Waft Across Lab 230!',
    category: 'crisis',
    weight: 7,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'antoine_maruani',
    whatsappSender: 'antoine_maruani',
    whatsappMsg: 'Mon Dieu, who opened Cupboard 5 without bleaching their pipette?! It smells like a leaking gas main in Paris!',
    bannerText: 'Unquenched thiophenol and dodecanethiol fumes are wafting out of Cupboard 5 across Lab 230.',
    durationMins: 30,
    effectType: 'thiol_stench',
    choices: [
      {
        label: 'Dunk rogue pipette into Hood Bleach Bath',
        moraleDelta: 6,
        safetyDelta: 10,
        energyDelta: -6,
        socialDelta: 6,
        patienceDelta: 4,
        favourDelta: 2,
        timeCostMins: 0,
        resultText: 'Hypochlorite kills the thiol stench instantly as all three bays cheer.'
      },
      {
        label: 'Ask a baymate to bleach-quench Cupboard 5 (1 Favour)',
        favourCost: 1,
        moraleDelta: 5,
        safetyDelta: 10,
        energyDelta: 0,
        socialDelta: 4,
        patienceDelta: 4,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'A baymate dons thick nitrile gloves and neutralises the thiol pipette in Hood Bleach Bath.'
      },
      {
        label: 'Max hood sashes and retreat to 3F',
        moraleDelta: -6,
        safetyDelta: -6,
        energyDelta: 4,
        socialDelta: -2,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Extractors clear the skunk cloud while 2F pauses briefly.'
      },
      {
        label: 'Spray air freshener over the thiol bin',
        moraleDelta: -14,
        safetyDelta: -12,
        energyDelta: -3,
        socialDelta: -5,
        patienceDelta: -5,
        favourDelta: -1,
        timeCostMins: 0,
        resultText: 'Lab 230 now smells strongly of Tropical Pine and Rotting Garlic.'
      }
    ]
  },
  {
    id: 'unlabelled_bench_tcep',
    title: 'Mystery Unlabelled "10 mM TCEP" Tube!',
    category: 'crisis',
    weight: 7,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'maximillian_lee',
    whatsappSender: 'maximillian_lee',
    whatsappMsg: 'Found a mystery Eppendorf just labelled "TCEP" in faded Sharpie on the TCEP bench. 85% chance it\'s sound, right??',
    bannerText: 'An unlabelled "TCEP" Eppendorf sits on the TCEP Bench — 85% pH 8.0, 15% pH 2.3 trap.',
    durationMins: 20,
    effectType: 'mystery_tcep',
    choices: [
      {
        label: 'Make fresh buffered TCEP in BBS',
        moraleDelta: 6,
        safetyDelta: 4,
        energyDelta: -7,
        socialDelta: 5,
        patienceDelta: 3,
        favourDelta: 2,
        timeCostMins: 0,
        resultText: 'Antoine beams at your dated pH 8.0 stock and Max owes you a favour.'
      },
      {
        label: 'Borrow fresh pH 8.0 BBS TCEP from a baymate (1 Favour)',
        favourCost: 1,
        moraleDelta: 7,
        safetyDelta: 4,
        energyDelta: 2,
        socialDelta: 4,
        patienceDelta: 3,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'A baymate slides over a fresh 20 mM pH 8.0 BBS TCEP aliquot so you skip buffer prep.'
      },
      {
        label: 'Spot 1 µL onto pH strip first',
        moraleDelta: 4,
        safetyDelta: 3,
        energyDelta: -2,
        socialDelta: 2,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'The strip flashes red at pH 2.2 so you bin the unbuffered trap tube.'
      },
      {
        label: 'Use the mystery TCEP as-is',
        moraleDelta: 2,
        safetyDelta: -4,
        energyDelta: 4,
        patienceDelta: -3,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'You gamble on the unlabelled bench tube and hope it is not acidic.'
      }
    ]
  },
  {
    id: 'buchi_bump',
    title: 'Violent Büchi Rotavap Bump Crisis!',
    category: 'crisis',
    weight: 8,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'andre_shamsabadi',
    whatsappSender: 'andre_shamsabadi',
    whatsappMsg: 'Someone walked away from Büchi 1 at 45 mbar on DCM/MeOH and the bump trap is half-full of yellow PD foam!',
    bannerText: 'An unattended flask on Büchi 1 is foaming toward the condenser — vent vacuum fast.',
    durationMins: 15,
    effectType: 'buchi_hazard',
    choices: [
      {
        label: 'Vent gently and rinse bump trap back',
        moraleDelta: 5,
        safetyDelta: 6,
        energyDelta: -5,
        socialDelta: 6,
        patienceDelta: 3,
        favourDelta: 2,
        timeCostMins: 0,
        resultText: 'You save the yellow PD product before it hits the coils and earn two Favours.'
      },
      {
        label: 'Ask Nafsika or Marcos to rescue Büchi 1 (1 Favour)',
        favourCost: 1,
        moraleDelta: 6,
        safetyDelta: 6,
        energyDelta: 0,
        socialDelta: 4,
        patienceDelta: 4,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Nafsika vents the vacuum smoothly and Marcos rinses the yellow PD trap intact.'
      },
      {
        label: 'Yank their flask off and claim Büchi',
        moraleDelta: -4,
        safetyDelta: -4,
        energyDelta: 2,
        socialDelta: -6,
        favourDelta: -2,
        timeCostMins: 0,
        resultText: 'You clear the rotavap fast and trigger angry texts across the bay.'
      }
    ]
  },
  {
    id: 'nafsika_late_rescue',
    title: 'Nafsika Forte Late-Night Bench Rescue!',
    category: 'social',
    weight: 7,
    minDay: 1,
    validRooms: ['klb_2f'],
    actorId: 'nafsika_forte',
    whatsappSender: 'peter_szijj',
    whatsappMsg: 'Nafsika says she is still in Lab 230 finishing Baker maleimide columns — anyone downstairs in CIB need a flask pulled off heat?',
    bannerText: 'KLB First Aider Nafsika Forte is holding down Baker bay and offering late-night bench aid.',
    durationMins: 35,
    effectType: 'late_rescue',
    choices: [
      {
        label: 'Ask Nafsika to watch timer and lend DMF (1 Favour)',
        favourCost: 1,
        moraleDelta: 7,
        safetyDelta: 3,
        energyDelta: 6,
        socialDelta: 3,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Nafsika catches your reaction window and slides over pristine dry DMF.'
      },
      {
        label: 'Bring Nafsika tea for holding down 230',
        moraleDelta: 6,
        safetyDelta: 2,
        energyDelta: -5,
        socialDelta: 6,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Nafsika thanks you warmly and backs you up with a Lab Favour.'
      }
    ]
  },
  {
    id: 'sabatini_cologne',
    title: 'Marco Sabatini\'s Cologne & Heirloom TLC Jar',
    category: 'social',
    weight: 6,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'marco_sabatini',
    whatsappSender: 'andre_shamsabadi',
    whatsappMsg: 'Marco Sabatini is heading down to CIB — he offered anyone a tactical spritz of "Sabatini by Sabatini" or a lend of his heirloom TLC chamber.',
    bannerText: 'Marco Sabatini offers a wrist-spritz of cologne or a lend of his heirloom TLC jar.',
    durationMins: 30,
    effectType: 'cologne_buff',
    choices: [
      {
        label: 'Accept Sabatini cologne and heirloom TLC jar',
        moraleDelta: 10,
        safetyDelta: 0,
        energyDelta: 4,
        socialDelta: 5,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Dead-straight Rf spots appear while Kersti and Abil greet you warmly.'
      },
      {
        label: 'Swap workup tips at the Sheppard border',
        moraleDelta: 6,
        safetyDelta: 2,
        energyDelta: -2,
        socialDelta: 6,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Sabatini shares fresh molecular sieves from Cupboard 14 in return.'
      }
    ]
  },
  {
    id: 'charlotte_collection',
    title: 'Charlotte Coomber\'s Card Collection & High-Decibel Story!',
    category: 'social',
    weight: 8,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'charlotte_coomber',
    whatsappSender: 'daniel_richards',
    whatsappMsg: 'Headphone advisory in Lab 230: Charlotte is recounting a weekend train saga at 95 decibels while collecting £2 coins.',
    bannerText: 'Charlotte Coomber is doing a £2 card collection beside your bay at 95 decibels.',
    durationMins: 25,
    effectType: 'cash_collection',
    choices: [
      {
        label: 'Chip in £2 and borrow marker',
        moraleDelta: 7,
        safetyDelta: 0,
        energyDelta: -4,
        socialDelta: 8,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Charlotte hands you a fresh whiteboard marker for Friday Group Meeting.'
      },
      {
        label: 'Ask a baymate to cover your £2 and grab marker (1 Favour)',
        favourCost: 1,
        moraleDelta: 8,
        safetyDelta: 0,
        energyDelta: 2,
        socialDelta: 6,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'A baymate drops £2 in Charlotte\'s envelope for you and slides over a fresh whiteboard marker.'
      },
      {
        label: 'Put noise-cancelling headphones on to concentrate',
        moraleDelta: 3,
        safetyDelta: 0,
        energyDelta: 6,
        socialDelta: -2,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Extractor roar and weekend gossip fade into blissful bench calm.'
      },
      {
        label: 'Calculate VivaSpin moles bare-eared next door',
        moraleDelta: -6,
        safetyDelta: 0,
        energyDelta: -12,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'You accidentally write brunch notes into your lab book margin three times.'
      }
    ]
  },
  {
    id: 'marcos_dry_ice_pop',
    title: 'Marcos\'s Cheeky Dry-Ice Eppendorf POP!',
    category: 'social',
    weight: 6,
    minDay: 1,
    validRooms: ['klb_2f'],
    actorId: 'marcos_fernandez',
    whatsappSender: 'maximillian_lee',
    whatsappMsg: 'BANG!! Marcos just got Peter three feet vertical off the floor with a dry-ice pellet in a 1.5 mL snap-cap!',
    bannerText: 'Marcos snaps a dry-ice pellet inside an Eppendorf across the bay with a deadpan stare.',
    durationMins: 10,
    effectType: 'dry_ice_pop',
    choices: [
      {
        label: 'Laugh and scoop spare dry ice',
        moraleDelta: 10,
        safetyDelta: -3,
        energyDelta: 4,
        socialDelta: 6,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Marcos keeps a straight face while the whole bay bursts out laughing.'
      },
      {
        label: 'Sweep plastic shrapnel before PIs spot it',
        moraleDelta: 4,
        safetyDelta: 5,
        energyDelta: -2,
        socialDelta: 2,
        patienceDelta: 3,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'You bin the snapped cap five seconds before Prof. Baker glances over.'
      }
    ]
  },
  {
    id: 'calise_lemons_spill',
    title: '14 Bargain Lemons Loose Near the Central Balance Bay!',
    category: 'social',
    weight: 7,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'calise_bahou',
    whatsappSender: 'calise_bahou',
    whatsappMsg: 'FFS the net bag split near the central balance bay — 14 lemons are rolling across Lab 230! (DAN BOUGHT THEM I JUST CARRIED THEM)',
    bannerText: 'Fourteen lemons burst from Calise\'s bag near the central balance bay and are rolling across Lab 230.',
    durationMins: 15,
    effectType: 'lemon_spill',
    choices: [
      {
        label: 'Corral all fourteen rolling lemons fast',
        moraleDelta: 11,
        safetyDelta: 6,
        energyDelta: -5,
        socialDelta: 6,
        favourDelta: 1,
        timeCostMins: 0,
        triggersMinigame: 'lemons',
        resultText: 'Zero slip hazards near the central balance bay and Calise gifts you a lucky lemon.'
      },
      {
        label: 'Tease Lemon Boy in the lab chat',
        moraleDelta: 8,
        safetyDelta: -2,
        energyDelta: 2,
        socialDelta: 4,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Ten years of Lemon Boy jokes lock straight into KLB folklore.'
      }
    ]
  },
  {
    id: 'spider_on_chair',
    title: 'Giant Bloomsbury Spider on 3F Office Chair!',
    category: 'social',
    weight: 6,
    minDay: 0,
    validRooms: ['klb_3f'],
    actorId: 'maximillian_lee',
    whatsappSender: 'maximillian_lee',
    whatsappMsg: 'EMERGENCY ON 3F. Eight-legged Shelob the size of a coaster on the Chud write-up chair. Burn the 3F office down immediately.',
    bannerText: 'A coaster-sized Bloomsbury house spider has claimed Max\'s write-up chair upstairs in 3F.',
    durationMins: 15,
    effectType: 'office_spider',
    choices: [
      {
        label: 'Trap under 250 mL beaker and release',
        moraleDelta: 9,
        safetyDelta: 2,
        energyDelta: -3,
        socialDelta: 6,
        favourDelta: 2,
        timeCostMins: 0,
        resultText: 'Max exhales in massive relief and hands you two Lab Favours.'
      },
      {
        label: 'Name it Ungoliant and switch desks',
        moraleDelta: 5,
        safetyDelta: 0,
        energyDelta: -2,
        socialDelta: 3,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Peter loves the Silmarillion nod while Max avoids that chair all week.'
      }
    ]
  },
  {
    id: 'cib_warming_parcel',
    title: 'Warming Antibody Tube on CIB LG11 Bench!',
    category: 'crisis',
    weight: 7,
    minDay: 0,
    validRooms: ['klb_2f', 'klb_3f', 'cib_lg11_ms', 'cib_lg1b_nmr'],
    actorId: 'peter_szijj',
    whatsappSender: 'peter_szijj',
    whatsappMsg: 'Guys Kersti just spotted our £1,400 clinical mAb tube warming on the LG11 Mass Spec bench instead of Abil\'s NMR fridge!!',
    bannerText: 'An unchilled antibody sample tube is warming on the CIB LG11 Mass Spec bench.',
    durationMins: 25,
    effectType: 'warming_parcel',
    choices: [
      {
        label: 'Move tube to Abil\'s 4 °C NMR fridge',
        moraleDelta: 8,
        safetyDelta: 2,
        energyDelta: -8,
        socialDelta: 4,
        patienceDelta: 4,
        favourDelta: 2,
        timeCostMins: 0,
        resultText: 'Fresh monomer antibody stock sits safely inside Abil\'s 4 °C NMR fridge.'
      },
      {
        label: 'Leave it until your next CIB trip',
        moraleDelta: -8,
        safetyDelta: 0,
        energyDelta: 4,
        socialDelta: -3,
        patienceDelta: -6,
        favourDelta: -1,
        timeCostMins: 0,
        resultText: 'Warming on the LG11 bench causes 12% IgG dimerisation on SEC.'
      }
    ]
  },
  {
    id: 'lotr_soundtrack_hour',
    title: '18:00 Howard Shore "Concerning Hobbits" Speaker Hour',
    category: 'social',
    weight: 8,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'peter_szijj',
    whatsappSender: 'peter_szijj',
    whatsappMsg: '18:00 in Lab 230 — daytime crowd thinning out, putting Howard Shore\'s Fellowship soundtrack on the lab speakers!',
    bannerText: 'Peter puts Howard Shore\'s Fellowship soundtrack on the lab speakers for the evening shift.',
    durationMins: 60,
    effectType: 'lotr_speakers',
    choices: [
      {
        label: 'Ride the Fellowship evening bench groove',
        moraleDelta: 8,
        safetyDelta: 0,
        energyDelta: 4,
        socialDelta: 4,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Tin whistles carry your evening Biotage fractions cleanly home.'
      },
      {
        label: 'Queue Bridge of Khazad-dûm for centrifugation',
        moraleDelta: 7,
        safetyDelta: 0,
        energyDelta: 3,
        socialDelta: 6,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Peter and Marcos debate First Age lore beside the spinning centrifuge.'
      }
    ]
  },
  {
    id: 'aoe2_1700_invite',
    title: '17:00 AoE2 & Worms Lobby!',
    category: 'social',
    weight: 7,
    minDay: 1,
    validRooms: ['klb_2f', 'klb_3f'],
    actorId: 'andre_shamsabadi',
    whatsappSender: 'andre_shamsabadi',
    whatsappMsg: '17:00 AoE2 & Worms Lobby! Max, Antoine, Peter, and I are heading to our 3F desks for an hour of Black Forest ("Faiza FarmVille rules") and ninja ropes!',
    bannerText: 'Gaming crew members are heading to their 3F desks for an hour of AoE2 & Worms.',
    durationMins: 60,
    effectType: 'aoe2_break',
    choices: [
      {
        label: 'Head to 3F desks for the 1-hour AoE2 / Worms lobby',
        moraleDelta: 10,
        safetyDelta: 0,
        energyDelta: 4,
        socialDelta: 8,
        patienceDelta: -3,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Faiza walls berry bushes while Antoine lands a crazy ninja-rope shot.'
      },
      {
        label: 'Spectate one round from 3F with a biscuit',
        moraleDelta: 6,
        safetyDelta: 0,
        energyDelta: 3,
        socialDelta: 4,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'A quick laugh and Yorkshire biscuit brighten the afternoon without leaving timers.'
      },
      {
        label: 'Stay downstairs and watch Biotage peaks',
        moraleDelta: 0,
        safetyDelta: 2,
        energyDelta: 0,
        socialDelta: -2,
        patienceDelta: 3,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Fractions stay safe while gaming crew cheers echo down from the 3F desks.'
      }
    ]
  },
  {
    id: 'solvent_cupboard_low',
    title: 'Solvent Winchester Running Low in Cupboard 9!',
    category: 'facility',
    weight: 7,
    minDay: 0,
    validRooms: ['klb_2f', 'klb_3f'],
    actorId: 'andre_shamsabadi',
    whatsappSender: 'andre_shamsabadi',
    whatsappMsg: 'Heads up: Cupboard 9 on 2F is down to the last splash of EtOAc and Cupboard 1 dry THF is nearly out!',
    bannerText: 'Cupboard 9 column solvents and Cupboard 1 dry THF Winchesters are running dangerously low.',
    durationMins: 15,
    effectType: 'solvent_cupboard_low',
    choices: [
      {
        label: 'Swap fresh Winchesters in Cupboard 9',
        moraleDelta: 6,
        safetyDelta: 4,
        energyDelta: -6,
        socialDelta: 6,
        patienceDelta: 2,
        favourDelta: 2,
        timeCostMins: 0,
        resultText: 'Fresh EtOAc and dry THF are stocked in KLB 2F before the rush.'
      },
      {
        label: 'Ration remaining solvents in Cupboard 1',
        moraleDelta: -3,
        safetyDelta: -2,
        energyDelta: 0,
        socialDelta: -4,
        patienceDelta: -2,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Everyone scrambles around nearly empty Winchesters for the rest of the shift.'
      }
    ]
  },
  {
    id: 'ir_room_key_hunt',
    title: 'CIB LG11 & LG1b Keypad Code Scramble!',
    category: 'facility',
    weight: 6,
    minDay: 1,
    validRooms: ['klb_2f', 'klb_3f'],
    actorId: 'calise_bahou',
    whatsappSender: 'calise_bahou',
    whatsappMsg: 'Wait, did Estates rotate the CIB basement keypads or is it still 1965 for LG11 Mass Spec and 2145 for LG1b NMR?!',
    bannerText: 'Nobody is sure whether CIB LG11 Mass Spec (1965) or LG1b NMR (2145) keypad codes changed.',
    durationMins: 25,
    effectType: 'keypad_scramble',
    choices: [
      {
        label: 'Check the 2F balance bay clipboard',
        moraleDelta: 7,
        safetyDelta: 0,
        energyDelta: -4,
        socialDelta: 3,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'You verify 1965 and 2145 on the 2F clipboard and save a wasted trip.'
      },
      {
        label: 'Ask #Hackerman Antoine for the codes',
        moraleDelta: 5,
        safetyDelta: 0,
        energyDelta: -2,
        socialDelta: 5,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Antoine confirms 1965 and 2145 instantly without leaving his 3F desk.'
      }
    ]
  },
  {
    id: 'sliced_croissant_crime',
    title: 'Culinary Incident: The Horizontally Sliced Croissant!',
    category: 'social',
    weight: 6,
    minDay: 0,
    validRooms: ['gordons_cafe'],
    actorId: 'antoine_maruani',
    whatsappSender: 'antoine_maruani',
    whatsappMsg: '*God has joined the chat* WHO ordered a croissant sliced flat like sandwich bread with plastic cheese at Gordon\'s Café?! End of discussion.',
    bannerText: 'A horizontally sliced croissant at Gordon\'s Café just triggered Antoine and João.',
    durationMins: 15,
    effectType: 'croissant_trauma',
    choices: [
      {
        label: 'Bin pastry and share pastéis de nata',
        moraleDelta: 8,
        safetyDelta: 0,
        energyDelta: 6,
        socialDelta: 6,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'French-Portuguese pastry diplomacy restores peace at Gordon\'s Café.'
      },
      {
        label: 'Defend the toasted cheese croissant',
        moraleDelta: 5,
        safetyDelta: 0,
        energyDelta: 4,
        socialDelta: 2,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'João fires off a lively manifesto abolishing flat pressed pastries.'
      }
    ]
  },
  {
    id: 'archie_gel_lanes',
    title: 'Archie Wall\'s Two Spare SDS-PAGE Gel Wells!',
    category: 'social',
    weight: 7,
    minDay: 1,
    validRooms: ['klb_2f'],
    actorId: 'archie_wall',
    whatsappSender: 'maximillian_lee',
    whatsappMsg: 'Archie Wall is running a 12% non-reducing Bio-Rad gel at the gel station soon and said Lanes 9 & 10 are free if a Chud wants to hop on!',
    bannerText: 'Baker Group\'s Archie Wall offers two free wells on his fresh 12% SDS-PAGE gel.',
    durationMins: 20,
    effectType: 'shared_gel',
    choices: [
      {
        label: 'Load clean LDS sample, thank Archie',
        moraleDelta: 6,
        safetyDelta: 2,
        energyDelta: 2,
        socialDelta: 5,
        patienceDelta: 2,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Fast QC check strengthens Baker and Chudasama cross-bay harmony.'
      },
      {
        label: 'Ask Archie to prep and run your Lanes 9–10 sample (1 Favour)',
        favourCost: 1,
        moraleDelta: 7,
        safetyDelta: 2,
        energyDelta: 6,
        socialDelta: 3,
        patienceDelta: 3,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Archie loads and runs your clean LDS sample in Lanes 9–10 while you keep working.'
      },
      {
        label: 'Overload 35 µL salty crude sample',
        moraleDelta: -5,
        safetyDelta: 0,
        energyDelta: 6,
        socialDelta: -6,
        favourDelta: -2,
        timeCostMins: 0,
        resultText: 'Your salty lane smears straight into Archie\'s albumin band.'
      }
    ]
  },
  {
    id: 'richard_kettle_round',
    title: 'Richard Spears\'s 3F Bettys Tea & Posh Biscuit Tin!',
    category: 'social',
    weight: 8,
    minDay: 0,
    validRooms: ['klb_3f'],
    actorId: 'richard_spears',
    whatsappSender: 'richard_spears',
    whatsappMsg: 'Hullo everyone — the kettle on 3F is boiling and I have opened the Yorkshire Bettys biscuit tin if anyone needs a brew.',
    bannerText: 'Richard\'s Kettle is boiling on 3F with Bettys Yorkshire tea and the posh biscuit tin.',
    durationMins: 20,
    effectType: 'tea_round',
    choices: [
      {
        label: 'Pop to 3F kettle for Bettys tea',
        moraleDelta: 7,
        safetyDelta: 0,
        energyDelta: 10,
        socialDelta: 5,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Yorkshire tea restores Energy while Richard shares a stoichiometry tip.'
      },
      {
        label: 'Keep working and send a thumbs-up',
        moraleDelta: 2,
        safetyDelta: 0,
        energyDelta: 0,
        socialDelta: 1,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Even knowing the posh biscuit tin exists lifts bench spirits slightly.'
      }
    ]
  },
  {
    id: 'andre_spicy_poll',
    title: 'André Drops a Classic Deadpan Big-Chuds Poll',
    category: 'social',
    weight: 7,
    minDay: 0,
    validRooms: ['klb_2f', 'klb_3f'],
    actorId: 'andre_shamsabadi',
    whatsappSender: 'andre_shamsabadi',
    whatsappMsg: 'Serious lunchtime poll: would you fight 1 Max-sized duck or 100 duck-sized Antoines wielding baguettes?',
    bannerText: 'André dropped a deadpan Big-Chuds WhatsApp poll lighting up every phone in Lab 230.',
    durationMins: 15,
    effectType: 'whatsapp_poll',
    choices: [
      {
        label: 'Vote 100 duck-sized Antoines with baguettes',
        moraleDelta: 10,
        safetyDelta: 0,
        energyDelta: 3,
        socialDelta: 7,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Antoine replies petit canard mais mortel and group Morale jumps.'
      },
      {
        label: 'Mute notifications for delicate Biotage loading',
        moraleDelta: 1,
        safetyDelta: 2,
        energyDelta: 0,
        patienceDelta: 2,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'You load fractions undisturbed and catch twenty jokes later over tea.'
      }
    ]
  },
  {
    id: 'mystery_cupboard_19',
    title: 'Archaeology in Cupboard 19 (Mystery)!',
    category: 'crisis',
    weight: 5,
    minDay: 2,
    validRooms: ['klb_2f'],
    actorId: 'marcos_fernandez',
    whatsappSender: 'marcos_fernandez',
    whatsappMsg: 'Somebody cracked open Cupboard 19 looking for a stir bar and unearthed a parafilm-crusty 2011 amber bottle with half a skull label.',
    bannerText: 'Someone uncovered a crusty 2011 mystery reagent bottle inside Cupboard 19.',
    durationMins: 20,
    effectType: 'mystery_bottle',
    choices: [
      {
        label: 'Transfer sealed bottle into Hood containment',
        moraleDelta: 4,
        safetyDelta: 10,
        energyDelta: -6,
        socialDelta: 2,
        patienceDelta: 4,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Zero lachrymator escapes and you rescue two pristine stir bars.'
      },
      {
        label: 'Ask Marcos to bag and clear the 2011 bottle (1 Favour)',
        favourCost: 1,
        moraleDelta: 5,
        safetyDelta: 10,
        energyDelta: 0,
        socialDelta: 3,
        patienceDelta: 4,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Marcos safely moves the crusty 2011 bottle into Hood hazardous containment for you.'
      },
      {
        label: 'Crack cap on the open bench',
        moraleDelta: -15,
        safetyDelta: -26,
        energyDelta: -10,
        socialDelta: -4,
        patienceDelta: -8,
        favourDelta: -1,
        timeCostMins: 0,
        resultText: 'Benzyl bromide tear-gas sting sends you straight to the eyewash.'
      }
    ]
  },
  {
    id: 'north_bench_ether_smell',
    title: 'South-East Baker Bay Ether Smell in Lab 230!',
    category: 'facility',
    weight: 6,
    minDay: 1,
    validRooms: ['klb_2f'],
    actorId: 'marcos_fernandez',
    whatsappSender: 'marcos_fernandez',
    whatsappMsg: 'Strong diethyl ether fumes wafting from the south-east Baker bay near Cupboard 20 — somebody left a rinse flask uncapped!',
    bannerText: 'Diethyl ether fumes are building up in the south-east Baker bay near Cupboard 20 inside Lab 230.',
    durationMins: 25,
    effectType: 'north_bench_ether',
    choices: [
      {
        label: 'Cap flask and move into Hood',
        moraleDelta: 6,
        safetyDelta: 8,
        energyDelta: -5,
        socialDelta: 5,
        patienceDelta: 4,
        favourDelta: 2,
        timeCostMins: 0,
        resultText: 'You seal the ether flask inside the hood before fumes spread across 2F.'
      },
      {
        label: 'Stay at your bay and fan the air',
        moraleDelta: -4,
        safetyDelta: -8,
        energyDelta: -2,
        socialDelta: -3,
        patienceDelta: -4,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Solvent haze lingers across the south-east Baker bay near Cupboard 20 until Marcos caps it.'
      }
    ]
  },
  {
    id: 'friday_room_roulette',
    title: 'Friday Meeting Room Projector & Clicker Check!',
    category: 'inspection',
    weight: 10,
    minDay: 3,
    validRooms: ['klb_2f', 'klb_3f', 'meeting_room'],
    actorId: 'faiza_javaid',
    whatsappSender: 'faiza_javaid',
    whatsappMsg: 'WAIT guys is the Group Meeting Room projector working before Friday 09:00 Group Meeting?? Also André do u have the laser clicker??',
    bannerText: 'Check the Group Meeting Room projector, grab the 3F clicker, and polish your slides before 09:00.',
    durationMins: 20,
    effectType: 'meeting_prep',
    choices: [
      {
        label: 'Test projector, grab clicker, polish slides',
        moraleDelta: 9,
        safetyDelta: 2,
        energyDelta: -5,
        socialDelta: 4,
        patienceDelta: 6,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'The Group Meeting Room projector syncs cleanly and error bars look sharp.'
      },
      {
        label: 'Wing the projector setup at 09:00',
        moraleDelta: -8,
        safetyDelta: 0,
        energyDelta: -4,
        socialDelta: -3,
        patienceDelta: -8,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'You wrestle with the Group Meeting Room cables while Vijay checks his watch.'
      }
    ]
  }
];

// ============================================================================
// 2. LIVE "BIG-CHUDS" WHATSAPP IDLE BANTER & 2-MESSAGE EXCHANGES (204 Items)
// ============================================================================
window.KLB.WHATSAPP_BANTER = [
  {
    senderId: 'daniel_richards',
    text: 'Been in since 07:45. Büchi 1 bath is warm, Lab 230 is silent, nobody has ruined my day yet.',
    replySenderId: 'marcos_fernandez',
    replyText: 'Give it till 09:15.',
    hourHint: 8
  },
  {
    senderId: 'daniel_richards',
    text: 'Just walked past Cupboard 6. Notice the delicate symmetry of Max\'s 2016 marker-pen artwork on the sash. Very typical of his middle period.',
    replySenderId: 'maximillian_lee',
    replyText: 'Thank you Dr Dan, finally someone in this building appreciates fine anatomical realism.',
    hourHint: 9
  },
  {
    senderId: 'maximillian_lee',
    text: 'Anyone got 50 µL of buffered 10 mM TCEP? Asking for a 160 kg silverback who refuses to use the analytical balance.',
    replySenderId: 'antoine_maruani',
    replyText: 'Top shelf of my rack, freshly made at 20 mM in pH 8.0 BBS + EDTA. Dilute 1:1. This is the way.',
    hourHint: 10
  },
  {
    senderId: 'faiza_javaid',
    text: 'door pls!!',
    replySenderId: 'marcos_fernandez',
    replyText: 'Done.',
    hourHint: 10
  },
  {
    senderId: 'joao_nogueira',
    text: '10:27 — Gordon\'s coffeebois & girl?? Need proper espresso immediately!',
    replySenderId: 'faiza_javaid',
    replyText: 'coming!! wait 2 mins im taking gloves off',
    hourHint: 10
  },
  {
    senderId: 'antoine_maruani',
    text: 'Someone left a sliced ham-and-cheese croissant by the 3F kettle corner. I am calling the French embassy.',
    replySenderId: 'calise_bahou',
    replyText: 'Elite tier scran mate, pairs nicely with a £3 meal deal',
    hourHint: 12
  },
  {
    senderId: 'joao_nogueira',
    text: 'Food is a privilege, every meal should be celebrated — meal deals, baby carrots, cold wet triangle bread and Dr Pepper should be abolished by law!',
    replySenderId: 'daniel_richards',
    replyText: 'Thank you for your TED talk João, I will enjoy my egg and cress triangle in peace.',
    hourHint: 13
  },
  {
    senderId: 'faiza_javaid',
    text: 'guys whats the mass spec door code again?? standing outside LG11 like an idiot',
    replySenderId: 'antoine_maruani',
    replyText: '1965! And uplc2011 for the PC. Desalt 10× or Kersti will end us all.',
    hourHint: 11
  },
  {
    senderId: 'andre_shamsabadi',
    text: '5.7 µL/min running on the Chudasama syringe pump for the next 30 mins. Nobody breathe near the syringe pump hood.',
    replySenderId: 'richard_spears',
    replyText: 'Giving that fume hood a very respectful two-metre berth, André.',
    hourHint: 14
  },
  {
    senderId: 'calise_bahou',
    text: 'PSA for anyone making diBrPD acid today: use p-TsOH in toluene, NEVER TFA unless you fancy explaining monobromo-PD to Vijay on Friday',
    replySenderId: 'peter_szijj',
    replyText: 'Learned that from your OBC paper methinks!! Absolute lifesaver!',
    hourHint: 11
  },
  {
    senderId: 'richard_spears',
    text: 'Time for another thrilling afternoon round of Soluble or Not Soluble. If it is Not Soluble you lose; if it is Soluble you merely continue working (there are no winners).',
    replySenderId: 'maximillian_lee',
    replyText: 'Spoiler alert Rich: there\'s white snow at the bottom of the Eppendorf.',
    hourHint: 15
  },
  {
    senderId: 'peter_szijj',
    text: 'Running Trastuzumab, Rituximab AND OKT3 digests in parallel today!! Prolly fine as long as I don\'t mix up the Protein A tubes',
    replySenderId: 'daniel_richards',
    replyText: 'Keep Herceptin well away from Protein A unless you enjoy donating 80% of your Fab to Thermo Scientific.',
    hourHint: 11
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Quick poll: is "on-water" green chemistry profound hydrophobic catalysis or just an excuse not to dry THF?',
    replySenderId: 'antoine_maruani',
    replyText: '86% yield in 1 mL tap water says both, mon gars.',
    hourHint: 13
  },
  {
    senderId: 'antoine_maruani',
    text: 'Kersti just sent an all-staff email: "Who left vials 14–19 on Waters Acquity without sample log entry?? ffgdfd this not good."',
    replySenderId: 'daniel_richards',
    replyText: 'On my way down to LG11 now to smooth it over with Kersti, definitely wasn\'t us (checking who it was).',
    hourHint: 14
  },
  {
    senderId: 'richard_spears',
    text: 'Reminder from Abil\'s LG1b notice: 700 MHz Neo requires a clean spinner and minimum 4.0 cm CDCl3 / DMSO-d6 depth. Check 128.40.76.1 before walking down.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Cheers Rich — on my way down to collect my DMSO-d6 tube before Abil locks it in the fridge!',
    hourHint: 15
  },
  {
    senderId: 'maximillian_lee',
    text: 'Andrè your waistcoat game today is 10/10, you look like you\'re about to nationalise the railways and run a Biotage simultaneously',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Still putting the grave accent on my e after all these years, impressive commitment.',
    hourHint: 12
  },
  {
    senderId: 'calise_bahou',
    text: 'Before anyone starts: Dan bought the reduced lemons, I literally just carried the bag up the KLB stairs',
    replySenderId: 'daniel_richards',
    replyText: 'Revisionist history from Lemon Boy. The court record speaks for itself.',
    hourHint: 16
  },
  {
    senderId: 'faiza_javaid',
    text: 'finally got my A280 numbers on 2F!! anyone need help checking antibody ratios before 5pm?',
    replySenderId: 'calise_bahou',
    replyText: 'Yes pls Daiza!! Need A280/A335 on my 4 °C Herceptin prep sound',
    hourHint: 16
  },
  {
    senderId: 'richard_spears',
    text: 'Just brought warm beans in a sandwich box to the 3F kettle corner — the idea of cooking them in a saucepan genuinely unsettles me.',
    replySenderId: 'daniel_richards',
    replyText: 'As long as they aren\'t swimming in watery bean juice I will allow it on Northern solidarity grounds.',
    hourHint: 13
  },
  {
    senderId: 'maximillian_lee',
    text: 'Nah hear me out: slow-reduce beans in chorizo fat until you achieve structural bean plasma. Michelin star.',
    replySenderId: 'joao_nogueira',
    replyText: 'Chouriço rescues everything, finally Max speaks culinary sense!!',
    hourHint: 13
  },
  {
    senderId: 'marcos_fernandez',
    text: '5 out of 6 of us walked in with identical short back and sides this Monday. Legendary Chud haircut sync remains undefeated.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'You can take a Chud out of Chud lab, etc.',
    hourHint: 9
  },
  {
    senderId: 'antoine_maruani',
    text: '#AskAntoine clinic is open at my 3F desk — bring me your cursed +69 Da acetonitrile adducts and scrambled gels.',
    replySenderId: 'daniel_richards',
    replyText: '#Dantoine4life (strictly scientific, no homo).',
    hourHint: 15
  },
  {
    senderId: 'peter_szijj',
    text: 'Just had a mini heart attack thinking I pipetted 2 µL of 6× blue LDS dye into my pure SynAb stock instead of the PCR tube, crisis averted!',
    replySenderId: 'maximillian_lee',
    replyText: 'CLOSE THE LID ON THE MASTER STOCK FIRST PEETAH',
    hourHint: 18
  },
  {
    senderId: 'joao_nogueira',
    text: 'Late afternoon and I am just loading a DCM/MeOH silica column on the Biotage, pray for my soul irmãos',
    replySenderId: 'daniel_richards',
    replyText: 'Absolute madness. I am packing up by 17:45.',
    hourHint: 18
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Opening Cupboard 5 for 45 seconds. Bleach bath in the Chudasama hood is fresh. Nobody panic.',
    replySenderId: 'faiza_javaid',
    replyText: 'staying on 3F for the next 10 mins thx',
    hourHint: 11
  },
  {
    senderId: 'richard_spears',
    text: 'Friendly COSHH note: if anyone needs dehydroalanine on an antibody, Cupboard 11 has bench-stable CDMP — please never go near explosive MSH.',
    replySenderId: 'antoine_maruani',
    replyText: '100% seconded — CDMP + TCEP at pH 8.0 is cleaner AND won\'t blow the sash off Lab 230.',
    hourHint: 14
  },
  {
    senderId: 'calise_bahou',
    text: 'Kneeling in front of the 4 °C fridge for 15 mins pipetting TCEP into pre-chilled Herceptin — glamorous PhD life bois',
    replySenderId: 'maximillian_lee',
    replyText: '95% HHLL band doesn\'t earn itself Big C!',
    hourHint: 12
  },
  {
    senderId: 'daniel_richards',
    text: 'Reminder that if MES buffer drifts from pH 5.20 to 5.45 my 40 nm gold nanoparticles turn the colour of Ribena instantly.',
    replySenderId: 'joao_nogueira',
    replyText: 'Nanoparticle life chooses violence every Tuesday, stay strong Dr Dan!',
    hourHint: 11
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Has anyone seen my laser pointer clicker on 3F? Swear I left it next to Richard\'s kettle.',
    replySenderId: 'richard_spears',
    replyText: 'Tucked safely behind the Bettys tea caddy by the kettle on 3F so nobody walked off with it, André!',
    hourHint: 16
  },
  {
    senderId: 'faiza_javaid',
    text: 'half the time i open this chat expecting science and its just 40 messages about beans or worms ninja ropes',
    replySenderId: 'marcos_fernandez',
    replyText: 'This chat would get more downloads and citations than half our papers.',
    hourHint: 17
  },
  {
    senderId: 'peter_szijj',
    text: '19:15 in Lab 230 — just me, Nafsika in the Baker bay until 19:45, Superdex 200 dripping at 0.4 mL/min, and Rivendell on the speakers.',
    replySenderId: 'joao_nogueira',
    replyText: 'Hold the fort Peetah — Nafsika is an absolute legend for holding down the Baker bay till 19:45!',
    hourHint: 19
  },
  {
    senderId: 'daniel_richards',
    text: '17:17 check: coast clear on the 2nd floor landing?',
    replySenderId: 'marcos_fernandez',
    replyText: 'Wait 4 minutes. Movement near the lift at 17:18.',
    hourHint: 17
  },
  {
    senderId: 'antoine_maruani',
    text: 'Pro tip from 3F: mount 128.40.76.1 (nmruser) so you know your 600 MHz spectrum finished BEFORE walking down three flights to LG1b.',
    replySenderId: 'faiza_javaid',
    replyText: 'actual #Hackerman behaviour thank u!!',
    hourHint: 15
  },
  {
    senderId: 'calise_bahou',
    text: 'Just demolished a cow-sized steak pie for lunch, Morale is at 110% even if my VivaSpin spreadsheet says 125% yield',
    replySenderId: 'daniel_richards',
    replyText: 'Conservation of mass remains purely optional for Big C.',
    hourHint: 13
  },
  {
    senderId: 'maximillian_lee',
    text: 'DAR 2.0, 2.0, 1.9, 2.1, 2.0 across five straight Herceptin replicates!! Slapping the gel in Blue Party Mix now.',
    replySenderId: 'antoine_maruani',
    replyText: 'Proper ~25 Å linker geometry doing the heavy lifting! Bravo Maxito.',
    hourHint: 16
  },
  {
    senderId: 'joao_nogueira',
    text: 'Ya know bad TCEP / Will bring down my rep / Dem dirty cells are waitin / Sure my spectra isn\'t fadin!!',
    replySenderId: 'maximillian_lee',
    replyText: 'BARS IN LAB 230!!',
    hourHint: 18
  },
  {
    senderId: 'richard_spears',
    text: '8-arm star PEG-SH + 5DiBr at pH 8.0 just gelled in 6.8 seconds — inverted the vial and the meniscus didn\'t budge a millimetre!',
    replySenderId: 'calise_bahou',
    replyText: 'Rapid-fire pipette wrist paying off Rich!!',
    hourHint: 15
  },
  {
    senderId: 'faiza_javaid',
    text: 'pre-clicking diBrPD-BCN + MMAE-azide in DMSO before touching IgG4 was honestly the best decision of my PhD, HIC trace is SO clean',
    replySenderId: 'antoine_maruani',
    replyText: 'Zero aqueous MMAE brick-dust — Vijay is going to love that HIC chromatogram on Friday.',
    hourHint: 14
  },
  {
    senderId: 'marcos_fernandez',
    text: '40 mg/mL HSA blood mimic: 0% coumarin leak after 24 h. 5 mM GSH tumour mimic: glowing bright blue in 20 mins. Quietly pleased.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Self-immolative SMDC supremacy. Gordon\'s espresso and pastry on me.',
    hourHint: 16
  },
  {
    senderId: 'maximillian_lee',
    text: 'Archie just yelled across from the Baker bay — the centrifuge is balanced and free now if anyone\'s VivaSpins are waiting!',
    replySenderId: 'calise_bahou',
    replyText: 'Legend, tell Archie I\'m hopping on for 10 mins!',
    hourHint: 12
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Marco Sabatini says cheers to whoever put the glass lid back on his heirloom "in memoriam Sabatini" TLC chamber properly.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Fastest Rf plate in Bloomsbury, treated with museum reverence.',
    hourHint: 15
  },
  {
    senderId: 'richard_spears',
    text: 'Charlotte mentioned she has three spare black dry-wipe markers at the Sheppard desks if anyone needs one before Friday Group Meeting!',
    replySenderId: 'peter_szijj',
    replyText: 'Ooh yes pls grab me one Rich, mine dried out mid-mechanism!!',
    hourHint: 16
  },
  {
    senderId: 'daniel_richards',
    text: '17:55. Packing bag. Anything catches fire after 18:00 is officially Peter and Nafsika\'s jurisdiction.',
    replySenderId: 'peter_szijj',
    replyText: 'Have a good evening grandad Dan!! Evening shift has the watch.',
    hourHint: 18
  },
  {
    senderId: 'antoine_maruani',
    text: 'Remember team: SPAAC first without copper, THEN CuAAC with 5:1 THPTA:CuSO4, THEN 2 mM EDTA wash. Tattoo it on the hood sash.',
    replySenderId: 'maximillian_lee',
    replyText: 'Instructions unclear, tattooed #Dantoine4life on Dan\'s lab coat instead.',
    hourHint: 11
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Just finished filling out RiskNET for a 0.5 mmol toluene reaction. Twenty minutes of my mortal lifespan gone forever.',
    replySenderId: 'marcos_fernandez',
    replyText: 'Peak risknet bollox.',
    hourHint: 10
  },
  {
    senderId: 'joao_nogueira',
    text: 'PDI = 0.098 on the Malvern Zetasizer for VNAR–PLGA–PEG nanoparticles!! Under 0.10, have a rippa!!',
    replySenderId: 'daniel_richards',
    replyText: 'Sub-0.10 PDI on polymeric NPs is genuinely filthy, fair play JCFN.',
    hourHint: 17
  },
  {
    senderId: 'peter_szijj',
    text: 'Note to self & future generations: S. typhimurium sialidase HATES pH 5.0 buffer — keep CiTE tetrazine clicks strictly at pH 7.0 PBS!',
    replySenderId: 'faiza_javaid',
    replyText: 'meanwhile cathepsin B assay buffer literally needs pH 6.5 to wake up, enzymes are so dramatic',
    hourHint: 15
  },
  {
    senderId: 'richard_spears',
    text: 'Anyone fancy an early Gordon\'s pastry and early night? Calm evening and asleep before ten.',
    replySenderId: 'calise_bahou',
    replyText: 'Sound mate im in after I pull my 4 °C tube!',
    hourHint: 18
  },
  {
    senderId: 'maximillian_lee',
    text: 'Door pls!! Carrying two ice buckets and a 4 L Winchester of Hexane',
    replySenderId: 'daniel_richards',
    replyText: 'Thought a 160 kg silverback could walk straight through brickwork, buzzing you in now.',
    hourHint: 14
  },
  {
    senderId: 'faiza_javaid',
    text: 'who took the P20 pipette from the TCEP bench?? bring it back peasants pls',
    replySenderId: 'maximillian_lee',
    replyText: 'Innocent your honour (it\'s next to the Gel Tank, sorry Daiza).',
    hourHint: 13
  },
  {
    senderId: 'andre_shamsabadi',
    text: '120 °C VT-NMR in DMSO-d6 coalesced those ugly split hydrazide rotamer humps into one razor-sharp singlet. Catharsis.',
    replySenderId: 'antoine_maruani',
    replyText: 'Abil\'s 700 MHz Neo earning its keep!',
    hourHint: 16
  },
  {
    senderId: 'calise_bahou',
    text: 'Reminder to shut the 4 °C lab fridge properly!! Someone left the rubber seal resting on a tube rack',
    replySenderId: 'marcos_fernandez',
    replyText: 'Nafsika just clicked it shut from the Baker side — still holding steady at 4 °C!',
    hourHint: 18
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Last bag of dry ice pellets is nearly gone in 2F — grab a scoop now before four.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Heading over with my Dewar as we speak.',
    hourHint: 15
  },
  {
    senderId: 'antoine_maruani',
    text: 'Just packed a Sephadex G-25 column inside a cut P2 pipette tip while the ÄKTA was booked out — desalted 50 µL Fab in 90 seconds.',
    replySenderId: 'peter_szijj',
    replyText: 'Actual MacGyver bioconjugation!! Writing that down in my lab book immediately!',
    hourHint: 14
  },
  {
    senderId: 'daniel_richards',
    text: 'Friendly Thursday check-in: does everyone have four actual figures for Vijay\'s audit tomorrow or are we drawing ChemDraw arrows in MS Paint?',
    replySenderId: 'faiza_javaid',
    replyText: '3.5 slides done!! just waiting on my MTT plate reader export!',
    hourHint: 17
  },
  {
    senderId: 'joao_nogueira',
    text: 'Without 0.05% Tween 80 these hydrophobic PLGA TIPS microparticles just float on top of PBS mocking me',
    replySenderId: 'daniel_richards',
    replyText: 'Tiny drop of surfactant fixes 90% of diagnostics problems, proven science.',
    hourHint: 15
  },
  {
    senderId: 'richard_spears',
    text: 'Disclosed 0.08 eq residual EtOAc clearly underneath Spectrum 2 on my Friday slide — much better to calculate true wt% than crop 4.12 ppm.',
    replySenderId: 'antoine_maruani',
    replyText: 'Peak rigor, Richard — Vijay is going to love seeing those kinetic traces tomorrow.',
    hourHint: 17
  },
  {
    senderId: 'peter_szijj',
    text: '19:25 — locking up the Chudasama hoods, checking Argon cylinders & walking out of KLB to Intro by The xx. Night Chuds!!',
    replySenderId: 'antoine_maruani',
    replyText: 'Bonne nuit Peetah! Smash Friday Group Meeting tomorrow.',
    hourHint: 19
  },
  {
    senderId: 'maximillian_lee',
    text: 'Friday morning energy!! Let\'s survive Vijay\'s 4-slide audit and reconvene at Gordon\'s Café for celebratory coffees & pastries!',
    replySenderId: 'joao_nogueira',
    replyText: 'VAMOS BIG-CHUDS!! Gordon\'s table reserved in spirit!!',
    hourHint: 9
  },
  {
    senderId: 'calise_bahou',
    text: 'Good luck in The Room today squad — remember "suboptimal" is one word!',
    replySenderId: 'daniel_richards',
    replyText: 'Godspeed gentlemen and Faiza. See you on the other side at Gordon\'s.',
    hourHint: 9
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Clicker in waistcoat pocket: checked. 700 MHz Phenazepam trace on Slide 3: checked. Let\'s roll.',
    replySenderId: 'marcos_fernandez',
    replyText: 'Clean slides. Smash it.',
    hourHint: 10
  },
  {
    senderId: 'faiza_javaid',
    text: 'honestly nobody compares to the big-chuds, even when Lab 230 is 16 °C and the LC-MS is broken',
    replySenderId: 'daniel_richards',
    replyText: 'Sentiment noted and approved (no homo). Now go finish Slide 4.',
    hourHint: 17
  },
  {
    senderId: 'richard_spears',
    text: 'Have to say, flying business class to Australia ruined economy flights for life. Worth every penny.',
    replySenderId: 'daniel_richards',
    replyText: 'Peak Richard: sneaking Bettys tea bags into the business lounge.',
    hourHint: 14
  },
  {
    senderId: 'antoine_maruani',
    text: 'Salut les Chuds, café chez Gordon dans cinq minutes ?',
    replySenderId: 'daniel_richards',
    replyText: 'Oui vieux, save me an almond croissant and an espresso.',
    hourHint: 10
  },
  {
    senderId: 'daniel_richards',
    text: '07:50 and the central balance actually has zero silica dust on it. Morning Lab 230 hits different.',
    replySenderId: 'marcos_fernandez',
    replyText: 'Give Max and Antoine forty minutes and it will look like a snowy car park again.',
    hourHint: 8,
    vibe: 'morning'
  },
  {
    senderId: 'faiza_javaid',
    text: 'northern line suspended between camden and euston on a monday morning, why do i even bother',
    replySenderId: 'calise_bahou',
    replyText: 'Victoria Line is crawling too Daiza, walking from Warren Street in drizzle like a drowned rat.',
    hourHint: 9,
    vibe: 'monday'
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Staring at a blank ChemDraw page on Monday 08:45 trying to remember what molecule I was even making on Friday.',
    replySenderId: 'daniel_richards',
    replyText: 'Step one: open your lab book. Step two: drink strong coffee before touching glassware.',
    hourHint: 8,
    vibe: 'monday'
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Rain is horizontal outside Euston and my bus got overtaken by a bloke walking a bulldog. Great Tuesday.',
    replySenderId: 'joao_nogueira',
    replyText: 'Get to Gordon\'s Café immediately irmão, emergency pastel de nata and double espresso waiting.',
    hourHint: 8,
    vibe: 'morning'
  },
  {
    senderId: 'richard_spears',
    text: 'Kettle on 3F is descaled, fresh Bettys tea bags deployed, and I still wish it were Saturday.',
    replySenderId: 'maximillian_lee',
    replyText: 'Monday morning shouldn\'t be legally permitted before 10:00 Rich, keep that kettle warm.',
    hourHint: 9,
    vibe: 'monday'
  },
  {
    senderId: 'antoine_maruani',
    text: 'Eurostar delayed twenty minutes outside Ebbsfleet and the Northern Line died at King\'s Cross. Send actual coffee.',
    replySenderId: 'peter_szijj',
    replyText: 'Rough Monday start mon ami, I\'m just stepping onto the escalator at Euston myself!',
    hourHint: 9,
    vibe: 'monday'
  },
  {
    senderId: 'calise_bahou',
    text: '08:35 bench update: my 4 °C Herceptin tube is actually at 4 °C and nobody raided my Parafilm drawer!',
    replySenderId: 'daniel_richards',
    replyText: 'Small blessings Big C. Meanwhile someone already hid the 10 mL measuring cylinder.',
    hourHint: 8,
    vibe: 'morning'
  },
  {
    senderId: 'daniel_richards',
    text: 'Pepsin digest at pH 3.1 ticked along overnight without crashing out. Might even smile before 09:30.',
    replySenderId: 'joao_nogueira',
    replyText: 'Steady Dr Dan, save that optimism for when Kersti checks your LC-MS baseline!',
    hourHint: 8,
    vibe: 'morning'
  },
  {
    senderId: 'maximillian_lee',
    text: 'Walking up Gower Street behind someone carrying a Pret bag and a laptop. Peak Bloomsbury morning energy today.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Meanwhile I\'m in a waistcoat debating whether a third coffee counts as breakfast.',
    hourHint: 9,
    vibe: 'morning'
  },
  {
    senderId: 'faiza_javaid',
    text: 'train signal failure outside euston AGAIN, tell vijay i am spiritually present at the 2f bench pls',
    replySenderId: 'daniel_richards',
    replyText: 'Standard #HalfDayDaiza schedule — I\'ll put your beaker on the ice tray so it looks busy.',
    hourHint: 9,
    vibe: 'morning'
  },
  {
    senderId: 'peter_szijj',
    text: 'Note to self: staying up till 02:30 building a Polish-Lithuanian Commonwealth in HoI4 does NOT help Monday TLC spotting.',
    replySenderId: 'marcos_fernandez',
    replyText: 'Explains why your baseline spot looks like a cavalry flank attack.',
    hourHint: 10,
    vibe: 'monday'
  },
  {
    senderId: 'vijay_chudasama',
    text: 'Morning team — train ran early, read two manuscripts and cleared my inbox. How is Lab 230 looking?',
    replySenderId: 'daniel_richards',
    replyText: 'Specs on, balances wiped, and Marcos hasn\'t opened Cupboard 5 yet so morale is high!',
    hourHint: 9,
    vibe: 'monday'
  },
  {
    senderId: 'joao_nogueira',
    text: '10:25 warning: two minutes till the Gordon\'s Café espresso squad departs 2F. Gloves off, coats off!',
    replySenderId: 'antoine_maruani',
    replyText: 'Arriving at the spiral stairs now — if someone bought flat sliced croissants I\'m turning round.',
    hourHint: 10,
    vibe: 'morning'
  },
  {
    senderId: 'charlotte_coomber',
    text: 'Took three South London buses because the Northern Line melted down — does anyone on 2F have spare tea?',
    replySenderId: 'faiza_javaid',
    replyText: '3F kettle is right next to richard\'s biscuit tin charlotte, run before max clears the bourbons!',
    hourHint: 9,
    vibe: 'monday'
  },
  {
    senderId: 'marcos_fernandez',
    text: '08:45 Monday unlock complete. Heating in Lab 230 feels like an English bus shelter again — 16 °C on the wall gauge.',
    replySenderId: 'richard_spears',
    replyText: 'Keep a lab coat on over two jumpers, Marcos — my DMSO-d6 bottle froze solid last time.',
    hourHint: 8,
    vibe: 'monday'
  },
  {
    senderId: 'calise_bahou',
    text: 'Monday diet update: intermittent fasting starts right after this warm Gordon\'s Café sausage roll.',
    replySenderId: 'maximillian_lee',
    replyText: 'Strong start Samwise, that pastry lasted eleven minutes into your week.',
    hourHint: 9,
    vibe: 'monday'
  },
  {
    senderId: 'nafsika_forte',
    text: 'Need a Gordon\'s Café flat white before Baker bay sees me trying to pipette PBS into my coffee mug.',
    replySenderId: 'joao_nogueira',
    replyText: 'Right behind you Nafsika, saving you the sunny corner table downstairs!',
    hourHint: 10,
    vibe: 'morning'
  },
  {
    senderId: 'archie_wall',
    text: 'Central Line felt like a vacuum-packed Eppendorf this morning. Tell me someone put the 3F kettle on.',
    replySenderId: 'maximillian_lee',
    replyText: 'Richard beat you to it at 08:50 Archie, Yorkshire brew waiting upstairs.',
    hourHint: 9,
    vibe: 'morning'
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Monday poll: spend 25 minutes on RiskNET for 2 mL toluene or take up sheep farming in the Cotswolds?',
    replySenderId: 'calise_bahou',
    replyText: 'Sheep don\'t ask you to upload GHS pictograms in triplicate mate, count me in.',
    hourHint: 10,
    vibe: 'monday'
  },
  {
    senderId: 'daniel_richards',
    text: 'Nothing beats 08:05 quiet pipetting before the Sheppard bay stereo or Charlotte\'s morning commute story starts.',
    replySenderId: 'richard_spears',
    replyText: 'Peak morning serenity, Dan — already on cup two of Bettys gold.',
    hourHint: 8,
    vibe: 'morning'
  },
  {
    senderId: 'maximillian_lee',
    text: 'Brb spending twenty minutes hunting for a P1000 that actually clicks properly without leaking PBS onto my glove.',
    replySenderId: 'antoine_maruani',
    replyText: 'Check behind the gel tank, Max — someone stashed the good Gilson there yesterday.',
    hourHint: 10,
    vibe: 'morning'
  },
  {
    senderId: 'marco_sabatini',
    text: 'Buongiorno KLB — someone tried making instant coffee granules in a paper cup on 3F. I am calling the carabinieri.',
    replySenderId: 'antoine_maruani',
    replyText: 'Un vrai scandale Marco, meet us at Gordon\'s Café at 10:30 for actual caffeine.',
    hourHint: 9,
    vibe: 'morning'
  },
  {
    senderId: 'faiza_javaid',
    text: 'wait is the nmr keypad still 2145 or did estates change it over the weekend??',
    replySenderId: 'peter_szijj',
    replyText: 'Still 2145 Daiza! And 1965 for Kersti\'s door if you\'re doing a basement double run.',
    hourHint: 10
  },
  {
    senderId: 'joao_nogueira',
    text: 'Who took the last pastel de nata at Gordon\'s Café at 10:15?? Reveal yourself coward!',
    replySenderId: 'daniel_richards',
    replyText: 'Look at who arrived at 07:45 with a suspiciously flaky napkin on Desk 1.',
    hourHint: 10,
    vibe: 'morning'
  },
  {
    senderId: 'peter_szijj',
    text: 'Just spotted a pigeon inside Euston station riding the down escalator like a paying commuter.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Still more punctual than the Northern Line Charing Cross branch, ngl.',
    hourHint: 10
  },
  {
    senderId: 'richard_spears',
    text: 'Monday rain at King\'s Cross — forgot my umbrella, walked up Gower Street into sideways drizzle, now my lab coat feels like wet blotting paper.',
    replySenderId: 'calise_bahou',
    replyText: 'Hang it near the drying oven for five mins Rich, instant sauna.',
    hourHint: 9,
    vibe: 'monday'
  },
  {
    senderId: 'marcos_fernandez',
    text: '08:50 #headsup: Jamie Baker just locked his bike outside Gordon Street and looks very awake about safety specs today.',
    replySenderId: 'daniel_richards',
    replyText: 'Cheers Marcos — specs firmly glued to my face before I even touch the cold room.',
    hourHint: 8,
    vibe: 'morning'
  },
  {
    senderId: 'antoine_maruani',
    text: 'Monday morning motto: measure twice, desalt 10×, never trust an unlabelled fridge Eppendorf.',
    replySenderId: 'faiza_javaid',
    replyText: 'needed that reminder before i almost used 2016 mystery buffer tbh',
    hourHint: 10,
    vibe: 'monday'
  },
  {
    senderId: 'faiza_javaid',
    text: 'WHO STOLE THE BLUE ICE BUCKET FROM BAY 2?? my antibody is warming up faster than my patience pls',
    replySenderId: 'maximillian_lee',
    replyText: 'It\'s by the centrifuge with three lonely VivaSpins in it, don\'t tell Archie!',
    hourHint: 11
  },
  {
    senderId: 'calise_bahou',
    text: 'Has anyone seen the communal Parafilm roll? Last person who hid it in their drawer owes everyone Gordon\'s Café brownies.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Check behind Cupboard 6, someone tucked it next to the spare septa last week.',
    hourHint: 11
  },
  {
    senderId: 'maximillian_lee',
    text: 'Day 412 of asking: who keeps leaving empty tip boxes on the TCEP bench like decorative plastic art?',
    replySenderId: 'peter_szijj',
    replyText: 'Not me!! Also pls don\'t ask me to weigh fresh TCEP again while I\'m holding 20 gels.',
    hourHint: 11
  },
  {
    senderId: 'daniel_richards',
    text: 'Someone put a "DO NOT TOUCH" Post-it on a 50 mL Falcon tube dated March 2016. Should we donate it to the British Museum?',
    replySenderId: 'calise_bahou',
    replyText: 'Leave it alone Dan, whatever is growing inside probably pays UCL tuition fees by now.',
    hourHint: 11
  },
  {
    senderId: 'archie_wall',
    text: 'Whoever left the benchtop centrifuge unbalanced by 1.4 g — it nearly walked off the bench into Baker bay.',
    replySenderId: 'daniel_richards',
    replyText: 'Wasn\'t me Archie, my 40 nm gold preps are weighed to four decimal places out of pure paranoia!',
    hourHint: 11
  },
  {
    senderId: 'antoine_maruani',
    text: 'DTNB assay came back crystal colourless — zero leftover free thiols on the Fab. Ready for SPAAC click!',
    replySenderId: 'marcos_fernandez',
    replyText: 'Rare joy when Ellman\'s actually behaves instead of turning passive-aggressive yellow.',
    hourHint: 11
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Heads up before you start lunch prep: cracking open dodecanethiol in Cupboard 5 in three mins. Close your sash.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Appreciate the three-minute evacuation window Marcos, heading up to 3F now.',
    hourHint: 11
  },
  {
    senderId: 'richard_spears',
    text: 'Used bench-stable CDMP at pH 8.0 for dehydroalanine again — zero explosion risk and clean mass shift on LC-MS.',
    replySenderId: 'antoine_maruani',
    replyText: 'MSH stays banned forever in Lab 230. Safety Inspector would faint on sight.',
    hourHint: 12
  },
  {
    senderId: 'peter_szijj',
    text: 'Stared at my gel tank for twenty minutes wondering why the ladder hadn\'t moved before noticing the power switch was off!',
    replySenderId: 'faiza_javaid',
    replyText: 'literally did that twice last month peetah, blue dye sitting right at the top like modern art',
    hourHint: 14
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Sneezed three feet away from my 5.7 µL/min syringe pump and watched my heart rate hit 160 bpm.',
    replySenderId: 'joao_nogueira',
    replyText: 'Leave the hood sash down to the arrow and step away quietly André!',
    hourHint: 14
  },
  {
    senderId: 'joao_nogueira',
    text: 'Tween 80 at 0.05% literally rescued my VNAR–PLGA nanoparticles from floating on PBS like angry breadcrumbs.',
    replySenderId: 'calise_bahou',
    replyText: 'Surfactant magic mate, my hydrophobic diBrPD linkers owe half my thesis to 5% DMSO!',
    hourHint: 14
  },
  {
    senderId: 'marco_sabatini',
    text: 'London humidity today is 92% — had to flame-dry my borate amidation glassware twice before the air wet it again.',
    replySenderId: 'marcos_fernandez',
    replyText: 'Bloomsbury air basically counts as an aqueous workup by itself, Marco.',
    hourHint: 15
  },
  {
    senderId: 'maximillian_lee',
    text: 'Forgot to peel the green tape off the bottom of my precast SDS-PAGE gel for the third time this quarter. Classic silverback.',
    replySenderId: 'daniel_richards',
    replyText: 'Why does the gel box say 2 mA and zero movement, Max? Every single month.',
    hourHint: 15
  },
  {
    senderId: 'calise_bahou',
    text: 'Wait why did my VivaSpin concentration spreadsheet just tell me I recovered 118% of my initial Trastuzumab?!',
    replySenderId: 'peter_szijj',
    replyText: 'Check your dilution factor cell in Excel Big C!! You definitely multiplied by 2 twice!',
    hourHint: 15
  },
  {
    senderId: 'daniel_richards',
    text: 'Quenched the Pepsin Fab digest at 4 hours sharp — single clean 50 kDa band with zero over-digestion on the gel.',
    replySenderId: 'maximillian_lee',
    replyText: 'Clean Dr Dan! Meanwhile half my lane is still staring back at me at 150 kDa.',
    hourHint: 15
  },
  {
    senderId: 'faiza_javaid',
    text: 'who pinched the brass tweezers AND the metal spatula from Bay 1?? return them or i start locking my P10 in a safe',
    replySenderId: 'antoine_maruani',
    replyText: 'Check beside Büchi 2, someone was scraping yellow PD foam off a bump trap earlier.',
    hourHint: 15
  },
  {
    senderId: 'nafsika_forte',
    text: 'Pulled an unmarked Chudasama flask off Büchi 2 right before the water bath boiled it into caramel. You\'re welcome.',
    replySenderId: 'calise_bahou',
    replyText: 'Panic-checking my hood right now Nafsika — if that\'s mine I owe you pastries all week!',
    hourHint: 16
  },
  {
    senderId: 'richard_spears',
    text: 'Six hours into a GSH exchange kinetics run and the UV-vis cuvette actually stayed crystal clear without crashing out.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Should frame that absorbance trace on the 3F wall next to the Bettys tea caddy, Rich.',
    hourHint: 15
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Whoever finished the dry-ice dewar on 2F without refilling it from the basement owes me a functioning -78 °C bath.',
    replySenderId: 'marcos_fernandez',
    replyText: 'There is still a scoop left if you move fast, brb grabbing my Dewar first.',
    hourHint: 14
  },
  {
    senderId: 'antoine_maruani',
    text: 'Saw someone put 4 Å molecular sieves directly into a wet RB flask without oven-drying them first. Painful to watch.',
    replySenderId: 'richard_spears',
    replyText: 'Nothing like adding pre-hydrated gravel to your anhydrous THF reaction.',
    hourHint: 11
  },
  {
    senderId: 'charlotte_coomber',
    text: 'Just snapped four glass TLC capillaries in a row before 11:30 — Sheppard bay has officially run out of patience.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Borrow two from Chudasama bay Charlotte, in exchange for one working whiteboard marker.',
    hourHint: 11
  },
  {
    senderId: 'maximillian_lee',
    text: 'Blue Party Mix stained my gel bands so crisp you can read DAR 2.0 from across Lab 230. Best recipe in UCL Chemistry.',
    replySenderId: 'faiza_javaid',
    replyText: 'still convinced 30% of that recipe is pure coomassie magic and silverback vibes tbh',
    hourHint: 14
  },
  {
    senderId: 'joao_nogueira',
    text: 'WHO unplugged my nanoparticle stirring plate at the central bench to charge their phone?! Four hours of mixing gone!',
    replySenderId: 'maximillian_lee',
    replyText: 'Check the Baker bay extension lead — someone always swaps plugs without looking at the red tape!',
    hourHint: 16
  },
  {
    senderId: 'peter_szijj',
    text: 'Running Trastuzumab, Rituximab and OKT3 digests side by side — zero cross-contamination so far, touch wood!',
    replySenderId: 'daniel_richards',
    replyText: 'Double-check your Sharpie labels before touching the Protein A resin, Peetah.',
    hourHint: 16
  },
  {
    senderId: 'vijay_chudasama',
    text: 'Quick reminder from upstairs: make sure unreduced mAb controls are on your gels before Friday slides.',
    hourHint: 11
  },
  {
    senderId: 'daniel_richards',
    text: 'Found a 2014 amber bottle in Cupboard 19 labelled "X-24 maybe" in faded pencil. Put the lid back very gently.',
    replySenderId: 'antoine_maruani',
    replyText: 'Rule one of Cupboard 19: if the Parafilm turns yellow, back away slowly.',
    hourHint: 14
  },
  {
    senderId: 'calise_bahou',
    text: 'Pro tip from making gram-scale diBrPD acid: p-TsOH·H2O in toluene gives zero bromide exchange, unlike cursed TFA.',
    replySenderId: 'richard_spears',
    replyText: 'Saved me two days of mystery monobromo peaks last winter, Big C — absolute textbook tip.',
    hourHint: 14
  },
  {
    senderId: 'marcos_fernandez',
    text: 'My product rode straight up to Rf 0.92 in 100% hexane. Basically invented organic grease today.',
    replySenderId: 'calise_bahou',
    replyText: 'At least it elutes fast Marcos, my polar diBrPD acid needs half the methanol barrel in Cupboard 9!',
    hourHint: 15
  },
  {
    senderId: 'archie_wall',
    text: 'Doing a 12% non-reducing SDS-PAGE run in twenty mins — got two spare lanes if any Chud wants a quick look.',
    replySenderId: 'peter_szijj',
    replyText: 'YES PLS Archie!! Bringing 12 µL of my sialidase CiTE conjugate right over!',
    hourHint: 15
  },
  {
    senderId: 'faiza_javaid',
    text: '2F A280 bench is free for the next hour if anyone wants protein conc or DAR ratios checked before 5pm!',
    replySenderId: 'joao_nogueira',
    replyText: 'Legend Daiza, coming over with my VNAR–PLGA dialysis fraction right now!',
    hourHint: 16
  },
  {
    senderId: 'richard_spears',
    text: 'Monday\'s episode of Soluble or Not Soluble ended with 5% DMSO crashing my aryl-PD out like Alpine snow.',
    hourHint: 11,
    vibe: 'monday'
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Who swapped the blue 1000 µL pipette tip box for an empty cardboard shell on Bay 1? Pure psychological warfare.',
    replySenderId: 'maximillian_lee',
    replyText: 'Not guilty, I\'m still rationing the last three tips on my personal rack like gold dust.',
    hourHint: 16
  },
  {
    senderId: 'nafsika_forte',
    text: 'Just topped up the first-aid plasters in Baker bay after someone lost a duel with a snapped Pasteur pipette.',
    replySenderId: 'marcos_fernandez',
    replyText: 'Always use the cotton wool plugs and snap away from your glove, people.',
    hourHint: 15
  },
  {
    senderId: 'antoine_maruani',
    text: 'Cut P2 pipette tip + Sephadex G-25 slurry just desalted 40 µL Fab faster than booking the ÄKTA.',
    replySenderId: 'calise_bahou',
    replyText: '#Hackerman strikes again, saving my Spin-Filter budget singlehandedly!',
    hourHint: 16
  },
  {
    senderId: 'joao_nogueira',
    text: 'Store Street lunch vote: proper warm falafel wrap or are you monsters buying soggy supermarket triangle sandwiches again?',
    replySenderId: 'calise_bahou',
    replyText: 'Excuse me João, a £3.50 meal deal with chicken club, crisps and mango smoothie is elite economics.',
    hourHint: 12
  },
  {
    senderId: 'antoine_maruani',
    text: 'If anyone brings another cold cheese-and-ham toastie made out of sliced croissant to 3F I am resigning from UCL.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Stay strong Antoine, let\'s walk down to Store Street for proper warm Mediterranean wraps.',
    hourHint: 12
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Lunchtime poll: Store Street falafel & halloumi wrap vs Goodge Street ICCO pizza vs Torrington Square Thursday market?',
    replySenderId: 'joao_nogueira',
    replyText: 'Torrington Square hot food stalls every Thursday, Store Street Espresso the rest of the week!',
    hourHint: 13
  },
  {
    senderId: 'marco_sabatini',
    text: 'Saw someone snap dried spaghetti in half outside Store Street before lunch. Still recovering emotionally.',
    replySenderId: 'daniel_richards',
    replyText: 'Wait till you see how Max cooks baked beans in chorizo fat, Marco.',
    hourHint: 13
  },
  {
    senderId: 'maximillian_lee',
    text: 'Wait — remember when we survived an entire Heslington winter on Tesco meal deals and Martin Fascione\'s free seminar biscuits?',
    replySenderId: 'richard_spears',
    replyText: 'Simpler times, Max — though I still maintain Yorkshire tap water made that tea twice as good.',
    hourHint: 13
  },
  {
    senderId: 'faiza_javaid',
    text: 'pls stop sending close-up hummus and crispy chicken pics when i\'m stuck waiting on a 45-min desalting spin!!',
    replySenderId: 'maximillian_lee',
    replyText: 'No mercy Daiza, this Store Street salt beef bagel is singing.',
    hourHint: 13
  },
  {
    senderId: 'calise_bahou',
    text: 'Just bought a "chicken" wrap off Store Street and bit straight into spiced tofu. My day is measurably ruined.',
    replySenderId: 'daniel_richards',
    replyText: 'Karma for laughing at my egg and cress triangle sandwich, Big C.',
    hourHint: 12
  },
  {
    senderId: 'joao_nogueira',
    text: 'Brought homemade bacalhau com natas upstairs — meanwhile someone down on 2F is sipping Dr Pepper like it\'s medicine.',
    replySenderId: 'marco_sabatini',
    replyText: 'Madonna mia João, Dr Pepper smells like cough syrup and sadness. Save me a forkful!',
    hourHint: 13
  },
  {
    senderId: 'peter_szijj',
    text: '20 spicy nuggets and two large fries from Tottenham Court Road — zero regrets, 100% protein energy for afternoon gels.',
    replySenderId: 'antoine_maruani',
    replyText: 'At least three kilos of nuggets per week keeps the Szijj antibody factory running, mon ami.',
    hourHint: 13
  },
  {
    senderId: 'richard_spears',
    text: '3F kettle is boiled and I brought a fresh tin of Bettys Yorkshire shortbread if anyone wants proper post-lunch biscuits.',
    replySenderId: 'faiza_javaid',
    replyText: 'brb sprinting up the spiral stairs before max eats half the tin!!',
    hourHint: 12
  },
  {
    senderId: 'daniel_richards',
    text: 'Look João, I know food is a privilege, but sometimes a lazy Thursday calls for £3.50 meal deal efficiency.',
    replySenderId: 'joao_nogueira',
    replyText: 'Cold wet triangle bread is not efficiency Dan, it is a cry for help!',
    hourHint: 13,
    vibe: 'late_week'
  },
  {
    senderId: 'charlotte_coomber',
    text: 'Doing a quick Store Street coffee & pastry sprint at 12:15 — shout orders now before the queue stretches to Gower St!',
    replySenderId: 'calise_bahou',
    replyText: 'Hero Charlotte!! Grab me a warm sausage roll and an iced flat white pls!',
    hourHint: 12
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Checked the Gordon\'s Café counter at 12:40 — zero almond croissants left, only sorrow and lukewarm paninis.',
    replySenderId: 'peter_szijj',
    replyText: 'We move to Store Street then, grabbing proper Portuguese tarts or Korean rice bowls!',
    hourHint: 13
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Half of Store Street is queued outside the ramen bar and the other half is debating Yorkshire tea vs espresso.',
    replySenderId: 'nafsika_forte',
    replyText: 'Espresso wins every time Marcos — coming for a quick walk past Gordon Square?',
    hourHint: 13
  },
  {
    senderId: 'maximillian_lee',
    text: 'Hot take: Gordon\'s Café paninis slapped straight off the grill beat Store Street gourmet sourdough by pure value per pound.',
    replySenderId: 'joao_nogueira',
    replyText: 'Value per pound is not a Michelin criterion Max!!',
    hourHint: 12
  },
  {
    senderId: 'antoine_maruani',
    text: 'Smuggled 500 g of Maldon sea salt flakes back to Paris last weekend because French supermarket shelves had none.',
    replySenderId: 'richard_spears',
    replyText: 'Top-tier smuggling, Antoine — almost as vital as packing Bettys tea bags for Australia.',
    hourHint: 13
  },
  {
    senderId: 'calise_bahou',
    text: 'Quick heads up: someone left an unlabelled Tupperware of curry on 3F without a name. Brave soul eating that unguarded.',
    replySenderId: 'faiza_javaid',
    replyText: 'not mine!! mine is safely tucked at the back behind richard\'s tea caddy',
    hourHint: 13
  },
  {
    senderId: 'daniel_richards',
    text: 'Left my leftover pasta in the 3F fridge clearly labelled "BIOHAZARD: CONTAINS GARLIC" so nobody pinches it.',
    replySenderId: 'maximillian_lee',
    replyText: 'Bold of you to think a biohazard label slows down a hungry 160 kg silverback.',
    hourHint: 12
  },
  {
    senderId: 'joao_nogueira',
    text: 'Back from Store Street with extra piri-piri — reminded once again that British food fears seasoning like water fears dry THF.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Counterpoint: salt and vinegar crisps inside a ham sandwich is chaotic British engineering.',
    hourHint: 13
  },
  {
    senderId: 'peter_szijj',
    text: 'PSA again: Hungarian sóskifli is NOT a sad British croissant, it\'s salted crescent pastry perfection!',
    replySenderId: 'marco_sabatini',
    replyText: 'Approved by Italy and France alike, Little baby Peetah — better than cold triangle bread.',
    hourHint: 12
  },
  {
    senderId: 'nafsika_forte',
    text: 'Still baffled that half this WhatsApp group spent three consecutive days debating how to heat baked beans.',
    replySenderId: 'richard_spears',
    replyText: 'Wait until someone brings up whether toast needs butter before marmite, Nafsika.',
    hourHint: 13
  },
  {
    senderId: 'archie_wall',
    text: 'Whoever raided the 3F posh biscuit tin and left two broken ginger nuts and crumbs — Baker bay sees your sin.',
    replySenderId: 'calise_bahou',
    replyText: 'Wasn\'t me Archie, I\'m strictly on a post-steak-pie fast till 16:00!',
    hourHint: 12
  },
  {
    senderId: 'vijay_chudasama',
    text: 'Walking past Gordon\'s Café now — espresso queue looks brutal, is Store Street any quicker?',
    replySenderId: 'joao_nogueira',
    replyText: 'Store Street Espresso moves fast boss, saving you a spot if you want a double!',
    hourHint: 12
  },
  {
    senderId: 'faiza_javaid',
    text: 'honestly why do torrington square street-food queues double in length the exact second i leave 2f at 12:55',
    replySenderId: 'charlotte_coomber',
    replyText: 'Because everyone in Bloomsbury finishes lectures at 12:50 sharp — grab falafel on Store Street instead!',
    hourHint: 13
  },
  {
    senderId: 'faiza_javaid',
    text: 'kersti just wrote "LCMS is out of the operation — pls stop injecting PBS!!" in bright red bold in her email, who did it??',
    replySenderId: 'daniel_richards',
    replyText: 'Wasn\'t me! Always 10× VivaSpin desalt before touching LG11 unless you enjoy staring at Kersti\'s red error light.',
    hourHint: 14
  },
  {
    senderId: 'antoine_maruani',
    text: 'Checked 128.40.76.1 from 3F: 600 MHz queue is jammed behind twelve crude aromatic NMRs. Staying upstairs with tea.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Peak #Hackerman luxury, remember when we used to walk down three flights just to see "Queued"?',
    hourHint: 14
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Reviewer 2 just asked us to run four new cancer cell lines and a 28-day mouse PK study for a methodology communication.',
    replySenderId: 'peter_szijj',
    replyText: 'Classic unhinged Reviewer 2!! Next they\'ll want a Phase III clinical trial in the Supporting Info!',
    hourHint: 15
  },
  {
    senderId: 'richard_spears',
    text: 'Reviewer 1 complains "the authors omit aqueous stability at pH 7.4" — it is literally Figure 2B, Scheme 1, and Table S3.',
    replySenderId: 'antoine_maruani',
    replyText: 'Drafting "We thank the reviewer for this insightful comment, as shown in Figure 2B" through gritted teeth.',
    hourHint: 15
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Abil just emailed: three uncollected NMR tubes went straight into the LG1b sample fridge. £130 fine roulette begins.',
    replySenderId: 'calise_bahou',
    replyText: 'Sprinting down the stairs right now, pretty sure my diBrPD tube has been chilling there since Tuesday!',
    hourHint: 15
  },
  {
    senderId: 'maximillian_lee',
    text: 'Reviewer 3 wants a single-crystal X-ray structure of a 150 kDa pegylated antibody conjugate. Should I mail them a snowglobe?',
    replySenderId: 'daniel_richards',
    replyText: 'Tell them we respectfully defer to molecular dynamics and hope they enjoy the 60-page SI PDF.',
    hourHint: 16
  },
  {
    senderId: 'calise_bahou',
    text: 'Checked my Premier League fantasy points mid-column — captained the wrong striker AGAIN, down twenty-four points.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Don\'t even talk to me Calise, two of my midfielders got subbed off at 58 minutes.',
    hourHint: 15
  },
  {
    senderId: 'joao_nogueira',
    text: 'Benfica play tonight and I\'m already emotionally checked out of anything past 18:30. Let\'s gooo!',
    replySenderId: 'daniel_richards',
    replyText: 'Meanwhile Burnley managed to make a 1–0 win feel like three days of dental surgery.',
    hourHint: 15
  },
  {
    senderId: 'peter_szijj',
    text: 'Anyone else watching F1 qualifying highlights at their 3F desk or am I the only one procrastinating on ChemDraw?',
    replySenderId: 'maximillian_lee',
    replyText: 'Ferrari strategy team runs on the same logic as unbuffered room-temp TCEP, pure comedy.',
    hourHint: 16
  },
  {
    senderId: 'charlotte_coomber',
    text: 'Need two more big brains for Thursday night pub quiz! Currently lacking anyone who knows geography or 90s pop.',
    replySenderId: 'marcos_fernandez',
    replyText: 'I\'ll cover geography, Silmarillion lore, and random Spanish kings if Richard covers Yorkshire.',
    hourHint: 15,
    vibe: 'late_week'
  },
  {
    senderId: 'daniel_richards',
    text: 'Walked into LG11 to smooth over a jammed autosampler needle with Kersti — gave her a chocolate biscuit, crisis averted.',
    replySenderId: 'faiza_javaid',
    replyText: 'diplomatic immunity unlocked!! tell her my mmae-igg4 vial is 10× desalted i swear',
    hourHint: 14
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Reset the clock lads: Richard just slipped "proper Yorkshire water" into a casual 700 MHz shimming chat.',
    replySenderId: 'richard_spears',
    replyText: 'Soft Pennine water makes superior tea AND superior baseline shims, André — proven fact.',
    hourHint: 16
  },
  {
    senderId: 'antoine_maruani',
    text: 'Just spotted a suspicious +69 Da acetonitrile adduct on a crude trace. #AskAntoine clinic is officially open for business.',
    replySenderId: 'daniel_richards',
    replyText: 'On my way up with three cursed deconvolutions and a lukewarm mug of tea.',
    hourHint: 15
  },
  {
    senderId: 'faiza_javaid',
    text: '15:45 slump hitting hard — is it socially acceptable to go back to Gordon\'s Café for a second iced oat latte?',
    replySenderId: 'calise_bahou',
    replyText: 'Doctor\'s orders Daiza, grab me an espresso shot while you\'re down there pls!',
    hourHint: 16
  },
  {
    senderId: 'marco_sabatini',
    text: 'A quick spritz of "Sabatini by Sabatini" before heading down to Abil\'s NMR room. Presentation counts, mon ami.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Between my waistcoat and your cologne, KLB is singlehandedly raising UCL\'s style index.',
    hourHint: 14
  },
  {
    senderId: 'richard_spears',
    text: 'Prep TLC plate finally separated those two diastereomers by 2 mm — zero shame, taking that win straight onto Slide 3.',
    replySenderId: 'joao_nogueira',
    replyText: 'Prep TLC rescues PhDs where Biotage gradients fear to tread, Rich!',
    hourHint: 16,
    vibe: 'late_week'
  },
  {
    senderId: 'maximillian_lee',
    text: 'Wait how did this referee give a penalty for THAT?! VAR is less reliable than an uncalibrated Biotage UV detector.',
    replySenderId: 'calise_bahou',
    replyText: 'My fantasy clean-sheet bonus evaporated in ninety seconds flat mate, pure pain.',
    hourHint: 14
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Thursday afternoon slump poll: finish the SiO2 plug or argue about F1 tyre compounds on 3F for 20 mins?',
    replySenderId: 'antoine_maruani',
    replyText: 'Mediums into hards after safety car, AND finish the plug while we argue.',
    hourHint: 16,
    vibe: 'late_week'
  },
  {
    senderId: 'vijay_chudasama',
    text: 'Spurs somehow conceded in the 92nd minute again. Not even checking the football chat until Monday.',
    replySenderId: 'faiza_javaid',
    replyText: 'still have no idea what an offside is boss, hope your coffee helps!!',
    hourHint: 15
  },
  {
    senderId: 'archie_wall',
    text: 'Champions League kick-off at 20:00 — anybody trying to run a last-minute 18:00 column is on their own tonight!',
    replySenderId: 'joao_nogueira',
    replyText: 'I feel personally attacked Archie, my Biotage rack is already loaded!',
    hourHint: 17,
    vibe: 'evening'
  },
  {
    senderId: 'peter_szijj',
    text: 'S. typhimurium sialidase completely sulked at pH 5.0 again — strictly pH 7.0 PBS for every CiTE click from now on!',
    replySenderId: 'daniel_richards',
    replyText: 'Enzymes are worse divas than Premier League wingers, Peetah.',
    hourHint: 15
  },
  {
    senderId: 'joao_nogueira',
    text: '11 kDa shark VNAR E4 cleaved and dialysed cleanly — zero precipitate in the cassette for once, vamos!!',
    replySenderId: 'faiza_javaid',
    replyText: 'rare dialysis win jcfn!! bring it over to the 2f spec if u want an a280 check',
    hourHint: 14
  },
  {
    senderId: 'daniel_richards',
    text: 'Left my lunch thermos on 3F and nearly forgot it again. Brain is 90% Fab digest stoichiometry right now.',
    replySenderId: 'peter_szijj',
    replyText: 'Grandad Dan memory kicking in early today, I\'ll guard it from Max!',
    hourHint: 16
  },
  {
    senderId: 'calise_bahou',
    text: 'Zero green Keck clips left on the whole 2F drying rack — who has been hoarding every B24 clip in their hood?!',
    replySenderId: 'marcos_fernandez',
    replyText: 'Check behind Antoine\'s Biotage, he had five clipped to his solvent trap like jewellery.',
    hourHint: 16
  },
  {
    senderId: 'andre_shamsabadi',
    text: '-78 °C TBAT aryne addition actually behaved without quenching on stray moisture. Oven-dried glassware supremacy.',
    replySenderId: 'peter_szijj',
    replyText: 'Don\'t tell Reviewer 2 it worked cleanly on the first go, they\'ll demand 18 substrate derivatives!',
    hourHint: 15
  },
  {
    senderId: 'nafsika_forte',
    text: 'Someone left the -20 °C freezer drawer cracked open half an inch on 2F — pushed it shut before the alarm went.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Guardian angel of the shared bay Nafsika, saving forty antibody stocks in one push.',
    hourHint: 16
  },
  {
    senderId: 'charlotte_coomber',
    text: 'Still collecting £2 coins at Sheppard bay for the leaving card — check your lab coat pockets lads!',
    replySenderId: 'richard_spears',
    replyText: 'Just found two pound coins and three Yorkshire tea bags in mine, dropping by shortly!',
    hourHint: 16
  },
  {
    senderId: 'antoine_maruani',
    text: 'Note from the Q-TOF queue: if your baseline looks like the Alps, please do NOT press Submit Three More Times.',
    hourHint: 14
  },
  {
    senderId: 'maximillian_lee',
    text: 'Whoever keeps stealing my 200 µL tip rack from Bay 1 — may your next silica column co-elute completely.',
    hourHint: 16
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Reviewer 1 wrote "incremental advance" in a three-sentence report after sitting on the manuscript for eleven weeks. Lovely.',
    hourHint: 15
  },
  {
    senderId: 'faiza_javaid',
    text: 'my confocal laser literally picked friday eve energy at 14:30 on a wednesday and just refused to focus',
    hourHint: 14,
    vibe: 'late_week'
  },
  {
    senderId: 'calise_bahou',
    text: 'Anyone else\'s brain turn into lukewarm PBS on Monday afternoon between 15:30 and 16:30 or just me?',
    hourHint: 16,
    vibe: 'monday'
  },
  {
    senderId: 'charlotte_coomber',
    text: 'Booked a big table at the Marlborough Arms for 17:30 Friday! No excuses about still running columns!',
    replySenderId: 'calise_bahou',
    replyText: 'Say less Charlotte!! First round at Marlborough Arms is locked in.',
    hourHint: 17,
    vibe: 'late_week'
  },
  {
    senderId: 'daniel_richards',
    text: 'Thursday 17:10 slide check: who actually has four clean ChemDraw figures and who is exporting blurry phone photos of TLC plates?',
    replySenderId: 'andre_shamsabadi',
    replyText: '2.5 slides complete, clicker located on 3F, resting the other 1.5 slides on sheer waistcoat confidence.',
    hourHint: 17,
    vibe: 'late_week'
  },
  {
    senderId: 'peter_szijj',
    text: 'AoE2 Black Forest lobby spinning up at 17:45 on 3F — Franks Knights vs Magyar Hussars, no excuses!',
    replySenderId: 'antoine_maruani',
    replyText: 'Wait for Faiza to finish her plate read so we can play FarmVille protection rules again.',
    hourHint: 17,
    vibe: 'evening'
  },
  {
    senderId: 'maximillian_lee',
    text: 'Worms Armageddon tonight after 18:00 — one clean ninja-rope drop and I am sending everyone straight into the drink.',
    replySenderId: 'peter_szijj',
    replyText: 'Bold talk for someone who blew up his own worm with a banana bomb last Thursday!',
    hourHint: 17,
    vibe: 'evening'
  },
  {
    senderId: 'joao_nogueira',
    text: '17:35 and I am loading a 24 g Biotage silica cartridge for a DCM/MeOH gradient. Pray for my energy levels irmãos!',
    replySenderId: 'daniel_richards',
    replyText: 'Pure madness JCFN, I am closing my lab book in twenty minutes sharp.',
    hourHint: 17,
    vibe: 'evening'
  },
  {
    senderId: 'marcos_fernandez',
    text: 'Who is heading to the Euston Tap beer garden after Friday\'s 09:00 audit? Need fresh air and craft pints.',
    replySenderId: 'richard_spears',
    replyText: 'Count me in for one civilised pint at Euston Tap, Marcos — then home in time for supper!',
    hourHint: 17,
    vibe: 'late_week'
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Wait are we starting at Marlborough Arms or Carpenter\'s Arms tonight? Asking before I pack my umbrella.',
    replySenderId: 'charlotte_coomber',
    replyText: 'Carpenter\'s Arms for the cosy upstairs booths first, then maybe Euston Tap for the late crew!',
    hourHint: 18,
    vibe: 'late_week'
  },
  {
    senderId: 'faiza_javaid',
    text: 'slide 4 finally looks half decent!! if vijay says "suboptimal" tomorrow i am moving straight to carpenter\'s arms at 10am',
    replySenderId: 'maximillian_lee',
    replyText: 'Save me a seat by the fireplace Daiza, we\'ll toast clean DAR 4.0!',
    hourHint: 17,
    vibe: 'late_week'
  },
  {
    senderId: 'daniel_richards',
    text: '18:00 curfew alarm just went off. Lab coat hung up, Argon shut, grandad mode activated. Night Lab 230!',
    replySenderId: 'richard_spears',
    replyText: 'Right behind you Dan — kettle switched off on 3F and heading toward Euston now.',
    hourHint: 18,
    vibe: 'evening'
  },
  {
    senderId: 'peter_szijj',
    text: '19:10 in Lab 230 — Concerning Hobbits playing gently on the speakers while Superdex hits the final peak!',
    replySenderId: 'nafsika_forte',
    replyText: 'Peak evening lab peace Peter — finishing my last Baker column wash and locking up behind you.',
    hourHint: 19,
    vibe: 'evening'
  },
  {
    senderId: 'calise_bahou',
    text: 'Surviving Thursday means we\'re only one 09:00 Group Meeting away from Euston Tap pints bois!!',
    replySenderId: 'joao_nogueira',
    replyText: 'Keep pushing Big C — one clean HHLL gel lane and we celebrate properly tomorrow!',
    hourHint: 17,
    vibe: 'late_week'
  },
  {
    senderId: 'marcos_fernandez',
    text: '17:17 perimeter report: coast looks suspiciously quiet near the 2F lift. Keep headphones off for two mins.',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Copy that chief scout, sliding my laptop discreetly upstairs to 3F.',
    hourHint: 17,
    vibe: 'evening'
  },
  {
    senderId: 'antoine_maruani',
    text: 'Craving rich tonkotsu ramen with extra chashu and kaedama after today\'s column drama. Ippudo at 18:30?',
    replySenderId: 'andre_shamsabadi',
    replyText: 'Locked in mon ami, washing the silica off my hands right now.',
    hourHint: 18,
    vibe: 'evening'
  },
  {
    senderId: 'vijay_chudasama',
    text: 'Good momentum across the bays this week everyone — keep slides crisp for Friday 09:00 and enjoy the weekend pints!',
    replySenderId: 'daniel_richards',
    replyText: 'Cheers Vijay — Marlborough Arms debrief pencilled in straight after lunch!',
    hourHint: 17,
    vibe: 'late_week'
  },
  {
    senderId: 'richard_spears',
    text: 'Wait until you hear Max and André arguing over CK3 dynasties at Carpenter\'s Arms after two pints.',
    replySenderId: 'calise_bahou',
    replyText: 'Beats watching João cry over his Biotage cartridge at 18:15 mate, see you at the bar!',
    hourHint: 18,
    vibe: 'late_week'
  },
  {
    senderId: 'maximillian_lee',
    text: 'Closing my laptop at 18:10 before another spider claims my 3F desk. Who\'s actually at Euston Tap already?',
    replySenderId: 'faiza_javaid',
    replyText: 'calise and charlotte literally just grabbed an outdoor bench by the taproom door, run!!',
    hourHint: 18,
    vibe: 'evening'
  },
  {
    senderId: 'peter_szijj',
    text: '19:20 and Lab 230 is dead silent except for my Superdex pump clicking. Time to grab twenty spicy nuggets on Tottenham Court Road.',
    replySenderId: 'marcos_fernandez',
    replyText: 'Lock the 2F sash and get out before the 19:30 porter sweeps the corridor, Peetah.',
    hourHint: 19,
    vibe: 'evening'
  },
  {
    senderId: 'joao_nogueira',
    text: 'Friday afternoon energy!! First round at Carpenter\'s Arms or Marlborough Arms once everyone clears LG11?',
    replySenderId: 'antoine_maruani',
    replyText: 'Marlborough Arms first so the Baker and Sheppard crews can join straight from KLB!',
    hourHint: 18,
    vibe: 'late_week'
  },
  {
    senderId: 'nafsika_forte',
    text: '18:25 Baker bay check: left a clean aliquot of anhydrous DMF in Bay 2 if anyone is stuck doing late-shift clicks!',
    replySenderId: 'peter_szijj',
    replyText: 'Actual guardian angel of Lab 230 Nafsika, owe you two espressos tomorrow!',
    hourHint: 18,
    vibe: 'evening'
  },
  {
    senderId: 'andre_shamsabadi',
    text: 'Stellaris multiplayer lobby opening at 21:00 — anybody still trapped in KLB past 19:00?',
    replySenderId: 'peter_szijj',
    replyText: 'Packing up my SynAb tubes now, my galactic empire will be online by 20:45!',
    hourHint: 19,
    vibe: 'evening'
  },
  {
    senderId: 'calise_bahou',
    text: '17:20 fridge sweep: shut both 4 °C doors properly and rescued somebody\'s unlabelled falcon tube from tipping over!',
    replySenderId: 'daniel_richards',
    replyText: 'Heroic late-afternoon citizenship Big C, now get off the bench before 18:00!',
    hourHint: 17,
    vibe: 'evening'
  },
  {
    senderId: 'richard_spears',
    text: 'Just stepped onto Gower Street at 18:05 — zero rain, clear sky, and quiet dinner plans before ten. Bliss.',
    replySenderId: 'maximillian_lee',
    replyText: 'Enjoy your slippers and Bettys tea, grandad Rich — evening shift holds the fort!',
    hourHint: 18,
    vibe: 'evening'
  }
];

// ============================================================================
// 3. UNLOCKABLE RUN MUTATORS FOR KLB ARCHIVE LOGBOOK (5 Mutators)
// ============================================================================
window.KLB.MUTATORS = [
  {
    id: 'vijays_not_in',
    name: "#VijaysNotIn (Conference Week)",
    tag: '#VijaysNotIn',
    desc: 'Prof. Vijay Chudasama is away at an international bioconjugation conference: zero surprise Vijay bench rounds or Lab 230 walkthroughs before Friday\'s 0–10 Audit.',
    unlockHint: 'Pass Friday\'s Solo Vijay Audit with ≥ 6.5 / 10.0 on any Big-Chud.',
    modifiers: {
      disableVijayBenchRounds: true
    }
  },
  {
    id: 'lcms_chaos',
    name: '50% LC-MS Chaos ("Out of the Operation")',
    tag: 'uplc2011 Chaos',
    desc: 'Someone keeps injecting PEG-400 into CIB LG11: 50% chance the Q-TOF starts the week offline, 50% higher chance of daily "LCMS is out of the operation" downtime, and 2.5× NPC submission glitches.',
    unlockHint: 'Survive a Kersti LG11 downtime event and still score ≥ 7.0 on Friday.',
    modifiers: {
      lcmsFailureChance: 0.5,
      lcmsHazardRateMult: 1.5
    }
  },
  {
    id: 'eternal_heatwave',
    name: 'Eternal 30 °C May Heatwave',
    tag: '30 °C Lab 230',
    desc: 'KLB 2nd Floor HVAC is jammed in full Bloomsbury summer greenhouse mode (30 °C all week): sweet-spot reaction windows shrink by 20% and 4 °C fridge steps risk thermal drift.',
    unlockHint: 'Complete Calise Bahou\'s or Daniel Richards\'s campaign with >90% homogeneity.',
    modifiers: {
      forcedLabTempC: 30,
      sweetSpotMult: 0.8
    }
  },
  {
    id: 'infinite_espresso',
    name: "Infinite Gordon's Double Espresso",
    tag: '25 Gordon St VIP',
    desc: 'João has negotiated an unlimited Big-Chuds espresso tab at Gordon\'s Café: 45% slower Energy drain across every shift and brisker Big-Chuds walking pace around KLB.',
    unlockHint: 'Rally 3+ Gordon\'s Café 10:27 coffee runs in a single week.',
    modifiers: {
      energyDrainMult: 0.55,
      npcWalkSpeed: 3.4
    }
  },
  {
    id: 'strict_coshh',
    name: 'Zero-Tolerance Departmental COSHH',
    tag: 'Strict COSHH',
    desc: 'Prof. Claire Carmalt & the Safety Inspector run 2× more frequent walkthroughs (Specs ON, Headphones OFF, Lab Condition ≥ 40) with 2× sweep fines, and unsafe protocol or event choices inflict a 1.5× Lab Condition penalty.',
    unlockHint: 'Finish a 5-day week with ≥ 90 Lab Condition and zero COSHH infractions.',
    modifiers: {
      inspectionWeightMult: 2.0,
      safetyPenaltyMult: 1.5
    }
  }
];

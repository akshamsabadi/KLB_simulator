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
        moraleDelta: 14,
        safetyDelta: 0,
        energyDelta: 18,
        socialDelta: 6,
        favourDelta: 2,
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
    whatsappMsg: 'Heads up, Kersti in LG11 just flagged the Q-TOF: "LCMS is out of the operation — PLRP-S column needs conditioning and mobile-phase flushing to clear PEG and salt. Desalt 10x before queuing."',
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
    actorId: 'faiza_javaid',
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
        moraleDelta: 16,
        safetyDelta: 0,
        energyDelta: 26,
        socialDelta: 8,
        patienceDelta: 2,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Flat whites and pastries at Gordon\'s recharge Energy, Morale, and Social.'
      },
      {
        label: 'Ask João for a takeaway espresso (1 Favour)',
        favourCost: 1,
        moraleDelta: 7,
        safetyDelta: 2,
        energyDelta: 16,
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
    whatsappMsg: 'Mon dieu who opened Cupboard 5 without bleaching their pipette?! It smells like a leaking gas main in Paris!',
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
        moraleDelta: 12,
        safetyDelta: 5,
        energyDelta: 8,
        socialDelta: 4,
        favourDelta: 0,
        timeCostMins: 0,
        resultText: 'Nafsika catches your reaction window and slides over pristine dry DMF.'
      },
      {
        label: 'Bring Nafsika tea for holding down 230',
        moraleDelta: 9,
        safetyDelta: 3,
        energyDelta: -4,
        socialDelta: 8,
        favourDelta: 2,
        timeCostMins: 0,
        resultText: 'Nafsika thanks you warmly and backs you up with two Lab Favours.'
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
    title: '14 Bargain Lemons Loose Near KLB 2F Fridge!',
    category: 'social',
    weight: 7,
    minDay: 0,
    validRooms: ['klb_2f'],
    actorId: 'calise_bahou',
    whatsappSender: 'calise_bahou',
    whatsappMsg: 'FFS the net bag split near the 2F fridge and spiral stairs — 14 lemons are rolling past the Biotage (DAN BOUGHT THEM I JUST CARRIED THEM)',
    bannerText: 'Fourteen lemons burst from Calise\'s bag across the KLB 2F fridge and spiral stairs aisle.',
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
        resultText: 'Zero slip hazards near the fridge and Calise gifts you a lucky lemon.'
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
    whatsappMsg: 'EMERGENCY ON 3F. Eight-legged Shelob the size of a coaster on the Chud write-up chair. Burn Office 349 down immediately.',
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
        moraleDelta: 12,
        safetyDelta: 0,
        energyDelta: 14,
        socialDelta: 5,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Tin whistles carry your evening Biotage fractions cleanly home.'
      },
      {
        label: 'Queue Bridge of Khazad-dûm for centrifugation',
        moraleDelta: 10,
        safetyDelta: 0,
        energyDelta: 10,
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
        moraleDelta: 24,
        safetyDelta: 0,
        energyDelta: 10,
        socialDelta: 10,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Faiza walls berry bushes while Antoine lands a crazy ninja-rope shot.'
      },
      {
        label: 'Spectate one round from 3F with a biscuit',
        moraleDelta: 9,
        safetyDelta: 0,
        energyDelta: 5,
        socialDelta: 5,
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
        moraleDelta: 12,
        safetyDelta: 0,
        energyDelta: 12,
        socialDelta: 8,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'French-Portuguese pastry diplomacy restores peace at Gordon\'s Café.'
      },
      {
        label: 'Defend the toasted cheese croissant',
        moraleDelta: 8,
        safetyDelta: 0,
        energyDelta: 8,
        socialDelta: 4,
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
        moraleDelta: 8,
        safetyDelta: 2,
        energyDelta: 4,
        socialDelta: 6,
        patienceDelta: 2,
        favourDelta: 1,
        timeCostMins: 0,
        resultText: 'Fast QC check strengthens Baker and Chudasama cross-bay harmony.'
      },
      {
        label: 'Ask Archie to prep and run your Lanes 9–10 sample (1 Favour)',
        favourCost: 1,
        moraleDelta: 10,
        safetyDelta: 3,
        energyDelta: 8,
        socialDelta: 4,
        patienceDelta: 4,
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
        moraleDelta: 11,
        safetyDelta: 0,
        energyDelta: 18,
        socialDelta: 6,
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
    title: 'North Bench Ether Smell in Lab 230!',
    category: 'facility',
    weight: 6,
    minDay: 1,
    validRooms: ['klb_2f'],
    actorId: 'marcos_fernandez',
    whatsappSender: 'marcos_fernandez',
    whatsappMsg: 'Strong diethyl ether fumes wafting from the north bench near Cupboard 20 — somebody left a rinse flask uncapped!',
    bannerText: 'Diethyl ether fumes are building up along the north bench inside Lab 230.',
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
        resultText: 'Solvent haze lingers across the north bench until Marcos caps it.'
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
// 2. LIVE "BIG-CHUDS" WHATSAPP IDLE BANTER & 2-MESSAGE EXCHANGES (64 Items)
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
    text: 'Someone put a sliced ham-and-cheese croissant in the 3F microwave. I am calling the French embassy.',
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
    replyText: '86% yield in 1 mL tap water says both, mon ami.',
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
    text: 'Just microwaved beans for 3.5 minutes upstairs — the idea of cooking them in a saucepan genuinely unsettles me.',
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
    text: '#AskAntoine clinic is open at Desk 3 — bring me your cursed +69 Da acetonitrile adducts and scrambled gels.',
    replySenderId: 'daniel_richards',
    replyText: '#Dantoine4life (strictly scientific, no homo).',
    hourHint: 15
  },
  {
    senderId: 'peter_szijj',
    text: 'Just had a mini heart attack thinking I pipetted 2 µL of 6× blue LDS dye into my pure SynAb stock instead of the PCR tube, crisis averted!',
    replySenderId: 'maximillian_lee',
    replyText: 'CLOSE THE LID ON THE MASTER STOCK FIRST PEEETAH',
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
    replyText: 'Hold the fort Peeetah — Nafsika is an absolute legend for holding down the Baker bay till 19:45!',
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
    text: '19:25 — locking up the Chudasama hoods, checking Argon cylinders & walking out of KLB to Intro by The XX. Night Chuds!!',
    replySenderId: 'antoine_maruani',
    replyText: 'Bonne nuit Peeetah! Smash Friday Group Meeting tomorrow.',
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
    text: 'honestly nobody compares to the big-chuds, even when Lab 230 is 16 degrees and the LC-MS is broken',
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
    text: 'Bonjour les chuds, café à Gordon dans cinq minutes?',
    replySenderId: 'daniel_richards',
    replyText: 'Oui mon ami, save me an almond croissant and an espresso.',
    hourHint: 10
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
    desc: 'Prof. Vijay Chudasama is away at an international bioconjugation conference Mon–Thu: zero surprise bench rounds in Lab 230 and +20% Morale from Gordon\'s/3F breaks, but Friday\'s solo 0–10 Audit demands +1.0 stricter Analytical Rigor!',
    unlockHint: 'Pass Friday\'s Solo Vijay Audit with ≥ 6.5 / 10.0 on any Big-Chud.',
    modifiers: {
      disableVijayBenchRounds: true,
      socialMoraleMult: 1.2,
      fridayRigorThresholdBonus: 1.0
    }
  },
  {
    id: 'lcms_chaos',
    name: '50% LC-MS Chaos ("Out of the Operation")',
    tag: 'uplc2011 Chaos',
    desc: 'Someone keeps injecting PEG-400 into CIB LG11: 50% higher chance of "LCMS is out of the operation" downtime, but every successfully desalted LG11 run grants +15% Purity & +0.75 bonus Analytical Rigor!',
    unlockHint: 'Survive a Kersti LG11 downtime event and still score ≥ 7.0 on Friday.',
    modifiers: {
      lcmsFailureChance: 0.5,
      lcmsPurityBonus: 15,
      auditRigorBonus: 0.75
    }
  },
  {
    id: 'eternal_heatwave',
    name: 'Eternal 30 °C May Heatwave',
    tag: '30 °C Lab 230',
    desc: 'KLB 2nd Floor HVAC is jammed in full Bloomsbury summer greenhouse mode (30 °C all week): sweet-spot reaction windows shrink by 20% and 4 °C fridges need attentive doors, but Gordon\'s iced coffees restore 2× Energy!',
    unlockHint: 'Complete Calise Bahou\'s or Daniel Richards\'s campaign with >90% homogeneity.',
    modifiers: {
      forcedLabTempC: 30,
      sweetSpotMult: 0.8,
      gordonsEnergyMult: 2.0
    }
  },
  {
    id: 'infinite_espresso',
    name: "Infinite Gordon's Double Espresso",
    tag: '25 Gordon St VIP',
    desc: 'João has negotiated an unlimited Big-Chuds espresso tab at Gordon\'s Café: +25% walking & bench reaction speed and immunity to low-Energy fumbles, though jittery hands narrow minigame timing zones by 15%!',
    unlockHint: 'Rally 3+ Gordon\'s Café 10:27 coffee runs in a single week.',
    modifiers: {
      walkSpeedMult: 1.25,
      reactionSpeedMult: 1.25,
      minigameZoneMult: 0.85,
      preventLowEnergyFumbles: true
    }
  },
  {
    id: 'strict_coshh',
    name: 'Zero-Tolerance Departmental COSHH',
    tag: 'Strict COSHH',
    desc: 'Prof. Claire Carmalt & the Safety Inspector run daily walkthroughs (Specs ON, Headphones OFF, Lab Condition ≥ 40) and infractions cost 2× Lab Condition points — maintaining ≥ 85 Lab Condition through Friday awards an automatic full 1.0/1.0 KLB Citizenship + +1.0 Rigor bonus!',
    unlockHint: 'Finish a 5-day week with ≥ 90 Lab Condition and zero COSHH infractions.',
    modifiers: {
      inspectionWeightMult: 2.0,
      safetyPenaltyMult: 2.0,
      highSafetyAuditBonus: 1.0
    }
  }
];

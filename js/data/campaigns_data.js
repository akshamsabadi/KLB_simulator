// Authentic 5-Step Weekly Research Campaigns for All 10 Playable Big-Chuds
// Drawn from published Chudasama Group (UCL Chemistry, KLB) Methods & Supporting Information
window.KLB = window.KLB || {};

window.KLB.CAMPAIGNS = {
  // =========================================================================
  // 1. DANIEL RICHARDS - Fab Digests, #BCN4Life PD & 40 nm AuNP Lateral Flow
  // =========================================================================
  daniel_richards: {
    charId: 'daniel_richards',
    title: 'Fab Pyridazinedione Rebridging & AuNP Lateral-Flow Biosensor',
    manuscriptTopic: 'Fab Pyridazinedione & AuNP Lateral Flow SI',
    paperRef: 'Richards, Szijj, Nogueira & Chudasama et al., Nanoscale 2021, 13, 11921 (DOI: 10.1039/d1nr02584h); Richards, Nogueira, Fernández & Chudasama et al., Chem. Sci. 2018, 9, 790 (DOI: 10.1039/c7sc02747h)',
    overview: 'Digest Trastuzumab into Fab, rebridge with BCN-PD, and build AuNP lateral-flow strips.',
    steps: [
      {
        index: 0,
        id: 'dan_step_1',
        dayHint: 'Mon',
        title: 'Digest Trastuzumab to Fab',
        desc: 'Cleave antibody with pepsin then papain and check pure Fab by gel.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'dan_1_1',
            label: 'Collect antibody from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_1_2',
            label: 'Weigh pepsin and buffer',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_1_3',
            label: 'Run sequential Fab digest',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_1_4',
            label: 'Spin and desalt Fab',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_1_5',
            label: 'Load SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_1_6',
            label: 'View SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which pepsin/papain conditions yield pure FabHER2?',
          options: [
            {
              label: 'Pepsin pH 3.1, then DTT-washed papain pH 6.8',
              isOptimal: true,
              yieldMod: 9,
              purityMod: 11,
              safetyMod: 2,
              outcomeText: 'Clean 48 kDa Fab with intact internal disulfide.'
            },
            {
              label: 'Pepsin pH 3.1, then unwashed 5 mM Cys papain',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Carryover cysteine partially cleaves Fab chains.'
            },
            {
              label: 'Pepsin pH 4.2, then papain at pH 7.4 for 6 h',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Incomplete Fc cleavage lowers Fab recovery.'
            },
            {
              label: 'One-step papain plus Protein A capture column',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Trastuzumab VH3 binds Protein A and loses Fab.'
            }
          ],
          askChudsHint: 'Peter: Avoid Protein A capture on VH3 Herceptin; keep sequential digests buffered and free of soluble reductant.',
          antoineHint: 'Antoine: Two-step cleavage at acidic pepsin pH followed by washed immobilised papain preserves the Fab disulfide.'
        },
        dataOutput: {
          type: 'gel',
          label: '12% Non-Reducing SDS-PAGE: Sequential FabHER2 Digest',
          productPeak: 'Single crisp 48 kDa FabHER2 band (150 kDa IgG consumed)',
          metricLabel: '91% Fab recovery, 96% band purity'
        }
      },
      {
        index: 1,
        id: 'dan_step_2',
        dayHint: 'Tue',
        title: 'Synthesise BCN-PD Linker',
        desc: 'Couple diBrPD-NHS with BCN-amine, purify on column, and run NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 23,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'dan_2_1',
            label: 'Get PD reagents',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 6',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_2_2',
            label: 'Run room-temp coupling',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 23,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_2_3',
            label: 'Purify on column',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_2_4',
            label: 'Concentrate fractions on Büchi',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 10,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'buchi_bump',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_2_5',
            label: 'Prepare NMR tube (CDCl3)',
            roomId: 'klb_2f',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_2_6',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_2_7',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you couple and purify strained BCN-PD?',
          options: [
            {
              label: 'Dry MeCN at 21 °C; neutral EtOAc/petrol column',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 11,
              safetyMod: 2,
              outcomeText: 'Clean coupling gives pure yellow BCN-PD linker.'
            },
            {
              label: 'Dry DMF at 21 °C; 0.1% Et3N-treated silica',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -4,
              safetyMod: 0,
              outcomeText: 'Mild base trims NHS side-product but drags DMF.'
            },
            {
              label: 'Dry DCM at 40 °C; MeOH/DCM silica gradient',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'MeOH on silica causes partial methanolysis.'
            },
            {
              label: 'Dry MeCN at 21 °C; 0.5% AcOH/DCM silica run',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -16,
              safetyMod: -5,
              outcomeText: 'Acidic silica protonates and opens strained BCN.'
            }
          ],
          askChudsHint: 'João: Strained cyclooctynes are acid-sensitive on silica and dislike protic solvents during coupling.',
          antoineHint: 'Antoine: Polar aprotic MeCN at ambient temperature avoids ester loss and keeps silica neutral.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 600 MHz 1H NMR (CDCl3): diBrPD-PEG2-BCN',
          productPeak: '4.14 ppm (d, 2H, BCN-CH2O), 3.18 ppm (s, 3H, N-Me), 0.94 ppm (m, 2H)',
          metricLabel: '78% isolated yield, clean endo-BCN ring'
        }
      },
      {
        index: 2,
        id: 'dan_step_3',
        dayHint: 'Wed',
        title: 'Rebridge Fab and Run MS',
        desc: 'Reduce Fab with TCEP, rebridge with BCN-PD, and verify by LC-MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['tcep_bench'],
        prepRequired: [],
        durationMins: 25,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'dan_3_1',
            label: 'Get TCEP and buffer',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_3_2',
            label: 'Run Fab rebridging',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 25,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_3_3',
            label: 'Spin and desalt sample',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_3_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 17,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_3_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you prep Fab-BCN for LG11 Q-TOF MS?',
          options: [
            {
              label: 'Desalt 6x into LC-MS water on 10 kDa spin',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Zero salt suppression and crisp 48,295 Da peak.'
            },
            {
              label: 'Desalt 3x into 10 mM NH4OAc on 10 kDa spin',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Trace acetate shifts baseline and broadens tail.'
            },
            {
              label: 'Desalt 2x into 5 mM PBS on 30 kDa spin',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: '30 kDa cutoff leaks Fab and sodium adducts stay.'
            },
            {
              label: 'Dilute 1:5 in 0.1% FA with residual borate',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -6,
              outcomeText: 'Borate suppresses ESI signal and crusts the cone.'
            }
          ],
          askChudsHint: 'Richard: Match spin-filter cutoff well below 48 kDa and strip non-volatile salts thoroughly before ESI.',
          antoineHint: 'Antoine: Six thorough water washes on a 10 kDa membrane clear borate cleanly for MaxEnt1 deconvolution.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Agilent PLRP-S Q-TOF (MaxEnt1): Rebridged FabHER2-BCN',
          productPeak: '48,295 Da observed (calc. 48,294 Da, PAR = 1.00)',
          metricLabel: 'PAR = 1.00, 95% homogeneous Fab-BCN'
        }
      },
      {
        index: 3,
        id: 'dan_step_4',
        dayHint: 'Thu',
        title: 'Coat Gold Nanoparticles',
        desc: 'Adsorb Cu-free BSA-N3 onto 40 nm gold and check mobility shift.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 23,
        sweetSpotMins: 69,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'dan_4_1',
            label: 'Collect gold from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_4_2',
            label: 'Coat gold with BSA-N3',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 23,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_4_3',
            label: 'Wash coated nanoparticles',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_4_4',
            label: 'Load mobility gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'Bare AuNP', 'PBS Fail', 'BSA-N3'], gelMode: 'aunp_ruby' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_4_5',
            label: 'View mobility gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you coat 40 nm gold without aggregation?',
          options: [
            {
              label: 'EDTA-treated BSA-N3 in 20 mM MES pH 5.2',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Ruby salt-stable particles with clean gel shift.'
            },
            {
              label: 'EDTA-treated BSA-N3 in 20 mM MES pH 5.8',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Slightly above pI lowers corona packing density.'
            },
            {
              label: 'Untreated BSA-N3 in 10 mM citrate pH 5.2',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Trace divalent ions destabilise BSA-N3 corona.'
            },
            {
              label: 'Untreated BSA-N3 in 1x PBS pH 7.4',
              isOptimal: false,
              yieldMod: -14,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'High ionic strength collapses citrate double layer.'
            }
          ],
          askChudsHint: 'Peter: Coat just near BSA isoelectric pH with low ionic strength and chelate trace metals before SPAAC.',
          antoineHint: 'Antoine: Low-salt MES right above pH 5 packs BSA-N3 densely while EDTA chelates stray metal ions.'
        },
        dataOutput: {
          type: 'gel',
          label: 'Colloidal Mobility Shift Gel: 40 nm AuNP-BSA-N3',
          productPeak: 'Crisp ruby-red corona band (529 nm, zero well aggregation)',
          metricLabel: '52.2 nm Z-avg, salt-stable crimson AuNPs'
        }
      },
      {
        index: 4,
        id: 'dan_step_5',
        dayHint: 'Thu/Fri',
        title: 'Assemble Lateral Flow Strips',
        desc: 'Click FabHER2-BCN onto AuNP-BSA-N3 via SPAAC and run HER2 strips.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'dan_5_1',
            label: 'Collect corona from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_5_2',
            label: 'SPAAC click Fab-BCN to AuNP-N3',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_5_3',
            label: 'Spin unbound Fab off',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_5_4',
            label: 'Run HER2 flow strips',
            roomId: 'klb_2f',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 6,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_5_5',
            label: 'Scan strips at station',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'Which running buffer wicks cleanly down NC-95?',
          options: [
            {
              label: 'PBS + 0.1% Tween 20 + 1% BSA; blank strip',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 11,
              safetyMod: 2,
              outcomeText: 'Sharp crimson test line with clean blank strip.'
            },
            {
              label: 'PBS + 0.02% Tween 20; zero-HER2 control strip',
              isOptimal: false,
              yieldMod: 2,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Low detergent slows flow and leaves faint haze.'
            },
            {
              label: 'PBS + 1% Tween 20 without BSA blocker',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -8,
              safetyMod: -2,
              outcomeText: 'Excess surfactant and no blocker raise background.'
            },
            {
              label: 'Neat 1x PBS pH 7.4 with no surfactant',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -14,
              safetyMod: -4,
              outcomeText: 'Conjugate stalls near pad and smears test zone.'
            }
          ],
          askChudsHint: 'João: Pair mild non-ionic detergent with protein blocker on nitrocellulose and include a zero-analyte strip.',
          antoineHint: 'Antoine: Around 0.1% Tween 20 plus BSA keeps nanoparticles mobile without washing off capture IgG.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'NC-95 Lateral-Flow Strip Array (HER2 0-50 nM)',
          productPeak: 'Crimson Test Line (Rf = 0.48) and Control Line, LoD 85 pM HER2',
          metricLabel: 'LoD 85 pM, 5.2x signal vs random lysine'
        }
      }
    ]
  },

  // =========================================================================
  // 2. MAXIMILLIAN LEE - 25 Å Bis-diBrPD Stapling & Native DAR 2.0 Herceptin
  // =========================================================================
  maximillian_lee: {
    charId: 'maximillian_lee',
    title: '25 Å Bis-diBrPD Stapling & Native DAR 2.0 Herceptin ADCs',
    manuscriptTopic: '25 Å Bis-diBrPD Stapling & Native DAR 2 ADCs',
    paperRef: 'Lee, Maruani, Richards, Baker & Chudasama, Chem. Sci. 2017, 8, 2056 (DOI: 10.1039/c6sc03655d); Lee, Maruani, Baker & Chudasama, Chem. Sci. 2016, 7, 799 (DOI: 10.1039/c5sc02666k)',
    overview: 'Build 25 Å bis-PD staples and lock native Herceptin into DAR 2.0 conjugates.',
    steps: [
      {
        index: 0,
        id: 'max_step_1',
        dayHint: 'Mon',
        title: 'Synthesise Bis-PD Crosslinker',
        desc: 'Bridge two diBrPD heads across a 25 Å PEG spacer and purify.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 23,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'max_1_1',
            label: 'Get dry solvent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 1 (Dry Solvents)',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_1_2',
            label: 'Weigh PEG diamine',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_1_3',
            label: 'Run bis-PD coupling',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 23,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_1_4',
            label: 'Check TLC under UV',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_1_5',
            label: 'Remove reaction solvent',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'buchi_bump',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_1_6',
            label: 'Purify on column',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'Which spacer and base build the IgG1 hinge staple?',
          options: [
            {
              label: '25 Å trioxa-diamine + DIPEA in dry DMF, 21 °C',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Spans two hinge disulfides cleanly for DAR 2.0.'
            },
            {
              label: '25 Å trioxa-diamine + Et3N in dry DCM, 21 °C',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Lower solubility gives some mono-amide side band.'
            },
            {
              label: '12 Å butane-1,4-diamine + DIPEA in dry DMF',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Spacer too short to bridge two disulfides cleanly.'
            },
            {
              label: '25 Å trioxa-diamine in reagent DMF + 2% water',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Trace water hydrolyses NHS ester before coupling.'
            }
          ],
          askChudsHint: 'Dan: Match the diamine contour length to the IgG1 hinge spacing and keep NHS couplings strictly anhydrous.',
          antoineHint: 'Antoine: Roughly 25 Å of flexible PEG diamine spans adjacent cysteines without intermolecular crosslinking.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'SIL G/UV254 + KMnO4 TLC: Bis-diBrPD Crosslinker',
          productPeak: 'Bright UV254 spot at Rf = 0.42 (5% MeOH/DCM, zero mono-amide)',
          metricLabel: '74% isolated yield, single Rf 0.42 spot'
        }
      },
      {
        index: 1,
        id: 'max_step_2',
        dayHint: 'Tue',
        title: 'Prep Phosphine-PD and Run NMR',
        desc: 'Make 2-in-1 phosphine-PD under argon and check by 600 MHz NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['argon_cyl'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'max_2_1',
            label: 'Get argon balloon',
            roomId: 'klb_2f',
            stationTypes: ['argon_cyl'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_2_2',
            label: 'Run phosphine coupling',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_2_3',
            label: 'Quench thiol glassware',
            roomId: 'klb_2f',
            stationTypes: ['base_bath'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_2_4',
            label: 'Prepare NMR tube (CDCl3)',
            roomId: 'klb_2f',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_2_5',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 20,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_2_6',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you prep NMR for air-sensitive phosphine?',
          options: [
            {
              label: 'Degassed CDCl3 under argon; store at -20 °C',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Zero phosphine oxide; 98% active reagent.'
            },
            {
              label: 'Standard bench CDCl3 capped under N2 at 21 °C',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -4,
              safetyMod: 0,
              outcomeText: 'Dissolved oxygen generates 12% phosphine oxide.'
            },
            {
              label: 'Dry CD3OD under argon; store at 4 °C',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Protic methanol slowly solvolyses reactive arms.'
            },
            {
              label: 'Non-degassed DMSO-d6 warmed to 60 °C',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Warm aerated DMSO oxidises trialkylphosphine.'
            }
          ],
          askChudsHint: 'André: Purge the NMR solvent thoroughly to eliminate dissolved O2 and store phosphines frozen.',
          antoineHint: 'Antoine: Freeze-pump-thawed aprotic CDCl3 under argon avoids P(III) oxidation cleanly.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 600 MHz 1H/31P NMR (CDCl3): Dithioaryl(TCEP)PD',
          productPeak: '31P -17.4 ppm (live phosphine >97%) and 7.48, 7.19 ppm aryl',
          metricLabel: '97% active phosphine, zero P=O crash'
        }
      },
      {
        index: 2,
        id: 'max_step_3',
        dayHint: 'Wed',
        title: 'Staple Herceptin with Bis-PD',
        desc: 'Reduce and staple Herceptin at pH 8.0, then verify on SDS-PAGE.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 21,
        sweetSpotMins: 69,
        minigame: 'syringe_cryo',
        subTasks: [
          {
            id: 'max_3_1',
            label: 'Collect Herceptin from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_3_2',
            label: 'Set syringe addition',
            roomId: 'klb_2f',
            stationTypes: ['syringe_pump'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 21,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: 'syringe_cryo',
            minigameConfig: { tempLabel: '4 °C Ice-Water Bath', rateLabel: '4.0 µL/min Slow Add' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_3_3',
            label: 'Incubate antibody staple',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_3_4',
            label: 'Spin and desalt',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 10,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_3_5',
            label: 'Load SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_3_6',
            label: 'View SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which reducing setup yields clean 150 kDa HHLL?',
          options: [
            {
              label: 'Fresh 10 eq TCEP in BBS pH 8.0 + EDTA, 4 °C',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean rebridging with sharp 150 kDa gel band.'
            },
            {
              label: 'Fresh 10 eq TCEP in PBS pH 7.4 + EDTA, 21 °C',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Slower PD substitution raises 75 kDa half-mAb.'
            },
            {
              label: 'Fresh 25 eq TCEP in BBS pH 8.0 at 37 °C',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Excess TCEP at 37 °C competes with bis-PD staple.'
            },
            {
              label: 'Aged unbuffered aqueous TCEP stock at pH 3.0',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -5,
              outcomeText: 'Acidic oxidised TCEP under-reduces and scrambles.'
            }
          ],
          askChudsHint: 'Calise: Always check TCEP stock pH and age; mild borate pH 8 with EDTA keeps stapling selective.',
          antoineHint: 'Antoine: Neutral-to-mildly basic BBS pH 8.0 with fresh TCEP balances reduction and bis-PD ring closure.'
        },
        dataOutput: {
          type: 'gel',
          label: '12% Non-Reducing SDS-PAGE: Herceptin-(bis-PD)2',
          productPeak: '93% intact 150 kDa HHLL rebridged IgG1 band',
          metricLabel: 'PDAR = 4.0 (2.0 linkers/mAb), 93% HHLL'
        }
      },
      {
        index: 3,
        id: 'max_step_4',
        dayHint: 'Thu',
        title: 'Click Dox and Verify DAR',
        desc: 'Click doxorubicin onto stapled Herceptin and prove DAR 2.0 by MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'max_4_1',
            label: 'Get doxorubicin azide',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 6',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_4_2',
            label: 'Run click conjugation',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_4_3',
            label: 'Diafiltrate conjugate',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_4_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 17,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_4_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you calculate accurate DAR 2.0 by UV-Vis?',
          options: [
            {
              label: 'Spin wash 6x; subtract PD and Dox CF280',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Consistent DAR 2.0 across seven replicates.'
            },
            {
              label: 'Spin wash 6x; subtract Dox CF280 only (no PD)',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -4,
              safetyMod: 0,
              outcomeText: 'Uncorrected PD 345 nm bleed underestimates DAR.'
            },
            {
              label: 'Spin wash 2x; subtract PD and Dox CF280',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Residual free doxorubicin inflates apparent DAR.'
            },
            {
              label: 'Divide raw A495 by raw A280 without wash',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -5,
              outcomeText: 'Unwashed drug and overlapping 280 nm ruin ratio.'
            }
          ],
          askChudsHint: 'Faiza: Both the PD heterocycle and doxorubicin absorb at 280 nm, so wash exhaustively and correct both.',
          antoineHint: 'Antoine: Subtract 0.28*A345 and 0.724*A495 from A280 after thorough diafiltration.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Deglycosylated Q-TOF LC-MS (n = 7): Herceptin-Dox2',
          productPeak: '148,950 Da intact ADC (+2,618 Da shift, DAR = 2.00)',
          metricLabel: 'DAR = 2.00 across 7 replicates'
        }
      },
      {
        index: 4,
        id: 'max_step_5',
        dayHint: 'Thu/Fri',
        title: 'Check HER2 Binding Stability',
        desc: 'Incubate Herceptin-Dox2 with HER2 antigen and verify complex on gel.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 22,
        sweetSpotMins: 69,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'max_5_1',
            label: 'Collect ADC from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_5_2',
            label: 'Incubate with HER2 antigen',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 22,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_5_3',
            label: 'Spin binding assay',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_5_4',
            label: 'Load binding gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'Herceptin', 'mAb+HER2', 'ADC+HER2'], gelMode: 'native_shift' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_5_5',
            label: 'View binding gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you confirm retained HER2 binding on gel?',
          options: [
            {
              label: 'Equimolar HER2 + native mAb lane, non-reducing',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Crisp shifted band matching native Herceptin.'
            },
            {
              label: 'Equimolar HER2, 37 °C 1 h, no native mAb lane',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Shift visible but lacks native binding benchmark.'
            },
            {
              label: '0.2 eq HER2 + native mAb lane, non-reducing',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -8,
              safetyMod: -2,
              outcomeText: 'Sub-stoichiometric antigen leaves unbound ADC.'
            },
            {
              label: 'Equimolar HER2 heated 75 °C in SDS buffer',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -14,
              safetyMod: -4,
              outcomeText: 'Heat and SDS dissociate non-covalent HER2 complex.'
            }
          ],
          askChudsHint: 'Dan: Keep the antigen complex gentle without heat or reducing agents, and run native IgG alongside.',
          antoineHint: 'Antoine: Native conditions with stoichiometric HER2 and an unmodified Herceptin lane make binding clear.'
        },
        dataOutput: {
          type: 'gel',
          label: 'Native HER2 Antigen-Shift Gel: Herceptin-Dox2 vs Herceptin',
          productPeak: 'Full antigen complex shift matching native Herceptin',
          metricLabel: '100% HER2 binding retention vs native'
        }
      }
    ]
  },

  // =========================================================================
  // 3. ANTOINE MARUANI - Asymmetric Astra-PD & Dual-Click DAR 4+4 Antibody
  // =========================================================================
  antoine_maruani: {
    charId: 'antoine_maruani',
    title: 'Asymmetric Astra-PD & Dual-Click DAR 4+4 Antibody',
    manuscriptTopic: 'Asymmetric Astra-PD & Dual-Click DAR 4+4 mAb',
    paperRef: 'Maruani & Chudasama et al., Nat. Commun. 2015, 6, 6645 (DOI: 10.1038/ncomms7645); Maruani, Szijj, Bahou, Nogueira, Baker & Chudasama, Bioconjugate Chem. 2020, 31, 520',
    overview: 'Build asymmetric Astra-PD and dual-click Dox and Cy5 onto Herceptin.',
    steps: [
      {
        index: 0,
        id: 'antoine_step_1',
        dayHint: 'Mon',
        title: 'Synthesise Asymmetric Astra-PD',
        desc: 'Reflux dibromomaleic acid, install dual alkynes, and check by NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'ant_1_1',
            label: 'Get acid and hydrazine',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 6',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_1_2',
            label: 'Run ring closure',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_1_3',
            label: 'Remove acetic acid',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'buchi_bump',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_1_4',
            label: 'Purify on column',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_1_5',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_1_6',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you close diBrPD from dibromomaleic acid?',
          options: [
            {
              label: 'Pre-reflux diacid in AcOH 30m, then hydrazine',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Clean in situ anhydride gives 81% pure PD.'
            },
            {
              label: 'Co-reflux diacid and hydrazine directly in AcOH',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -4,
              safetyMod: 0,
              outcomeText: 'Hydrazinium acetate salt slows ring closure.'
            },
            {
              label: 'Reflux diacid in EtOH/Et3N with hydrazine',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Protic base stalls dehydration and drops yield.'
            },
            {
              label: 'Stir diacid and hydrazine in AcOH at 25 °C',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -5,
              outcomeText: 'Open-chain mono-hydrazide fails to cyclise.'
            }
          ],
          askChudsHint: 'Calise: Dehydrate the diacid into its cyclic anhydride in hot acetic acid before introducing hydrazine.',
          antoineHint: 'Vijay: Pre-forming the maleic anhydride in refluxing AcOH drives clean condensation with hydrazine.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 600 MHz 1H/13C NMR (CDCl3): Asymmetric Astra-PD',
          productPeak: '4.92 ppm (d, 2H, propargyl), 2.34 ppm (t, 1H) and 98.8 ppm C≡C',
          metricLabel: '81% yield, orthogonal alkynes intact'
        }
      },
      {
        index: 1,
        id: 'antoine_step_2',
        dayHint: 'Tue',
        title: 'Rebridge Herceptin at 4 °C',
        desc: 'Rebridge Herceptin with Astra-PD at 4 °C and check thiols with DTNB.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 27,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'ant_2_1',
            label: 'Collect Herceptin from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_2_2',
            label: 'Get Ellman DTNB reagent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 17',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_2_3',
            label: 'Run Astra-PD rebridging',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 27,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_2_4',
            label: 'Desalt rebridged antibody',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_2_5',
            label: 'Check DTNB spot plate',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'What thiol check gates entry to CuAAC click?',
          options: [
            {
              label: 'Desalt 6x, then test 5 µL with DTNB at 412 nm',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Reads 0.0 free thiols; all disulfides locked.'
            },
            {
              label: 'Desalt 2x, then test 5 µL with DTNB at 412 nm',
              isOptimal: false,
              yieldMod: 2,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Trace TCEP reduces DTNB and gives false positive.'
            },
            {
              label: 'Desalt 6x, rely on 280/345 nm PDAR ratio only',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'UV ratio alone misses unbridged free cysteines.'
            },
            {
              label: 'Skip desalting; test bulk mAb with excess DTNB',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Leftover TCEP reacts with DTNB and ruins aliquot.'
            }
          ],
          askChudsHint: 'Max: Residual TCEP reduces Ellman reagent directly, so clear TCEP completely before testing a small aliquot.',
          antoineHint: 'Richard: An analytical DTNB reading of zero after thorough desalting proves every hinge thiol is rebridged.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'Ellman DTNB Audit & PDAR Check: Astra-PD Herceptin',
          productPeak: 'A412 = 0.002 (0.0 free -SH, PDAR = 4.0)',
          metricLabel: 'PDAR = 4.0, zero free cysteines'
        }
      },
      {
        index: 2,
        id: 'antoine_step_3',
        dayHint: 'Wed',
        title: 'Run Copper-Free Dox Click',
        desc: 'Click doxorubicin azide via SPAAC at 37 °C and verify DAR 4 by MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 26,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'ant_3_1',
            label: 'Get Dox-azide payload',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 6',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_3_2',
            label: 'Run SPAAC click reaction',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 26,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_3_3',
            label: 'Spin and desalt ADC',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_3_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 17,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_3_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which click sequence preserves orthogonal DAR 4+4?',
          options: [
            {
              label: 'Copper-free SPAAC first, then CuAAC second',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Terminal alkynes wait cleanly; crisp DAR 4.0.'
            },
            {
              label: 'SPAAC with 1.05 eq Dox-N3, 1 h at 21 °C',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Short ambient SPAAC leaves incomplete DAR 3.3.'
            },
            {
              label: 'CuAAC Cy5 first at 0.2 eq Cu, then SPAAC Dox',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -10,
              safetyMod: -2,
              outcomeText: 'Azide cross-reacts with both strained and terminal.'
            },
            {
              label: 'One-pot both azides with CuSO4/ascorbate',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -16,
              safetyMod: -4,
              outcomeText: 'Produces broad statistical DAR 0 to 8 mixture.'
            }
          ],
          askChudsHint: 'Dan: Strained alkynes react rapidly without catalyst, leaving terminal alkynes dormant until copper arrives.',
          antoineHint: 'Vijay: Run catalyst-free SPAAC to completion before introducing any Cu(I) for the second payload.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Waters UPLC-SQD MS: SPAAC Herceptin-Dox4 Intermediate',
          productPeak: '149,820 Da intact conjugate (DAR = 4.0, terminal alkyne free)',
          metricLabel: 'DAR(Dox) = 4.0, 100% SPAAC selectivity'
        }
      },
      {
        index: 3,
        id: 'antoine_step_4',
        dayHint: 'Thu',
        title: 'Run THPTA Cy5 Second Click',
        desc: 'Click Sulfo-Cy5-azide with THPTA copper catalyst and verify on MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 26,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'ant_4_1',
            label: 'Collect DAR 4 intermediate',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_4_2',
            label: 'Run THPTA CuAAC click',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 26,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_4_3',
            label: 'Wash with EDTA spin',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_4_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 17,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_4_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you protect antibody during CuAAC?',
          options: [
            {
              label: '5:1 THPTA:Cu in PBS, then 2 mM EDTA spin wash',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean DAR 4 + FAR 4 with zero Met oxidation.'
            },
            {
              label: '2:1 THPTA:Cu in PBS, then plain PBS spin wash',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -4,
              safetyMod: 0,
              outcomeText: 'Sub-optimal ligand and no EDTA trace-bind Cu.'
            },
            {
              label: '5:1 THPTA:Cu in PBS containing 1 mM EDTA',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'EDTA during click sequesters copper and stalls.'
            },
            {
              label: 'CuSO4 + Na ascorbate in PBS with zero THPTA',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -5,
              outcomeText: 'Unchelated Cu(I) generates ROS and fragments mAb.'
            }
          ],
          askChudsHint: 'Peter: Excess THPTA ligand traps reactive oxygen species during CuAAC, whereas EDTA belongs strictly in the wash.',
          antoineHint: 'Richard: Use 5:1 THPTA:Cu in EDTA-free PBS, then strip residual copper afterwards with an EDTA spin.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Q-TOF LC-MS & UV-Vis: Herceptin-Dox4-Cy5(4)',
          productPeak: '152,840 Da dual-clicked mAb (DAR 4.0 + FAR 3.9)',
          metricLabel: 'DAR 4.0 + FAR 3.9 dual-payload mAb'
        }
      },
      {
        index: 4,
        id: 'antoine_step_5',
        dayHint: 'Thu/Fri',
        title: 'Verify Dual Conjugate by Gel',
        desc: 'Run non-reducing SDS-PAGE to image dual Dox and Cy5 fluorescence.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 23,
        sweetSpotMins: 63,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'ant_5_1',
            label: 'Collect final conjugate',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_5_2',
            label: 'Denature samples gently',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 23,
            sweetSpotMins: 63,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_5_3',
            label: 'Load SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'Herceptin', 'Dox4 mAb', 'Dox4-Cy5'], gelMode: 'dual_fluor' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ant_5_4',
            label: 'View SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you prep and image the dual-dye gel?',
          options: [
            {
              label: '75 °C 3 min LDS; scan fluorescence pre-stain',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: '150 kDa band glows in both Dox and Cy5 lanes.'
            },
            {
              label: '95 °C 10 min LDS; scan fluorescence pre-stain',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Prolonged 95 °C causes faint high-MW aggregates.'
            },
            {
              label: '75 °C 3 min + 10 mM DTT; scan fluorescence',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'DTT cleaves residual unbridged chains and fades.'
            },
            {
              label: 'Stain Coomassie Blue first, then scan Cy5/Dox',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Coomassie dye quenches and masks payload signal.'
            }
          ],
          askChudsHint: 'Max: Always capture in-gel fluorescence images before immersing the gel in Coomassie stain.',
          antoineHint: 'Vijay: Gentle 75 °C non-reducing denaturation avoids aggregation, and fluorescence scanning must precede Coomassie.'
        },
        dataOutput: {
          type: 'gel',
          label: 'Dual-Fluorescence (495/646 nm) + Coomassie SDS-PAGE',
          productPeak: 'Co-localised 150 kDa Dox and Cy5 band (92% intact HHLL)',
          metricLabel: '3-panel gel, 92% homogeneity'
        }
      }
    ]
  },

  // =========================================================================
  // 4. ANDRÉ SHAMSABADI - On-Water Hydrazides, Arynes & Phenazepam Route
  // =========================================================================
  andre_shamsabadi: {
    charId: 'andre_shamsabadi',
    title: 'On-Water Acyl Hydrazides, Aryne Rearrangement & Phenazepam',
    manuscriptTopic: 'On-Water Hydrazides, Arynes & Phenazepam Route',
    paperRef: 'Shamsabadi & Chudasama, ACS Omega 2019, 4, 21901 (DOI: 10.1021/acsomega.9b03417); Chem. Commun. 2018, 54, 11180 (DOI: 10.1039/C8CC06790E)',
    overview: 'Run on-water hydroacylation, aryne rearrangement, and Phenazepam synthesis.',
    steps: [
      {
        index: 0,
        id: 'andre_step_1',
        dayHint: 'Mon',
        title: 'Run On-Water Hydroacylation',
        desc: 'Stir 4-chlorobenzaldehyde and DIAD in water under air and check TLC.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 29,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'and_1_1',
            label: 'Get DIAD reagent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 11',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_1_2',
            label: 'Weigh aldehyde substrate',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_1_3',
            label: 'Stir on-water reaction',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 29,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_1_4',
            label: 'Remove extraction solvent',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_1_5',
            label: 'Check TLC under UV',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'How do you run aerobic on-water hydroacylation?',
          options: [
            {
              label: 'Stir neat reactants on 1 mL water under air',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Clean radical propagation gives 86% crystals.'
            },
            {
              label: 'Stir in 1:1 THF/water under air for 4 h',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Co-solvent homogenises emulsion and slows rate.'
            },
            {
              label: 'Stir on 1 mL water under strict argon balloon',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -8,
              safetyMod: -2,
              outcomeText: 'Oxygen exclusion suppresses radical initiation.'
            },
            {
              label: 'Stir in dry THF under argon with 10 mol% BHT',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -14,
              safetyMod: -4,
              outcomeText: 'No hydrophobic effect and BHT traps radicals.'
            }
          ],
          askChudsHint: 'Marcos: This acyl-radical chain needs trace air initiation and vigorous stirring as an emulsion on pure water.',
          antoineHint: 'Antoine: Keep organic co-solvents and radical scavengers out; trace O2 on water drives hydroacylation.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'SIL G/UV254 + KMnO4 TLC: On-Water Acyl Hydrazide',
          productPeak: 'Crisp UV254 spot at Rf = 0.36 (30% EtOAc/petrol)',
          metricLabel: '86% isolated yield, metal-free on-water'
        }
      },
      {
        index: 1,
        id: 'andre_step_2',
        dayHint: 'Tue',
        title: 'Run TBAT Aryne Rearrangement',
        desc: 'Trigger benzyne N-N insertion with anhydrous TBAT and verify by MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['drying_oven'],
        prepRequired: [],
        durationMins: 30,
        sweetSpotMins: 69,
        minigame: 'buchi_bump',
        subTasks: [
          {
            id: 'and_2_1',
            label: 'Get oven-dried flask',
            roomId: 'klb_2f',
            stationTypes: ['drying_oven'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_2_2',
            label: 'Get dry toluene solvent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 1 (Dry Solvents)',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_2_3',
            label: 'Run aryne rearrangement',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 30,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_2_4',
            label: 'Remove toluene on Büchi',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'buchi_bump',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_2_5',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 18,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_2_6',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which fluoride source drives benzyne cleanly?',
          options: [
            {
              label: 'Anhydrous TBAT in dry toluene under argon, 55 °C',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Zero water; 84% rearranged hydrazobenzophenone.'
            },
            {
              label: 'Anhydrous CsF in dry MeCN at 80 °C under argon',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Elevated heat promotes minor N-methylene attack.'
            },
            {
              label: 'Anhydrous TBAT in dry THF at 21 °C under argon',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Slow aryne release at 21 °C leaves unreacted SM.'
            },
            {
              label: 'Commercial 1 M TBAF in THF under argon, 55 °C',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Hygroscopic TBAF water protonates aryl anion.'
            }
          ],
          askChudsHint: 'Richard: Commercial TBAF solutions hold ~5% water; solid anhydrous silicate fluoride in warm toluene stays dry.',
          antoineHint: 'Antoine: Oven-dried glassware and solid anhydrous TBAT at 55 °C prevent water quenching the aryne.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Waters Q-TOF ESI-HRMS: 2-Hydrazobenzophenone',
          productPeak: '455.16 m/z [M+Na]+ (35Cl/37Cl 3:1 cluster)',
          metricLabel: '84% yield, HRMS error -0.4 ppm'
        }
      },
      {
        index: 2,
        id: 'andre_step_3',
        dayHint: 'Wed',
        title: 'Infuse Bromomalonate by Syringe',
        desc: 'Infuse diethyl bromomalonate into NaH suspension for N-N cleavage.',
        locationRoom: 'klb_2f',
        stationTypes: ['argon_cyl'],
        prepRequired: [],
        durationMins: 30,
        sweetSpotMins: 69,
        minigame: 'syringe_cryo',
        subTasks: [
          {
            id: 'and_3_1',
            label: 'Get argon balloon',
            roomId: 'klb_2f',
            stationTypes: ['argon_cyl'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_3_2',
            label: 'Get NaH base',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 11',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_3_3',
            label: 'Infuse on syringe pump',
            roomId: 'klb_2f',
            stationTypes: ['syringe_pump'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 30,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: 'syringe_cryo',
            minigameConfig: { tempLabel: '-78 °C Dry Ice/Acetone', rateLabel: '5.7 µL/min Dropwise' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_3_4',
            label: 'Remove THF solvent',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_3_5',
            label: 'Check TLC under UV',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'How do you add diethyl bromomalonate to NaH?',
          options: [
            {
              label: 'Infuse 5.7 µL/min over 30m via syringe pump',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean N-alkylation and E1cB N-N cleavage (82%).'
            },
            {
              label: 'Dropwise addition by hand over 5 min at 0 °C',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Local bromomalonate excess gives 18% dimer.'
            },
            {
              label: 'Add 1.0 eq bromomalonate at once at 21 °C',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Incomplete E1cB cleavage and competing bis-alkyl.'
            },
            {
              label: 'Rapid bolus of 2.5 eq into warm NaH at 40 °C',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -14,
              safetyMod: -6,
              outcomeText: 'Brisk H2 evolution and heavy self-condensation.'
            }
          ],
          askChudsHint: 'Marcos: Keep instantaneous bromomalonate concentration tiny so NaH deprotonates cleanly without self-condensation.',
          antoineHint: 'Antoine: Metered syringe-pump infusion prevents bromomalonate dimerisation during E1cB N-N cleavage.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'UV254 + KMnO4 TLC: Protected 2-Aminobenzophenone',
          productPeak: 'Yellow amine spot Rf = 0.49 (20% EtOAc/petrol)',
          metricLabel: '82% E1cB N-N cleavage yield'
        }
      },
      {
        index: 3,
        id: 'andre_step_4',
        dayHint: 'Thu',
        title: 'Cyclise and Purify Phenazepam',
        desc: 'Deprotect, brominate, close Phenazepam ring, and purify on column.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 30,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'and_4_1',
            label: 'Get dry DCM solvent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 1 (Dry Solvents)',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_4_2',
            label: 'Run ring cyclisation',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 30,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_4_3',
            label: 'Purify on column',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_4_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 18,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_4_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you unmask aniline and close the ring?',
          options: [
            {
              label: 'AlCl3/DCM, NBS at 0 °C, then NH4OH cyclise',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Crisp white Phenazepam crystals in 85% yield.'
            },
            {
              label: 'AlCl3/DCM, NBS at 21 °C, then NH4OH cyclise',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Ambient bromination raises ortho/dibromo traces.'
            },
            {
              label: 'TFA/DCM, NBS at 0 °C, then NaHCO3 cyclise',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -10,
              safetyMod: -2,
              outcomeText: 'Incomplete carbamate cleavage stalls cyclisation.'
            },
            {
              label: '1.5 eq NBS at 50 °C prior to AlCl3 deprotection',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -16,
              safetyMod: -4,
              outcomeText: 'Carbamate directs bromination to wrong position.'
            }
          ],
          askChudsHint: 'Calise: Unmask the free aniline first with Lewis acid so it directs NBS cleanly to the para carbon at 0 °C.',
          antoineHint: 'Antoine: Mild AlCl3 deprotection followed by chilled 0 °C NBS hits para selectivity before NH4OH ring closure.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Biotage UV & HRMS: Crystalline Phenazepam',
          productPeak: '348.97 m/z [M+H]+ (79Br35Cl / 81Br35Cl cluster)',
          metricLabel: '85% cyclisation yield, 98% purity'
        }
      },
      {
        index: 4,
        id: 'andre_step_5',
        dayHint: 'Thu/Fri',
        title: 'Run 700 MHz VT-NMR',
        desc: 'Dissolve product in DMSO-d6 and verify rotamer coalescence on 700 MHz VT-NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['balance_table'],
        prepRequired: [],
        durationMins: 21,
        sweetSpotMins: 225,
        minigame: null,
        subTasks: [
          {
            id: 'and_5_1',
            label: 'Weigh Phenazepam for NMR',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_5_2',
            label: 'Prepare NMR tube (DMSO-d6)',
            roomId: 'klb_2f',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_5_3',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 21,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'and_5_4',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which tube setup resolves +120 °C VT-NMR?',
          options: [
            {
              label: 'DMSO-d6 at 4.5 cm depth; collect promptly',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Rotamers coalesce cleanly at 120 °C on 700 MHz.'
            },
            {
              label: 'DMSO-d6 at 3.5 cm depth; collect next morning',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Short column needs reshim; overnight fridge fine.'
            },
            {
              label: 'Toluene-d8 at 4.5 cm depth; run at 105 °C',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Borderline solubility near reflux broadens lines.'
            },
            {
              label: 'CDCl3 at 4.5 cm depth; ramp probe to 90 °C',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -16,
              safetyMod: -6,
              outcomeText: 'Exceeds CDCl3 boiling point (61 °C) in probe.'
            }
          ],
          askChudsHint: 'Antoine: Pick a polar deuterated solvent boiling well above 120 °C and gauge column height for 700 MHz shims.',
          antoineHint: 'Antoine: DMSO-d6 (bp 189 °C) at 4.5 cm dissolves Phenazepam and prevents boiling at coalescence temperature.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 700 MHz VT-NMR (DMSO-d6): Phenazepam & Rotamers',
          productPeak: 'Coalesced 120 °C singlets; Phenazepam 10.74 (NH), 4.18 (CH2)',
          metricLabel: '700 MHz VT-NMR, clean coalescence'
        }
      }
    ]
  },

  // =========================================================================
  // 5. PETER SZIJJ - 147 kDa Synthetic Antibodies & Sialidase CiTEs
  // =========================================================================
  peter_szijj: {
    charId: 'peter_szijj',
    title: 'Modular 147 kDa Synthetic Antibodies & Sialidase CiTEs',
    manuscriptTopic: '147 kDa SynAbs & Sialidase CiTE Bioconjugates',
    paperRef: 'Szijj, Bahou, Nogueira & Chudasama et al., Nat. Chem. 2023, 15, 1636 (DOI: 10.1038/s41557-023-01280-4); ACS Cent. Sci. 2023, 9, 476',
    overview: 'Digest three antibodies, build Br2PD-Tz-N3, and assemble 147 kDa SynAbs.',
    steps: [
      {
        index: 0,
        id: 'peter_step_1',
        dayHint: 'Mon',
        title: 'Digest Fab and Fc Fragments',
        desc: 'Prepare Trastuzumab Fab, OKT3 Fab, and Rituximab Fc on spin columns.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 25,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'pet_1_1',
            label: 'Collect antibodies from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_1_2',
            label: 'Digest antibody panels',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 25,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_1_3',
            label: 'Neutralise Protein A eluate',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_1_4',
            label: 'Spin and desalt fragments',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_1_5',
            label: 'Load SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_1_6',
            label: 'View SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you prevent Fc aggregation off Protein A?',
          options: [
            {
              label: 'Pre-load tubes with 10% 1 M Tris pH 8.8',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Instant neutralisation keeps FcCD20 soluble.'
            },
            {
              label: 'Neutralise eluate with 1 M Tris after 20 min',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Delayed neutralisation induces partial Fc cloud.'
            },
            {
              label: 'Elute Protein A with pH 3.5 citrate; no Tris',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Prolonged acidic elution unfolds CH2 domains.'
            },
            {
              label: 'Purify Trastuzumab Fc on Protein A column',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'VH3 Fab co-binds Protein A and mixes fragments.'
            }
          ],
          askChudsHint: 'Dan: Rituximab avoids VH3 Protein A co-binding, and buffering the receiver tube stops acid-induced CH2 unfolding.',
          antoineHint: 'Antoine: Pre-aliquoting 1 M Tris pH 8.8 into collection tubes neutralises the acidic Fc eluate immediately.'
        },
        dataOutput: {
          type: 'gel',
          label: '12% Non-Reducing SDS-PAGE: 3-Antibody Fab/Fc Panel',
          productPeak: 'Clean 48.1 kDa FabHER2, 47.6 kDa FabCD3 and 49.9 kDa FcCD20',
          metricLabel: '3 pure building blocks, 94% homogeneity'
        }
      },
      {
        index: 1,
        id: 'peter_step_2',
        dayHint: 'Tue',
        title: 'Synthesise Pink Tetrazine Hub',
        desc: 'Build and oxidise pink Br2PD-Tz-N3 hub, purify, and check by NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 23,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'pet_2_1',
            label: 'Get tetrazine precursors',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 6',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_2_2',
            label: 'Oxidise hub in hood',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 23,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_2_3',
            label: 'Purify on column',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_2_4',
            label: 'Concentrate hub on Büchi',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 10,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'buchi_bump',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_2_5',
            label: 'Prepare NMR tube (CDCl3)',
            roomId: 'klb_2f',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_2_6',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_2_7',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Why does pink Br2PD-Tz bleach on reduced Fab?',
          options: [
            {
              label: 'Oxidise in hood; Zeba-desalt TCEP before Tz',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Vivid pink tetrazine survives cleanly on Fab.'
            },
            {
              label: 'Oxidise in hood; 1x spin desalt before Tz',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Residual TCEP partially bleaches pink tetrazine.'
            },
            {
              label: 'Add 1.2 eq Br2PD-Tz before full oxidation',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Incomplete dihydro-Tz oxidation drops click rate.'
            },
            {
              label: 'Add Br2PD-Tz directly into 10 eq TCEP mix',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -16,
              safetyMod: -4,
              outcomeText: 'Phosphine reduces tetrazine to dead dihydro-Tz.'
            }
          ],
          askChudsHint: 'Calise: Phosphines reduce tetrazines to colourless dihydrotetrazines, so remove TCEP completely before introducing Tz.',
          antoineHint: 'Antoine: Exhaustive Zeba desalting after Fab reduction prevents TCEP from bleaching the Br2PD-Tz-N3 hub.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 600 MHz 1H NMR (CDCl3): Br2PD-Tz-N3 Hub',
          productPeak: '8.52 ppm (d, 2H, Tz-ArH) and 3.09 ppm (s, 3H, Tz-Me)',
          metricLabel: '71% yield, vivid crimson Tz-N3 hub'
        }
      },
      {
        index: 2,
        id: 'peter_step_3',
        dayHint: 'Wed',
        title: 'Assemble 147 kDa Tri-Protein',
        desc: 'Click FabHER2, FabCD3, and sialidase at pH 7.0 and verify by MALDI.',
        locationRoom: 'klb_2f',
        stationTypes: ['tcep_bench'],
        prepRequired: [],
        durationMins: 28,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'pet_3_1',
            label: 'Prep fresh BCN modules',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_3_2',
            label: 'Run pH 7.0 click',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 28,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_3_3',
            label: 'Spot MALDI plate',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_3_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['maldi_unit', 'lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 17,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_3_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you click without killing sialidase?',
          options: [
            {
              label: 'Fresh BCN conjugates clicked in PBS pH 7.0',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Fast SPIEDAC click with 100% live sialidase.'
            },
            {
              label: '2-day-old BCN-Fab clicked in PBS pH 7.0',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Aged BCN partially degrades, lowering trimer.'
            },
            {
              label: 'Fresh BCN conjugates clicked in PBS pH 5.0',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Low pH destabilises bacterial sialidase enzyme.'
            },
            {
              label: 'Fresh BCN clicked with 1 mM CuSO4 at pH 7.0',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Copper ions poison sialidase and cross-react.'
            }
          ],
          askChudsHint: 'Dan: Strained BCN slowly degrades on storage and sialidase hates acid or copper, so click fresh at neutral pH.',
          antoineHint: 'Antoine: Catalyst-free SPIEDAC in pH 7.0 PBS using freshly prepared BCN-Fab preserves full enzyme activity.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Waters MALDI-TOF MS: Tri-Protein SynAb / CiTE',
          productPeak: '147,300 Da tri-protein SynAb peak confirmed',
          metricLabel: '147.3 kDa tri-protein assembly verified'
        }
      },
      {
        index: 3,
        id: 'peter_step_4',
        dayHint: 'Thu',
        title: 'Purify SynAb and Run Gel',
        desc: 'Desalt tri-protein conjugate and verify 147 kDa band on SDS-PAGE.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 20,
        sweetSpotMins: 63,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'pet_4_1',
            label: 'Collect SynAb from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_4_2',
            label: 'Spin size exclusion',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_4_3',
            label: 'Heat sample in LDS',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 20,
            sweetSpotMins: 63,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_4_4',
            label: 'Load SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'Fab Input', 'Crude Mix', 'Pure SynAb'], gelMode: 'hhll' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_4_5',
            label: 'View SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Pure SynAb sits beside blue dye. Your protocol?',
          options: [
            {
              label: 'Aliquot 8 µL, fridge stock, then heat 95 °C',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Master stock safe; crisp 147 kDa gel band.'
            },
            {
              label: 'Aliquot 8 µL on bench, heat 75 °C in LDS',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -4,
              safetyMod: 0,
              outcomeText: 'Master stock left on warm bench loses a bit.'
            },
            {
              label: 'Pool SEC shoulder fractions without gel QC',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Mixes pure 147 kDa trimer back with 98 kDa dimer.'
            },
            {
              label: 'Pipette LDS directly near uncapped master tube',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Blue dye cross-contaminates the master stock.'
            }
          ],
          askChudsHint: 'Max: Always aliquot analytical samples and return capped master protein to 4 °C before opening LDS dye.',
          antoineHint: 'Antoine: Separate and refrigerate your purified 147 kDa stock first, then denature only the gel aliquot.'
        },
        dataOutput: {
          type: 'gel',
          label: '10% SDS-PAGE Verification: Purified 147.3 kDa SynAb',
          productPeak: 'Single 147.3 kDa SynAb/CiTE band (95% monomeric purity)',
          metricLabel: '95% SEC purity, zero blue-dye mishap'
        }
      },
      {
        index: 4,
        id: 'peter_step_5',
        dayHint: 'Thu/Fri',
        title: 'Verify Sialidase Activity by MS',
        desc: 'Incubate CiTE with sialoside substrate at pH 7.0 and measure cleavage.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 25,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'pet_5_1',
            label: 'Collect CiTE from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_5_2',
            label: 'Run sialidase assay',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 25,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_5_3',
            label: 'Spin assay supernatant',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_5_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 16,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_5_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which assay design proves sialidase activity?',
          options: [
            {
              label: 'Compare CiTE vs BiTE lacking sialidase, pH 7',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Shows clean sialic acid cleavage at pH 7.0.'
            },
            {
              label: 'Compare CiTE vs free buffer at pH 7.0 (no BiTE)',
              isOptimal: false,
              yieldMod: 2,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Cleavage seen but lacks isogenic BiTE control.'
            },
            {
              label: 'Compare CiTE vs BiTE in PBS at pH 5.2',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Suboptimal pH slows turnover and blurs kinetic.'
            },
            {
              label: 'Assay CiTE at pH 7.0 with 10 mM EDTA + SDS',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'SDS unfolds sialidase and stops Neu5Ac release.'
            }
          ],
          askChudsHint: 'Faiza: Run the exact bispecific scaffold lacking the enzyme domain at physiological pH as your negative control.',
          antoineHint: 'Antoine: Direct head-to-head CiTE vs BiTE at pH 7.0 isolates true enzymatic desialylation.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'UPLC-MS Sialidase Cleavage Assay: CiTE vs BiTE',
          productPeak: '308.1 m/z [M-H]- free Neu5Ac release (92% desialylation)',
          metricLabel: '92% desialylation, active CiTE'
        }
      }
    ]
  },

  // =========================================================================
  // 6. JOÃO NOGUEIRA - Shark VNARs & Targeted PLGA-PEG Nanoparticles
  // =========================================================================
  joao_nogueira: {
    charId: 'joao_nogueira',
    title: 'Shark VNAR Conjugation & Targeted PLGA-PEG Nanoparticles',
    manuscriptTopic: 'Shark VNAR-PLGA Nanoparticles & TIPS Targeting',
    paperRef: 'Nogueira, Richards & Chudasama et al., Chem. Commun. 2019, 55, 7671 (DOI: 10.1039/c9cc02655j); Org. Biomol. Chem. 2020, 18, 2215',
    overview: 'Link monoBrPD-BCN to shark VNARs and click onto PLGA-PEG nanoparticles.',
    steps: [
      {
        index: 0,
        id: 'joao_step_1',
        dayHint: 'Mon',
        title: 'Synthesise monoBrPD-BCN Linker',
        desc: 'Couple bromomaleic propanoate to BCN-amine, purify, and run NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 23,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'joa_1_1',
            label: 'Get monoBrPD precursors',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 6',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_1_2',
            label: 'Run linker synthesis',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 23,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_1_3',
            label: 'Purify on column',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_1_4',
            label: 'Prepare NMR tube (CDCl3)',
            roomId: 'klb_2f',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_1_5',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 17,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_1_6',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which tether avoids NHS ester breakdown?',
          options: [
            {
              label: '2-carbon propionic tether + DCC/NHS, 21 °C',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Clean monoBrPD-BCN isolated without breakdown.'
            },
            {
              label: '2-carbon propionic tether + EDC/NHS in DMF',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Urea byproduct traces lower NHS ester purity.'
            },
            {
              label: '1-carbon ethanoic tether + DCC/NHS, 21 °C',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Degrades via 6-membered intramolecular attack.'
            },
            {
              label: 'Use diBrPD-NHS leaving second bromine free',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Second bromine crosslinks VNAR into homodimers.'
            }
          ],
          askChudsHint: 'Calise: Use the 2-carbon spacer to suppress intramolecular cyclisation, and monobromo PD for single-Cys selectivity.',
          antoineHint: 'Antoine: Propanoate spacing avoids 6-membered NHS decomposition while one bromine prevents dimerisation.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 600 MHz 1H NMR (CDCl3): monoBrPD-PEG2-BCN',
          productPeak: '7.06 ppm (s, 1H, vinylic CH=CBr) and intact endo-BCN signals',
          metricLabel: '76% yield, diagnostic CH=CBr singlet'
        }
      },
      {
        index: 1,
        id: 'joao_step_2',
        dayHint: 'Tue',
        title: 'Modify Shark VNAR and Run MS',
        desc: 'Uncap C-terminal Cys with mild TCEP, attach monoBrPD-BCN, check MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['freezer_20c'],
        prepRequired: [],
        durationMins: 25,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'joa_2_1',
            label: 'Collect VNAR from freezer',
            roomId: 'klb_2f',
            stationTypes: ['freezer_20c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_2_2',
            label: 'Uncap and conjugate VNAR',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 25,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_2_3',
            label: 'Spin and desalt VNAR',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_2_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 16,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_2_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you uncap VNAR Cys without core cleavage?',
          options: [
            {
              label: 'Mild 10 eq TCEP in PBS pH 7.4 at 21 °C',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Uncaps C-terminal Cys cleanly for PAR 1.0.'
            },
            {
              label: 'Mild 20 eq TCEP in PBS pH 7.4 at 37 °C',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Warm TCEP nicks 15% of internal framework bond.'
            },
            {
              label: '2 eq TCEP at pH 6.5 on ice for 15 min',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Leaves GSH disulfide cap partially intact.'
            },
            {
              label: '50 eq TCEP in 4 M guanidine at 37 °C',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Unfolds VNAR and labels conserved core cysteines.'
            }
          ],
          askChudsHint: 'Dan: Mild ambient TCEP selectively cleaves the solvent-exposed C-terminal cap while sparing the buried scaffold S-S.',
          antoineHint: 'Antoine: Around 10 eq TCEP at neutral pH and room temperature decaps without denaturing the immunoglobulin fold.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Waters Q-TOF Intact Protein LC-MS: Shark VNAR-BCN',
          productPeak: '11,918 Da single peak (+491 Da shift, PAR = 1.00)',
          metricLabel: 'PAR = 1.00, 96% VNAR-BCN purity'
        }
      },
      {
        index: 2,
        id: 'joao_step_3',
        dayHint: 'Wed',
        title: 'Formulate PLGA-Azide Nanoparticles',
        desc: 'Dropwise-emulsify Nile-Red PLGA-PEG-azide NPs and remove acetone.',
        locationRoom: 'klb_2f',
        stationTypes: ['balance_table'],
        prepRequired: [],
        durationMins: 22,
        sweetSpotMins: 69,
        minigame: 'syringe_cryo',
        subTasks: [
          {
            id: 'joa_3_1',
            label: 'Weigh PLGA polymers',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_3_2',
            label: 'Pump dropwise emulsion',
            roomId: 'klb_2f',
            stationTypes: ['syringe_pump'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 22,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: 'syringe_cryo',
            minigameConfig: { tempLabel: '21 °C Stirred 1% PVA', rateLabel: '0.15 mL/min Dropwise' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_3_3',
            label: 'Evaporate acetone gently',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_3_4',
            label: 'Wash nanoparticles by spin',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_3_5',
            label: 'Check Nile-Red dye TLC',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'How do you make monodisperse azide NPs?',
          options: [
            {
              label: 'Dropwise 75:25 PLGA:PLGA-PEG-N3; 30 °C vac',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean 194 nm spheres with low PDI 0.09.'
            },
            {
              label: 'Dropwise 50:50 PLGA:PLGA-PEG-N3; 30 °C vac',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'High PEG fraction swells core slightly (PDI 0.18).'
            },
            {
              label: 'Rapid bolus 75:25 PLGA:PLGA-PEG-N3; 30 °C vac',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Fast addition widens particle size distribution.'
            },
            {
              label: 'Dropwise 75:25 PLGA:PLGA-PEG-N3; 60 °C vac',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Exceeding PLGA Tg coalesces particles into film.'
            }
          ],
          askChudsHint: 'Dan: Keep nanoprecipitation steady via syringe pump and evaporate acetone well below the PLGA glass transition.',
          antoineHint: 'Antoine: Blending 25% PEG-azide polymer with gentle ~30 °C evaporation locks PDI below 0.10.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'Nile-Red Encapsulation TLC Check: PLGA-PEG-N3 NPs',
          productPeak: 'PLGA-Nile Red baseline (Rf = 0.00), trace free dye (Rf = 0.62)',
          metricLabel: '194.0 nm core, PDI = 0.09'
        }
      },
      {
        index: 3,
        id: 'joao_step_4',
        dayHint: 'Thu',
        title: 'Click VNAR onto Nanoparticles',
        desc: 'Click VNAR-BCN onto azide particles and check depletion on gel.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'joa_4_1',
            label: 'Collect NPs from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_4_2',
            label: 'Click VNAR onto NPs',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_4_3',
            label: 'Spin supernatant off',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_4_4',
            label: 'Load depletion gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'VNAR In', 'Ctrl NP', 'N3-NP Sup'], gelMode: 'vnar_tricine' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_4_5',
            label: 'View depletion gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you orient VNARs on PLGA-PEG-N3 NPs?',
          options: [
            {
              label: 'SPAAC in PBS + 0.05% Tween 80 at 21 °C',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Tween 80 wets surface; CDR3 loops face outward.'
            },
            {
              label: 'SPAAC in neat PBS without surfactant, 21 °C',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -4,
              safetyMod: 0,
              outcomeText: 'Poor wetting lowers VNAR surface density.'
            },
            {
              label: 'SPAAC in PBS + 2% Tween 80 at 37 °C',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Excess detergent leaches Nile Red from core.'
            },
            {
              label: 'Random EDC/NHS coupling on PLGA-COOH in PBS',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Amide coupling scrambles orientation and CDR3.'
            }
          ],
          askChudsHint: 'Dan: Use site-specific C-terminal click so binding loops point outward, with trace surfactant to wet the corona.',
          antoineHint: 'Antoine: Trace Tween 80 aids wetting without extracting encapsulated dye, and SPAAC preserves CDR3 orientation.'
        },
        dataOutput: {
          type: 'gel',
          label: '16% Tricine SDS-PAGE Depletion Assay: VNAR-NPs',
          productPeak: '88% VNAR uptake onto N3-NPs (193 pmol/mg polymer)',
          metricLabel: '193 pmol/mg oriented VNAR loading'
        }
      },
      {
        index: 4,
        id: 'joao_step_5',
        dayHint: 'Thu/Fri',
        title: 'Verify DLL4 Binding Complex',
        desc: 'Incubate oriented VNAR particles with DLL4 target and verify by MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 25,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'joa_5_1',
            label: 'Collect DLL4 from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_5_2',
            label: 'Incubate DLL4 capture',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 25,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_5_3',
            label: 'Spin unbound target',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_5_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 16,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_5_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which controls prove oriented VNAR capture?',
          options: [
            {
              label: 'Compare SPAAC NPs vs random NHS and N3 blank',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: '3.8x higher DLL4 capture than random NHS.'
            },
            {
              label: 'Compare SPAAC NPs vs N3 blank only (no NHS)',
              isOptimal: false,
              yieldMod: 2,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Shows specific binding but misses orientation gain.'
            },
            {
              label: 'Compare SPAAC NPs vs soluble VNAR without NPs',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Cannot rule out non-specific PLGA adsorption.'
            },
            {
              label: 'Assay SPAAC NPs alone in unfiltered 50% serum',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -14,
              safetyMod: -4,
              outcomeText: 'Protein corona debris obscures target capture.'
            }
          ],
          askChudsHint: 'Richard: Benchmarking against both unmodified azide particles and randomly coupled NHS particles isolates orientation gains.',
          antoineHint: 'Antoine: Dual controls (azide-blank plus random-NHS NPs) demonstrate both specificity and 3.8x orientation advantage.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Q-TOF Pull-Down MS: Oriented VNAR-NP DLL4 Capture',
          productPeak: '54,200 Da DLL4 bound (3.8x higher capture vs random NHS)',
          metricLabel: '3.8x DLL4 capture vs random NHS'
        }
      }
    ]
  },

  // =========================================================================
  // 7. FAIZA JAVAID - Pre-Clicked IgG4 Magacizumab-MMAE & LRG1 Bioassays
  // =========================================================================
  faiza_javaid: {
    charId: 'faiza_javaid',
    title: 'Pre-Clicked IgG4 Magacizumab-MMAE ADC & LRG1 Assays',
    manuscriptTopic: 'Pre-Clicked IgG4 Magacizumab-MMAE & LRG1 Assays',
    paperRef: 'Javaid, Bahou, Baker & Chudasama et al., RSC Chem. Biol. 2021, 2, 1206 (DOI: 10.1039/d1cb00104c); Acta Crystallogr. D 2022, 78, 725',
    overview: 'Pre-click PD-MMAE, rebridge IgG4 Magacizumab, and test cathepsin release.',
    steps: [
      {
        index: 0,
        id: 'faiza_step_1',
        dayHint: 'Mon',
        title: 'Pre-Click diBrPD with MMAE',
        desc: 'Click diBrPD-BCN and MMAE-azide in dry DMSO, check RP-TLC, and purify.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'fai_1_1',
            label: 'Get MMAE-azide and PD',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 6',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_1_2',
            label: 'Get dry DMSO',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 1 (Dry Solvents)',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_1_3',
            label: 'Run DMSO pre-click',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_1_4',
            label: 'Check RP-TLC under UV',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_1_5',
            label: 'Purify PD-MMAE on C18',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'How do you handle hydrophobic MMAE conjugation?',
          options: [
            {
              label: 'Pre-click 1 eq diBrPD-BCN + 1.1 eq MMAE-N3',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean 2015 Da PD-MMAE stock after C18 workup.'
            },
            {
              label: 'Pre-click 1 eq diBrPD-BCN + 0.85 eq MMAE-N3',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: '15% empty diBrPD competes for antibody cysteines.'
            },
            {
              label: 'Pre-click 1.5 eq diBrPD-BCN + 1 eq MMAE-N3',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Leftover empty diBrPD caps hinge without drug.'
            },
            {
              label: 'Rebridge IgG4 first, then SPAAC MMAE in PBS',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Lipophilic MMAE precipitates in aqueous buffer.'
            }
          ],
          askChudsHint: 'Calise: Keep MMAE-azide slightly in excess over diBrPD-BCN in organic solvent so zero empty linker steals Cys.',
          antoineHint: 'Antoine: Slight excess of MMAE-azide during DMSO pre-click ensures every rebridging head carries payload.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'RP-TLC / UV254 Check: Pre-Clicked diBrPD-vc-PABC-MMAE',
          productPeak: 'Single triazole PD-MMAE spot at Rf = 0.38 (free PD gone)',
          metricLabel: '99% diBrPD-BCN consumption (2015 Da)'
        }
      },
      {
        index: 1,
        id: 'faiza_step_2',
        dayHint: 'Tue',
        title: 'Verify PD-MMAE and MagaFab MS',
        desc: 'Digest MagaFab control, desalt samples, and check mass in LG11.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'fai_2_1',
            label: 'Collect IgG4 from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_2_2',
            label: 'Digest MagaFab control',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_2_3',
            label: 'Desalt 6x in water',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_2_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 18,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_2_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you prep PD-MMAE and MagaFab for LG11?',
          options: [
            {
              label: 'Papain pH 7.2, Protein A flow, 6x water desalt',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Shows 2015 Da Br2 triplet and 47.4 kDa Fab.'
            },
            {
              label: 'Papain pH 7.2, 3x spin desalt in 10 mM NH4OAc',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Trace acetate broadens charge-state envelope.'
            },
            {
              label: 'Papain pH 5.5, Protein A flow, 6x water desalt',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Suboptimal papain pH lowers Fab cleavage yield.'
            },
            {
              label: 'Papain pH 7.2 + 20 mM Cys; inject 1x desalt',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -6,
              outcomeText: 'Residual cysteine and buffer salt suppress ESI.'
            }
          ],
          askChudsHint: 'Marcos: Confirm the 1:2:1 bromine isotope pattern survives DMSO and clear digestion reductants completely before MS.',
          antoineHint: 'Antoine: Neutral papain cleavage and six pure-water desalting spins give razor-sharp MagaFab and Br2 spectra.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Waters Q-TOF ESI-MS: PD-MMAE (2015 Da) & MagaFab',
          productPeak: '2015.6 Da [M+H]+ (1:2:1 Br2 triplet) and 47,461 Da MagaFab',
          metricLabel: 'Confirmed 2015 Da linker-drug & MagaFab'
        }
      },
      {
        index: 2,
        id: 'faiza_step_3',
        dayHint: 'Wed',
        title: 'Rebridge Magacizumab to DAR 4',
        desc: 'Reduce IgG4 with TCEP, wash, add PD-MMAE, and verify on SDS-PAGE.',
        locationRoom: 'klb_2f',
        stationTypes: ['tcep_bench'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'fai_3_1',
            label: 'Reduce IgG4 with TCEP',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_3_2',
            label: 'Wash TCEP off',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_3_3',
            label: 'Rebridge with PD-MMAE',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 21,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_3_4',
            label: 'Spin excess drug off',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 10,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_3_5',
            label: 'Load SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'IgG4 Ctrl', '+TCEP Red', 'Maga-MMAE'], gelMode: 'hhll' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_3_6',
            label: 'View SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which protocol hits DAR 4.0 on IgG4 S228P?',
          options: [
            {
              label: '100 eq TCEP 37 °C, spin wash, 10 eq PD-MMAE',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'TCEP-resistant 150 kDa DAR 4.0 Maga-MMAE.'
            },
            {
              label: '50 eq TCEP 37 °C, spin wash, 10 eq PD-MMAE',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Hindered IgG4 disulfides stop short at DAR 3.1.'
            },
            {
              label: '10 eq TCEP 4 °C, spin wash, 10 eq PD-MMAE',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Mild reduction fails to open IgG4 hinge bonds.'
            },
            {
              label: '100 eq TCEP 37 °C, no wash, 10 eq PD-MMAE',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -5,
              outcomeText: 'Residual TCEP cleaves PD-MMAE disubstituted ring.'
            }
          ],
          askChudsHint: 'Calise: IgG4 hinges are harder to reduce than IgG1, yet residual reductant still ruins PD addition unless washed.',
          antoineHint: 'Antoine: Vigorous 100 eq TCEP at 37 °C followed by spin removal unlocks full DAR 4.0 IgG4 rebridging.'
        },
        dataOutput: {
          type: 'gel',
          label: '10% SDS-PAGE (+/- TCEP Challenge): Maga-MMAE',
          productPeak: 'TCEP-resistant 150 kDa rebridged Maga-MMAE band',
          metricLabel: 'PAR = 4.0, TCEP-resistant IgG4 ADC'
        }
      },
      {
        index: 3,
        id: 'faiza_step_4',
        dayHint: 'Thu',
        title: 'Verify Spacer Integrity by NMR',
        desc: 'Dissolve product in DMSO-d6 and verify spacer integrity by 600 MHz NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['balance_table'],
        prepRequired: [],
        durationMins: 20,
        sweetSpotMins: 225,
        minigame: null,
        subTasks: [
          {
            id: 'fai_4_1',
            label: 'Weigh vc-PABC sample',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_4_2',
            label: 'Prepare NMR tube (DMSO-d6)',
            roomId: 'klb_2f',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_4_3',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 20,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_4_4',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you verify intact vc-PABC and DAR 4?',
          options: [
            {
              label: 'DMSO-d6 1H NMR + HIC DAR 0/2/4 control',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean PABC signal at 5.01 ppm and DAR 3.92.'
            },
            {
              label: 'DMSO-d6 1H NMR + UV A280/A252 ratio only',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -4,
              safetyMod: 0,
              outcomeText: 'Average UV DAR hides minor DAR 2 and 6 species.'
            },
            {
              label: 'MeOD-d4 1H NMR (NH exchanged) + HIC check',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Deuterium exchange erases diagnostic Cit NH.'
            },
            {
              label: 'CDCl3 1H NMR of polar vc-PABC linker stock',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -14,
              safetyMod: -4,
              outcomeText: 'Citrulline peptide precipitates in neat CDCl3.'
            }
          ],
          askChudsHint: 'Richard: Aprotic polar NMR keeps exchangeable val-cit amide protons visible while HIC resolves DAR distribution.',
          antoineHint: 'Antoine: DMSO-d6 dissolves polar vc-PABC cleanly without losing NH signals, paired with HIC DAR controls.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 600 MHz 1H NMR (DMSO-d6): vc-PABC Linker',
          productPeak: '5.01 ppm (s, 2H, PABC ArCH2O) and val-cit NH doublets',
          metricLabel: 'Avg DAR = 3.92, intact vc-PABC spacer'
        }
      },
      {
        index: 4,
        id: 'faiza_step_5',
        dayHint: 'Thu/Fri',
        title: 'Test Cathepsin B Cleavage',
        desc: 'Incubate Maga-MMAE with activated cathepsin B at pH 6.5 and run MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['freezer_20c'],
        prepRequired: [],
        durationMins: 30,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'fai_5_1',
            label: 'Collect enzyme from freezer',
            roomId: 'klb_2f',
            stationTypes: ['freezer_20c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_5_2',
            label: 'Run pH 6.5 cleavage',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 30,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_5_3',
            label: 'Spin protein crash',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_5_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 18,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'fai_5_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you prove extracellular ADC cleavage?',
          options: [
            {
              label: 'DTT-activated cathepsin B in pH 6.5 buffer',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Quantitative free MMAE release at tumour pH.'
            },
            {
              label: 'Unactivated cathepsin B in pH 6.5 buffer',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Partially oxidised enzyme gives sluggish release.'
            },
            {
              label: 'DTT-activated cathepsin B in pH 7.4 PBS',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Near-neutral pH drops cathepsin B turnover rate.'
            },
            {
              label: 'DTT-activated cathepsin B + 5 mM EDTA, pH 8',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Alkaline pH inactivates the cysteine protease.'
            }
          ],
          askChudsHint: 'Marcos: Cathepsin B requires mild pre-reduction of its active-site Cys and acidic tumour-microenvironment pH.',
          antoineHint: 'Antoine: Pre-activate cathepsin B with DTT and assay at pH 6.5 to mirror extracellular tumour LRG1 biology.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'UPLC-MS Cathepsin B Cleavage (pH 6.5): Free MMAE Release',
          productPeak: '718.5 Da [Free MMAE+H]+ released cleanly at pH 6.5',
          metricLabel: 'Quantitative extracellular MMAE release'
        }
      }
    ]
  },

  // =========================================================================
  // 8. CALISE BAHOU - Gram-Scale p-TsOH diBrPD-NHS, 95% HHLL & GFP S147C
  // =========================================================================
  calise_bahou: {
    charId: 'calise_bahou',
    title: 'Gram-Scale p-TsOH diBrPD-NHS, 95% HHLL & Trifunctional GFP',
    manuscriptTopic: 'p-TsOH diBrPD-NHS, 95% HHLL & Trifunctional GFP',
    paperRef: 'Bahou, Richards, Maruani, Javaid, Baker & Chudasama, Org. Biomol. Chem. 2018, 16, 1359 (DOI: 10.1039/c7ob03138f); Bioconjugate Chem. 2021, 32, 672',
    overview: 'Scale p-TsOH diBrPD-NHS, hit 95% HHLL at 4 °C, and build serum-stable GFP.',
    steps: [
      {
        index: 0,
        id: 'calise_step_1',
        dayHint: 'Mon',
        title: 'Synthesise Gram-Scale diBrPD-NHS',
        desc: 'Cleave ester with p-TsOH, activate with DCC/NHS, purify, and run NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'cal_1_1',
            label: 'Get p-TsOH acid',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 11',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_1_2',
            label: 'Run deprotection and NHS',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_1_3',
            label: 'Remove reaction solvent',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'buchi_bump',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_1_4',
            label: 'Purify on column',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_1_5',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_1_6',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you cleave the diBrPD t-Bu ester safely?',
          options: [
            {
              label: 'Reflux p-TsOH in dry toluene; zero TFA',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean white crystals with 100% Br2 intact.'
            },
            {
              label: 'Reflux 10 mol% CSA in toluene, 110 °C',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Slower cleavage leaves ~12% residual t-Bu ester.'
            },
            {
              label: 'Stir 20% TFA/DCM at 21 °C for 4 h',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -10,
              safetyMod: -2,
              outcomeText: 'Trace trifluoroacetate exchanges ring bromines.'
            },
            {
              label: 'Stir 1:1 TFA/DCM at 21 °C for 2 h',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -16,
              safetyMod: -4,
              outcomeText: 'Heavy halogen exchange yields monobromo-PD.'
            }
          ],
          askChudsHint: 'Dan: Non-nucleophilic sulfonic acid in refluxing toluene removes t-Bu cleanly without displacing ring bromines.',
          antoineHint: 'Antoine: Catalytic-to-stoichiometric p-TsOH in toluene preserves both bromines 100%, unlike TFA.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 600 MHz 1H NMR (CDCl3): Gram-Scale diBrPD-NHS',
          productPeak: '3.96 (t, 2H), 3.21 (s, 3H, NMe), 2.84 (s, 4H, NHS); zero CH=CBr',
          metricLabel: '2.1 g white crystals, 100% Br2 intact'
        }
      },
      {
        index: 1,
        id: 'calise_step_2',
        dayHint: 'Tue',
        title: 'Rebridge Trastuzumab at 4 °C',
        desc: 'Pre-chill antibody with diBrPD at 4 °C, add TCEP, and check HHLL gel.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 23,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'cal_2_1',
            label: 'Collect Trastuzumab from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_2_2',
            label: 'Get PD linker stock',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 6',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_2_3',
            label: 'Run cold TCEP rebridging',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 23,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_2_4',
            label: 'Spin and desalt',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_2_5',
            label: 'Load SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_2_6',
            label: 'View SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you push 150 kDa HHLL past 95%?',
          options: [
            {
              label: '4 °C mAb + 20 eq diBrPD, then 10 eq TCEP',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Locks interchain hinge cleanly to 95.4% HHLL.'
            },
            {
              label: '21 °C mAb + 20 eq diBrPD, then 10 eq TCEP',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Ambient in situ gives 84% HHLL and 12% half-mAb.'
            },
            {
              label: '37 °C 10 eq TCEP first, then 20 eq diBrPD',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Pre-reduction promotes intrachain 75 kDa loops.'
            },
            {
              label: '4 °C mAb + 40 eq diBrPD in 15% DMF, then TCEP',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'High co-solvent and excess PD precipitate mAb.'
            }
          ],
          askChudsHint: 'Max: Chill the antibody with linker already present before adding reductant so disulfides bridge before scrambling.',
          antoineHint: 'Antoine: Cold 4 °C in situ rebridging suppresses heavy-light chain slippage into 75 kDa half-antibody.'
        },
        dataOutput: {
          type: 'gel',
          label: '10% Non-Reducing SDS-PAGE: 4 °C In Situ Rebridging',
          productPeak: '95.4% intact 150 kDa HHLL Trastuzumab band (PDAR 4.0)',
          metricLabel: '95.4% HHLL homogeneity, PDAR = 4.0'
        }
      },
      {
        index: 2,
        id: 'calise_step_3',
        dayHint: 'Wed',
        title: 'Build Trifunctional GFP Switch',
        desc: 'Modify GFP S147C, lock with p-anisidine vs thiol, and check by MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['freezer_20c'],
        prepRequired: [],
        durationMins: 23,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'cal_3_1',
            label: 'Collect GFP from freezer',
            roomId: 'klb_2f',
            stationTypes: ['freezer_20c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_3_2',
            label: 'Run GFP conjugation',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 23,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_3_3',
            label: 'Quench thiol waste',
            roomId: 'klb_2f',
            stationTypes: ['base_bath'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_3_4',
            label: 'Desalt GFP conjugate',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_3_5',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_3_6',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you tune GFP S147C C-N vs C-S lock?',
          options: [
            {
              label: 'p-Anisidine lock vs thiol; measure final µL',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'C-N resists GSH cleanly; true 89% recovery.'
            },
            {
              label: 'p-Anisidine lock; assume 500 µL start volume',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Chemistry works but spin loss skews yield calc.'
            },
            {
              label: 'Steric t-butylamine vs thiol at pH 7.4',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Hindered amine reacts slowly and hydrolyses.'
            },
            {
              label: '50 mM NaOH hydrolysis instead of p-anisidine',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'High pH opens ring and risks protein unfolding.'
            }
          ],
          askChudsHint: 'Richard: Aniline substitution turns the second position into an irreversible C-N bond; check true post-spin µL.',
          antoineHint: 'Antoine: Electron-rich p-anisidine locks against GSH retro-addition while accurate final volume prevents fake yields.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Agilent Q-TOF Intact Protein MS: Trifunctional GFP S147C',
          productPeak: '29,412 Da GFP-PD-Anisidine (0% cleavage in 5 mM GSH)',
          metricLabel: '89% true yield, tunable C-N / C-S switch'
        }
      },
      {
        index: 3,
        id: 'calise_step_4',
        dayHint: 'Thu',
        title: 'Test Serum Stability by MS',
        desc: 'Incubate PD-AF488 vs maleimide in human serum and analyse in LG11.',
        locationRoom: 'klb_2f',
        stationTypes: ['freezer_20c'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'cal_4_1',
            label: 'Collect serum from freezer',
            roomId: 'klb_2f',
            stationTypes: ['freezer_20c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_4_2',
            label: 'Incubate serum stability',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_4_3',
            label: 'Spin protein samples',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_4_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_4_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you detect payload transfer in serum?',
          options: [
            {
              label: '37 °C serum vs maleimide-AF488 over 7d, LC-MS',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Maleimide loses 44% to HSA; PD loses under 2%.'
            },
            {
              label: '37 °C serum PD-AF488 only over 7d (no Mal)',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Shows PD stability but lacks maleimide benchmark.'
            },
            {
              label: '37 °C 50 µM GSH in PBS vs maleimide over 24 h',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Short PBS assay understates HSA Cys34 competition.'
            },
            {
              label: '4 °C serum vs maleimide over 7d; raw injection',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -5,
              outcomeText: 'Chilled serum hides retro-Michael and clogs C18.'
            }
          ],
          askChudsHint: 'Peter: Include a maleimide comparator in warm human serum at physiological 37 °C to reveal retro-Michael HSA transfer.',
          antoineHint: 'Antoine: Running PD beside maleimide in 37 °C serum over a full week proves stability against HSA Cys34.'
        },
        dataOutput: {
          type: 'lcms',
          label: '7-Day Human Serum LC-MS Audit: PD vs Maleimide',
          productPeak: '149,210 Da PD-Trastuzumab (98% intact vs 44% maleimide loss)',
          metricLabel: '98% 7-day human serum stability'
        }
      },
      {
        index: 4,
        id: 'calise_step_5',
        dayHint: 'Thu/Fri',
        title: 'Check FcRn Binding at pH 6.0',
        desc: 'Test pH 6.0 vs 7.4 FcRn receptor binding and verify complex by gel.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 21,
        sweetSpotMins: 69,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'cal_5_1',
            label: 'Collect FcRn from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_5_2',
            label: 'Run pH binding assay',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 21,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_5_3',
            label: 'Wash bound complex',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_5_4',
            label: 'Load complex gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'mAb Ctrl', 'pH 6.0 Bind', 'pH 7.4 Free'], gelMode: 'native_shift' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'cal_5_5',
            label: 'View complex gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which pH buffers prove intact FcRn recycling?',
          options: [
            {
              label: 'Bind FcRn at pH 6.0 and release at pH 7.4',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Matches native IgG1 pH-switch binding profile.'
            },
            {
              label: 'Bind FcRn at pH 6.0; no pH 7.4 elution lane',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Shows binding but omits physiological release.'
            },
            {
              label: 'Bind FcRn at pH 6.5 and release at pH 7.0',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Narrow pH step yields weak partial shift contrast.'
            },
            {
              label: 'Bind FcRn solely in pH 7.4 PBS on native gel',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'IgG1 Fc lacks FcRn affinity at neutral blood pH.'
            }
          ],
          askChudsHint: 'Richard: Endosomal IgG1 salvage relies on His protonation near pH 6.0 and clean release at neutral blood pH.',
          antoineHint: 'Antoine: Pair pH 6.0 association with pH 7.4 dissociation on native gel to prove unaltered Fc recycling.'
        },
        dataOutput: {
          type: 'gel',
          label: 'pH 6.0 vs 7.4 FcRn Native Shift Gel',
          productPeak: 'Intact pH 6.0 FcRn complex and full pH 7.4 dissociation',
          metricLabel: 'Full pH-dependent FcRn retention'
        }
      }
    ]
  },

  // =========================================================================
  // 9. RICHARD SPEARS - Thioaryl-PD Kinetics, PEG Hydrogels & Safe CDMP Dha
  // =========================================================================
  richard_spears: {
    charId: 'richard_spears',
    title: 'Thioaryl-PD Kinetics, PEG Hydrogels & Safe CDMP Dha',
    manuscriptTopic: 'Thioaryl-PD Kinetics, Star-PEG Gels & CDMP Dha',
    paperRef: 'Bahou, Spears, Aliev, Maruani, Fernández, Javaid, Szijj, Baker & Chudasama, Chem. Commun. 2019, 55, 14829; Biomacromolecules 2023, 24, 4646; Chem. Sci. 2024, 15, 4797',
    overview: 'Synthesise twisted N-phenyl PDs, measure GSH kinetics, and cast PEG gels.',
    steps: [
      {
        index: 0,
        id: 'richard_step_1',
        dayHint: 'Mon',
        title: 'Synthesise Soluble Bis-PD Linkers',
        desc: 'Prep bleach bath, prepare PEG-spaced bis-PD crosslinkers, quench thiols, and purify.',
        locationRoom: 'klb_2f',
        stationTypes: ['base_bath'],
        prepRequired: [],
        durationMins: 26,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'ric_1_1',
            label: 'Prep bleach bath in Chudasama hood',
            roomId: 'klb_2f',
            stationTypes: ['base_bath'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_1_2',
            label: 'Get thiol reagents',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 5',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_1_3',
            label: 'Run bis-PD reaction',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 26,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_1_4',
            label: 'Quench in bleach bath',
            roomId: 'klb_2f',
            stationTypes: ['base_bath'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_1_5',
            label: 'Check TLC under UV',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_1_6',
            label: 'Remove solvent on Büchi',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'buchi_bump',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_1_7',
            label: 'Purify on column',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'How do you keep 400 mM bis-PD stocks soluble?',
          options: [
            {
              label: 'PEG3 spacer, 5% DMSO, hood + bleach bath',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clear 400 mM stock with zero thiol odour.'
            },
            {
              label: 'Short C3 alkyl spacer, 10% DMSO, hood + bleach',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Slightly cloudy near 200 mM; precipitates cold.'
            },
            {
              label: 'PEG3 spacer in 1% DMSO at 4 °C without warming',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Insufficient co-solvent leaves solid suspension.'
            },
            {
              label: 'Lipophilic biphenyl spacer in 5% DMSO buffer',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -5,
              outcomeText: 'Aromatic bis-PD crashes immediately in water.'
            }
          ],
          askChudsHint: 'Marcos: Ethoxy repeats break hydrophobic stacking for aqueous stock solubility while bleach neutralises residual thiols.',
          antoineHint: 'Antoine: A hydrophilic PEG3/PEG4 bridge plus 5% DMSO keeps bis-PD homogeneous even at high stock molarity.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'SIL G/UV254 TLC: Twisted N-Et,N-Ph PD & 5DiBr Bis-PD',
          productPeak: 'Bis-PD PEG spot at Rf = 0.41 (clean baseline separation)',
          metricLabel: '79% yield, clear 5% DMSO solubility'
        }
      },
      {
        index: 1,
        id: 'richard_step_2',
        dayHint: 'Tue',
        title: 'Audit N-Phenyl Twist by NMR',
        desc: 'Dissolve product in CDCl3 and quantify residual solvent integrals by NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['balance_table'],
        prepRequired: [],
        durationMins: 21,
        sweetSpotMins: 225,
        minigame: null,
        subTasks: [
          {
            id: 'ric_2_1',
            label: 'Weigh N-Ph PD oil',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_2_2',
            label: 'Prepare NMR tube (CDCl3)',
            roomId: 'klb_2f',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_2_3',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 21,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_2_4',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Your oil retains 0.08 eq EtOAc. How report it?',
          options: [
            {
              label: 'Disclose 0.08 eq EtOAc and adjust molar wt',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Exact stoichiometry and peak Richard rigour.'
            },
            {
              label: 'Disclose 0.08 eq EtOAc, ignore molar wt shift',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Honest spectrum, though kinetic eq drift ~2%.'
            },
            {
              label: 'High-vac at 65 °C 12 h without NMR recheck',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Unknown residual solvent and minor thermal loss.'
            },
            {
              label: 'Crop NMR plot to 4.5-8.5 ppm to hide EtOAc',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Vijay spots cropped aliphatic axis immediately.'
            }
          ],
          askChudsHint: 'Dan: Always show the full 0-10 ppm spectrum and fold residual solvent equivalents into your stock molecular weight.',
          antoineHint: 'Antoine: Full spectral disclosure plus gravimetric solvent-correction keeps kinetic stoichiometry exact.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 600 MHz 1H/13C NMR (CDCl3): N-Et,N-Ph PD',
          productPeak: 'C4/C5 at 136.8, 134.9 ppm; 0.08 eq EtOAc disclosed',
          metricLabel: '98.9 wt% molar-corrected, rigour verified'
        }
      },
      {
        index: 2,
        id: 'richard_step_3',
        dayHint: 'Wed',
        title: 'Measure Fab Competition by MS',
        desc: 'Run 1:1 Fab kinetic competition, quench timepoints, and check LC-MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 25,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'ric_3_1',
            label: 'Collect Fab from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_3_2',
            label: 'Run competition kinetics',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 25,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_3_3',
            label: 'Quench and desalt',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_3_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 18,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_3_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you freeze kinetic competition vials?',
          options: [
            {
              label: 'Quench excess maleimide, drop pH 5, desalt',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Frozen 4:1 preference for twisted N-Ph PD.'
            },
            {
              label: 'Drop pH 5.0 only (no maleimide), quick desalt',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Slow residual reaction shifts ratio during spin.'
            },
            {
              label: 'Flash-freeze in liquid N2, thaw on warm rack',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Reactants resume equilibrating once thawed.'
            },
            {
              label: 'Leave unquenched vials in 22 °C autosampler',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Timepoints converge before LC-MS injection.'
            }
          ],
          askChudsHint: 'Peter: Cap any unreacted cysteine irreversibly while acidifying so the competition ratio freezes at the exact timepoint.',
          antoineHint: 'Antoine: Rapid maleimide thiol-trapping plus pH 5 arrest locks the 4:1 kinetic selectivity cleanly.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Agilent PLRP-S Q-TOF Kinetic Competition Trace',
          productPeak: '48,012 Da Fab-PD(Et,Ph) 4:1 vs 47,964 Da Fab-PD(DiEt)',
          metricLabel: '4.0 : 1 N-Ph kinetic selectivity'
        }
      },
      {
        index: 3,
        id: 'richard_step_4',
        dayHint: 'Thu',
        title: 'Form Regioselective Antibody Dha',
        desc: 'Convert heavy-chain Cys to Dha with safe CDMP and check on gel.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 28,
        sweetSpotMins: 69,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'ric_4_1',
            label: 'Get CDMP reagent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 11',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_4_2',
            label: 'Weigh CDMP solid',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_4_3',
            label: 'Run CDMP reaction',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 28,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_4_4',
            label: 'Spin and desalt',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_4_5',
            label: 'Load SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'Native mAb', 'Red Ctrl', 'HC Dha mAb'], gelMode: 'reducing' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_4_6',
            label: 'View SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which safe reagent forms heavy-chain Dha?',
          options: [
            {
              label: 'Bench-stable CDMP + in situ TCEP, pH 8.0',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Safe crystalline Dha gives clean HC selectivity.'
            },
            {
              label: 'Bench-stable CDMP + pre-washed TCEP, pH 7.4',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Slower elimination at pH 7.4 leaves bis-adduct.'
            },
            {
              label: 'Dibromoadipamide (DBAA) 50 eq at pH 8.0, 37 °C',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Non-selective over-elimination hits light chains.'
            },
            {
              label: 'Excess 100 eq CDMP at pH 9.5 and 50 °C',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -6,
              outcomeText: 'Harsh pH and heat cause off-target fragmentation.'
            }
          ],
          askChudsHint: 'Antoine: Cupboard 11 CDMP eliminates selectively at mildly basic pH 8.0 without thermal degradation.',
          antoineHint: 'Antoine: Mild pH 8.0 CDMP with controlled TCEP delivers HC-selective dehydroalanine cleanly.'
        },
        dataOutput: {
          type: 'gel',
          label: 'Reducing SDS-PAGE: Regioselective HC Dha Antibody',
          productPeak: 'Selective HC interchain Cys (CH1 + hinge) to Dha with intact LC (DAR 6)',
          metricLabel: 'Safe CDMP Dha, regioselective DAR 6'
        }
      },
      {
        index: 4,
        id: 'richard_step_5',
        dayHint: 'Thu/Fri',
        title: 'Cast Star-PEG Thiol Hydrogels',
        desc: 'Crosslink 8-arm PEG-SH with bis-PD, trigger lysis, and check MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['balance_table'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'ric_5_1',
            label: 'Weigh 8-arm PEG-SH',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_5_2',
            label: 'Cast hydrogel at pH 8',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_5_3',
            label: 'Quench residual thiols',
            roomId: 'klb_2f',
            stationTypes: ['base_bath'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_5_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 18,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'ric_5_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: '5DiBr gels in 8 s at pH 8. How do you mix it?',
          options: [
            {
              label: '2 s rapid mix pH 7.4-8.0; cysteamine lysis',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Sets cleanly in 8 s; cysteamine dissolves gel.'
            },
            {
              label: '2 s rapid mix pH 7.4; omit cysteamine test',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Clean gel forms, though thiol lysis unproven.'
            },
            {
              label: 'Mix slowly over 30 s at pH 8.0 by pipette',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Network cures mid-pipetting with trapped voids.'
            },
            {
              label: 'Cast hydrogel in pH 5.0 MES buffer (8-arm SH)',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -14,
              safetyMod: -4,
              outcomeText: 'Low thiolate population stalls crosslinking rate.'
            }
          ],
          askChudsHint: 'Calise: Deprotonated thiolate drives sub-10-second gelation at pH 8, so pipette rapidly and verify thiol triggers.',
          antoineHint: 'Antoine: Fast 2 s vortex/mix at pH 7.4-8.0 beats the 8 s gel point, and cysteamine proves 5DiBr reversibility.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Star-PEG Hydrogel Cysteamine Lysis LC-MS Profile',
          productPeak: '684.2 Da bis-PD-cysteamine adduct after rapid gel lysis',
          metricLabel: '8 s gelation, 91% THP-1 viability'
        }
      }
    ]
  },

  // =========================================================================
  // 10. MARCOS FERNÁNDEZ - Thio-PD SMDC Scaffolds & GSH vs HSA Turn-On
  // =========================================================================
  marcos_fernandez: {
    charId: 'marcos_fernandez',
    title: 'Self-Immolative Thio-PD SMDCs & Intracellular GSH Turn-On',
    manuscriptTopic: 'Thio-PD Self-Immolative SMDCs & GSH Turn-On',
    paperRef: 'Fernández, Shamsabadi & Chudasama, Chem. Commun. 2020, 56, 1125 (DOI: 10.1039/C9CC08744C); Chem. Sci. 2018, 9, 790',
    overview: 'Build thio-PD coumarin SMDCs and prove selective intracellular GSH release.',
    steps: [
      {
        index: 0,
        id: 'marcos_step_1',
        dayHint: 'Mon',
        title: 'Make Cupboard 5 Thio-PD Cores',
        desc: 'Prep bleach bath, substitute diBrPD with thiols in hood, quench waste, and check TLC.',
        locationRoom: 'klb_2f',
        stationTypes: ['base_bath'],
        prepRequired: [],
        durationMins: 28,
        sweetSpotMins: 69,
        minigame: 'buchi_bump',
        subTasks: [
          {
            id: 'mar_1_1',
            label: 'Prep bleach bath in Chudasama hood',
            roomId: 'klb_2f',
            stationTypes: ['base_bath'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_1_2',
            label: 'Get Cupboard 5 thiols',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 5',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_1_3',
            label: 'Run thiol substitution',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 28,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_1_4',
            label: 'Quench in bleach bath',
            roomId: 'klb_2f',
            stationTypes: ['base_bath'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_1_5',
            label: 'Remove reaction solvent',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'buchi_bump',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_1_6',
            label: 'Check TLC under UV',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'How do you handle volatile Cupboard 5 thiols?',
          options: [
            {
              label: '21 °C in hood; bleach bath tips & workup waste',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Zero odour escapes; six thio-PDs form cleanly.'
            },
            {
              label: '21 °C in hood; Et3N quench then delayed bleach',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Product clean, though trace smell lingers briefly.'
            },
            {
              label: '40 °C in hood; EtOAc extract without bleach',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Volatile arylthiol escapes during workup transfer.'
            },
            {
              label: 'Weigh arylthiol on open bench balance first',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -6,
              outcomeText: 'Arylthiol vapour drifts; Lab Condition drops.'
            }
          ],
          askChudsHint: 'André: Keep thiols strictly behind the sash until quenched, and oxidise glassware promptly in bleach.',
          antoineHint: 'Antoine: Dispense inside the Chudasama hood with bleach bath prepped, then oxidise all tips after workup.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'SIL G/UV254 + KMnO4 TLC: Alkanethiol vs Bis-Thioaryl PD',
          productPeak: 'Yellow bis-SAr PD spot at Rf = 0.61 (zero free thiol)',
          metricLabel: '72-86% yield across 6 thio-PDs'
        }
      },
      {
        index: 1,
        id: 'marcos_step_2',
        dayHint: 'Tue',
        title: 'Assemble Folate-Coumarin SMDC',
        desc: 'Couple caged coumarin and gamma-folate with PyBOP, then purify.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 30,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'mar_2_1',
            label: 'Get PyBOP coupling agent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 11',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_2_2',
            label: 'Weigh protected folate',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_2_3',
            label: 'Run PyBOP coupling',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 30,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_2_4',
            label: 'Check quenched UV TLC',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_2_5',
            label: 'Concentrate EtOAc extract on Büchi',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_2_6',
            label: 'Purify on column',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 14,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'How do you couple and purify gamma-folate?',
          options: [
            {
              label: 'Gamma-folate + PyBOP/DMSO; DCM/MeOH + 1% AcOH',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean gamma-SMDC with fluorescence fully caged.'
            },
            {
              label: 'Gamma-folate + EDC/HOBt in DMSO; 1% AcOH col',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Sluggish EDC gives lower yield and urea traces.'
            },
            {
              label: 'Gamma-folate + PyBOP/DMSO; neutral DCM/MeOH',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Alpha-carboxylate streaks badly across silica.'
            },
            {
              label: 'Unprotected folic acid + PyBOP/DMF at 60 °C',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Alpha/gamma mixture forms insoluble regioisomers.'
            }
          ],
          askChudsHint: 'Faiza: Protect alpha vs gamma selectivity with dry DMSO/PyBOP, and add mild acid on silica to stop carboxylate streaking.',
          antoineHint: 'Antoine: PyBOP in dry DMSO couples selectively while 1% AcOH keeps the free acid sharp on Biotage.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'UV254 / UV365 TLC: Caged Coumarin-Folate SMDC',
          productPeak: 'Caged folate-SMDC spot at Rf = 0.36 (15% MeOH/DCM + AcOH)',
          metricLabel: '68% yield, fluorescence 99% caged'
        }
      },
      {
        index: 2,
        id: 'marcos_step_3',
        dayHint: 'Wed',
        title: 'Verify SMDC Structure by NMR',
        desc: 'Dissolve product in DMSO-d6 and run 700 MHz 1H/13C NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['balance_table'],
        prepRequired: [],
        durationMins: 21,
        sweetSpotMins: 225,
        minigame: null,
        subTasks: [
          {
            id: 'mar_3_1',
            label: 'Weigh SMDC for NMR',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_3_2',
            label: 'Prepare NMR tube (DMSO-d6)',
            roomId: 'klb_2f',
            stationTypes: ['lab_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_3_3',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 21,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_3_4',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which NMR solvent resolves folate SMDC?',
          options: [
            {
              label: 'DMSO-d6 at 4.5 cm for 1H and 13C NMR',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Full solubility and clean 154.2 ppm carbamate.'
            },
            {
              label: 'DMSO-d6 + 10% D2O at 4.5 cm for 1H NMR',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -4,
              safetyMod: 0,
              outcomeText: 'Water suppresses pteridine NH and broadens peak.'
            },
            {
              label: 'MeOD-d4 at 4.5 cm; warm to 40 °C to dissolve',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Partial folate suspension leaves weak 13C SNR.'
            },
            {
              label: 'CDCl3 with 5% CD3OD at 25 °C for 1H NMR',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -14,
              safetyMod: -4,
              outcomeText: 'Polar folate SMDC remains largely insoluble.'
            }
          ],
          askChudsHint: 'André: Polar pteridine rings resist chloroform or methanol, whereas neat aprotic polar solvent preserves every NH.',
          antoineHint: 'Antoine: Neat DMSO-d6 at 4.5 cm dissolves the folate-coumarin SMDC and reveals the diagnostic carbamate.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 700 MHz 1H/13C NMR (DMSO-d6): Thio-PD SMDC',
          productPeak: '8.64 (pteridine C7-H), 10.12 (NH) and 154.2 ppm carbamate',
          metricLabel: '700 MHz 1H/13C, intact SMDC scaffold'
        }
      },
      {
        index: 3,
        id: 'marcos_step_4',
        dayHint: 'Thu',
        title: 'Test HSA vs GSH by MS',
        desc: 'Incubate SMDC in HSA vs 5 mM GSH, crash protein, and run LC-MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['freezer_20c'],
        prepRequired: [],
        durationMins: 30,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'mar_4_1',
            label: 'Collect HSA from freezer',
            roomId: 'klb_2f',
            stationTypes: ['freezer_20c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_4_2',
            label: 'Incubate HSA vs GSH',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 30,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_4_3',
            label: 'Crash and spin HSA',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_4_4',
            label: 'Submit to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 18,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_4_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you prep 40 mg/mL HSA for C18 LC-MS?',
          options: [
            {
              label: '3x ice-cold MeCN crash, 14,000g spin, inject',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: '96% intact in HSA; fast cleavage in 5 mM GSH.'
            },
            {
              label: '1x RT MeCN crash, 6,000g spin, inject',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Incomplete albumin precipitation raises baseline.'
            },
            {
              label: '3x ice-cold MeCN crash; test 0.5 mM GSH only',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Below intracellular 5 mM GSH slows release kinetics.'
            },
            {
              label: 'Dilute 1:2 in water and inject HSA straight',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -6,
              outcomeText: 'Albumin fouls C18 guard column and suppresses MS.'
            }
          ],
          askChudsHint: 'Richard: Precipitate 40 mg/mL albumin cleanly with excess cold organic solvent before injecting onto reversed-phase.',
          antoineHint: 'Antoine: Three volumes of ice-cold MeCN plus high-speed spin protect the C18 column while keeping coumarin soluble.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Waters UPLC-MS: 40 mg/mL HSA vs 5 mM GSH Timecourse',
          productPeak: '176.1 Da [Free Coumarin+H]+ in 5 mM GSH (96% intact in HSA)',
          metricLabel: '96% HSA stable, under 2 h GSH release'
        }
      },
      {
        index: 4,
        id: 'marcos_step_5',
        dayHint: 'Thu/Fri',
        title: 'Confirm Zero HSA Transfer Gel',
        desc: 'Run non-reducing SDS-PAGE to confirm coumarin stays off blood HSA.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 25,
        sweetSpotMins: 69,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'mar_5_1',
            label: 'Collect samples from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_5_2',
            label: 'Run GSH turn-on assay',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 25,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_5_3',
            label: 'Spin assay wells',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_5_4',
            label: 'Load HSA control gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'HSA Ctrl', 'HSA+SMDC', '5 mM GSH'], gelMode: 'dual_fluor' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'mar_5_5',
            label: 'View HSA control gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'Which gel controls prove zero off-target HSA?',
          options: [
            {
              label: '5 mM GSH vs 40 mg/mL HSA + 10 µM GSH, non-red',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: '42x GSH turn-on with dark 66.5 kDa HSA lane.'
            },
            {
              label: '5 mM GSH vs thiol-free HSA only, non-reducing',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Clean contrast, though omits 10 µM blood GSH.'
            },
            {
              label: '5 mM GSH vs 40 mg/mL HSA + 5 mM GSH, non-red',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'High GSH cleaves the blood control and blurs gap.'
            },
            {
              label: '5 mM GSH vs 40 mg/mL HSA boiled in BME',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Reducing boil strips probe and masks transfer.'
            }
          ],
          askChudsHint: 'Calise: Blood plasma carries ~10 µM GSH alongside abundant albumin, whereas tumour cytosol holds millimolar GSH.',
          antoineHint: 'Antoine: Contrast 5 mM intracellular GSH against 40 mg/mL HSA + 10 µM plasma GSH on a non-reducing gel.'
        },
        dataOutput: {
          type: 'gel',
          label: 'Fluorescence SDS-PAGE: HSA Non-Transfer vs GSH Release',
          productPeak: '42x turn-on in 5 mM GSH and completely dark 66.5 kDa HSA lane',
          metricLabel: '42x GSH turn-on, 0% HSA transfer'
        }
      }
    ]
  },

  // =========================================================================
  // 11. ARCHIE WALL - Baker Group N-Aryl Maleimide HSA Cys34 Conjugates
  // =========================================================================
  archie_wall: {
    charId: 'archie_wall',
    title: 'Site-Selective N-Aryl Maleimide HSA-Drug Conjugate Platform',
    manuscriptTopic: 'Thiol-Selective N-Aryl Maleimide Conjugation on Human Serum Albumin Cys34',
    paperRef: 'Wall, Nicholls, Caspersen, Skrivergaard, Howard, Karu, Chudasama & Baker, Org. Biomol. Chem. 2019, 17, 7870 (DOI: 10.1039/c9ob00721k)',
    overview: 'Build an N-aryl maleimide linker, conjugate HSA Cys34 with balanced-rotor desalting, and lock the ring by hydrolysis.',
    steps: [
      {
        index: 0,
        id: 'archie_step_1',
        dayHint: 'Mon',
        title: 'N-Aryl Maleimide Linker Synthesis',
        desc: 'Condense maleic anhydride with arylamine in AcOH, strip solvent on Büchi, and run 1H NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: 'buchi_bump',
        subTasks: [
          {
            id: 'arc_1_1',
            label: 'Get Baker maleimide kit',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 17',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_1_2',
            label: 'Weigh arylamine & anhydride',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_1_3',
            label: 'Run AcOH ring condensation',
            roomId: 'klb_2f',
            stationTypes: ['fumehood'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_1_4',
            label: 'Strip AcOH toluene azeotrope',
            roomId: 'klb_2f',
            stationTypes: ['buchi'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'buchi_bump',
            minigameConfig: { solvent: 'AcOH / Toluene' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_1_5',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_1_6',
            label: 'View NMR on PC',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'nmr',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you form N-aryl maleimide cleanly?',
          options: [
            {
              label: 'Reflux AcOH 3 h, then toluene azeotrope dry',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Quantitative ring closure with 6.85 ppm alkene.'
            },
            {
              label: 'Reflux AcOH 1 h, then quick rotary strip',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Residual maleamic acid lowers crude recovery.'
            },
            {
              label: 'Stir with Et3N in DMF at 60 °C overnight',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Base triggers Michael polymerisation of maleimide.'
            },
            {
              label: 'Heat aniline + maleic anhydride neat at 150 °C',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -5,
              outcomeText: 'Thermal charring and side-polymer ruin maleimide.'
            }
          ],
          askChudsHint: 'Nafsika: Glacial acetic acid drives maleamic acid ring closure smoothly, and co-evaporating with toluene removes trace acid without base.',
          antoineHint: 'Antoine: Keep nucleophilic bases out during cyclisation so the strained maleimide double bond never polymerises.'
        },
        dataOutput: {
          type: 'nmr',
          label: '1H NMR (400 MHz, CDCl3): N-Aryl Maleimide',
          productPeak: '6.85 ppm (s, 2H, maleimide CH=CH), 7.36 ppm (d, 2H, Ar-H), 7.04 ppm (d, 2H, Ar-H)',
          metricLabel: '84% yield, clean 6.85 ppm maleimide singlet'
        }
      },
      {
        index: 1,
        id: 'archie_step_2',
        dayHint: 'Tue',
        title: 'Biotage Flash Isolation & Maleimide Stability Check',
        desc: 'Purify the N-aryl maleimide linker on Biotage and audit pH 7.4 integrity by LC-MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 21,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'arc_2_1',
            label: 'Get column solvents',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 9',
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_2_2',
            label: 'Spot TLC for Rf check',
            roomId: 'klb_2f',
            stationTypes: ['tlc_station'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_2_3',
            label: 'Purify linker on Biotage',
            roomId: 'klb_2f',
            stationTypes: ['biotage'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 16,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_2_4',
            label: 'Run pH 7.4 buffer check',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 21,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_2_5',
            label: 'Submit linker to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_2_6',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you isolate and stock the N-aryl maleimide?',
          options: [
            {
              label: 'Hexane/EtOAc Biotage; dry DMSO stock at -20 °C',
              isOptimal: true,
              yieldMod: 9,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Pure N-aryl maleimide with zero pre-hydrolysis.'
            },
            {
              label: 'Hexane/EtOAc Biotage; 1:1 MeCN/PBS bench stock',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Aqueous pH 7.4 stock slowly ring-opens overnight.'
            },
            {
              label: 'DCM/MeOH Biotage + 1% Et3N modifier; DMSO stock',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -10,
              safetyMod: -2,
              outcomeText: 'Triethylamine and methanol open the maleimide.'
            },
            {
              label: 'Silica plug in wet MeOH/H2O; store at 37 °C',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Warm aqueous methanol hydrolyses imide to acid.'
            }
          ],
          askChudsHint: 'Richard: Keep flash elution aprotic without amine modifiers, and store reactive maleimide stocks strictly dry in DMSO.',
          antoineHint: 'Antoine: Neutral hexane/EtOAc silica chromatography isolates the intact N-aryl maleimide cleanly before protein work.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Waters UPLC-MS: N-Aryl Maleimide Linker',
          productPeak: '357.1 Da [M+H]+ (clean single isotope envelope, >98% UV purity)',
          metricLabel: '98% UV purity, zero hydrolysed ring'
        }
      },
      {
        index: 2,
        id: 'archie_step_3',
        dayHint: 'Wed',
        title: 'Cys34 Activation & Balanced-Rotor Spin Desalt of HSA',
        desc: 'Unmask HSA Cys34 with mild TCEP, balance VivaSpin tubes to 0.01 g, and run 12% non-reducing SDS-PAGE.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 18,
        sweetSpotMins: 69,
        minigame: 'gel_load',
        subTasks: [
          {
            id: 'arc_3_1',
            label: 'Collect HSA stock from fridge',
            roomId: 'klb_2f',
            stationTypes: ['fridge_4c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_3_2',
            label: 'Activate Cys34 with mild TCEP',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 18,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_3_3',
            label: 'Balance tubes to 0.01 g',
            roomId: 'klb_2f',
            stationTypes: ['balance_table'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_3_4',
            label: 'Spin desalt on VivaSpin 30 kDa',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 13,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_3_5',
            label: 'Load HSA & conjugate gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'gel_load',
            minigameConfig: { laneLabels: ['Ladder', 'HSA Ctrl', 'Cys34 Act', 'HSA-Conj'], gelMode: 'hsa_monomer' },
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_3_6',
            label: 'View SDS-PAGE gel',
            roomId: 'klb_2f',
            stationTypes: ['gel_tank'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'gel',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you unmask HSA Cys34 without unfolding albumin?',
          options: [
            {
              label: '1 eq TCEP pH 7, 25 °C; 0.01 g paired VivaSpin',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: '0.95 free SH/HSA with all 17 disulfides intact.'
            },
            {
              label: '1 eq TCEP pH 7, 25 °C; rough eye-matched tubes',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: -2,
              outcomeText: 'Cys34 activates, though rotor wobble risks spin.'
            },
            {
              label: '10 eq DTT pH 8.5, 37 °C for 2 h; VivaSpin wash',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -10,
              safetyMod: -2,
              outcomeText: 'Excess reductant scrambles core HSA disulfides.'
            },
            {
              label: '50 eq TCEP in 6 M guanidine, 55 °C, 1 h',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -5,
              outcomeText: 'Denatures albumin and aggregates protein in well.'
            }
          ],
          askChudsHint: 'Dan: Commercial HSA carries a Cys34 mixed disulfide; stoichiometric mild TCEP and careful rotor balancing keep all 17 structural bridges intact.',
          antoineHint: 'Antoine: Match paired VivaSpin tubes to 0.01 g on the balance and use 1 eq TCEP at neutral pH so only Cys34 is reduced.'
        },
        dataOutput: {
          type: 'gel',
          label: '12% Non-Reducing SDS-PAGE: Pretreated HSA Cys34 (66.5 kDa)',
          productPeak: 'Single crisp 66.5 kDa monomer band (zero disulfide oligomer)',
          metricLabel: '94% HSA recovery, 0.95 SH/protein'
        }
      },
      {
        index: 3,
        id: 'archie_step_4',
        dayHint: 'Thu',
        title: 'HSA Cys34 Thiosuccinimide Coupling & Ring-Open Lock',
        desc: 'Conjugate HSA Cys34 with N-aryl maleimide to thiosuccinimide (~67 kDa), hydrolyse (+18 Da) in pH 8.0 Tris to succinamic acid, and verify by MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['tcep_bench'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'arc_4_1',
            label: 'Set up Cys34 maleimide coupling',
            roomId: 'klb_2f',
            stationTypes: ['tcep_bench'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_4_2',
            label: 'Incubate coupling & Tris hydrolysis',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_4_3',
            label: 'Spin desalt HSA conjugate',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 12,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_4_4',
            label: 'Submit conjugate to Mass Spec',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 16,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_4_5',
            label: 'View MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you lock the HSA Cys34 thiosuccinimide?',
          options: [
            {
              label: 'Couple pH 7.4; pH 8.0 Tris 37 °C ring-open',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: '+18 Da succinamic acid lock on ~67 kDa HSA.'
            },
            {
              label: 'Couple pH 7.4; keep pH 7.0 PBS at 21 °C only',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Closed thiosuccinimide hydrolyses below 35%.'
            },
            {
              label: '15 eq linker in pH 8.5 buffer for 6 h at 37 °C',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Excess maleimide cross-reacts with surface Lys.'
            },
            {
              label: '3 eq linker in pH 10.5 carbonate at 50 °C',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'Harsh base hydrolyses maleimide pre-coupling.'
            }
          ],
          askChudsHint: 'Calise: N-aryl maleimides form a ~67 kDa Cys34 thiosuccinimide that hydrolyses cleanly in pH 8.0 Tris buffer to a stable succinamic acid.',
          antoineHint: 'Antoine: Couple selectively at pH 7.4 first, then incubate in pH 8.0 Tris at 37 °C for the +18 Da succinamic acid ring-open lock.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Q-TOF MaxEnt1 MS: Ring-Opened HSA Cys34 Conjugate',
          productPeak: '66,890 Da Succinamic Acid Lock (~67 kDa, +18 Da vs thiosuccinimide, DAR 1.0)',
          metricLabel: '96% 1:1 Cys34 succinamic acid, +18 Da locked'
        }
      },
      {
        index: 4,
        id: 'archie_step_5',
        dayHint: 'Thu/Fri',
        title: '20 mM GSH Plasma Thiol-Exchange Audit & MS',
        desc: 'Challenge ring-opened succinamic acid HSA conjugate in plasma with 20 mM GSH and verify zero retro-Michael loss by MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['freezer_20c'],
        prepRequired: [],
        durationMins: 24,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'arc_5_1',
            label: 'Thaw human plasma aliquot',
            roomId: 'klb_2f',
            stationTypes: ['freezer_20c'],
            cupboardHint: null,
            mode: 'action',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_5_2',
            label: 'Incubate plasma thiol exchange',
            roomId: 'klb_2f',
            stationTypes: ['heatblock'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 24,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_5_3',
            label: 'Spin and quench plasma assay',
            roomId: 'klb_2f',
            stationTypes: ['centrifuge'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 10,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_5_4',
            label: 'Submit plasma audit to MS',
            roomId: 'cib_lg11_ms',
            stationTypes: ['lcms_unit'],
            cupboardHint: null,
            mode: 'wait',
            durationMins: 11,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'arc_5_5',
            label: 'View plasma MS on PC',
            roomId: 'cib_lg11_ms',
            stationTypes: ['pc_terminal'],
            cupboardHint: null,
            mode: 'collect',
            durationMins: 4,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'lcms',
            requiresJobFromPrev: true
          }
        ],
        choice: {
          prompt: 'How do you prove irreversible plasma Cys34 linkage?',
          options: [
            {
              label: '37 °C plasma + 20 mM GSH vs closed ctrl, 7 d',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: '97% succinamic acid intact vs 41% closed loss.'
            },
            {
              label: '37 °C plasma + 20 mM GSH 7 d; omit closed ctrl',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Shows 97% survival without retro-Michael baseline.'
            },
            {
              label: '21 °C PBS + 50 µM GSH for 24 h only, LC-MS',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Cold low-thiol PBS masks slow retro-Michael loss.'
            },
            {
              label: '4 °C plasma + 20 mM GSH; inject unspun on LC-MS',
              isOptimal: false,
              yieldMod: -13,
              purityMod: -15,
              safetyMod: -6,
              outcomeText: 'Raw plasma fouls C18 guard and stalls LG11 MS.'
            }
          ],
          askChudsHint: 'Faiza: Run the unhydrolysed closed thiosuccinimide alongside your succinamic acid conjugate in 20 mM GSH plasma at 37 °C.',
          antoineHint: 'Antoine: Benchmarking 7-day 37 °C plasma with 20 mM GSH against closed thiosuccinimide proves the succinamic acid lock stops retro-Michael exchange.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Waters Q-TOF MS: 7-Day 20 mM GSH & Plasma Stability Audit',
          productPeak: '66,890 Da Succinamic Acid HSA (97% intact in 20 mM GSH vs 41% closed loss)',
          metricLabel: '97% plasma/GSH stability, zero retro-Michael'
        }
      }
    ]
  }
};

// Stamp cascade metadata onto Cascade 1 entries while preserving CAMPAIGNS identity
Object.keys(window.KLB.CAMPAIGNS || {}).forEach(cid => {
  if (window.KLB.CAMPAIGNS[cid]) {
    window.KLB.CAMPAIGNS[cid].cascadeIndex = 0;
    window.KLB.CAMPAIGNS[cid].cascadeLabel = 'Cascade 1';
  }
});

// ============================================================================
// CASCADE 2 CAMPAIGNS (11 Distinct Verified Chudasama/Baker Group Projects)
// ============================================================================
window.KLB.CAMPAIGNS_V2 = {
  "daniel_richards": {
    "charId": "daniel_richards",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "Photochemical Disulfide Re-Bridging & Thiomaleimide Photodecarboxylation",
    "manuscriptTopic": "Thiomaleimide Photo-Rebridging & Photodecarboxylation SI",
    "paperRef": "Richards, Maruani, Baker & Chudasama et al., Org. Biomol. Chem. 2016, 14, 455 (DOI: 10.1039/c5ob02120k)",
    "overview": "Synthesise dithiophenolmaleimide photo-reagent, photo-rebridge calcitonin at 365 nm, track C-terminal photodecarboxylation, and verify stapled Fab by gel.",
    "steps": [
      {
        "index": 0,
        "id": "dan2_step_1",
        "dayHint": "Mon",
        "title": "Synthesise Thiomaleimide Photo-Reagent",
        "desc": "Prep bleach bath, displace dibromomaleimide with thiophenol, concentrate on Buchi, and verify by TLC.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "base_bath"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "buchi_bump",
        "subTasks": [
          {
            "id": "dan2_1_1",
            "label": "Prep bleach bath for thiol quench",
            "roomId": "klb_2f",
            "stationTypes": [
              "base_bath"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_1_2",
            "label": "Collect thiophenol from Cupboard 5",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 5",
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_1_3",
            "label": "Get dibromomaleimide & NaOAc",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 17",
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_1_4",
            "label": "Run dithiophenolmaleimide synthesis",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_1_5",
            "label": "Concentrate crude on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 12,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "MeOH / EtOAc"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_1_6",
            "label": "Verify yellow spot on UV TLC",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "tlc",
            "requiresJobFromPrev": false
          }
        ],
        "choice": {
          "prompt": "Which base and stoichiometry yield clean dithiophenolmaleimide?",
          "options": [
            {
              "label": "2.1 eq PhSH, NaOAc in MeOH at 20 °C",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Crisp disubstitution without maleimide imide ring-opening."
            },
            {
              "label": "2.1 eq PhSH, Et3N in MeOH at 20 °C",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Stronger Et3N promotes minor maleimide hydrolysis."
            },
            {
              "label": "4.0 eq PhSH, DIPEA in DMF at 45 °C",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -3,
              "outcomeText": "Excess thiolate adds across the double bond and opens ring."
            },
            {
              "label": "2.1 eq PhSH in neat AcOH at 95 °C",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -4,
              "outcomeText": "Acidic heating stalls displacement and chars the maleimide."
            }
          ],
          "askChudsHint": "Calise: Weak acetate buffer cleanly drives both bromide substitutions on maleimide without nucleophilic ring cleavage.",
          "antoineHint": "Antoine: Stick to 2.1 equivalents of thiophenol with sodium acetate in methanol at room temperature."
        },
        "dataOutput": {
          "type": "tlc",
          "label": "SiO2 TLC (30% EtOAc/Petrol): N-Me Dithiophenolmaleimide",
          "productPeak": "Rf = 0.44 bright yellow UV-active spot (monobromo SM consumed)",
          "metricLabel": "Rf = 0.44, 94% crude conversion"
        }
      },
      {
        "index": 1,
        "id": "dan2_step_2",
        "dayHint": "Tue",
        "title": "Purify Photo-Reagent & Confirm by NMR",
        "desc": "Isolate dithiophenolmaleimide photo-reagent by Biotage flash chromatography and confirm structure by 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "biotage"
        ],
        "prepRequired": [],
        "durationMins": 22,
        "sweetSpotMins": 69,
        "minigame": "biotage",
        "subTasks": [
          {
            "id": "dan2_2_1",
            "label": "Purify photo-reagent on Biotage",
            "roomId": "klb_2f",
            "stationTypes": [
              "biotage"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 22,
            "sweetSpotMins": 69,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": "biotage",
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_2_2",
            "label": "Submit purified sample to NMR",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 25,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_2_3",
            "label": "Inspect 1H NMR on TopSpin PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you elute and analyse the thiomaleimide photo-reagent?",
          "options": [
            {
              "label": "10-40% EtOAc/petrol; dry CDCl3 NMR",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Sharp yellow band and clean aryl/N-methyl NMR resonances."
            },
            {
              "label": "0-10% MeOH/DCM; wet CDCl3 NMR",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Steep polarity co-elutes diphenyl disulfide impurity."
            },
            {
              "label": "EtOAc/petrol + 1% Et3N; DMSO-d6 NMR",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Amine modifier slowly hydrolyses the maleimide on silica."
            },
            {
              "label": "100% petrol wash; D2O/MeCN NMR",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -15,
              "safetyMod": -4,
              "outcomeText": "Compound precipitates on column and stays poorly soluble."
            }
          ],
          "askChudsHint": "Richard: Neutral ethyl acetate/petrol gradients separate diphenyl disulfide cleanly ahead of the yellow maleimide band.",
          "antoineHint": "Antoine: Elute gently with 10-40% EtOAc in petrol and acquire the spectrum in dry CDCl3."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "Bruker 600 MHz 1H NMR (CDCl3): Dithiophenolmaleimide",
          "productPeak": "7.26-7.14 ppm (m, 10H, 2x SPh), 3.04 ppm (s, 3H, N-Me)",
          "metricLabel": "84% isolated yield, >98% NMR purity"
        }
      },
      {
        "index": 2,
        "id": "dan2_step_3",
        "dayHint": "Wed",
        "title": "365 nm UV Photo-Rebridge Calcitonin",
        "desc": "Retrieve salmon calcitonin, irradiate with dithiophenolmaleimide at 365 nm without exogenous reductant, spin, and run LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fridge_4c"
        ],
        "prepRequired": [],
        "durationMins": 22,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "dan2_3_1",
            "label": "Collect calcitonin from fridge",
            "roomId": "klb_2f",
            "stationTypes": [
              "fridge_4c"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_3_2",
            "label": "Irradiate at 365 nm under UV lamp",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 22,
            "sweetSpotMins": 69,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_3_3",
            "label": "Spin and desalt peptide conjugate",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 13,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_3_4",
            "label": "Submit peptide to LG11 Q-TOF MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 20,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_3_5",
            "label": "Inspect calcitonin MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you trigger photochemical disulfide re-bridging on calcitonin?",
          "options": [
            {
              "label": "1.5 eq photo-reagent, pH 6.2 PBS, 365 nm N2",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Reductant-free 365 nm metathesis staples Cys1-Cys7 cleanly."
            },
            {
              "label": "1.5 eq photo-reagent, pH 6.2 PBS, 365 nm air",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Dissolved O2 quenches triplet state and oxidises Met8."
            },
            {
              "label": "5.0 eq photo-reagent, pH 8.5 borate, 254 nm",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -11,
              "safetyMod": -4,
              "outcomeText": "Hard 254 nm UV damages Trp/Tyr and hydrolyses maleimide."
            },
            {
              "label": "1.5 eq reagent + 10 eq TCEP, 365 nm UV",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Excess TCEP strips PhSH early and scrambles photochemistry."
            }
          ],
          "askChudsHint": "Peter: Dithiophenolmaleimides swap disulfides directly under degassed 365 nm light without needing TCEP.",
          "antoineHint": "Antoine: Degas pH 6.2 buffer with nitrogen and irradiate at gentle 365 nm rather than harsh 254 nm."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Agilent Q-TOF LC-MS: Photo-Rebridged Salmon Calcitonin",
          "productPeak": "3,541 Da observed (calc. 3,541 Da, +109 Da maleimide bridge)",
          "metricLabel": "92% photo-rebridged calcitonin, zero TCEP"
        }
      },
      {
        "index": 3,
        "id": "dan2_step_4",
        "dayHint": "Thu",
        "title": "Track C-Terminal Cys Photodecarboxylation",
        "desc": "Adjust peptide carboxylate buffer on pH meter, drive 365 nm thiomaleimide photodecarboxylation, and verify CO2 loss by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "ph_probe"
        ],
        "prepRequired": [],
        "durationMins": 23,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "dan2_4_1",
            "label": "Adjust pH 5.5 buffer on pH meter",
            "roomId": "klb_2f",
            "stationTypes": [
              "ph_probe"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 8,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_4_2",
            "label": "Run 365 nm photodecarboxylation",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 23,
            "sweetSpotMins": 69,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_4_3",
            "label": "Inject sample onto LG11 LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 25,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_4_4",
            "label": "Confirm -44 Da CO2 loss on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which conditions promote selective C-terminal Cys photodecarboxylation?",
          "options": [
            {
              "label": "pH 5.5 acetate buffer, 365 nm UV for 15 min",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Clean -44 Da decarboxylation gives stable cyclic thioether."
            },
            {
              "label": "pH 7.4 PBS, 365 nm UV for 15 min",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Neutral pH leaves minor ring-opened maleamic byproduct."
            },
            {
              "label": "pH 2.5 glycine, 365 nm UV for 60 min",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Protonated C-terminus suppresses PET decarboxylation."
            },
            {
              "label": "pH 8.5 borate + 5 mM DTT, 254 nm UV",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -16,
              "safetyMod": -5,
              "outcomeText": "DTT cleaves the conjugate and 254 nm degrades peptide."
            }
          ],
          "askChudsHint": "Marcos: Keep the C-terminal carboxylate deprotonated above pKa 3.5 while staying mildly acidic to prevent maleimide hydrolysis.",
          "antoineHint": "Antoine: Buffered pH 5.5 for 15 min at 365 nm cleanly extrudes CO2 without hydrolysing the maleimide ring."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Agilent Q-TOF LC-MS: Photodecarboxylated C-Term Cys Peptide",
          "productPeak": "-44.0 Da mass shift observed (clean CO2 extrusion)",
          "metricLabel": "89% photodecarboxylation conversion"
        }
      },
      {
        "index": 4,
        "id": "dan2_step_5",
        "dayHint": "Thu/Fri",
        "title": "Verify Photo-Stapled Fab by Gel",
        "desc": "Challenge photo-stapled Fab with reducing TCEP buffer, heat-denature, load SDS-PAGE gel, and confirm covalent stapling.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "tcep_bench"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "dan2_5_1",
            "label": "Challenge photo-Fab with TCEP mix",
            "roomId": "klb_2f",
            "stationTypes": [
              "tcep_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 10,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_5_2",
            "label": "Heat-denature SDS-PAGE samples",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_5_3",
            "label": "Load & run reducing SDS-PAGE gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 26,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "Native Fab",
                "TCEP Ctrl",
                "Photo-Fab"
              ],
              "gelMode": "hhll"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "dan2_5_4",
            "label": "Inspect stapled Fab gel bands",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you prove covalent interchain Fab photo-stapling on gel?",
          "options": [
            {
              "label": "5 mM TCEP + 75 °C for 5 min in Laemmli dye",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Native Fab splits to 25 kDa; photo-Fab stays intact at 48 kDa."
            },
            {
              "label": "5 mM TCEP + 95 °C for 15 min in Laemmli",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Prolonged boiling causes minor retro-Michael band smear."
            },
            {
              "label": "Non-reducing sample buffer at 25 °C only",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -10,
              "safetyMod": 0,
              "outcomeText": "Without reductant, native and stapled Fab look identical."
            },
            {
              "label": "50 mM BME + 100 °C for 30 min at pH 9.0",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -4,
              "outcomeText": "Hot basic thiol exchanges and splits the stapled bridge."
            }
          ],
          "askChudsHint": "Max: Reducing SDS-PAGE distinguishes covalently rebridged 48 kDa Fab from native Fab that collapses into 25 kDa chains.",
          "antoineHint": "Antoine: Mild TCEP reduction at 75 °C splits unbridged Fab while leaving the photo-stapled 48 kDa band intact."
        },
        "dataOutput": {
          "type": "gel",
          "label": "12% Reducing SDS-PAGE: TCEP-Resistant Photo-Stapled Fab",
          "productPeak": "Intact 48 kDa stapled Fab band vs 25 kDa native HC/LC control",
          "metricLabel": "93% covalent interchain photo-bridging"
        }
      }
    ]
  },
  "maximillian_lee": {
    "charId": "maximillian_lee",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "TCEP-Triggered p-Azidobenzyl Irreversible Cys Locking & Benzyl Isothiocyanate Labelling",
    "manuscriptTopic": "p-Azidobenzyl Cys Locking & BITC Labelling SI",
    "paperRef": "Lee, Maruani, Baker & Chudasama et al., Chem. Commun. 2015, 51, 3774 (DOI: 10.1039/c4cc08515a); RSC Adv. 2020, 10, 12839 (DOI: 10.1039/d0ra02934c)",
    "overview": "Synthesise p-azidobenzyl bromomaleimide, isolate and verify by NMR, lock Fab Cys via TCEP-triggered azide cleavage, label Cys selectively with benzyl isothiocyanate, and audit 20 mM GSH stability.",
    "steps": [
      {
        "index": 0,
        "id": "max2_step_1",
        "dayHint": "Mon",
        "title": "Synthesise p-Azidobenzyl Bromomaleimide",
        "desc": "Couple p-azidobenzyl alcohol/amine onto bromomaleimide in dry solvent, concentrate on Buchi, and verify by UV TLC.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "buchi_bump",
        "subTasks": [
          {
            "id": "max2_1_1",
            "label": "Get bromomaleimide & azide building block",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 17",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_1_2",
            "label": "Draw anhydrous THF from Cupboard 1",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 1 (Dry Solvents)",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_1_3",
            "label": "Assemble p-azidobenzyl bromomaleimide",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_1_4",
            "label": "Evaporate THF carefully on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "Dry THF / Hexane"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_1_5",
            "label": "Check crude Rf on UV TLC",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "tlc",
            "requiresJobFromPrev": false
          }
        ],
        "choice": {
          "prompt": "How do you install the p-azidobenzyl motif onto bromomaleimide safely?",
          "options": [
            {
              "label": "PPh3/DIAD Mitsunobu in dry THF, 0 to 20 °C",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 3,
              "outcomeText": "Clean N-alkylation preserves both azide and bromomaleimide."
            },
            {
              "label": "K2CO3 with p-azidobenzyl bromide in DMF, 50 °C",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": -1,
              "outcomeText": "Warm basic DMF promotes side-reaction at C-Br position."
            },
            {
              "label": "NaH in THF at 65 °C for 4 h",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -11,
              "safetyMod": -5,
              "outcomeText": "Strong hydride polymerises bromomaleimide and risks azide."
            },
            {
              "label": "Neat SOCl2 then Et3N at 80 °C",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -6,
              "outcomeText": "Harsh heating degrades aryl azide and destroys maleimide."
            }
          ],
          "askChudsHint": "Antoine: Keep aryl azides away from strong heating or strong hydride; chilled Mitsunobu coupling in dry THF is gentle.",
          "antoineHint": "Antoine: Use Mitsunobu conditions from 0 °C to room temperature and keep the Buchi water bath below 30 °C."
        },
        "dataOutput": {
          "type": "tlc",
          "label": "SiO2 TLC (25% EtOAc/Petrol): p-Azidobenzyl Bromomaleimide",
          "productPeak": "Rf = 0.51 UV-active spot (azidobenzyl alcohol consumed)",
          "metricLabel": "Rf = 0.51, clean single product spot"
        }
      },
      {
        "index": 1,
        "id": "max2_step_2",
        "dayHint": "Tue",
        "title": "Isolate Azidobenzyl Linker & Run NMR",
        "desc": "Purify p-azidobenzyl bromomaleimide on Biotage and confirm benzylic and maleimide signals by 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "biotage"
        ],
        "prepRequired": [],
        "durationMins": 23,
        "sweetSpotMins": 69,
        "minigame": "biotage",
        "subTasks": [
          {
            "id": "max2_2_1",
            "label": "Isolate linker on Biotage column",
            "roomId": "klb_2f",
            "stationTypes": [
              "biotage"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 23,
            "sweetSpotMins": 69,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": "biotage",
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_2_2",
            "label": "Submit azidobenzyl linker to NMR",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 25,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_2_3",
            "label": "View linker 1H NMR on TopSpin PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which column eluent cleanly separates DIAD-H2 byproduct from the linker?",
          "options": [
            {
              "label": "10-35% Et2O/petrol dry-loaded on silica",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Clean separation of pale yellow solid away from DIAD-H2."
            },
            {
              "label": "0-5% MeOH/DCM liquid load on silica",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "DIAD-H2 co-elutes across the main product fractions."
            },
            {
              "label": "30% EtOAc/petrol + 1% Et3N on silica",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Amine additive triggers partial bromomaleimide ring opening."
            },
            {
              "label": "Reverse-phase C18 with 0.1% TFA/H2O/MeCN",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Aqueous acid hydrolyses bromomaleimide during concentration."
            }
          ],
          "askChudsHint": "Dan: Ether/petrol gradients resolve triphenylphosphine oxide and reduced DIAD cleanly from N-benzyl maleimides.",
          "antoineHint": "Antoine: Dry-load onto neutral silica and elute with 10-35% ether in petrol to drop DIAD byproducts behind."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "Bruker 600 MHz 1H NMR (CDCl3): p-Azidobenzyl Bromomaleimide",
          "productPeak": "7.38 (d, 2H), 7.00 (d, 2H), 6.89 (s, 1H, =CH), 4.68 (s, 2H, NCH2)",
          "metricLabel": "81% isolated yield, >97% purity"
        }
      },
      {
        "index": 2,
        "id": "max2_step_3",
        "dayHint": "Wed",
        "title": "Conjugate Fab Cys & Lock via TCEP Cleavage",
        "desc": "React Fab thiol with p-azidobenzyl bromomaleimide, then trigger TCEP azide reduction and 1,6-elimination for irreversible Cys locking.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fridge_4c"
        ],
        "prepRequired": [],
        "durationMins": 23,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "max2_3_1",
            "label": "Collect reduced Fab from fridge",
            "roomId": "klb_2f",
            "stationTypes": [
              "fridge_4c"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_3_2",
            "label": "Prepare buffered TCEP trigger stock",
            "roomId": "klb_2f",
            "stationTypes": [
              "tcep_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 10,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_3_3",
            "label": "Run Cys conjugation & TCEP lock",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 23,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_3_4",
            "label": "Spin-desalt locked Fab conjugate",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 13,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_3_5",
            "label": "Acquire Fab conjugate LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 18,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_3_6",
            "label": "Inspect locked Fab MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you execute TCEP-triggered p-azidobenzyl cleavage cleanly?",
          "options": [
            {
              "label": "Conjugate at pH 7.4, then 10 eq TCEP at 37 °C",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Azide reduces and eliminates p-aminobenzyl to lock Cys."
            },
            {
              "label": "Mix linker + 10 eq TCEP simultaneously pH 7.4",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -9,
              "safetyMod": 0,
              "outcomeText": "TCEP reduces free linker azide before Cys capture."
            },
            {
              "label": "Conjugate at pH 7.4, then 2 eq DTT at 20 °C",
              "isOptimal": false,
              "yieldMod": -4,
              "purityMod": -8,
              "safetyMod": 0,
              "outcomeText": "DTT triggers competing thiol exchange instead of locking."
            },
            {
              "label": "Conjugate at pH 9.5, then 50 eq TCEP at 60 °C",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -16,
              "safetyMod": -5,
              "outcomeText": "High pH and heat denature Fab and hydrolyse the adduct."
            }
          ],
          "askChudsHint": "Faiza: Always finish Cys addition first and remove/sequence TCEP cleanly so Staudinger reduction only hits the bound conjugate.",
          "antoineHint": "Antoine: Form the thiomaleimide adduct at pH 7.4 first, then add buffered TCEP at 37 °C to drive 1,6-elimination."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Agilent Q-TOF LC-MS: TCEP-Unlocked Irreversible Fab-Cys",
          "productPeak": "-131 Da p-aminobenzyl elimination observed (clean N-H maleimide)",
          "metricLabel": "94% locked Fab-Cys adduct"
        }
      },
      {
        "index": 3,
        "id": "max2_step_4",
        "dayHint": "Thu",
        "title": "Selectively Label Cys with Benzyl Isothiocyanate",
        "desc": "Buffer pH for cysteine selectivity, dispense benzyl isothiocyanate from Cupboard 6, react, desalt, and verify chemoselectivity by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "ph_probe"
        ],
        "prepRequired": [],
        "durationMins": 22,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "max2_4_1",
            "label": "Calibrate pH 6.8 buffer on meter",
            "roomId": "klb_2f",
            "stationTypes": [
              "ph_probe"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_4_2",
            "label": "Get benzyl isothiocyanate (Cupboard 6)",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 6",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_4_3",
            "label": "Run Cys-selective BITC labelling",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 22,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_4_4",
            "label": "Desalt BITC-labelled protein",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 12,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_4_5",
            "label": "Run BITC conjugate on LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 18,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_4_6",
            "label": "Check single +149 Da BITC MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you restrict benzyl isothiocyanate (BITC) solely to Cys over Lys?",
          "options": [
            {
              "label": "2 eq BITC in pH 6.8 PB, 20% MeCN at 25 °C",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Protonated Lys stays silent; Cys forms single dithiocarbamate."
            },
            {
              "label": "2 eq BITC in pH 8.0 PBS at 25 °C",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Elevated pH awakens Lys amines for minor +298 Da di-adduct."
            },
            {
              "label": "25 eq BITC in pH 9.2 carbonate at 37 °C",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -12,
              "safetyMod": -3,
              "outcomeText": "Classic Edman-like Lys over-labelling smears mass envelope."
            },
            {
              "label": "2 eq BITC in neat pH 4.0 citrate at 4 °C",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -10,
              "safetyMod": -1,
              "outcomeText": "Thiol stays fully protonated and reaction stalls below 15%."
            }
          ],
          "askChudsHint": "Calise: Keep pH near 6.8 so Cys thiolate reacts rapidly with BITC while Lys epsilon-amines stay protonated.",
          "antoineHint": "Antoine: Mildly acidic-to-neutral pH 6.8 with 2 equivalents of BITC gives clean single Cys modification."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Agilent Q-TOF LC-MS: Chemoselective Cys-BITC Adduct",
          "productPeak": "+149.2 Da single BITC addition (zero Lys over-labelling)",
          "metricLabel": "96% Cys selectivity, single modification"
        }
      },
      {
        "index": 4,
        "id": "max2_step_5",
        "dayHint": "Thu/Fri",
        "title": "Audit 20 mM GSH Thiol-Exchange Stability",
        "desc": "Incubate TCEP-locked conjugate against 20 mM glutathione challenge, load SDS-PAGE gel, and confirm resistance to thiol exchange.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "heatblock"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "max2_5_1",
            "label": "Incubate 20 mM GSH plasma challenge",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_5_2",
            "label": "Load GSH stability SDS-PAGE gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 22,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "Fab Ctrl",
                "TCEP Lock",
                "+20mM GSH"
              ],
              "gelMode": "dual_fluor"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "max2_5_3",
            "label": "Inspect 20 mM GSH stability gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you benchmark irreversible locking against 20 mM GSH exchange?",
          "options": [
            {
              "label": "pH 7.4 PBS, 20 mM GSH at 37 °C for 24 h",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "TCEP-locked conjugate stays >95% intact; N-Bn control sheds."
            },
            {
              "label": "pH 7.4 PBS, 1 mM GSH at 20 °C for 1 h",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Too mild to distinguish locked adduct from reversible control."
            },
            {
              "label": "pH 8.5 Tris, 20 mM GSH at 55 °C for 48 h",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Excess heat denatures Fab and obscures exchange kinetics."
            },
            {
              "label": "Unbuffered 100 mM GSH at pH 3.0",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -14,
              "safetyMod": -4,
              "outcomeText": "Acidic GSH precipitates Fab in the microtube."
            }
          ],
          "askChudsHint": "Dan: Physiologically relevant intracellular glutathione (20 mM, pH 7.4, 37 °C) cleanly tests retro-Michael locking.",
          "antoineHint": "Antoine: Run the 20 mM GSH challenge at pH 7.4 and 37 °C alongside an unlocked control on the same gel."
        },
        "dataOutput": {
          "type": "gel",
          "label": "Dual-Channel SDS-PAGE: 20 mM GSH Thiol-Exchange Audit",
          "productPeak": ">95% conjugate retention after 24 h in 20 mM GSH (37 °C)",
          "metricLabel": ">95% intact vs 42% for unlocked control"
        }
      }
    ]
  },
  "antoine_maruani": {
    "charId": "antoine_maruani",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "Site-Selective Multi-Porphyrin Antibody Photodynamic Therapy (PDT)",
    "manuscriptTopic": "Multi-Porphyrin Fab-PD PDT Conjugate SI",
    "paperRef": "Maruani, Savoie, Bryden, Boyle, Baker & Chudasama, Chem. Commun. 2015, 51, 15304 (DOI: 10.1039/c5cc06985h)",
    "overview": "Synthesise foil-wrapped porphyrin-azide and strained-alkyne PD reagents, rebridge Trastuzumab Fab at 4 °C, click multi-porphyrin PDT payloads via SPAAC, and verify dark stability by gel.",
    "steps": [
      {
        "index": 0,
        "id": "ant2_step_1",
        "dayHint": "Mon",
        "title": "Synthesise Foil-Wrapped Porphyrin-Azide PD",
        "desc": "Assemble foil-wrapped cationic porphyrin-azide and strained-alkyne PD intermediates in dry solvent, evaporate on Buchi, and check TLC.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "buchi_bump",
        "subTasks": [
          {
            "id": "ant2_1_1",
            "label": "Get diBrPD & porphyrin-azide stock",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 6",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_1_2",
            "label": "Draw anhydrous DCM/DMF (Cupboard 1)",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 1 (Dry Solvents)",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_1_3",
            "label": "Couple foil-wrapped porphyrin reagent",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_1_4",
            "label": "Concentrate dark flask on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "DCM / MeOH"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_1_5",
            "label": "Check porphyrin-azide Rf on TLC",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "tlc",
            "requiresJobFromPrev": false
          }
        ],
        "choice": {
          "prompt": "How do you handle the photosensitiser porphyrin-azide synthesis?",
          "options": [
            {
              "label": "Foil-wrapped flask, DIPEA in dry DMF, 20 °C",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Dark exclusion prevents singlet-O2 bleaching and azide loss."
            },
            {
              "label": "Clear flask under fume-hood light, DIPEA, 20 °C",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -7,
              "safetyMod": -2,
              "outcomeText": "Ambient hood light generates 1O2 and photo-oxidises linker."
            },
            {
              "label": "Foil-wrapped flask, neat Et3N at 65 °C",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -3,
              "outcomeText": "Heating degrades strained alkyne and darkens tar."
            },
            {
              "label": "Open aqueous buffer with CuSO4/ascorbate",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -16,
              "safetyMod": -5,
              "outcomeText": "Free Cu2+ metallates the porphyrin core prematurely."
            }
          ],
          "askChudsHint": "Dan: Wrap every porphyrin vessel in aluminium foil and keep free copper ions completely out of the synthesis.",
          "antoineHint": "Antoine: Foil-wrap the flask at ambient temperature with DIPEA so neither singlet oxygen nor Cu(II) spoils the macrocycle."
        },
        "dataOutput": {
          "type": "tlc",
          "label": "SiO2 TLC (10% MeOH/DCM): Foil-Protected Porphyrin-Azide",
          "productPeak": "Rf = 0.39 crimson-fluorescent spot (Soret 421 nm)",
          "metricLabel": "Rf = 0.39, zero demetallation or bleaching"
        }
      },
      {
        "index": 1,
        "id": "ant2_step_2",
        "dayHint": "Tue",
        "title": "Purify Crimson Porphyrin & Check NMR",
        "desc": "Isolate the crimson porphyrin-azide on Biotage and confirm meso-aryl and PEG-azide resonances by 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "biotage"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "biotage",
        "subTasks": [
          {
            "id": "ant2_2_1",
            "label": "Purify crimson band on Biotage",
            "roomId": "klb_2f",
            "stationTypes": [
              "biotage"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": "biotage",
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_2_2",
            "label": "Submit crimson porphyrin to NMR",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 26,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_2_3",
            "label": "Inspect porphyrin 1H NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you elute and resolve the cationic/polar porphyrin-azide?",
          "options": [
            {
              "label": "0-12% MeOH/DCM + 0.5% NH4OH; CDCl3/CD3OD",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Crisp crimson band elutes cleanly with sharp NH pyrrole peak."
            },
            {
              "label": "0-12% MeOH/DCM no modifier; wet DMSO-d6",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Polar porphyrin tails across fractions and lowers recovery."
            },
            {
              "label": "10-50% EtOAc/petrol; neat C6D6 NMR",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -9,
              "safetyMod": -1,
              "outcomeText": "Porphyrin stays pinned on baseline and aggregates in C6D6."
            },
            {
              "label": "MeOH/DCM + 2% TFA; D2O NMR",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Acid protonates porphyrin core into green dication."
            }
          ],
          "askChudsHint": "Calise: Neutral-to-mildly basic methanol/DCM keeps the free-base porphyrin crimson instead of protonating it green.",
          "antoineHint": "Antoine: A trace of NH4OH prevents streaking on silica while keeping the free-base macrocycle intact."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "Bruker 600 MHz 1H NMR (CDCl3/CD3OD): Porphyrin-PEG3-N3",
          "productPeak": "8.86 ppm (m, 8H, beta-pyrrole), -2.78 ppm (s, 2H, inner NH)",
          "metricLabel": "76% isolated yield, diagnostic -2.78 ppm NH"
        }
      },
      {
        "index": 2,
        "id": "ant2_step_3",
        "dayHint": "Wed",
        "title": "Rebridge Trastuzumab Fab at 4 °C",
        "desc": "Collect Trastuzumab Fab, reduce interchain disulfide with TCEP, infuse bis-alkyne PD slowly at 4 °C, spin-desalt, and verify PAR = 1.0 by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fridge_4c"
        ],
        "prepRequired": [],
        "durationMins": 23,
        "sweetSpotMins": 69,
        "minigame": "syringe_cryo",
        "subTasks": [
          {
            "id": "ant2_3_1",
            "label": "Collect Trastuzumab Fab from fridge",
            "roomId": "klb_2f",
            "stationTypes": [
              "fridge_4c"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_3_2",
            "label": "Reduce Fab disulfide with TCEP",
            "roomId": "klb_2f",
            "stationTypes": [
              "tcep_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 8,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_3_3",
            "label": "Pump bis-alkyne PD at 4 °C",
            "roomId": "klb_2f",
            "stationTypes": [
              "syringe_pump"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 23,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": "syringe_cryo",
            "minigameConfig": {
              "tempLabel": "4 °C Foil Ice Bath",
              "rateLabel": "5.0 µL/min Slow Add"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_3_4",
            "label": "Spin-desalt Fab-PD conjugate",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 13,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_3_5",
            "label": "Submit Fab-PD to LG11 Q-TOF MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 18,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_3_6",
            "label": "Verify Fab-PD mass on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you rebridge Fab cleanly with a bis-BCN pyridazinedione at 4 °C?",
          "options": [
            {
              "label": "5 eq bis-BCN-PD in DMSO (10% v/v), 4 °C, 16 h",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Quantitative PAR = 1.00 rebridging with zero Fab precipitation."
            },
            {
              "label": "5 eq bis-BCN-PD in 30% DMSO at 37 °C",
              "isOptimal": false,
              "yieldMod": 1,
              "purityMod": -6,
              "safetyMod": -1,
              "outcomeText": "Excess DMSO and warmth aggregate 15% of Trastuzumab Fab."
            },
            {
              "label": "1.0 eq bis-BCN-PD in 10% DMSO, 4 °C, 1 h",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -9,
              "safetyMod": 0,
              "outcomeText": "Incomplete conversion leaves unbridged heavy/light chains."
            },
            {
              "label": "20 eq bis-BCN-PD at pH 9.5 without TCEP",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -15,
              "safetyMod": -4,
              "outcomeText": "Intact disulfide cannot react; off-target Lys adducts form."
            }
          ],
          "askChudsHint": "Dan: Keep DMSO at or below 10% v/v and chill to 4 °C so strained bis-alkyne PD rebridges without aggregating Fab.",
          "antoineHint": "Antoine: Slow addition at 4 °C with 10% DMSO preserves Fab folding and delivers clean PAR = 1.0."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Agilent Q-TOF (MaxEnt1): Trastuzumab Fab-(BCN)2-PD",
          "productPeak": "48,540 Da observed (calc. 48,539 Da, dual-alkyne handle)",
          "metricLabel": "PAR = 1.00, 96% rebridged Fab-(BCN)2-PD"
        }
      },
      {
        "index": 3,
        "id": "ant2_step_4",
        "dayHint": "Thu",
        "title": "Click Multi-Porphyrin Loading onto Fab-PD",
        "desc": "Set up foil-wrapped SPAAC click in fumehood, incubate at controlled temperature, spin out free porphyrin, and verify dual-porphyrin loading by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fumehood"
        ],
        "prepRequired": [],
        "durationMins": 23,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "ant2_4_1",
            "label": "Degass dark click mix in fumehood",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 10,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_4_2",
            "label": "Run foil-wrapped SPAAC PDT click",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 23,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_4_3",
            "label": "Spin out excess porphyrin-azide",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 12,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_4_4",
            "label": "Run Fab-Porphyrin2 on Q-TOF MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 18,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_4_5",
            "label": "Confirm dual-porphyrin MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you click two porphyrin-azides onto Fab-(BCN)2-PD without aggregation?",
          "options": [
            {
              "label": "10 eq porphyrin-N3, 10% DMSO, foil, 25 °C",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Clean Cu-free SPAAC hits PAR = 2.0 porphyrins per Fab."
            },
            {
              "label": "10 eq porphyrin-N3, CuSO4/THPTA, 25 °C",
              "isOptimal": false,
              "yieldMod": 1,
              "purityMod": -6,
              "safetyMod": -2,
              "outcomeText": "Residual copper inserts into porphyrins and kills PDT."
            },
            {
              "label": "30 eq porphyrin-N3, 35% DMSO, 42 °C",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Hydrophobic porphyrin stacking crashes Fab out of solution."
            },
            {
              "label": "2 eq porphyrin-N3 under bench lamp, 25 °C",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -14,
              "safetyMod": -4,
              "outcomeText": "Photo-generated 1O2 oxidises Fab and leaves PAR = 1 mix."
            }
          ],
          "askChudsHint": "Joao: Copper-free SPAAC in foil avoids both porphyrin Cu(II) insertion and photo-oxidative damage to Trastuzumab Fab.",
          "antoineHint": "Antoine: Keep it Cu-free and dark at 25 °C with 10% DMSO to load both alkynes to PAR = 2.0 cleanly."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Agilent Q-TOF (MaxEnt1): Fab-PD-(Porphyrin)2 PDT Conjugate",
          "productPeak": "50,312 Da observed (PAR = 2.00 porphyrins/Fab)",
          "metricLabel": "PAR = 2.00, 93% homogeneous PDT Fab"
        }
      },
      {
        "index": 4,
        "id": "ant2_step_5",
        "dayHint": "Thu/Fri",
        "title": "Verify Dark Stability & PDT Purity by Gel",
        "desc": "Verify zero free porphyrin by TLC, load SDS-PAGE gel in foil-dimmed bay, and inspect crimson fluorescence & Coomassie purity.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "tlc_station"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "ant2_5_1",
            "label": "Check free-porphyrin clearance on TLC",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_5_2",
            "label": "Load & run dark PDT SDS-PAGE gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "Fab Ctrl",
                "Fab-PD",
                "Fab-Porph2"
              ],
              "gelMode": "dual_fluor"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ant2_5_3",
            "label": "Image red porphyrin gel fluorescence",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 8,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you image and confirm dark-stable Fab-Porphyrin2 on SDS-PAGE?",
          "options": [
            {
              "label": "Foil-shield tank; 650 nm fluor scan pre-stain",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Single fluorescent 50 kDa band with zero free porphyrin."
            },
            {
              "label": "Stain Coomassie first, then scan 650 nm fluor",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Coomassie dye and acetic acid quench porphyrin emission."
            },
            {
              "label": "Boil 100 °C + 50 mM DTT under bench lights",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -11,
              "safetyMod": -3,
              "outcomeText": "Light + hot DTT aggregates conjugate at stacking well."
            },
            {
              "label": "Run bare gel under UV box for 20 min",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -4,
              "outcomeText": "Prolonged UV bleaches crimson fluorescence completely."
            }
          ],
          "askChudsHint": "Max: Capture red porphyrin fluorescence before Coomassie staining, and keep the electrophoresis tank shielded from light.",
          "antoineHint": "Antoine: Always scan the unstained gel at 650 nm first while keeping the tank wrapped in foil."
        },
        "dataOutput": {
          "type": "gel",
          "label": "Dual-Channel SDS-PAGE (650 nm / Coomassie): Fab-PD-(Porphyrin)2",
          "productPeak": "Crisp 50 kDa fluorescent PDT band (zero dye-front bleed)",
          "metricLabel": "PAR = 2.00, 95% dark-stable PDT purity"
        }
      }
    ]
  },
  "andre_shamsabadi": {
    "charId": "andre_shamsabadi",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "Metal-Free Aerobic C(sp3)–H Amination & Ionic N–N Rupture to N-Acyl Carbamates",
    "manuscriptTopic": "Aerobic C(sp3)–H Amination & N–N Cleavage SI",
    "paperRef": "Shamsabadi, Maruani, Ahmed & Chudasama, Org. Biomol. Chem. 2020, 18, 6258 (DOI: 10.1039/d0ob01562h); RSC Adv. 2017, 7, 27608 (DOI: 10.1039/c7ra04178k)",
    "overview": "Run metal-free aerobic O2 C(sp3)–H amination of THF, infuse activated azodicarboxylate at 0 °C, isolate the alpha-amino-ether adduct on Biotage, cleave the acyl hydrazide N–N bond to N-acyl carbamate, and verify regiochemistry by 700 MHz NMR.",
    "steps": [
      {
        "index": 0,
        "id": "and2_step_1",
        "dayHint": "Mon",
        "title": "Run Aerobic O2 C(sp3)–H Amination of THF",
        "desc": "Draw dry THF and radical initiator, run metal-free aerobic O2 C(sp3)–H activation in fumehood, and verify conversion by TLC.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "and2_1_1",
            "label": "Draw anhydrous THF (Cupboard 1)",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 1 (Dry Solvents)",
            "mode": "action",
            "durationMins": 7,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_1_2",
            "label": "Weigh NHPI & aldehyde/THF substrates",
            "roomId": "klb_2f",
            "stationTypes": [
              "balance_table"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 7,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_1_3",
            "label": "Run aerobic O2 C(sp3)-H activation",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_1_4",
            "label": "Check alpha-oxy radical trap on TLC",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 8,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "tlc",
            "requiresJobFromPrev": false
          }
        ],
        "choice": {
          "prompt": "How do you initiate metal-free C(sp3)–H radical formation in THF cleanly?",
          "options": [
            {
              "label": "5 mol% NHPI under dry O2 balloon at 50 °C",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Mild aerobic PINO chain abstracts alpha-THF C-H cleanly."
            },
            {
              "label": "5 mol% NHPI under strict N2 glovebox, 50 °C",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -5,
              "safetyMod": 1,
              "outcomeText": "Zero O2 prevents PINO radical turnover and stalls reaction."
            },
            {
              "label": "30 mol% BHT + 1 eq Cu(OAc)2 under air, 80 °C",
              "isOptimal": false,
              "yieldMod": -9,
              "purityMod": -11,
              "safetyMod": -3,
              "outcomeText": "BHT scavenges radical chain and copper fails metal-free spec."
            },
            {
              "label": "Neat THF under O2 at 110 °C with 30% H2O2",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -16,
              "safetyMod": -8,
              "outcomeText": "Dangerous THF peroxide buildup risks exothermic decomposition."
            }
          ],
          "askChudsHint": "Marcos: Catalytic NHPI needs molecular oxygen to regenerate PINO without harsh peroxides or transition metals.",
          "antoineHint": "Antoine: Use 5 mol% NHPI with a controlled O2 balloon at 50 °C and avoid peroxide accumulation."
        },
        "dataOutput": {
          "type": "tlc",
          "label": "SiO2 TLC (40% EtOAc/Petrol): Aerobic THF C(sp3)–H Amination",
          "productPeak": "Rf = 0.34 KMnO4-active alpha-amino-ether spot",
          "metricLabel": "Rf = 0.34, 91% conversion, metal-free"
        }
      },
      {
        "index": 1,
        "id": "and2_step_2",
        "dayHint": "Tue",
        "title": "Infuse Activated Azodicarboxylate at 0 °C",
        "desc": "Blanket flask with argon, syringe-infuse DIAD/DEAD at 0 °C, evaporate solvent on Buchi, and monitor adduct formation by 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "argon_cyl"
        ],
        "prepRequired": [],
        "durationMins": 25,
        "sweetSpotMins": 69,
        "minigame": "syringe_cryo",
        "subTasks": [
          {
            "id": "and2_2_1",
            "label": "Flush reaction vessel with argon",
            "roomId": "klb_2f",
            "stationTypes": [
              "argon_cyl"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_2_2",
            "label": "Syringe-infuse DIAD at 0 °C",
            "roomId": "klb_2f",
            "stationTypes": [
              "syringe_pump"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 25,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": "syringe_cryo",
            "minigameConfig": {
              "tempLabel": "0 °C Ice-Water Bath",
              "rateLabel": "6.5 µL/min Dropwise"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_2_3",
            "label": "Strip excess THF on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "THF / Hexane"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_2_4",
            "label": "Run crude adduct 1H NMR",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 20,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_2_5",
            "label": "Inspect alpha-amino-ether NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Why meter the azodicarboxylate via syringe pump at 0 °C?",
          "options": [
            {
              "label": "1.1 eq DIAD dropwise over 2 h at 0 °C",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Low steady-state DIAD suppresses di-adduct and oligomer."
            },
            {
              "label": "1.1 eq DIAD in one shot at 25 °C",
              "isOptimal": false,
              "yieldMod": 1,
              "purityMod": -6,
              "safetyMod": -1,
              "outcomeText": "Exothermic addition forms bis-amination byproduct."
            },
            {
              "label": "3.0 eq DEAD dropwise at 60 °C",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -10,
              "safetyMod": -5,
              "outcomeText": "Excess warm DEAD degrades and creates hydrazide tar."
            },
            {
              "label": "1.1 eq DIAD at -78 °C without stirring",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -11,
              "safetyMod": -2,
              "outcomeText": "Freezing layers stall infusion then surge upon warming."
            }
          ],
          "askChudsHint": "Richard: Keep instantaneous azodicarboxylate concentration low at 0 °C so the radical trap stays strictly mono-selective.",
          "antoineHint": "Antoine: Slow syringe-pump delivery at 0 °C prevents exothermic runaway and bis-addition."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "Bruker 600 MHz 1H NMR (CDCl3): Crude alpha-Amino-Ether Adduct",
          "productPeak": "5.72 ppm (dd, 1H, O-CH-N), 4.94 ppm (sept, 2H, iPr-CH)",
          "metricLabel": "87% crude selectivity for mono-adduct"
        }
      },
      {
        "index": 2,
        "id": "and2_step_3",
        "dayHint": "Wed",
        "title": "Isolate alpha-Amino-Ether Adduct by Biotage",
        "desc": "Fetch column solvents from Cupboard 9, isolate the alpha-amino-ether adduct on Biotage, and verify purity by NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "biotage",
        "subTasks": [
          {
            "id": "and2_3_1",
            "label": "Get silica/eluent prep (Cupboard 9)",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 9",
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_3_2",
            "label": "Purify alpha-amino-ether on Biotage",
            "roomId": "klb_2f",
            "stationTypes": [
              "biotage"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": "biotage",
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_3_3",
            "label": "Submit pure adduct to NMR magnet",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 22,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_3_4",
            "label": "Check pure adduct 1H NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you chromatograph the labile N,O-acetal alpha-amino-ether?",
          "options": [
            {
              "label": "15-50% EtOAc/petrol + 0.5% Et3N on silica",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Buffered silica prevents N,O-acetal hydrolysis during run."
            },
            {
              "label": "15-50% EtOAc/petrol on untreated silica",
              "isOptimal": false,
              "yieldMod": 1,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Acidic silanols cleave ~18% of N,O-acetal to hydrazide."
            },
            {
              "label": "0-15% MeOH/DCM + 0.5% AcOH on silica",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -11,
              "safetyMod": -2,
              "outcomeText": "Acidic methanolysis destroys the THF C-N bond on column."
            },
            {
              "label": "C18 RP column with 0.1% TFA/H2O/MeCN",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "Aqueous TFA hydrolyses the aminal back to starting material."
            }
          ],
          "askChudsHint": "Antoine: Acidic silica loves to crack N,O-acetals; neutralise the column with a trace of triethylamine.",
          "antoineHint": "Antoine: Add 0.5% Et3N to the EtOAc/petrol gradient so the alpha-amino-ether elutes intact."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "Bruker 600 MHz 1H NMR (CDCl3): Pure THF alpha-Amino-Ether",
          "productPeak": "5.72 ppm (dd, 1H, O-CH-N), 1.24 ppm (d, 12H, 2x iPr)",
          "metricLabel": "82% isolated yield, >97% purity"
        }
      },
      {
        "index": 3,
        "id": "and2_step_4",
        "dayHint": "Thu",
        "title": "Cleave Acyl Hydrazide N–N Bond to Carbamate",
        "desc": "Collect ionic cleavage reagents from Cupboard 11, rupture the N–N bond to the N-acyl carbamate in fumehood, concentrate on Buchi, and verify by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 26,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "and2_4_1",
            "label": "Get cleavage base (Cupboard 11)",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 11",
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_4_2",
            "label": "Run ionic N-N bond rupture",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 26,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_4_3",
            "label": "Concentrate carbamate on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_4_4",
            "label": "Inject carbamate on LG11 LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 20,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_4_5",
            "label": "Confirm N-acyl carbamate MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which ionic condition ruptures the N–N bond selectively to N-acyl carbamate?",
          "options": [
            {
              "label": "Cs2CO3 (2.5 eq) in dry MeCN at 60 °C, 4 h",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Clean E1cb-like N-N cleavage yields pure N-acyl carbamate."
            },
            {
              "label": "K2CO3 (1.2 eq) in wet MeOH at 60 °C, 4 h",
              "isOptimal": false,
              "yieldMod": 1,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Competing transesterification cuts N-acyl carbamate yield."
            },
            {
              "label": "NaOH (5.0 eq) in EtOH/H2O at 85 °C, 12 h",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -11,
              "safetyMod": -3,
              "outcomeText": "Aqueous hydroxide saponifies carbamate to free amide."
            },
            {
              "label": "Raney Ni / H2 (10 bar) at 70 °C",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -14,
              "safetyMod": -5,
              "outcomeText": "Violates metal-free goal and reduces acyl carbonyl."
            }
          ],
          "askChudsHint": "Peter: A soluble anhydrous carbonate base in aprotic MeCN promotes clean ionic N-N elimination without saponification.",
          "antoineHint": "Antoine: Caesium carbonate in dry acetonitrile at 60 °C cleanly ruptures the N-N bond to the N-acyl carbamate."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Agilent LC-MS (ESI+): Cleaved N-Acyl Carbamate Product",
          "productPeak": "[M+Na]+ m/z 258.1 observed (hydrazide precursor consumed)",
          "metricLabel": "88% isolated carbamate conversion"
        }
      },
      {
        "index": 4,
        "id": "and2_step_5",
        "dayHint": "Thu/Fri",
        "title": "Verify Carbamate Regiochemistry by 700 MHz NMR",
        "desc": "Dry the purified N-acyl carbamate in the oven, acquire 700 MHz 1H/HMBC NMR, and confirm carbamate regiochemistry on TopSpin PC.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "drying_oven"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "and2_5_1",
            "label": "Dry carbamate & NMR tube in oven",
            "roomId": "klb_2f",
            "stationTypes": [
              "drying_oven"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 12,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_5_2",
            "label": "Run 700 MHz 1H/HMBC NMR in LG1b",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "and2_5_3",
            "label": "Confirm HMBC carbamate peak on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which 700 MHz NMR experiment proves N-acyl carbamate regiochemistry?",
          "options": [
            {
              "label": "CDCl3 at 298 K; 1H-13C HMBC + 15N check",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "HMBC links NH/CH to 153 ppm carbamate C=O cleanly."
            },
            {
              "label": "DMSO-d6 at 298 K; 1D 1H spectrum only",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "1D proton alone cannot distinguish rotamers from isomers."
            },
            {
              "label": "CD3OD with trace DCl; 1D 13C only",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Deuterium exchange erases diagnostic NH coupling."
            },
            {
              "label": "D2O suspension at 330 K",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "Insoluble sample yields broad baseline noise."
            }
          ],
          "askChudsHint": "Antoine: A 2D HMBC correlation from the alpha-CH or NH proton straight into the ~153 ppm carbamate carbonyl nails the structure.",
          "antoineHint": "Antoine: Dry the sample well, run in CDCl3 at 298 K, and verify the long-range HMBC cross-peak to 153 ppm."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "Bruker 700 MHz 1H/13C HMBC (CDCl3): N-Acyl Carbamate",
          "productPeak": "8.41 ppm (br s, 1H, NH) -> 153.4 ppm (carbamate C=O) HMBC",
          "metricLabel": "Single regioisomer, >98% NMR purity"
        }
      }
    ]
  },
  "peter_szijj": {
    "charId": "peter_szijj",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "Plug-and-Play Dual-Functionalised Bispecific Fab-Fab Conjugates",
    "manuscriptTopic": "Dual-Functionalised Bispecific Fab-Fab Conjugates",
    "paperRef": "Maruani, Szijj, Bahou, Nogueira, Baker & Chudasama, Bioconjugate Chem. 2020, 31, 520 (DOI: 10.1021/acs.bioconjchem.0c00002); RSC Adv. 2020, 10, 12839 (DOI: 10.1039/d0ra02934c)",
    "overview": "Synthesise orthogonal BCN- and azide-diBrPD hubs, rebridge anti-HER2/CD3 Fabs, and click 100 kDa bispecifics.",
    "steps": [
      {
        "index": 0,
        "id": "pet2_step_1",
        "dayHint": "Mon",
        "title": "Synthesise Orthogonal BCN- & Azide-diBrPD Hubs",
        "desc": "Couple diBrPD-NHS with BCN-amine and azido-PEG-amine, concentrate, purify on Biotage, and verify by 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 23,
        "sweetSpotMins": 69,
        "minigame": "biotage",
        "subTasks": [
          {
            "id": "pet2_1_1",
            "label": "Collect diBrPD-NHS, BCN & azide amines",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 6",
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_1_2",
            "label": "Couple orthogonal BCN/N3-diBrPD hubs",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 23,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_1_3",
            "label": "Concentrate crude PD hubs on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 11,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "DCM / MeOH"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_1_4",
            "label": "Purify orthogonal hubs on Biotage",
            "roomId": "klb_2f",
            "stationTypes": [
              "biotage"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 15,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "biotage",
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_1_5",
            "label": "Acquire 1H NMR of BCN- & N3-diBrPD",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 16,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_1_6",
            "label": "View hub NMR spectra on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you couple BCN- and N3-amines to diBrPD-NHS cleanly?",
          "options": [
            {
              "label": "1.05 eq amine in dry DMF, 0.1 eq DIPEA, 21 °C",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Clean amide formation with both bromines intact."
            },
            {
              "label": "1.05 eq amine + 3 eq Et3N at 50 °C for 4 h",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Excess base and heat hydrolyse ~15% NHS ester."
            },
            {
              "label": "2.2 eq amine in MeOH at reflux for 2 h",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Excess amine attacks ring bromines via SNAr."
            },
            {
              "label": "Coupling in wet DMSO with 10% aqueous PBS",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Water hydrolyses diBrPD-NHS before amide forms."
            }
          ],
          "askChudsHint": "Calise: Keep amine near 1.05 eq in anhydrous DMF with catalytic DIPEA so bromines never undergo SNAr substitution.",
          "antoineHint": "Antoine: Mild room-temperature amide coupling avoids displacing the two reactive bromines on the pyridazinedione ring."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "Bruker 600 MHz 1H NMR (CDCl3): Orthogonal BCN- & Azide-diBrPD",
          "productPeak": "3.68 (m, PEG-N3), 2.28 (m, BCN), 3.19 (s, 3H, NMe), zero NHS 2.84",
          "metricLabel": "88% BCN-diBrPD & 91% N3-diBrPD, 100% Br2"
        }
      },
      {
        "index": 1,
        "id": "pet2_step_2",
        "dayHint": "Tue",
        "title": "Digest Anti-HER2 & Anti-CD3 Fab Fragments",
        "desc": "Run sequential pepsin/papain digests on anti-HER2 and anti-CD3 IgGs, spin-desalt Fabs, and verify purity by SDS-PAGE.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fridge_4c"
        ],
        "prepRequired": [],
        "durationMins": 26,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "pet2_2_1",
            "label": "Collect anti-HER2 & anti-CD3 IgGs",
            "roomId": "klb_2f",
            "stationTypes": [
              "fridge_4c"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_2_2",
            "label": "Digest IgGs to FabHER2 and FabCD3",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 26,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_2_3",
            "label": "Spin-filter Fc and desalt Fabs",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_2_4",
            "label": "Run 12% SDS-PAGE of Fab panel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 16,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_2_5",
            "label": "View Fab digest gel bands",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you isolate both FabHER2 and FabCD3 cleanly?",
          "options": [
            {
              "label": "Pepsin then washed papain; 50 kDa spin cutoff",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Crisp 48 kDa Fabs with zero Fc fragment left."
            },
            {
              "label": "Single-step soluble papain + 10 mM Cys, 4 h",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Soluble cysteine over-reduces Fab interchain S-S."
            },
            {
              "label": "Use Protein A resin on Trastuzumab digest",
              "isOptimal": false,
              "yieldMod": -8,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "VH3 FabHER2 binds Protein A and drops yield."
            },
            {
              "label": "Digest both IgGs at pH 8.5 with trypsin, 37 °C",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "Trypsin shreds CDR loops and lowers antigen affinity."
            }
          ],
          "askChudsHint": "Dan: Remember Trastuzumab has a VH3 framework that binds Protein A; use sequential pepsin/washed-papain and size exclusion.",
          "antoineHint": "Antoine: Immobilised papain washed free of DTT prevents premature reduction of the Fab interchain disulfide."
        },
        "dataOutput": {
          "type": "gel",
          "label": "12% Non-Reducing SDS-PAGE: FabHER2 & FabCD3 Fragments",
          "productPeak": "Sharp 48.0 kDa FabHER2 and 47.6 kDa FabCD3 bands",
          "metricLabel": "93% Fab recovery, >96% monomer purity"
        }
      },
      {
        "index": 2,
        "id": "pet2_step_3",
        "dayHint": "Wed",
        "title": "Rebridge Orthogonal Fab-BCN & Fab-N3 Arms",
        "desc": "Reduce Fab interchain disulfides with TCEP, adjust borate buffer pH, rebridge with BCN-PD or N3-PD, and verify by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "tcep_bench"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "pet2_3_1",
            "label": "Reduce Fab interchain disulfides",
            "roomId": "klb_2f",
            "stationTypes": [
              "tcep_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_3_2",
            "label": "Set borate buffer to pH 8.0",
            "roomId": "klb_2f",
            "stationTypes": [
              "ph_probe"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_3_3",
            "label": "Rebridge & spin-desalt Fab arms",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_3_4",
            "label": "Acquire intact Fab-BCN/N3 LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 20,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_3_5",
            "label": "Inspect orthogonal Fab LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which PD-to-Fab ratio avoids unbridged or over-labelled Fab?",
          "options": [
            {
              "label": "10 eq TCEP, then 15 eq PD in pH 8.0 borate",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Quantitative single-PD bridging on both Fabs."
            },
            {
              "label": "10 eq TCEP, then 3 eq PD at pH 7.4 for 1 h",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Incomplete bridging leaves free thiols to scramble."
            },
            {
              "label": "30 eq TCEP without desalt, then 50 eq PD",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Excess TCEP quenches PD and causes off-target hits."
            },
            {
              "label": "Rebridge at pH 9.5 with 25% DMSO co-solvent",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "High pH and DMSO unfold Fab and hydrolyse PD."
            }
          ],
          "askChudsHint": "Rich: Borate pH 8.0 with EDTA keeps thiols nucleophilic while 15 eq diBrPD drives complete rebridging in <2 h.",
          "antoineHint": "Antoine: Quantitative single-PD installation is essential before SPAAC so neither arm carries unreacted free cysteines."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Waters Q-ToF Intact LC-MS: FabHER2-BCN & FabCD3-N3",
          "productPeak": "48,412 Da (FabHER2-BCN) and 48,095 Da (FabCD3-N3), 1.0 PD/Fab",
          "metricLabel": "97% rebridged, zero unmodified Fab"
        }
      },
      {
        "index": 3,
        "id": "pet2_step_4",
        "dayHint": "Thu",
        "title": "Assemble Dual-Clicked Fab-Fab Bispecific",
        "desc": "React FabHER2-BCN and FabCD3-N3 via SPAAC, remove monomeric Fab by SEC spin filtration, and check intact mass.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "heatblock"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "pet2_4_1",
            "label": "Click FabHER2-BCN + FabCD3-N3",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_4_2",
            "label": "SEC spin-isolate 100 kDa dimer",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 15,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_4_3",
            "label": "Run bispecific intact LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 20,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_4_4",
            "label": "View 100 kDa bispecific MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you maximise 1:1 Fab-Fab SPAAC conversion?",
          "options": [
            {
              "label": "1:1.2 Fab-BCN:Fab-N3 at 120 uM in PBS, 37 °C",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "High-concentration SPAAC hits >85% bispecific."
            },
            {
              "label": "1:1 mix at 10 uM in PBS at 4 °C overnight",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Dilute 4 °C SPAAC stalls around 35% dimer."
            },
            {
              "label": "Add 1 mM CuSO4/ascorbate to speed up click",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Cu(I) ROS oxidises protein Met/Trp residues."
            },
            {
              "label": "Click at 55 °C in 30% MeCN/PBS for 30 min",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -16,
              "safetyMod": -4,
              "outcomeText": "Thermal MeCN denatures both Fab arms irreversibly."
            }
          ],
          "askChudsHint": "Joao: Macromolecular SPAAC needs >100 uM Fab concentration at 37 °C in gentle PBS; copper catalysts aren't needed for BCN!",
          "antoineHint": "Antoine: Concentrated equimolar PBS incubation drives second-order BCN-azide clicking without solvent stress."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Intact Q-ToF MS: Dual-Clicked FabHER2-FabCD3 Bispecific",
          "productPeak": "96,507 Da heterodimeric Fab-Fab conjugate (22 kDa dual-functionalised)",
          "metricLabel": "87% SPAAC yield, 95% SEC dimer purity"
        }
      },
      {
        "index": 4,
        "id": "pet2_step_5",
        "dayHint": "Fri",
        "title": "Verify 100 kDa Bispecific Purity by Gel",
        "desc": "Load reducing and non-reducing lanes on SDS-PAGE to confirm covalent 100 kDa Fab-Fab assembly and zero free monomer.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "gel_tank"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "pet2_5_1",
            "label": "Load & run 10% Bis-Tris SDS-PAGE",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "FabHER2",
                "FabCD3",
                "Fab-Fab 100k"
              ],
              "gelMode": "hhll"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "pet2_5_2",
            "label": "Image Coomassie 100 kDa gel band",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 11,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which gel lane confirms covalent Fab-Fab bridging?",
          "options": [
            {
              "label": "Boiled + BME still shows intact 75 kDa HC-HC",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Thio-maleimide/PD bridge resists BME reduction."
            },
            {
              "label": "Only non-reducing lane shows ~100 kDa band",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Non-reducing alone misses disulfide scrambling."
            },
            {
              "label": "Sample boils in 50 mM DTT before loading",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Harsh DTT without non-reducing ref blurs bands."
            },
            {
              "label": "Skip SEC and run crude 1:1 reaction mix",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Unreacted 48 kDa monomers swamp densitometry."
            }
          ],
          "askChudsHint": "Faiza: Compare non-reducing and reducing lanes—the PD-rebridged heavy-chain dimer stays covalently linked even under BME!",
          "antoineHint": "Antoine: A thiol-resistant HC-HC/LC-LC covalent ladder proves true bispecific bridging rather than non-covalent pairing."
        },
        "dataOutput": {
          "type": "gel",
          "label": "10% Bis-Tris SDS-PAGE: 100 kDa FabHER2-FabCD3 Bispecific",
          "productPeak": "Single dominant ~97 kDa band (non-red) & covalent bridged bands (+BME)",
          "metricLabel": "96% bispecific purity, <4% residual Fab"
        }
      }
    ]
  },
  "joao_nogueira": {
    "charId": "joao_nogueira",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "Click-Enabled TIPS Porous Microparticles & Pancreatic Fab-PLGA Nanocarriers",
    "manuscriptTopic": "TIPS Porous Microparticles & Pancreatic Fab-PLGA Nanocarriers",
    "paperRef": "Nogueira, Day & Chudasama et al., Org. Biomol. Chem. 2020, 18, 2215 (DOI: 10.1039/d0ob00106f); Nanoscale 2020, 12, 19863 (DOI: 10.1039/d0nr02387f)",
    "overview": "Synthesise PLGA-PEG-N3, cryo-quench porous TIPS microparticles, and click pancreatic-targeting Fab-BCN.",
    "steps": [
      {
        "index": 0,
        "id": "joa2_step_1",
        "dayHint": "Mon",
        "title": "Synthesise Click-Ready PLGA-PEG-N3 Copolymer",
        "desc": "Activate PLGA-COOH with EDC/NHS, couple NH2-PEG-N3 in dry DCM, concentrate, and confirm end-group loading by 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 26,
        "sweetSpotMins": 69,
        "minigame": "buchi_bump",
        "subTasks": [
          {
            "id": "joa2_1_1",
            "label": "Collect anhydrous DCM & DMF",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 1 (Dry Solvents)",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_1_2",
            "label": "Weigh PLGA-COOH & NH2-PEG-N3",
            "roomId": "klb_2f",
            "stationTypes": [
              "balance_table"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_1_3",
            "label": "Run EDC/NHS PLGA-PEG-N3 coupling",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 26,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_1_4",
            "label": "Strip DCM & ether-wash on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 13,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "DCM / Et2O"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_1_5",
            "label": "Acquire 1H NMR of PLGA-PEG-N3",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 18,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_1_6",
            "label": "View copolymer NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you purify PLGA-PEG-N3 without hydrolysing ester backbones?",
          "options": [
            {
              "label": "Precipitate 3x in ice-cold MeOH/Et2O; vac dry",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Clean copolymer with intact MW and 92% azide."
            },
            {
              "label": "Precipitate once in room-temp hexane",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Residual free PEG-N3 and urea stay trapped."
            },
            {
              "label": "Wash DCM phase with 1 M NaOH(aq) brine",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Base hydrolyses PLGA lactide-glycolide chains."
            },
            {
              "label": "Dialyse in water at 40 °C for 48 hours",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "Warm water degrades ester linkages and broadens PDI."
            }
          ],
          "askChudsHint": "Andre: Ice-cold ether/methanol precipitation drops pure PLGA-PEG-N3 out while washing away unreacted PEG-amine and EDU.",
          "antoineHint": "Antoine: Never wash poly(lactide-co-glycolide) with aqueous base; anhydrous precipitation preserves molar mass."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "Bruker 600 MHz 1H NMR (CDCl3): PLGA-PEG3.4k-Azide Copolymer",
          "productPeak": "5.21 (m, LA CH), 4.82 (m, GA CH2), 3.64 (s, PEG), 3.39 (t, CH2-N3)",
          "metricLabel": "92% PEG-N3 conjugation, zero free urea"
        }
      },
      {
        "index": 1,
        "id": "joa2_step_2",
        "dayHint": "Tue",
        "title": "Extrude & Cryo-Quench TIPS Microparticles",
        "desc": "Pump PLGA-PEG-N3/dimethyl carbonate droplets into liquid-N2-chilled hexane for thermally induced phase separation, then freeze-store.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "syringe_pump"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": "syringe_cryo",
        "subTasks": [
          {
            "id": "joa2_2_1",
            "label": "Extrude DMC droplets into cryo bath",
            "roomId": "klb_2f",
            "stationTypes": [
              "syringe_pump"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": "syringe_cryo",
            "minigameConfig": {
              "tempLabel": "-78 °C Chilled Hexane",
              "rateLabel": "0.10 mL/min TIPS Drop"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_2_2",
            "label": "Freeze-quench TIPS pores at -20 °C",
            "roomId": "klb_2f",
            "stationTypes": [
              "freezer_20c"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 22,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_2_3",
            "label": "Check dye-doped TIPS batch on TLC",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "tlc",
            "requiresJobFromPrev": false
          }
        ],
        "choice": {
          "prompt": "What controls uniform ~200 um porous TIPS microparticles?",
          "options": [
            {
              "label": "10% w/v PLGA in DMC; -78 °C quench + freeze-dry",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Open interconnected pores with intact surface N3."
            },
            {
              "label": "10% w/v PLGA in DMC; quench in 0 °C water",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Slow cooling collapses skin pores into dense beads."
            },
            {
              "label": "25% w/v PLGA in DCM; evaporate at 25 °C",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "High viscosity clogs needle and seals off pores."
            },
            {
              "label": "Melt-quench dry PLGA pellets at 120 °C",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Thermal degradation destroys PEG-azide endgroups."
            }
          ],
          "askChudsHint": "Maximillian: Rapidly freezing DMC droplets below the solvent freezing point locks spinodal pores before lyophilisation.",
          "antoineHint": "Antoine: Dimethyl carbonate crystallises cleanly during cryo-quench, leaving a highly porous scaffold upon sublimation."
        },
        "dataOutput": {
          "type": "tlc",
          "label": "Fluorescence TLC / UV254 Check: Azide-TIPS Microparticle Batch",
          "productPeak": "Baseline polymer-bound fluorophore (Rf = 0.00), <1% free dye",
          "metricLabel": "210 um porous spheres, 96% N3 retention"
        }
      },
      {
        "index": 2,
        "id": "joa2_step_3",
        "dayHint": "Wed",
        "title": "Rebridge Pancreatic-Targeting Fab with BCN-PD",
        "desc": "Thaw pancreatic-targeting Fab, reduce with TCEP, rebridge with BCN-diBrPD, desalt, and confirm single modification by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fridge_4c"
        ],
        "prepRequired": [],
        "durationMins": 25,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "joa2_3_1",
            "label": "Collect pancreatic Fab from fridge",
            "roomId": "klb_2f",
            "stationTypes": [
              "fridge_4c"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_3_2",
            "label": "Reduce & rebridge Fab with BCN-PD",
            "roomId": "klb_2f",
            "stationTypes": [
              "tcep_bench"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 25,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_3_3",
            "label": "Spin-desalt excess BCN-PD linker",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 15,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_3_4",
            "label": "Run Fab-BCN intact LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 20,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_3_5",
            "label": "View Fab-BCN mass spectrum",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you preserve BCN alkyne strain during Fab rebridging?",
          "options": [
            {
              "label": "Pre-reduce 10 eq TCEP, desalt, add 15 eq BCN-PD",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Intact strained BCN on 97% of Fab molecules."
            },
            {
              "label": "Co-incubate 20 eq TCEP + 15 eq BCN-PD in situ",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Excess phosphine slowly reacts with strained BCN."
            },
            {
              "label": "Rebridge in pH 5.5 MES buffer at 37 °C",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Acidic thiols react slowly and leave free Cys."
            },
            {
              "label": "Use 50 eq BCN-PD in 30% DMF cosolvent",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "High DMF precipitates Fab during conjugation."
            }
          ],
          "askChudsHint": "Peter: Desalt or keep TCEP stoichiometrically matched before adding BCN-PD so phosphine doesn't degrade your strained alkyne.",
          "antoineHint": "Antoine: Clean 1:1 rebridging at pH 8.0 keeps the BCN ring strained and ready for particle surface SPAAC."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Waters Q-ToF Intact LC-MS: Pancreatic Fab-BCN Conjugate",
          "productPeak": "48,390 Da single BCN-PD adduct (47,895 Da native Fab consumed)",
          "metricLabel": "96% conversion, 1.0 BCN per Fab"
        }
      },
      {
        "index": 3,
        "id": "joa2_step_4",
        "dayHint": "Thu",
        "title": "Click Fab-BCN onto Porous TIPS/PLGA Carriers",
        "desc": "Incubate Fab-BCN with azide-functionalised TIPS microparticles and PLGA nanocarriers, wash unbound protein, and quantify supernatant depletion by gel.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "heatblock"
        ],
        "prepRequired": [],
        "durationMins": 26,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "joa2_4_1",
            "label": "SPAAC-click Fab-BCN onto TIPS/NPs",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 26,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_4_2",
            "label": "Pellet carriers & wash free Fab",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 15,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_4_3",
            "label": "Load wash supernatant on SDS-PAGE",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 19,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "Fab-BCN In",
                "Ctrl-NP Sup",
                "N3-TIPS Sup"
              ],
              "gelMode": "hhll"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_4_4",
            "label": "View Fab-TIPS depletion gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you prove covalent Fab attachment over physisorption?",
          "options": [
            {
              "label": "Compare N3-TIPS vs bare PLGA + 0.1% Tween wash",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Surfactant strips bare control; N3-TIPS retains Fab."
            },
            {
              "label": "Wash once with PBS and check A280 supernatant",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Gentle PBS leaves non-specific Fab adsorbed."
            },
            {
              "label": "Click at 60 °C for 2 h to force higher loading",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Above PLGA Tg (45 °C), pores fuse and collapse."
            },
            {
              "label": "Use 10% SDS in click buffer to stop adsorption",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "SDS denatures Fab paratope before clicking occurs."
            }
          ],
          "askChudsHint": "Dan: Always run a non-azide PLGA control washed with mild Tween-20; physisorbed Fab washes off while clicked Fab stays bound.",
          "antoineHint": "Antoine: Keep clicking below 37 °C—PLGA softens above 45 °C and will lose its porous TIPS architecture."
        },
        "dataOutput": {
          "type": "gel",
          "label": "12% SDS-PAGE Supernatant Depletion: Fab-BCN + Azide-TIPS",
          "productPeak": "84% Fab band depletion in N3-TIPS lane vs 94% retained in bare-PLGA wash",
          "metricLabel": "84% covalent Fab immobilisation"
        }
      },
      {
        "index": 4,
        "id": "joa2_step_5",
        "dayHint": "Fri",
        "title": "Verify Payload Encapsulation & Antigen Binding",
        "desc": "Plate trypsinised carrier digests and payload extracts in LG11, acquire MALDI-ToF MS, and confirm pancreatic antigen targeting.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "lab_bench"
        ],
        "prepRequired": [],
        "durationMins": 25,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "joa2_5_1",
            "label": "Spot carrier extract on MALDI plate",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lab_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 8,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_5_2",
            "label": "Run MALDI-ToF payload & Fab check",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "maldi_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 25,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "joa2_5_3",
            "label": "View MALDI spectrum on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which MALDI matrix resolves both intact Fab-PEG and drug payload?",
          "options": [
            {
              "label": "Sinapinic acid (Fab) + CHCA (payload) dual-spot",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Sharp ~51 kDa Fab-PEG and intact drug m/z peaks."
            },
            {
              "label": "CHCA matrix alone across 500–60,000 m/z",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "CHCA poorly ionises 50 kDa Fab-PEG conjugates."
            },
            {
              "label": "Dissolve carriers in 1 M HCl before spotting",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Strong acid hydrolyses payload and fragments Fab."
            },
            {
              "label": "Fire 95% laser power with zero matrix",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "Laser ablation chars sample with zero protein signal."
            }
          ],
          "askChudsHint": "Faiza: Use CHCA in reflectron mode for small-molecule payload and sinapinic acid in linear mode for the 51 kDa Fab-PEG conjugate.",
          "antoineHint": "Antoine: Dual-matrix spotting lets you verify payload integrity and surface Fab-PEG conjugation on one target plate."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "MALDI-ToF MS (Sinapinic/CHCA): Fab-PLGA Nanocarrier & Payload",
          "productPeak": "51.8 kDa Fab-BCN-PEG-N3 fragment & intact drug payload peak",
          "metricLabel": "78% encapsulation, 4.2x pancreatic binding"
        }
      }
    ]
  },
  "faiza_javaid": {
    "charId": "faiza_javaid",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "Humanised Anti-LRG1 Magacizumab Fab-LRG1 Complexation & Structural Stability",
    "manuscriptTopic": "Magacizumab Fab-LRG1 Complexation & Structural Stability",
    "paperRef": "Fernández, Javaid, Chudasama & Moss et al., Acta Crystallogr. D 2022, 78, 725 (DOI: 10.1107/s2059798322004132); bioRxiv 2020 (DOI: 10.1101/2020.07.25.218149)",
    "overview": "Digest humanised IgG4 Magacizumab to Fab, form the 1:1 Fab-LRG1 complex, and verify native stability.",
    "steps": [
      {
        "index": 0,
        "id": "fai2_step_1",
        "dayHint": "Mon",
        "title": "Digest Humanised IgG4 Magacizumab to Fab",
        "desc": "Collect humanised IgG4 Magacizumab, run papain cleavage, spin-separate Fc/undigested IgG, and verify Fab purity by gel.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fridge_4c"
        ],
        "prepRequired": [],
        "durationMins": 27,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "fai2_1_1",
            "label": "Collect IgG4 Magacizumab from fridge",
            "roomId": "klb_2f",
            "stationTypes": [
              "fridge_4c"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_1_2",
            "label": "Digest IgG4 Magacizumab with papain",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 27,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_1_3",
            "label": "Spin-isolate pure Magacizumab Fab",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 15,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_1_4",
            "label": "Load Magacizumab Fab SDS-PAGE",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 19,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "IgG4 Ctrl",
                "Digest Mix",
                "Pure Fab"
              ],
              "gelMode": "hhll"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_1_5",
            "label": "View Magacizumab Fab gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you stop IgG4 hinge half-antibody formation during Fab digest?",
          "options": [
            {
              "label": "Washed papain pH 7.0, 2 mM EDTA; Protein A flow",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Clean 47.4 kDa Fab with intact LC-HC disulfide."
            },
            {
              "label": "Papain + 10 mM soluble cysteine for 16 h",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Soluble thiol cleaves Fab interchain disulfide."
            },
            {
              "label": "Pepsin pH 2.5 at 37 °C without neutralisation",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Low pH precipitates IgG4 Fab before F(ab')2 forms."
            },
            {
              "label": "Boil IgG4 5 min first to expose hinge loop",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -16,
              "safetyMod": -4,
              "outcomeText": "Denatured IgG4 aggregates and loses LRG1 binding."
            }
          ],
          "askChudsHint": "Calise: IgG4 hinges swap easily in reductant—wash immobilised papain free of soluble Cys/DTT before digesting.",
          "antoineHint": "Antoine: Mild pH 7.0 washed papain followed by Protein A capture of Fc yields crystallisation-grade Magacizumab Fab."
        },
        "dataOutput": {
          "type": "gel",
          "label": "12% Non-Reducing SDS-PAGE: Magacizumab IgG4 -> Fab Digest",
          "productPeak": "Single 47.4 kDa Magacizumab Fab band (146 kDa IgG4 & Fc cleared)",
          "metricLabel": "89% Fab yield, >97% purity"
        }
      },
      {
        "index": 1,
        "id": "fai2_step_2",
        "dayHint": "Tue",
        "title": "Calibrate pH 7.4 Buffer & Desalt LRG1",
        "desc": "Calibrate low-salt HEPES pH 7.4 buffer, buffer-exchange recombinant human LRG1, and verify deglycosylated mass by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "ph_probe"
        ],
        "prepRequired": [],
        "durationMins": 25,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "fai2_2_1",
            "label": "Calibrate 20 mM HEPES to pH 7.4",
            "roomId": "klb_2f",
            "stationTypes": [
              "ph_probe"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 9,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_2_2",
            "label": "Buffer-exchange & desalt LRG1",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 25,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_2_3",
            "label": "Acquire LRG1 intact LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_2_4",
            "label": "Inspect LRG1 mass spectrum",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Why does LRG1 need careful buffer-exchange before complexation?",
          "options": [
            {
              "label": "6x spin into 20 mM HEPES pH 7.4, 150 mM NaCl",
              "isOptimal": true,
              "yieldMod": 9,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Monomeric LRG1 stays folded with sharp MS envelope."
            },
            {
              "label": "Desalt into pure Milli-Q water with zero salt",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Zero ionic strength induces LRG1 micro-aggregation."
            },
            {
              "label": "Buffer in 500 mM phosphate pH 6.0 at 4 °C",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Phosphate adducts suppress MS ionisation badly."
            },
            {
              "label": "Add 5 mM DTT to keep LRG1 disulfides reduced",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -16,
              "safetyMod": -4,
              "outcomeText": "Reducing LRG1 internal cysteines unfolds LRR fold."
            }
          ],
          "askChudsHint": "Marcos: LRG1 is a leucine-rich repeat glycoprotein—never add reductant, and keep physiological NaCl in HEPES pH 7.4.",
          "antoineHint": "Antoine: Clean 20 mM HEPES with 150 mM NaCl prevents non-specific aggregation while preserving LRG1 conformation."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Q-ToF Intact LC-MS: Recombinant Human LRG1 Glycoprotein",
          "productPeak": "38.2–41.6 kDa resolved LRG1 glycoform envelope (zero salt adducts)",
          "metricLabel": "Monomeric LRG1, >95% folding homogeneity"
        }
      },
      {
        "index": 2,
        "id": "fai2_step_3",
        "dayHint": "Wed",
        "title": "Form 1:1 Magacizumab Fab-LRG1 Complex",
        "desc": "Slow-titrate Magacizumab Fab into LRG1 on the chilled syringe pump, SEC spin-concentrate the 1:1 complex, and check LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "syringe_pump"
        ],
        "prepRequired": [],
        "durationMins": 27,
        "sweetSpotMins": 69,
        "minigame": "syringe_cryo",
        "subTasks": [
          {
            "id": "fai2_3_1",
            "label": "Slow-titrate Fab into chilled LRG1",
            "roomId": "klb_2f",
            "stationTypes": [
              "syringe_pump"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 27,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": "syringe_cryo",
            "minigameConfig": {
              "tempLabel": "4 °C Ice-Water Bath",
              "rateLabel": "5.0 µL/min Equimolar Add"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_3_2",
            "label": "SEC spin-isolate 1:1 Fab-LRG1",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 17,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_3_3",
            "label": "Run Fab-LRG1 complex LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 23,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_3_4",
            "label": "View Fab-LRG1 complex MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which stoichiometry gives crystallisation-grade 1:1 Fab-LRG1?",
          "options": [
            {
              "label": "1.15 eq Fab added slowly at 4 °C, then SEC",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Saturates LRG1; SEC cleanly strips excess Fab."
            },
            {
              "label": "Exact 1.00:1.00 mix by NanoDrop with no SEC",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Extinction error leaves ~12% free unbound monomer."
            },
            {
              "label": "3.0 eq LRG1 excess, skip size exclusion",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Free glycosylated LRG1 blocks crystal nucleation."
            },
            {
              "label": "Rapidly vortex Fab + LRG1 at 42 °C for 30 min",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "Shear foaming and heat precipitate protein complex."
            }
          ],
          "askChudsHint": "Peter: Use a slight molar excess of the smaller/cheaper Fab and polish on SEC so every LRG1 molecule is 100% complexed.",
          "antoineHint": "Antoine: Slow addition at 4 °C avoids local concentration spikes that trigger precipitation before SEC polishing."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Native-Adjacent LC-MS: 1:1 Magacizumab Fab-LRG1 Complex",
          "productPeak": "87.2 kDa 1:1 Fab-LRG1 peak plus resolved 47.4 kDa & 39.8 kDa subunits",
          "metricLabel": "1.0:1.0 complex stoichiometry, 95% SEC peak"
        }
      },
      {
        "index": 3,
        "id": "fai2_step_4",
        "dayHint": "Thu",
        "title": "Run Native-PAGE Shift & Thermal Stress Assay",
        "desc": "Incubate the Fab-LRG1 complex across a thermal ramp, load a Native-PAGE shift gel, and image complex retention.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "heatblock"
        ],
        "prepRequired": [],
        "durationMins": 29,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "fai2_4_1",
            "label": "Run thermal ramp stress on complex",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 29,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_4_2",
            "label": "Load Native-PAGE complex shift gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "LRG1 Only",
                "Fab Only",
                "Fab+LRG1"
              ],
              "gelMode": "native_shift"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_4_3",
            "label": "View Native-PAGE shift bands",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you run Native-PAGE without dissociating Fab-LRG1?",
          "options": [
            {
              "label": "Zero SDS/BME, 4 °C running buffer, 100 V",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Crisp upshifted complex band with zero free Fab."
            },
            {
              "label": "Zero SDS/BME, run at 200 V room temp 45 min",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Joule heating smears band and dissociates ~15%."
            },
            {
              "label": "Add 0.1% SDS to running buffer for sharp bands",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Even 0.1% SDS splits non-covalent Fab from LRG1."
            },
            {
              "label": "Boil complex 3 min in Laemmli buffer first",
              "isOptimal": false,
              "yieldMod": -14,
              "purityMod": -16,
              "safetyMod": -3,
              "outcomeText": "Heat + SDS completely destroys 1:1 complexation."
            }
          ],
          "askChudsHint": "Calise: Keep Native-PAGE tanks ice-cold at low voltage and completely free of SDS so non-covalent Fab-LRG1 stays intact.",
          "antoineHint": "Antoine: Gentle 100 V cold-buffer electrophoresis resolves the shifted Fab-LRG1 complex without Joule dissociation."
        },
        "dataOutput": {
          "type": "gel",
          "label": "8% Native-PAGE Shift Assay: Magacizumab Fab-LRG1 Complex",
          "productPeak": "Quantitative band shift at ~88 kDa; free Fab & free LRG1 absent",
          "metricLabel": "Tm = 68.4 °C, >95% complex retention"
        }
      },
      {
        "index": 4,
        "id": "fai2_step_5",
        "dayHint": "Fri",
        "title": "Verify Complex Stoichiometry & Serum Stability",
        "desc": "Acquire native-MS/MALDI spectra of the serum-incubated Magacizumab Fab-LRG1 complex in LG11 to confirm intact stability.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "maldi_unit"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "fai2_5_1",
            "label": "Run MALDI stoichiometry & serum MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "maldi_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "fai2_5_2",
            "label": "View serum stability MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you validate intact Fab-LRG1 stability after 72 h serum?",
          "options": [
            {
              "label": "NH4OAc desalt + gentle 10% laser linear MALDI",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "87.2 kDa 1:1 complex survives 72 h human serum."
            },
            {
              "label": "50% MeCN/0.1% TFA extraction before spotting",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Acidic MeCN splits complex into 47 & 40 kDa ions."
            },
            {
              "label": "Analyse raw 50% serum without pulldown/desalt",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "66 kDa serum albumin saturates detector signal."
            },
            {
              "label": "Digest serum mix with pepsin before mass spec",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Proteolysis destroys intact complex stoichiometry."
            }
          ],
          "askChudsHint": "Rich: Volatile ammonium acetate buffer and low-laser linear MALDI preserve high-mass non-covalent complexes cleanly.",
          "antoineHint": "Antoine: Never add TFA/acetonitrile when checking non-covalent Fab-LRG1 stoichiometry—keep it near-neutral."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "LG11 MALDI-ToF MS: 72 h Serum-Stable Magacizumab Fab-LRG1",
          "productPeak": "Intact 87.2 kDa [Fab+LRG1]+ complex ion (plus 2+ ion at 43.6 kDa)",
          "metricLabel": "94% intact complex after 72 h in serum"
        }
      }
    ]
  },
  "calise_bahou": {
    "charId": "calise_bahou",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "Disulfide-Modified IgG1 FcgR Profiling & Extracellular Cleavable Thio-PD Linkers",
    "manuscriptTopic": "IgG1 FcgR Profiling & Extracellular Cleavable Thio-PD Linkers",
    "paperRef": "Bahou, Spears, Baker & Chudasama et al., Bioconjugate Chem. 2019, 30, 1048 (DOI: 10.1021/acs.bioconjchem.9b00174); Chem. Commun. 2019, 55, 14829 (DOI: 10.1039/c9cc08362f)",
    "overview": "Synthesise aryl-thio-PD linkers, rebridge IgG1 at 4 °C, and profile FcRn/FcgRIIIa binding and thiol cleavage.",
    "steps": [
      {
        "index": 0,
        "id": "cal2_step_1",
        "dayHint": "Mon",
        "title": "Synthesise Aryl-Thio-PD Cleavable Scaffold",
        "desc": "Prep bleach bath before handling Cupboard 5 thiols, substitute diBrPD, concentrate on Buchi, purify on Biotage, and check 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "base_bath"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "biotage",
        "subTasks": [
          {
            "id": "cal2_1_1",
            "label": "Prep bleach bath before thiol use",
            "roomId": "klb_2f",
            "stationTypes": [
              "base_bath"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_1_2",
            "label": "Collect aryl thiols from Cupboard 5",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 5",
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_1_3",
            "label": "Collect diBrPD core from Cupboard 6",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 6",
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_1_4",
            "label": "Run aryl-thiol substitution in hood",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_1_5",
            "label": "Concentrate aryl-thio-PD on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 10,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "MeCN / EtOAc"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_1_6",
            "label": "Purify aryl-thio-PD on Biotage",
            "roomId": "klb_2f",
            "stationTypes": [
              "biotage"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "biotage",
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_1_7",
            "label": "Acquire 1H NMR of aryl-thio-PD",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_1_8",
            "label": "View aryl-thio-PD NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you tune aryl-thio-PD leaving ability safely?",
          "options": [
            {
              "label": "2.2 eq 4-F-thiophenol, NaOAc in MeOH; bleach",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 3,
              "outcomeText": "Clean bis-aryl-thio-PD; zero lab thiol odour."
            },
            {
              "label": "2.2 eq alkyl thiol, Et3N in MeCN; open bench",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": -3,
              "outcomeText": "Alkyl thioethers fail to cleave on antibody."
            },
            {
              "label": "1.0 eq thiophenol + NaOH at 65 °C for 3 h",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Monosubstituted PD mixture and ring hydrolysis."
            },
            {
              "label": "Skip bleach quench and tip glassware in sink",
              "isOptimal": false,
              "yieldMod": -10,
              "purityMod": -12,
              "safetyMod": -6,
              "outcomeText": "KLB 2F thiol alarm! Safety penalty applied."
            }
          ],
          "askChudsHint": "Marcos: Always set up your bleach bath before opening Cupboard 5, and use electron-poor aryl thiols for fast antibody rebridging.",
          "antoineHint": "Antoine: Bis(arylthio)-PD acts as a milder, tracelessly cleavable leaving group compared to dibromo-PD."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "Bruker 600 MHz 1H NMR (CDCl3): Bis(4-fluorophenylthio)-PD",
          "productPeak": "7.41 (dd, 4H, Ar-H), 6.96 (t, 4H, Ar-F), 3.16 (s, 3H, NMe)",
          "metricLabel": "89% isolated yield, 99% bis-arylthio purity"
        }
      },
      {
        "index": 1,
        "id": "cal2_step_2",
        "dayHint": "Tue",
        "title": "Rebridge IgG1 Trastuzumab at 4 °C",
        "desc": "Pre-chill IgG1 Trastuzumab at 4 °C, rebridge hinge disulfides with aryl-thio-PD and TCEP, desalt, and confirm HHLL mass by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fridge_4c"
        ],
        "prepRequired": [],
        "durationMins": 22,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "cal2_2_1",
            "label": "Pre-chill IgG1 Trastuzumab at 4 °C",
            "roomId": "klb_2f",
            "stationTypes": [
              "fridge_4c"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_2_2",
            "label": "Rebridge IgG1 with aryl-thio-PD",
            "roomId": "klb_2f",
            "stationTypes": [
              "tcep_bench"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 22,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_2_3",
            "label": "Desalt modified IgG1 by spin",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 12,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_2_4",
            "label": "Acquire rebridged IgG1 LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 16,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_2_5",
            "label": "Inspect modified IgG1 LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you suppress Fab-arm scrambling during IgG1 rebridging?",
          "options": [
            {
              "label": "Pre-mix 20 eq thio-PD at 4 °C, add 10 eq TCEP",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "95% intact HHLL IgG1 with 4 PD bridges installed."
            },
            {
              "label": "Reduce 10 eq TCEP 2 h at 37 °C, then add PD",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Sequential 37 °C gives ~40% HHL/HL half-IgG."
            },
            {
              "label": "Rebridge with 4 eq aryl-thio-PD at pH 6.0",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Too few equivalents leaves unbridged hinge Cys."
            },
            {
              "label": "Add 30 eq TCEP and 25% DMSO at 25 °C",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "Over-reduction scrambles chains and precipitates."
            }
          ],
          "askChudsHint": "Rich: In-situ rebridging at 4 °C with PD already present traps nascent hinge thiols before intra-hinge scrambling can happen.",
          "antoineHint": "Antoine: Pre-chilling to 4 °C slows hinge-loop isomerisation and locks in >95% full HHLL IgG1."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Waters Q-ToF Intact LC-MS: Disulfide-Modified IgG1-PD4",
          "productPeak": "149,180 Da HHLL Trastuzumab-(PD)4 glycoforms (zero half-antibody)",
          "metricLabel": "95% HHLL integrity, DAR/PD = 4.0"
        }
      },
      {
        "index": 2,
        "id": "cal2_step_3",
        "dayHint": "Wed",
        "title": "Assay pH 6.0 FcRn & FcgRIIIa Binding",
        "desc": "Calibrate pH 6.0 and pH 7.4 assay buffers, incubate IgG1-PD4 with FcRn and FcgRIIIa receptors, and resolve receptor complexes by Native-PAGE.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "ph_probe"
        ],
        "prepRequired": [],
        "durationMins": 22,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "cal2_3_1",
            "label": "Set FcRn pH 6.0 & FcgRIIIa pH 7.4",
            "roomId": "klb_2f",
            "stationTypes": [
              "ph_probe"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_3_2",
            "label": "Incubate IgG1-PD4 with Fc receptors",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 22,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_3_3",
            "label": "Load FcRn/FcgRIIIa shift gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 16,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "IgG1-PD4",
                "pH6+FcRn",
                "+FcgRIIIa"
              ],
              "gelMode": "native_shift"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_3_4",
            "label": "Image Fc receptor binding gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How does hinge PD-modification affect FcRn and FcgRIIIa binding?",
          "options": [
            {
              "label": "FcRn binds pH 6.0; FcgRIIIa shifts with HHLL",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "Intact HHLL hinge preserves pH-gated FcRn & FcgR."
            },
            {
              "label": "Assay FcRn only at pH 7.4 for both lanes",
              "isOptimal": false,
              "yieldMod": 2,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "FcRn releases IgG at pH 7.4, giving false negative."
            },
            {
              "label": "Strip N297 glycan with PNGase F pre-FcgRIIIa",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Aglycosylated Fc loses FcgRIIIa affinity."
            },
            {
              "label": "Use 50% HHL-scrambled conjugate for FcgRIIIa",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Open hinge geometry weakens FcgRIIIa engagement."
            }
          ],
          "askChudsHint": "Faiza: FcRn requires pH 6.0 protonation of Fc histidines, while FcgRIIIa depends critically on an intact, non-scrambled HHLL lower hinge.",
          "antoineHint": "Antoine: Preserving the N297 glycan and 95% HHLL conformation keeps native Fc effector and recycling profiles intact."
        },
        "dataOutput": {
          "type": "gel",
          "label": "Native-PAGE Shift: IgG1-PD4 Binding to FcRn (pH 6.0) & FcgRIIIa",
          "productPeak": "Complete FcRn shift at pH 6.0 (reversible at pH 7.4) & clean FcgRIIIa band",
          "metricLabel": "100% FcRn pH-gating, 94% FcgRIIIa retention"
        }
      },
      {
        "index": 3,
        "id": "cal2_step_4",
        "dayHint": "Thu",
        "title": "Stress-Test Thermal Aggregation at 45 °C",
        "desc": "Heat-stress disulfide-modified IgG1-PD4 vs native IgG1 at 45 °C, spin-clear any insoluble aggregates, and quantify soluble monomer by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "heatblock"
        ],
        "prepRequired": [],
        "durationMins": 26,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "cal2_4_1",
            "label": "Heat-stress IgG1-PD4 at 45 °C",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 26,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_4_2",
            "label": "Spin-clear aggregates post-stress",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 13,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_4_3",
            "label": "Run stressed IgG1-PD4 LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 17,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_4_4",
            "label": "View thermal stability MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which formulation keeps IgG1-PD4 monomeric during 45 °C stress?",
          "options": [
            {
              "label": "PBS pH 7.4 + 0.02% Tween-20; 15 min spin",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 11,
              "safetyMod": 2,
              "outcomeText": "96% soluble HHLL monomer with zero PD loss."
            },
            {
              "label": "PBS pH 7.4 without surfactant, 45 °C 72 h",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Minor interface adsorption drops recovery ~12%."
            },
            {
              "label": "Store at pH 4.0 acetate during 45 °C stress",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Acid + heat accelerates CH2 unfolding and clumps."
            },
            {
              "label": "Spike 5 mM DTT into 45 °C thermal stress tube",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "Reductant cleaves thio-PD bridges and aggregates."
            }
          ],
          "askChudsHint": "Joao: Trace Tween-20 stops hydrophobic vial-wall aggregation during accelerated 45 °C stability testing without perturbing LC-MS.",
          "antoineHint": "Antoine: Neutral PBS keeps bridged PD conjugates stable under thermal stress unless soluble reductants are present."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Q-ToF LC-MS: 45 °C Accelerated Thermal Stress IgG1-PD4",
          "productPeak": "149,180 Da intact HHLL IgG1-PD4 (zero hydrolysis or HHL fragmentation)",
          "metricLabel": "96% soluble monomer post-45 °C stress"
        }
      },
      {
        "index": 4,
        "id": "cal2_step_5",
        "dayHint": "Fri",
        "title": "Profile Extracellular Thiol-Cleavage Release",
        "desc": "Challenge the cleavable aryl-thio-PD conjugate with extracellular-mimicking 10–100 uM thiol vs 5 mM GSH, quench, and track release by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "lab_bench"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "cal2_5_1",
            "label": "Prepare thiol-cleavage timepoints",
            "roomId": "klb_2f",
            "stationTypes": [
              "lab_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_5_2",
            "label": "Incubate extracellular thiol release",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_5_3",
            "label": "Run thiol-cleavage kinetics LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 18,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "cal2_5_4",
            "label": "View cleavage kinetics MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you cleanly quench thiol-exchange timepoints for LC-MS?",
          "options": [
            {
              "label": "Quench with 20 eq maleimide/NEM before LC-MS",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Freezes exact kinetic ratio and stops post-quench."
            },
            {
              "label": "Dilute 1:10 into cold PBS and queue 3 h",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -6,
              "safetyMod": 0,
              "outcomeText": "Unquenched thiol keeps cleaving in autosampler."
            },
            {
              "label": "Add 10 mM TCEP to stop thiol exchange",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "TCEP reduces intact hinge disulfides immediately."
            },
            {
              "label": "Compare only 5 mM GSH with no 20 uM control",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Misses selective extracellular-thiol release window."
            }
          ],
          "askChudsHint": "Marcos: Cap free thiols with NEM/maleimide at each timepoint so the autosampler queue doesn't skew your release curve.",
          "antoineHint": "Antoine: Aryl-thio-PD bridges tune cleavage kinetics into the tumour-microenvironment thiol regime without premature plasma release."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "LC-MS Kinetics: Extracellular Thiol-Cleavable Aryl-Thio-PD Release",
          "productPeak": "Rapid payload/linker release at 100 uM thiol; <6% cleavage at 2 uM plasma",
          "metricLabel": "18-fold extracellular cleavage selectivity"
        }
      }
    ]
  },
  "richard_spears": {
    "charId": "richard_spears",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "Thiol-Labile PD Cysteine Protecting Group for SPPS & Stable Thiophosphonium Adducts",
    "manuscriptTopic": "Thiol-Labile PD Protecting Group for SPPS & Cys Thiophosphonium Adducts",
    "paperRef": "Spears, Chudasama et al., Chem. Commun. 2022, 58, 1796 (DOI: 10.1039/d1cc03802h); Chem. Commun. 2022, 58, 5359 (DOI: 10.1039/d2cc01090a)",
    "overview": "Synthesise Fmoc-Cys(PD)-OH for TFA-stable SPPS with thiol-labile deprotection, then forge hydrolytically stable C-terminal Cys thiophosphonium adducts.",
    "steps": [
      {
        "index": 0,
        "id": "ric2_step_1",
        "dayHint": "Mon",
        "title": "Prepare Fmoc-Cys(PD)-OH Building Block",
        "desc": "Prep bleach bath, protect Fmoc-Cys-OH with bromo-PD in the Chudasama hood, strip solvent on Buchi, purify on Biotage, and verify by 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "base_bath"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "biotage",
        "subTasks": [
          {
            "id": "ric2_1_1",
            "label": "Prep bleach bath in Chudasama hood",
            "roomId": "klb_2f",
            "stationTypes": [
              "base_bath"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_1_2",
            "label": "Get thiol-PD coupling precursors",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 5",
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_1_3",
            "label": "Get Fmoc-Cys-OH and mild base",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 6",
            "mode": "action",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_1_4",
            "label": "Run Fmoc-Cys(PD)-OH protection",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_1_5",
            "label": "Remove solvent on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 12,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "MeCN / EtOAc"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_1_6",
            "label": "Purify Fmoc-Cys(PD)-OH on Biotage",
            "roomId": "klb_2f",
            "stationTypes": [
              "biotage"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "biotage",
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_1_7",
            "label": "Submit building block to NMR",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_1_8",
            "label": "View 1H NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you install the PD group on Fmoc-Cys-OH?",
          "options": [
            {
              "label": "NaOAc buffer pH 5.5, 21 C; keep Fmoc intact",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Quantitative S-PD protection with Fmoc intact."
            },
            {
              "label": "Et3N in DMF at 21 C for 1 h, then acid wash",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Forms product, though trace Fmoc cleavage occurs."
            },
            {
              "label": "20% piperidine/DMF premix before adding PD",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Piperidine strips Fmoc and ruins SPPS block."
            },
            {
              "label": "Aqueous NaOH pH 11 at 50 C overnight",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -5,
              "outcomeText": "Harsh base hydrolyses PD ring and Fmoc carbamate."
            }
          ],
          "askChudsHint": "Marcos: Mildly acidic acetate keeps Fmoc completely untouched while Cys thiolate still attacks bromo-PD cleanly.",
          "antoineHint": "Antoine: Avoid organic amine bases around Fmoc-Cys-OH; buffered pH 5.5 delivers clean S-arylation in high yield."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "1H NMR (400 MHz, DMSO-d6): Fmoc-Cys(PD)-OH",
          "productPeak": "7.88-7.31 ppm (m, 8H, Fmoc Ar), 3.68 ppm (dd, 2H, Cys CH2-S-PD)",
          "metricLabel": "82% isolated yield, 99% Fmoc intact"
        }
      },
      {
        "index": 1,
        "id": "ric2_step_2",
        "dayHint": "Tue",
        "title": "Test TFA Acid Stability & Orthogonal Thiol Deprotection",
        "desc": "Challenge Fmoc-Cys(PD)-peptide with 95% TFA cleavage cocktail, then verify selective thiol-triggered PD removal by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 25,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "ric2_2_1",
            "label": "Get TFA cocktail and scavengers",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 11",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_2_2",
            "label": "Run TFA stability & thiol release",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 25,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_2_3",
            "label": "Quench & dilute LC-MS aliquots",
            "roomId": "klb_2f",
            "stationTypes": [
              "lab_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_2_4",
            "label": "Submit cleavage samples to LC-MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 17,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_2_5",
            "label": "View stability LC-MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which SPPS cleavage & release pair preserves Cys(PD)?",
          "options": [
            {
              "label": "95% TFA/TIS/H2O cleave; BME pH 7.5 release",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Zero loss in 95% TFA; BME unmasks free Cys SH."
            },
            {
              "label": "95% TFA/TIS/H2O cleave; 1 eq GSH pH 6.0",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "TFA stable, though weak GSH leaves partial PD."
            },
            {
              "label": "95% TFA with 5% EDT scavenger in cleavage",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Dithiol scavenger exchanges PD prematurely."
            },
            {
              "label": "20 mM NaOH pH 12 for 2 h to release PD",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -15,
              "safetyMod": -4,
              "outcomeText": "Base hydrolyses PD instead of unmasking Cys."
            }
          ],
          "askChudsHint": "Dan: Keep thiol scavengers like EDT out of the TFA resin cleavage cocktail, then add excess BME at neutral pH when you want Cys unmasked.",
          "antoineHint": "Antoine: TIS/H2O scavenges carbocations without touching the PD thioether, whereas thiol scavengers trigger premature deprotection."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "LC-MS: TFA Stability & Thiol-Labile PD Deprotection",
          "productPeak": "1,142.5 Da Cys(PD)-peptide (100% TFA stable) -> 934.4 Da free Cys-peptide",
          "metricLabel": "98% TFA stability, 95% BME thiol release"
        }
      },
      {
        "index": 2,
        "id": "ric2_step_3",
        "dayHint": "Wed",
        "title": "Form C-Terminal Cys Thiophosphonium Adduct",
        "desc": "React C-terminal cysteine peptide with phosphonium coupling reagent at controlled pH and verify adduct mass on LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "tcep_bench"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "ric2_3_1",
            "label": "Prep Cys peptide & phosphonium reagent",
            "roomId": "klb_2f",
            "stationTypes": [
              "tcep_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_3_2",
            "label": "Adjust reaction buffer to pH 7.4",
            "roomId": "klb_2f",
            "stationTypes": [
              "ph_probe"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_3_3",
            "label": "Heat C-terminal Cys thiophosphonium",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_3_4",
            "label": "Submit thiophosphonium to MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 17,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_3_5",
            "label": "View adduct MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you lock C-terminal Cys into a thiophosphonium?",
          "options": [
            {
              "label": "pH 7.4 PBS, 25 C; tris(aryl)phosphonium",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Clean C-terminal thiophosphonium with 96% conv."
            },
            {
              "label": "pH 6.2 MES, 25 C; tris(aryl)phosphonium",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Lower thiolate fraction leaves 22% unreacted Cys."
            },
            {
              "label": "pH 9.2 borate at 55 C with 20 eq reagent",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Alkaline heating promotes Lys off-target attack."
            },
            {
              "label": "Mix with excess DTT before phosphonium add",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -4,
              "outcomeText": "Residual DTT intercepts reagent before peptide."
            }
          ],
          "askChudsHint": "Calise: Tris(aryl)phosphonium salts trap the C-terminal Cys thiolate rapidly at pH 7.4 without competing Lys modification.",
          "antoineHint": "Antoine: Keep the buffer near neutral pH 7.4 and clear free thiol scavengers first so every equivalent targets C-terminal Cys."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "ESI-MS: C-Terminal Cys Thiophosphonium Peptide Adduct",
          "productPeak": "1,296.6 Da [M+PAr3]+ single-site thiophosphonium adduct",
          "metricLabel": "96% conversion, single C-terminal Cys site"
        }
      },
      {
        "index": 3,
        "id": "ric2_step_4",
        "dayHint": "Thu",
        "title": "Benchmark Hydrolytic Stability by 600 MHz NMR",
        "desc": "Age the thiophosphonium adduct in physiological D2O buffer at 37 C and quantify intact P-S bond retention by 600 MHz NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "lab_bench"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "ric2_4_1",
            "label": "Prep D2O buffer NMR stability tubes",
            "roomId": "klb_2f",
            "stationTypes": [
              "lab_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_4_2",
            "label": "Age adduct in pH 7.4 buffer at 37 C",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_4_3",
            "label": "Acquire 600 MHz 1H/31P NMR",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 20,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_4_4",
            "label": "View 600 MHz stability NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you quantify thiophosphonium stability by NMR?",
          "options": [
            {
              "label": "D2O pH 7.4 37 C, 7 d; 31P + internal std",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "94% intact at 31P +42.1 ppm over 7 days."
            },
            {
              "label": "D2O pH 7.4 21 C, 24 h without internal std",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Too brief at 21 C to prove true 37 C stability."
            },
            {
              "label": "Run in neat DMSO-d6 without water present",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -9,
              "safetyMod": -1,
              "outcomeText": "Dry DMSO hides hydrolytic P=O cleavage risk."
            },
            {
              "label": "Boil at 80 C in unbuffered H2O then freeze",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -4,
              "outcomeText": "Thermal shock hydrolyses to phosphine oxide."
            }
          ],
          "askChudsHint": "Faiza: Tracking the 31P singlet against an internal standard in pH 7.4 D2O at 37 C separates intact thiophosphonium from phosphine oxide cleanly.",
          "antoineHint": "Antoine: Include an inert phosphate reference capillary so 600 MHz NMR integrates exact intact fraction over 7 days."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "600 MHz 1H/31P NMR: 7-Day Hydrolytic Stability (pH 7.4, 37 C)",
          "productPeak": "31P +42.1 ppm intact thiophosphonium (94%) vs +29.4 ppm trace oxide (6%)",
          "metricLabel": "94% intact after 7 d at 37 C, pH 7.4"
        }
      },
      {
        "index": 4,
        "id": "ric2_step_5",
        "dayHint": "Fri",
        "title": "Verify Orthogonal Peptide Ligation by Gel",
        "desc": "Deprotect Cys(PD) with thiol after N-terminal ligation, couple a fluorescent payload, desalt by spin filter, and confirm by SDS-PAGE.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "tcep_bench"
        ],
        "prepRequired": [],
        "durationMins": 19,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "ric2_5_1",
            "label": "Prep dual-Cys protein & fluorophore",
            "roomId": "klb_2f",
            "stationTypes": [
              "tcep_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_5_2",
            "label": "Run orthogonal deprotection & ligation",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 19,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_5_3",
            "label": "Spin desalt ligated conjugate",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_5_4",
            "label": "Load orthogonal ligation SDS-PAGE",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "Cys(PD)Ctrl",
                "Unmasked",
                "Dual-Conj"
              ],
              "gelMode": "dual_fluor"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "ric2_5_5",
            "label": "View orthogonal ligation gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you achieve clean two-site orthogonal ligation?",
          "options": [
            {
              "label": "Ligate Cys1 first, desalt, then BME + payload2",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Crisp dual-labelled band with zero scrambled Cys."
            },
            {
              "label": "Add BME & payload2 together without desalting",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Residual BME competes with Cys2 for payload2."
            },
            {
              "label": "Unmask Cys(PD) first before site-1 ligation",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -1,
              "outcomeText": "Both thiols react at once, giving mixed isomer."
            },
            {
              "label": "Skip spin desalting and load crude reaction",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Free dye smears the entire gel baseline."
            }
          ],
          "askChudsHint": "Max: Spin out the BME completely before adding the second electrophilic payload, and keep the Cys(PD) mask on until site 1 is finished.",
          "antoineHint": "Antoine: Sequential site-1 ligation, thiol unmasking, spin-desalt, and site-2 capture gives homogeneous dual conjugates."
        },
        "dataOutput": {
          "type": "gel",
          "label": "Dual-Fluorescence SDS-PAGE: Orthogonal Cys(PD) Peptide Ligation",
          "productPeak": "Single fluorescent dual-conjugated band (zero mono-adduct bleed)",
          "metricLabel": "93% dual-site ligation, single regioisomer"
        }
      }
    ]
  },
  "marcos_fernandez": {
    "charId": "marcos_fernandez",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "Folate-Receptor Targeted Fluorophore & Pyridazinedione Imaging Conjugates",
    "manuscriptTopic": "Folate-PD-BODIPY Imaging Conjugates & FRa Receptor Targeting",
    "paperRef": "Fernández, Javaid & Chudasama, Chem. Sci. 2018, 9, 4690 (DOI: 10.1039/c7sc04004k); Chem. Commun. 2019, 55, 14829 (DOI: 10.1039/c9cc08362f)",
    "overview": "Activate folic acid regioselectively at the gamma-carboxyl, couple to a PD-fluorophore core, prove gamma-vs-alpha selectivity by 600 MHz NMR, and verify FRa targeting.",
    "steps": [
      {
        "index": 0,
        "id": "mar2_step_1",
        "dayHint": "Mon",
        "title": "Activate Folic Acid Regioselectively at gamma-Carboxyl",
        "desc": "Activate folic acid with NHS/DCC in anhydrous DMSO, concentrate gently on Buchi, and monitor regioselective esterification by TLC.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 27,
        "sweetSpotMins": 69,
        "minigame": "buchi_bump",
        "subTasks": [
          {
            "id": "mar2_1_1",
            "label": "Get NHS and DCC coupling reagents",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 11",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_1_2",
            "label": "Get anhydrous DMSO solvent",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 1 (Dry Solvents)",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_1_3",
            "label": "Run gamma-folate NHS activation",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 27,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_1_4",
            "label": "Strip co-solvent on Buchi",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 15,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "DMSO / Acetone"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_1_5",
            "label": "Check gamma-NHS-folate by TLC",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "tlc",
            "requiresJobFromPrev": false
          }
        ],
        "choice": {
          "prompt": "How do you favour gamma-NHS-folate over the alpha-ester?",
          "options": [
            {
              "label": "1.1 eq DCC/NHS in dry DMSO, 21 C dark, Et3N",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Sterically accessible gamma-acid activates 88:12."
            },
            {
              "label": "1.1 eq DCC/NHS in wet DMSO without base",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Slow activation with partial urea hydrolysis."
            },
            {
              "label": "3.0 eq DCC/NHS at 60 C in DMF for 12 h",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Bis-NHS folate forms and ruins FRa affinity."
            },
            {
              "label": "Dissolve folic acid in aqueous pH 4 MES + EDC",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Folic acid crashes immediately out of water."
            }
          ],
          "askChudsHint": "Faiza: Keep DCC/NHS near stoichiometric in dry DMSO in the dark so only the less hindered gamma-carboxyl activates.",
          "antoineHint": "Antoine: Excess carbodiimide or heat drives bis-activation; cool dry DMSO with 1.1 eq NHS protects the alpha-acid required for FRa."
        },
        "dataOutput": {
          "type": "tlc",
          "label": "Reverse-Phase TLC: gamma-NHS-Folate vs Folic Acid",
          "productPeak": "Yellow pteridine UV spot at Rf = 0.54 (gamma-NHS major, trace alpha)",
          "metricLabel": "88:12 gamma:alpha selectivity, 84% yield"
        }
      },
      {
        "index": 1,
        "id": "mar2_step_2",
        "dayHint": "Tue",
        "title": "Couple gamma-Folate Spacer to PD-Fluorophore Core",
        "desc": "Amidate gamma-NHS-folate with the amino-PEG PD core, purify on Biotage flash chromatography, and check 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 27,
        "sweetSpotMins": 69,
        "minigame": "biotage",
        "subTasks": [
          {
            "id": "mar2_2_1",
            "label": "Get amino-PEG spacer and DIPEA",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 6",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_2_2",
            "label": "Run gamma-folate PD core coupling",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 27,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_2_3",
            "label": "Purify folate-PD core on Biotage",
            "roomId": "klb_2f",
            "stationTypes": [
              "biotage"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 16,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "biotage",
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_2_4",
            "label": "Submit folate-PD core to NMR",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 16,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_2_5",
            "label": "View folate-PD NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you isolate clean gamma-folate-PD isomer?",
          "options": [
            {
              "label": "21 C dry DMSO + DIPEA; C18 reverse Biotage",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Clean separation of gamma-isomer from alpha trace."
            },
            {
              "label": "21 C dry DMSO + DIPEA; cold acetone precip.",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "High recovery, though 10% alpha isomer co-precip."
            },
            {
              "label": "Normal-phase silica column in pure EtOAc",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -9,
              "safetyMod": -1,
              "outcomeText": "Polar pteridine streaks permanently on silica."
            },
            {
              "label": "Couple with 5 eq pyrrolidine base at 50 C",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -15,
              "safetyMod": -4,
              "outcomeText": "Nucleophilic base displaces PD leaving groups."
            }
          ],
          "askChudsHint": "André: Polar folate conjugates stick hard to bare silica; C18 reverse-phase flash resolves gamma and alpha regioisomers cleanly.",
          "antoineHint": "Antoine: Use sterically hindered DIPEA and C18 Biotage elution so neither the PD core nor the pteridine ring degrades."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "1H NMR (400 MHz, DMSO-d6): gamma-Folate-PEG3-PD Core",
          "productPeak": "8.64 ppm (s, 1H, pteridine C7-H), 7.65/6.64 ppm (d, p-ABA), 3.52 ppm (m, PEG)",
          "metricLabel": "76% yield, >97% gamma-regioisomeric purity"
        }
      },
      {
        "index": 2,
        "id": "mar2_step_3",
        "dayHint": "Wed",
        "title": "Confirm gamma-vs-alpha Regiochemistry by 600 MHz NMR",
        "desc": "Weigh purified isomer into DMSO-d6 and run 600 MHz 2D HMBC/COSY correlation to prove amide attachment at the gamma-carbonyl.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "balance_table"
        ],
        "prepRequired": [],
        "durationMins": 32,
        "sweetSpotMins": 225,
        "minigame": null,
        "subTasks": [
          {
            "id": "mar2_3_1",
            "label": "Weigh purified folate-PD sample",
            "roomId": "klb_2f",
            "stationTypes": [
              "balance_table"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_3_2",
            "label": "Prepare dry DMSO-d6 2D NMR tube",
            "roomId": "klb_2f",
            "stationTypes": [
              "lab_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_3_3",
            "label": "Acquire 600 MHz HMBC/COSY NMR",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 32,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_3_4",
            "label": "View 600 MHz 2D NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which 600 MHz experiment proves gamma-carboxyl coupling?",
          "options": [
            {
              "label": "DMSO-d6 1H-13C HMBC + COSY on Glu CH2-gamma",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Sharp HMBC cross-peak links gamma-CH2 to amide C=O."
            },
            {
              "label": "1D 1H NMR in DMSO-d6 at 400 MHz only",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Shows clean spectrum, yet cannot prove gamma-site."
            },
            {
              "label": "Run in D2O + NaOD at pH 12 for 2D NMR",
              "isOptimal": false,
              "yieldMod": -6,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Exchanges NH protons and hydrolyses the PD ring."
            },
            {
              "label": "Dissolve in CDCl3 with heat to force solubility",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Insoluble suspension ruins magnet shims."
            }
          ],
          "askChudsHint": "Richard: In dry DMSO-d6 the Glu alpha-CH and gamma-CH2 stay resolved on 600 MHz HMBC, pinpointing which carbonyl carries the PEG amide.",
          "antoineHint": "Antoine: Keep the sample aprotic in DMSO-d6 and acquire HMBC so the amide NH and gamma-CH2 cross-peaks prove regioselectivity."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "600 MHz 2D HMBC/COSY (DMSO-d6): gamma-Folate Regiochemistry",
          "productPeak": "HMBC cross-peak 2.28 ppm (gamma-CH2) -> 171.8 ppm (amide C=O); free alpha-COOH 12.1 ppm",
          "metricLabel": "Unambiguous gamma-amide (>97:3 gamma:alpha)"
        }
      },
      {
        "index": 3,
        "id": "mar2_step_4",
        "dayHint": "Thu",
        "title": "Assemble Folate-PD-BODIPY Probe & Verify by MS",
        "desc": "Click the BODIPY fluorophore azide onto the strained BCN-PD folate scaffold, spin-wash precipitate, and verify intact conjugate mass by LC-MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fumehood"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "mar2_4_1",
            "label": "Click BODIPY-N3 onto Folate-PD-BCN",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_4_2",
            "label": "Spin & wash Folate-PD-BODIPY probe",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 15,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_4_3",
            "label": "Submit Folate-PD-BODIPY to MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 19,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_4_4",
            "label": "View probe LC-MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 4,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you click BODIPY-N3 onto Folate-PD-BCN cleanly?",
          "options": [
            {
              "label": "1.05 eq BODIPY-N3 SPAAC, 21 C dark, foil wrap",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Quantitative SPAAC with intact bright fluorophore."
            },
            {
              "label": "1.05 eq BODIPY-N3 SPAAC under bright bench lamp",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Click works, though light bleaches 18% BODIPY."
            },
            {
              "label": "Add 5 eq CuSO4 + ascorbate with BCN-PD",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Copper chelates pteridine and generates ROS."
            },
            {
              "label": "Heat SPAAC at 75 C in open air for 4 h",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -3,
              "outcomeText": "Thermal oxidation degrades BODIPY core."
            }
          ],
          "askChudsHint": "João: Strained BCN clicks cleanly with BODIPY-azide at room temperature without copper, and foil-wrapping protects the dye.",
          "antoineHint": "Antoine: Skip copper around folic acid since pteridines chelate Cu(I); gentle SPAAC in the dark gives spotless LC-MS."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "ESI-MS: Folate-PEG3-PD-BODIPY Dual-Targeted Probe",
          "productPeak": "1,488.6 Da [M+H]+ (single BODIPY-folate peak, zero free dye)",
          "metricLabel": "94% click yield, 98% HPLC-MS purity"
        }
      },
      {
        "index": 4,
        "id": "mar2_step_5",
        "dayHint": "Fri",
        "title": "Run FRa Binding & Excess-Folate Competition Assay",
        "desc": "Incubate recombinant Folate Receptor alpha with Folate-PD-BODIPY alongside excess free folic acid competition controls and image on gel.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "lab_bench"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "mar2_5_1",
            "label": "Prep FRa & excess-folate blocks",
            "roomId": "klb_2f",
            "stationTypes": [
              "lab_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 8,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_5_2",
            "label": "Incubate FRa binding & competition",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_5_3",
            "label": "Load FRa fluorescence native gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 18,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "FRa Ctrl",
                "FRa+Probe",
                "+100xFol"
              ],
              "gelMode": "dual_fluor"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "mar2_5_4",
            "label": "View FRa binding fluorescence gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which control proves specific FRa receptor targeting?",
          "options": [
            {
              "label": "Native gel; +100x free folic acid block lane",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Bright FRa band vanishes cleanly with +100x folate."
            },
            {
              "label": "Native gel; FRa + probe without folate block",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Shows binding, yet cannot rule out stickiness."
            },
            {
              "label": "Boil FRa samples in 2% SDS + DTT before gel",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -1,
              "outcomeText": "Denaturing SDS unfolds FRa pocket and drops dye."
            },
            {
              "label": "Pre-stain gel in Coomassie before fluorescence",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -2,
              "outcomeText": "Coomassie quenches BODIPY emission on scanner."
            }
          ],
          "askChudsHint": "Calise: Pre-blocking FRa with 100-fold excess free folic acid proves receptor specificity, and always scan native fluorescence before Coomassie.",
          "antoineHint": "Antoine: Keep the folate receptor folded in native buffer without SDS and include the excess-folate competition lane."
        },
        "dataOutput": {
          "type": "gel",
          "label": "In-Gel Fluorescence Native PAGE: FRa Binding & Folate Competition",
          "productPeak": "Strong BODIPY fluorescence at FRa (~38 kDa), >95% blocked by 100x free folate",
          "metricLabel": ">95% specific FRa block, Kd ~1.8 nM"
        }
      }
    ]
  },
  "archie_wall": {
    "charId": "archie_wall",
    "cascadeIndex": 1,
    "cascadeLabel": "Cascade 2",
    "title": "One-Pot Thiol-Amine Maleimide Dual Functionalisation & Ring-Open Lock",
    "manuscriptTopic": "One-Pot Thiol-Amine Monobromomaleimide Dual Functionalisation & Ring-Open Lock",
    "paperRef": "Wall, Wills, Chudasama & Baker et al., Chem. Sci. 2020, 11, 11455 (DOI: 10.1039/d0sc05128d)",
    "overview": "Synthesise a monobromomaleimide-alkyne scaffold, purify and confirm by NMR, desalt HSA Cys34 on a balanced rotor, run one-pot thiol-amine dual coupling with ring-open lock, and prove zero retro-Michael loss in 20 mM GSH.",
    "steps": [
      {
        "index": 0,
        "id": "arc2_step_1",
        "dayHint": "Mon",
        "title": "Synthesise Monobromomaleimide-Alkyne Scaffold",
        "desc": "React monobromomaleic anhydride with propargylamine in dry solvent, strip volatiles on Buchi, and verify conversion by UV TLC.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 26,
        "sweetSpotMins": 69,
        "minigame": "buchi_bump",
        "subTasks": [
          {
            "id": "arc2_1_1",
            "label": "Get Baker monobromomaleimide kit",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 17",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_1_2",
            "label": "Get dry THF and acetic acid",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 1 (Dry Solvents)",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_1_3",
            "label": "Condense monobromomaleimide-alkyne",
            "roomId": "klb_2f",
            "stationTypes": [
              "fumehood"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 26,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_1_4",
            "label": "Strip AcOH toluene azeotrope",
            "roomId": "klb_2f",
            "stationTypes": [
              "buchi"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 14,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "buchi_bump",
            "minigameConfig": {
              "solvent": "AcOH / Toluene"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_1_5",
            "label": "Check monobromomaleimide by TLC",
            "roomId": "klb_2f",
            "stationTypes": [
              "tlc_station"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "tlc",
            "requiresJobFromPrev": false
          }
        ],
        "choice": {
          "prompt": "How do you form N-alkyne monobromomaleimide cleanly?",
          "options": [
            {
              "label": "AcOH cyclisation 100 C, then toluene dry strip",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Clean N-propargyl monobromomaleimide formed."
            },
            {
              "label": "AcOH cyclisation 100 C, single quick rotary",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Trace AcOH lingers in crude oil before column."
            },
            {
              "label": "Add 3 eq Et3N to bromomaleamic acid at 60 C",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Triethylamine substitutes bromide on maleimide."
            },
            {
              "label": "Heat neat with excess propargylamine at 140 C",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -5,
              "outcomeText": "Amine attacks C=C bond and tars the reaction."
            }
          ],
          "askChudsHint": "Nafsika: Glacial acetic acid drives ring closure without base, preserving the single vinyl bromide on the monobromomaleimide.",
          "antoineHint": "Antoine: Never add tertiary amines during cyclisation; they attack the monobromomaleimide ring prematurely."
        },
        "dataOutput": {
          "type": "tlc",
          "label": "SIL G/UV254 TLC: N-Propargyl Monobromomaleimide",
          "productPeak": "Crisp UV-active spot at Rf = 0.48 (zero baseline maleamic acid)",
          "metricLabel": "83% crude yield, single UV spot"
        }
      },
      {
        "index": 1,
        "id": "arc2_step_2",
        "dayHint": "Tue",
        "title": "Purify Monobromomaleimide & Confirm by NMR",
        "desc": "Isolate the N-alkyne monobromomaleimide scaffold on Biotage using aprotic eluents and verify the vinyl singlet by 1H NMR.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "chem_cupboard"
        ],
        "prepRequired": [],
        "durationMins": 21,
        "sweetSpotMins": 225,
        "minigame": "biotage",
        "subTasks": [
          {
            "id": "arc2_2_1",
            "label": "Get EtOAc/petrol column solvents",
            "roomId": "klb_2f",
            "stationTypes": [
              "chem_cupboard"
            ],
            "cupboardHint": "Cupboard 9",
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_2_2",
            "label": "Purify monobromomaleimide on Biotage",
            "roomId": "klb_2f",
            "stationTypes": [
              "biotage"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 21,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": true,
            "minigame": "biotage",
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_2_3",
            "label": "Submit monobromomaleimide to NMR",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "nmr_magnet"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 21,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_2_4",
            "label": "View monobromomaleimide NMR on PC",
            "roomId": "cib_lg1b_nmr",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "nmr",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "Which Biotage eluent isolates monobromomaleimide intact?",
          "options": [
            {
              "label": "0-25% EtOAc in petrol, aprotic, store -20 C",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Crystalline solid with sharp 6.89 ppm CH=CBr."
            },
            {
              "label": "0-25% EtOAc in petrol; leave wet at 21 C",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Clean column, though moisture slowly hydrolyses."
            },
            {
              "label": "CH2Cl2 / MeOH + 1% Et3N modifier on silica",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -9,
              "safetyMod": -2,
              "outcomeText": "Amine modifier and MeOH hydrolyse the ring."
            },
            {
              "label": "Reverse-phase MeCN/H2O + 0.1% NH4OH buffer",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -15,
              "safetyMod": -3,
              "outcomeText": "Ammonia opens the monobromomaleimide ring."
            }
          ],
          "askChudsHint": "Jamie: Monobromomaleimides hate nucleophilic modifiers on silica; stick to dry EtOAc/petrol and check the 1H vinyl singlet at ~6.89 ppm.",
          "antoineHint": "Antoine: Keep the flash gradient strictly aprotic without triethylamine or methanol so the monobromomaleimide stays crisp."
        },
        "dataOutput": {
          "type": "nmr",
          "label": "1H NMR (400 MHz, CDCl3): N-Propargyl Monobromomaleimide",
          "productPeak": "6.89 ppm (s, 1H, C=CH-Br), 4.33 ppm (d, 2H, N-CH2), 2.24 ppm (t, 1H, alkyne)",
          "metricLabel": "78% isolated yield, >98% NMR purity"
        }
      },
      {
        "index": 2,
        "id": "arc2_step_3",
        "dayHint": "Wed",
        "title": "Desalt HSA Cys34 on Balanced Rotor",
        "desc": "Reduce HSA Cys34 mixed disulfide gently, desalt on a mass-balanced centrifuge rotor, set PBS pH 7.4, and confirm monomeric HSA by SDS-PAGE.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "fridge_4c"
        ],
        "prepRequired": [],
        "durationMins": 24,
        "sweetSpotMins": 69,
        "minigame": "gel_load",
        "subTasks": [
          {
            "id": "arc2_3_1",
            "label": "Retrieve HSA Cys34 stock from fridge",
            "roomId": "klb_2f",
            "stationTypes": [
              "fridge_4c"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_3_2",
            "label": "Desalt HSA on balanced VivaSpin rotor",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 24,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_3_3",
            "label": "Calibrate PBS conjugation pH 7.4",
            "roomId": "klb_2f",
            "stationTypes": [
              "ph_probe"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_3_4",
            "label": "Load HSA Cys34 SDS-PAGE gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 16,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": "gel_load",
            "minigameConfig": {
              "laneLabels": [
                "Ladder",
                "HSA Ctrl",
                "Cys34 Act",
                "Desalted"
              ],
              "gelMode": "hsa_monomer"
            },
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_3_5",
            "label": "View HSA Cys34 gel",
            "roomId": "klb_2f",
            "stationTypes": [
              "gel_tank"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "gel",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you prep HSA Cys34 cleanly on the centrifuge?",
          "options": [
            {
              "label": "1 eq TCEP pH 7.0; 0.01 g paired 30 kDa spin",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "0.95 free SH/HSA with silent rotor balance."
            },
            {
              "label": "1 eq TCEP pH 7.0; eye-balanced spin tubes",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": -2,
              "outcomeText": "Cys34 reduced, though rotor vibrates on spin."
            },
            {
              "label": "15 eq DTT pH 8.5 at 37 C for 2 h then spin",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Excess DTT reduces internal HSA disulfides."
            },
            {
              "label": "Use 100 kDa MWCO filter at 14,000 g spin",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -14,
              "safetyMod": -4,
              "outcomeText": "66.5 kDa HSA washes straight into filtrate."
            }
          ],
          "askChudsHint": "Nafsika: Balance paired 30 kDa VivaSpin columns within 0.01 g on the balance and stick to 1 eq TCEP so HSA's 17 core disulfides stay untouched.",
          "antoineHint": "Antoine: A 30 kDa cutoff retains 66.5 kDa albumin cleanly while stripping residual TCEP-cysteine mixed disulfide."
        },
        "dataOutput": {
          "type": "gel",
          "label": "12% Non-Reducing SDS-PAGE: Desalted HSA Cys34 (66.5 kDa)",
          "productPeak": "Crisp 66.5 kDa monomer band (zero disulfide dimer, 0.95 SH/protein)",
          "metricLabel": "93% HSA recovery, 0.95 free Cys34/protein"
        }
      },
      {
        "index": 3,
        "id": "arc2_step_4",
        "dayHint": "Thu",
        "title": "Run One-Pot Thiol-Amine Dual Coupling & Ring-Open Lock",
        "desc": "React HSA Cys34 with monobromomaleimide-alkyne, add an amine payload in one pot for thiol-amine addition-elimination, hydrolyse to lock the ring, and confirm by MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "tcep_bench"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "arc2_4_1",
            "label": "Set up one-pot thiol-amine coupling",
            "roomId": "klb_2f",
            "stationTypes": [
              "tcep_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_4_2",
            "label": "Incubate dual coupling & ring-open lock",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_4_3",
            "label": "Spin desalt dual HSA conjugate",
            "roomId": "klb_2f",
            "stationTypes": [
              "centrifuge"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 16,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_4_4",
            "label": "Submit dual conjugate to Mass Spec",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 20,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_4_5",
            "label": "View dual conjugate MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you run one-pot thiol-amine coupling & lock?",
          "options": [
            {
              "label": "Cys34+MBM pH 7.4, amine RNH2, pH 8.5 open",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "Clean dual-functionalised HSA with +18 Da lock."
            },
            {
              "label": "Cys34+MBM pH 7.4, amine RNH2, keep pH 7.0",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Dual conjugate forms, yet ring stays 65% closed."
            },
            {
              "label": "Mix amine RNH2 with MBM first, then add HSA",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -10,
              "safetyMod": -2,
              "outcomeText": "Aminomaleimide forms slowly and blocks Cys34."
            },
            {
              "label": "Use 20 eq MBM in pH 10.5 carbonate at 45 C",
              "isOptimal": false,
              "yieldMod": -13,
              "purityMod": -15,
              "safetyMod": -4,
              "outcomeText": "Non-selective Lys labelling and ring cleavage."
            }
          ],
          "askChudsHint": "Jamie: Couple HSA Cys34 to the monobromomaleimide first, then introduce the amine nucleophile in one pot before raising pH to lock the ring open.",
          "antoineHint": "Antoine: Sequential thiol addition-elimination at pH 7.4, one-pot amine capture, and gentle pH 8.5 hydrolysis gives homogeneous dual-loaded HSA."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Q-TOF MaxEnt1 MS: Ring-Opened Thiol-Amine HSA Conjugate",
          "productPeak": "67,042 Da dual thiol-amine maleamic acid conjugate (+18 Da ring-open lock)",
          "metricLabel": "95% dual-functionalised HSA, +18 Da locked"
        }
      },
      {
        "index": 4,
        "id": "arc2_step_5",
        "dayHint": "Fri",
        "title": "Audit 20 mM GSH Stability & Zero Retro-Michael",
        "desc": "Challenge the ring-opened thiol-amine HSA conjugate with 20 mM GSH at 37 C and prove zero retro-Michael thiol exchange by MS.",
        "locationRoom": "klb_2f",
        "stationTypes": [
          "lab_bench"
        ],
        "prepRequired": [],
        "durationMins": 28,
        "sweetSpotMins": 69,
        "minigame": null,
        "subTasks": [
          {
            "id": "arc2_5_1",
            "label": "Spike dual HSA conjugate with 20 mM GSH",
            "roomId": "klb_2f",
            "stationTypes": [
              "lab_bench"
            ],
            "cupboardHint": null,
            "mode": "action",
            "durationMins": 6,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_5_2",
            "label": "Incubate 37 C 20 mM GSH challenge",
            "roomId": "klb_2f",
            "stationTypes": [
              "heatblock"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 28,
            "sweetSpotMins": 69,
            "canOvercook": true,
            "triggersChoice": true,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_5_3",
            "label": "Submit 20 mM GSH stability audit to MS",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "lcms_unit"
            ],
            "cupboardHint": null,
            "mode": "wait",
            "durationMins": 22,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": null,
            "requiresJobFromPrev": false
          },
          {
            "id": "arc2_5_4",
            "label": "View GSH stability MS on PC",
            "roomId": "cib_lg11_ms",
            "stationTypes": [
              "pc_terminal"
            ],
            "cupboardHint": null,
            "mode": "collect",
            "durationMins": 5,
            "sweetSpotMins": 225,
            "canOvercook": false,
            "triggersChoice": false,
            "minigame": null,
            "viewOutput": "lcms",
            "requiresJobFromPrev": true
          }
        ],
        "choice": {
          "prompt": "How do you prove zero retro-Michael thiol exchange?",
          "options": [
            {
              "label": "37 C + 20 mM GSH 7 d vs closed ctrl, LC-MS",
              "isOptimal": true,
              "yieldMod": 10,
              "purityMod": 12,
              "safetyMod": 2,
              "outcomeText": "98% locked conjugate intact vs closed thiol loss."
            },
            {
              "label": "37 C + 20 mM GSH 7 d; omit closed control",
              "isOptimal": false,
              "yieldMod": 3,
              "purityMod": -5,
              "safetyMod": 0,
              "outcomeText": "Shows 98% survival without unhydrolysed baseline."
            },
            {
              "label": "Test at 4 C with 10 uM GSH for 2 h only",
              "isOptimal": false,
              "yieldMod": -7,
              "purityMod": -9,
              "safetyMod": -1,
              "outcomeText": "Mild cold check misses retro-Michael kinetics."
            },
            {
              "label": "Add 50 mM BME at pH 10 and boil 10 min",
              "isOptimal": false,
              "yieldMod": -12,
              "purityMod": -14,
              "safetyMod": -4,
              "outcomeText": "Boiling denatures albumin and scrambles bridges."
            }
          ],
          "askChudsHint": "Faiza: Run the closed ring intermediate side by side with the hydrolysed maleamic acid lock in 20 mM GSH at 37 C to prove retro-Michael arrest.",
          "antoineHint": "Antoine: A 7-day 20 mM GSH challenge at 37 C against an unhydrolysed control makes the ring-open stability difference undeniable by Q-TOF MS."
        },
        "dataOutput": {
          "type": "lcms",
          "label": "Q-TOF MS: 7-Day 20 mM GSH Retro-Michael Stability Audit",
          "productPeak": "67,042 Da ring-opened conjugate (98% intact vs 38% closed loss in 20 mM GSH)",
          "metricLabel": "98% stability in 20 mM GSH, zero retro-Michael"
        }
      }
    ]
  }
};

window.KLB.getActiveCascadeIndex = function(state, charId) {
  if (!state) return 0;
  const weekNum = Math.max(1, Number(state.weekNum) || 1);
  if (!state.spectatorMode && charId && charId === state.player?.id) {
    const startIdx = state.startCascadeIdx === 1 ? 1 : 0;
    return (startIdx + (weekNum - 1)) % 2;
  }
  const labStartIdx = state.spectatorMode && state.labStartCascadeIdx === 1 ? 1 : 0;
  return (labStartIdx + (weekNum - 1)) % 2;
};

window.KLB.getCampaign = function(charId, selector) {
  const c1 = window.KLB.CAMPAIGNS?.[charId] || null;
  const c2 = window.KLB.CAMPAIGNS_V2?.[charId] || null;
  if (selector === undefined || selector === null) return c1;
  if (typeof selector === 'number') {
    const idx = ((Math.floor(selector) % 2) + 2) % 2;
    return idx === 1 ? (c2 || c1) : c1;
  }
  if (typeof selector === 'object') {
    const idx = window.KLB.getActiveCascadeIndex(selector, charId);
    return idx === 1 ? (c2 || c1) : c1;
  }
  return c1;
};

window.KLB.getAllCampaigns = function(charId) {
  const out = [];
  if (window.KLB.CAMPAIGNS?.[charId]) out.push(window.KLB.CAMPAIGNS[charId]);
  if (window.KLB.CAMPAIGNS_V2?.[charId]) out.push(window.KLB.CAMPAIGNS_V2[charId]);
  return out;
};

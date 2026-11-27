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
        minigame: 'gel_load',
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
            minigame: 'gel_load',
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
            id: 'dan_2_5',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
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
            id: 'dan_2_6',
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
              outcomeText: 'Warm DCM causes partial transesterification.'
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
        desc: 'Adsorb Cu-free BSA-TCO onto 40 nm gold and check mobility shift.',
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
            label: 'Coat gold with BSA-TCO',
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
              label: 'EDTA-treated BSA-TCO in 20 mM MES pH 5.2',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Ruby salt-stable particles with clean gel shift.'
            },
            {
              label: 'EDTA-treated BSA-TCO in 20 mM MES pH 5.8',
              isOptimal: false,
              yieldMod: 3,
              purityMod: -5,
              safetyMod: 0,
              outcomeText: 'Slightly above pI lowers corona packing density.'
            },
            {
              label: 'Untreated BSA-TCO in 10 mM citrate pH 5.2',
              isOptimal: false,
              yieldMod: -7,
              purityMod: -9,
              safetyMod: -2,
              outcomeText: 'Trace metal ions slowly isomerise strained TCO.'
            },
            {
              label: 'Untreated BSA-TCO in 1x PBS pH 7.4',
              isOptimal: false,
              yieldMod: -14,
              purityMod: -15,
              safetyMod: -4,
              outcomeText: 'High ionic strength collapses citrate double layer.'
            }
          ],
          askChudsHint: 'Peter: Coat just near BSA isoelectric pH with low ionic strength and chelate trace metals off TCO.',
          antoineHint: 'Antoine: Low-salt MES right above pH 5 packs BSA densely while EDTA protects the trans-cyclooctene.'
        },
        dataOutput: {
          type: 'gel',
          label: 'Colloidal Mobility Shift Gel: 40 nm AuNP-BSA-TCO25',
          productPeak: 'Crisp ruby-red corona band (529 nm, zero well aggregation)',
          metricLabel: '52.2 nm Z-avg, salt-stable crimson AuNPs'
        }
      },
      {
        index: 4,
        id: 'dan_step_5',
        dayHint: 'Thu/Fri',
        title: 'Assemble Lateral Flow Strips',
        desc: 'Click Fab-BCN onto gold particles and run HER2 test strips.',
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
            label: 'Click Fab onto gold',
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
            minigame: null,
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
            minigame: 'gel_load',
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
            minigame: null,
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
          productPeak: '4.92 ppm (d, 2H, propargyl), 2.34 ppm (t, 1H) and 98.8 ppm C=C',
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
          productPeak: 'Clean conjugated spot Rf = 0.45 (0.0 free -SH, A412 = 0.002)',
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
        minigame: null,
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
            minigame: null,
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
        minigame: 'gel_load',
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
            minigame: 'gel_load',
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
            id: 'pet_2_5',
            label: 'Submit sample to NMR',
            roomId: 'cib_lg1b_nmr',
            stationTypes: ['nmr_magnet'],
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
            id: 'pet_2_6',
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
          productPeak: '309.1 Da free Neu5Ac release (92% desialylation)',
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
            minigame: null,
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
        minigame: 'gel_load',
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
            minigame: 'gel_load',
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
            minigame: null,
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
          productPeak: 'Selective HC CH1 Cys to Dha with intact LC (DAR 6)',
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
          antoineHint: 'Antoine: Fast 2 s vortex/mix at pH 7.4-8.0 beats the 8 s gel point, and cysteamine proves 5DiH reversibility.'
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
        minigame: null,
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
            minigame: null,
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
  }
};

window.KLB.getCampaign = function(charId) {
  return window.KLB.CAMPAIGNS?.[charId] || null;
};

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
    paperRef: 'Richards, Szijj, Nogueira & Chudasama et al., Nanoscale 2021, 13, 11921 (DOI: 10.1039/d1nr02584h); Richards, Nogueira, Fernandez & Chudasama et al., Chem. Sci. 2018, 9, 790 (DOI: 10.1039/c7sc02747h)',
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
        durationMins: 28,
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
            durationMins: 5,
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
            durationMins: 28,
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
            durationMins: 13,
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
          prompt: 'How do you isolate pure FabHER2 cleanly?',
          options: [
            {
              label: 'Pepsin pH 3.1, then DTT-washed papain pH 6.8',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Clean 48 kDa Fab with intact internal disulfide.'
            },
            {
              label: 'One-step papain plus Protein A column',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -14,
              safetyMod: 0,
              outcomeText: 'Trastuzumab VH3 binds Protein A and loses 80% Fab.'
            },
            {
              label: 'Papain digest with unwashed 10 mM DTT',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Leftover DTT splits Fab into 25 kDa monomers.'
            }
          ],
          askChudsHint: 'Peter: Avoid Protein A for Herceptin Fab; run pepsin pH 3.1 then DTT-free papain.',
          antoineHint: 'Antoine: Two-step pepsin pH 3.1 then washed papain pH 6.8 keeps Fab intact.'
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
        title: 'Synthesize BCN-PD Linker',
        desc: 'Couple diBrPD-NHS with BCN-amine, purify on column, and run NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 25,
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
            durationMins: 25,
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
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'dan_2_4',
            label: 'Dissolve and prep tube',
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
            id: 'dan_2_5',
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
          prompt: 'How do you couple and purify acid-sensitive BCN?',
          options: [
            {
              label: 'Dry MeCN at 21 C; neutral EtOAc/petrol column',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Clean coupling gives pure yellow BCN-PD linker.'
            },
            {
              label: 'Reflux in glacial acetic acid for 3 hours',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -20,
              safetyMod: -5,
              outcomeText: 'Hot acid ring-opens the strained alkyne.'
            },
            {
              label: 'Elute Biotage column with 1% TFA in DCM',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -18,
              safetyMod: -4,
              outcomeText: 'TFA rearranges strained BCN on silica.'
            }
          ],
          askChudsHint: 'Joao: Keep acid away from BCN; stir in dry MeCN and run a neutral column.',
          antoineHint: 'Antoine: Couple diBrPD-NHS at room temp in dry MeCN with zero TFA.'
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
        durationMins: 28,
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
            durationMins: 5,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 18,
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
          prompt: 'How do you prep Fab-BCN before LG11 Q-TOF MS?',
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
              label: 'Inject crude borate and NaCl buffer mix',
              isOptimal: false,
              yieldMod: -10,
              purityMod: -18,
              safetyMod: -8,
              outcomeText: 'Borate crusts cone and sodium adducts swamp MS.'
            },
            {
              label: 'Add 10% PEG-400 and PBS before injection',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -22,
              safetyMod: -12,
              outcomeText: 'PEG floods spectra and Kersti shuts down LG11.'
            }
          ],
          askChudsHint: 'Richard: Always desalt 6x into LC-MS water before LG11 so borate does not suppress.',
          antoineHint: 'Antoine: Spin-desalt into pure water to see 48,295 Da cleanly on MaxEnt1.'
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
        durationMins: 25,
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
            durationMins: 25,
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
            durationMins: 13,
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
            durationMins: 15,
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
              label: 'EDTA-dialysed BSA-TCO in 20 mM MES pH 5.2',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Ruby salt-stable particles with clean gel shift.'
            },
            {
              label: 'Untreated BSA-TCO in standard 1x PBS pH 7.4',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Trace Cu kills TCO and PBS aggregates gold.'
            },
            {
              label: 'Coat in unbuffered water at pH 3.0',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -16,
              safetyMod: 0,
              outcomeText: 'Low pH strips citrate and crashes black gold.'
            }
          ],
          askChudsHint: 'Peter: Dialyse BSA with EDTA to strip copper and coat in 20 mM MES pH 5.2.',
          antoineHint: 'Antoine: MES pH 5.20 in LoBind tubes hits the sweet spot for BSA-TCO coating.'
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
        durationMins: 25,
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
            durationMins: 25,
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
          prompt: 'Which running buffer do you wick down NC-95?',
          options: [
            {
              label: 'Serum plus 0.1% Tween 20 with blank control',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Sharp crimson test line with clean blank strip.'
            },
            {
              label: 'Neat PBS without Tween 20 or blocker',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Conjugate stalls and smears the control strip.'
            },
            {
              label: '50% MeCN / 50% DMSO organic mobile phase',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -22,
              safetyMod: -6,
              outcomeText: 'DMSO dissolves nitrocellulose into sticky gel.'
            }
          ],
          askChudsHint: 'Joao: Serum plus 0.1% Tween 20 keeps NC-95 flowing cleanly with a blank control.',
          antoineHint: 'Antoine: Tween 20 surfactant and a zero-HER2 control strip give clean densitometry.'
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
  // 2. MAXIMILLIAN LEE - 25 A Bis-diBrPD Stapling & Native DAR 2.0 Herceptin
  // =========================================================================
  maximillian_lee: {
    charId: 'maximillian_lee',
    title: '25 A Bis-diBrPD Stapling & Native DAR 2.0 Herceptin ADCs',
    manuscriptTopic: '25 A Bis-diBrPD Stapling & Native DAR 2 ADCs',
    paperRef: 'Lee, Maruani, Richards, Baker & Chudasama, Chem. Sci. 2017, 8, 2056 (DOI: 10.1039/c6sc03655d); Lee, Maruani, Baker & Chudasama, Chem. Sci. 2016, 7, 799 (DOI: 10.1039/c5sc02666k)',
    overview: 'Build 25 A bis-PD staples and lock native Herceptin into DAR 2.0 conjugates.',
    steps: [
      {
        index: 0,
        id: 'max_step_1',
        dayHint: 'Mon',
        title: 'Synthesize Bis-PD Crosslinker',
        desc: 'Bridge two diBrPD heads across a 25 A PEG spacer and purify.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 28,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'max_1_1',
            label: 'Get dry solvent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 1',
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
            durationMins: 5,
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
            durationMins: 28,
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
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          },
          {
            id: 'max_1_5',
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
            viewOutput: null,
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'Which diamine builds a clean IgG1 hinge staple?',
          options: [
            {
              label: '25 A trioxa-tridecanediamine PEG spacer',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Spans two disulfides cleanly for DAR 2.0.'
            },
            {
              label: 'Short 1,2-ethylenediamine 3.8 A tether',
              isOptimal: false,
              yieldMod: -14,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Too short to span hinge; forms messy dimers.'
            },
            {
              label: 'Polydisperse 10 kDa PEG in wet DMF',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Wet DMF hydrolyses NHS and smears on column.'
            }
          ],
          askChudsHint: 'Dan: Use the 25 A trioxa-tridecanediamine PEG spacer to span two disulfides.',
          antoineHint: 'Antoine: That 25 A PEG diamine bridges two hinge disulfides without dimerizing.'
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
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 5,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'max_2_4',
            label: 'Dissolve and prep tube',
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
          prompt: 'How do you run NMR on air-sensitive phosphines?',
          options: [
            {
              label: 'Degassed CDCl3 under argon; store at -20 C',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Zero phosphine oxide; 98% active reagent.'
            },
            {
              label: 'Leave CDCl3 tube uncapped overnight to dry',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -20,
              safetyMod: -4,
              outcomeText: 'Air oxidizes 70% of phosphine and Abil fines.'
            },
            {
              label: 'Heat in DMSO-d6 at 110 C to sharpen peaks',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Hot DMSO oxidizes trialkylphosphines to P=O.'
            }
          ],
          askChudsHint: 'Andre: Use degassed CDCl3 under argon and store the solid at -20 C.',
          antoineHint: 'Antoine: Never heat phosphines in DMSO; run argon-blanketed CDCl3.'
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
        durationMins: 25,
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
            durationMins: 25,
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
            durationMins: 23,
            sweetSpotMins: 69,
            canOvercook: true,
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
            durationMins: 13,
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
            durationMins: 15,
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
          prompt: 'Which reducing setup do you use on Herceptin?',
          options: [
            {
              label: 'Fresh buffered TCEP in BBS pH 8.0 plus EDTA',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean rebridging with sharp 150 kDa gel band.'
            },
            {
              label: 'Unlabelled warm bench TCEP tube at pH 2.3',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -22,
              safetyMod: -4,
              outcomeText: 'Low pH and oxidized TCEP scramble half-mAb.'
            },
            {
              label: 'Excess 100 eq DTT at 50 C',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'DTT consumes all bromines before stapling.'
            }
          ],
          askChudsHint: 'Calise: Skip the mystery tube and use fresh pH 8.0 BBS-buffered TCEP.',
          antoineHint: 'Antoine: Fresh 20 mM TCEP in BBS pH 8.0 + EDTA keeps stapling tight.'
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
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 18,
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
          prompt: 'How do you calculate accurate DAR 2.0?',
          options: [
            {
              label: 'Wash 6x on spin; subtract PD and Dox CF280',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 14,
              safetyMod: 2,
              outcomeText: 'Consistent DAR 2.0 across seven replicates.'
            },
            {
              label: 'Divide raw A495 by raw A280 with no CF280',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -16,
              safetyMod: 0,
              outcomeText: 'Dox bleed-through skews apparent DAR to 1.48.'
            },
            {
              label: 'Skip spin washes to avoid membrane loss',
              isOptimal: false,
              yieldMod: 4,
              purityMod: -22,
              safetyMod: -6,
              outcomeText: 'Free Dox gives fake DAR 19 and fouls LG11.'
            }
          ],
          askChudsHint: 'Faiza: Wash 6x on VivaSpin and subtract PD and Dox 280 nm bleed-through.',
          antoineHint: 'Antoine: Subtract 0.28*A345 and 0.724*A495 from A280 after 6x washing.'
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
        durationMins: 25,
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
            durationMins: 25,
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
            durationMins: 13,
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
            durationMins: 15,
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
          prompt: 'How do you confirm retained HER2 binding?',
          options: [
            {
              label: 'Equimolar HER2 plus native mAb positive lane',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Crisp shifted band matching native Herceptin.'
            },
            {
              label: 'Boil HER2 complex 15 min in reducing BME',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Boiling and BME denature the antigen complex.'
            },
            {
              label: 'Omit native Herceptin comparator control',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -16,
              safetyMod: 0,
              outcomeText: 'Vijay rejects binding data without comparator.'
            }
          ],
          askChudsHint: 'Dan: Run non-reducing gel shift against an unmodified Herceptin control.',
          antoineHint: 'Antoine: Keep samples non-denatured and include native Herceptin beside ADC.'
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
        title: 'Synthesize Asymmetric Astra-PD',
        desc: 'Reflux dibromomaleic acid, install dual alkynes, and check by NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 15,
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
            durationMins: 20,
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
          prompt: 'How do you form diBrPD from £18/g diacid?',
          options: [
            {
              label: 'Pre-reflux diacid in AcOH 30m, then hydrazine',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Clean in situ anhydride gives 81% crystalline PD.'
            },
            {
              label: 'Mix diacid and hydrazine cold at 21 C',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -14,
              safetyMod: 0,
              outcomeText: 'Ring closure stalls in cold acetic acid.'
            },
            {
              label: 'Reflux in concentrated 37% aqueous HCl',
              isOptimal: false,
              yieldMod: -18,
              purityMod: -22,
              safetyMod: -8,
              outcomeText: 'Chloride ions scramble ring bromines.'
            }
          ],
          askChudsHint: 'Calise: Pre-reflux dibromomaleic acid in AcOH for 30 min before hydrazine.',
          antoineHint: 'Antoine: 30 min pre-reflux in glacial AcOH forms the anhydride cleanly.'
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
        title: 'Rebridge Herceptin at 4 C',
        desc: 'Rebridge Herceptin with Astra-PD at 4 C and check thiols with DTNB.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 28,
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
            durationMins: 28,
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
          prompt: 'What biochemical check passes before Cu click?',
          options: [
            {
              label: 'Desalt and run DTNB aliquot for zero -SH',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Reads 0.0 free thiols; all disulfides locked.'
            },
            {
              label: 'Skip thiol check and click with TCEP present',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Leftover TCEP kills azide and scrambles Cys.'
            },
            {
              label: 'Boil bulk antibody with 50 mM DTNB',
              isOptimal: false,
              yieldMod: -26,
              purityMod: -20,
              safetyMod: -4,
              outcomeText: 'You denatured your entire preparative batch.'
            }
          ],
          askChudsHint: 'Max: Desalt first and check a 5 uL aliquot with Ellman DTNB at 412 nm.',
          antoineHint: 'Antoine: Zero free thiols by DTNB confirms safe entry to click chemistry.'
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
        desc: 'Click doxorubicin azide via SPAAC at 37 C and verify DAR 4 by MS.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 18,
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
          prompt: 'Which click order preserves dual selectivity?',
          options: [
            {
              label: 'Copper-free SPAAC first, then CuAAC second',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 14,
              safetyMod: 2,
              outcomeText: 'Terminal alkynes wait cleanly; clean DAR 4.0.'
            },
            {
              label: 'CuAAC Cy5 first, then SPAAC Dox second',
              isOptimal: false,
              yieldMod: -20,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Copper triggers clicking on both alkynes.'
            },
            {
              label: 'Mix both azides and CuSO4 in one pot',
              isOptimal: false,
              yieldMod: -14,
              purityMod: -24,
              safetyMod: 0,
              outcomeText: 'Produces statistical DAR 0 to 8 mixture.'
            }
          ],
          askChudsHint: 'Dan: Always run copper-free SPAAC first so terminal alkynes stay untouched.',
          antoineHint: 'Antoine: Catalyst-free SPAAC first leaves terminal alkynes 100% intact.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Waters uPLC-SQD MS: SPAAC Herceptin-Dox4 Intermediate',
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
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 18,
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
          prompt: 'How do you protect antibody from Cu ROS?',
          options: [
            {
              label: '5:1 THPTA:Cu in PBS, then 2 mM EDTA wash',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean DAR 4 + FAR 4 with zero Met oxidation.'
            },
            {
              label: 'Run CuAAC in buffer with 10 mM EDTA',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -14,
              safetyMod: 0,
              outcomeText: 'EDTA chelates all copper and gives 0% click.'
            },
            {
              label: 'Use 20 mM CuSO4 with no THPTA ligand',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -22,
              safetyMod: -4,
              outcomeText: 'Fenton ROS oxidizes Met and turns mAb brown.'
            }
          ],
          askChudsHint: 'Peter: Use 5:1 THPTA:CuSO4 in EDTA-free PBS, then wash with 2 mM EDTA.',
          antoineHint: 'Antoine: THPTA shields His/Met during click; EDTA strips copper afterward.'
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
          prompt: 'How do you denature and image the gel?',
          options: [
            {
              label: 'Heat 75 C 3m; fluorescence before Coomassie',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: '150 kDa band glows in both Dox and Cy5 lanes.'
            },
            {
              label: 'Boil 15m in BME and stain Coomassie first',
              isOptimal: false,
              yieldMod: -10,
              purityMod: -20,
              safetyMod: -2,
              outcomeText: 'Coomassie quenches dye and boiling aggregates.'
            },
            {
              label: 'Load sample without SDS in 20% glycerol',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Basic Herceptin runs backwards out of wells.'
            }
          ],
          askChudsHint: 'Max: Heat 75 C for 3 min non-reducing and scan fluorescence before Coomassie.',
          antoineHint: 'Antoine: Image fluorescence before Coomassie staining; 75 C avoids aggregation.'
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
  // 4. ANDRE SHAMSABADI - On-Water Hydrazides, Arynes & Phenazepam Route
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
        durationMins: 28,
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
            durationMins: 28,
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
              label: 'Degas 3x under argon in dry THF with BHT',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -14,
              safetyMod: 0,
              outcomeText: 'Removing O2 and adding BHT kills radical chain.'
            },
            {
              label: 'Heat neat DIAD at 160 C in sealed vial',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -20,
              safetyMod: -18,
              outcomeText: 'Azodicarboxylate decomposes and pops septum.'
            }
          ],
          askChudsHint: 'Marcos: Keep it in open air with 1 mL water and brisk stirring.',
          antoineHint: 'Antoine: Trace O2 initiates the radical on water; never degas this step.'
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
            cupboardHint: 'Cupboard 1',
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
            label: 'Remove toluene on buchi',
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
          prompt: 'Which fluoride source generates benzyne cleanly?',
          options: [
            {
              label: 'Anhydrous TBAT in dry toluene under argon',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Zero water; 84% rearranged hydrazobenzophenone.'
            },
            {
              label: 'Wet commercial 1 M TBAF in THF on bench',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Water quenches benzyne to phenol at 28% yield.'
            },
            {
              label: '48% aqueous HF in a borosilicate flask',
              isOptimal: false,
              yieldMod: -26,
              purityMod: -22,
              safetyMod: -24,
              outcomeText: 'HF etches glass and triggers a safety alarm.'
            }
          ],
          askChudsHint: 'Richard: Use solid anhydrous TBAT in dry toluene under an argon balloon.',
          antoineHint: 'Antoine: Oven-dried flask, argon, and anhydrous TBAT at 55 C give clean benzyne.'
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
        durationMins: 28,
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
            durationMins: 28,
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
              label: 'Infuse 5.7 uL/min over 30m via syringe pump',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean N-alkylation and E1cB N-N cleavage (82%).'
            },
            {
              label: 'Squirt all 2.5 eq in 3 seconds by hand',
              isOptimal: false,
              yieldMod: -20,
              purityMod: -14,
              safetyMod: -4,
              outcomeText: 'Violent H2 fizzing and self-condensation (53%).'
            },
            {
              label: 'Quench excess NaH with MeOH before addition',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -18,
              safetyMod: -8,
              outcomeText: 'Methoxide destroys bromomalonate ester.'
            }
          ],
          askChudsHint: 'Marcos: Infuse at 5.7 uL/min on the syringe pump to avoid dimerization.',
          antoineHint: 'Antoine: Slow syringe-pump infusion keeps bromomalonate concentration low.'
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
        title: 'Cyclize and Purify Phenazepam',
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
            cupboardHint: 'Cupboard 1',
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
            label: 'Run ring cyclization',
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
              label: 'AlCl3/DCM, NBS at 0 C, then NH4OH cyclization',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Crisp white Phenazepam crystals in 85% yield.'
            },
            {
              label: 'Autoclave in 40% KOH glycol at 195 C',
              isOptimal: false,
              yieldMod: -18,
              purityMod: -20,
              safetyMod: -10,
              outcomeText: 'Harsh base chews aryl chloride into black tar.'
            },
            {
              label: 'Add 3 eq NBS at reflux before deprotection',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -22,
              safetyMod: -4,
              outcomeText: 'Brominates wrong ring into wrong regioisomer.'
            }
          ],
          askChudsHint: 'Calise: AlCl3 in dry DCM cleaves the carbamate cleanly at room temp in 45 min.',
          antoineHint: 'Antoine: Mild AlCl3 deprotection then 1 eq NBS at 0 C hits para selectively.'
        },
        dataOutput: {
          type: 'lcms',
          label: 'Biotage UV & HRMS: Crystalline Phenazepam',
          productPeak: '348.97 m/z [M+H]+ (79Br35Cl / 81Br35Cl cluster)',
          metricLabel: '85% cyclization yield, 98% purity'
        }
      },
      {
        index: 4,
        id: 'andre_step_5',
        dayHint: 'Thu/Fri',
        title: 'Run 700 MHz VT-NMR',
        desc: 'Prepare high-boiling DMSO-d6 tube and verify rotamer coalescence.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 20,
        sweetSpotMins: 225,
        minigame: null,
        subTasks: [
          {
            id: 'and_5_1',
            label: 'Get dry DMSO solvent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 1',
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
            label: 'Dissolve and prep tube',
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
            durationMins: 20,
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
          prompt: 'Which solvent runs safely at +120 C VT-NMR?',
          options: [
            {
              label: 'High-boiling DMSO-d6 at 4.5 cm; collect prompt',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 14,
              safetyMod: 2,
              outcomeText: 'Rotamers coalesce cleanly at 120 C on 700 MHz.'
            },
            {
              label: 'CDCl3 at 2 cm in a chipped NMR tube',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -24,
              safetyMod: -18,
              outcomeText: 'CDCl3 boils at 61 C and pops cap inside probe.'
            },
            {
              label: 'Call split 25 C rotamers diastereomers',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Vijay notes achiral hydrazides show rotamers.'
            }
          ],
          askChudsHint: 'Antoine: DMSO-d6 only for +120 C VT-NMR, 4.5 cm depth, and grab your tube back.',
          antoineHint: 'Antoine: DMSO-d6 boils at 189 C for safe coalescence, and grab your 3F clicker.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 700 MHz VT-NMR (DMSO-d6): Phenazepam & Rotamers',
          productPeak: 'Coalesced 120 C singlets; Phenazepam 10.74 (NH), 4.18 (CH2)',
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
        durationMins: 30,
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
            durationMins: 30,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: true,
            minigame: null,
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'pet_1_3',
            label: 'Neutralize Protein A eluate',
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
            id: 'pet_1_4',
            label: 'Spin and desalt fragments',
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
            id: 'pet_1_5',
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
              outcomeText: 'Instant neutralization keeps FcCD20 soluble.'
            },
            {
              label: 'Leave FcCD20 in pH 2.5 glycine for 3 hours',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Acid unfolds CH2 domains into white curds.'
            },
            {
              label: 'Purify Trastuzumab Fc on Protein A column',
              isOptimal: false,
              yieldMod: -18,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'VH3 Fab co-binds Protein A and ruins purity.'
            }
          ],
          askChudsHint: 'Dan: Use Rituximab for Fc and spike 1 M Tris pH 8.8 into collection tubes.',
          antoineHint: 'Antoine: 10% 1 M Tris pH 8.8 in receiver tubes saves Fc from acid unfolding.'
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
        title: 'Synthesize Pink Tetrazine Hub',
        desc: 'Build and oxidize pink Br2PD-Tz-N3 hub, purify, and check by NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 28,
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
            label: 'Oxidize hub in hood',
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
            id: 'pet_2_3',
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
            id: 'pet_2_4',
            label: 'Dissolve and prep tube',
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
            id: 'pet_2_5',
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
              label: 'Oxidize in hood; desalt TCEP off before Tz',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Vivid pink tetrazine survives cleanly on Fab.'
            },
            {
              label: 'Run NaNO2 oxidation on open bench not hood',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -14,
              safetyMod: -22,
              outcomeText: 'Toxic NOx gas floods Lab 230 as safety drops.'
            },
            {
              label: 'Add pink Br2PD-Tz directly into 10 eq TCEP',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'TCEP reduces tetrazine to dead dihydro-Tz.'
            }
          ],
          askChudsHint: 'Calise: Zeba-desalt TCEP off before adding tetrazine-PD or TCEP bleaches it.',
          antoineHint: 'Antoine: Oxidize in the hood and desalt reduced Fab before adding Br2PD-Tz-N3.'
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
        durationMins: 30,
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
            durationMins: 5,
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
            durationMins: 30,
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
            durationMins: 18,
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
              label: 'Run SPIEDAC in pH 4.5 acetate for speed',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Bacterial sialidase unfolds below pH 5.5.'
            },
            {
              label: 'Use 3-week-old Fab-BCN plus 10 eq BCN dimer',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Aged BCN is dead and dimer precipitates out.'
            }
          ],
          askChudsHint: 'Dan: Make Fab-BCN fresh on the day and click strictly at pH 7.0 PBS.',
          antoineHint: 'Antoine: pH 7.0 PBS keeps sialidase active while fresh BCN + Tz clicks cleanly.'
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
        durationMins: 23,
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
            durationMins: 15,
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
            durationMins: 23,
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
            durationMins: 15,
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
              label: 'Aliquot 8 uL, fridge stock, then heat 95 C',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Master stock safe; crisp 147 kDa gel band.'
            },
            {
              label: 'Leave master stock open beside dye and phone',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Pipetted 2 uL blue dye right into master stock.'
            },
            {
              label: 'Pool all SEC fractions without running a gel',
              isOptimal: false,
              yieldMod: 4,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Mixes pure 147 kDa SynAb back with 48 kDa Fab.'
            }
          ],
          askChudsHint: 'Max: Cap your pure SynAb stock and fridge it before touching blue loading dye.',
          antoineHint: 'Antoine: Aliquot first, fridge master stock, then denature 95 C 5 min in LDS.'
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
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 18,
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
          prompt: 'Which control proves sialidase activity?',
          options: [
            {
              label: 'Compare CiTE vs BiTE lacking sialidase',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Shows clean sialic acid cleavage at pH 7.0.'
            },
            {
              label: 'Test CiTE with no sialoside substrate',
              isOptimal: false,
              yieldMod: -14,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Nothing to cleave; flat baseline MS signal.'
            },
            {
              label: 'Denature CiTE in 4% PFA before assay',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -24,
              safetyMod: -4,
              outcomeText: 'PFA crosslinks and kills sialidase enzyme.'
            }
          ],
          askChudsHint: 'Faiza: Always compare your CiTE directly against the BiTE lacking sialidase.',
          antoineHint: 'Antoine: CiTE vs unsialylated BiTE comparator proves enzymatic desialylation.'
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
  // 6. JOAO NOGUEIRA - Shark VNARs & Targeted PLGA-PEG Nanoparticles
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
        title: 'Synthesize monoBrPD-BCN Linker',
        desc: 'Couple bromomaleic propanoate to BCN-amine, purify, and run NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          },
          {
            id: 'joa_1_4',
            label: 'Dissolve and prep tube',
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
            id: 'joa_1_5',
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
          prompt: 'Which hydrazine tether avoids NHS breakdown?',
          options: [
            {
              label: '2-carbon propionic tether plus DCC/NHS',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 10,
              safetyMod: 2,
              outcomeText: 'Clean monoBrPD-BCN isolated without breakdown.'
            },
            {
              label: '1-carbon ethanoic tether plus DCC/NHS',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Self-destructs via 6-membered cyclization.'
            },
            {
              label: 'Use diBrPD leaving second bromine free',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Second bromine forms 22 kDa VNAR homodimers.'
            }
          ],
          askChudsHint: 'Calise: Use the 2-carbon propionic tether; the 1-carbon ethanoic tether degrades.',
          antoineHint: 'Antoine: Propanoate tether prevents intramolecular breakdown during NHS activation.'
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
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 18,
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
          prompt: 'How do you uncap VNAR without hurting core S-S?',
          options: [
            {
              label: 'Mild 10 eq TCEP at pH 7.4 and 21 C',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Uncaps C-terminal Cys cleanly for PAR 1.0.'
            },
            {
              label: 'Add monoBrPD-BCN straight with no TCEP',
              isOptimal: false,
              yieldMod: -26,
              purityMod: -16,
              safetyMod: 0,
              outcomeText: '0% reaction because Cys is GSH-capped.'
            },
            {
              label: 'Boil VNAR 95 C in 6 M urea and 50 mM TCEP',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -24,
              safetyMod: 0,
              outcomeText: 'Unfolds VNAR and labels all buried cysteines.'
            }
          ],
          askChudsHint: 'Dan: Mild 10 eq TCEP at 21 C uncaps the C-terminal Cys without unfolding.',
          antoineHint: 'Antoine: Room-temp TCEP in pH 7.4 phosphate removes GSH cap cleanly.'
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
        durationMins: 25,
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
            durationMins: 5,
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
            durationMins: 25,
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
            durationMins: 15,
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
            durationMins: 13,
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
              label: 'Dropwise 75:25 PLGA:PLGA-PEG-N3, mild rotavap',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean 194 nm spheres with low PDI 0.09.'
            },
            {
              label: 'Dump 100% unmodified PLGA into water',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Aggregates crash and zero azide handles exist.'
            },
            {
              label: 'Evaporate on rotavap at 85 C and 15 mbar',
              isOptimal: false,
              yieldMod: -20,
              purityMod: -20,
              safetyMod: -4,
              outcomeText: 'Above PLGA Tg particles melt into gum.'
            }
          ],
          askChudsHint: 'Dan: Use 75:25 PLGA:PLGA-PEG-azide and keep rotavap bath below 45 C.',
          antoineHint: 'Antoine: Dropwise addition plus gentle RT rotavap stays below PLGA Tg.'
        },
        dataOutput: {
          type: 'tlc',
          label: 'Nile-Red Encapsulation TLC Check: PLGA-PEG-N3 NPs',
          productPeak: 'Encapsulated Nile Red (Rf = 0.55) with minimal free dye',
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
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 15,
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
          prompt: 'How do you orient VNARs on hydrophobic pores?',
          options: [
            {
              label: 'Catalyst-free SPAAC in PBS with Tween 80',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Tween 80 wets pores; CDR3 loops point outward.'
            },
            {
              label: 'Random EDC/NHS coupling in neat PBS',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Blocks CDR3 loop and dry pores float like cork.'
            },
            {
              label: 'Dissolve PLGA particles in acetone first',
              isOptimal: false,
              yieldMod: -26,
              purityMod: -24,
              safetyMod: -4,
              outcomeText: 'Acetone destroys NPs and precipitates VNAR.'
            }
          ],
          askChudsHint: 'Dan: Tween 80 wets hydrophobic pores and SPAAC keeps CDR3 facing out.',
          antoineHint: 'Antoine: PBS + Tween 80 wets pores while C-terminal SPAAC orients VNAR.'
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
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 18,
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
          prompt: 'Which control proves oriented VNAR binding?',
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
              label: 'Run assay in unfiltered 50% serum with air',
              isOptimal: false,
              yieldMod: -10,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Serum debris and bubbles ruin target signal.'
            },
            {
              label: 'Skip random NHS and blank NP comparators',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Vijay rejects claims lacking control groups.'
            }
          ],
          askChudsHint: 'Richard: Always plot oriented SPAAC NPs beside equimolar random-NHS controls.',
          antoineHint: 'Antoine: Azide-blank and random-NHS comparators prove true oriented capture.'
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
        desc: 'Click diBrPD-BCN and MMAE-azide in dry DMSO and verify by TLC.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 28,
        sweetSpotMins: 69,
        minigame: null,
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
            cupboardHint: 'Cupboard 1',
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
            durationMins: 28,
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
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'How do you handle greasy MMAE linker-drug?',
          options: [
            {
              label: 'Pre-click 1 eq diBrPD-BCN + 1.1 eq MMAE-N3',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean 2015 Da PD-MMAE stock in dry DMSO.'
            },
            {
              label: 'Rebridge IgG4 first, then add MMAE in PBS',
              isOptimal: false,
              yieldMod: -20,
              purityMod: -20,
              safetyMod: -4,
              outcomeText: 'MMAE oils out in PBS, stalling at DAR 1.5.'
            },
            {
              label: 'Pre-click 3 eq diBrPD-BCN + 1 eq MMAE-N3',
              isOptimal: false,
              yieldMod: -10,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Excess empty diBrPD steals IgG4 disulfides.'
            }
          ],
          askChudsHint: 'Calise: Pre-click in DMSO with 1.1 eq MMAE-azide so zero empty diBrPD remains.',
          antoineHint: 'Antoine: 1.0 eq diBrPD-BCN plus 1.1 eq MMAE-N3 ensures every head carries drug.'
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
        durationMins: 18,
        sweetSpotMins: 225,
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
            durationMins: 25,
            sweetSpotMins: 69,
            canOvercook: true,
            triggersChoice: false,
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
            durationMins: 13,
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
            triggersChoice: true,
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
              label: 'Papain pH 7.2, Protein A flow, 6x desalt',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Shows 2015 Da Br2 triplet and 47.4 kDa Fab.'
            },
            {
              label: 'Inject crude 80 mM cysteine digest directly',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -20,
              safetyMod: -8,
              outcomeText: 'Cysteine fouls ESI source and angers Kersti.'
            },
            {
              label: 'Skip LG11 MS verification of intermediates',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Missing 2015 Da proof fails Friday rigor.'
            }
          ],
          askChudsHint: 'Marcos: Desalt off cysteine first and check the 1:2:1 Br2 triplet at 2015 Da.',
          antoineHint: 'Antoine: Confirm both bromines survived DMSO by checking the 2015 Da Br2 pattern.'
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
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 25,
            sweetSpotMins: 69,
            canOvercook: true,
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
            durationMins: 13,
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
            durationMins: 15,
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
              label: '100 eq TCEP 37 C, spin wash, 10 eq PD-MMAE',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'TCEP-resistant 150 kDa DAR 4.0 Maga-MMAE.'
            },
            {
              label: 'Use 4 eq TCEP at 4 C without wash',
              isOptimal: false,
              yieldMod: -18,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'IgG4 resists 4 eq TCEP and stalls at DAR 1.6.'
            },
            {
              label: 'Add PD-MMAE in 30% DMSO straight into TCEP',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'TCEP kills PD-MMAE and 30% DMSO crashes IgG4.'
            }
          ],
          askChudsHint: 'Calise: IgG4 needs 100 eq TCEP at 37 C, then spin-wash before adding PD-MMAE.',
          antoineHint: 'Antoine: Reduce with 100 eq TCEP, wash clean, then rebridge in 6% DMSO.'
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
        desc: 'Prepare DMSO-d6 sample of vc-PABC linker and check 600 MHz NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 20,
        sweetSpotMins: 225,
        minigame: null,
        subTasks: [
          {
            id: 'fai_4_1',
            label: 'Get dry DMSO solvent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 1',
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
            label: 'Dissolve and prep tube',
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
          prompt: 'How do you confirm intact vc-PABC and DAR 4?',
          options: [
            {
              label: 'Full DMSO-d6 1H NMR plus DAR 0/2/4 control',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean PABC signal at 5.01 ppm and DAR 3.9.'
            },
            {
              label: 'Skip NMR and rely only on raw A280 reading',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Raw A280 hides DAR 0+8 heterogeneity.'
            },
            {
              label: 'Dissolve ADC in CDCl3 for NMR acquisition',
              isOptimal: false,
              yieldMod: -14,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Protein crashes out as an insoluble pellet.'
            }
          ],
          askChudsHint: 'Richard: Confirm intact PABC ArCH2O in DMSO-d6 alongside isotype controls.',
          antoineHint: 'Antoine: DMSO-d6 resolves the vc-PABC spacer cleanly for SI characterization.'
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
              purityMod: 14,
              safetyMod: 2,
              outcomeText: 'Quantitative free MMAE release at tumor pH.'
            },
            {
              label: 'Assay ADC in pH 7.8 buffer with no protease',
              isOptimal: false,
              yieldMod: -16,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Cathepsin B is inactive at pH 7.8; zero release.'
            },
            {
              label: 'Add 1% Triton X-100 without cathepsin B',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -24,
              safetyMod: 0,
              outcomeText: 'Detergent does not cleave vc-PABC dipeptide.'
            }
          ],
          askChudsHint: 'Marcos: Pre-activate cathepsin B with DTT and run cleavage at pH 6.5.',
          antoineHint: 'Antoine: pH 6.5 tumor-mimic buffer keeps cathepsin B active for clean MMAE release.'
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
    overview: 'Scale p-TsOH diBrPD-NHS, hit 95% HHLL at 4 C, and build serum-stable GFP.',
    steps: [
      {
        index: 0,
        id: 'calise_step_1',
        dayHint: 'Mon',
        title: 'Synthesize Gram-Scale diBrPD-NHS',
        desc: 'Cleave ester with p-TsOH, activate with DCC/NHS, purify, and run NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 30,
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
            durationMins: 30,
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
            durationMins: 13,
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
            durationMins: 15,
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
            durationMins: 20,
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
              label: 'Reflux with p-TsOH in toluene with zero TFA',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean white crystals with 100% Br2 intact.'
            },
            {
              label: 'Stir in 1:1 TFA/DCM at room temperature',
              isOptimal: false,
              yieldMod: -20,
              purityMod: -24,
              safetyMod: -4,
              outcomeText: 'TFA swaps ring bromines to dead monobromo-PD.'
            },
            {
              label: 'Saponify with 2 M LiOH at 50 C',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Hydroxide displaces bromide off the PD ring.'
            }
          ],
          askChudsHint: 'Dan: Never touch TFA on a diBrPD t-Bu ester; use p-TsOH in toluene.',
          antoineHint: 'Antoine: p-TsOH in refluxing toluene keeps both bromines 100% intact.'
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
        title: 'Rebridge Trastuzumab at 4 C',
        desc: 'Pre-chill antibody with diBrPD at 4 C, add TCEP, and check HHLL gel.',
        locationRoom: 'klb_2f',
        stationTypes: ['fridge_4c'],
        prepRequired: [],
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 13,
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
            durationMins: 15,
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
              label: 'Pre-chill mAb + 20 eq diBrPD at 4 C, then TCEP',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 14,
              safetyMod: 2,
              outcomeText: 'Locks interchain hinge cleanly to 95.4% HHLL.'
            },
            {
              label: 'Reduce with 10 eq TCEP at 37 C, then diBrPD',
              isOptimal: false,
              yieldMod: -10,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Forms 42% intrachain 75 kDa half-antibody.'
            },
            {
              label: 'Add 50 eq diBrPD at 4 C for faster reaction',
              isOptimal: false,
              yieldMod: -18,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Excess diBrPD crashes out and drops PDAR.'
            }
          ],
          askChudsHint: 'Max: Chill mAb with 20 eq diBrPD at 4 C before adding 10 eq TCEP.',
          antoineHint: 'Antoine: 4 C in situ rebridging suppresses 75 kDa half-mAb scrambling.'
        },
        dataOutput: {
          type: 'gel',
          label: '10% Non-Reducing SDS-PAGE: 4 C In Situ Rebridging',
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
        durationMins: 28,
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
            durationMins: 28,
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
            durationMins: 5,
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
            durationMins: 13,
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
            durationMins: 18,
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
          prompt: 'How do you lock C-N vs C-S cleavability on GFP?',
          options: [
            {
              label: 'p-Anisidine lock vs FEKGC thiol; measure uL',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'C-N resists GSH cleanly; true 89% recovery.'
            },
            {
              label: 'Use starting 500 uL volume after spin down',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Fake 125% yield meme gets roasted on Friday.'
            },
            {
              label: 'Hydrolyse second bromine with 50 mM NaOH',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -20,
              safetyMod: -4,
              outcomeText: 'High pH cleaves GFP thioether and PD ring.'
            }
          ],
          askChudsHint: 'Richard: p-Anisidine installs the stable C-N lock; always measure final uL.',
          antoineHint: 'Antoine: Aniline substitution stops retro-addition; thiol stays GSH-cleavable.'
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
        desc: 'Incubate PD-AF488 vs maleimide in human serum and analyze in LG11.',
        locationRoom: 'klb_2f',
        stationTypes: ['freezer_20c'],
        prepRequired: [],
        durationMins: 30,
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
            durationMins: 30,
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
            durationMins: 13,
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
            durationMins: 18,
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
              label: 'Track intact mass shift vs maleimide over 7d',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 14,
              safetyMod: 2,
              outcomeText: 'Maleimide loses 44% to HSA; PD loses under 2%.'
            },
            {
              label: 'Incubate in cold 4 C PBS and claim stability',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Maleimide survives thiol-free PBS; invalid.'
            },
            {
              label: 'Inject raw 600 uM serum with no dilution',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -20,
              safetyMod: -8,
              outcomeText: 'Albumin clogs LC-MS and hides 3.3 uM ADC.'
            }
          ],
          askChudsHint: 'Peter: Always run a maleimide-AF488 positive control in 37 C human serum.',
          antoineHint: 'Antoine: Compare PD vs maleimide at 37 C to prove zero HSA transfer.'
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
        durationMins: 25,
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
            durationMins: 25,
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
            durationMins: 13,
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
            durationMins: 15,
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
              label: 'Test FcRn binding solely in pH 7.4 PBS',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'IgG1 does not bind FcRn at pH 7.4; flat line.'
            },
            {
              label: 'Strip FcRn complex in 2 M NaOH before gel',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -22,
              safetyMod: -4,
              outcomeText: 'Strong base denatures both FcRn and antibody.'
            }
          ],
          askChudsHint: 'Richard: IgG1 binds FcRn at endosomal pH 6.0 and releases at blood pH 7.4.',
          antoineHint: 'Antoine: Show pH 6.0 association plus pH 7.4 release to prove intact Fc.'
        },
        dataOutput: {
          type: 'gel',
          label: 'pH 6.0 vs 7.4 FcRn Complex Shift SDS-PAGE',
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
    paperRef: 'Bahou, Spears, Aliev, Maruani, Fernandez, Javaid, Szijj, Baker & Chudasama, Chem. Commun. 2019, 55, 14829; Biomacromolecules 2023, 24, 4646; Chem. Sci. 2024, 15, 4797',
    overview: 'Synthesize twisted N-phenyl PDs, measure GSH kinetics, and cast PEG gels.',
    steps: [
      {
        index: 0,
        id: 'richard_step_1',
        dayHint: 'Mon',
        title: 'Synthesize Soluble Bis-PD Linkers',
        desc: 'Prepare PEG-spaced bis-PD crosslinkers, quench thiols, and purify.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 28,
        sweetSpotMins: 69,
        minigame: 'biotage',
        subTasks: [
          {
            id: 'ric_1_1',
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
            id: 'ric_1_2',
            label: 'Run bis-PD reaction',
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
            id: 'ric_1_3',
            label: 'Quench in bleach bath',
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
            id: 'ric_1_4',
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
          },
          {
            id: 'ric_1_5',
            label: 'Remove solvent on buchi',
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
            id: 'ric_1_6',
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
          }
        ],
        choice: {
          prompt: 'How do you keep 400 mM bis-PD stocks soluble?',
          options: [
            {
              label: 'Hydrophilic PEG spacer, 5% DMSO, bleach bath',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 4,
              outcomeText: 'Clear 400 mM stock with zero thiol odor.'
            },
            {
              label: 'Bridge diBrPD across greasy biphenyl core',
              isOptimal: false,
              yieldMod: -20,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Crashes out instantly in aqueous buffer.'
            },
            {
              label: 'Rinse thiophenol pipettes in hot open sink',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -10,
              safetyMod: -24,
              outcomeText: 'Arylthiol vapor clears Lab 230 immediately.'
            }
          ],
          askChudsHint: 'Marcos: Use a PEG spacer for water solubility and dunk thiols in bleach.',
          antoineHint: 'Antoine: PEG3/PEG4 core solves solubility cleanly up to 400 mM stock.'
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
        desc: 'Prepare CDCl3 NMR tube and quantify residual solvent integrals.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 20,
        sweetSpotMins: 225,
        minigame: null,
        subTasks: [
          {
            id: 'ric_2_1',
            label: 'Get dry solvent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 1',
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
            label: 'Dissolve and prep tube',
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
            durationMins: 20,
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
              purityMod: 14,
              safetyMod: 2,
              outcomeText: 'Exact stoichiometry and peak Richard rigor.'
            },
            {
              label: 'Crop NMR plot to 4.5-8.5 ppm to hide EtOAc',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Vijay demands 0-4.5 ppm and docks Rigor.'
            },
            {
              label: 'Blast oil with a 250 C heat gun in open air',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -22,
              safetyMod: -6,
              outcomeText: 'PEG chars black and HBr eliminates off PD.'
            }
          ],
          askChudsHint: 'Dan: Never crop an NMR for Vijay; disclose trace EtOAc and correct molarity.',
          antoineHint: 'Antoine: Full 0-10 ppm spectrum plus molar purity correction earns respect.'
        },
        dataOutput: {
          type: 'nmr',
          label: 'Bruker 600 MHz 1H/13C NMR (CDCl3): N-Et,N-Ph PD',
          productPeak: 'C4/C5 at 136.8, 134.9 ppm; 0.08 eq EtOAc disclosed',
          metricLabel: '98.9 wt% molar-corrected, rigor verified'
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
              label: 'Quench with excess maleimide and pH 5, desalt',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Frozen 4:1 preference for twisted N-Ph PD.'
            },
            {
              label: 'Leave unquenched vials in 22 C autosampler',
              isOptimal: false,
              yieldMod: -10,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'All timepoints equilibrate while waiting.'
            },
            {
              label: 'Quench kinetic timepoints with 10% bleach',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -24,
              safetyMod: -14,
              outcomeText: 'Bleach shreds Fab and ruins the LC-MS column.'
            }
          ],
          askChudsHint: 'Peter: Cap free thiols with maleimide and drop to pH 5 to freeze kinetics.',
          antoineHint: 'Antoine: Maleimide quench plus pH 5 arrest locks the exact 4:1 kinetic ratio.'
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
          prompt: 'MSH is banned explosive. Which Dha reagent?',
          options: [
            {
              label: 'Bench-stable CDMP plus in situ TCEP at pH 8',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 4,
              outcomeText: 'Safe crystalline Dha gives clean HC-selective.'
            },
            {
              label: 'Synthesize 2 g banned explosive MSH reagent',
              isOptimal: false,
              yieldMod: -18,
              purityMod: -16,
              safetyMod: -32,
              outcomeText: 'Major COSHH alert almost closes Lab 230.'
            },
            {
              label: 'Boil Trastuzumab in 0.5 M Ba(OH)2 at pH 13',
              isOptimal: false,
              yieldMod: -26,
              purityMod: -24,
              safetyMod: -6,
              outcomeText: 'Hydrolyses antibody peptide backbone to smear.'
            }
          ],
          askChudsHint: 'Antoine: Use Cupboard 11 CDMP plus in situ TCEP; never go near MSH.',
          antoineHint: 'Antoine: CDMP is bench-stable, COSHH-cleared, and selective for HC Cys.'
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
        durationMins: 23,
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
            durationMins: 23,
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
              label: '2 s rapid mix at pH 7.4-8.0; cysteamine test',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Sets cleanly in 8 s; cysteamine dissolves gel.'
            },
            {
              label: 'Pipette slowly for 45 s at pH 8.0',
              isOptimal: false,
              yieldMod: -20,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Hydrogel cures solid inside your pipette tip.'
            },
            {
              label: 'Formulate hydrogel in pH 2.5 citrate buffer',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Zero thiolate at pH 2.5; mixture never gels.'
            }
          ],
          askChudsHint: 'Calise: Rapid 2 s mixing only at pH 8; 5DiBr sets in under 10 seconds.',
          antoineHint: 'Antoine: Mix fast at pH 7.4-8.0 and show thiol-triggered 5DiH lysis.'
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
  // 10. MARCOS FERNANDEZ - Thio-PD SMDC Scaffolds & GSH vs HSA Turn-On
  // =========================================================================
  marcos_fernandez: {
    charId: 'marcos_fernandez',
    title: 'Self-Immolative Thio-PD SMDCs & Intracellular GSH Turn-On',
    manuscriptTopic: 'Thio-PD Self-Immolative SMDCs & GSH Turn-On',
    paperRef: 'Fernandez, Shamsabadi & Chudasama, Chem. Commun. 2020, 56, 1125 (DOI: 10.1039/C9CC08744C); Chem. Sci. 2018, 9, 790',
    overview: 'Build thio-PD coumarin SMDCs and prove selective intracellular GSH release.',
    steps: [
      {
        index: 0,
        id: 'marcos_step_1',
        dayHint: 'Mon',
        title: 'Make Cupboard 5 Thio-PD Cores',
        desc: 'Substitute diBrPD with thiols in hood, bleach waste, and check TLC.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 28,
        sweetSpotMins: 69,
        minigame: null,
        subTasks: [
          {
            id: 'mar_1_1',
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
            id: 'mar_1_2',
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
            id: 'mar_1_3',
            label: 'Quench in bleach bath',
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
            id: 'mar_1_4',
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
            id: 'mar_1_5',
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
          prompt: 'Opening Cupboard 5 thiols: what is the rule?',
          options: [
            {
              label: 'Work in hood; dunk tips in bleach bath after',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 4,
              outcomeText: 'Zero odor escapes; six thio-PDs form cleanly.'
            },
            {
              label: 'Weigh uncapped thiophenol on open balance',
              isOptimal: false,
              yieldMod: -6,
              purityMod: -10,
              safetyMod: -28,
              outcomeText: 'Skunk stench floods Lab 230; safety craters.'
            },
            {
              label: 'Pour bleach straight into reaction flask',
              isOptimal: false,
              yieldMod: -26,
              purityMod: -24,
              safetyMod: -4,
              outcomeText: 'Bleach oxidizes all thio-PD product to tar.'
            }
          ],
          askChudsHint: 'Andre: Keep thiols in the Chudasama hood and use the bleach bath after extracting.',
          antoineHint: 'Antoine: Extract inside hood first, then dunk dirty glassware in bleach bath.'
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
            viewOutput: 'tlc',
            requiresJobFromPrev: false
          },
          {
            id: 'mar_2_5',
            label: 'Remove DMSO on buchi',
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
            durationMins: 15,
            sweetSpotMins: 225,
            canOvercook: false,
            triggersChoice: false,
            minigame: 'biotage',
            viewOutput: null,
            requiresJobFromPrev: false
          }
        ],
        choice: {
          prompt: 'How do you couple gamma-folate cleanly?',
          options: [
            {
              label: 'Gamma-folate + PyBOP in DMSO; DCM/MeOH + AcOH',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 12,
              safetyMod: 2,
              outcomeText: 'Clean gamma-SMDC with fluorescence fully caged.'
            },
            {
              label: 'Suspend folic acid in hexanes with DCC',
              isOptimal: false,
              yieldMod: -24,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Folic acid stays sand and sticks to silica.'
            },
            {
              label: 'Reflux folic acid in neat SOCl2 at 80 C',
              isOptimal: false,
              yieldMod: -22,
              purityMod: -24,
              safetyMod: -10,
              outcomeText: 'SOCl2 scrambles alpha/gamma and breaks carbamate.'
            }
          ],
          askChudsHint: 'Faiza: Couple at the gamma position in dry DMSO with PyBOP and 1% AcOH.',
          antoineHint: 'Antoine: Dry DMSO/DCM + PyBOP preserves alpha-COOH; 1% AcOH stops streaking.'
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
        desc: 'Dissolve folate SMDC in DMSO-d6 and run 700 MHz 1H/13C NMR.',
        locationRoom: 'klb_2f',
        stationTypes: ['chem_cupboard'],
        prepRequired: [],
        durationMins: 20,
        sweetSpotMins: 225,
        minigame: null,
        subTasks: [
          {
            id: 'mar_3_1',
            label: 'Get dry DMSO solvent',
            roomId: 'klb_2f',
            stationTypes: ['chem_cupboard'],
            cupboardHint: 'Cupboard 1',
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
            label: 'Dissolve and prep tube',
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
            durationMins: 20,
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
              label: 'DMSO-d6 at 4.5 cm for 1H and DEPT-13C',
              isOptimal: true,
              yieldMod: 8,
              purityMod: 14,
              safetyMod: 2,
              outcomeText: 'Full solubility and clean 154.2 ppm carbamate.'
            },
            {
              label: 'CDCl3 quick 16-scan 1H NMR',
              isOptimal: false,
              yieldMod: -10,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Polar folate SMDC sits insoluble at bottom.'
            },
            {
              label: 'D2O plus 100 mM NaOD strong base',
              isOptimal: false,
              yieldMod: -20,
              purityMod: -20,
              safetyMod: 0,
              outcomeText: 'Base cleaves carbamate to free blue coumarin.'
            }
          ],
          askChudsHint: 'Andre: DMSO-d6 is the only solvent that dissolves folate and coumarin cleanly.',
          antoineHint: 'Antoine: DMSO-d6 at 700 MHz resolves both pteridine and carbamate carbons.'
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
              label: 'Cold MeCN crash, spin 14,000g, then inject',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 14,
              safetyMod: 2,
              outcomeText: '96% intact in HSA; fast cleavage in 5 mM GSH.'
            },
            {
              label: 'Inject undiluted 40 mg/mL HSA on C18 column',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -24,
              safetyMod: -14,
              outcomeText: 'Albumin bricks column; Kersti shuts down LG11.'
            },
            {
              label: 'Skip HSA and test cleavage in 100 mM DTT',
              isOptimal: false,
              yieldMod: 0,
              purityMod: -18,
              safetyMod: 0,
              outcomeText: 'Anything cleaves in DTT; fails blood test.'
            }
          ],
          askChudsHint: 'Richard: Crash HSA aliquots with 3x ice-cold MeCN and spin hard before LC-MS.',
          antoineHint: 'Antoine: Cold MeCN protein crash saves C18 and proves blood HSA stability.'
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
          prompt: 'Which control proves zero off-target HSA?',
          options: [
            {
              label: '5 mM GSH vs 40 mg/mL HSA non-reducing gel',
              isOptimal: true,
              yieldMod: 10,
              purityMod: 14,
              safetyMod: 2,
              outcomeText: '42x GSH turn-on with dark 66.5 kDa HSA lane.'
            },
            {
              label: 'Boil HSA control 15m in reducing BME',
              isOptimal: false,
              yieldMod: -14,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Boiling in BME strips adduct and spoils test.'
            },
            {
              label: 'Spike 5 mM GSH into the blood HSA control',
              isOptimal: false,
              yieldMod: -12,
              purityMod: -22,
              safetyMod: 0,
              outcomeText: 'Blood has 10 uM GSH; 5 mM ruins the contrast.'
            }
          ],
          askChudsHint: 'Calise: Compare 5 mM GSH against 40 mg/mL HSA + 10 uM GSH on a non-reducing gel.',
          antoineHint: 'Antoine: Dark 66.5 kDa HSA lane vs bright 5 mM GSH release makes it watertight.'
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

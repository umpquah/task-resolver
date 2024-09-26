// export const SFW_LEXICON = {
//   commonUnits: ["pound", "pounds"],
//   rewardInstruction: "You may eat [result] of cookies.",
//   penaltyInstruction: "You must destroy [result] of cookies.",
// };

// export const OM_LEXICON = {
//   commonUnits: ["cup", "cups"],
//   rewardInstruction: "You may drink [result] of lemonade.",
//   penaltyInstruction: "You must pour out [result] of lemonade.",
// };

// export const DEFAULT_CONFIG_JSON = ({
//   commonUnits, rewardInstruction, penaltyInstruction 
// }) => {
//   return JSON.stringify({
//     stages: {
//       wait: {
//         settings: {
//           name: "Wait",
//           units: ["minute", "minutes"],
//           range: [1, 3],
//           baseAmount: 1,
//           startPhrase: "Roll",
//           instruction: "Wait [result] now.",
//           usesTimer: true,
//           durationMultiplier: 60,
//           endPhrase: "Continue",
//         },
//         result: "randomInt(...range) * baseAmount",
//         formatResult: "(r) => formatAmountWithUnits(r, ...units)",
//         next: "'decide'"
//       },
//       decide: {
//         settings: {
//           name: "Penalty Or Reward?",
//           rewardChance: 0.4,
//           outcomes: ["Reward", "Penalty"],
//           startPhrase: "Roll",
//           instruction: "You will get a [result]!",
//           usesTimer: false,
//           hasTask: false,
//           endPhrase: "Continue",
//         },
//         result: "randomBinaryChoice(rewardChance, ...outcomes)",
//         formatResult: "(r) => r",
//         next: "(r) => r === 'Reward' ? 'reward' : 'penalty'"
//       },
//       reward: {
//         settings: {
//           name: "Reward",
//           units: commonUnits,
//           range: [1, 3],
//           baseAmount: 4,
//           startPhrase: "Roll",
//           instruction: rewardInstruction,
//           usesTimer: false,
//           hasTask: true,
//           endPhrase: "Continue"
//         },
//         result: "randomInt(...range) * baseAmount",
//         formatResult: "(r) => formatAmountWithUnits(r, ...units)",
//         next: "'wait'"
//       },
//       penalty: { 
//         settings: {
//           name: "Penalty",
//           units: commonUnits,
//           range: [1, 4],
//           baseAmount: 4,
//           startPhrase: "Roll",
//           instruction: penaltyInstruction,
//           usesTimer: false,
//           hasTask: true,
//           endPhrase: "Continue"
//         },
//         result: "randomInt(...range) * baseAmount",
//         formatResult: "(r) => formatAmountWithUnits(r, ...units)",
//         next: "'wait'"
//       }
//     },
//     initialStage: "wait"
//   }, null, 2);
// };

const DEFAULT_SETTINGS = {
  parameters: {
      static: {food: "ice cream"},
      select: {flavor: ["chocolate", "vanilla", "strawberry", "banana", "cherry"]},
  },
  stages: {
      stageA: {
          initial: true, 
          label: "Stage A",
          parameters: {
              static: {num: 17, word: "Tango"},
              range: {size: [1, 10], steps: [2, 7]},
              bool: {hasSprinkles: 0.5},
              select: {time: [3, 5, 7, 9, 12]},
          },
          calculations: {
              dessert: "size + '-inch cake with ' + flavor + ' ' + food",
              dist: "steps * 5",
              topping: "hasSprinkles ? 'with sprinkles' : '(plain)'",
          },
          resolution: {
              announce: "`Agent ${word}-${num}, you get to eat a ${dessert} ${topping}`",
              action: "`Walk ${steps} steps (${dist} feet)`",
              next: "'stageB'",
          },
      },
      stageB: {
          label: "Stage B",
          parameters: {
              static: { answer: 42 },
              select: { prize: ["balloon", "puppy", "gold coin"]},
          },
          calculations: null,
          resolution: {
              announce: "`The answer is ${answer}`",
              action: "`Retrieve your prize, a ${prize}.`",
              next: "'stageC'",
          },
      },
      stageC: {
          label: "Stage C",
          parameters: {
              range: { delay: [1, 3] },
          },
          calculations: {},
          resolution: {
              announce: "`Now wait ${delay * 2} seconds`",
              wait: "delay * 2",
              next: "'stageA'",
          },
      },
  },
};

export const DEFAULT_SETTINGS_JSON = JSON.stringify(DEFAULT_SETTINGS);

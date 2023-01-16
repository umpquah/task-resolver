export const DEFAULT_CONFIG_JSON = JSON.stringify({
  stages: {
    wait: {
      settings: {
        name: "Wait",
        units: ["minute", "minutes"],
        range: [1, 3],
        baseAmount: 1,
        startPhrase: "Roll",
        instruction: "Wait [result] now.",
        usesTimer: true,
        durationMultiplier: 60,
        endPhrase: "Continue",
      },
      result: "randomInt(...range) * baseAmount",
      formatResult: "(r) => formatAmountWithUnits(r, ...units)",
      next: "'decide'"
    },
    decide: {
      settings: {
        name: "Decide",
        rewardChance: 0.4,
        outcomes: ["Reward", "Penalty"],
        startPhrase: "Roll",
        instruction: "You receive a [result]!",
        usesTimer: false,
        hasTask: false,
        endPhrase: "Continue",
      },
      result: "randomBinaryChoice(rewardChance, ...outcomes)",
      formatResult: "(r) => r",
      next: "(r) => r === 'Reward' ? 'reward' : 'penalty'"
    },
    reward: {
      settings: {
        name: "Reward",
        units: ["pound", "pounds"],
        range: [1, 3],
        baseAmount: 4,
        startPhrase: "Roll",
        instruction: "You may eat [result] of cookies.",
        usesTimer: false,
        hasTask: true,
        endPhrase: "Continue"
      },
      result: "randomInt(...range) * baseAmount",
      formatResult: "(r) => formatAmountWithUnits(r, ...units)",
      next: "'wait'"
    },
    penalty: { 
      settings: {
        name: "Penalty",
        units: ["pound", "pounds"],
        range: [2, 4],
        baseAmount: 4,
        startPhrase: "Roll",
        instruction: "You must destroy [result] of cookies.",
        usesTimer: false,
        hasTask: true,
        endPhrase: "Continue"
      },
      result: "randomInt(...range) * baseAmount",
      formatResult: "(r) => formatAmountWithUnits(r, ...units)",
      next: "'wait'"
    }
  },
  initialStage: "wait"
}, null, 2);

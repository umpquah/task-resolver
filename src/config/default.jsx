export const DEFAULT_CONFIG = {
  stages: {
    wait: {
      settings: {
        name: "Wait",
        unit: "minutes",
        range: [3, 10],
        baseAmount: 1,
        startPhrase: "Roll",
        instruction: "Wait [] now.",
        endPhrase: "Continue",
        durationMultiplier: 60,
      },
      result: "randomInt(...rangezz) * baseAmount"
    },
    // decide: {

    // },
    // reward: {
    
    // },
    // penalty: {

    // }
  },
  transitions: {
    wait: (_) => "decide"
  }
};

/*
    "settings": {
        "timeUnitName": "minutes",
        "timeSecondsConversion": 60,
        "timeInstruction": "Wait for [].",
        "unitName": "ounces",
        "rewardInstruction": "Eat [] of lemons.",
        "penaltyInstruction": "Discard [] of lemons.",
        "baseTimeAmount": 1,
        "timeRange": [3, 10],
        "chanceOfReward": 0.4,
        "baseRewardOrPenaltyAmount": 4,
        "rewardRange": [1, 3],
        "penaltyRange": [1, 3]
    },
    "values": {
        "time": "randomInt(...timeRange) * baseTimeAmount",
        "decideIfReward": "randomBool(chanceOfReward)",
        "reward": "randomInt(...rewardRange) * baseRewardOrPenaltyAmount",
        "penalty": "randomInt(...penaltyRange) * baseRewardOrPenaltyAmount",
    }
*/
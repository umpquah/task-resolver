export const DEFAULT_CONFIG = {
  "wait": {

  },
  "decide": {

  },
  
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
};
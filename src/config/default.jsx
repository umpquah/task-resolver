export const DEFAULT_CONFIG = {
    "settings": {
        "unitName": "ounces",
        "baseAmount": 4,
        "timeUnitName": "minutes",
        "baseTimeAmount": 1,
        "chanceReward": 0.3,
        "timeRange": [3, 10],
        "rewardRange": [1, 3],
        "penaltyRange": [1, 3]
    },
    "values": {
        "timeResult": "format(randomInt(...timeRange) * baseTimeAmount, timeUnitName)",
        "rewardResult": "format(randomInt(...rewardRange) * baseAmount, unitName)",
        "penaltyResult": "format(randomInt(...penaltyRange) * baseAmount, unitName)",
    }
};
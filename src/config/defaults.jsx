export const SFW_LEXICON = {
  commonUnits: ["pound", "pounds"],
  rewardInstruction: "You may eat [result] of cookies.",
  penaltyInstruction: "You must destroy [result] of cookies.",
};

export const OM_LEXICON = {
  commonUnits: ["cup", "cups"],
  rewardInstruction: "You may drink [result] of lemonade.",
  penaltyInstruction: "You must pour out [result] of lemonade.",
};

export const DEFAULT_CONFIG_JSON = ({
  commonUnits, rewardInstruction, penaltyInstruction 
}) => {
  return JSON.stringify({
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
          name: "Penalty Or Reward?",
          rewardChance: 0.4,
          outcomes: ["Reward", "Penalty"],
          startPhrase: "Roll",
          instruction: "You will get a [result]!",
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
          units: commonUnits,
          range: [1, 3],
          baseAmount: 4,
          startPhrase: "Roll",
          instruction: rewardInstruction,
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
          units: commonUnits,
          range: [1, 4],
          baseAmount: 4,
          startPhrase: "Roll",
          instruction: penaltyInstruction,
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
};

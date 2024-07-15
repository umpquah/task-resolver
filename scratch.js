
const stages = {
    stageA: {
        initialStage: true, // Error if set for more than one
        label: "Stage A",
        parameters: {
            static: {
                baseAmount: 3,
                units: ["step", "steps"],
                directions: ["left", "right"],
            },
            range: {
                steps: [1, 11],
            },
            select: {
                color: ["red", "blue", "green", "purple"],
            },
            bool: {
                goRight: 0.8,
            },
        },
        calculations: {
            dist: "baseAmount * dist",
        },
        resolution: {
            instruct: "`Go ${dist} ${color} steps ${goRight ? 'right' : 'left'}`",
            next: "goRight ? 'stageB' : 'stageC'",
        }
    },
    stageB: {
        label: "Stage B",
    },
    stageC: {
        label: "Stage C",
    }
};

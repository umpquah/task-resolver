
const stages = {
    stageA: {
        initialStage: true, // Error if set for more than one
        label: "Stage A",
        params: {
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
        results: {
            dist: "baseAmount * dist",
        },
        resolution: {
            instruct: "`Go ${result} ${color} steps ${goRight ? 'right' : 'left'}`",
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

// const stage = new Stage(stages.stageA)

// for (let i = 0; i < 10; i++) {
//     // console.dir(stage.current_params);
//     console.log(stage.result);
//     // console.log();
//     stage.refresh();
// }

// const v = new RangeVariable("v", [3, 8]);

// for (let i = 0; i < 10; i++) {
//     console.log(v.value);
//     v.refresh();
// }

const dozen = new StaticVariable("dozen", 12);
const count = new RangeVariable("count", [1, 10]);

const result = new DerivedVariable("result", "dozen * count", [dozen, count]);
for (let i = 0; i < 10; i++) {
    dozen.refresh();
    count.refresh();
    console.log(result.value);
}
import { ParametersComponent, CalculationsComponent, ResolutionComponent } from "./src/model/config.js";


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


function test() {
    // const s = new StageComponent(
    //     "stageA",
    //     {
    //         initialStage: true, // Error if set for more than one
    //         label: "Stage A",
    //         params: "paramstuff",
    //         results: "....",
    //         resolution: "resolution",
    //     }
    // );
    
    
    const p = new ParametersComponent(
        "stageA",
        {
            static: { count: 11, color: "blue" },
            range: { span: [2, 7] },
            bool: { isFluffy: 0.3 },
            select: { size: [3, 5, 7, 9, 12]}
        }
    )

    const calc = new CalculationsComponent(
        "stageA",
        {
            dessert: "size + '-inch ' + color + ' cake'",
        },
        [p.size, p.color],
    );

    const res = new ResolutionComponent(
        "stageA",
        {
            announce: "Hi",
            next: "bar",
        },
        []
    );
    

    console.dir(p);
    console.log();
    console.dir(calc);
    console.log();
    console.dir(res);
    console.log();
    console.log("calc.dessert.value: " + calc.dessert.value)
}


test();

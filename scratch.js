import StageManager from "./src/model/state.js";

function test() {

    const overallConfig = {
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
                dessert: "size + '-inch cake'",
                dist: "steps * 5",
                topping: "hasSprinkles ? 'with sprinkles' : '(plain)'",
            },
            resolution: {
                announce: "`Agent ${word}-${num}, you get to eat a ${dessert} ${topping}`",
                action: "`Walk ${steps} steps (${dist} feet)`",
                wait: "time * 100",
                next: "'stageB'",
            },
        },
        stageB: {
            label: "Stage B",
            parameters: {
                static: { answer: 42 },
                select: { prize: ["balloon", "puppy", "gold coing"]},
            },
            calculations: null,
            resolution: {
                announce: "`The answer is ${answer}`",
                action: "`You get a ${prize}.`",
                next: "'stageC'",
            },
        },
        stageC: {
            label: "Stage C",
            parameters: {
                range: { delay: [3, 7] },
            },
            calculations: null,
            resolution: {
                announce: "`Now wait ${delay} minutes`",
                wait: "delay * 60",
                next: "'stageA'",
            },
        },
    };

    const state = new StageManager(overallConfig);
    for (let i = 0; i < 6; i++) {
        state.show();
        console.log("=========================")
        console.log();
        state.doStageResolution();
        state.show();
        console.log("=========================")
        console.log();
        state.doStageTransition();
    }


    // for (let i = 0; i < 5; i++) {
    //     const result = state.runStage();
    //     console.log(result);
    //     console.log();
    // }

    // const stageA = new StageConfig("stageA", stageAconfig);
    // console.dir(params);
    // console.log();
    // console.dir(calc);
    // console.log();
    // console.dir(res);
    // console.log();
    // console.log("params.size.value: " + params.size.value)
    // console.log("params.dist.value: " + params.dist.value);
    // console.log("calc.dessert.value: " + calc.dessert.value);
    // console.log("res.announce.value: " + res.announce.value);
    // console.log("res.action.value: " + res.action.value);
    // console.log("params.isFluffy.value: " + params.isFluffy.value);
    // console.log("res.next.value: " + res.next.value);
    
}


test();

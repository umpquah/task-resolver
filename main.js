import StageManager from "./src/model/stage-manager.js";

function test() {

    const line = () => {
        console.log("=======================");
    }

    const overallConfig = {
        stageA: {
            // initial: true, 
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
            initial: true,
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

    const manager = new StageManager(overallConfig);
    manager.showCurrentStage();
    line();
    manager.resolveCurrentStage();
    line();
    manager.showCurrentStage();

    

    // for (let i = 0; i < 6; i++) {
    //     state.show();
    //     console.log("=========================")
    //     console.log();
    //     state.doStageResolution();
    //     state.show();
    //     console.log("=========================")
    //     console.log();
    //     state.doStageTransition();
    // }


}


test();

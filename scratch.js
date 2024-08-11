import GameState from "./src/model/game-state.js";

function test() {

    const gameConfig = {
        stageA: {
            initialStage: true, 
            label: "Stage A",
            parameters: {
                static: { num: 17, word: "Tango" },
                range: { size: [1, 10], steps: [2, 7] },
                bool: { hasSprinkles: 0.5 },
                select: { time: [3, 5, 7, 9, 12]}
            },
            calculations: {
                dessert: "size + '-inch cake'",
                dist: "steps * 3",
                topping: "hasSprinkles ? 'with sprinkles' : '(plain)'",
            },
            resolution: {
                announce: "`Agent ${word}-${num}, you get to eat a ${dessert} ${topping}`",
                action: "`Walk ${steps} steps (${dist} feet)`",
                wait: "time * 100",
                next: "'stageB'",
            }
        },
        stageB: {
            label: "Stage B",
            parameters: {
                static: { answer: 42 },
            },
            calculations: null,
            resolution: {
                announce: "`The answer is ${answer}`",
                next: "'stageA'"
            }
        }
    };

    const state = new GameState(gameConfig);
    for (let i = 0; i < 5; i++) {
        const result = state.runStage();
        console.log(result);
        console.log();
    }

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

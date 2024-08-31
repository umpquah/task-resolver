import StageManager from "./src/model/stage-manager.js";
import { StageStatus } from "./src/model/stage.js";

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
                next: "'stageB'",
            },
        },
        stageB: {
            label: "Stage B",
            parameters: {
                static: { answer: 42 },
                select: { prize: ["balloon", "puppy", "gold coin"]},
            },
            calculations: null,
            resolution: {
                announce: "`The answer is ${answer}`",
                action: "`Retrieve your prize, a ${prize}.`",
                next: "'stageC'",
            },
        },
        stageC: {
            label: "Stage C",
            parameters: {
                range: { delay: [1, 3] },
            },
            calculations: null,
            resolution: {
                announce: "`Now wait ${delay * 2} seconds`",
                wait: "delay * 2",
                next: "'stageA'",
            },
        },
    };

    const manager = new StageManager(overallConfig);
    for (let i = 0; i < 20; i++) {
        manager.log();
        const { status } = manager.currentState;
        if (status == StageStatus.INITIAL) {
            manager.resolve();
        } else if (status == StageStatus.ACTING) {
            manager.userActionDone();
        } else if (status == StageStatus.WAITING) {
            manager.advanceTimer();
        } else if (status == StageStatus.FINISHED) {
            manager.transitionStage();
        }
    }
}

test();

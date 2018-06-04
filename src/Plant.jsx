import _ from 'lodash';
import { generateCommand, getBranchEnd } from './PlantService.jsx';

class Plant {
    constructor(productionSpecs) {
        this.productionSpecs = productionSpecs;
        this.command = null;

        // all points are calculated in cartesian coordinate system
        // need to be translated to the screen coordinate system on drawing
        this.branches = [];
        this.leafPos = [];
        this.state_stack = [];
        this.currentBranchIndex = 0;
        this.leafPercentage = productionSpecs.leafPercentage;
        this.leafPercentage = productionSpecs.leafPercentage;

        this.init();
    }

    init() {
        this.command = generateCommand(this.productionSpecs);
        this.generateBranches();
    }


    generateBranches() {
        const { branchLength } = this.productionSpecs;

        let currentState = {
            position: { x: 0, y: 0 },
            angle: 90.0,
            level: 0.0,
        };
        let maxLevel = 0;
        let branchIndex = 0;

        for (let i = 0; i < this.command.length; i += 1) {
            const currentCommand = this.command[i];
            const { angle } = currentState;
            const start = currentState.position; // Start position of a branch

            if (currentCommand === 'F' || currentCommand === 'X') {
                const end = getBranchEnd(start, angle, branchLength);
                this.branches.push({
                    start,
                    end,
                });
                currentState.position = end; // Move the current state to the end position

                branchIndex += 1;
                currentState.level += 1;

                if (currentState.level > maxLevel) { maxLevel = currentState.level; }
            }

            if (currentCommand === '+') {
                currentState.angle += this.productionSpecs.delta;
            }

            if (currentCommand === '-') {
                currentState.angle -= this.productionSpecs.delta;
            }

            if (currentCommand === '[') {
                // !Pitfall: currentState passed by reference
                // this.state_stack.push(_.cloneDeep(currentState));
                this.state_stack.push(_.clone(currentState));
            }

            if (currentCommand === ']') {
                _.assign(this.branches[branchIndex - 1], {
                    isLeafBranch: true,
                    occupied: false,
                });

                currentState = this.state_stack.pop();
            }
        }
    }
}

export default Plant;

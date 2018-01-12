import _ from 'lodash'
import * as d3 from 'd3';

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
        this.leafPercentage = productionSpecs.leafPercentage

		this.init();
	}

	init() {
		this.command = generateCommand(this.productionSpecs);
		this.generateBranches();
    }
    

    generateBranches(){
        var branchLength = this.productionSpecs.branchLength;
        
        var currentState = {
        position: {x: 0, y: 0}, 
        angle: 90.0, 
        level: 0.0 
        }; 
        var maxLevel = 0;
        var branchIndex = 0; 

        for (var i = 0; i < this.command.length; i++) {
            var currentCommand = this.command[i];
            var angle = currentState.angle;
            var start = currentState.position; // Start position of a branch

            if(currentCommand  === 'F'|| currentCommand  === 'X'){
                var end = getBranchEnd(start, angle, branchLength);
                this.branches.push({
                start: start,
                end: end  
                });
                currentState.position = end; // Move the current state to the end position

                branchIndex ++;
                currentState.level ++;

                if(currentState.level > maxLevel)
                    maxLevel = currentState.level;
            }
            else if(currentCommand === '+'){
                currentState.angle += this.productionSpecs.delta;
            }
            else if(currentCommand === '-'){
                currentState.angle -= this.productionSpecs.delta;
            }
            else if(currentCommand === '['){
                // !Pitfall: currentState passed by reference
                // this.state_stack.push(_.cloneDeep(currentState));
                this.state_stack.push(_.clone(currentState));
            }
            else if(currentCommand === ']'){
                _.assign(this.branches[branchIndex-1], {
                    isLeafBranch: true,
                    occupied: false 
            });
                
                currentState = this.state_stack.pop(); 
                
            }
        }
    }
}

function generateCommand(productionSpecs){
    var command = productionSpecs.initiator;
    for(var i = 0; i < productionSpecs.n; i++){
        for(var j = 0;j < productionSpecs.productionRules.length; j++){
            var p = productionSpecs.productionRules[j];
            var parts = p.split('->');
            var right = parts.pop();
            var left = parts.pop();
            var reg = new RegExp(left, "g");
            command = command.replace(reg, right);
        }
    }

    return command;
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function getBranchEnd(start, angle, branchLength) {
  var theta = toRadians(angle);
  return {
    x: start.x + Math.cos(theta) * branchLength,
    y: start.y + Math.sin(theta) * branchLength
  } 
}

export default Plant

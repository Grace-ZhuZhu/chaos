import _ from 'lodash'
import * as d3 from 'd3';

class Plant {
	constructor(productionSpecs) {
		this.productionSpecs = productionSpecs;
		this.command = null;

		this.branches = []; // calculate in cartesian coordinate system
		this.leafPos = [];
		this.state_stack = [];
		this.currentBranchIndex = 0;
        this.leafPercentage = productionSpecs.leafPercentage;
        this.leafPercentage = productionSpecs.leafPercentage

		this.init();
	}

	init() {
		d3.xml("./cherry-flower.svg",
			(xml) => {
				this.leafSvg = xml.getElementsByTagName("svg")[0];
        });
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
                /*
                // Leaf: a rectangle to be mapped with a texture 
                glm::vec4 point1 = glm::vec4( -0.5,  0.0, 0.0, 1.0);
                glm::vec4 point2 = glm::vec4(0.5,  0.0, 0.0, 1.0);
                glm::vec4 point3 = glm::vec4(0.5,  1.0, 0.0, 1.0);
                glm::vec4 point4 = glm::vec4( -0.5,  1.0, 0.0, 1.0);

                // glm::mat4 transform = glm::scale(glm::mat4(1), glm::vec3(branchLength/2.0, branchLength/2.0, 1.0)) * glm::rotate(glm::mat4(1), angle, glm::vec3(0.0, 0.0, -1)) * glm::translate(glm::mat4(1), start);
                glm::mat4 transform = glm::scale(glm::mat4(1), glm::vec3(productionSpecs.leafLength, productionSpecs.leafLength, 1.0)) * glm::rotate(glm::mat4(1), angle, glm::vec3(0.0, 0.0, -1));
                point1 = point1 * transform;  glm::vec3 leafPoint1 = start + glm::vec3(point1.x, point1.y, point1.z);
                point2 = point2 * transform;  glm::vec3 leafPoint2 = start + glm::vec3(point2.x, point2.y, point2.z);
                point3 = point3 * transform;  glm::vec3 leafPoint3 = start + glm::vec3(point3.x, point3.y, point3.z);
                point4 = point4 * transform;  glm::vec3 leafPoint4 = start + glm::vec3(point4.x, point4.y, point4.z);

                // Push back the current level for each vertex (altogether 6) of the leaf rectangle
                float currentLevel = currentState.level;
                this.leaves.push_back(leafPoint1);
                this.leaf_texcoords.push_back(glm::vec2(0.0, 1.0)); this.leaf_levels.push_back(currentLevel);
                this.leaves.push_back(leafPoint2);
                this.leaf_texcoords.push_back(glm::vec2(1.0, 1.0)); this.leaf_levels.push_back(currentLevel);
                this.leaves.push_back(leafPoint3);
                this.leaf_texcoords.push_back(glm::vec2(1.0, 0.0)); this.leaf_levels.push_back(currentLevel);
                this.leaves.push_back(leafPoint3);
                this.leaf_texcoords.push_back(glm::vec2(1.0, 0.0)); this.leaf_levels.push_back(currentLevel);
                this.leaves.push_back(leafPoint4);
                this.leaf_texcoords.push_back(glm::vec2(0.0, 0.0)); this.leaf_levels.push_back(currentLevel);
                this.leaves.push_back(leafPoint1);
                this.leaf_texcoords.push_back(glm::vec2(0.0, 1.0)); this.leaf_levels.push_back(currentLevel);
                */

                _.assign(this.branches[branchIndex-1], {
                    isLeafBranch: true,
                    occupied: false 
            });
                
                currentState = this.state_stack.pop(); 
                
            }
        }

        /* LATER
        // Convert the levels of each leaf to the range of [0,1] 
        for (vector<float>::iterator it = this.leaf_levels.begin(); it != this.leaf_levels.end(); ++it){
            it = (it)/maxLevel; 
        }
        */
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

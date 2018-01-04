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
        this.flowerPercentage = productionSpecs.flowerPercentage;
        this.totalFlowers = productionSpecs.totalFlowers

		this.init();
	}

	init() {
		d3.xml("./simple-flower.svg",
			(xml) => {
				this.flowerSvg = xml.getElementsByTagName("svg")[0];
        });
		this.command = generateCommand(this.productionSpecs);
		generateBranches(this);
	}

	draw(ctx, origin) {
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.lineCap = "round";
		for (var i = 0; i < this.branches.length; i++) {
		this.drawNextBranch(ctx, origin);
		}
	}

	drawIsDone() {
		return this.currentBranchIndex >= this.branches.length;
	}

	drawNextBranch(ctx, origin) {
		if (this.currentBranchIndex < this.branches.length) {
			var branch = this.branches[this.currentBranchIndex]; // Current i
			ctx.moveTo(branch.start.x + origin.x, origin.y - branch.start.y);
			ctx.lineTo(branch.end.x + origin.x, origin.y - branch.end.y);
			ctx.stroke();
			this.currentBranchIndex ++;
		}
	}

	// To Remove
	getNewFlowers(origin/*, n*/) {
		var positions = this.getLeafPositions(origin/*, n*/);
		return _.map(positions, function(d) {
			return {
			pos: d,
			life: 0
			};
		})
	}

	// To Remove
	getLeafPositions(origin/*, n*/) {
		var currentBranchIndex = this.currentBranchIndex;
		var availableLeafPos = _.filter(this.leafPos, function(d) { return d.branchIndex <= currentBranchIndex});
		// n = n > availableLeafPos.length ? availableLeafPos.length : n;
		var n = Math.round(this.flowerPercentage * availableLeafPos.length);

		var randomLeafPos = _.times(n, function() { return _.sample(availableLeafPos)});
		randomLeafPos = _.map(randomLeafPos, function(d) {
		return {
			x: d.position.x + origin.x,
			y: origin.y - d.position.y
		};
		});
		return _.uniq(randomLeafPos);
	}

	getFlowerPositions() {
		return this.leafPos;
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

function generateBranches(plant){
      var branchLength = plant.productionSpecs.branchLength;
      
      var currentState = {
        position: {x: 0, y: 0}, 
        angle: 90.0, 
        level: 0.0 
      }; 
      var maxLevel = 0;
      var branchIndex = 0; 

      for (var i = 0; i < plant.command.length; i++) {
          var currentCommand = plant.command[i];
          var angle = currentState.angle;
          var start = currentState.position; // Start position of a branch

          if(currentCommand  === 'F'|| currentCommand  === 'X'){
              var end = getBranchEnd(start, angle, branchLength);
              plant.branches.push({
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
              currentState.angle += plant.productionSpecs.delta;
          }
          else if(currentCommand === '-'){
              currentState.angle -= plant.productionSpecs.delta;
          }
          else if(currentCommand === '['){
              // !Pitfall: currentState passed by reference
              // plant.state_stack.push(_.cloneDeep(currentState));
              plant.state_stack.push(_.clone(currentState));
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
              plant.leaves.push_back(leafPoint1);
              plant.leaf_texcoords.push_back(glm::vec2(0.0, 1.0)); plant.leaf_levels.push_back(currentLevel);
              plant.leaves.push_back(leafPoint2);
              plant.leaf_texcoords.push_back(glm::vec2(1.0, 1.0)); plant.leaf_levels.push_back(currentLevel);
              plant.leaves.push_back(leafPoint3);
              plant.leaf_texcoords.push_back(glm::vec2(1.0, 0.0)); plant.leaf_levels.push_back(currentLevel);
              plant.leaves.push_back(leafPoint3);
              plant.leaf_texcoords.push_back(glm::vec2(1.0, 0.0)); plant.leaf_levels.push_back(currentLevel);
              plant.leaves.push_back(leafPoint4);
              plant.leaf_texcoords.push_back(glm::vec2(0.0, 0.0)); plant.leaf_levels.push_back(currentLevel);
              plant.leaves.push_back(leafPoint1);
              plant.leaf_texcoords.push_back(glm::vec2(0.0, 1.0)); plant.leaf_levels.push_back(currentLevel);
              */

              _.assign(plant.branches[branchIndex-1], {
                  isLeafBranch: true,
                  hasLeaf: false 
            });
              
              currentState = plant.state_stack.pop(); 
              
          }
      }

      /* LATER
      // Convert the levels of each leaf to the range of [0,1] 
      for (vector<float>::iterator it = plant.leaf_levels.begin(); it != plant.leaf_levels.end(); ++it){
          it = (it)/maxLevel; 
      }
      */
}

export default Plant

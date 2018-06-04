export function generateCommand(productionSpecs) {
    let command = productionSpecs.initiator;
    for (let i = 0; i < productionSpecs.n; i += 1) {
        for (let j = 0; j < productionSpecs.productionRules.length; j += 1) {
            const p = productionSpecs.productionRules[j];
            const parts = p.split('->');
            const right = parts.pop();
            const left = parts.pop();
            const reg = new RegExp(left, 'g');
            command = command.replace(reg, right);
        }
    }

    return command;
}

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

export function getBranchEnd(start, angle, branchLength) {
    const theta = toRadians(angle);
    return {
        x: start.x + (Math.cos(theta) * branchLength),
        y: start.y + (Math.sin(theta) * branchLength),
    };
}

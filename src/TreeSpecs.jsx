export const TreeSpec1 = {
    leafPath: '/data/img/cherry-flower.svg',
    leafColor: 'pink',
    leafPercentage: 0.2,
    leafLife: 10000,
    leafFalling: true,
    branchLength: 6,
    n: 5,
    delta: 20.0,
    initiator: 'X',
    productionRules: [
        'X->F[+X]F[-X]+X',
        'F->FF',
    ],
};

export const TreeSpec2 = {
    leafPath: '/data/img/cherry-flower.svg',
    leafColor: '#ff748a',
    leafPercentage: 0.5,
    leafLife: 10000,
    leafFalling: true,
    branchLength: 18,
    n: 3,
    delta: 22.5,
    initiator: 'X',
    productionRules: [
        'X->F-[[X]+X]+F[+FX]-X',
        'F->FF',
    ],
};

export const TreeSpec3 = {
    leafPath: '/data/img/flower0.svg',
    leafColor: '#ffc03a',
    leafPercentage: 0.7,
    leafLife: 5000,
    leafFalling: false,
    branchLength: 24,
    n: 3,
    delta: 25.7,
    initiator: 'F',
    productionRules: [
        'F->F[+F]F[-F]F',
    ],
};

export const TreeSpec4 = {
    leafPath: '/data/img/flower.svg',
    leafColor: '#ffc6a4',
    leafPercentage: 0.7,
    leafLife: 5000,
    leafFalling: false,
    branchLength: 48,
    n: 3,
    delta: 20,
    initiator: 'F',
    productionRules: [
        'F->F[+F]F[-F][F]',
    ],
};

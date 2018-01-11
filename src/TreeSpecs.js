export const TreeSpec1 = {
  leafPath: "./cherry-flower.svg",
  leafColor: "pink",
  leafPercentage: .2,
  branchLength: 6,
  n: 5,
  delta: 20.0,
  initiator: "X",
  productionRules: [
    "X->F[+X]F[-X]+X",
    "F->FF"
  ]
};

export const TreeSpec2 = {
  leafPath: "./cherry-flower.svg",
  leafColor: "#ff748a",
  leafPercentage: .5,
  branchLength: 18,
  n: 3,
  delta: 22.5,
  initiator: "X",
  productionRules: [
    "X->F-[[X]+X]+F[+FX]-X",
    "F->FF"
  ]
};

export const TreeSpec3 = {
  leafPath: "./flower0.svg",
  leafColor: "#ffc03a",
  leafPercentage: .7,
  branchLength: 24,
  n: 3,
  delta: 25.7,
  initiator: "F",
  productionRules: [
    "F->F[+F]F[-F]F"
  ]
}

export const TreeSpec4 = {
  leafPath: "./flower1.svg",
  leafColor: "#ffd5c0",
  leafPercentage: .7,
  branchLength: 48,
  n: 3,
  delta: 20,
  initiator: "F",
  productionRules: [
    "F->F[+F]F[-F][F]"
  ]
};
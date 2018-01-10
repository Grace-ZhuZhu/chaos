export const TreeSpec1 = {
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
  leafPercentage: .7,
  branchLength: 48,
  n: 3,
  delta: 20,
  initiator: "F",
  productionRules: [
    "F->F[+F]F[-F][F]"
  ]
};
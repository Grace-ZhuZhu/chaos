export const TreeSpec2 = {
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

export const TreeSpec1 = {
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

/*
// Plant 1:
	// Define the production rules for plants
	PR_plant1.branchLength = 0.015f;
	PR_plant1.leafLength = 0.07f;
	PR_plant1.n = 5;
	PR_plant1.delta = 20.0f;
	

	// Plant 2:
	// Define the production rules for plants
	PR_plant2.branchLength = 0.06f;
	PR_plant2.leafLength = 0.07f;
	PR_plant2.n = 3;
	PR_plant2.delta = 25.7f;
	PR_plant2.initiator = "F";
	PR_plant2.productionRules.push_back("F->F[+F]F[-F]F");

	// Plant 3:
	// Define the production rules for plants
	PR_plant3.branchLength = 0.045f;
	PR_plant3.leafLength = 0.07f;
	PR_plant3.n = 3;
	PR_plant3.delta = 22.5f;
	PR_plant3.initiator = "X";
	PR_plant3.productionRules.push_back("X->F-[[X]+X]+F[+FX]-X");
  PR_plant3.productionRules.push_back("F->FF");

	// Plant 4:
	// Define the production rules for plants
	PR_plant4.branchLength = 0.12f;
	PR_plant4.leafLength = 0.07f;
	PR_plant4.n = 3;
	PR_plant4.delta = 20.0f;
	PR_plant4.initiator = "F";
	PR_plant4.productionRules.push_back("F->F[+F]F[-F][F]");
  */
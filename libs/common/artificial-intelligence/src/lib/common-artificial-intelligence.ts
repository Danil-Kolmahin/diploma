import { asyncify } from '@diploma-v2/common/utils-common';
import {
  COMPARING_METHODS,
  ComparisonProjectResult,
  DEFAULT_OPTIONS,
  makeGeneticCycleOptionT,
  RobotsChromosome,
} from '@diploma-v2/common/constants-common';

const makeRandomWithin = (max = 1, min = 0) => Math.ceil(Math.random() * (max - min - 1)) + min;

export const calculateProjectsComparingPercent = (
  chromosome: RobotsChromosome, comparisonResults: ComparisonProjectResult,
): number => {
  let comparisonPercent = 0;
  for (const [key, value] of Object.entries(comparisonResults)) {
    if (Object.values<string>(COMPARING_METHODS).includes(key))
      comparisonPercent += chromosome[key] * value;
  }
  return comparisonPercent;
};

const getDelta = (chromosome, comparisonResults, rightResult: number, abs = true) => {
  const delta = rightResult - calculateProjectsComparingPercent(chromosome, comparisonResults);
  return abs ? Math.abs(delta) : delta;
};

export const makeGeneticCycle = asyncify((
  chromosomes: RobotsChromosome[],
  calculationArgs,
  rightResult: number,
  options: makeGeneticCycleOptionT = DEFAULT_OPTIONS,
): RobotsChromosome[] => {
  const deltaValues = chromosomes.map(chrome => getDelta(chrome, calculationArgs, rightResult));

  // checking if any delta === 0
  const findResult = chromosomes.find((_, i) => deltaValues[i] === 0);
  if (findResult) return chromosomes;

  if (chromosomes.length === 1) return makeMutations(chromosomes, {
    maxMutationsValue: options.maxMutationsValue,
    minMutationsValue: options.minMutationsValue,
    minGeneValue: options.minGeneValue,
    maxGeneValue: options.maxGeneValue,
  });

  // calculating the chances of becoming a parent
  const parentChances = deltaValues.map(delta => 1 / delta);
  const deltasSum = parentChances.reduce((acc, cur) => acc + cur);
  parentChances.forEach((delta, i) => parentChances[i] = delta / deltasSum);
  parentChances.slice(0, parentChances.length - 1).forEach((_, i) => parentChances[i + 1] += parentChances[i]);

  // generating chances of becoming a parent using the roulette method
  const rouletteValues = chromosomes.map(() => Math.random());
  const parents = rouletteValues.map(
    (chance) => chromosomes[parentChances.findIndex(
      (_, i) => parentChances[i] >= chance && ((i > 0 ? parentChances[i - 1] : 0) < chance),
    )],
  );

  // crossbreeding
  let children = [];
  parents.forEach((_, i) => {
    if (i % 2 === 0) {
      // children[i] = parents[i].slice(0, options.crossoverLine).concat(parents[i + 1].slice(options.crossoverLine));
      // children[i + 1] = parents[i + 1].slice(0, options.crossoverLine).concat(parents[i].slice(options.crossoverLine));
    }
  });

  // mutations
  children = makeMutations(chromosomes, {
    maxMutationsValue: options.maxMutationsValue,
    minMutationsValue: options.minMutationsValue,
    minGeneValue: options.minGeneValue,
    maxGeneValue: options.maxGeneValue,
  });

  return children;
});

const makeMutations = (chromosomes: RobotsChromosome[], options = {
  maxMutationsValue: 0,
  minMutationsValue: 0,
  minGeneValue: undefined,
  maxGeneValue: undefined,
}): RobotsChromosome[] => {
  const children = [];
  children.forEach((_, i) => {
      if (Math.random() >= 0.5) {
        const geneNumber = makeRandomWithin(children[i].length);
        const addingValue = makeRandomWithin(options.maxMutationsValue, options.minMutationsValue);
        if (children[i][geneNumber] + addingValue >= options.minGeneValue &&
          children[i][geneNumber] + addingValue <= options.maxGeneValue) children[i][geneNumber] += addingValue;
      }
    },
  );
  return children;
};

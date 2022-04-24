import { asyncify, sum } from '@diploma-v2/common/utils-common';

const makeRandomWithin = (max = 1, min = 0) => Math.ceil(Math.random() * (max - min - 1)) + min;

export const BASE_CHROMOSOME: Chromosome = {
  'FTC': 1,
  'DLD': 1,
};

const DEFAULT_OPTIONS = {
  minGeneValue: 1,
  maxGeneValue: 5,
  crossoverLine: 2,
  minMutationsValue: -1,
  maxMutationsValue: 1,
};

type makeGeneticCycleOptionT = typeof DEFAULT_OPTIONS;

export const calculateProjectsComparingPercent = (chromosome, comparisonResults): number => {
  let comparisonPercent = 0;
  // console.log(JSON.stringify(comparisonResults, null, 2));
  for (const [, comparisonResultValue] of Object.entries(comparisonResults)) {
    const projectsFilesLengthsSum = (comparisonResultValue as any).filesLengths;
    for (const [filesKey, filesValue] of Object.entries(comparisonResultValue)) {
      if (filesKey === 'filesLengths') continue;
      const filesLengthsSum = filesValue.filesLengths.reduce(sum);
      const filesLengthsAverageSum = filesLengthsSum / filesValue.filesLengths.length;
      comparisonPercent += (
        chromosome.FTC * filesValue.FTC / filesLengthsAverageSum +
        chromosome.DLD * filesLengthsAverageSum / filesValue.DLD
      ) * (filesLengthsSum / projectsFilesLengthsSum);
    }
  }
  return comparisonPercent;
};

const getDelta = (chromosome, comparisonResults, rightResult: number, abs = true) => {
  const delta = rightResult - calculateProjectsComparingPercent(chromosome, comparisonResults);
  return abs ? Math.abs(delta) : delta;
};

type Chromosome = any;

export const makeGeneticCycle = asyncify((
  chromosomes: Chromosome[],
  calculationArgs,
  rightResult: number,
  options: makeGeneticCycleOptionT = DEFAULT_OPTIONS,
): Chromosome[] => {
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
      children[i] = parents[i].slice(0, options.crossoverLine).concat(parents[i + 1].slice(options.crossoverLine));
      children[i + 1] = parents[i + 1].slice(0, options.crossoverLine).concat(parents[i].slice(options.crossoverLine));
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

const makeMutations = (chromosomes: Chromosome[], options = {
  maxMutationsValue: 0,
  minMutationsValue: 0,
  minGeneValue: undefined,
  maxGeneValue: undefined,
}): Chromosome[] => {
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

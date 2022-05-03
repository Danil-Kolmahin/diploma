import {
  BASE_CHROMOSOME,
  COMPARING_METHODS,
  ComparisonProjectResult,
  DEFAULT_OPTIONS,
  makeGeneticCycleOptionT,
  RobotsChromosome,
} from '@diploma-v2/common/constants-common';

const makeRandomWithin = (max = 1, min = 0) => Math.random() * (max - min) + min;
const makeRandomIntWithin = (max = 1, min = 0) => Math.ceil(Math.random() * (max - min - 1)) + min;

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

export const makeGeneticCycle = (
  chromosomes: RobotsChromosome[],
  calculationArgs,
  rightResult: number,
  options: makeGeneticCycleOptionT = DEFAULT_OPTIONS,
): RobotsChromosome => {
  const deltaValues = chromosomes.map(chrome => getDelta(chrome, calculationArgs, rightResult));

  // checking if any delta === 0
  const findResult = chromosomes.find((_, i) => deltaValues[i] === 0);
  if (findResult) return findResult;

  if (chromosomes.length === 1) return makeMutations(chromosomes)[0];

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
  let children: RobotsChromosome[] = parents.reduce((acc, cur, i) => {
    if (i === 0) return acc.concat({ ...cur });
    const accLen = acc.length;
    const lastElem = { ...acc[accLen - 1] };
    const newLastElem = {};
    let count = 0;
    for (const key of Object.keys(BASE_CHROMOSOME)) {
      if (count < options.crossoverLine) {
        acc[accLen - 1][key] = cur[key];
        newLastElem[key] = lastElem[key];
      } else {
        acc[accLen - 1][key] = lastElem[key];
        newLastElem[key] = cur[key];
      }
      count++;
    }
    return acc.concat(newLastElem);
  }, []);

  // mutations
  children = makeMutations(children);

  return children.sort((a, b) =>
    getDelta(b, calculationArgs, rightResult) -
    getDelta(a, calculationArgs, rightResult),
  )[0];
};

const makeMutations = (chromosomes: RobotsChromosome[], options = {
  maxMutationsValue: DEFAULT_OPTIONS.maxMutationsValue, minMutationsValue: DEFAULT_OPTIONS.minMutationsValue,
  minGeneValue: DEFAULT_OPTIONS.minGeneValue,
  maxGeneValue: DEFAULT_OPTIONS.maxGeneValue,
  mutationChance: DEFAULT_OPTIONS.mutationChance,
}): RobotsChromosome[] => {
  chromosomes.forEach((_, i) => {
      if (Math.random() >= options.mutationChance) {
        const geneNumber = makeRandomIntWithin(Object.keys(chromosomes[i]).length);
        const addingValue = makeRandomWithin(options.maxMutationsValue, options.minMutationsValue);
        const geneKey = Object.keys(chromosomes[i])[geneNumber];
        if (chromosomes[i][geneKey] + addingValue >= options.minGeneValue &&
          chromosomes[i][geneKey] + addingValue <= options.maxGeneValue) chromosomes[i][geneKey] += addingValue;
      }
    },
  );
  return chromosomes;
};

import React, { useState } from 'react';
import { Button, Center, Slider } from '@mantine/core';
import { gql, useMutation } from '@apollo/client';

const GROW_ROBOT = gql`
  mutation (
    $comparisonId: String!
    $firstProjectId: String!
    $secondProjectId: String!
    $rightPercent: Float!
  ) {
    growRobot (
      comparisonId: $comparisonId
      firstProjectId: $firstProjectId
      secondProjectId: $secondProjectId
      rightPercent: $rightPercent
    ) {
      id
    }
  }
`;

export const HistoryElemTable = (props: {
  data: any,
}) => {
  const table = [];
  for (let i = 0; i < props.data.findComparisonById.projects.length - 1; i++) {
    const curProject = props.data.findComparisonById.projects[i];
    for (let j = i + 1; j < props.data.findComparisonById.projects.length; j++) {
      const projectToCompare = props.data.findComparisonById.projects[j];
      table.push(props.data.findComparisonById
        .results[`${curProject.id}|${projectToCompare.id}`].percent);
    }
  }
  const [values, setValues] = useState<number[]>(table);
  const [endValues, setEndValues] = useState<number[]>(table);
  const [growRandom] = useMutation(GROW_ROBOT);

  return <>
    {(() => {
      const table = [];
      for (let i = 0; i < props.data.findComparisonById.projects.length - 1; i++) {
        const curProject = props.data.findComparisonById.projects[i];
        for (let j = i + 1; j < props.data.findComparisonById.projects.length; j++) {
          const projectToCompare = props.data.findComparisonById.projects[j];
          table.push({
            firstProjectName: curProject.name,
            firstProjectId: curProject.id,
            secondProjectName: projectToCompare.name,
            secondProjectId: projectToCompare.id,
          });
        }
      }
      return table;
    })().map((project: any, index: number) => (
      <tr key={index}>
        <td>{project.firstProjectName}</td>
        <td>{project.secondProjectName}</td>
        <td>
          <Slider
            value={values[index] * 100}
            onChange={(newValue) => setValues((prev) => {
              prev[index] = newValue / 100;
              return prev;
            })}
            onChangeEnd={(newValue) => setEndValues((prev) => {
              prev[index] = newValue / 100;
              return prev;
            })}
          />
        </td>
        <td><Center>
          <Button
            onClick={() => growRandom({
              variables: {
                comparisonId: props.data.findComparisonById.id,
                rightPercent: endValues[index],
                firstProjectId: project.firstProjectId,
                secondProjectId: project.secondProjectId,
              },
            })}
          >
            Set right result
          </Button>
        </Center></td>
      </tr>))}
  </>;
};

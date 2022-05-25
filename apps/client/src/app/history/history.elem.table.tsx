import React from 'react';
import { Button, Center, Slider } from '@mantine/core';
import { gql, useMutation } from '@apollo/client';
import { formList, useForm } from '@mantine/form';

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
      table.push(
        props.data.findComparisonById.results ?
          props.data.findComparisonById
            .results[`${curProject.id}|${projectToCompare.id}`].percent :
          0, // bad...
      );
    }
  }
  const [growRandom] = useMutation(GROW_ROBOT);
  const form = useForm({
    initialValues: {
      values: formList<number>(table),
      endValues: formList<number>(table),
    },
  });

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
            value={form.values.values[index] * 100}
            onChange={(newValue) => {
              form.setValues((prev) => {
                prev.values[index] = newValue / 100;
                return prev;
              });
              form.validate();
            }}
            onChangeEnd={(newValue) => {
              form.setValues((prev) => {
                prev.endValues[index] = newValue / 100;
                return prev;
              });
              form.validate();
            }}
          />
        </td>
        <td><Center>
          <Button
            onClick={() => growRandom({
              variables: {
                comparisonId: props.data.findComparisonById.id,
                rightPercent: form.values.endValues[index],
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

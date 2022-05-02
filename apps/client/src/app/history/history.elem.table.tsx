import React, { useState } from 'react';
import { Button, Center, Slider } from '@mantine/core';

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

  return <>
    {(() => {
      const table = [];
      for (let i = 0; i < props.data.findComparisonById.projects.length - 1; i++) {
        const curProject = props.data.findComparisonById.projects[i];
        for (let j = i + 1; j < props.data.findComparisonById.projects.length; j++) {
          const projectToCompare = props.data.findComparisonById.projects[j];
          table.push({
            firstProjectName: curProject.name,
            secondProjectName: projectToCompare.name,
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
          onClick={() => console.log({ endValues })}
        >
          Set right result
        </Button>
      </Center></td>
    </tr>))}
  </>
};

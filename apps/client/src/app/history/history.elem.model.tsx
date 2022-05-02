import React, { useState } from 'react';
import { Button, Slider } from '@mantine/core';
import { useModals } from '@mantine/modals';

export const HistoryElemModel = (props: {
  startValue: number,
  resFunc: (resValue: number) => unknown,
}) => {
  const modals = useModals();
  const [value, setValue] = useState(props.startValue * 100);
  const [endValue, setEndValue] = useState(props.startValue * 100);

  return <>
    <Slider value={value} onChange={setValue} onChangeEnd={setEndValue} />
    <Button fullWidth onClick={() => {
      modals.closeAll();
      props.resFunc(endValue / 100);
    }}>
      Submit
    </Button>
  </>;
};

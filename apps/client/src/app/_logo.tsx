import React from 'react';
import { ColorScheme } from '@mantine/core';
import { APP_THEMES } from '@diploma-v2/common/constants-common';

export function Logo({ colorScheme }: { colorScheme: ColorScheme }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='160' height='40'>
      <g>
        <title>Layer 1</title>
        <text fontWeight='bold' xmlSpace='preserve' textAnchor='start' fontFamily="'Roboto Mono'" fontSize='24'
              id='svg_2' y='29' x='59.28906' strokeWidth='0'
              fill={colorScheme === APP_THEMES.DARK ? '#fff' : '#000'}>Client
        </text>
        <path id='svg_3'
              d='m15.0124,0l-15.0124,20.00186l15.01379,19.99814l5.46086,-7.27308l-9.55559,-12.72507l9.5536,-12.72508l-5.46027,-7.27679l0,0zm21.9718,0l-5.4569,7.27494l9.55364,12.72506l-9.55364,12.72351l5.4569,7.27304l15.01579,-19.99997l-15.01579,-19.99658z'
              stroke={colorScheme === APP_THEMES.DARK ? '#fff' : '#000'} fill='none' />
      </g>
    </svg>
  );
}

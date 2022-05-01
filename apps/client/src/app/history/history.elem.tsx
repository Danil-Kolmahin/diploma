import {
  AppShell,
  Center,
  Group,
  Header,
  Loader,
  Navbar,
  Paper,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { OopsPage } from '../common/OopsPage';
import { useParams } from 'react-router-dom';
import { Prism } from '@mantine/prism';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import customEvents from 'highcharts-custom-events';
import NetworkGraph from 'highcharts/modules/networkgraph';

customEvents(Highcharts);
NetworkGraph(Highcharts);

const FIND_COMPARISON_BY_ID = gql`
  query (
    $id: String!
  ) {
    findComparisonById (
      id: $id
    ) {
      results
      createdAt
      doneAt
      doneOn
      fileTypes
      id
      projects {
        id
        name
        creatorName
        files {
          filename
          byteLength
        }
      }
    }
  }
`;

type Point = { similarity: string, from: string, to: string, weight: number };

export const HistoryElem = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const { id } = useParams();
  const { loading, error, data } = useQuery(FIND_COMPARISON_BY_ID, {
    variables: { id },
    pollInterval: 250,
  });
  const [optionsData, setOptionsData] = useState<any>({
    chart: { type: 'networkgraph', height: '60%' },
    plotOptions: {
      networkgraph: {
        layoutAlgorithm: {
          enableSimulation: true,
          linkLength: 100
        }
      }
    },
    series: [{
      dataLabels: {
        enabled: true,
        linkTextPath: {
          attributes: {
            dy: 12
          }
        },
        linkFormat: '{point.similarity}',
        textPath: {
          enabled: true,
          attributes: {
            dy: 14,
            startOffset: '45%',
            textLength: 80
          }
        },
        format: '{point.name}'
      },
      marker: {
        radius: 35
      },
      link: {
        width: 5,
      },
      events: {
        click: (...all: any) => {
          console.log({ all });
        },
      },
    }],
    title: { text: null },
    credits: { enabled: false },
  });

  useEffect(() => {
    if (!data?.findComparisonById?.results) return;
    const parsedData: Point[] = [];
    for (const [key, value] of Object.entries(data.findComparisonById.results)) {
      const [fromId, toId] = key.split('|');
      parsedData.push({
        from: data.findComparisonById.projects.find(
          (p: { id: string }) => p.id === fromId,
        ).name,
        to: data.findComparisonById.projects.find(
          (p: { id: string }) => p.id === toId,
        ).name,
        weight: (value as { percent: number }).percent,
        similarity: ((value as { percent: number }).percent * 100).toFixed(2) + '%',
      });
    }
    setOptionsData({
      ...optionsData,
      series: {
        ...optionsData.series,
        data: parsedData,
      },
    });
  }, [data]);

  return <AppShell
    fixed
    navbar={
      <Navbar width={{ base: 250 }} p='xs'>
        <MainLinks />
      </Navbar>
    }
    header={
      <Header height={60}>
        <Group sx={{ height: '100%' }} px={20} position='apart'>
          <Logo colorScheme={theme.colorScheme} />
          <User parsedCookie={parsedCookie} />
        </Group>
      </Header>
    }
  >

    {loading ? <Loader /> : error ? <OopsPage /> : <Paper
      shadow='xs'
      p='md'
    >
      <Center><Title order={3}>{data.findComparisonById.id}</Title></Center>

      <HighchartsReact
        highcharts={Highcharts}
        options={optionsData}
      />

      <Prism
        language='json'
        withLineNumbers
        noCopy
      >
        {JSON.stringify(
          data.findComparisonById,
          (k, v) => k === '__typename' || k === 'id' ? undefined : v,
          2,
        )}
      </Prism>
    </Paper>
    }

  </AppShell>;
};

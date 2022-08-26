import { Box, SimpleGrid, Text, theme, useColorModeValue } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { withSSRAuth } from '../utils/withSSRAuth'
import { ApexOptions } from 'apexcharts'
import { Layout } from "../components/Layout";

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
})

const options: ApexOptions = {
    chart: {
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
        foreColor: theme.colors.gray[500],
    },
    grid: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    tooltip: {
        enabled: false,
    },
    xaxis: {
        type: 'datetime',
        axisBorder: {
            color: theme.colors.gray[600],
        },
        axisTicks: {
            color: theme.colors.gray[600],
        },
        categories: [
            '2021-03-18T00:00:00.000Z',
            '2021-03-19T00:00:00.000Z',
            '2021-03-20T00:00:00.000Z',
            '2021-03-21T00:00:00.000Z',
            '2021-03-22T00:00:00.000Z',
            '2021-03-23T00:00:00.000Z',
            '2021-03-24T00:00:00.000Z',
        ],
    },
    fill: {
        opacity: 0.3,
        type: 'gradient',
        gradient: {
            shade: 'dark',
            opacityFrom: 0.7,
            opacityTo: 0.3,
        },
    },
}

const series = [{ name: 'series1', data: [31, 120, 10, 28, 61, 18, 109] }]

export default function Dashboard() {
    const colorMode = useColorModeValue("gray.200", "gray.900");
    return (
        <Layout title="Dashboard">
            <SimpleGrid
                flex="1"
                gap="4"
                minChildWidth="320px"
                alignItems="flex-start"
                px={6}
            >
                <Box p={['6', '8']} bg={colorMode} borderRadius={8} pb="4">
                    <Text fontSize="lg" mb="4">
                        Taxa de acessos
                    </Text>
                    <Chart
                        options={options}
                        series={series}
                        type="area"
                        height={160}
                    />
                </Box>
                <Box p={['6', '8']} bg={colorMode} borderRadius={8} pb="4">
                    <Text fontSize="lg" mb="4">
                        Taxa de abertura
                    </Text>
                    <Chart
                        options={options}
                        series={series}
                        type="area"
                        height={160}
                    />
                </Box>
            </SimpleGrid>
        </Layout>
    );
}

export const getServerSideProps = withSSRAuth(
    async (ctx) => {
        return {
            props: {},
        }
    },
    {
        roles: ['administrator', 'user'],
    }
)
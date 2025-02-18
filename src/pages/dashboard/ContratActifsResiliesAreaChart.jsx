import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
    chart: {
        height: 450,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    }
};

// ==============================|| CONTRATS ACTIFS & RÉSILIÉS AREA CHART ||============================== //

export default function ContratActifsResilies({ slot, contratsActifs, contratsResilies }) {
    const theme = useTheme();

    const { secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: ['#FF0000', '#808080'], // Rouge pour actifs, gris pour résiliés
            xaxis: {
                categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jui', 'Aoû', 'Sept', 'Oct', 'Nov', 'Dec'],

                labels: {
                    style: {
                        colors: new Array(12).fill(secondary)
                    }
                },
                axisBorder: {
                    show: true,
                    color: line
                },
                tickAmount: slot === 'month' ? 11 : 7
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            }
        }));
    }, [secondary, line, theme, slot]);

    const [series, setSeries] = useState([
        {
            name: 'Contrats actifs',
            data: contratsActifs || []
        },
        {
            name: 'Contrats résiliés',
            data: contratsResilies || []
        }
    ]);

    useEffect(() => {
        setSeries([
            {
                name: 'Contrats actifs',
                data: contratsActifs || []
            },
            {
                name: 'Contrats résiliés',
                data: contratsResilies || []
            }
        ]);
    }, [contratsActifs, contratsResilies, slot]);

    return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

ContratActifsResilies.propTypes = {
    slot: PropTypes.string,
    contratsActifs: PropTypes.array.isRequired,
    contratsResilies: PropTypes.array.isRequired
};

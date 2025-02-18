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

// ==============================|| NOMBRE DES SINISTRES AREA CHART ||============================== //

export default function NombreSinistresChart({ slot }) {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: ['#FF0000'], // Rouge pour la courbe des sinistres
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
      name: 'Nombre des sinistres',
      data: [0, 86, 28, 115, 48, 210, 136]
    }
  ]);

  useEffect(() => {
    setSeries([
      {
        name: 'Nombre des sinistres',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
      }
    ]);
  }, [slot]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

NombreSinistresChart.propTypes = { slot: PropTypes.string };

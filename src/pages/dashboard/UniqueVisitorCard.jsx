import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import MainCard from 'components/MainCard';

// ==============================|| NOMBRE DES SINISTRES AREA CHART ||============================== //

function NombreSinistresChart({ slot, data }) {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState({
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
  });

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

  return <ReactApexChart options={options} series={[{ name: 'Nombre des sinistres', data }]} type="area" height={450} />;
}

NombreSinistresChart.propTypes = {
  slot: PropTypes.string,
  data: PropTypes.array.isRequired
};

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function SinistreCard({sinistresData}) {

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Représentation graphique de la fréquence des sinistres</Typography>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <NombreSinistresChart slot="month" data={sinistresData} />
        </Box>
      </MainCard>
    </>
  );
}

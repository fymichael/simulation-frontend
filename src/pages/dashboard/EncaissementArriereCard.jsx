import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 8,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jui', 'Aoû', 'Sept', 'Oct', 'Nov', 'Dec']
  },
  yaxis: {
    title: {
      text: '$ (thousands)'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val) {
        return `${val} Ar`;
      }
    }
  },
  legend: {
    show: false
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false
        }
      }
    }
  ]
};

// ==============================|| COMBINED - SALES CHART CARD ||============================== //

export default function EncaissementArriereCard({ encaissementsData, arrieresData }) {
  const theme = useTheme();

  const [legend, setLegend] = useState({
    encaissements: true,
    arrieres: true
  });

  const { encaissements, arrieres } = legend;

  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [series, setSeries] = useState([]);

  const handleLegendChange = (event) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    // Initialize series based on props
    const initialSeries = [
      {
        name: 'Encaissements',
        data: encaissementsData
      },
      {
        name: 'Arriérés',
        data: arrieresData
      }
    ];

    if (encaissements && arrieres) {
      setSeries(initialSeries);
    } else if (encaissements) {
      setSeries([
        {
          name: 'Encaissements',
          data: encaissementsData
        }
      ]);
    } else if (arrieres) {
      setSeries([
        {
          name: 'Arriérés',
          data: arrieresData
        }
      ]);
    } else {
      setSeries([]);
    }
  }, [encaissements, arrieres, encaissementsData, arrieresData]);

  const [options, setOptions] = useState(columnChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: !(encaissements && arrieres) && arrieres ? ['#808080'] : ['#FF0000', '#808080'],
      xaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      grid: {
        borderColor: theme.palette.divider
      },
      plotOptions: {
        bar: {
          columnWidth: xsDown ? '60%' : '30%'
        }
      }
    }));
  }, [theme, encaissements, arrieres, xsDown]);

  return (
    <MainCard sx={{ mt: 2 }} content={false}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Comparaison entre les arrières et les encaissements reçus</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <FormControl component="fieldset">
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox color="error" checked={encaissements} onChange={handleLegendChange} name="encaissements" />}
                  label="Encaissements"
                />
                <FormControlLabel
                  control={<Checkbox color='secondary' checked={arrieres} onChange={handleLegendChange} name="arrieres" />}
                  label="Arriérés"
                />
              </FormGroup>
            </FormControl>
          </Stack>
        </Grid>
      </Grid>
      <Box id="chart" sx={{ bgcolor: 'transparent', p: 2.5, pb: 0 }}>
        <ReactApexChart options={options} series={series} type="bar" height={360} />
      </Box>
    </MainCard>
  );
}
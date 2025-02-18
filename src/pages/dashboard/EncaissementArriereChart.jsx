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

// project import
import MainCard from 'components/MainCard';

// third-party
import ReactApexChart from 'react-apexcharts';
import { gray } from '@ant-design/colors';

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
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
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

const initialSeries = [
  {
    name: 'Encaissements',
    data: [180, 90, 135, 114, 120, 145]
  },
  {
    name: 'Arriérés',
    data: [120, 45, 78, 150, 168, 99]
  }
];

// ==============================|| SALES COLUMN CHART ||============================== //

export default function EncaissementArriereChart() {
  const theme = useTheme();

  const [legend, setLegend] = useState({
    encaissements: true,
    arrieres: true
  });

  const { encaissements, arrieres } = legend;

  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [series, setSeries] = useState(initialSeries);
  const [options, setOptions] = useState(columnChartOptions);

  const handleLegendChange = (event) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    if (encaissements && arrieres) {
      setSeries(initialSeries);
    } else if (encaissements) {
      setSeries([
        {
          name: 'Encaissements',
          data: [180, 90, 135, 114, 120, 145]
        }
      ]);
    } else if (arrieres) {
      setSeries([
        {
          name: 'Arrièrés',
          data: [120, 45, 78, 150, 168, 99]
        }
      ]);
    } else {
      setSeries([]);
    }
  }, [encaissements, arrieres]);

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
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <FormControl component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox color="error" checked={encaissements} onChange={handleLegendChange} name="encaissements" />}
                label="Encaissements"
              />
              <FormControlLabel 
                control={<Checkbox color='secondary' checked={arrieres} onChange={handleLegendChange} name="arrieres" />} 
                label="Arrièrés" 
              />
            </FormGroup>
          </FormControl>
        </Stack>
        <Box id="chart" sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={options} series={series} type="bar" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
}

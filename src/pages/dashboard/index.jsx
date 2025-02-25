// material-ui
import Avatar from '@mui/material/Avatar';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CommuteIcon from '@mui/icons-material/Commute';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import EncaissementArriereCard from './EncaissementArriereCard';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import { FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
// assets
import ContratActifsResilies from './ContratActifsResiliesAreaChart';
import { useState } from 'react';
import SendToMobileIcon from '@mui/icons-material/SendToMobile';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import axios from 'axios';
import SinistreCard from './UniqueVisitorCard';
import { Chart, PieSeries, Title, Legend } from "@devexpress/dx-react-chart-material-ui";
import { Animation } from '@devexpress/dx-react-chart';
import OrderTable from './OrdersTable';
import ReportAreaChart from './ReportAreaChart';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

function formatNombre(number) {
  return number?.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DashboardDefault() {

  const [selectedYear, setSelectedYear] = useState();
  const [globalStat, setGlobalStat] = useState();

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    handleSubmit(event.target.value);
  };

  const handleSubmit = async (year) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/globaleStat/${year}`
      );
      console.log('response ', response.data);
      setGlobalStat(response.data);
    } catch (error) {
      console.error('Erreur lors de la submit:', error);
    }
  };

  const data = [
    { argument: "Contrats actifs", value: globalStat?.nombre_contrat_actifs[0] || 0 },
    { argument: "Contrat résilié", value: globalStat?.nombre_contrat_resilier[0] || 0 },
  ];


  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Statistiques globales</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Année</InputLabel>
          <Select value={selectedYear} onChange={handleYearChange}>
            <MenuItem value={2022}>2022</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* row 1 */}
      {globalStat ? (
        <>
          <Grid item xs={12} sx={{ mb: -2.25 }}>
            <Typography variant="h5">Statistiques globales</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total des encaissements" count={formatNombre(globalStat.montant_encaissement) + " Ar"} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total des arrièrés" count={formatNombre(globalStat.montant_arriere) + " Ar"} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total des contrats actifs" count={globalStat.contrat_actifs} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total des contrats résiliés" count={globalStat.contrat_resilier} />
          </Grid>

          <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
          {/* row 2 */}
          <Grid item xs={12} md={7} lg={8}>
            <EncaissementArriereCard arrieresData={globalStat.arriere_data} encaissementsData={globalStat.encaissement_data} />
          </Grid>
        
          <Grid item xs={12} md={5} lg={4}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Statistiques globales des agences</Typography>
              </Grid>
              <Grid item />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              <List
                component="nav"
                sx={{
                  px: 0,
                  py: 0,
                  '& .MuiListItemButton-root': {
                    py: 1.5,
                    '& .MuiAvatar-root': avatarSX,
                    '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                  }
                }}
              >
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                      <AssignmentTurnedInIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1">Agence avec le plus de contrats actifs</Typography>} secondary={globalStat.agence_actifs.label} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.agence_actifs.valeurs}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                      < UnpublishedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1">Agence avec le plus de contrats résiliés</Typography>} secondary={globalStat.agence_resilier.label} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.agence_resilier.valeurs}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                      <CreditScoreIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1">Agence avec le plus d'encaissements reçus</Typography>} secondary={globalStat.agence_encaissement.label} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {formatNombre(globalStat.agence_encaissement.valeurs)} Ar
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                      <CreditCardOffIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1">Agence avec le plus d'arrièrés attendus</Typography>} secondary={globalStat.agence_arriere.label} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {formatNombre(globalStat.agence_arriere.valeurs)} Ar
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </List>
            </MainCard>
          </Grid>

          {/* row 4 */}
          <Grid item xs={12} md={7} lg={8}>
            <SinistreCard sinistresData={globalStat.sinistre_repartition} />
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Répartitions des sinistres reçus</Typography>
              </Grid>
              <Grid item />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              <List
                component="nav"
                sx={{
                  px: 0,
                  py: 0,
                  '& .MuiListItemButton-root': {
                    py: 1.5,
                    '& .MuiAvatar-root': avatarSX,
                    '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                  }
                }}
              >
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                      <AccessibilityIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1"> Accident corporel </Typography>} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.accident_corporel}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                      <CarCrashIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1"> Accident matériel </Typography>} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.accident_materiel}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                      <CommuteIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1"> Accident matériel et corporel </Typography>} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.accident_materiel_corporel}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </List>
            </MainCard>
            <Grid container sx={{ mt: 3 }} alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Etats des sinistres</Typography>
              </Grid>
              <Grid item />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>

              <List
                component="nav"
                sx={{
                  px: 0,
                  py: 0,
                  '& .MuiListItemButton-root': {
                    py: 1.5,
                    '& .MuiAvatar-root': avatarSX,
                    '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                  }
                }}
              >
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                      <SendToMobileIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1"> Sinistre déclaré </Typography>} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.sinistre_declare}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                      <VerifiedUserIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1"> Sinistre approuvé </Typography>} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.sinistre_approuve}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                      <DoNotDisturbOnIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1"> Sinistre non approuvé </Typography>} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.sinistre_non_approuve}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </List>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <Typography variant="h5">Comparaison des contrats actifs et résiliés</Typography>
            <MainCard sx={{ mt: 2 }}>
              <Grid item>
                <Grid item>
                  <ContratActifsResilies contratsActifs={globalStat.repartition_contrat_actifs} contratsResilies={globalStat.repartition_contrat_resilier} />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={7} lg={4}>
            <Typography variant="h5">Statistique globale des répartitions des contrats</Typography>
            <MainCard sx={{ mt: 2 }}>
              <List
                component="nav"
                sx={{
                  px: 0,
                  py: 0,
                  '& .MuiListItemButton-root': {
                    py: 1.5,
                    '& .MuiAvatar-root': avatarSX,
                    '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                  }
                }}
              >
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                      <VerifiedUserIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1"> Contrats actifs </Typography>} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.nombre_contrat_actifs[0]}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                      <DoNotDisturbOnIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1"> Contrats résiliés </Typography>} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                        {globalStat.nombre_contrat_resilier[0]}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </List>
            </MainCard>
            <MainCard sx={{ mt: 2, width: '340px', height: '300px' }}>
              <Chart data={data} width={300} height={300} >
                <PieSeries valueField="value" argumentField="argument" />
                <Legend position="bottom" />
                <Title text="Répartition des contrats" />
                <Animation />
              </Chart>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5"> Suivis des paiements </Typography>
              </Grid>
              <Grid item />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              <OrderTable data={globalStat?.suivi_paiement} />
            </MainCard>
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Report des commissions</Typography>
              </Grid>
              <Grid item />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
              <List
                component="nav"
                sx={{
                  px: 0,
                  py: 0,
                  '& .MuiListItemButton-root': {
                    py: 1.5,
                    '& .MuiAvatar-root': avatarSX,
                    '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                  }
                }}
              >
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                      <MonetizationOnIcon color='primary'/>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1">Employé avec le plus de commission obtenus</Typography>} secondary={globalStat?.employe_commission?.utilisateur?.nom+' '+globalStat?.employe_commission?.utilisateur?.prenom+' - '+globalStat?.employe_commission?.utilisateur?.departement?.nom} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                       {formatNombre(globalStat?.employe_commission?.montant)} Ar
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton divider>
                  <ListItemAvatar>
                    <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                      <WorkspacePremiumIcon color='success' />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle1">Employé avec le plus d'affaires nouvelles apportées</Typography>} secondary={globalStat?.employe_affaire?.utilisateur?.nom+' '+globalStat?.employe_affaire?.utilisateur?.prenom+' - '+globalStat?.employe_affaire?.utilisateur?.departement?.nom} />
                  <ListItemSecondaryAction>
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle1" noWrap>
                       {globalStat?.employe_affaire?.montant}
                      </Typography>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </List>
              <ReportAreaChart data={globalStat?.data_agence_commission} xAxisLabels={globalStat?.xAxisLabel}/>
            </MainCard>
          </Grid>
        </>
      ) : (
        <Typography></Typography>
      )
      }
    </Grid >
  );
}
import { useRef, useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { decodeToken } from 'utils/authTokens';
import axios from 'axios';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("L'entrée doit être un objet Date valide.");
  }

  const moisFrancais = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];

  const jour = date.getDate();
  const mois = moisFrancais[date.getMonth()];
  const annee = date.getFullYear();

  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${jour} ${mois} ${annee} à ${heures}h${minutes}`;
}

export default function Notification() {
  const navigate = useNavigate();
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const [demandeClients, setDemandeClients] = useState([]);
  const [read, setRead] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = 'grey.100';

  const fetchDemandesClients = async () => {
    setIsLoading(true);
    try {
      const decodedToken = decodeToken();
      const prefixe_agence = decodedToken?.prefixe_agence;
      if(decodedToken?.role === 1) {
        const response = await axios.get(`http://localhost:3030/demandes-notif-admin`);
        setDemandeClients(response.data);
        setRead(response.data.length);
      }
      else {
        const response = await axios.get(`http://localhost:3030/demandes-notif/${prefixe_agence}`);
        setDemandeClients(response.data);
        setRead(response.data.length);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchDemandesClients();
   // 15 minutes
    const intervalId = setInterval(fetchDemandesClients, 50000);

    return () => clearInterval(intervalId);
  }, []); 

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <>
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }}
          aria-label="open profile"
          ref={anchorRef}
          aria-controls={open ? 'profile-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Badge badgeContent={read} color="primary"> {/* Affiche le nombre de notifications non lues */}
            <BellOutlined />
          </Badge>
        </IconButton>
        <Popper
          placement={matchesXs ? 'bottom' : 'bottom-end'}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
        >
          {({ TransitionProps }) => (
            <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard
                    title="Notifications"
                    elevation={0}
                    border={false}
                    content={false}
                    secondary={
                      <>
                        {demandeClients.length > 0 && (
                          <Tooltip title="Marquer comme lus">
                            <IconButton color="success" size="small" onClick={() => {
                              setRead(0);
                            }}>
                              <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    }
                  >
                    {isLoading ? (
                      <Typography sx={{ p: 2, textAlign: 'center' }}><CircularProgress /></Typography>
                    ) : (
                      <>
                        {demandeClients.length > 0 ? (
                          <List
                            component="nav"
                            sx={{
                              p: 0,
                              '& .MuiListItemButton-root': {
                                py: 0.5,
                                '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                                '& .MuiAvatar-root': avatarSX,
                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                              }
                            }}
                            key={demandeClients?.idDemandeClient}
                          >
                            {demandeClients.map((demande) => (
                              <>
                                <ListItemButton>
                                  <ListItemAvatar>
                                    <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                                      <MessageOutlined />
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <Typography variant="h6">
                                        <Typography component="span" variant="subtitle1">
                                          {demande?.titre}
                                        </Typography>{' '}
                                      </Typography>
                                    }
                                    secondary={demande?.objet}
                                  />
                                  <ListItemSecondaryAction>
                                    <Typography variant="caption" noWrap>
                                      {formatDate(new Date(demande?.dateEnvoie))}
                                    </Typography>
                                  </ListItemSecondaryAction>
                                </ListItemButton>
                                <Divider />
                                <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                                  <ListItemText
                                    primary={
                                      <Typography variant="h6" color="primary" onClick={() => navigate('/nyhavana/demandes')}>
                                        Voir tout
                                      </Typography>
                                    }
                                  />
                                </ListItemButton>
                              </>
                            ))}
                          </List>
                        ) : (
                          <Typography sx={{ p: 2, textAlign: 'center' }}>Aucune nouvelle notification</Typography>
                        )}
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            </Transitions>
          )}
        </Popper>
      </>
    </Box >
  );
}
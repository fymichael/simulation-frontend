import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { decodeToken } from "../../../../../utils/authTokens";


// assets
import { LogoutOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('reloadKey');
    navigate('/');
  };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    password1: '',
    password2: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log('Form Data:', formData);
    if(formData.password1 === formData.password2) {
      try {
        const token = decodeToken();
        const idUser = token.sub;
        const pass = formData.password1;
        console.log(pass);
        await axios.put(`http://localhost:3030/utilisateur/password/${ idUser }`, { password : pass} );
      } catch (error) {
        console.error('Erreur :', error);
      }
    }
    else {
      alert('Votre mot de passe ne se corresponds pas');
    }
    handleClose();
  };

  return (
    <div><Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span">
          Modifier votre mot de passe
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Nouveau mot de passe"
            name="password1"
            type='password'
            variant="outlined"
            fullWidth
            value={formData.password1}
            onChange={handleChange} />
          <TextField
            label="Confirmer votre nouveau mot de passe"
            name="password2"
            type='password'
            variant="outlined"
            fullWidth
            value={formData.password2}
            onChange={handleChange} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <ListItemButton selected={selectedIndex === 0}         
        onClick={() => {
          handleListItemClick(0);
          handleOpen();
        }}>
          <ListItemIcon>
            <SettingOutlined />
          </ListItemIcon>
          <ListItemText primary="Modifier le mot de passe" />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 1} onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary="Se deconnecter" />
        </ListItemButton>
      </List></div>
  );
}

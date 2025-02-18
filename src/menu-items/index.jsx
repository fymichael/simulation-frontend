// project import
import dashboard from './dashboard';
import pages from './Page';
import contrat from './Contrat';
import contratAgence from './ContratAgence';
import Client from './Client';
import simulation from './Simulation';
import Sinistre from './Sinistre';
import arriere from './Arriere';
import demandes from './DemandeClient';
import { decodeToken } from "../utils/authTokens";

const token = decodeToken();

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: []
};

if (token) {
  console.log(token);
  
  
  if (!sessionStorage.getItem('reloadKey')) {
    sessionStorage.setItem('reloadKey', 'true');
    window.location.reload();
  }

  if (token.role === 1) {
    menuItems.items.push(dashboard);
    menuItems.items.push(simulation);
    menuItems.items.push(pages);
    menuItems.items.push(contrat);
    menuItems.items.push(Client);
    menuItems.items.push(Sinistre);
    menuItems.items.push(arriere);
    menuItems.items.push(demandes);
  } else if (token.role === 2) {
    menuItems.items.push(contratAgence);
    menuItems.items.push(simulation);
    menuItems.items.push(demandes);
  }
}

export default menuItems;

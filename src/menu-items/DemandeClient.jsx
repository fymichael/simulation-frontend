// assets
import SendToMobileIcon from '@mui/icons-material/SendToMobile';

// icons
const icons = {
  SendToMobileIcon
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const demandes = {
  id: 'demandes',
  title: 'demandes',
  type: 'group',
  children: [
    {
      id: "demandes",
      title: 'Gestions des demandes',
      type: 'item',
      url: '/nyhavana/demandes',
      icon: icons.SendToMobileIcon,
    }
  ]
};

export default demandes;

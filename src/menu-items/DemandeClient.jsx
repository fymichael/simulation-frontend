// assets
import { UserOutlined} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined
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
      icon: icons.UserOutlined,
    }
  ]
};

export default demandes;

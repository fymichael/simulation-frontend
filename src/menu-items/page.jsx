// assets
import { UserOutlined, HomeOutlined, AlertOutlined } from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  HomeOutlined,
  AlertOutlined
};



// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'configuration',
  title: 'Configuration',
  type: 'group',
  children: [
    {
      id: "user",
      title: 'Gestions des utilisateurs',
      type: 'item',
      url: '/nyhavana/users',
      icon: icons.UserOutlined,
    },
    {
      id: "departement",
      title: 'Gestions des départements',
      type: 'item',
      url: '/nyhavana/departements',
      icon: icons.HomeOutlined,
    }
  ]
};

export default pages;

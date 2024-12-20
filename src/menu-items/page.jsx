// assets
import { UserOutlined} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'configuration',
  title: 'Configuration',
  type: 'group',
  children: [
    {
      id: 'user',
      title: 'Gestions des utilisateurs',
      type: 'item',
      url: '/nyhavana/users',
      icon: icons.UserOutlined,
    }
  ]
};

export default pages;

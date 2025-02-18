// assets
import { UserOutlined} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const client = {
  id: 'client',
  title: 'client',
  type: 'group',
  children: [
    {
      id: "client",
      title: 'Gestions des clients',
      type: 'item',
      url: '/nyhavana/clients',
      icon: icons.UserOutlined,
    }
  ]
};

export default client;

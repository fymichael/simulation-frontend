// assets
import { BookOutlined} from '@ant-design/icons';

// icons
const icons = {
  BookOutlined,
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const contrat = {
  id: 'contrat',
  title: 'Contrat',
  type: 'group',
  children: [
    {
      id: "contrat",
      title: 'Gestions des contrats',
      type: 'item',
      url: '/nyhavana/contrat-agence',
      icon: icons.BookOutlined,
    }
  ]
};

export default contrat;

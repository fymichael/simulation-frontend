// assets
import { MoneyCollectOutlined} from '@ant-design/icons';

// icons
const icons = {
  MoneyCollectOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const arriere = {
  id: 'arriere',
  title: 'arriere',
  type: 'group',
  children: [
    {
      id: "arriere",
      title: 'Comparaison des etats de productions',
      type: 'item',
      url: '/nyhavana/arrieres',
      icon: icons.MoneyCollectOutlined,
    }
  ]
};

export default arriere;

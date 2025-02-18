// assets
import { PlaySquareOutlined } from '@ant-design/icons';

// icons
const icons = {
  PlaySquareOutlined,
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const simulation = {
  id: 'simulation',
  title: 'simulation',
  type: 'group',
  children: [
    {
      id: "simulation",
      title: 'Simulation',
      type: 'item',
      url: '/nyhavana/simulation',
      icon: icons.PlaySquareOutlined,
    }
  ]
};

export default simulation;

// assets
import { UserOutlined } from '@ant-design/icons';
import { AlertOutlined } from '@ant-design/icons';

// icons
const icons = {
    UserOutlined,
    AlertOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const sinistre = {
    id: 'sinistre',
    title: 'sinistre',
    type: 'group',
    children: [
        {
            id: "sinistre",
            title: 'Gestions des sinistres',
            type: 'item',
            url: '/nyhavana/sinistre',
            icon: icons.AlertOutlined,
        }
    ]
};

export default sinistre;

import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { NumericFormat } from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

// Définition des colonnes
const headCells = [
  { id: 'numero_police', align: 'left', label: 'Numéro de Police' },
  { id: 'montant', align: 'right', label: 'Montant' },
  { id: 'date', align: 'left', label: 'Date' },
  { id: 'status', align: 'left', label: 'Statut' }
];

// Composant pour l'en-tête du tableau
function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Composant pour afficher le statut avec une couleur
function OrderStatus({ status }) {
  let color, title;
  switch (status) {
    case 1:
      color = 'default';
      title = 'Paiement attendus';
      break;
    case 3:
      color = 'error';
      title = 'Paiement annulé';
      break;
    case 5:
      color = 'success';
      title = 'Encaissement validé';
      break;
    case 0:
      color = 'error';
      title = 'Encaissement annulé';
      break;
    case 10:
      color = 'error';
      title = 'Remboursement client';
      break;
    case 15:
      color = 'success';
      title = 'Recouvrement client';
      break;
    default:
      color = 'primary';
      title = 'Inconnu';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}
function formatDate(date) {
  const moisFrancais = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];
  const jour = date.getDate();
  const mois = moisFrancais[date.getMonth()];
  const annee = date.getFullYear();
  return `${jour} ${mois} ${annee}`;
}
// Composant principal qui prend les données en props
export default function OrderTable({ data }) {
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table>
          <OrderTableHead />
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <Link color="secondary">{row.numero_police}</Link>
                </TableCell>
                <TableCell align="right">
                  <NumericFormat value={row.montant} displayType="text" thousandSeparator=" " suffix=" Ar" />
                </TableCell>
                <TableCell>{formatDate(new Date(row.date))}</TableCell>
                <TableCell>
                  <OrderStatus status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// Définition des types des props pour sécuriser l'utilisation du composant
OrderTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      numero_police: PropTypes.string.isRequired,
      montant: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.number.isRequired
    })
  ).isRequired
};

OrderStatus.propTypes = { status: PropTypes.number };

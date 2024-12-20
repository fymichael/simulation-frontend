import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainCard from 'components/MainCard';

// icons
const icons = {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
};

import Dot from 'components/@extended/Dot';

const headCells = [
  { id: 'numero', label: '#', align: 'center', disablePadding: false },
  { id: 'numeroMatricule', label: 'Numéro Matricule', align: 'left', disablePadding: false },
  { id: 'nom', label: 'Nom', align: 'left', disablePadding: false },
  { id: 'prenom', label: 'Prénom', align: 'left', disablePadding: false },
  { id: 'email', label: 'Email', align: 'left', disablePadding: false },
  { id: 'contact', label: 'Contact', align: 'left', disablePadding: false },
  { id: 'departement', label: 'Département', align: 'left', disablePadding: false },
  { id: 'role', label: 'Rôle', align: 'left', disablePadding: false },
  { id: 'status', label: 'Status', align: 'left', disablePadding: false },
  { id: 'valider', label: '', align: 'center', disablePadding: false },
  { id: 'refuser', label: '', align: 'center', disablePadding: false },
];

const statusLabels = {
  1: { color: 'primary', title: 'En attente de validation' },
  3: { color: 'warning', title: 'Refus d’adhésion' },
  5: { color: 'success', title: 'Actif' },
  0: { color: 'error', title: 'Retiré' },
};

function OrderStatus({ status }) {
  const { color, title } = statusLabels[status] || { color: 'default', title: 'Inconnu' };
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

OrderStatus.propTypes = { status: PropTypes.number };

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nom');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3030/utilisateurs');
        setUsers(response.data);
      } catch (error) {
        console.error("Utilisateurs non récupérés:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleValidate = async (idUser) => {
    try {
      await axios.put('http://localhost:3030/utilisateur', { idUser });
      window.location.reload()
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    }
  };

  const handleEscape = async (idUser) => {
    try {
      await axios.put('http://localhost:3030/utilisateur', { idUser });
      window.location.reload()
    } catch (error) {
      console.error('Erreur lors du refus:', error);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const sortedUsers = stableSort(users, getComparator(order, orderBy));

  return (
    <MainCard
      sx={{ maxWidth: { xs: 1200, lg: 1200 }, margin: { xs: 2.5, md: 3 }, '& > *': { flexGrow: 1, flexBasis: '50%' } }}
      content={false}
      border={false}
      boxShadow
      shadow={(theme) => theme.customShadows.z1}
    >
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.align}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.label && (
                      <Tooltip title="Trier">
                        <IconButton
                          size="small"
                          onClick={() => handleRequestSort(headCell.id)}
                        >
                          {headCell.label}
                          {orderBy === headCell.id &&
                            (order === 'asc' ? <icons.ArrowUpOutlined /> : <icons.ArrowDownOutlined />)}
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                <TableRow key={user.idUtilisateur}>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{user.numeroMatricule}</TableCell>
                  <TableCell>{user.nom}</TableCell>
                  <TableCell>{user.prenom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.contact}</TableCell>
                  <TableCell>{user.departement.nom}</TableCell>
                  <TableCell>{user.role.nom}</TableCell>
                  <TableCell>
                    <OrderStatus status={user.status} />
                  </TableCell>
                  <TableCell align="center">
                    {user.status === 1 && (
                      <Tooltip title="Valider">
                        <IconButton onClick={() => handleValidate(user.idUtilisateur)}>
                          <icons.CheckCircleOutlined style={{ color: 'green' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {user.status === 1 && (
                      <Tooltip title="Refuser">
                        <IconButton onClick={() => handleEscape(user.idUtilisateur)}>
                          <icons.CloseCircleOutlined style={{ color: 'red' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </MainCard>
  );
}

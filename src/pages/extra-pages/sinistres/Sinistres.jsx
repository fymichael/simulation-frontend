import React, { useState, useEffect } from "react";
import Dot from 'components/@extended/Dot';
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography,
  Box,
  Paper,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

// Traduire le status en texte
const statusLabels = {
  1: { color: 'primary', title: 'En cours de traitement' },
  5: { color: 'success', title: 'Approuvé et clôturé' },
  0: { color: 'error', title: 'Non Approuvé' },
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

function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("L'entrée doit être un objet Date valide.");
  }

  const moisFrancais = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];

  const jour = date.getDate();
  const mois = moisFrancais[date.getMonth()];
  const annee = date.getFullYear();

  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${jour} ${mois} ${annee} à ${heures}h${minutes}`;
}


const SinistresTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("numero_sinistre");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3030/sinistres");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des sinistres:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewSinistre = () => {
    navigate(`/nyhavana/new-sinistre`);
  };
  // Fonction de tri
  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
    const sortedData = [...data].sort((a, b) => {
      if (isAscending) {
        return a[property] < b[property] ? 1 : -1;
      }
      return a[property] > b[property] ? 1 : -1;
    });
    setData(sortedData);
  };

  // Gestion du changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Gestion du changement du nombre de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={<PlusOutlined />}
        sx={{ mb: 2, bgcolor: 'red', ':hover': { bgcolor: 'darkred' }, color: 'white' }}
        onClick={handleNewSinistre}
        style={{ marginLeft: '80%' }}
      >
        Nouveau sinistre
      </Button>
      <MainCard
        sx={{
          maxWidth: { xs: 1200, lg: 1200 },
          '& > *': { flexGrow: 1, flexBasis: '50%' },
        }}
        content={false}
        border={false}
        boxShadow
        shadow={(theme) => theme.customShadows.z1}
      >
        <Typography variant='h3' sx={{ padding: "20px" }}> Listes des sinistres </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "numero_sinistre"}
                    direction={orderBy === "numero_sinistre" ? order : "asc"}
                    onClick={() => handleSort("numero_sinistre")}
                  >
                    Numéro du sinistre
                  </TableSortLabel>


                </TableCell>
                <TableCell>
                  Numéro du contrat
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={orderBy === "date" ? order : "asc"}
                    onClick={() => handleSort("date")}
                  >
                    Date et Heure d'incident
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "lieu"}
                    direction={orderBy === "lieu" ? order : "asc"}
                    onClick={() => handleSort("lieu")}
                  >
                    Lieu d'incident
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleSort("status")}
                  >
                    Statut
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sinistre) => (
                  <TableRow key={sinistre.idSinistre}>
                    <TableCell>
                      <a
                        href={`http://localhost:3000/nyhavana/sinistre/${sinistre.idSinistre}`}
                        style={{ textDecoration: "none", color: "#3f51b5" }}
                      >
                        {sinistre.idSinistre}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`/nyhavana/contrat/${sinistre.contrat.id_contrat}`}
                        style={{ textDecoration: "none", color: "#3f51b5" }}
                      >
                        {sinistre.contrat.numeroPolice}
                      </a>
                    </TableCell>
                    <TableCell>{formatDate(new Date(sinistre.date_heure_incident))}</TableCell>
                    <TableCell>{sinistre.lieu_incident}</TableCell>
                    <TableCell><OrderStatus status={sinistre.status} /></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </MainCard >
    </>
  );
};

export default SinistresTable;

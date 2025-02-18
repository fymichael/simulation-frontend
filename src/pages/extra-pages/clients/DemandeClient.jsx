import PropTypes from 'prop-types';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    IconButton,
    Typography,
    Stack
} from '@mui/material';
import { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';
import { decodeToken } from 'utils/authTokens';

const headCells = [
    { id: 'numero', label: '#', align: 'center' },
    { id: 'numero_police', label: 'Numéro police', align: 'left' },
    { id: 'date_envoi', label: 'Date envoi', align: 'left' },
    { id: 'titre', label: 'Titre', align: 'left' },
    { id: 'objet', label: 'Objet', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
];

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

const statusLabels = {
    1: { color: 'warning', title: 'En attente' },
    0: { color: 'error', title: 'Demande refusé' },
    5: { color: 'success', title: 'Demande approuvé' },
};

function DemandeStatus({ status }) {
    const { color, title } = statusLabels[status] || { color: 'default', title: 'Inconnu' };
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
}

export default function ClientsTable() {
    const [demandeClients, setDemandeClients] = useState([]);

    const handleValidate = async (idDemande) => {
        try {
            await axios.put(
                `http://localhost:3030/validate-demande/${idDemande}`
            );
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la résiliation:', error);
        }
    };

    const handleInvalidate = async (idDemande) => {
        try {
            await axios.put(
                `http://localhost:3030/invalidate-demande/${idDemande}`
            );
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la résiliation:', error);
        }
    };

    const fetchDemandesClients = async () => {
        try {
            const decodedToken = decodeToken();
            if (decodedToken?.role === 2) {
                const prefixe_agence = decodedToken?.prefixe_agence;
                console.log(prefixe_agence);
                const response = await axios.get(`http://localhost:3030/demandes/${prefixe_agence}`);
                console.log(response.data)
                setDemandeClients(response.data);
            } else {
                const response = await axios.get(`http://localhost:3030/demandes`);
                console.log(response.data)
                setDemandeClients(response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des clients:', error);
        }
    };

    useEffect(() => {
        fetchDemandesClients();
    }, []);

    return (
        <Box>
            <MainCard sx={{ marginTop: '50px' }} content={false}>
                {demandeClients.length === 0 ? (
                    <Typography variant="body1" sx={{ padding: '20px', textAlign: 'center', color: 'grey' }}>
                        Pas de demandes reçus pour l'instant
                    </Typography>
                ) : (
                    <Box sx={{ margin: 3 }}>
                        <Typography variant='h3' sx={{ padding: "20px" }}> Listes des demandes des clients reçus </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {headCells.map((headCell) => (
                                            <TableCell key={headCell.id} align={headCell.align}>
                                                {headCell.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {demandeClients.map((row, index) => (
                                        <TableRow key={row.idClient}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell>{row.contrat.numeroPolice}</TableCell>
                                            <TableCell>{formatDate(new Date(row.dateEnvoie))}</TableCell>
                                            <TableCell>{row.titre}</TableCell>
                                            <TableCell>{row.objet}</TableCell>
                                            <TableCell>
                                                <DemandeStatus status={row.status} />
                                            </TableCell>
                                            {row.status === 1 && (
                                                <>
                                                    <TableCell align="center">
                                                        <Tooltip title="Valider">
                                                            <IconButton
                                                                color="success"
                                                                onClick={() => handleValidate(row.idDemandeClient)}
                                                            >
                                                                <CheckOutlined />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Supprimer">
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleInvalidate(row.idDemandeClient)}
                                                            >
                                                                <DeleteOutlined />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </>
                                            )}

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </MainCard>
        </Box>
    );
}
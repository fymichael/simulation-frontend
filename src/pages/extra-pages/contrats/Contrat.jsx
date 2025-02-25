import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Stack,
    TablePagination,
    TextField,
    CircularProgress,
    IconButton
} from '@mui/material';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dot from 'components/@extended/Dot';
import MainCard from 'components/MainCard';

function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Date invalide';
    }

    const moisFrancais = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];

    return `${date.getDate()} ${moisFrancais[date.getMonth()]} ${date.getFullYear()}`;
}

function formatNombre(number) {
    return number.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const statusLabels = {
    1: { color: 'default', title: 'Échéance du contrat dans moins de 7 jours' },
    0: { color: 'error', title: 'Contrat résilié' },
    5: { color: 'success', title: 'Actif' },
};

function ContratStatus({ status }) {
    const { color, title } = statusLabels[status] || { color: 'default', title: 'Inconnu' };
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
}

const ContratTable = () => {
    const navigate = useNavigate();
    const [contrats, setContrats] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContrats = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:3030/contrats');
                setContrats(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Erreur lors de la récupération des contrats :', error);
                setContrats([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchContrats();
    }, []);
    
    const handleSearch = async (event) => {

        const numeroPolice = event.target.value;
        if (numeroPolice.trim() === '') {
            try {
                const response = await axios.get('http://localhost:3030/contrats');
                setContrats(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Erreur lors de la récupération des contrats :', error);
                setContrats([]);
            }
            return;
        }
        
        try {
            const response = await axios.get(`http://localhost:3030/contrat-filter/${numeroPolice}`);
            console.log('type response data : ',typeof(response.data))
            setContrats(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Erreur lors de la recherche du contrat:', error);
            setContrats([]);
        }
    };

    const handleDetailModalOpen = (contrat) => {
        navigate(`/nyhavana/contrat/${contrat.id_contrat}`);
    };

    const handleNewContrat = () => {
        navigate(`/nyhavana/new-contrat`);
    };

    const handlePageChange = (_, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Box>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 5 }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField 
                            label="Numéro de police" 
                            margin="normal" 
                            onChange={handleSearch} 
                        />
                    </Stack>
                    <Button
                        variant="contained"
                        startIcon={<PlusOutlined />}
                        sx={{ bgcolor: 'red', ':hover': { bgcolor: 'darkred' }, color: 'white' }}
                        onClick={handleNewContrat}
                    >
                        Nouveau Contrat
                    </Button>
                </Stack>
            </Box>

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
                <Box sx={{ padding: 3 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Numéro de Police</TableCell>
                                    <TableCell>Date Début</TableCell>
                                    <TableCell>Date D'échéance</TableCell>
                                    <TableCell>Montant Total</TableCell>
                                    <TableCell>Matricule apporteur</TableCell>
                                    <TableCell>Statut</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contrats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contrat, index) => (
                                    <TableRow key={contrat.id_contrat}>
                                        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                        <TableCell
                                            sx={{ cursor: 'pointer', color: 'blue' }}
                                            onClick={() => handleDetailModalOpen(contrat)}
                                        >
                                            {contrat.numeroPolice}
                                        </TableCell>
                                        <TableCell>{formatDate(new Date(contrat.dateDebut))}</TableCell>
                                        <TableCell>{formatDate(new Date(contrat.dateEcheance))}</TableCell>
                                        <TableCell>{formatNombre(contrat.montantTotal)} Ar</TableCell>
                                        <TableCell>{contrat.codeApporteur}</TableCell>
                                        <TableCell>
                                            <ContratStatus status={contrat.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={contrats.length}
                        page={page}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </Box>
            </MainCard>
        </>
    );
};

export default ContratTable;

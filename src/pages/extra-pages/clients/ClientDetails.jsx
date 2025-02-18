import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Paper, CircularProgress, Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Dot from 'components/@extended/Dot';


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

function formatNombre(number) {
    return number.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const statusLabels = {
    1: { color: 'warning', title: 'Echeance du contrat dans moins de 7 jours' },
    0: { color: 'error', title: 'Contrat résilié' },
    5: { color: 'success', title: 'Actif' },
};

const sinistreStatus = {
    1: { color: 'warning', title: 'En cours de traitement' },
    0: { color: 'error', title: 'Sinistre non pris en charge' },
    5: { color: 'success', title: 'Sinistre justifier et valider' },
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

function Sinistre({ status }) {
    const { color, title } = sinistreStatus[status] || { color: 'default', title: 'Inconnu' };
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
}

const ClientComponent = () => {
    const { idClient } = useParams();
    const [client, setClient] = useState(null);
    const [clientContrat, setClientContrat] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await axios.get(`http://localhost:3030/client/${idClient}`);
                setClient(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du client:', error);
            }
        };

        const fetchClientContrat = async () => {
            try {
                const response = await axios.get(`http://localhost:3030/client-contrat/${idClient}`);
                setClientContrat(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des contrats du client:', error);
            }
        };
        fetchClient();
        fetchClientContrat();
    }, [idClient]);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}
        >
            {client ? (
                <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
                    <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
                        <Typography variant="h4" gutterBottom>
                            {client.nom} {client.prenom}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Adresse : {client.adresse}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Contact : {client.contact}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Email : {client.email}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Numéro cin : {client.cin}
                        </Typography>
                    </motion.div>

                    {clientContrat ? (
                        <>
                            <Box mt={3}>
                                <Typography variant="h5" gutterBottom>
                                    Les contrats du clients
                                </Typography>
                                {clientContrat.map((contrat) => (
                                    <Card
                                        key={contrat.numeroPolice}
                                        component={motion.div}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        sx={{ marginBottom: 2, backgroundColor: '#ffffff' }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6">
                                                <Link to={`/nyhavana/contrat/${contrat.id_contrat}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                    {contrat.numeroPolice}
                                                </Link>
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Date de début : {formatDate(new Date(contrat.dateDebut))}<br />
                                                Date d'écheances : {formatDate(new Date(contrat.dateEcheance))} <br />
                                                Montant Total : {formatNombre(contrat.montantTotal)} Ar
                                                <ContratStatus status={contrat.status} />
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </>
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            Pas de contrat lié au client.
                        </Typography>
                    )}
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default ClientComponent;

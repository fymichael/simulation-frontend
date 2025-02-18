import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, CircularProgress, Grid, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { usePDF } from 'react-to-pdf';

const ContratDocument = () => {
    const navigate = useNavigate();
    const [contrat, setContrat] = useState(null);
    const [tarif, setTarif] = useState(null);
    const { idContrat } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toPDF, targetRef } = usePDF({
        filename: `contrat.pdf`,
    });

    useEffect(() => {
        const fetchContrat = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3030/contrat/${idContrat}`);
                setContrat(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des données :", err);
                setError("Erreur lors de la récupération des données.");
            } finally {
                setLoading(false);
            }
        };
        const fetchTarif = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3030/contrat-facturation/${idContrat}`);
                console.log(response.data)
                setTarif(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTarif();
        fetchContrat();
    }, [idContrat]);

    const handleAttestation = () => {
        navigate(`/nyhavana/attestation-review/${idContrat}`);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h5">{error}</Typography>;
    }

    if (!contrat) {
        return <Typography variant="h5">Contrat non trouvé.</Typography>;
    }

    return (
        <Box sx={{ p: 3, backgroundColor: "#f9f9f9" }}>
            <Paper
                id="contrat-document"
                elevation={3}
                sx={{ padding: 4, borderRadius: 2, backgroundColor: "#fff" }}
                ref={targetRef}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: 2 }}>
                    <Typography variant="h4" align="right" gutterBottom sx={{ color: "red", textAlign: { xs: "center", sm: "right" } }}>
                        <img src="/src/assets/images/nyhavana/Havana.png" width="200px" height="42px" />
                    </Typography>
                    <Typography variant="h4" align="left" gutterBottom sx={{ width: { xs: "100%", sm: "auto" }, textAlign: { xs: "center", sm: "left" } }}>
                        Contrat N° {contrat.numeroPolice}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography>
                    Le contrat d'assurance automobile N° <strong>{contrat.numeroPolice}</strong> prend effet le <strong>{formatDate(new Date(contrat.dateDebut))}</strong> à 00h00 pour une durée de <strong>{contrat.duree} mois</strong>, se terminant le <strong>{formatDate(new Date(contrat.dateEcheance))} à 23h59</strong>. Ce contrat accorde une réduction de <strong>{contrat.reduction}%</strong> sur la prime d'assurance standard. Le paiement se fera uniquement par <strong> {contrat.typePaiement.nom} </strong>.
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    L'assuré, <strong>{contrat.client.nom} {contrat.client.prenom}</strong>, né le <strong>{formatDate(new Date(contrat.client.date_naissance))}</strong>, portant le numéro de carte d'identité nationale <strong>{contrat.client.cin}</strong>, habite à <strong>{contrat.client.adresse}</strong>.
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    Le véhicule concerné par ce contrat est un <strong>{contrat.vehicule.marque.nom}</strong>, modèle <strong>{contrat.vehicule.model}</strong>, ayant le numero de châssit suivant <strong> {contrat.vehicule.numero_chassit} </strong>, immatriculé <strong>{contrat.vehicule.plaque_immatriculation}</strong>, son moteur numeroté : <strong>{contrat.vehicule.numero_moteur}</strong> est doté d'une puissance de <strong>{contrat.vehicule.puissance} CV</strong> et fonctionnant à l'énergie <strong>{contrat.vehicule.energie[0].nom}</strong>. Il est classifié comme <strong>{contrat.classification[0].nom}</strong>.
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    Le paiement est structuré comme suit :
                </Typography>
                <TableContainer sx={{ mb: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date de Paiement</TableCell>
                                <TableCell>Pourcentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contrat.procedurePaiement.map((paiement, index) => (
                                <TableRow key={index}>
                                    <TableCell>{formatDate(new Date(paiement.date_paiement))}</TableCell>
                                    <TableCell>{paiement.pourcentage} %</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography sx={{ mt: 2 }}>
                    Ce contrat offre les garanties suivantes :
                    <ul>
                        <li>Responsabilité civile</li>
                        {contrat.garanties.map((garantie, index) => (
                            <li key={index}>{garantie[0].nom}</li>
                        ))}
                    </ul>
                </Typography>
                <Typography variant="h4" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    Facturation
                </Typography>
                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>TVA (Ar)</TableCell>
                            <TableCell>TACAVA (Ar)</TableCell>
                            <TableCell>TE (Ar)</TableCell>
                            <TableCell>IMP (Ar)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{formatNombre(tarif.tacava)}</TableCell>
                            <TableCell>{formatNombre(tarif.tva)}</TableCell>
                            <TableCell>{formatNombre(tarif.te)}</TableCell>
                            <TableCell>{formatNombre(tarif.imp)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Typography sx={{ textAlign: 'right', mt: 2 }}>
                    Accesssoires : {formatNombre(tarif.accessoires)} Ar
                </Typography>
                <Typography sx={{ textAlign: 'right', mt: 1 }}>
                    Total Taxe : {formatNombre(tarif.montant_exoneration)} Ar
                </Typography>
                <Typography sx={{ textAlign: 'right', mt: 1 }}>
                    Montant des garanties : {formatNombre(tarif.montant_garanties)} Ar
                </Typography>
                <Typography sx={{ textAlign: 'right', mt: 1 }}>
                    Net à payer : {formatNombre(contrat.montantTotal)} Ar
                </Typography>

                <Box sx={{ mt: 4, borderTop: "1px solid gray", pt: 2 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Typography variant="h4">
                                <strong>Net à payer :</strong> {formatNombre(contrat.montantTotal)} Ar
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6" align="right">
                                Signature de l'assuré
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Button
                variant="contained"
                color="error"
                sx={{ mt: 3 }}
                onClick={() => toPDF()}
            >
                Exporter en PDF
            </Button>
            <Button
                variant="contained"
                sx={{ mt: 3, ml: 2, bgcolor: 'grey', ':hover': { bgcolor: 'darkgrey' }, color: 'white' }}
                onClick={handleAttestation}
            >
                Visualiser l'attestation
            </Button>
        </Box>
    );
};

const formatDate = (date) => {
    const moisFrancais = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ];
    const jour = date.getDate();
    const mois = moisFrancais[date.getMonth()];
    const annee = date.getFullYear();
    return `${jour} ${mois} ${annee}`;
};

const formatNombre = (number) => {
    return number.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default ContratDocument;
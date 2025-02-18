import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { usePDF } from 'react-to-pdf';

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
  
    return `${jour} ${mois} ${annee}`;
  }

function formatNombre(number) {
    return number?.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ContratAttestation = () => {
    const [contrat, setContrat] = useState(null);
    const { idContrat } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toPDF, targetRef } = usePDF({
        filename: `attestation.pdf`,
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
        fetchContrat();
    }, [idContrat]);

    const bandeColor = contrat && contrat.classification[0].id_classification === 7
    ? "rgba(255, 0, 0, 0.7)"
    : contrat && contrat.classification[0].id_classification === 5
        ? "rgba(0, 128, 0, 0.7)"
        : null;

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
        <>
            <Box
                sx={{
                    position: "relative",
                    p: 4,
                    borderRadius: 2,
                    overflow: "hidden",
                    maxWidth: 900,
                    margin: "auto",
                    boxShadow: 3,
                }}
                ref={targetRef}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "transparent",
                        zIndex: 1,
                        pointerEvents: "none",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "200%",
                            height: "20px",
                            backgroundColor: `${bandeColor}`,
                            transform: 'rotate(19deg)',
                            transformOrigin: 'top left',
                            opacity: 0.75
                        }}
                    />
                </Box>

                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>{contrat.utilisateur.departement.code}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography align="center" sx={{ fontSize: '20px' }}><strong> NY HAVANA </strong></Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography>{contrat.vehicule.plaque_immatriculation || "N/A"}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography>{contrat.numeroPolice || "N/A"}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography>{contrat.vehicule.marque[0].nom} {contrat.vehicule.model} - {contrat.vehicule.nombre_place} PLC</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography>{contrat.client.genre.abreviation} {contrat.client.nom} {contrat.client.prenom}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography>{contrat.client.genre.abreviation} {contrat.client.nom} {contrat.client.prenom}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography>{contrat.vehicule.plaque_immatriculation}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography>{contrat.client.adresse}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography>{contrat.client.adresse}</Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography> {formatNombre(contrat.montantTotal)} Ar</Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography> {formatDate(new Date(contrat.dateDebut))} à 00:00 </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography>{formatDate(new Date (contrat.dateEcheance))} à 23:59 </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography>
                                {formatDate(new Date(contrat.dateDebut))} à 00:00 <br /> {formatDate(new Date(contrat.dateEcheance))} à 23:00
                            </Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ ml: 30 }}>
                            <Typography>{contrat.vehicule.nombre_place}</Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography align="right"> {contrat.vehicule.puissance} CV</Typography>
                        </Grid>
                    </Grid>
                </div>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => toPDF()}
                >
                    Exporter en PDF
                </Button>
            </Box>
        </>
    );
};

export default ContratAttestation;
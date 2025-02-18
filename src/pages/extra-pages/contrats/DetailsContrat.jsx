import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    Stack,
    Card,
    Button,
    CircularProgress,
    IconButton,
    Grid,
    Paper,
    Modal,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    FormHelperText,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import Dot from 'components/@extended/Dot';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import PersonIcon from '@mui/icons-material/Person';
import { DeleteOutline } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Delete } from '@mui/icons-material';
import { decodeToken } from "utils/authTokens";


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
    return number?.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Fonction pour ajouter des mois à une date
function removeOneDay(date) {
    var result = new Date(date);
    result.setDate(result.getDate() - 1);
    console.log(result)
    return result;
}


const DetailContrat = () => {
    const { idContrat } = useParams();
    const navigate = useNavigate();

    const [exonerations, setExonerations] = useState([]);
    const [garanties, setGaranties] = useState([]);
    const [contrat, setContrat] = useState(null);
    const [sinistres, setSinistres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEncaissement, setOpenModalEncaissement] = useState(false);
    const [paiements, setPaiements] = useState([]);
    const [proceduresPaiements, setProceduresPaiements] = useState([]);
    const [tarif, setTarif] = useState([]);
    const [encaissement, setEncaissement] = useState([]);
    const [datePaiement, setDatePaiement] = useState('');
    const [pourcentagePaiement, setPourcentagePaiement] = useState('');
    const [selectedGaranties, setSelectedGaranties] = useState([]);

    const handleCloseModal = () => setOpenModal(false);
    const handleOpenModal = () => {
        setOpenModal(true);
        setDatePaiement('');
        setPourcentagePaiement('');
    };

    const handleCloseModalEncaissement = () => setOpenModalEncaissement(false);
    const handleOpenModalEncaissement = () => {
        setOpenModalEncaissement(true);
    };

    const relanceClient = async (contrat) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir relancer le client concernant ce contrat ?");

        if (!confirmation) {
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            const data = {
                titre: 'Avis de date echeance proche',
                objet: `Avis de decision concernant le contrat ayant le numero de police ${contrat.numeroPolice}`,
                id_contrat: contrat.id_contrat,
                is_renouvellement: 'null',
                status: 3
            }
            console.log(data);
            await axios.post(`http://localhost:3030/demande`, data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate('/nyhavana/contrats')
        } catch (error) {
            console.error('Erreur lors de la résiliation: ', error);
        }
    };

    const handleResiliation = async () => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir résilier ce contrat ?");

        if (!confirmation) {
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            await axios.put(
                `http://localhost:3030/resilier-contrat/${idContrat}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate('/nyhavana/contrats')
        } catch (error) {
            console.error('Erreur lors de la résiliation: ', error);
        }
    };

    useEffect(() => {
        const fetchContrat = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3030/contrat/${idContrat}`);
                setContrat(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchTarif = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3030/contrat-facturation/${idContrat}`);
                setTarif(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchSinistres = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3030/contrat-sinistre/${idContrat}`);
                setSinistres(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchProceduresPaiements = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3030/procedures/${idContrat}`);
                setProceduresPaiements(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchEncaissements = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3030/encaissement/${idContrat}`);
                setEncaissement(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEncaissements();
        fetchContrat();
        fetchTarif();
        fetchSinistres();
        fetchProceduresPaiements();
    }, [idContrat]);

    const formikEncaissement = useFormik({
        initialValues: {
            id_procedure_paiement: "",
            date_encaissement: "",
            montant: "",
            numero_piece: ""
        },
        validationSchema: Yup.object({
            id_procedure_paiement: Yup.string().required("Le choix de la procédure de paiement est obligatoire"),
            date_encaissement: Yup.date().required("La date d'encaissement est obligatoire"),
            montant: Yup.number()
                .moreThan(0, "Le montant doit être supérieur à 0")
                .required("Le montant encaissé est obligatoire"),
        }),
        onSubmit: async (values) => {
            try {
                const procedureSelectionnee = contrat.procedurePaiement.find(
                    (proc) => proc.id_procedure_paiement === values.id_procedure_paiement
                );

                const pourcentage = procedureSelectionnee.pourcentage;
                const montantAttendu = (contrat.montantTotal * pourcentage) / 100;

                const dateEncaissement = new Date(values.date_encaissement);
                const datePaiement = new Date(procedureSelectionnee.date_paiement);

                if (formatDate(dateEncaissement) > formatDate(datePaiement)) {
                    alert('La date d\'encaissement que vous avez choisie est plus récente que la date du procédé de paiement configuré');
                    return;
                }


                if (values.montant > formatNombre(montantAttendu)) {
                    alert(`Le montant que vous avez saisi est superieur au montant du procedure de paiement configuré`);
                    return;
                }

                const data = {
                    id_procedure_paiement: values.id_procedure_paiement,
                    date_encaissement: values.date_encaissement,
                    montant: values.montant,
                    numero_piece: values.numero_piece ? values.numero_piece : null
                };

                console.log(data);
                await axios.post(`http://localhost:3030/encaissement`, data);
                navigate('/nyhavana/contrat/' + idContrat);
                window.location.reload();
            } catch (error) {
                console.error("Erreur lors de l'ajout du contrat", error);
                alert("Une erreur est survenue lors de l'ajout du contrat.");
            }
        },
    });


    const formikContratInfo = useFormik({
        initialValues: {
            date_debut: "",
            duree: "",
            reduction: "",
            id_exoneration: "",
        },
        validationSchema: Yup.object({
            date_debut: Yup.string().required("La date de début du contrat est obligatoire"),
            duree: Yup.string().required("La durée du contrat est obligatoire"),
            reduction: Yup.string().required("La réduction du contrat est obligatoire"),
            id_exoneration: Yup.string().required("L'exonération du contrat est obligatoire"),
        }),
        onSubmit: async (values) => {
            const token = decodeToken();
            const data = {
                id_client: contrat.client.idClient,
                id_vehicule: contrat.client.idVehicule,
                date_debut: values.date_debut,
                duree: parseInt(values.duree),
                reduction: parseInt(values.reduction),
                id_exoneration: parseInt(values.id_exoneration),
                id_utilisateur: token.sub,
                garanties: selectedGaranties.map((id_garantie) => ({
                    id_garantie: parseInt(id_garantie),
                })),
                procedures: paiements.map((paiement) => ({
                    date_paiement: paiement.date,
                    pourcentage: paiement.pourcentage,
                })),
            };

            try {
                await axios.post(`http://localhost:3030/renouvellement-contrat/${idContrat}`, data);
                navigate('/nyhavana/contrat/' + idContrat);
                window.location.reload();
            } catch (error) {
                console.error("Erreur lors de l'ajout du contrat", error);
                alert("Une erreur est survenue lors de l'ajout du contrat.");
            }
        },
    });

    // Fonctions pour charger les données
    const loadExonerations = async () => {
        try {
            const response = await axios.get("http://localhost:3030/exonerations");
            setExonerations(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des exonérations", error);
        }
    };

    const loadGaranties = async () => {
        try {
            const response = await axios.get("http://localhost:3030/garanties");
            setGaranties(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des garanties", error);
        }
    };

    // Effet pour charger les données au démarrage
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([loadExonerations(), loadGaranties()]);
        };
        loadData();
    }, []);

    const handleAddPaiement = () => {
        if (!datePaiement || pourcentagePaiement <= 0 || pourcentagePaiement > 100) {
            alert("Veuillez saisir une date valide et un pourcentage entre 0 et 100.");
            return;
        }

        const totalPourcentage = paiements.reduce((acc, paiement) => acc + paiement.pourcentage, 0) + parseInt(pourcentagePaiement);
        if (totalPourcentage > 100) {
            alert("La somme des pourcentages ne peut pas dépasser 100.");
            return;
        }

        setPaiements([...paiements, { date: datePaiement, pourcentage: parseInt(pourcentagePaiement) }]);
        setDatePaiement("");
        setPourcentagePaiement("");
    };

    const handleDeletePaiement = (index) => {
        const newPaiements = paiements.filter((_, idx) => idx !== index);
        setPaiements(newPaiements);
    };

    const handleAnnulerEncaissement = async (idEncaissement) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir annuler cet encaissement ?");

        if (!confirmation) {
            return;
        }

        await axios.put(`http://localhost:3030/annuler-encaissement/${idEncaissement}`);
        window.location.reload();
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedGaranties((prevState) =>
            prevState.includes(value)
                ? prevState.filter((id_garantie) => id_garantie !== value)
                : [...prevState, value]
        );
    };

    const statusLabels = {
        1: { color: 'warning', title: 'En attente de paiement' },
        0: { color: 'error', title: 'Annuler' },
        5: { color: 'success', title: 'Paiement reçu' },
    };

    function PaiementStatus({ status }) {
        const { color, title } = statusLabels[status] || { color: 'default', title: 'Inconnu' };
        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <Dot color={color} />
                <Typography>{title}</Typography>
            </Stack>
        );
    }

    const handleVisualiserContrat = () => {
        navigate(`/nyhavana/contrat-visualisation/${idContrat}`);
    };

    const sumEncaissements = encaissement.reduce((sum, encaissemente) => sum + encaissemente.montant, 0);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h5" color="error">{error}</Typography>;
    }

    if (!contrat) {
        return <Typography variant="h5">Contrat non trouvé.</Typography>;
    }

    return (
        <Box sx={{ padding: 3, bgcolor: '#fafafa' }}>
            <Card
                sx={{
                    maxWidth: 800,
                    margin: "0 auto",
                    boxShadow: 10,
                    borderRadius: 3,
                    padding: 3,
                    bgcolor: '#ffffff',
                    transition: '0.3s',
                    '&:hover': {
                        boxShadow: 20,
                    },
                }}
            >
                <Stack direction="row" alignItems="center" mb={3}>
                    <IconButton onClick={() => navigate(-1)} sx={{ color: 'black' }} aria-label="Retour">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" fontWeight="bold" flexGrow={1} align="center" sx={{ color: 'black' }}>
                        Détails du Contrat : {contrat.numeroPolice}
                    </Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    {/* Section Client */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ marginRight: 1 }} /> À propos du Client
                            </Typography>
                            <Stack spacing={1}>
                                <Typography><strong>Nom :</strong> {contrat.client.nom}</Typography>
                                <Typography><strong>Prénom :</strong> {contrat.client.prenom}</Typography>
                                <Typography><strong>Adresse :</strong> {contrat.client.adresse}</Typography>
                                <Typography><strong>Contact :</strong> {contrat.client.contact}</Typography>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Section Véhicule */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                <CarRepairIcon sx={{ marginRight: 1 }} /> Informations sur le Véhicule
                            </Typography>
                            <Stack spacing={1}>
                                <Typography><strong>Marque :</strong> {contrat.vehicule.marque[0].nom}</Typography>
                                <Typography><strong>Modèle :</strong> {contrat.vehicule.model}</Typography>
                                <Typography><strong>Plaque :</strong> {contrat.vehicule.plaque_immatriculation}</Typography>
                                <Typography><strong>Puissance :</strong> {contrat.vehicule.puissance} CV</Typography>
                                <Typography><strong>Energie :</strong> {contrat.vehicule.energie[0].nom} </Typography>
                                <Typography><strong>Date de première circulation :</strong> {formatDate(new Date(contrat.vehicule.date_circulation))} </Typography>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Section Détails du Contrat */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                Détails du Contrat
                            </Typography>
                            <Stack spacing={1}>
                                <Typography><strong>Durée :</strong> {contrat.duree} mois</Typography>
                                <Typography><strong>Date Début :</strong> {formatDate(new Date(contrat.dateDebut))}</Typography>
                                <Typography><strong>Date Échéance :</strong> {formatDate(new Date(contrat.dateEcheance))}</Typography>
                                <Typography><strong>Type de paiement :</strong> {contrat.typePaiement.nom}</Typography>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* Section Historique des Paiements */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                <PaymentIcon sx={{ marginRight: 1 }} /> Procedures des Paiements
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
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
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                <PaymentIcon sx={{ marginRight: 1 }} /> Garanties
                            </Typography>
                            <ul>
                                <li> Résponsabilités civils </li>
                                {contrat.garanties.map((garantie, index) => (
                                    <li key={index}> {garantie[0].nom} </li>
                                ))}
                            </ul>

                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        {sinistres.length > 0 ? (
                            <>
                                <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                        <PaymentIcon sx={{ marginRight: 1 }} /> Les sinistres reliés à ce contrat
                                    </Typography>
                                    <ul>
                                        {sinistres.map((sinistre, index) => (
                                            <li key={index}><a href={`http://localhost:3000/nyhavana/sinistre/${sinistre.idSinistre}`} style={{ textDecoration: "none", color: "#3f51b5" }}> {sinistre.idSinistre} </a> </li>
                                        ))}
                                    </ul>
                                </Paper>
                            </>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                            </Typography>
                        )}

                    </Grid>

                    <Grid item xs={12}>
                        {encaissement.length > 0 ? (
                            <Grid item xs={12}>
                                <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                        <PaymentIcon sx={{ marginRight: 1 }} /> Liste des encaissements
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Montant</TableCell>
                                                <TableCell>Numéro de la pièce</TableCell>
                                                <TableCell>Type de paiement</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {encaissement.map((enc, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{formatDate(new Date(enc.dateEncaissement))}</TableCell>
                                                    <TableCell>{formatNombre(enc.montant)} </TableCell>
                                                    <TableCell> {enc.numeroPiece} </TableCell>
                                                    <TableCell>
                                                        <PaiementStatus status={enc.status} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <DeleteOutline
                                                            sx={{ cursor: 'pointer', color: 'gray' }}
                                                            onClick={() => handleAnnulerEncaissement(enc.idEncaissement)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
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
                                Accessoires : {formatNombre(tarif.accessoires)} Ar
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
                        </Paper>
                    </Grid>

                    <Modal open={openModalEncaissement} onClose={handleCloseModalEncaissement}>
                        <Box
                            sx={{
                                padding: 3,
                                bgcolor: '#ffffff',
                                borderRadius: 2,
                                maxWidth: 600,
                                maxHeight: '80vh',
                                margin: 'auto',
                                mt: 5,
                                boxShadow: 24,
                                overflowY: 'auto',
                            }}
                        >
                            <Typography variant="h4" align="center" gutterBottom>
                                Saisie d'encaissement
                            </Typography>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                formikEncaissement.handleSubmit();
                                handleCloseModal();
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item sm={12}>
                                        <Typography variant='h5' sx={{ marginBottom: 1 }}> Montant total des paiements attendus : {formatNombre(contrat.montantTotal)} Ar </Typography>
                                        <Typography variant='h5' sx={{ marginBottom: 1 }}> Reste à payer : {formatNombre(contrat.montantTotal - sumEncaissements)} Ar </Typography>
                                        <FormControl fullWidth sx={{ mt: 2 }}>
                                            <InputLabel id="procedures-label">Procedures de paiements</InputLabel>
                                            <Select
                                                labelId="procedures-label"
                                                {...formikEncaissement.getFieldProps("id_procedure_paiement")}
                                                error={formikEncaissement.touched.id_procedures && Boolean(formikEncaissement.errors.id_procedures)}
                                            >
                                                <MenuItem value="">
                                                    <em>-- Sélectionnez le procedure concerné --</em>
                                                </MenuItem>
                                                {proceduresPaiements.map((item) => (
                                                    <MenuItem key={item.idProcedurePaiement} value={item.idProcedurePaiement}>
                                                        {formatDate(new Date(item.datePaiement))} - {item.pourcentage}%
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formikEncaissement.touched.id_procedure_paiement && formikEncaissement.errors.id_procedure_paiement && (
                                                <FormHelperText error>{formikEncaissement.errors.id_procedure_paiement}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Date d'encaissement"
                                            margin="normal"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            {...formikEncaissement.getFieldProps("date_encaissement")}
                                            error={formikEncaissement.touched.date_encaissement && Boolean(formikEncaissement.errors.date_encaissement)}
                                            helperText={formikEncaissement.touched.date_encaissement && formikEncaissement.errors.date_encaissement}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Montant"
                                            margin="normal"
                                            {...formikEncaissement.getFieldProps("montant")}
                                            error={formikEncaissement.touched.montant && Boolean(formikEncaissement.errors.montant)}
                                            helperText={formikEncaissement.touched.montant && formikEncaissement.errors.montant}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Numero de la pièce"
                                            margin="normal"
                                            {...formikEncaissement.getFieldProps("numero_piece")}
                                            error={formikEncaissement.touched.numero_piece && Boolean(formikEncaissement.errors.numero_piece)}
                                            helperText={formikEncaissement.touched.numero_piece && formikEncaissement.errors.numero_piece}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Valider
                                    </Button>
                                </Grid>
                            </form>
                        </Box>
                    </Modal>

                    <Modal open={openModal} onClose={handleCloseModal}>
                        <Box
                            sx={{
                                padding: 3,
                                bgcolor: '#ffffff',
                                borderRadius: 2,
                                maxWidth: 600,
                                maxHeight: '80vh',
                                margin: 'auto',
                                mt: 5,
                                boxShadow: 24,
                                overflowY: 'auto',
                            }}
                        >
                            <Typography variant="h4" align="center" gutterBottom>
                                Renouvellement du contrat
                            </Typography>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                formikContratInfo.handleSubmit();
                                handleCloseModal();
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Date de renouvellement"
                                            margin="normal"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            {...formikContratInfo.getFieldProps("date_debut")}
                                            error={formikContratInfo.touched.date_debut && Boolean(formikContratInfo.errors.date_debut)}
                                            helperText={formikContratInfo.touched.date_debut && formikContratInfo.errors.date_debut}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Durée (mois)"
                                            margin="normal"
                                            {...formikContratInfo.getFieldProps("duree")}
                                            error={formikContratInfo.touched.duree && Boolean(formikContratInfo.errors.duree)}
                                            helperText={formikContratInfo.touched.duree && formikContratInfo.errors.duree}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Réduction"
                                            margin="normal"
                                            {...formikContratInfo.getFieldProps("reduction")}
                                            error={formikContratInfo.touched.reduction && Boolean(formikContratInfo.errors.reduction)}
                                            helperText={formikContratInfo.touched.reduction && formikContratInfo.errors.reduction}
                                        />
                                    </Grid>

                                    <Grid item sm={12}>
                                        <FormControl fullWidth sx={{ mt: 2 }}>
                                            <InputLabel id="exoneration-label">Exonération</InputLabel>
                                            <Select
                                                labelId="exoneration-label"
                                                {...formikContratInfo.getFieldProps("id_exoneration")}
                                                error={formikContratInfo.touched.id_exoneration && Boolean(formikContratInfo.errors.id_exoneration)}
                                            >
                                                <MenuItem value="">
                                                    <em>-- Sélectionnez une exonération --</em>
                                                </MenuItem>
                                                {exonerations.map((item) => (
                                                    <MenuItem key={item.id_exoneration} value={item.id_exoneration}>
                                                        {item.nom}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formikContratInfo.touched.id_exoneration && formikContratInfo.errors.id_exoneration && (
                                                <FormHelperText error>{formikContratInfo.errors.id_exoneration}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={12}>
                                        <Typography variant="h6">Sélectionnez les Garanties :</Typography>
                                        <FormControl fullWidth>
                                            {garanties.map((garantie) => (
                                                <FormControlLabel
                                                    key={garantie.id_garantie}
                                                    control={
                                                        <Checkbox
                                                            checked={selectedGaranties.includes(garantie.id_garantie.toString())}
                                                            onChange={handleChange}
                                                            value={garantie.id_garantie.toString()}
                                                            color="error"
                                                        />
                                                    }
                                                    label={garantie.nom}
                                                />
                                            ))}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ mb: 3 }}>Procédure de Paiement</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Date Paiement"
                                                    type="date"
                                                    value={datePaiement}
                                                    onChange={(e) => setDatePaiement(e.target.value)}
                                                    InputLabelProps={{ shrink: true }}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Pourcentage"
                                                    type="number"
                                                    value={pourcentagePaiement}
                                                    onChange={(e) => setPourcentagePaiement(e.target.value)}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleAddPaiement}
                                            sx={{ mt: 2 }}
                                        >
                                            Ajouter Paiement
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Pourcentage</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {paiements.map((paiement, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{paiement.date}</TableCell>
                                                        <TableCell>{paiement.pourcentage} %</TableCell>
                                                        <TableCell>
                                                            <IconButton onClick={() => handleDeletePaiement(index)}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="error"
                                            fullWidth
                                            sx={{ mt: 2 }}
                                        >
                                            Valider
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Modal>

                    {contrat.status !== 0 && (

                        <Button
                            variant="contained"
                            onClick={handleResiliation}
                            sx={{ ml: 2, mt: 3, bgcolor: 'red', ':hover': { bgcolor: 'darkred' }, color: 'white' }}
                        >
                            Résilier le contrat
                        </Button>
                    )}

                    {new Date() === removeOneDay(contrat.dateEcheance) || contrat.status !== 5 && (
                        <Button
                            variant="contained"
                            onClick={handleOpenModal}
                            sx={{ ml: 2, mt: 3, bgcolor: 'grey', ':hover': { bgcolor: 'darkgrey' }, color: 'white' }}
                        >
                            Renouveler le contrat
                        </Button>
                    )}

                    {contrat.status === 1 && (

                        <Button
                            variant="contained"
                            onClick={() => relanceClient(contrat)}
                            sx={{ ml: 2, mt: 3, bgcolor: 'red', ':hover': { bgcolor: 'darkred' }, color: 'white' }}
                        >
                            Relancer le client
                        </Button>
                    )}

                    <Button
                        variant="contained"
                        onClick={handleVisualiserContrat}
                        sx={{ ml: 2, mt: 3, bgcolor: 'grey', ':hover': { bgcolor: 'darkgrey' }, color: 'white' }}
                    >
                        Visualiser le contrat
                    </Button>

                    {Math.round(sumEncaissements) < Math.round(contrat.montantTotal) && (
                        <Button
                            variant="contained"
                            onClick={handleOpenModalEncaissement}
                            sx={{ ml: 2, mt: 3, bgcolor: 'grey', ':hover': { bgcolor: 'darkgrey' }, color: 'white' }}
                        >
                            Saisir un encaissement
                        </Button>
                    )}
                </Grid>
            </Card>
        </Box>
    );
};

export default DetailContrat;
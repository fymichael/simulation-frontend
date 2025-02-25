import React, { useEffect, useState, useRef } from 'react';
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
import { DeleteOutline, QrCode } from '@mui/icons-material';
import SecurityIcon from '@mui/icons-material/Security';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit'; // Avenants
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Delete } from '@mui/icons-material';
import { decodeToken } from "utils/authTokens";
import QRCode from "qrcode"
import { FileOutlined } from '@ant-design/icons';


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
    const [genres, setGenres] = useState([]);
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
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedVehiculeId, setSelectedVehiculeId] = useState(null);
    const [openEditClientModal, setOpenEditClientModal] = useState(false);
    const [openEditVehiculeModal, setOpenEditVehiculeModal] = useState(false);
    const [marques, setMarques] = useState([]);
    const [carrosseries, setCarrosseries] = useState([]);
    const [energies, setEnergies] = useState([]);
    const token = decodeToken();
    const role = token?.role;

    const canvasRef = useRef(null);
    const [qrCodeData, setQrCodeData] = useState("");

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

    const fetchClientById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3030/client/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données du client:', error);
        }
    };

    const fetchVehiculeById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3030/vehicule/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données du vehicule:', error);
        }
    };

    const handleCloseEditClientModal = () => setOpenEditClientModal(false);
    const handleOpenEditClientModal = async (idClient) => {
        setSelectedClientId(idClient);
        const clientData = await fetchClientById(idClient);
        formikEditClient.setValues(clientData);
        setOpenEditClientModal(true);
    };

    const handleCloseEditVehiculeModal = () => setOpenEditVehiculeModal(false);
    const handleOpenEditVehiculeModal = async (idVehicule) => {
        setSelectedVehiculeId(idVehicule);
        const VehiculeData = await fetchVehiculeById(idVehicule);
        formikVehicule.setValues(VehiculeData);
        setOpenEditVehiculeModal(true);
    };

    const loadMarques = async () => {
        try {
            const response = await axios.get('http://localhost:3030/marques');
            setMarques(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des marques", error);
        }
    };

    const loadCarrosseries = async () => {
        try {
            const response = await axios.get('http://localhost:3030/carrosseries');
            setCarrosseries(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des carrosseries", error);
        }
    };

    const loadEnergies = async () => {
        try {
            const response = await axios.get("http://localhost:3030/energies");
            setEnergies(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des énergies", error);
        }
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
            alert('Relance effectuer')
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
                const response1 = await axios.get(`http://localhost:3030/attestation-actif/${idContrat}`);
                setContrat(response.data);
                setQrCodeData(`Numéro police : ${response.data.numeroPolice}, Numéro attestation : ${response1.data}, Numéro contrat : ${response.data.numeroContrat}`);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:3030/genres');
                setGenres(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des genres:', error);
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

        fetchGenres();
        fetchEncaissements();
        fetchContrat();
        fetchTarif();
        fetchSinistres();
        fetchProceduresPaiements();
        loadMarques();
        loadCarrosseries();
        loadEnergies();
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
            numero_attestation: "",
            numero_contrat: ""
        },
        validationSchema: Yup.object({
            date_debut: Yup.string().required("La date de début du contrat est obligatoire"),
            duree: Yup.string().required("La durée du contrat est obligatoire"),
            reduction: Yup.string().required("La réduction du contrat est obligatoire"),
            numero_attestation: Yup.string().required("Le numéro d'attestation du contrat est obligatoire"),
            numero_contrat: Yup.string().required("Le numéro du contrat est obligatoire"),
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
                numero_attestation: values.numero_attestation,
                numero_contrat: values.numero_contrat

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

    const vehicule = {
        id_vehicule: "" || null,
        id_marque: "",
        id_carrosserie: "",
        id_energie: "",
        model: "",
        numero_chassit: "",
        puissance: "",
        numero_moteur: "",
        nombre_place: "",
        plaque_immatriculation: "",
        date_circulation: "",
        valeur_nette: "",
    };

    const formikVehicule = useFormik({
        initialValues: vehicule,
        validationSchema: Yup.object({
            id_marque: Yup.string().required("La marque est obligatoire"),
            id_carrosserie: Yup.string().required("La carrosserie est obligatoire"),
            id_energie: Yup.string().required("L'énergie est obligatoire"),
            model: Yup.string().required("Le modèle est obligatoire"),
            numero_chassit: Yup.string().required("Le numéro de châssis est obligatoire"),
            puissance: Yup.number()
                .required("La puissance est obligatoire")
                .positive("La puissance doit être un nombre positif"),
            numero_moteur: Yup.string().required("Le numéro de moteur est obligatoire"),
            nombre_place: Yup.number()
                .required("Le nombre de places est obligatoire")
                .positive("Le nombre de places doit être un nombre positif"),
            plaque_immatriculation: Yup.string().required("La plaque d'immatriculation est obligatoire"),
            date_circulation: Yup.date().required("La date de circulation est obligatoire"),
            valeur_nette: Yup.number()
                .required("La valeur nette est obligatoire")
                .positive("La valeur nette doit être un nombre positif"),
        }),
        onSubmit: async (values) => {
            try {
                const data = {
                    id_avenant: 4,
                    id_contrat: idContrat
                }
                await axios.post(`http://localhost:3030/avenant-contrat`, data);
                await axios.put(`http://localhost:3030/vehicule/${selectedVehiculeId}`, values);
                window.location.reload();
            } catch (error) {
                console.error('Échec de la mise à jour du client:', error);
            }
        },
    });

    const formikEditClient = useFormik({
        initialValues: {
            nom: '',
            prenom: '',
            date_naissance: '',
            adresse: '',
            contact: '',
            email: '',
            mdp: '',
            cin: '',
            id_genre: '',
        },
        validationSchema: Yup.object({
            nom: Yup.string().required('Nom requis'),
            prenom: Yup.string().required('Prénom requis'),
            date_naissance: Yup.string().required('Date de naissance requise'),
            adresse: Yup.string().required('Adresse requise'),
            contact: Yup.string().required('Contact requis'),
            email: Yup.string().email('Email invalide').required('Email requis'),
            mdp: Yup.string().required('Mot de passe requis'),
            cin: Yup.string().required('Numéro CIN requis'),
            id_genre: Yup.string().required('Genre requis'),
        }),
        onSubmit: async (values) => {
            try {
                const data = {
                    id_avenant: 5,
                    id_contrat: idContrat
                }
                await axios.post(`http://localhost:3030/avenant-contrat`, data);
                await axios.put(`http://localhost:3030/client/${selectedClientId}`, values);
                window.location.reload();
            } catch (error) {
                console.error('Échec de la mise à jour du client:', error);
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

    const handleAnnulerAvenant = async (idAvenant) => {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir annuler cet avenant ?");

        if (!confirmation) {
            return;
        }

        const data = {
            id_contrat: idContrat
        }

        console.log(data);
        await axios.put(`http://localhost:3030/annuler-avenant/${idAvenant}`, data);
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

    const statusAvenantLabels = {
        0: { color: 'error', title: 'Avenant annuler' },
        1: { color: 'success', title: 'Avenant valider' },
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

    function AvenantStatus({ status }) {
        const { color, title } = statusAvenantLabels[status] || { color: 'default', title: 'Inconnu' };
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

    useEffect(() => {
        if (qrCodeData) {
            QRCode.toCanvas(canvasRef.current, qrCodeData, (error) => {
                if (error) {
                    console.error('Erreur lors de la génération du QR Code:', error);
                }
            });
        }
    }, [qrCodeData]);

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
                                <DescriptionIcon sx={{ marginRight: 1 }} /> Détails du Contrat
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
                                <SecurityIcon sx={{ marginRight: 1 }} /> Garanties
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
                                        <MonetizationOnIcon sx={{ marginRight: 1 }} /> Liste des encaissements
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Montant</TableCell>
                                                <TableCell>Numéro de la pièce</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {encaissement.map((enc, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{formatDate(new Date(enc.dateEncaissement))}</TableCell>
                                                    <TableCell>{formatNombre(enc.montant)} </TableCell>
                                                    <TableCell> {enc.numeroPiece ?? 'espèces'} </TableCell>
                                                    <TableCell>
                                                        <PaiementStatus status={enc.status} />
                                                    </TableCell>
                                                    {enc.status !== 0 && role === 1 && (
                                                        <TableCell>
                                                            <DeleteOutline
                                                                sx={{ cursor: 'pointer', color: 'gray' }}
                                                                onClick={() => handleAnnulerEncaissement(enc.idEncaissement)}
                                                            />
                                                        </TableCell>
                                                    )}
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
                        {contrat?.avenants.length > 0 ? (
                            <Grid item xs={12}>
                                <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                                    <Typography variant="h6" sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                        <EditIcon sx={{ marginRight: 1 }} /> Liste des avenants
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Nom</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {contrat?.avenants.map((avenant, index) => (
                                                <TableRow key={index}>
                                                    <TableCell> {avenant.avenant?.nom}</TableCell>
                                                    <TableCell>{formatDate(new Date(avenant.dateCreation))}</TableCell>
                                                    <TableCell>
                                                        <AvenantStatus status={avenant.status} />
                                                    </TableCell>
                                                    {avenant?.status !== 0 && role === 1 && (
                                                        <TableCell>
                                                            <DeleteOutline
                                                                sx={{ cursor: 'pointer', color: 'gray' }}
                                                                onClick={() => handleAnnulerAvenant(avenant?.idAvenantContrat)}
                                                            />
                                                        </TableCell>
                                                    )}
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
                                <AttachMoneyIcon sx={{ marginRight: 1 }} />Facturation
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

                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ padding: 2, bgcolor: '#ffe6e6', borderRadius: 2 }}>
                            <Typography variant="h6" align="left" sx={{ color: 'red' }}>
                                <FileOutlined sx={{ marginRight: 1 }} /> Listes des numéros d'attestations
                            </Typography>
                            <ul>
                                {contrat?.numeroAttestation.map((numero, index) => (
                                    <li key={index}>{numero}</li>
                                ))}
                            </ul>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ padding: 2, bgcolor: 'white', borderRadius: 2 }}>
                            <Typography variant="h6" align="center" sx={{ color: 'red' }}>
                                <QrCode sx={{ marginRight: 1 }} /> QR Code du Contrat
                            </Typography>
                            <canvas ref={canvasRef} style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} />
                        </Paper>
                    </Grid>

                    <Modal open={openEditClientModal} onClose={handleCloseEditClientModal}>
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
                            <Typography variant="h4" ml={5}>
                                Modifier le client
                            </Typography>
                            <form onSubmit={formikEditClient.handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    margin="normal"
                                    {...formikEditClient.getFieldProps('nom')}
                                    error={formikEditClient.touched.nom && Boolean(formikEditClient.errors.nom)}
                                    helperText={formikEditClient.touched.nom && formikEditClient.errors.nom}
                                />
                                <TextField
                                    fullWidth
                                    label="Prénom"
                                    margin="normal"
                                    {...formikEditClient.getFieldProps('prenom')}
                                    error={formikEditClient.touched.prenom && Boolean(formikEditClient.errors.prenom)}
                                    helperText={formikEditClient.touched.prenom && formikEditClient.errors.prenom}
                                />
                                <TextField
                                    fullWidth
                                    label="Date de naissance"
                                    margin="normal"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...formikEditClient.getFieldProps('date_naissance')}
                                    error={formikEditClient.touched.date_naissance && Boolean(formikEditClient.errors.date_naissance)}
                                    helperText={formikEditClient.touched.date_naissance && formikEditClient.errors.date_naissance}
                                />
                                <TextField
                                    fullWidth
                                    label="Adresse"
                                    margin="normal"
                                    {...formikEditClient.getFieldProps('adresse')}
                                    error={formikEditClient.touched.adresse && Boolean(formikEditClient.errors.adresse)}
                                    helperText={formikEditClient.touched.adresse && formikEditClient.errors.adresse}
                                />
                                <TextField
                                    fullWidth
                                    label="Contact"
                                    margin="normal"
                                    {...formikEditClient.getFieldProps('contact')}
                                    error={formikEditClient.touched.contact && Boolean(formikEditClient.errors.contact)}
                                    helperText={formikEditClient.touched.contact && formikEditClient.errors.contact}
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    margin="normal"
                                    {...formikEditClient.getFieldProps('email')}
                                    error={formikEditClient.touched.email && Boolean(formikEditClient.errors.email)}
                                    helperText={formikEditClient.touched.email && formikEditClient.errors.email}
                                />
                                <TextField
                                    fullWidth
                                    label="Mot de passe"
                                    margin="normal"
                                    type="password"
                                    {...formikEditClient.getFieldProps('mdp')}
                                    error={formikEditClient.touched.mdp && Boolean(formikEditClient.errors.mdp)}
                                    helperText={formikEditClient.touched.mdp && formikEditClient.errors.mdp}
                                />
                                <TextField
                                    fullWidth
                                    label="Numéro CIN"
                                    margin="normal"
                                    {...formikEditClient.getFieldProps('cin')}
                                    error={formikEditClient.touched.cin && Boolean(formikEditClient.errors.cin)}
                                    helperText={formikEditClient.touched.cin && formikEditClient.errors.cin}
                                />
                                <FormControl fullWidth sx={{ marginTop: 2 }}>
                                    <InputLabel id="genre-label">Genre</InputLabel>
                                    <Select
                                        labelId="genre-label"
                                        {...formikEditClient.getFieldProps('id_genre')}
                                        error={formikEditClient.touched.id_genre && Boolean(formikEditClient.errors.id_genre)}
                                    >
                                        <MenuItem value="">
                                            <em>-- Sélectionnez un genre --</em>
                                        </MenuItem>
                                        {genres.map((item) => (
                                            <MenuItem key={item.id_genre} value={item.id_genre}>
                                                {item.nom}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formikEditClient.touched.id_genre && formikEditClient.errors.id_genre && (
                                        <FormHelperText error>{formikEditClient.errors.id_genre}</FormHelperText>
                                    )}
                                </FormControl>
                                <Button type="submit" color='error' variant="contained" fullWidth sx={{ mt: 2 }}>
                                    Modifier
                                </Button>
                            </form>
                        </Box>
                    </Modal>

                    <Modal open={openEditVehiculeModal} onClose={handleCloseEditVehiculeModal}>
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
                            <Typography variant="h4" ml={5}>
                                Modifier le vehicule
                            </Typography>
                            <form onSubmit={formikVehicule.handleSubmit}>
                                <Grid container spacing={3}>
                                    {/* Sélectionner marque */}
                                    < Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Marque</InputLabel>
                                            <Select
                                                name="id_marque"
                                                value={formikVehicule.values.id_marque}
                                                {...formikVehicule.getFieldProps('id_marque')}
                                            >
                                                {marques.map((marque) => (
                                                    <MenuItem key={marque.id_marque} value={marque.id_marque}>
                                                        {marque.nom}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formikVehicule.touched.id_marque && formikVehicule.errors.id_marque ? (
                                                <Typography color="error">{formikVehicule.errors.id_marque}</Typography>
                                            ) : null}
                                        </FormControl>
                                    </Grid>

                                    {/* Sélectionner carrosserie */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Carrosserie</InputLabel>
                                            <Select
                                                name="id_carrosserie"
                                                value={formikVehicule.values.id_carrosserie}
                                                {...formikVehicule.getFieldProps('id_carrosserie')}

                                            >
                                                {carrosseries.map((carrosserie) => (
                                                    <MenuItem key={carrosserie.id_carrosserie} value={carrosserie.id_carrosserie}>
                                                        {carrosserie.nom}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formikVehicule.touched.id_carrosserie && formikVehicule.errors.id_carrosserie ? (
                                                <Typography color="error">{formikVehicule.errors.id_carrosserie}</Typography>
                                            ) : null}
                                        </FormControl>
                                    </Grid>

                                    {/* Sélectionner énergie */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Énergie</InputLabel>
                                            <Select
                                                name="id_energie"
                                                value={formikVehicule.values.id_energie}
                                                {...formikVehicule.getFieldProps('id_energie')}

                                            >
                                                {energies.map((energie) => (
                                                    <MenuItem key={energie.id_energie} value={energie.id_energie}>
                                                        {energie.nom}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formikVehicule.touched.id_energie && formikVehicule.errors.id_energie ? (
                                                <Typography color="error">{formikVehicule.errors.id_energie}</Typography>
                                            ) : null}
                                        </FormControl>
                                    </Grid>

                                    {/* Champs texte */}
                                    {[
                                        { name: "model", label: "Modèle" },
                                        { name: "numero_chassit", label: "Numéro de Châssis" },
                                        { name: "puissance", label: "Puissance", type: "number" },
                                        { name: "numero_moteur", label: "Numéro de Moteur" },
                                        { name: "nombre_place", label: "Nombre de Places", type: "number" },
                                        { name: "plaque_immatriculation", label: "Plaque d'immatriculation" },
                                        { name: "date_circulation", label: "Date de Circulation", type: "date" },
                                        { name: "valeur_nette", label: "Valeur Nette", type: "number" },
                                    ].map(({ name, label, type = "text" }) => (
                                        <Grid item xs={12} sm={6} key={name}>
                                            <TextField
                                                fullWidth
                                                label={label}
                                                name={name}
                                                type={type}
                                                value={formikVehicule.values[name]}
                                                {...formikVehicule.getFieldProps(name)}
                                                error={formikVehicule.touched[name] && Boolean(formikVehicule.errors[name])}
                                                helperText={formikVehicule.touched[name] && formikVehicule.errors[name]}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        modifier
                                    </Button>
                                </Grid>
                            </form>
                        </Box>
                    </Modal>

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

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Numéro du nouveau contrat"
                                            margin="normal"
                                            {...formikContratInfo.getFieldProps("numero_contrat")}
                                            error={formikContratInfo.touched.numero_contrat && Boolean(formikContratInfo.errors.numero_contrat)}
                                            helperText={formikContratInfo.touched.numero_contrat && formikContratInfo.errors.numero_contrat}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Numéro de la nouvelle attestation"
                                            margin="normal"
                                            {...formikContratInfo.getFieldProps("numero_attestation")}
                                            error={formikContratInfo.touched.numero_attestation && Boolean(formikContratInfo.errors.numero_attestation)}
                                            helperText={formikContratInfo.touched.numero_attestation && formikContratInfo.errors.numero_attestation}
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

                    {contrat.status !== 5 && (
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

                    {contrat.status !== 0 && (
                        <>
                            <Button
                                variant="contained"
                                onClick={() => handleOpenEditClientModal(contrat?.client?.idClient)}
                                sx={{ ml: 2, mt: 3, bgcolor: 'grey', ':hover': { bgcolor: 'darkgrey' }, color: 'white' }}
                            >
                                Modifier le client
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => handleOpenEditVehiculeModal(contrat?.vehicule?.idVehicule)}
                                sx={{ ml: 2, mt: 3, bgcolor: 'grey', ':hover': { bgcolor: 'darkgrey' }, color: 'white' }}
                            >
                                Modifier le vehicule
                            </Button>
                        </>
                    )}

                    {contrat.status !== 0 && Math.round(sumEncaissements) < Math.round(contrat.montantTotal) && (
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
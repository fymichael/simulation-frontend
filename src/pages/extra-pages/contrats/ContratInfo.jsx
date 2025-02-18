import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Box,
    Button,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    FormControlLabel,
    FormLabel,
    Checkbox,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    IconButton,
    RadioGroup,
    Radio
} from "@mui/material";
import axios from "axios";
import { AddCircleOutline, Delete } from '@mui/icons-material';
import { decodeToken } from "utils/authTokens";
import { useNavigate } from "react-router";
import { Snackbar, Alert } from "@mui/material";

const ContratSection = () => {
    const navigate = useNavigate();
    const [exonerations, setExonerations] = useState([]);
    const [classifications, setClassifications] = useState([]);
    const [garanties, setGaranties] = useState([]);
    const [selectedGaranties, setSelectedGaranties] = useState([]);
    const [paiements, setPaiements] = useState([]);
    const [lastClients, setLastClients] = useState([]);
    const [lastVehicules, setLastVehicules] = useState([]);
    const [datePaiement, setDatePaiement] = useState("");
    const [pourcentagePaiement, setPourcentagePaiement] = useState("");
    const [csvFile, setCsvFile] = useState(null);
    const [isCsvUpload, setIsCsvUpload] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [typePaiements, setTypePaiements] = useState([]);


    // Fonction pour charger les données des clients et véhicules
    const insertClientVehiculeData = async () => {
        if (sessionStorage.getItem('client') !== null) {
            const clientData = JSON.parse(sessionStorage.getItem('client'));
            await axios.post("http://localhost:3030/client", clientData);
        }
        if (sessionStorage.getItem('vehicule') !== null) {
            const vehiculeData = JSON.parse(sessionStorage.getItem('vehicule'));
            await axios.post("http://localhost:3030/vehicule", vehiculeData);
        }
    };

    // Fonctions pour charger les données
    const loadExonerations = async () => {
        try {
            const response = await axios.get("http://localhost:3030/exonerations");
            setExonerations(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des exonérations", error);
        }
    };

    const loadClassifications = async () => {
        try {
            const response = await axios.get("http://localhost:3030/classifications");
            setClassifications(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des classifications", error);
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

    const fetchTypeEncaissement = async () => {
        try {
            const response = await axios.get(`http://localhost:3030/type_paiements`);
            console.log(response.data);
            setTypePaiements(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const lastClient = async () => {
        try {
            const response = await axios.get("http://localhost:3030/last-clients");
            setLastClients(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des clients", error);
        }
    };

    const lastVehicule = async () => {
        try {
            const response = await axios.get("http://localhost:3030/last-vehicules");
            setLastVehicules(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des véhicules", error);
        }
    };

    // Effet pour charger les données au démarrage
    useEffect(() => {
        const loadData = async () => {
            await insertClientVehiculeData();
            await Promise.all([fetchTypeEncaissement(), loadExonerations(), loadClassifications(), loadGaranties(), lastClient(), lastVehicule()]);
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

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedGaranties((prevState) =>
            prevState.includes(value)
                ? prevState.filter((id_garantie) => id_garantie !== value)
                : [...prevState, value]
        );
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCsvFile(file);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleUploadCsv = async () => {
        if (!csvFile) {
            alert("Veuillez sélectionner un fichier CSV avant de procéder.");
            return;
        }

        const formData = new FormData();
        formData.append("file", csvFile);

        const fileName = csvFile.name;
        try {
            await axios.post(`http://localhost:3030/csv/contrat`, {
                fileName: fileName,
            });
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Erreur lors de la lecture du fichier CSV", error);
            alert("Une erreur est survenue lors de la lecture du fichier CSV.");
        }
    };


    const handleDeletePaiement = (index) => {
        setPaiements(paiements.filter((_, i) => i !== index));
    };

    const formikContratInfo = useFormik({
        initialValues: {
            date_debut: "",
            duree: "",
            id_classification: "",
            reduction: "",
            id_exoneration: "",
            id_type_paiement: ""
        },
        validationSchema: Yup.object({
            date_debut: Yup.string().required("La date de début du contrat est obligatoire"),
            duree: Yup.string().required("La durée du contrat est obligatoire"),
            id_classification: Yup.string().required("La classification du véhicule est obligatoire"),
            reduction: Yup.string().required("La réduction du contrat est obligatoire"),
            id_exoneration: Yup.string().required("L'exonération du contrat est obligatoire"),
            id_type_paiement: Yup.string().required("Le type de paiement du contrat est obligatoire"),
        }),
        onSubmit: async (values) => {
            const token = decodeToken();
            const data = {
                id_client: sessionStorage.getItem('clientId'),
                id_vehicule: lastVehicules.idVehicule,
                date_debut: values.date_debut,
                duree: parseInt(values.duree),
                id_classification: parseInt(values.id_classification),
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
                id_type_paiement: values.id_type_paiement
            };

            try {
                if (sessionStorage.getItem('clientId') === null) {
                    data.id_client = lastClients.idClient;
                }
                await axios.post("http://localhost:3030/contrat", data);
                sessionStorage.removeItem('clientId');
                sessionStorage.removeItem('client');
                sessionStorage.removeItem('vehicule');

                alert('Insertion du contrat réussi !')
            } catch (error) {
                console.error("Erreur lors de l'ajout du contrat", error);
                alert("Une erreur est survenue lors de l'ajout du contrat.");
            }
        },
    });

    return (
        <Box>
            <Typography variant="h4" align="left" gutterBottom>
                A propos du contrat
            </Typography>
            <form onSubmit={formikContratInfo.handleSubmit}>
                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Uploader un fichier CSV</FormLabel>
                        <RadioGroup
                            row
                            value={isCsvUpload ? "yes" : "no"}
                            onChange={(e) => setIsCsvUpload(e.target.value === "yes")}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Oui" />
                            <FormControlLabel value="no" control={<Radio />} label="Non" />
                        </RadioGroup>
                    </FormControl>
                    {isCsvUpload ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            p={4}
                            border="1px solid #ddd"
                            borderRadius="8px"
                            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                            bgcolor="#f9f9f9"
                            maxWidth={400}
                            mx="auto"
                        >
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                                Télécharger un fichier CSV
                            </Typography>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{
                                    marginBottom: 20,
                                    display: 'block',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                }}
                            />
                            <Button
                                onClick={handleUploadCsv}
                                variant="contained"
                                color="error"
                                size="large"
                                style={{ marginTop: 10 }}
                            >
                                Télécharger CSV
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Date de début"
                                    margin="normal"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    {...formikContratInfo.getFieldProps("date_debut")}
                                    error={formikContratInfo.touched.date_debut && Boolean(formikContratInfo.errors.date_debut)}
                                    helperText={formikContratInfo.touched.date_debut && formikContratInfo.errors.date_debut}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Durée"
                                    margin="normal"
                                    {...formikContratInfo.getFieldProps("duree")}
                                    error={formikContratInfo.touched.duree && Boolean(formikContratInfo.errors.duree)}
                                    helperText={formikContratInfo.touched.duree && formikContratInfo.errors.duree}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
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
                                    <InputLabel id="paiements-label"> Le type de paiement </InputLabel>
                                    <Select
                                        labelId="paiements-label"
                                        {...formikContratInfo.getFieldProps("id_type_paiement")}
                                    >
                                        <MenuItem value="">
                                            <em>-- Sélectionnez le type de paiement --</em>
                                        </MenuItem>
                                        {typePaiements.map((item) => (
                                            <MenuItem key={item.id_type_paiement} value={item.id_type_paiement}>
                                                {item.nom}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formikContratInfo.touched.id_type_paiement && formikContratInfo.errors.id_type_paiement && (
                                        <FormHelperText error>{formikContratInfo.errors.id_type_paiement}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item sm={12}>
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel id="classification-label">Classification</InputLabel>
                                    <Select
                                        labelId="classification-label"
                                        {...formikContratInfo.getFieldProps("id_classification")}
                                        error={formikContratInfo.touched.id_classification && Boolean(formikContratInfo.errors.id_classification)}
                                    >
                                        <MenuItem value="">
                                            <em>-- Classification du véhicule --</em>
                                        </MenuItem>
                                        {classifications.map((item) => (
                                            <MenuItem key={item.id_classification} value={item.id_classification}>
                                                {item.nom}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formikContratInfo.touched.id_classification && formikContratInfo.errors.id_classification && (
                                        <FormHelperText error>{formikContratInfo.errors.id_classification}</FormHelperText>
                                    )}
                                </FormControl>
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
                                <FormControl component="fieldset" fullWidth>
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
                            <Box>
                                <Typography variant="h4" sx={{ mt: 2 }}>
                                    Procédure de Paiement
                                </Typography>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
                                        <TextField
                                            label="Date Paiement"
                                            type="date"
                                            value={datePaiement}
                                            onChange={(e) => setDatePaiement(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
                                        <TextField
                                            label="Pourcentage"
                                            type="number"
                                            value={pourcentagePaiement}
                                            onChange={(e) => setPourcentagePaiement(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleAddPaiement}
                                            startIcon={<AddCircleOutline />}
                                        >
                                            Ajouter Paiement
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Pourcentage</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paiements.map((paiement, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{paiement.date}</TableCell>
                                                <TableCell>{paiement.pourcentage}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleDeletePaiement(index)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                            <Grid item sm={12}>
                                <Button type="submit" variant="contained" color="error" fullWidth sx={{ mt: 3 }}>
                                    Valider
                                </Button>
                            </Grid>
                        </Grid>
                    )};
                </Grid>
            </form>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Insertion terminée avec succès !
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ContratSection;
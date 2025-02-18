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
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";

const ClientClasse = {
    id_client: "",
    nom: "",
    prenom: "",
    date_naissance: "",
    adresse: "",
    contact: "",
    email: "",
    mdp: "",
    cin: "",
    id_genre: ""
};

const ClientSelection = () => {
    const [clients, setClients] = useState([]);
    const [genres, setGenres] = useState([]);
    const [clientType, setClientType] = useState("nouveau");
    const [csvFile, setCsvFile] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);



    const loadGenres = async () => {
        try {
            const response = await axios.get("http://localhost:3030/genres");
            setGenres(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des genres", error);
        }
    };

    const loadClients = async () => {
        try {
            const response = await axios.get("http://localhost:3030/clients");
            setClients(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des clients", error);
        }
    };

    useEffect(() => {
        loadGenres();
        loadClients();
    }, []);

    const formikNewClient = useFormik({
        initialValues: ClientClasse,
        validationSchema: Yup.object({
            nom: Yup.string().required("Le nom est obligatoire"),
            prenom: Yup.string().required("Le prénom est obligatoire"),
            date_naissance: Yup.date().required("La date de naissance est obligatoire"),
            adresse: Yup.string().required("L'adresse est obligatoire"),
            contact: Yup.string().required("Le contact est obligatoire"),
            email: Yup.string().email("Email invalide").required("L'email est obligatoire"),
            mdp: Yup.string().required("Le mot de passe est obligatoire"),
            cin: Yup.string().required("Le numéro CIN est obligatoire"),
            id_genre: Yup.string().required("Le genre est obligatoire"),
        })
    });

    const handleClientTypeChange = (event) => {
        setClientType(event.target.value);
    };

    const handleExistingClientChange = (event) => {
        const clientId = event.target.value;
        sessionStorage.setItem("clientId", clientId);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        formikNewClient.setFieldValue(name, value);

        const updatedClient = { ...formikNewClient.values, [name]: value };
        sessionStorage.setItem("client", JSON.stringify(updatedClient));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCsvFile(file);
        }
    };

    const handleUploadCsv = async () => {
        if (!csvFile) {
            alert("Veuillez sélectionner un fichier CSV avant de procéder.");
            return;
        }

        const fileName = csvFile.name;
        console.log(fileName);
        try {
            await axios.post(`http://localhost:3030/csv/client`, {
                fileName: fileName,
            });
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Erreur lors de la lecture du fichier CSV", error);
            alert("Une erreur est survenue lors de la lecture du fichier CSV.");
        }

    };

    return (
        <Box>
            <Typography variant="h4" align="left" gutterBottom>
                A propos du client
            </Typography>

            <RadioGroup
                row
                value={clientType}
                onChange={handleClientTypeChange}
                sx={{ mb: 2 }}
            >
                <FormControlLabel value="nouveau" control={<Radio />} label="Nouveau client" />
                <FormControlLabel value="existant" control={<Radio />} label="Client existant" />
                <FormControlLabel value="csv" control={<Radio />} label="Télécharger un fichier CSV" />
            </RadioGroup>

            {clientType === "nouveau" ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nom"
                            name="nom"
                            margin="normal"
                            onChange={handleChange}
                            value={formikNewClient.values.nom}
                            error={formikNewClient.touched.nom && Boolean(formikNewClient.errors.nom)}
                            helperText={formikNewClient.touched.nom && formikNewClient.errors.nom}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Prénom"
                            name="prenom"
                            margin="normal"
                            onChange={handleChange}
                            value={formikNewClient.values.prenom}
                            error={formikNewClient.touched.prenom && Boolean(formikNewClient.errors.prenom)}
                            helperText={formikNewClient.touched.prenom && formikNewClient.errors.prenom}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            label="Date de naissance"
                            name="date_naissance"
                            margin="normal"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                            value={formikNewClient.values.date_naissance}
                            error={formikNewClient.touched.date_naissance && Boolean(formikNewClient.errors.date_naissance)}
                            helperText={formikNewClient.touched.date_naissance && formikNewClient.errors.date_naissance}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Adresse"
                            name="adresse"
                            margin="normal"
                            onChange={handleChange}
                            value={formikNewClient.values.adresse}
                            error={formikNewClient.touched.adresse && Boolean(formikNewClient.errors.adresse)}
                            helperText={formikNewClient.touched.adresse && formikNewClient.errors.adresse}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Contact"
                            name="contact"
                            margin="normal"
                            onChange={handleChange}
                            value={formikNewClient.values.contact}
                            error={formikNewClient.touched.contact && Boolean(formikNewClient.errors.contact)}
                            helperText={formikNewClient.touched.contact && formikNewClient.errors.contact}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            margin="normal"
                            onChange={handleChange}
                            value={formikNewClient.values.email}
                            error={formikNewClient.touched.email && Boolean(formikNewClient.errors.email)}
                            helperText={formikNewClient.touched.email && formikNewClient.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Mot de passe"
                            name="mdp"
                            margin="normal"
                            type="password"
                            onChange={handleChange}
                            value={formikNewClient.values.mdp}
                            error={formikNewClient.touched.mdp && Boolean(formikNewClient.errors.mdp)}
                            helperText={formikNewClient.touched.mdp && formikNewClient.errors.mdp}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            fullWidth
                            label="Numéro CIN"
                            name="cin"
                            margin="normal"
                            onChange={handleChange}
                            value={formikNewClient.values.cin}
                            error={formikNewClient.touched.cin && Boolean(formikNewClient.errors.cin)}
                            helperText={formikNewClient.touched.cin && formikNewClient.errors.cin}
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="genre-label">Genre</InputLabel>
                            <Select
                                labelId="genre-label"
                                name="id_genre"
                                onChange={handleChange}
                                value={formikNewClient.values.id_genre}
                                error={formikNewClient.touched.id_genre && Boolean(formikNewClient.errors.id_genre)}
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
                            {formikNewClient.touched.id_genre && formikNewClient.errors.id_genre && (
                                <FormHelperText error>{formikNewClient.errors.id_genre}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            ) : clientType === "existant" ? (
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="client-label">Choisir un client existant</InputLabel>
                    <Select
                        labelId="client-label"
                        onChange={handleExistingClientChange}
                    >
                        <MenuItem value="">
                            <em>-- Sélectionnez un client --</em>
                        </MenuItem>
                        {clients.map((client) => (
                            <MenuItem key={client.idClient} value={client.idClient}>
                                {client.nom} {client.prenom}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
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
            )}
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

export default ClientSelection;
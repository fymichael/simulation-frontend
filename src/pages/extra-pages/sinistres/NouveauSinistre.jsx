import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
    Box,
    Button,
    Typography,
    MenuItem,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    TextField,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
    apiKey: "AIzaSyAgOXkuYSkV9GhAxHmelyEXqhXdmtNDrzc",
    authDomain: "cloud-3324f.firebaseapp.com",
    projectId: "cloud-3324f",
    storageBucket: "cloud-3324f.appspot.com",
    messagingSenderId: "363453581998",
    appId: "1:363453581998:web:083a1d7929966373387b3f",
};

initializeApp(firebaseConfig);
const storage = getStorage();

const NouveauSinistre = () => {
    const navigate = useNavigate();
    const [contrats, setContrats] = useState([]);
    const [typesAccident, setTypesAccident] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localImages, setLocalImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const contratResponse = await axios.get("http://localhost:3030/contrats");
                const typeAccidentResponse = await axios.get("http://localhost:3030/typeAccidents");
                setContrats(contratResponse.data);
                setTypesAccident(typeAccidentResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const validationSchema = Yup.object().shape({
        id_contrat: Yup.string().required("Numéro de police requis"),
        date_heure_incident: Yup.date().required("Date et heure de l'incident requises"),
        lieu_incident: Yup.string().required("Lieu de l'incident requis"),
        description: Yup.string().required("Description requise"),
        expert: Yup.boolean().required("Faire appel à un expert est requis"),
        id_type_accident: Yup.string().required("Type d'accident requis"),
        liens: Yup.array()
            .of(Yup.string().url("URL invalide"))
            .min(1, "Au moins une image est requise"),
    });

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files) {
            const newLocalImages = Array.from(files).map((file) => ({
                file,
                name: file.name,
            }));
            setLocalImages((prevImages) => [...prevImages, ...newLocalImages]);
        }
    };

    const handleDeleteLocalImage = (index) => {
        const updatedImages = [...localImages];
        updatedImages.splice(index, 1);
        setLocalImages(updatedImages);
    };

    const handleUploadImages = async () => {
        const uploadPromises = localImages.map((image) => {
            const storageRef = ref(storage, `sinistres/${image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image.file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    null,
                    (error) => reject(error),
                    async () => {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadUrl);
                    }
                );
            });
        });

        return Promise.all(uploadPromises);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const uploadedLinks = await handleUploadImages();
            const transformedValues = {
                ...values,
                expert: values.expert ? 1 : 0,
                liens: uploadedLinks,
            };

            await axios.post("http://localhost:3030/sinistre", transformedValues);
            navigate("/nyhavana/sinistre");
            resetForm();
            setLocalImages([]);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'ajout du sinistre.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Typography variant="h6" sx={{ textAlign: "center" }}>Chargement...</Typography>;
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "20px auto",
                padding: 3,
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
                borderRadius: 3,
                backgroundColor: "#f5f5f5",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    textAlign: "center",
                    marginBottom: 3,
                    color: "#d32f2f",
                    fontWeight: 600,
                }}
            >
                Ajouter un Nouveau Sinistre
            </Typography>
            <Formik
                initialValues={{
                    id_contrat: "",
                    date_heure_incident: "",
                    lieu_incident: "",
                    description: "",
                    expert: false,
                    id_type_accident: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        <Box sx={{ marginBottom: 2 }}>
                            <FormControl fullWidth>
                                <Field
                                    name="id_contrat"
                                    as={TextField}
                                    select
                                    label="Numéro de Police"
                                    variant="outlined"
                                    helperText={<ErrorMessage name="id_contrat" />}
                                >
                                    {contrats.map((contrat) => (
                                        <MenuItem key={contrat.id_contrat} value={contrat.id_contrat}>
                                            {contrat.numeroPolice}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </FormControl>
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <Field
                                name="date_heure_incident"
                                as={TextField}
                                type="datetime-local"
                                fullWidth
                                variant="outlined"
                                label="Date et Heure de l'Incident"
                                helperText={<ErrorMessage name="date_heure_incident" />}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <Field
                                name="lieu_incident"
                                as={TextField}
                                fullWidth
                                variant="outlined"
                                label="Lieu de l'Incident"
                                helperText={<ErrorMessage name="lieu_incident" />}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <Field
                                name="description"
                                as={TextField}
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                label="Description de l'Incident"
                                helperText={<ErrorMessage name="description" />}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <Typography variant="subtitle1">Faire Appel à un Expert ?</Typography>
                            <RadioGroup
                                row
                                name="expert"
                                value={String(values.expert)}
                                onChange={(e) => (values.expert = e.target.value === "true")}
                            >
                                <FormControlLabel value="true" control={<Radio />} label="Oui" />
                                <FormControlLabel value="false" control={<Radio />} label="Non" />
                            </RadioGroup>
                            <ErrorMessage name="expert" component="div" />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <FormControl fullWidth>
                                <Field
                                    name="id_type_accident"
                                    as={TextField}
                                    select
                                    label="Type d'Accident"
                                    variant="outlined"
                                    helperText={<ErrorMessage name="id_type_accident" />}
                                >
                                    {typesAccident.map((type) => (
                                        <MenuItem key={type.id_type_accident} value={type.id_type_accident}>
                                            {type.nom}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </FormControl>
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <label htmlFor="images">Télécharger des Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                style={{
                                    display: "block",
                                    marginTop: "5px",
                                }}
                            />
                            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
                                {localImages.map((image, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: "relative",
                                            marginRight: 2,
                                            marginBottom: 2,
                                        }}
                                    >
                                        <img
                                            src={URL.createObjectURL(image.file)}
                                            alt={image.name}
                                            style={{
                                                height: 100,
                                                width: 100,
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                border: "2px solid #d32f2f",
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteLocalImage(index)}
                                            sx={{
                                                position: "absolute",
                                                top: -10,
                                                right: -10,
                                                backgroundColor: "#fff",
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Box sx={{ textAlign: "center" }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="error"
                                disabled={isSubmitting}
                                startIcon={<CloudUpload />}
                            >
                                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default NouveauSinistre;
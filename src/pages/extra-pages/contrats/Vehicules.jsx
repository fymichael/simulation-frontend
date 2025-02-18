import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Box
} from "@mui/material";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";

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

const InsertVehicule = () => {
  const [marques, setMarques] = useState([]);
  const [carrosseries, setCarrosseries] = useState([]);
  const [energies, setEnergies] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [isCsvUpload, setIsCsvUpload] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);


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

  // Fonction pour gérer les changements de champ
  const handleChange = (event) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value);

    const updatedVehicule = { ...formik.values, [name]: value };
    sessionStorage.setItem("vehicule", JSON.stringify(updatedVehicule));
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
    console.log(fileName);
    try {
      await axios.post(`http://localhost:3030/csv/vehicule`, {
        fileName: fileName,
      });
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier CSV", error);
      alert("Une erreur est survenue lors de la lecture du fichier CSV.");
    }

  };

  useEffect(() => {
    loadMarques();
    loadCarrosseries();
    loadEnergies();
  }, []);

  const formik = useFormik({
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
    })
  });

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Ajouter un Véhicule
      </Typography>
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
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Sélectionner marque */}
            < Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Marque</InputLabel>
                <Select
                  name="id_marque"
                  value={formik.values.id_marque}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                >
                  {marques.map((marque) => (
                    <MenuItem key={marque.id_marque} value={marque.id_marque}>
                      {marque.nom}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.id_marque && formik.errors.id_marque ? (
                  <Typography color="error">{formik.errors.id_marque}</Typography>
                ) : null}
              </FormControl>
            </Grid>

            {/* Sélectionner carrosserie */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Carrosserie</InputLabel>
                <Select
                  name="id_carrosserie"
                  value={formik.values.id_carrosserie}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                >
                  {carrosseries.map((carrosserie) => (
                    <MenuItem key={carrosserie.id_carrosserie} value={carrosserie.id_carrosserie}>
                      {carrosserie.nom}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.id_carrosserie && formik.errors.id_carrosserie ? (
                  <Typography color="error">{formik.errors.id_carrosserie}</Typography>
                ) : null}
              </FormControl>
            </Grid>

            {/* Sélectionner énergie */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Énergie</InputLabel>
                <Select
                  name="id_energie"
                  value={formik.values.id_energie}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                >
                  {energies.map((energie) => (
                    <MenuItem key={energie.id_energie} value={energie.id_energie}>
                      {energie.nom}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.id_energie && formik.errors.id_energie ? (
                  <Typography color="error">{formik.errors.id_energie}</Typography>
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
                  value={formik.values[name]}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[name] && Boolean(formik.errors[name])}
                  helperText={formik.touched[name] && formik.errors[name]}
                />
              </Grid>
            ))}
          </Grid>
        </form>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Opération terminer !
        </Alert>
      </Snackbar>

    </div >
  );
};

export default InsertVehicule;

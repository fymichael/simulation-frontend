import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    FormHelperText,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TableCell,
    TableBody,
    TableContainer,
    TableRow,
    Table,
    TableHead
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';

function formatNombre(number) {
    return number.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const Simulation = () => {
    const [exonerations, setExonerations] = useState([]);
    const [classifications, setClassifications] = useState([]);
    const [garanties, setGaranties] = useState([]);
    const [selectedGaranties, setSelectedGaranties] = useState([]);
    const [resultats, setResultats] = useState(null);
    const [energies, setEnergies] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const { toPDF, targetRef } = usePDF({
        filename: `resultats_simulation.pdf`,
    });
    const navigate = useNavigate();

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

    const loadEnergies = async () => {
        try {
            const response = await axios.get("http://localhost:3030/energies");
            setEnergies(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des énergies", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([loadExonerations(), loadClassifications(), loadGaranties(), loadEnergies()]);
        };
        loadData();
    }, []);

    const formikContratInfo = useFormik({
        initialValues: {
            puissance: "",
            id_energie: "",
            valeur_nette: "",
            duree: "",
            reduction: "",
            id_exoneration: "",
            id_classification: "",
        },
        validationSchema: Yup.object({
            puissance: Yup.string().required("La puissance du véhicule est obligatoire"),
            id_energie: Yup.string().required("L'énergie du véhicule est obligatoire"),
            valeur_nette: Yup.string().required("La valeur nette du véhicule est obligatoire"),
            duree: Yup.string().required("La durée du contrat est obligatoire"),
            reduction: Yup.string().required("La réduction du contrat est obligatoire"),
            id_exoneration: Yup.string().required("L'exonération du contrat est obligatoire"),
            id_classification: Yup.string().required("La classification est obligatoire"),
        }),
        onSubmit: async (values) => {
            const data = {
                puissance: values.puissance,
                id_energie: values.id_energie,
                valeur_nette: values.valeur_nette,
                duree: parseInt(values.duree),
                id_classification: parseInt(values.id_classification),
                reduction: parseInt(values.reduction),
                id_exoneration: parseInt(values.id_exoneration),
                garanties: selectedGaranties.map((id_garantie) => ({
                    id_garantie: parseInt(id_garantie),
                })),
            };

            try {
                const response = await axios.post(`http://localhost:3030/simulation`, data);
                setResultats(response.data);
                setOpenModal(true);
            } catch (error) {
                console.log(data);
                console.error("Erreur lors de l'ajout du contrat", error);
                alert("Une erreur est survenue lors de l'ajout du contrat.");
            }
        },
    });

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedGaranties((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate(0);
    };

    return (
        <Box
            sx={{
                padding: 3,
                bgcolor: '#ffffff',
                borderRadius: 2,
                maxWidth: 600,
                margin: 'auto',
                mt: 5,
                boxShadow: 24,
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Simulation
            </Typography>

            <form onSubmit={formikContratInfo.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Puissance"
                            margin="normal"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            {...formikContratInfo.getFieldProps("puissance")}
                            error={formikContratInfo.touched.puissance && Boolean(formikContratInfo.errors.puissance)}
                            helperText={formikContratInfo.touched.puissance && formikContratInfo.errors.puissance}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Valeur nette"
                            margin="normal"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            {...formikContratInfo.getFieldProps("valeur_nette")}
                            error={formikContratInfo.touched.valeur_nette && Boolean(formikContratInfo.errors.valeur_nette)}
                            helperText={formikContratInfo.touched.valeur_nette && formikContratInfo.errors.valeur_nette}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="energie-label">Énergie</InputLabel>
                            <Select
                                labelId="energie-label"
                                {...formikContratInfo.getFieldProps("id_energie")}
                                error={formikContratInfo.touched.id_energie && Boolean(formikContratInfo.errors.id_energie)}
                            >
                                {energies.map((energie) => (
                                    <MenuItem key={energie.id_energie} value={energie.id_energie}>
                                        {energie.nom}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formikContratInfo.touched.id_energie && formikContratInfo.errors.id_energie ? (
                                <Typography>{formikContratInfo.errors.id_energie}</Typography>
                            ) : null}
                        </FormControl>
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

            {/* Modal pour afficher les résultats */}
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth ref={targetRef}>
                <DialogContent >
                    {resultats && (
                        <Box ref={targetRef}>
                            <DialogTitle variant='h4' sx={{ ml: 28, mb: 2 }}>Résultats de la Simulation</DialogTitle>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>TACAVA (Ar)</TableCell>
                                            <TableCell>TVA (Ar)</TableCell>
                                            <TableCell>TE (Ar)</TableCell>
                                            <TableCell>IMP (Ar)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{formatNombre(resultats.tacava)}</TableCell>
                                            <TableCell>{formatNombre(resultats.tva)}</TableCell>
                                            <TableCell>{formatNombre(resultats.te)}</TableCell>
                                            <TableCell>{formatNombre(resultats.imp)}</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography sx={{ mt: 2 }}>
                                Accesssoires : {formatNombre(resultats.accessoires)} Ar
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                Total Taxe : {formatNombre(resultats.montant_exoneration)} Ar
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                Montant des garanties : {formatNombre(resultats.montant_garanties)} Ar
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                Net à payer : {formatNombre(resultats.montant_total)} Ar
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="info">Fermer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Simulation;
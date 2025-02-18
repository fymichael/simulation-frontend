import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';
import { usePDF } from 'react-to-pdf';
import { useNavigate } from 'react-router-dom';

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

const MyComponent = () => {
  const navigate = useNavigate();
  const [encaissements, setEncaissements] = useState([]);
  const [arrieres, setArrieres] = useState([]);
  const [news, setNews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateDebut, setDateDebut] = useState();
  const [dateFin, setDateFin] = useState();

  const { toPDF, targetRef } = usePDF({
    filename: `comparaison_etat_prod.pdf`,
  });

  const initialValues = {
    dateDebut: '',
    dateFin: '',
  };

  const validationSchema = Yup.object({
    dateDebut: Yup.date().required('Date de début requise'),
    dateFin: Yup.date().required('Date de fin requise'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const data = {
        date_debut: values.dateDebut,
        date_fin: values.dateFin,
      };
      setDateDebut(values.dateDebut)
      setDateFin(values.dateFin)
      console.log(data);
      const response = await axios.post('http://localhost:3030/comparaison', data);
      console.log(response.data);
      setEncaissements(response.data.encaissements);
      setArrieres(response.data.arrieres);
      setNews(response.data.newContrat);
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNombre = (nombre) => {
    return nombre?.toLocaleString('fr-FR', { minimumFractionDigits: 2 });
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  };

  const handleDetail = (contrat) => {
    navigate(`/nyhavana/contrat/${contrat.id_contrat}`);
  };

  const sumEncaissements = encaissements.reduce((sum, encaissement) => sum + encaissement.montant, 0);
  const sumArrieres = arrieres.reduce((sum, arriere) => sum + arriere.montant, 0);

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting: formikIsSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  name="dateDebut"
                  as={TextField}
                  label="Date de début"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <ErrorMessage name="dateDebut" component="div" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="dateFin"
                  as={TextField}
                  label="Date de fin"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <ErrorMessage name="dateFin" component="div" />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="error"
                type="submit"
                disabled={isSubmitting || formikIsSubmitting}
              >
                {isSubmitting || formikIsSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Comparer'
                )}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <Box ref={targetRef}>
        {(encaissements.length > 0 || arrieres.length > 0 || news.length > 0) && (
          <Typography variant='h4' style={{ marginTop: '20px', textAlign: 'center' }}> Résultats de la comparaison entre {formatDate(new Date(dateDebut))} et {formatDate(new Date(dateFin))} </Typography>
        )}
        {/* Affichage conditionnel des encaissements */}
        {encaissements.length > 0 && (
          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center" gutterBottom>
                    Encaissement
                  </Typography>
                  <Typography variant="h2" align="center" gutterBottom>
                    {formatNombre(sumEncaissements)} Ar
                  </Typography>
                  <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Numéro de police</TableCell>
                          <TableCell>Encaissement</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {encaissements.map((encaissement, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{encaissement.numeroPolice}</TableCell>
                            <TableCell>{formatNombre(encaissement.montant)} Ar</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Affichage conditionnel des arriérés */}
        {arrieres.length > 0 && (
          <Grid container spacing={2} style={{ marginTop: '-242px', marginLeft: '50%' }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center" gutterBottom>
                    Arriéré
                  </Typography>
                  <Typography variant="h2" align="center" gutterBottom>
                    {formatNombre(sumArrieres)} Ar
                  </Typography>
                  <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Numéro de police</TableCell>
                          <TableCell>Arriéré</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {arrieres.map((arriere, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{arriere.numeroPolice}</TableCell>
                            <TableCell>{formatNombre(arriere.montant)} Ar</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {news.length > 0 && (
          <Card style={{ marginTop: '50px' }}>
            <CardContent>
              <Typography variant="h4" align="center" gutterBottom>
                Les nouveaux contrats
              </Typography>
              <TableContainer style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Souscripteur</TableCell>
                      <TableCell>Numéro de police</TableCell>
                      <TableCell>Effets</TableCell>
                      <TableCell>Prime</TableCell>
                      <TableCell>Date d'échéance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {news.map((contrat, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{contrat.client.nom}</TableCell>
                        <TableCell
                          sx={{ cursor: 'pointer', color: 'blue' }}
                          onClick={() => handleDetail(contrat)}
                        >{contrat.numeroPolice}</TableCell>
                        <TableCell>{formatDate(contrat.dateDebut)}</TableCell>
                        <TableCell>{formatNombre(contrat.montantTotal)} Ar</TableCell>
                        <TableCell>{formatDate(contrat.dateEcheance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Condition d'affichage pour le message "Veuillez entrer les dates" */}
        {(encaissements.length === 0 && arrieres.length === 0 && news.length === 0) && (
          <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '20px' }}>
          </Typography>
        )}

      </Box>
      {/* Condition d'affichage du bouton d'export PDF  */}
      {(encaissements.length > 0 || arrieres.length > 0 || news.length > 0) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => toPDF()}
          >
            Exporter en PDF
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MyComponent;
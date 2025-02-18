import { useEffect, useState } from 'react';
import * as React from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [departements, setDepartements] = useState([]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const navigate = useNavigate();


  // Fetch departements on mount
  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await axios.get('http://localhost:3030/departements');
        setDepartements(response.data);
      } catch (error) {
        console.error("Departements non recuperer:", error);
      }
    };

    fetchDepartements();
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          adresse: '',
          contact: '',
          email: '',
          password: '',
          matricule: '',
          departement: '',
          role: ''
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('Prénom requis'),
          lastname: Yup.string().max(255).required('Nom requis'),
          adresse: Yup.string().max(255).required('Adresse requise'),
          contact: Yup.string().max(15).required('Contact requis'),
          email: Yup.string().email('Email invalide').max(255).required('Email requis'),
          password: Yup.string().max(255).required('Mot de passe requis'),
          matricule: Yup.string().required('Numéro matricule requis'),
          departement: Yup.string().required('Département requis')
        })}

        onSubmit={(values) => {
          setTimeout(async () => {
            const role = values.departement === 5 ? 1 : 2;
            const status = role === 1 ? 5 : 1;
            console.log(status);

            const requestData = {
              nom: values.lastname,
              prenom: values.firstname,
              adresse: values.adresse,
              contact: values.contact,
              email: values.email,
              mdp: values.password,
              numeroMatricule: values.matricule,
              idDepartement: values.departement,
              idRole: role,
              status: status,
            };

            try {
              await axios.post('http://localhost:3030/utilisateur', requestData);
              navigate('/');
            } catch (error) {
              console.error("Erreur lors de l'inscription :", error);
              alert("Une erreur s'est produite lors de l'inscription.");
            }
          }, 1000);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Nom */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastname-signup">Nom*</InputLabel>
                  <OutlinedInput
                    id="lastname-signup"
                    value={values.lastname}
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.lastname && errors.lastname)}
                  />
                </Stack>
                {touched.lastname && errors.lastname && (
                  <FormHelperText error id="helper-text-lastname-signup">
                    {errors.lastname}
                  </FormHelperText>
                )}
              </Grid>

              {/* Prénom */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-signup">Prénom*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="firstname-signup"
                    value={values.firstname}
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                </Stack>
                {touched.firstname && errors.firstname && (
                  <FormHelperText error id="helper-text-firstname-signup">
                    {errors.firstname}
                  </FormHelperText>
                )}
              </Grid>

              {/* Adresse */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="adresse">Adresse*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="adresse"
                    value={values.adresse}
                    name="adresse"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.adresse && errors.adresse)}
                  />
                </Stack>
                {touched.adresse && errors.adresse && (
                  <FormHelperText error id="helper-text-adresse">
                    {errors.adresse}
                  </FormHelperText>
                )}
              </Grid>

              {/* Contact */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="contact">Contact*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="contact"
                    value={values.contact}
                    name="contact"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.contact && errors.contact)}
                  />
                </Stack>
                {touched.contact && errors.contact && (
                  <FormHelperText error id="helper-text-contact">
                    {errors.contact}
                  </FormHelperText>
                )}
              </Grid>

              {/* Département */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="departement">Département</InputLabel>
                  <FormControl fullWidth error={Boolean(touched.departement && errors.departement)}>
                    <Select
                      id="departement"
                      name="departement"
                      value={values.departement}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>-- Sélectionnez un département --</em>
                      </MenuItem>
                      {departements.map((dept) => (
                        <MenuItem key={dept.id_departement} value={dept.id_departement}>
                          {dept.nom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {touched.departement && errors.departement && (
                    <FormHelperText error>{errors.departement}</FormHelperText>
                  )}
                </Stack>
              </Grid>

              {/* Numéro matricule */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="matricule">Numéro matricule*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="matricule"
                    value={values.matricule}
                    name="matricule"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.matricule && errors.matricule)}
                  />
                </Stack>
                {touched.matricule && errors.matricule && (
                  <FormHelperText error id="helper-text-matricule">
                    {errors.matricule}
                  </FormHelperText>
                )}
              </Grid>

              {/* Adresse email */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Adresse email*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="email-signup"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>

              {/* Mot de passe */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Mot de passe*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    error={Boolean(touched.password && errors.password)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              {/* Bouton de soumission */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="error">
                    S'inscrire
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

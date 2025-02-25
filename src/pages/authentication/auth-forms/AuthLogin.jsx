import PropTypes from 'prop-types';
import React, { useState } from 'react';
import axios from 'axios';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { storeToken, decodeToken } from '../../../utils/authTokens';


// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const handleSubmitForm = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:3030/login', {
        email: values.email,
        mdp: values.password,
      });

      const userStatus = response.data.user?.status;
      const user = response.data.user;
      console.log(user);

      if (userStatus === 1) {
        setMessage("Votre demande d'adhésion est en attente de validation. Veuillez contacter l'administrateur.");
      } else if (userStatus === 5) {
        if (user.role === 2){
          storeToken(response.data.access_token);
          window.location.href = '/nyhavana/contrat-agence';
        }
        storeToken(response.data.access_token);
        navigate('/nyhavana/dashboard');

      } else if (userStatus === 0) {
        setMessage("Vous n'êtes plus autorisé à accéder au site.");
      } else if (userStatus === 3) {
        setMessage("Votre demande d'adhesion n'a pas été approuvé par l'administrateur");
      } else {
        setMessage("Erreur inconnue. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('Erreur API :', error);
      setMessage('Email ou mot de passe erroné');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Doit être un email valide').max(255).required('Email requis'),
          password: Yup.string().max(255).required('Mot de passe requis'),
        })}
        onSubmit={handleSubmitForm}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Votre adresse email"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Mot de passe</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Votre mot de passe"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              {message && (
                <Grid item xs={12}>
                  <Alert variant="standard" color="info">
                    {message}
                  </Alert>
                </Grid>
              )}

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="error"
                  >
                    Connexion
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

AuthLogin.propTypes = { isDemo: PropTypes.bool };

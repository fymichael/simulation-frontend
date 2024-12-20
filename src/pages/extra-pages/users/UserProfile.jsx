import React from "react";
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import avatar1 from 'assets/images/users/avatar-1.png';
import { decodeToken } from '../../authentication/authTokens';
import axios from 'axios';


const UserProfile = () => {
  const token = decodeToken();
  const userId = token.sub;

  const handle = async (idUser) => {
    try {
      await axios.put('http://localhost:3030/utilisateur', { idUser });
      window.location.reload()
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    }
  };

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    bio: "Développeur passionné par la création d'applications performantes et élégantes.",
    avatar: {avatar1},
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          boxShadow: 4,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent>
          {/* Header avec l'avatar et les informations de l'utilisateur */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                >
                  Modifier
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {user.name}
              </Typography>
              <Typography color="textSecondary">{user.email}</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {user.bio}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  mt: 2,
                  px: 1,
                  py: 0.5,
                  backgroundColor: "primary.light",
                  color: "white",
                  display: "inline-block",
                  borderRadius: 1,
                }}
              >
                {user.role}
              </Typography>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider sx={{ my: 3 }} />

          {/* Informations supplémentaires */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Adresse :</Typography>
              <Typography variant="body2">123 Rue Imaginaire, Ville</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Téléphone :</Typography>
              <Typography variant="body2">+33 6 12 34 56 78</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Date d'inscription :</Typography>
              <Typography variant="body2">01 Janvier 2023</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Statut :</Typography>
              <Typography variant="body2">Actif</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;

import React, { useState, useEffect } from "react";
import { Avatar, Box, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { decodeToken } from "../../../utils/authTokens";
import axios from "axios";
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import avatar5 from 'assets/images/users/avatar-5.png';

const avatars = {
  'avatar-1.png': avatar1,
  'avatar-2.png': avatar2,
  'avatar-3.png': avatar3,
  'avatar-4.png': avatar4,
  'avatar-5.png': avatar5,
};

const UserProfile = () => {
  const token = decodeToken();
  const userId = token.sub;
  const [users, setUser] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    contact: "",
    email: "",
    numeroMatricule: "",
    departement: { nom: "" },
    role: { nom: "" },
    photo: "",
  });

  useEffect(() => {
    const getUserConnected = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/utilisateur/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Utilisateurs non récupérés:", error);
      }
    };

    getUserConnected();
  }, [userId]);

  if (!users.role || !users.departement) {
    return <Typography>Chargement des données...</Typography>;
  }

  const user = {
    name: users.nom || "N/A",
    firstname: users.prenom || "N/A",
    adresse: users.adresse || "N/A",
    contact: users.contact || "N/A",
    email: users.email || "N/A",
    role: users.role.nom || "N/A",
    departement: users.departement.nom || "N/A",
    matricule: users.numeroMatricule || "N/A",
    photo: avatars[users.photo] || avatar1,
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
                  src={user.photo}
                  alt={user.name}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {user.name} {user.firstname}
              </Typography>
              <Typography color="textSecondary">{user.email}</Typography>
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

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Adresse </Typography>
              <Typography variant="body2">{user.adresse}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Contact </Typography>
              <Typography variant="body2">{user.contact}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Numero matricule </Typography>
              <Typography variant="body2">{user.matricule}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">Département </Typography>
              <Typography variant="body2">{user.departement}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;

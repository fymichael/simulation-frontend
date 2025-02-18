import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, IconButton, CircularProgress, Grid } from "@mui/material";
import { ChevronLeft, ChevronRight, CalendarToday, Place, Description, ReportProblem, Person } from "@mui/icons-material";

function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error("L'entrée doit être un objet Date valide.");
  }

  const moisFrancais = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];

  const jour = date.getDate();
  const mois = moisFrancais[date.getMonth()];
  const annee = date.getFullYear();

  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${jour} ${mois} ${annee} à ${heures}h${minutes}`;
}

const SinistreDetails = () => {
  const { idSinistre } = useParams();
  const navigate = useNavigate();
  const [sinistre, setSinistre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const validateSinistre = async () => {
    try {
      await axios.put(`http://localhost:3030/validate-sinistre/${idSinistre}`);
      navigate('/nyhavana/sinistre')
    } catch (err) {
      setError("Erreur lors du chargement des données du sinistre.");
    }
  };

  const annulerSinistre = async () => {
    try {
      await axios.put(`http://localhost:3030/annuler-sinistre/${idSinistre}`);
      navigate('/nyhavana/sinistre')
    } catch (err) {
      setError("Erreur lors du chargement des données du sinistre.");
    }
  };

  useEffect(() => {
    const fetchSinistre = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/sinistre/${idSinistre}`);
        if (response.data) {
          setSinistre(response.data);
        } else {
          throw new Error("Aucun sinistre trouvé.");
        }
      } catch (err) {
        setError("Erreur lors du chargement des données du sinistre.");
      } finally {
        setLoading(false);
      }
    };

    fetchSinistre();
  }, [idSinistre]);

  const images = sinistre?.photos || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5, color: "red" }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 700,
        margin: "20px auto",
        padding: 4,
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
        borderRadius: 3,
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          marginBottom: 3,
          color: "red",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        Détails du Sinistre
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Person sx={{ color: "red", marginRight: 1 }} />
        <Typography variant="body1">
          <strong>Numéro du police :</strong> {sinistre.contrat.numeroPolice}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <CalendarToday sx={{ color: "red", marginRight: 1 }} />
        <Typography variant="body1">
          <strong>Date :</strong> {formatDate(new Date(sinistre.date_heure_incident))}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Place sx={{ color: "red", marginRight: 1 }} />
        <Typography variant="body1">
          <strong>Lieu :</strong> {sinistre.lieu_incident}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <ReportProblem sx={{ color: "red", marginRight: 1 }} />
        <Typography variant="body1">
          <strong>Type d'accident :</strong> {sinistre.typeAccident[0].nom}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Description sx={{ color: "red", marginRight: 1 }} />
        <Typography variant="body1">
          <strong>Description :</strong> {sinistre.description}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
        <Person sx={{ color: "red", marginRight: 1 }} />
        <Typography variant="body1">
          <strong>Intervention d'un expert :</strong> {sinistre.expert === 1 ? "Oui" : "Non"}
        </Typography>
      </Box>

      {/* Section des images */}
      {images.length > 0 ? (
        <Box
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            marginBottom: 3,
          }}
        >
          <img
            src={images[currentImageIndex]}
            alt={`Sinistre ${currentImageIndex + 1}`}
            style={{
              width: "100%",
              height: 300,
              objectFit: "cover",
              transition: "transform 0.5s ease-in-out",
            }}
          />
          <IconButton
            onClick={prevImage}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={nextImage}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
          Aucune image disponible pour ce sinistre.
        </Typography>
      )}

      {sinistre.status === 1 && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={validateSinistre}
            sx={{ mt: 2, width: '30%' }}
          >
            Approuvé le sinistre
          </Button>
          <Button
            onClick={annulerSinistre}
            variant="contained"
            sx={{ mt: 2, ml: 3, bgcolor: 'grey', ':hover': { bgcolor: 'darkgrey' }, color: 'white', width: '30%' }}
          >
            Désapprouvé le sinistre
          </Button>
        </>
      )}
    </Box>
  );
};

export default SinistreDetails;

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Stepper,
    Step,
    StepLabel,
    CssBaseline,
    Typography,
    TextField,
    Grid,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ClientSelection from "./ClientContrat";
import InsertVehicule from "./Vehicules";
import ContratSection from "./ContratInfo";
import axios from "axios";
import { decodeToken } from "../../../utils/authTokens";

const steps = ["À propos du client", "À propos du véhicule", "À propos du contrat"];

// Composant pour les boutons de navigation
const NavigationButtons = ({ activeStep, isLastStep, onNext, onBack }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
            variant="outlined"
            startIcon={<ChevronLeftRoundedIcon />}
            onClick={onBack}
            disabled={activeStep === 0}
        >
            Précédent
        </Button>
        <Button
            variant="contained"
            endIcon={<ChevronRightRoundedIcon />}
            onClick={onNext}
            disabled={isLastStep}
        >
            Suivant
        </Button>
    </Box>
);

// Composant principal
const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => 
      setActiveStep((prev) => Math.max(prev - 1, 0)
      
    );

    const isLastStep = activeStep === steps.length - 1;

    const StepContent = () => {
        switch (activeStep) {
            case 0:
                return <ClientSelection />;
            case 1:
                return <InsertVehicule />;
            case 2:
                return <ContratSection />;
            default:
                return null;
        }
    };

    return (
        <Card style={{padding: "20px", width: "80%", marginLeft: "120px"}}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ p: 3 }}>
                <StepContent />
                <NavigationButtons
                    activeStep={activeStep}
                    isLastStep={isLastStep}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            </Box>
        </Card>
    );
};

export default Checkout;

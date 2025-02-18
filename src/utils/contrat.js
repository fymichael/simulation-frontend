// Contract.js
import React from 'react';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

const Contract = () => {
    const handleExportPdf = () => {
        const input = document.getElementById('contractContent');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            // Ajustez les dimensions selon vos besoins
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const heightLeft = imgHeight;

            // Ajouter l'image au PDF
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save('contrat.pdf'); // Nom du fichier
        });
    };

    return (
        <div>
            <div id="contractContent" style={{ padding: "20px", background: "#f9f9f9", border: "1px solid #ccc", marginBottom: "20px" }}>
                <h1>Contrat d'Assurance</h1>
                <h2>Entre:</h2>
                <p><strong>Assureur :</strong> Compagnie d'Assurance ABC</p>
                <p><strong>Adresse :</strong> 123 Rue de l'Assurance, Ville, Code Postal</p>
                
                <h2>Et :</h2>
                <p><strong>Assuré :</strong> Jean Dupont</p>
                <p><strong>Adresse :</strong> 456 Rue de la Paix, Ville, Code Postal</p>
                <p><strong>Date de Naissance :</strong> 01 Janvier 1980</p>
                <p><strong>Numéro de Téléphone :</strong> 0123 456 789</p>

                <h2>Détails du Contrat</h2>
                <p><strong>Numéro de Police :</strong> 123456789</p>
                <p><strong>Date de Début :</strong> 15 Février 2023</p>
                <p><strong>Date d'Échéance :</strong> 15 Février 2024</p>
                <p><strong>Montant Assuré :</strong> 100,000 €</p>
                <p><strong>Type d'Assurance :</strong> Assurance Habitation</p>

                <h2>Conditions Générales</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <ul>
                    <li>Condition 1: Lorem ipsum dolor sit amet.</li>
                    <li>Condition 2: Consectetur adipiscing elit.</li>
                    <li>Condition 3: Sed do eiusmod tempor incididunt.</li>
                </ul>

                <h2>Signatures</h2>
                <p>______________________<br />
                   <strong>Signature de l'Assuré</strong></p>
                <p>______________________<br />
                   <strong>Signature de l'Assureur</strong></p>
            </div>
            <button onClick={handleExportPdf} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Exporter en PDF
            </button>
        </div>
    );
};

export default Contract;
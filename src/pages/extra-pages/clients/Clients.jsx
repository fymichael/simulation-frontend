import PropTypes from 'prop-types';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Tooltip,
    IconButton,
    Typography,
    Button,
    Modal,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    FormHelperText,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';

const headCells = [
    { id: 'numero', label: '#', align: 'center' },
    { id: 'nom', label: 'Nom', align: 'left' },
    { id: 'prenom', label: 'Prénom', align: 'left' },
    { id: 'contact', label: 'Contact', align: 'left' },
    { id: 'adresse', label: 'Adresse', align: 'left' },
    { id: 'cin', label: 'Numéro CIN', align: 'left' },
    { id: 'genre', label: 'Genre', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: 'actions', label: 'Actions', align: 'center' },
];

export default function ClientsTable() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [genres, setGenres] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editValues, setEditValues] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:3030/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des clients:', error);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await axios.get('http://localhost:3030/genres');
            setGenres(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des genres:', error);
        }
    };

    const fetchClientById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3030/client/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données du client:', error);
        }
    };

    useEffect(() => {
        fetchClients();
        fetchGenres();
    }, []);

    const handleCloseModal = () => setOpenModal(false);
    const handleOpenModal = () => {
        setOpenModal(true);
        setEditValues(null);
    };

    const handleCloseEditModal = () => setOpenEditModal(false);
    const handleOpenEditModal = async (client) => {
        setSelectedClientId(client.idClient);
        const clientData = await fetchClientById(client.idClient);
        formikEdit.setValues(clientData);
        setOpenEditModal(true);
    };

    const handleDelete = async (idClient) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(
                `http://localhost:3030/client/${idClient}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la résiliation:', error);
        }
    };

    const handleDetails = async (row) => {
        console.log('/nyhavana/client/' + row.idClient);
        navigate('/nyhavana/client/' + row.idClient);
    };

    const formikInsert = useFormik({
        initialValues: {
            nom: '',
            prenom: '',
            date_naissance: '',
            adresse: '',
            contact: '',
            email: '',
            mdp: '',
            cin: '',
            id_genre: '',
        },
        validationSchema: Yup.object({
            nom: Yup.string().required('Nom requis'),
            prenom: Yup.string().required('Prénom requis'),
            date_naissance: Yup.string().required('Date de naissance requise'),
            adresse: Yup.string().required('Adresse requise'),
            contact: Yup.string().required('Contact requis'),
            email: Yup.string().email('Email invalide').required('Email requis'),
            mdp: Yup.string().required('Mot de passe requis'),
            cin: Yup.string().required('Numéro CIN requis'),
            id_genre: Yup.string().required('Genre requis'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await axios.post('http://localhost:3030/client', values);
                resetForm();
                handleCloseModal();
                fetchClients();
            } catch (error) {
                console.error('Insertion client échouer:', error);
            }
        },
    });

    const formikEdit = useFormik({
        initialValues: {
            nom: '',
            prenom: '',
            date_naissance: '',
            adresse: '',
            contact: '',
            email: '',
            mdp: '',
            cin: '',
            id_genre: '',
        },
        validationSchema: Yup.object({
            nom: Yup.string().required('Nom requis'),
            prenom: Yup.string().required('Prénom requis'),
            date_naissance: Yup.string().required('Date de naissance requise'),
            adresse: Yup.string().required('Adresse requise'),
            contact: Yup.string().required('Contact requis'),
            email: Yup.string().email('Email invalide').required('Email requis'),
            mdp: Yup.string().required('Mot de passe requis'),
            cin: Yup.string().required('Numéro CIN requis'),
            id_genre: Yup.string().required('Genre requis'),
        }),
        onSubmit: async (values) => {
            try {
                await axios.put(`http://localhost:3030/client/${selectedClientId}`, values);
                handleCloseEditModal();
                fetchClients();
            } catch (error) {
                console.error('Échec de la mise à jour du client:', error);
            }
        },
    });

    return (
        <Box>
            <Button
                variant="contained"
                startIcon={<PlusOutlined />}
                onClick={handleOpenModal}
                sx={{ bgcolor: 'red', ':hover': { bgcolor: 'darkred' }, color: 'white' }}
                style={{ marginLeft: '80%' }}
            >
                Nouveau client
            </Button>
            <MainCard sx={{ marginTop: '50px' }} content={false}>
                {clients.length === 0 ? (
                    <Typography variant="body1" sx={{ padding: '20px', textAlign: 'center', color: 'grey' }}>
                        Pas de clients pour l'instant
                    </Typography>
                ) : (
                    <Box sx={{ margin: 3 }}>
                        <Typography variant='h3' sx={{ padding: "20px" }}> Listes des clients </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {headCells.map((headCell) => (
                                            <TableCell key={headCell.id} align={headCell.align}>
                                                {headCell.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <TableRow key={row.idClient}>
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell
                                                sx={{ cursor: 'pointer', color: 'blue' }}
                                                onClick={() => handleDetails(row)}
                                            >{row.nom}</TableCell>
                                            <TableCell>{row.prenom}</TableCell>
                                            <TableCell>{row.contact}</TableCell>
                                            <TableCell>{row.adresse}</TableCell>
                                            <TableCell>{row.cin}</TableCell>
                                            <TableCell>{row.genre.nom}</TableCell>
                                            <TableCell>{row.status ? 'Actif' : 'Inactif'}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Modifier">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleOpenEditModal(row)}
                                                    >
                                                        <EditOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Supprimer">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDelete(row.idClient)}
                                                    >
                                                        <DeleteOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={clients.length}
                            page={page}
                            onPageChange={(event, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                        />
                    </Box>
                )}

                {/* Modal Insertion */}
                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            padding: 3,
                            bgcolor: '#ffffff',
                            borderRadius: 2,
                            maxWidth: 600,
                            maxHeight: '80vh',
                            margin: 'auto',
                            mt: 5,
                            boxShadow: 24,
                            overflowY: 'auto',
                        }}
                    >
                        <Typography variant="h4" ml={5}>
                            Ajouter un nouveau client
                        </Typography>
                        <form onSubmit={formikInsert.handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nom"
                                margin="normal"
                                {...formikInsert.getFieldProps('nom')}
                                error={formikInsert.touched.nom && Boolean(formikInsert.errors.nom)}
                                helperText={formikInsert.touched.nom && formikInsert.errors.nom}
                            />
                            <TextField
                                fullWidth
                                label="Prénom"
                                margin="normal"
                                {...formikInsert.getFieldProps('prenom')}
                                error={formikInsert.touched.prenom && Boolean(formikInsert.errors.prenom)}
                                helperText={formikInsert.touched.prenom && formikInsert.errors.prenom}
                            />
                            <TextField
                                fullWidth
                                label="Date de naissance"
                                margin="normal"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...formikInsert.getFieldProps('date_naissance')}
                                error={formikInsert.touched.date_naissance && Boolean(formikInsert.errors.date_naissance)}
                                helperText={formikInsert.touched.date_naissance && formikInsert.errors.date_naissance}
                            />
                            <TextField
                                fullWidth
                                label="Adresse"
                                margin="normal"
                                {...formikInsert.getFieldProps('adresse')}
                                error={formikInsert.touched.adresse && Boolean(formikInsert.errors.adresse)}
                                helperText={formikInsert.touched.adresse && formikInsert.errors.adresse}
                            />
                            <TextField
                                fullWidth
                                label="Contact"
                                margin="normal"
                                {...formikInsert.getFieldProps('contact')}
                                error={formikInsert.touched.contact && Boolean(formikInsert.errors.contact)}
                                helperText={formikInsert.touched.contact && formikInsert.errors.contact}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                margin="normal"
                                {...formikInsert.getFieldProps('email')}
                                error={formikInsert.touched.email && Boolean(formikInsert.errors.email)}
                                helperText={formikInsert.touched.email && formikInsert.errors.email}
                            />
                            <TextField
                                fullWidth
                                label="Mot de passe"
                                margin="normal"
                                type="password"
                                {...formikInsert.getFieldProps('mdp')}
                                error={formikInsert.touched.mdp && Boolean(formikInsert.errors.mdp)}
                                helperText={formikInsert.touched.mdp && formikInsert.errors.mdp}
                            />
                            <TextField
                                fullWidth
                                label="Numéro CIN"
                                margin="normal"
                                {...formikInsert.getFieldProps('cin')}
                                error={formikInsert.touched.cin && Boolean(formikInsert.errors.cin)}
                                helperText={formikInsert.touched.cin && formikInsert.errors.cin}
                            />
                            <FormControl fullWidth sx={{ marginTop: 2 }}>
                                <InputLabel id="genre-label">Genre</InputLabel>
                                <Select
                                    labelId="genre-label"
                                    {...formikInsert.getFieldProps('id_genre')}
                                    error={formikInsert.touched.id_genre && Boolean(formikInsert.errors.id_genre)}
                                >
                                    <MenuItem value="">
                                        <em>-- Sélectionnez un genre --</em>
                                    </MenuItem>
                                    {genres.map((item) => (
                                        <MenuItem key={item.id_genre} value={item.id_genre}>
                                            {item.nom}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formikInsert.touched.id_genre && formikInsert.errors.id_genre && (
                                    <FormHelperText error>{formikInsert.errors.id_genre}</FormHelperText>
                                )}
                            </FormControl>
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                Ajouter
                            </Button>
                        </form>
                    </Box>
                </Modal>

                {/* Modal Modification */}
                <Modal open={openEditModal} onClose={handleCloseEditModal}>
                    <Box
                        sx={{
                            padding: 3,
                            bgcolor: '#ffffff',
                            borderRadius: 2,
                            maxWidth: 600,
                            maxHeight: '80vh',
                            margin: 'auto',
                            mt: 5,
                            boxShadow: 24,
                            overflowY: 'auto',
                        }}
                    >
                        <Typography variant="h4" ml={5}>
                            Modifier le client
                        </Typography>
                        <form onSubmit={formikEdit.handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nom"
                                margin="normal"
                                {...formikEdit.getFieldProps('nom')}
                                error={formikEdit.touched.nom && Boolean(formikEdit.errors.nom)}
                                helperText={formikEdit.touched.nom && formikEdit.errors.nom}
                            />
                            <TextField
                                fullWidth
                                label="Prénom"
                                margin="normal"
                                {...formikEdit.getFieldProps('prenom')}
                                error={formikEdit.touched.prenom && Boolean(formikEdit.errors.prenom)}
                                helperText={formikEdit.touched.prenom && formikEdit.errors.prenom}
                            />
                            <TextField
                                fullWidth
                                label="Date de naissance"
                                margin="normal"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...formikEdit.getFieldProps('date_naissance')}
                                error={formikEdit.touched.date_naissance && Boolean(formikEdit.errors.date_naissance)}
                                helperText={formikEdit.touched.date_naissance && formikEdit.errors.date_naissance}
                            />
                            <TextField
                                fullWidth
                                label="Adresse"
                                margin="normal"
                                {...formikEdit.getFieldProps('adresse')}
                                error={formikEdit.touched.adresse && Boolean(formikEdit.errors.adresse)}
                                helperText={formikEdit.touched.adresse && formikEdit.errors.adresse}
                            />
                            <TextField
                                fullWidth
                                label="Contact"
                                margin="normal"
                                {...formikEdit.getFieldProps('contact')}
                                error={formikEdit.touched.contact && Boolean(formikEdit.errors.contact)}
                                helperText={formikEdit.touched.contact && formikEdit.errors.contact}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                margin="normal"
                                {...formikEdit.getFieldProps('email')}
                                error={formikEdit.touched.email && Boolean(formikEdit.errors.email)}
                                helperText={formikEdit.touched.email && formikEdit.errors.email}
                            />
                            <TextField
                                fullWidth
                                label="Mot de passe"
                                margin="normal"
                                type="password"
                                {...formikEdit.getFieldProps('mdp')}
                                error={formikEdit.touched.mdp && Boolean(formikEdit.errors.mdp)}
                                helperText={formikEdit.touched.mdp && formikEdit.errors.mdp}
                            />
                            <TextField
                                fullWidth
                                label="Numéro CIN"
                                margin="normal"
                                {...formikEdit.getFieldProps('cin')}
                                error={formikEdit.touched.cin && Boolean(formikEdit.errors.cin)}
                                helperText={formikEdit.touched.cin && formikEdit.errors.cin}
                            />
                            <FormControl fullWidth sx={{ marginTop: 2 }}>
                                <InputLabel id="genre-label">Genre</InputLabel>
                                <Select
                                    labelId="genre-label"
                                    {...formikEdit.getFieldProps('id_genre')}
                                    error={formikEdit.touched.id_genre && Boolean(formikEdit.errors.id_genre)}
                                >
                                    <MenuItem value="">
                                        <em>-- Sélectionnez un genre --</em>
                                    </MenuItem>
                                    {genres.map((item) => (
                                        <MenuItem key={item.id_genre} value={item.id_genre}>
                                            {item.nom}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formikEdit.touched.id_genre && formikEdit.errors.id_genre && (
                                    <FormHelperText error>{formikEdit.errors.id_genre}</FormHelperText>
                                )}
                            </FormControl>
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                Mettre à jour
                            </Button>
                        </form>
                    </Box>
                </Modal>
            </MainCard>
        </Box>
    );
}
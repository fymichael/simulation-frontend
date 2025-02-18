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
    Stack,
    Typography,
    Button,
    Modal,
    TextField
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const headCells = [
    { id: 'numero', label: '#', align: 'center' },
    { id: 'nom', label: 'Nom du département', align: 'left' },
    { id: 'nom_responsable', label: 'Nom du responsable', align: 'left' },
    { id: 'contact_responsable', label: 'Contact du responsable', align: 'left' },
    { id: 'localisation', label: 'Localisation', align: 'left' },
    { id: 'code', label: 'Code', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: 'actions', label: 'Actions', align: 'center' },
];

export default function DepartementTable() {
    const [dept, setDept] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editValues, setEditValues] = useState(null);

    const fetchDepartements = async () => {
        try {
            const response = await axios.get('http://localhost:3030/departements');
            setDept(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des départements:', error);
        }
    };

    useEffect(() => {
        fetchDepartements();
    }, []);

    const handleCloseModal = () => setOpenModal(false);
    const handleCloseEditModal = () => setOpenEditModal(false);

    const handleOpenEditModal = (values) => {
        setEditValues(values);
        setOpenEditModal(true);
    };

    const handleDelete = async (idDepartement) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.put(
                `http://localhost:3030/departement/${idDepartement}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la suppression: ', error);
        }
    };

    const formikInsert = useFormik({
        initialValues: {
            nom: '',
            nom_responsable: '',
            contact_responsable: '',
            localisation: '',
            code: '',
        },
        validationSchema: Yup.object({
            nom: Yup.string().required('Nom requis'),
            nom_responsable: Yup.string().required('Nom du responsable requis'),
            contact_responsable: Yup.string().required('Contact requis'),
            localisation: Yup.string().required('Localisation requise'),
            code: Yup.string().required('Code requis'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await axios.post('http://localhost:3030/departement', values);
                resetForm();
                handleCloseModal();
                fetchDepartements();
            } catch (error) {
                console.error('Erreur lors de l\'ajout:', error);
            }
        },
    });

    const formikEdit = useFormik({
        initialValues: {
            id_departement: editValues?.id_departement || '',
            nom: editValues?.nom || '',
            nom_responsable: editValues?.nom_responsable || '',
            contact_responsable: editValues?.contact_responsable || '',
            localisation: editValues?.localisation || '',
            code: editValues?.code || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            nom: Yup.string().required('Nom requis'),
            nom_responsable: Yup.string().required('Nom du responsable requis'),
            contact_responsable: Yup.string().required('Contact requis'),
            localisation: Yup.string().required('Localisation requise'),
            code: Yup.string().required('Code requis'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                console.log(values);
                await axios.put(`http://localhost:3030/departement`, values);
                resetForm();
                handleCloseEditModal();
                fetchDepartements();
            } catch (error) {
                console.error('Erreur lors de la modification:', error);
            }
        },
    });

    return (
        <>
            <Button
                variant="contained"
                startIcon={<PlusOutlined />}
                onClick={() => setOpenModal(true)}
                sx={{ mb: 2 }}
                style={{ marginLeft: '80%' }}
                color='error'
            >
                Nouveau département
            </Button>
            <MainCard
                sx={{
                    maxWidth: { xs: 1200, lg: 1200 },
                    '& > *': { flexGrow: 1, flexBasis: '50%' },
                }}
                content={false}
                border={false}
                boxShadow
                shadow={(theme) => theme.customShadows.z1}
            >
                <Box sx={{ margin: 3 }}>
                <Typography variant='h3' sx={{ padding: "20px" }}> Listes des départements </Typography>
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
                                {dept.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow key={row.id_departement}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell>{row.nom}</TableCell>
                                        <TableCell>{row.nom_responsable}</TableCell>
                                        <TableCell>{row.contact_responsable}</TableCell>
                                        <TableCell>{row.localisation}</TableCell>
                                        <TableCell>{row.code}</TableCell>
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
                                                    onClick={() => handleDelete(row.id_departement)}
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
                        count={dept.length}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                    />

                    {/* Modal Insertion */}
                    <Modal open={openModal} onClose={handleCloseModal}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                p: 4,
                                borderRadius: 2,
                                boxShadow: 24,
                            }}
                        >
                            <Typography variant="h6" mb={2}>
                                Ajouter un département
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
                                    label="Nom du responsable"
                                    margin="normal"
                                    {...formikInsert.getFieldProps('nom_responsable')}
                                    error={formikInsert.touched.nom_responsable && Boolean(formikInsert.errors.nom_responsable)}
                                    helperText={formikInsert.touched.nom_responsable && formikInsert.errors.nom_responsable}
                                />
                                <TextField
                                    fullWidth
                                    label="Contact"
                                    margin="normal"
                                    {...formikInsert.getFieldProps('contact_responsable')}
                                    error={formikInsert.touched.contact_responsable && Boolean(formikInsert.errors.contact_responsable)}
                                    helperText={formikInsert.touched.contact_responsable && formikInsert.errors.contact_responsable}
                                />
                                <TextField
                                    fullWidth
                                    label="Localisation"
                                    margin="normal"
                                    {...formikInsert.getFieldProps('localisation')}
                                    error={formikInsert.touched.localisation && Boolean(formikInsert.errors.localisation)}
                                    helperText={formikInsert.touched.localisation && formikInsert.errors.localisation}
                                />
                                <TextField
                                    fullWidth
                                    label="Code"
                                    margin="normal"
                                    {...formikInsert.getFieldProps('code')}
                                    error={formikInsert.touched.code && Boolean(formikInsert.errors.code)}
                                    helperText={formikInsert.touched.code && formikInsert.errors.code}
                                />
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
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                p: 4,
                                borderRadius: 2,
                                boxShadow: 24,
                            }}
                        >
                            <Typography variant="h6" mb={2}>
                                Modifier le département
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
                                    label="Nom du responsable"
                                    margin="normal"
                                    {...formikEdit.getFieldProps('nom_responsable')}
                                    error={formikEdit.touched.nom_responsable && Boolean(formikEdit.errors.nom_responsable)}
                                    helperText={formikEdit.touched.nom_responsable && formikEdit.errors.nom_responsable}
                                />
                                <TextField
                                    fullWidth
                                    label="Contact"
                                    margin="normal"
                                    {...formikEdit.getFieldProps('contact_responsable')}
                                    error={formikEdit.touched.contact_responsable && Boolean(formikEdit.errors.contact_responsable)}
                                    helperText={formikEdit.touched.contact_responsable && formikEdit.errors.contact_responsable}
                                />
                                <TextField
                                    fullWidth
                                    label="Localisation"
                                    margin="normal"
                                    {...formikEdit.getFieldProps('localisation')}
                                    error={formikEdit.touched.localisation && Boolean(formikEdit.errors.localisation)}
                                    helperText={formikEdit.touched.localisation && formikEdit.errors.localisation}
                                />
                                <TextField
                                    fullWidth
                                    label="Code"
                                    margin="normal"
                                    {...formikEdit.getFieldProps('code')}
                                    error={formikEdit.touched.code && Boolean(formikEdit.errors.code)}
                                    helperText={formikEdit.touched.code && formikEdit.errors.code}
                                />
                                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                    Modifier
                                </Button>
                            </form>
                        </Box>
                    </Modal>
                </Box>
            </MainCard>
        </>
    );
}

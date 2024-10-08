import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Typography, TextField, MenuItem, Select, InputLabel, FormControl, IconButton, Modal, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const ArchivePage = () => {
    const [jobOrders, setJobOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [filterBy, setFilterBy] = useState('day'); // day, month, year
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });

    useEffect(() => {
        const fetchJobOrders = async () => {
            try {
                const response = await axios.get('/api/jobOrders', {
                    params: {
                        page: currentPage,
                        ...(status && { status }),
                        ...(lastName && { lastName }),
                        ...(dateRange.startDate && dateRange.endDate && {
                            dateRange: `${dateRange.startDate}:${dateRange.endDate}`,
                            filterBy
                        }),
                    },
                    withCredentials: true
                });

                setJobOrders(response.data.requests);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching job orders:', error);
            }
        };

        fetchJobOrders();
    }, [currentPage, status, lastName, dateRange, filterBy]);

    const handleOpenFilterModal = () => setOpenFilterModal(true);
    const handleCloseFilterModal = () => setOpenFilterModal(false);

    const handleOpenDetailModal = (title, content) => {
        setModalContent({ title, content });
        setOpenDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setOpenDetailModal(false);
    };

    const handleApplyFilters = () => {
        setOpenFilterModal(false);
        setCurrentPage(1); // Reset to the first page
        // Setting the filters will automatically trigger the useEffect to fetch job orders
    };

    return (
        <div className="w-[80%] ml-[20%] p-6">
            <Box>
                <Typography variant="h5" gutterBottom>Archived Requests</Typography>

                {/* Filter Button */}
                <IconButton onClick={handleOpenFilterModal} color="primary">
                    <FilterListIcon />
                </IconButton>

                {/* Modal for Filters */}
                <Modal
                    open={openFilterModal}
                    onClose={handleCloseFilterModal}
                    aria-labelledby="filter-modal-title"
                    aria-describedby="filter-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: 500,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <IconButton
                            onClick={handleCloseFilterModal}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography id="filter-modal-title" variant="h6" component="h2" gutterBottom>
                            Filters
                        </Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Filter By</InputLabel>
                            <Select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                                <MenuItem value="day">Day</MenuItem>
                                <MenuItem value="month">Month</MenuItem>
                                <MenuItem value="year">Year</MenuItem>
                            </Select>
                        </FormControl>

                        {filterBy && (
                            <Box>
                                <TextField
                                    label={`Start Date (${filterBy})`}
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    margin="normal"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                                <TextField
                                    label={`End Date (${filterBy})`}
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    margin="normal"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                />
                            </Box>
                        )}

                        <Button onClick={handleApplyFilters} variant="contained" color="primary">
                            Apply Filters
                        </Button>
                    </Box>
                </Modal>

                {/* Modal for Job Details */}
                <Modal
                    open={openDetailModal}
                    onClose={handleCloseDetailModal}
                    aria-labelledby="detail-modal-title"
                    aria-describedby="detail-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: 500,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <IconButton
                            onClick={handleCloseDetailModal}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography id="detail-modal-title" variant="h6" component="h2" gutterBottom>
                            {modalContent.title}
                        </Typography>
                        <Typography id="detail-modal-description" variant="body1">
                            {modalContent.content}
                        </Typography>
                    </Box>
                </Modal>

                <TableContainer component={Paper} className="shadow-md rounded-lg table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Job Description</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date Submitted</TableCell>
                                <TableCell>Rejection Reason</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobOrders.length > 0 ? (
                                jobOrders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order.firstName} {order.lastName}</TableCell>
                                        <TableCell>{order.reqOffice}</TableCell>
                                        <TableCell>
                                            <Button variant="text" color="primary" onClick={() => handleOpenDetailModal("Job Description", order.jobDesc || 'N/A')}>
                                                View Description
                                            </Button>
                                        </TableCell>
                                        <TableCell>{order.priority || 'N/A'}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {order.status === 'rejected' && (
                                                <Button variant="text" color="primary" onClick={() => handleOpenDetailModal("Rejection Reason", order.rejectionReason || 'N/A')}>
                                                    View Rejection Reason
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7}>No job orders found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box className="flex justify-center p-2">
                    <Pagination count={totalPages} page={currentPage} onChange={(e, value) => setCurrentPage(value)} />
                </Box>
            </Box>
        </div>

    );
};

export default ArchivePage;


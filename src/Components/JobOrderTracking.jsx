import React, { useEffect, useState } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Modal, Button, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const JobOrderTracking = () => {
    const [jobOrders, setJobOrders] = useState([]);
    const [trackingModalOpen, setTrackingModalOpen] = useState(false);
    const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchJobOrders = async () => {
            try {
                const response = await axios.get('/api/jobOrders', { params: { status: 'approved' }, withCredentials: true });
                setJobOrders(response.data.requests);
            } catch (error) {
                console.error('Error fetching job orders:', error);
            }
        };

        fetchJobOrders();
    }, []);

    const handleOpenTrackingModal = async (order) => {
        try {
            const response = await axios.get(`/api/jobOrders/${order._id}/tracking`, { withCredentials: true });
            if (response.data && response.data.jobOrder) {
                setSelectedOrder({ ...order, tracking: response.data.jobOrder.tracking });
                setTrackingModalOpen(true);
            } else {
                console.error('Invalid job order response:', response.data);
            }
        } catch (error) {
            console.error('Error fetching tracking data:', error);
            // Optionally, show a toast message to the user about the error
        }
    };

    const handleOpenDescriptionModal = (order) => {
        setSelectedOrder(order);
        setDescriptionModalOpen(true);
    };

    const handleCloseTrackingModal = () => {
        setTrackingModalOpen(false);
        setSelectedOrder(null);
    };

    const handleCloseDescriptionModal = () => {
        setDescriptionModalOpen(false);
        setSelectedOrder(null);
    };

    // Function to get the latest tracking status
    const getLatestTrackingStatus = (tracking) => {
        if (tracking && tracking.length > 0) {
            return tracking[tracking.length - 1]?.status || 'No updates';
        }
        return 'No updates';
    };

    return (
        <div className="flex flex-col w-full">
            <div className="w-[80%] ml-[20%] p-6">
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Active Job Orders Tracking
                    </Typography>
                    <TableContainer component={Paper} className="shadow-md rounded-lg table-container">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Requestor</TableCell>
                                    <TableCell>Job Description</TableCell>
                                    <TableCell>Assigned To</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobOrders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order.firstName} {order.lastName}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="text"
                                                color="primary"
                                                onClick={() => handleOpenDescriptionModal(order)}
                                            >
                                                View Description
                                            </Button>
                                        </TableCell>
                                        <TableCell>{order.assignedTo || 'N/A'}</TableCell>
                                        <TableCell>
                                            {getLatestTrackingStatus(order.tracking)}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton aria-label="view-tracking" onClick={() => handleOpenTrackingModal(order)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Tracking Modal */}
                    <Modal
                        open={trackingModalOpen}
                        onClose={handleCloseTrackingModal}
                        aria-labelledby="tracking-modal-title"
                        aria-describedby="tracking-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 600,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <Typography id="tracking-modal-title" variant="h6" component="h2">
                                Tracking Updates for Job Order: {selectedOrder?._id}
                            </Typography>
                            <Box mt={2}>
                                {selectedOrder?.tracking && selectedOrder.tracking.length > 0 ? (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Note</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.tracking.map((update, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{new Date(update.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>{update.status || 'No status'}</TableCell>
                                                    <TableCell>{update.note || 'No note'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <Typography>No tracking updates available.</Typography>
                                )}
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={handleCloseTrackingModal} variant="outlined" color="error">
                                    Close
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    {/* Job Description Modal */}
                    <Modal
                        open={descriptionModalOpen}
                        onClose={handleCloseDescriptionModal}
                        aria-labelledby="description-modal-title"
                        aria-describedby="description-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 600,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <Typography id="description-modal-title" variant="h6" component="h2">
                                Job Description for Job Order: {selectedOrder?._id}
                            </Typography>
                            <Box mt={2}>
                                <Typography variant="body1"><b>Description:</b> {selectedOrder?.jobDesc || 'No description'}</Typography>
                                <Typography variant="body1"><b>Campus:</b> {selectedOrder?.campus || 'N/A'}</Typography>
                                <Typography variant="body1"><b>Building:</b> {selectedOrder?.building || 'N/A'}</Typography>
                                <Typography variant="body1"><b>Floor:</b> {selectedOrder?.floor || 'N/A'}</Typography>
                                <Typography variant="body1"><b>Office:</b> {selectedOrder?.room || 'N/A'}</Typography>
                                <Typography variant="body1"><b>From:</b> {selectedOrder?.dateFrom ? selectedOrder.dateFrom.split('T')[0] : 'N/A'}</Typography>
                                <Typography variant="body1"><b>To:</b> {selectedOrder?.dateTo ? selectedOrder.dateTo.split('T')[0] : 'N/A'}</Typography>
                                <Typography variant="body1"><b>Cost Required:</b> {selectedOrder?.costRequired || 'N/A'}</Typography>
                                <Typography variant="body1"><b>Charge To:</b> {selectedOrder?.chargeTo || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={handleCloseDescriptionModal} variant="outlined" color="error">
                                    Close
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                </Box>
            </div>
        </div>
    );
};

export default JobOrderTracking;

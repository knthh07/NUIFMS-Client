import React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

const DetailsModal = ({ modalOpen, handleCloseModal, selectedRequest, handleApprove, handleOpenRejectModal }) => {
    return (
        <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            aria-labelledby="request-details-modal-title"
            aria-describedby="request-details-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 800,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 2,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                overflow: 'hidden'
            }}>
                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    maxWidth: { xs: '100%', sm: '60%' },
                }}>
                    <Typography id="request-details-modal-title" variant="h6" component="h2">
                        Application Details
                    </Typography>
                    {selectedRequest && (
                        <Box mt={2}>
                            <Typography variant="body1"><strong>Requestor:</strong> {selectedRequest.firstName} {selectedRequest.lastName}</Typography>
                            <Typography variant="body1"><strong>Requesting College/Office:</strong> {selectedRequest.reqOffice}</Typography>
                            <Typography variant="body1"><strong>Description:</strong> {selectedRequest.jobDesc}</Typography>
                            <Typography variant="body1"><strong>Building:</strong> {selectedRequest.building}</Typography>
                            <Typography variant="body1"><strong>Campus:</strong> {selectedRequest.campus}</Typography>
                            <Typography variant="body1"><strong>Floor:</strong> {selectedRequest.floor}</Typography>
                            <Typography variant="body1"><strong>Room:</strong> {selectedRequest.room}</Typography>
                            <Typography variant="body1"><strong>Date Requested:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button variant="contained" color="success" onClick={() => handleApprove(selectedRequest._id)}>Approve</Button>
                                <Button variant="contained" color="error" onClick={() => handleOpenRejectModal(selectedRequest)}>Reject</Button>
                            </Box>
                        </Box>
                    )}
                </Box>
                
                {selectedRequest?.fileUrl && (
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxWidth: { xs: '100%', sm: '40%' },
                        overflow: 'hidden'
                    }}>
                        <img
                            src={`https://nuifms-predep-10ceea2df468.herokuapp.com/${selectedRequest.fileUrl}`}
                            alt="Submitted File"
                            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}  // Added border radius for aesthetics
                        />
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default DetailsModal;

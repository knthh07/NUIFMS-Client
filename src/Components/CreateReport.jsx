import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TextField } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SideNav from '../Components/sidenav/SideNav';
import { useCookies } from 'react-cookie';

const CreateReport = () => {
    const [reportType, setReportType] = useState('day');
    const [specificTicket, setSpecificTicket] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [userId, setUserId] = useState('');
    const [selectedFields, setSelectedFields] = useState([]);
    const [cookies] = useCookies(['token']);
    const [userDetails, setUserDetails] = useState({ name: '', position: '', campus: '' });

    useEffect(() => {
        // Decode JWT and extract user information from cookies
        const token = cookies.token;
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setUserDetails({
                name: decoded.name,
                position: decoded.position,
                campus: decoded.campus
            });
        }
    }, [cookies]);

    const handleFieldSelection = (field) => {
        if (selectedFields.includes(field)) {
            setSelectedFields(selectedFields.filter(f => f !== field));
        } else {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const handleGenerateReport = async () => {
        try {
            const dateRange = startDate && endDate
                ? `${startDate.toISODate()}:${endDate.toISODate()}`
                : '';

            const response = await axios.get('/api/report', {
                params: { reportType, specificTicket, status, dateRange, userId }
            });
            const requests = response.data.requests;

            const doc = new jsPDF();
            // Header with Logo, User Info, Date, and Contact Information
            doc.addImage('../assets/img/nu_logo.png', 'PNG', 10, 10, 50, 20); // You need to replace 'logo.png' with your logo
            doc.setFontSize(16);
            doc.text('Contact Info: 123 Main St, City, Phone: 123-456-7890', 10, 35);
            doc.setFontSize(14);
            doc.text(`Name: ${userDetails.name}`, 10, 45);
            doc.text(`Position: ${userDetails.position}`, 10, 55);
            doc.text(`Campus: ${userDetails.campus}`, 10, 65);
            doc.text(`Date: ${new Date().toLocaleString()}`, 10, 75);

            // Table Header (selected fields)
            const selectedColumns = selectedFields.length > 0 ? selectedFields : ['jobType', 'firstName', 'lastName', 'status'];
            const tableHeaders = selectedColumns.map(field => field.toUpperCase());

            const tableBody = requests.map(req => selectedColumns.map(field => req[field] || 'N/A'));

            doc.autoTable({
                startY: 80,
                head: [tableHeaders],
                body: tableBody,
            });

            // Blank lines for Signature
            const finalY = doc.autoTable.previous.finalY;
            doc.text('________________________', 180, finalY + 10, { align: 'right' });
            doc.text('Signature', 180, finalY + 20, { align: 'right' });

            doc.save('Job_Order_Report.pdf');
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const resetFilters = () => {
        setReportType('day');
        setSpecificTicket('');
        setStatus('');
        setStartDate(null);
        setEndDate(null);
        setUserId('');
        setSelectedFields([]);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <div className="flex">
                <div className="w-full">
                    <div className="w-[80%] ml-[20%] p-6">
                        <h2 className="text-2xl mb-4">Generate Job Order Report</h2>
                        {/* Report Type */}
                        <div className="mb-6">
                            <label htmlFor="reportType" className="block text-gray-700 font-semibold mb-2">Report Type:</label>
                            <select
                                id="reportType"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                            </select>
                        </div>
                        {/* Specific Ticket */}
                        <div className="mb-6">
                            <label htmlFor="specificTicket" className="block text-gray-700 font-semibold mb-2">Specific Ticket:</label>
                            <input
                                type="text"
                                id="specificTicket"
                                value={specificTicket}
                                onChange={(e) => setSpecificTicket(e.target.value)}
                                placeholder="Enter Ticket ID"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        {/* Status */}
                        <div className="mb-6">
                            <label htmlFor="status" className="block text-gray-700 font-semibold mb-2">Status:</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">All</option>
                                <option value="completed">Completed</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        {/* Date Range */}
                        <div className="mb-6">
                            <label htmlFor="dateRange" className="block text-gray-700 font-semibold mb-2">Date Range:</label>
                            <div className="flex space-x-4">
                                <DesktopDatePicker
                                    label="Start Date"
                                    inputFormat="yyyy-MM-dd"
                                    value={startDate}
                                    onChange={(newDate) => setStartDate(newDate)}
                                    slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
                                />
                                <DesktopDatePicker
                                    label="End Date"
                                    inputFormat="yyyy-MM-dd"
                                    value={endDate}
                                    onChange={(newDate) => setEndDate(newDate)}
                                    slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
                                />
                            </div>
                        </div>
                        {/* User ID */}
                        <div className="mb-6">
                            <label htmlFor="userId" className="block text-gray-700 font-semibold mb-2">User ID:</label>
                            <input
                                type="text"
                                id="userId"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter User ID"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        {/* Select Fields to Print */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Select Fields to Print:</label>
                            <div className="flex flex-wrap gap-2">
                                {['jobType', 'firstName', 'lastName', 'reqOffice', 'campus', 'status', 'feedback'].map(field => (
                                    <label key={field} className="block">
                                        <input
                                            type="checkbox"
                                            value={field}
                                            checked={selectedFields.includes(field)}
                                            onChange={() => handleFieldSelection(field)}
                                        /> {field}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleGenerateReport}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150"
                            >
                                Generate Report
                            </button>
                            <button
                                onClick={resetFilters}
                                className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default CreateReport;

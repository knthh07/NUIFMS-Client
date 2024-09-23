import React, { useState, useRef } from "react";
import { IconButton, InputAdornment, TextField, Box, Modal, Button } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import signupLogoSrc from '../assets/img/nu_banner2.png';
import backgroundImage from '../assets/img/jhocsonPic.jpg';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // For terms modal
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false); // For scroll detection
  const [data, setData] = useState({ email: '', password: '', confirmPassword: '' });
  const termsRef = useRef(null); // Ref for the modal content
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleEmailChange = (e) => {
    const email = DOMPurify.sanitize(e.target.value).trim();
    setData({ ...data, email });
    const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@(students|faculty|admin)\.national-u\.edu\.ph$/;
    setEmailError(!emailDomainRegex.test(email) ? 'Please provide a valid email.' : '');
  };

  const openModal = (e) => {
    e.preventDefault(); // Prevent form from being submitted immediately
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      setIsModalOpen(true); // Open the terms modal
    }
  };

  const registerUser = async () => {
    const { email, password } = data;
    const sanitizedData = {
      email: DOMPurify.sanitize(email),
      password: DOMPurify.sanitize(password),
      confirmPassword: DOMPurify.sanitize(password),
    };
    try {
      const response = await axios.post('/api/signup', sanitizedData);
      const result = response.data;
      if (result.error) {
        toast.error(result.error);
      } else {
        setData({ email: '', password: '', confirmPassword: '' });
        toast.success('Register Successful. Welcome!');
        navigate('/addInfo');
      }
    } catch (error) {
      toast.error('Error submitting form');
    }
  };

  const handleAccept = () => {
    setIsModalOpen(false);
    registerUser(); // Trigger user registration
  };

  const handleRefuse = () => {
    setIsModalOpen(false);
    toast.error('Registration failed. You must accept the terms and conditions.');
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-[#35408e] p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={signupLogoSrc} alt="NU LOGO" className="w-36 h-auto" />
        </div>
        <Box component="form" autoComplete='off' noValidate onSubmit={openModal}>
          <div id="input" className="space-y-6">
            <h1 className="text-2xl font-bold text-white text-center">Register</h1>
            <div className="space-y-4">
              <TextField
                variant='filled'
                label='Email'
                fullWidth
                value={data.email}
                required
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                sx={{ input: { color: 'white' }, '& .MuiFilledInput-root': { borderBottom: '1px solid white' } }}
              />
              <TextField
                variant='filled'
                type={showPassword ? 'text' : 'password'}
                label='Password'
                value={data.password}
                required
                onChange={(e) => setData({ ...data, password: DOMPurify.sanitize(e.target.value) })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end" style={{ color: "white" }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant='filled'
                type={showConfirmPassword ? 'text' : 'password'}
                label='Confirm Password'
                value={data.confirmPassword}
                required
                onChange={(e) => setData({ ...data, confirmPassword: DOMPurify.sanitize(e.target.value) })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowConfirmPassword} edge="end" style={{ color: "white" }}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <button type='submit' className="bg-[#5cb85c] text-white border-none rounded-md cursor-pointer block py-2 px-8 mx-auto hover:bg-[#449D44]">Sign Up</button>
          </div>
        </Box>

        {/* Modal for Terms and Conditions */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: 'white',
            border: '2px solid #000',
            boxShadow: 24,
            padding: 20,
            maxHeight: '50vh',
            overflowY: 'auto',
          }}>
            <h2>Terms and Conditions</h2>
            <p>[ <p>['Welcome to NUIFMS! This privacy policy explains how we collect, use, disclose, and protect your personal information. 
              By using our app/website, you agree to the practices described in this policy.
              nPersonal Information: This may include your name, email address, phone number, and any other information you provide directly.
              nUsage Data: Information about how you use our app/website, including your IP address, browser type, and pages visited.
              nWe implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. 
              However, no data transmission over the internet or electronic storage system is 100% secure.
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on our app/website. 
              Your continued use of our services after such changes indicates your acceptance of the updated policy]</p>]</p>
            <Button onClick={handleAccept} style={{ backgroundColor: '#5cb85c', color: 'white' }}>Accept</Button>
            <Button onClick={handleRefuse} style={{ backgroundColor: '#d9534f', color: 'white', marginLeft: '10px' }}>Refuse</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Signup;

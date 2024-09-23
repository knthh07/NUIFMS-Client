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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const termsRef = useRef(null);
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleEmailChange = (e) => {
    const email = DOMPurify.sanitize(e.target.value).trim();
    setData({ ...data, email });

    const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@(students|faculty|admin)\.national-u\.edu\.ph$/;
    if (!emailDomainRegex.test(email)) {
      setEmailError('Please provide a valid email.');
    } else {
      setEmailError('');
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = data;

    if (!isAccepted) {
      toast.error('Please accept the terms and conditions.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const sanitizedData = {
      email: DOMPurify.sanitize(email),
      password: DOMPurify.sanitize(password),
      confirmPassword: DOMPurify.sanitize(confirmPassword),
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
      console.error('Error submitting form', error.response ? error.response.data : error.message);
      toast.error('Error submitting form');
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setHasScrolledToEnd(false);
  };

  const handleScroll = () => {
    const termsEl = termsRef.current;
    if (termsEl.scrollHeight - termsEl.scrollTop === termsEl.clientHeight) {
      setHasScrolledToEnd(true);
    }
  };

  const handleAccept = () => {
    setIsAccepted(true);
    handleCloseModal();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-[#35408e] p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={signupLogoSrc} alt="NU LOGO" className="w-36 h-auto" />
        </div>
        <Box component="form" autoComplete='off' noValidate onSubmit={registerUser}>
          <div id="input" className="space-y-6">
            <h1 className="text-2xl font-bold text-white text-center">Register</h1>
            <div className="space-y-4">
              <TextField
                variant='filled'
                label='Email'
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                sx={{
                  input: { color: 'white' },
                  '& .MuiFilledInput-root': {
                    backgroundColor: 'transparent',
                    borderBottom: '1px solid white',
                  },
                  '& .Mui-focused .MuiFilledInput-input': {
                    backgroundColor: 'transparent',
                  },
                  '& .Mui-focused': {
                    borderColor: 'white',
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
                }}
                value={data.email}
                required
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
              />

              <TextField
                variant='filled'
                type={showPassword ? 'text' : 'password'}
                label='Password'
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                        style={{ color: "white" }}
                      >
                        {showPassword ? <VisibilityOff style={{ color: 'white' }} /> : <Visibility style={{ color: 'white' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  input: { color: 'white' },
                  '& .MuiFilledInput-root': {
                    backgroundColor: 'transparent',
                    borderBottom: '1px solid white',
                  },
                  '& .Mui-focused .MuiFilledInput-input': {
                    backgroundColor: 'transparent',
                  },
                  '& .Mui-focused': { borderColor: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
                }}
                value={data.password}
                required
                onChange={(e) => setData({ ...data, password: DOMPurify.sanitize(e.target.value) })}
              />

              <TextField
                variant='filled'
                label='Confirm Password'
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowConfirmPassword}
                        edge="end"
                        style={{ color: "white" }}
                      >
                        {showConfirmPassword ? <VisibilityOff style={{ color: 'white' }} /> : <Visibility style={{ color: 'white' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  input: { color: 'white' },
                  '& .MuiFilledInput-root': {
                    backgroundColor: 'transparent',
                    borderBottom: '1px solid white',
                  },
                  '& .Mui-focused .MuiFilledInput-input': {
                    backgroundColor: 'transparent',
                  },
                  '& .Mui-focused': { borderColor: 'white' },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
                }}
                value={data.confirmPassword}
                required
                onChange={(e) => setData({ ...data, confirmPassword: DOMPurify.sanitize(e.target.value) })}
              />

              <button type='button' className="bg-blue-600 text-white border-none rounded-md cursor-pointer block py-2 px-8 mx-auto hover:bg-blue-500" onClick={handleOpenModal}>View Terms & Conditions</button>

              <button type='submit' className="bg-[#5cb85c] text-white border-none rounded-md cursor-pointer block py-2 px-8 mx-auto hover:bg-[#449D44]">Sign Up</button>
            </div>
          </div>
        </Box>

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
            maxHeight: '50vh', // Set maximum height for scrollable behavior
            overflowY: 'auto',  // Enable vertical scroll if content exceeds height
          }}
            ref={termsRef}
            onScroll={handleScroll}>
            <h2>Terms and Conditions</h2>
            <p>['Welcome to NUIFMS! This privacy policy explains how we collect, use, disclose, and protect your personal information. 
              By using our app/website, you agree to the practices described in this policy.
              \n\nPersonal Information: This may include your name, email address, phone number, and any other information you provide directly.
              \n\nUsage Data: Information about how you use our app/website, including your IP address, browser type, and pages visited.
              \n\nWe implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. 
              However, no data transmission over the internet or electronic storage system is 100% secure.
              \n\nWe may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on our app/website. 
              Your continued use of our services after such changes indicates your acceptance of the updated policy]</p>
            <p>[Insert more text or dummy content to make it longer if needed]</p>
            <Button onClick={handleAccept} disabled={!hasScrolledToEnd}>I Accept</Button>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default Signup;

import React, { useState, useRef } from "react";
import { IconButton, InputAdornment, TextField, Box, Modal, Button } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import signupLogoSrc from '../assets/img/nu_logo.webp';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();
  const termsRef = useRef(null);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleEmailChange = (e) => {
    const email = DOMPurify.sanitize(e.target.value).trim();
    setData({ ...data, email });
    const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@(students|faculty|admin)\.national-u\.edu\.ph$/;
    setEmailError(!emailDomainRegex.test(email) ? 'Please provide a valid email.' : '');
  };

  const sendOtp = async () => {
    try {
      const { email, password } = data;
      const sanitizedEmail = DOMPurify.sanitize(email);
      await axios.post('/api/signupOTP', { email: sanitizedEmail });
      setIsOtpStep(true);
      toast.success('OTP sent to your email.');
    } catch (error) {
      toast.error('Error sending OTP.');
    }
  };

  const verifyOtp = async () => {
    try {
      const { email } = data;
      const response = await axios.post('/api/verify-otp-signup', { email, otp });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        registerUser(); // Proceed to registration after OTP verification
      }
    } catch (error) {
      toast.error('Invalid OTP.');
    }
  };

  const registerUser = async () => {
    const { email, password } = data;
    const sanitizedData = {
      email: DOMPurify.sanitize(email),
      password: DOMPurify.sanitize(password),
    };
    try {
      const response = await axios.post('/api/signup', sanitizedData);
      const result = response.data;
      if (result.error) {
        toast.error(result.error);
      } else {
        setData({ email: '', password: '', confirmPassword: '' });
        toast.success('Registration successful.');
        navigate('/addInfo');
      }
    } catch (error) {
      toast.error('Error submitting form.');
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleAccept = () => {
    setIsModalOpen(false);
    sendOtp();  // Send OTP before proceeding to registration
  };

  const handleRefuse = () => {
    setIsModalOpen(false);
    toast.error('Registration failed. You must accept the terms and conditions.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-[#35408e] p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={signupLogoSrc} alt="NU LOGO" className="w-36 h-auto" />
        </div>
        <Box component="form" autoComplete="off" noValidate onSubmit={openModal}>
          {!isOtpStep ? (
            <div id="input" className="space-y-6">
              <h1 className="text-2xl font-bold text-white text-center">Register</h1>
              <div className="space-y-4">
                <TextField
                  variant='filled'
                  label='Email'
                  fullWidth
                  InputLabelProps={{
                    style: { color: 'white' },
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
                    '& .Mui-focused': {
                      borderColor: 'white',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'white',
                    }
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
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}
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
                  fullWidth
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
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'white',
                    }
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
                  InputLabelProps={{
                    style: { color: 'white' },
                  }}
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
                    '& .Mui-focused': {
                      borderColor: 'white',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'white',
                    }
                  }}
                  value={data.confirmPassword}
                  required
                  onChange={(e) => setData({ ...data, confirmPassword: DOMPurify.sanitize(e.target.value) })}
                />
                <button type='submit' className="bg-[#5cb85c] text-white border-none rounded-md cursor-pointer block py-2 px-8 mx-auto hover:bg-[#449D44]">Sign Up</button>
              </div>
            </div>
          ) : (
            <div>
              <TextField
                label="Enter OTP"
                variant="filled"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Button onClick={verifyOtp} className="bg-[#5cb85c] text-white">Verify OTP</Button>
            </div>
          )}
        </Box>

        {/* Modal for Terms and Conditions */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
          }}>
            <h2>Terms and Conditions</h2>
            <div ref={termsRef} style={{ height: '200px', overflowY: 'scroll', border: '1px solid gray', padding: '8px', marginBottom: '16px' }}>
              {/* Terms and conditions content goes here */}
            </div>
            <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleAccept} className="bg-[#5cb85c] text-white">Accept</Button>
              <Button onClick={handleRefuse} className="bg-[#d9534f] text-white">Refuse</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Signup;

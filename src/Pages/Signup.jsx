import React, { useState } from "react";
import { IconButton, InputAdornment, TextField, Box, Modal, Button, Checkbox, FormControlLabel } from "@mui/material";
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
  const [isModalOpen, setModalOpen] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
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

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) setHasScrolledToEnd(true);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!hasAccepted) {
      toast.error('You must accept the terms and conditions.');
      return;
    }

    try {
      const response = await axios.post('/api/signup', { email, password, confirmPassword });

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

              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasAccepted}
                    onChange={() => setHasAccepted(!hasAccepted)}
                    disabled={!hasScrolledToEnd}
                  />
                }
                label={
                  <span className="text-white">
                    I agree to the{' '}
                    <button onClick={handleOpenModal} style={{ color: 'blue', textDecoration: 'underline' }}>
                      Terms and Conditions
                    </button>
                  </span>
                }
              />

              <button type='submit' className="bg-[#5cb85c] text-white border-none rounded-md cursor-pointer block py-2 px-8 mx-auto hover:bg-[#449D44]" disabled={!hasAccepted}>
                Sign Up
              </button>

              <p className="mt-6 text-white font-Arial text-center text-sm">
                Already have an account?
                <a href="/login" className="ml-2 text-white text-bold hover:text-gray-500 font-semi-bold underline">Login</a>
              </p>
            </div>
          </div>
        </Box>

        {/* Modal for Terms and Conditions */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div className="modal-content" style={{ maxWidth: '500px', margin: '100px auto', padding: '20px', backgroundColor: 'white', borderRadius: '10px' }}>
            <h2>Terms and Conditions</h2>
            <div className="modal-body" onScroll={handleScroll} style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {/* Add your full terms and conditions here */}
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula felis euismod semper.</p>
              <p>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.</p>
              <p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p>
              <p>Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
            </div>
            <Button disabled={!hasScrolledToEnd} onClick={handleCloseModal} style={{ marginTop: '20px' }}>
              I Accept
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Signup;

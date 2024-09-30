import React, { useState } from "react";
import { TextField, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import signupLogoSrc from '../assets/img/nu_logo.webp';
import backgroundImage from '../assets/img/jhocsonPic.jpg';
import Loader from "../hooks/Loader";

const AdditionalInfo = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    dept: '',
    position: '',
    idNum1: '',
    idNum2: ''
  });

  const handleIdNumChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value) && value.length <= (name === 'idNum1' ? 2 : 4)) {
      setData({ ...data, [name]: value });
    }
  };

  const UserAddInfo = async (e) => {
    e.preventDefault();

    const { firstName, lastName, dept, position, idNum1, idNum2 } = data;

    console.log('Submitting form', data);

    try {
      setIsLoading(true);

      const response = await axios.post('/api/addInfo', {
        firstName, lastName, dept, position, idNum1, idNum2
      });
      const result = response.data;
      if (result.error) {
        toast.error(result.error);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setData({ firstName: '', lastName: '', dept: '', position: '', idNum1: '', idNum2: '' });
        toast.success('Additional Information Submitted!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error submitting form', error.response ? error.response.data : error.message);
      toast.error('Error submitting form');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-[#35408e] p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={signupLogoSrc} alt="NU LOGO" className="w-36 h-auto" />
        </div>
        <Box component="form" autoComplete='off' noValidate onSubmit={UserAddInfo}>
          <div id="input" className="space-y-6">
            <h1 className="text-2xl font-bold underline text-white text-center">Additional Information</h1>
            <div className="space-y-4">

              <TextField
                variant='filled'
                label='First Name'
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
                value={data.firstName}
                required
                onChange={(e) => setData({ ...data, firstName: e.target.value })}
              />

              <TextField
                variant='filled'
                label='Last Name'
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
                value={data.lastName}
                required
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
              />

              <FormControl variant="filled" fullWidth>
                <InputLabel style={{ color: 'white' }}>Department</InputLabel>
                <Select
                  sx={{
                    '.MuiSelect-filled': {
                      color: 'white', // Text color inside the Select component
                    },
                    '.MuiSelect-icon': {
                      color: 'white', // Dropdown icon color
                    },
                    backgroundColor: 'transparent',
                    borderBottom: '1px solid white',
                    '& .Mui-focused .MuiSelect-filled': {
                      backgroundColor: 'transparent',
                    },
                    '& .Mui-focused': {
                      borderColor: 'white',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'white',
                    }
                  }}
                  value={data.dept}
                  required
                  onChange={(e) => setData({ ...data, dept: e.target.value })}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem sx={{ color: 'black' }} value="CCIT">CCIT</MenuItem>
                  <MenuItem sx={{ color: 'black' }} value="CBA">CBA</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="filled" fullWidth>
                <InputLabel style={{ color: 'white' }}>Position</InputLabel>
                <Select
                  sx={{
                    '.MuiSelect-filled': {
                      color: 'white', // Text color inside the Select component
                    },
                    '.MuiSelect-icon': {
                      color: 'white', // Dropdown icon color
                    },
                    backgroundColor: 'transparent',
                    borderBottom: '1px solid white',
                    '& .Mui-focused .MuiSelect-filled': {
                      backgroundColor: 'transparent',
                    },
                    '& .Mui-focused': {
                      borderColor: 'white',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'white',
                    }
                  }}
                  value={data.position}
                  required
                  onChange={(e) => setData({ ...data, position: e.target.value })}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem sx={{ color: 'black' }} value="ASP">ASP</MenuItem>
                  <MenuItem sx={{ color: 'black' }} value="Faculty">Faculty</MenuItem>
                  <MenuItem sx={{ color: 'black' }} value="Facilities Employee">Facilities Employee</MenuItem>
                </Select>
              </FormControl>

              <div className="flex space-x-2">
                <TextField
                  variant='filled'
                  label='ID Number 1'
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
                  name="idNum1"
                  value={data.idNum1}
                  required
                  onChange={handleIdNumChange}
                />

                <TextField
                  variant='filled'
                  label='ID Number 2'
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
                  name="idNum2"
                  value={data.idNum2}
                  required
                  onChange={handleIdNumChange}
                />
              </div>
            </div>
            <button type='submit' className="bg-[#13aa52] text-white border-none rounded-md cursor-pointer block mx-auto px-4 py-2 mt-6">
              Submit
            </button>
            <Loader isLoading={isLoading} />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default AdditionalInfo;

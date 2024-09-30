// src/components/Loader.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loader = ({ isLoading }) => {
  const loaderContainerStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: '9999', // Ensure loader is always on top
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
  };

  return (
    isLoading && (
      <div style={loaderContainerStyle}>
        <ClipLoader color="#35408e" loading={isLoading} size={45} />
      </div>
    )
  );
};

export default Loader;

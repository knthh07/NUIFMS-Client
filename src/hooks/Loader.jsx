// src/components/Loader.js
import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loader = ({ isLoading }) => {
  const loaderStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: '9999', // Make sure it appears on top of other content
  };

  return (
    isLoading && (
      <div style={loaderStyle}>
        <ClipLoader color="#000" loading={isLoading} size={50} />
      </div>
    )
  );
};

export default Loader;

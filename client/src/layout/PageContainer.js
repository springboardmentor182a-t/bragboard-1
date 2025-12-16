import React from 'react';

// Simple styling for content padding/layout
const pageContainerStyle = {
  padding: '20px',
  margin: '10px',
  backgroundColor: '#f9f9f9', // Light background for contrast
  borderRadius: '8px'
};

function PageContainer({ children }) {
  return (
    <div style={pageContainerStyle}>
      {children}
    </div>
  );
}

export default PageContainer;
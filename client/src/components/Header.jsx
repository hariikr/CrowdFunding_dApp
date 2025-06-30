import React from 'react';
import Button from '@mui/material/Button';

export default function Header({ onCreate }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, background: 'rgba(25, 118, 210, 0.08)', borderRadius: '0 0 16px 16px', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)', padding: '24px 0 16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Removed logo image for a cleaner title bar */}
        <h1 style={{ fontWeight: 700, color: '#1976d2', fontSize: '2.2rem', margin: 0, letterSpacing: 1 }}>Crowdfunding dApp</h1>
      </div>
      <Button variant="contained" color="primary" onClick={onCreate} style={{ fontWeight: 600, borderRadius: 8, boxShadow: '0 2px 8px rgba(33, 203, 243, 0.08)' }}>
        Create Campaign
      </Button>
    </header>
  );
}

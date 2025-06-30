import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';

export default function DonateModal({ open, onClose, onDonate }) {
  const [amount, setAmount] = useState('');

  const handleDonate = () => {
    onDonate(amount);
    setAmount('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Donate to Campaign</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Amount (ETH)" value={amount} onChange={e => setAmount(e.target.value)} type="number" fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDonate} variant="contained">Donate</Button>
      </DialogActions>
    </Dialog>
  );
}

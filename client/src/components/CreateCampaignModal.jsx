import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';

export default function CreateCampaignModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
    link: '',
    story: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'imageFile') {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!form.title || !form.description || !form.target || !form.deadline) {
      setError('Please fill in all required fields.');
      return;
    }
    const deadlineTimestamp = Math.floor(new Date(form.deadline).getTime() / 1000);
    if (isNaN(deadlineTimestamp) || deadlineTimestamp <= Math.floor(Date.now() / 1000)) {
      setError('Deadline must be a future date.');
      return;
    }
    setError('');
    onCreate({ ...form, deadline: deadlineTimestamp });
    setForm({ title: '', description: '', target: '', deadline: '', image: '', link: '', story: '' });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Campaign</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={2} required />
          <TextField label="Target (ETH)" name="target" value={form.target} onChange={handleChange} fullWidth type="number" required />
          <TextField label="Deadline" name="deadline" value={form.deadline} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} required />
          <TextField label="Image URL" name="image" value={form.image} onChange={handleChange} fullWidth />
          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" accept="image/*" hidden name="imageFile" onChange={handleChange} />
          </Button>
          <TextField label="External Link (optional)" name="link" value={form.link} onChange={handleChange} fullWidth />
          <TextField label="Story (Why should people support this campaign?)" name="story" value={form.story} onChange={handleChange} fullWidth multiline rows={3} />
          {error && <span style={{ color: 'red', fontSize: 14 }}>{error}</span>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
}

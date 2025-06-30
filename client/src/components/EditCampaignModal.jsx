import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from '@mui/material';

export default function ViewCampaignModal({ open, onClose, campaign }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>View Campaign</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <div><strong>Title:</strong> {campaign?.title}</div>
          <div><strong>Description:</strong> {campaign?.description}</div>
          <div><strong>Target (ETH):</strong> {campaign?.target}</div>
          <div><strong>Deadline:</strong> {campaign?.deadline ? new Date(Number(campaign.deadline) * 1000).toLocaleString() : ''}</div>
          <div><strong>Image:</strong> {campaign?.image ? <img src={campaign.image} alt="Campaign" style={{ maxWidth: '100%' }} /> : 'No image uploaded'}</div>
          <div><strong>Link:</strong> {campaign?.link ? <a href={campaign.link} target="_blank" rel="noopener noreferrer">{campaign.link}</a> : 'No link provided'}</div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

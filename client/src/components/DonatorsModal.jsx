import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';

export default function DonatorsModal({ open, onClose, donators, donations }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Donators</DialogTitle>
      <DialogContent>
        <List>
          {donators.length === 0 ? (
            <ListItem><ListItemText primary="No donators yet." /></ListItem>
          ) : (
            donators.map((addr, i) => (
              <ListItem key={addr + i}>
                <ListItemText primary={addr} secondary={`Donated: ${donations[i]} ETH`} />
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}

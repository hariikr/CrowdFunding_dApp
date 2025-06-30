import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, Divider, Chip, TextField, IconButton, Tooltip } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function CampaignDetailsModal({ open, onClose, campaign, donators = [], donations = [] }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!campaign?.deadline) return;
    const interval = setInterval(() => {
      const now = new Date();
      const deadline = new Date(Number(campaign.deadline) * 1000);
      const diff = deadline - now;
      if (diff <= 0) {
        setCountdown('Expired');
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [campaign]);

  if (!campaign) return null;
  const deadlineDate = campaign.deadline ? new Date(Number(campaign.deadline) * 1000) : null;
  const isFunded = Number(campaign.amountCollected) >= Number(campaign.target);
  const isNew = campaign.isNew; // Optionally set this flag in parent
  const almostThere = !isFunded && Number(campaign.amountCollected) >= 0.8 * Number(campaign.target);

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, { text: newComment, date: new Date() }]);
      setNewComment('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{campaign.title || 'Campaign Details'}</DialogTitle>
      <DialogContent>
        <img src={campaign.image && campaign.image.trim() !== '' ? campaign.image : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'} alt={campaign.title} style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} />
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {isFunded && <Chip label="Funded" color="success" size="small" />}
          {almostThere && <Chip label="Almost There" color="warning" size="small" />}
          {isNew && <Chip label="New" color="info" size="small" />}
        </Stack>
        <Typography variant="subtitle1" sx={{ mb: 1 }}><b>Description:</b> {campaign.description || 'No description provided.'}</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Typography variant="body2"><b>Owner:</b> {campaign.owner ? campaign.owner : 'Unknown'}</Typography>
          <Typography variant="body2"><b>Deadline:</b> {deadlineDate ? deadlineDate.toLocaleString() : 'N/A'}</Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Typography variant="body2"><b>Target:</b> {campaign.target} ETH</Typography>
          <Typography variant="body2"><b>Raised:</b> {campaign.amountCollected} ETH</Typography>
        </Stack>
        <Typography variant="body2" sx={{ mb: 1 }}><b>Countdown:</b> {countdown}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Donation History</Typography>
        {donators.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No donations yet.</Typography>
        ) : (
          <Stack spacing={1} sx={{ mb: 2 }}>
            {donators.map((addr, i) => (
              <Stack direction="row" spacing={1} key={addr + i} alignItems="center">
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{addr.slice(0, 6)}...{addr.slice(-4)}</Typography>
                <Typography variant="body2">donated {donations[i]} ETH</Typography>
              </Stack>
            ))}
          </Stack>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Comments & Updates</Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          {comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
          ) : (
            comments.map((c, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">{c.text}</Typography>
                <Typography variant="caption" color="text.secondary">{c.date.toLocaleString()}</Typography>
              </Stack>
            ))
          }
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField size="small" variant="outlined" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }} />
            <Button onClick={handleAddComment} variant="contained" size="small">Post</Button>
          </Stack>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Share</Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Copy link">
            <IconButton onClick={handleCopyLink} color={copied ? 'success' : 'primary'}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on Twitter">
            <IconButton component="a" href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20campaign!%20${encodeURIComponent(window.location.href)}`} target="_blank">
              <TwitterIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on Facebook">
            <IconButton component="a" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank">
              <FacebookIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Why Support This Campaign?</Typography>
        <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
          {campaign.whySupport && campaign.whySupport.trim() !== ''
            ? campaign.whySupport
            : 'The campaign creator has not provided a specific reason. If you believe in their story and goals, your support can make a difference!'}
        </Typography>
        <Divider sx={{ my: 2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
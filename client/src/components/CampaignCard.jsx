import React from 'react';
import { Card, CardContent, Typography, Button, Stack, LinearProgress, Avatar, Box, Chip, Tooltip } from '@mui/material';

export default function CampaignCard({ campaign, onDonate, onViewDonators }) {
  const progress = Math.min((Number(campaign.amountCollected) / Number(campaign.target)) * 100, 100);
  const deadlineDate = campaign.deadline ? new Date(Number(campaign.deadline) * 1000) : null;
  const isExpired = deadlineDate && deadlineDate < new Date();
  const [showMore, setShowMore] = React.useState(false);

  return (
    <Card sx={{
      minWidth: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      maxWidth: 420,
      m: 2,
      boxShadow: 8,
      borderRadius: 4,
      background: 'linear-gradient(135deg, #23272f 0%, #181a20 100%)',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'scale(1.03)', boxShadow: 12 },
    }}>
      <Box sx={{ position: 'relative' }}>
        <img
          src={typeof campaign.image === 'string' && campaign.image.trim() !== '' ? campaign.image : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'}
          alt={campaign.title || 'Campaign Image'}
          style={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16, filter: 'brightness(0.95)' }}
        />
        {isExpired && (
          <Chip label="Expired" color="error" sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 700 }} />
        )}
      </Box>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Tooltip title={campaign.owner || ''} arrow>
            {campaign.owner ? (
              <Chip label={campaign.owner.slice(0, 6) + '...' + campaign.owner.slice(-4)} size="small" sx={{ bgcolor: '#222', color: '#90caf9', fontWeight: 600 }} />
            ) : null}
          </Tooltip>
          {deadlineDate ? (
            <Chip label={deadlineDate.toLocaleDateString()} size="small" sx={{ bgcolor: '#222', color: '#ffd54f', fontWeight: 600 }} />
          ) : null}
        </Stack>
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 700, color: '#fff', mb: 0.5 }}>{campaign.title && typeof campaign.title === 'string' && campaign.title.trim() !== '' ? campaign.title : 'No Title'}</Typography>
        <Typography variant="body2" color="#b0b8c1" sx={{ mb: 1, minHeight: 40 }}>{campaign.description && typeof campaign.description === 'string' && campaign.description.trim() !== '' ? campaign.description : 'No description provided.'}</Typography>
        {campaign.story && (
          <Typography variant="body2" color="#e0e0e0" sx={{ mb: 1, fontStyle: 'italic' }}>
            {showMore ? campaign.story : `${campaign.story.slice(0, 100)}...`}
            {campaign.story.length > 100 && (
              <Button size="small" color="info" sx={{ ml: 1 }} onClick={() => setShowMore(s => !s)}>
                {showMore ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </Typography>
        )}
        <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 1 }}>
          <Typography variant="body2" color="#90caf9">Target: <b>{campaign.target}</b> ETH</Typography>
          <Typography variant="body2" color="#a5d6a7">Raised: <b>{campaign.amountCollected}</b> ETH</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 2, height: 8, borderRadius: 4, background: '#333', '& .MuiLinearProgress-bar': { background: '#1976d2' } }}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="success" onClick={onDonate} sx={{ fontWeight: 600, borderRadius: 2 }}>Donate</Button>
          <Button variant="outlined" onClick={onViewDonators} sx={{ fontWeight: 600, borderRadius: 2, color: '#fff', borderColor: '#1976d2', '&:hover': { borderColor: '#1565c0' } }}>Donators</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

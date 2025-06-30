import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import './theme.css';
import Header from './components/Header';
import CreateCampaignModal from './components/CreateCampaignModal';
import CampaignCard from './components/CampaignCard';
import DonateModal from './components/DonateModal';
import DonatorsModal from './components/DonatorsModal';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract';
import { Container, Grid, Snackbar, Alert, CircularProgress, Button, Box, Typography, CssBaseline, InputAdornment, TextField, IconButton, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181a20',
      paper: '#23272f',
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
});

function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [account, setAccount] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [donatorsOpen, setDonatorsOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donators, setDonators] = useState([]);
  const [donations, setDonations] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [connecting, setConnecting] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  // Connect wallet and contract
  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (!window.ethereum) {
        setSnackbar({ open: true, message: 'MetaMask not detected!', severity: 'error' });
        setConnecting(false);
        return;
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const _provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(_provider);
      const _signer = await _provider.getSigner();
      setSigner(_signer);
      setAccount(await _signer.getAddress());
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
      setContract(_contract);
      setSnackbar({ open: true, message: 'Wallet connected!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Wallet connection failed', severity: 'error' });
    }
    setConnecting(false);
  };

  useEffect(() => {
    // Auto-connect if already authorized
    if (window.ethereum && window.ethereum.selectedAddress) connectWallet();
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (contract) fetchCampaigns();
    // eslint-disable-next-line
  }, [contract]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await contract.getCampaigns();
      console.log('Fetched campaigns:', data);
      if (!Array.isArray(data)) {
        setSnackbar({ open: true, message: 'No campaigns found or contract error', severity: 'error' });
        setCampaigns([]);
      } else {
        setCampaigns(data.map(c => ({
          ...c,
          title: typeof c.title === 'string' ? c.title : '',
          description: typeof c.description === 'string' ? c.description : '',
          image: typeof c.image === 'string' ? c.image : '',
          target: ethers.formatEther(c.target),
          amountCollected: ethers.formatEther(c.amountCollected),
        })));
      }
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to fetch campaigns', severity: 'error' });
      console.error('Error fetching campaigns:', e);
      setCampaigns([]);
    }
    setLoading(false);
  };

  const handleCreate = async (form) => {
    try {
      await contract.createCampaign(
        account,
        form.title,
        form.description,
        ethers.parseEther(form.target),
        Number(form.deadline),
        form.image
      );
      setSnackbar({ open: true, message: 'Campaign created!', severity: 'success' });
      setCreateOpen(false);
      fetchCampaigns();
    } catch (e) {
      console.error('Create campaign error:', e);
      setSnackbar({ open: true, message: 'Failed to create campaign', severity: 'error' });
    }
  };

  const handleDonate = async (amount) => {
    try {
      await contract.donateToCampaign(selectedCampaign, { value: ethers.parseEther(amount) });
      setSnackbar({ open: true, message: 'Donation successful!', severity: 'success' });
      setDonateOpen(false);
      fetchCampaigns();
    } catch (e) {
      setSnackbar({ open: true, message: 'Donation failed', severity: 'error' });
    }
  };

  const handleViewDonators = async (id) => {
    try {
      const [addrs, amts] = await contract.getDonators(id);
      setDonators(addrs);
      setDonations(amts.map(a => ethers.formatEther(a)));
      setSelectedCampaign(id);
      setDonatorsOpen(true);
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to fetch donators', severity: 'error' });
    }
  };

  // Filtering, searching, and sorting logic
  const filteredCampaigns = campaigns
    .filter(c => {
      if (filter === 'active') return Number(c.deadline) > Date.now() / 1000;
      if (filter === 'expired') return Number(c.deadline) <= Date.now() / 1000;
      return true;
    })
    .filter(c =>
      (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === 'newest') return Number(b.deadline) - Number(a.deadline);
      if (sort === 'mostFunded') return Number(b.amountCollected) - Number(a.amountCollected);
      if (sort === 'endingSoon') return Number(a.deadline) - Number(b.deadline);
      return 0;
    });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Header onCreate={() => setCreateOpen(true)} />
            {account ? (
              <Button variant="outlined" color="primary" sx={{ ml: 2, fontWeight: 700 }}>
                {account.slice(0, 6)}...{account.slice(-4)}
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={connectWallet} disabled={connecting} sx={{ ml: 2, fontWeight: 700 }}>
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search campaigns..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 220 }}
              />
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, v) => v && setFilter(v)}
                size="small"
                sx={{ bgcolor: '#23272f', borderRadius: 2 }}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="active">Active</ToggleButton>
                <ToggleButton value="expired">Expired</ToggleButton>
              </ToggleButtonGroup>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sort} label="Sort By" onChange={e => setSort(e.target.value)}>
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="mostFunded">Most Funded</MenuItem>
                  <MenuItem value="endingSoon">Ending Soon</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredCampaigns.length === 0 ? (
            <Typography variant="h5" color="text.secondary" sx={{ mt: 8, textAlign: 'center' }}>
              No campaigns yet. Be the first to create one!
            </Typography>
          ) : (
            <Grid container spacing={2} justifyContent="center" alignItems="stretch">
              {filteredCampaigns.map((c, i) => (
                <Grid item key={i} xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
                  <CampaignCard
                    campaign={c}
                    onDonate={() => { setSelectedCampaign(i); setDonateOpen(true); }}
                    onViewDonators={() => handleViewDonators(i)}
                    isOwner={account && c.owner && account.toLowerCase() === c.owner.toLowerCase()}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          <CreateCampaignModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
          <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} onDonate={handleDonate} />
          <DonatorsModal open={donatorsOpen} onClose={() => setDonatorsOpen(false)} donators={donators} donations={donations} />
          <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

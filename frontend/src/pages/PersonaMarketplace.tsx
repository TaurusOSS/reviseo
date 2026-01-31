import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Grid, CircularProgress, Alert, Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { personaApi } from '../api/personaApi';
import type { MarketplacePersona } from '../types/persona';
import PersonaCard from '../components/PersonaCard';
import PersonaDialog from '../components/PersonaDialog';

interface PersonaMarketplaceProps {
  open: boolean;
  onClose: () => void;
}

const PersonaMarketplace: React.FC<PersonaMarketplaceProps> = ({ open, onClose }) => {
  const [personas, setPersonas] = useState<MarketplacePersona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<MarketplacePersona | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchMarketplace = async () => {
    try {
      setLoading(true);
      const data = await personaApi.getMarketplacePersonas();
      setPersonas(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch marketplace personas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMarketplace();
    }
  }, [open]);

  const handleReload = async () => {
    try {
      setLoading(true);
      await personaApi.reloadMarketplace();
      await fetchMarketplace();
    } catch (err) {
      setError('Failed to reload marketplace');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async (id: string) => {
    try {
      await personaApi.installPersona(id);
      setSuccessMessage('Persona installed successfully!');
    } catch (err) {
      setError('Failed to install persona');
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Marketplace</Typography>
          <Button startIcon={<RefreshIcon />} onClick={handleReload} disabled={loading} variant="outlined" size="small">
            Reload
          </Button>
        </Box>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 4, bgcolor: 'background.default' }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {personas.map((persona) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={persona.identifier}>
                <PersonaCard
                  persona={persona}
                  isMarketplace
                  onInstall={handleInstall}
                  onClick={(p) => setSelectedPersona(p)}
                />
              </Grid>
            ))}
            {personas.length === 0 && !error && (
              <Grid size={{ xs: 12 }}>
                <Typography color="text.secondary" textAlign="center" sx={{ mt: 8 }}>
                  Marketplace is empty. Try reloading.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <PersonaDialog
        open={Boolean(selectedPersona)}
        onClose={() => setSelectedPersona(null)}
        onSave={() => {}}
        persona={selectedPersona}
        readOnly
        title="Persona Details"
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
    </Dialog>
  );
};

export default PersonaMarketplace;

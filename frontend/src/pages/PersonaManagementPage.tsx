import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Grid, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { personaApi } from '../api/personaApi';
import type { Persona, CreatePersonaRequest } from '../types/persona';
import PersonaCard from '../components/PersonaCard';
import PersonaDialog from '../components/PersonaDialog';
import PersonaMarketplace from './PersonaMarketplace';

const PersonaManagementPage: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const data = await personaApi.getPersonas();
      setPersonas(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch personas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const handleCreateOrUpdate = async (personaData: CreatePersonaRequest) => {
    try {
      if (selectedPersona) {
        await personaApi.updatePersona(selectedPersona.identifier, personaData);
      } else {
        await personaApi.createPersona(personaData);
      }
      setIsDialogOpen(false);
      fetchPersonas();
    } catch (err) {
      setError('Failed to save persona');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this persona?')) {
      try {
        await personaApi.deletePersona(id);
        fetchPersonas();
      } catch (err) {
        setError('Failed to delete persona');
        console.error(err);
      }
    }
  };

  const handleEditClick = (persona: Persona) => {
    setSelectedPersona(persona);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedPersona(null);
    setIsDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Personas</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<StorefrontIcon />}
            onClick={() => setIsMarketplaceOpen(true)}
          >
            Marketplace
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Persona
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {personas.map((persona) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={persona.identifier}>
              <PersonaCard
                persona={persona}
                onClick={handleEditClick}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
          {personas.length === 0 && !error && (
            <Grid size={{ xs: 12 }}>
              <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                No personas found. Create one or install from Marketplace.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      <PersonaDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleCreateOrUpdate}
        persona={selectedPersona}
      />

      <PersonaMarketplace
        open={isMarketplaceOpen}
        onClose={() => {
          setIsMarketplaceOpen(false);
          fetchPersonas(); // Refresh after marketplace
        }}
      />
    </Box>
  );
};

export default PersonaManagementPage;

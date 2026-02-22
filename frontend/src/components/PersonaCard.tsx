import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, CardActionArea } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import type { Persona, MarketplacePersona } from '../types/persona';

interface PersonaCardProps {
  persona: Persona | MarketplacePersona;
  onClick?: (persona: Persona | MarketplacePersona) => void;
  onDelete?: (id: string) => void;
  onInstall?: (id: string) => void;
  isMarketplace?: boolean;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onClick, onDelete, onInstall, isMarketplace }) => {
  const isInstalled = isMarketplace && (persona as MarketplacePersona).isInstalled;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', '&:hover': { borderColor: 'primary.main' } }}>
      <CardActionArea onClick={() => onClick?.(persona)} sx={{ flexGrow: 1, p: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" gutterBottom color="primary.light">
              {persona.name}
            </Typography>
            {isInstalled && (
              <Chip label="Installed" size="small" color="success" variant="filled" sx={{ height: 20, fontSize: '0.65rem' }} />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {persona.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {persona.keyAspects.map((aspect, index) => (
              <Chip key={index} label={aspect} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
            ))}
          </Box>
          {isInstalled && (
            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
              Persona is already installed
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #30363d' }}>
        {isMarketplace ? (
          <IconButton
            color="primary"
            onClick={() => onInstall?.(persona.identifier)}
            title="Install Persona"
            disabled={isInstalled}
            sx={{ visibility: isInstalled ? 'hidden' : 'visible' }}
          >
            <DownloadIcon />
          </IconButton>
        ) : (
          <IconButton color="error" onClick={(e) => { e.stopPropagation(); onDelete?.(persona.identifier); }} title="Delete Persona">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Card>
  );
};

export default PersonaCard;

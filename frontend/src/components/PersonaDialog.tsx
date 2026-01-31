import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Chip, IconButton, List, ListItem, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Persona, CreatePersonaRequest } from '../types/persona';

interface PersonaDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (persona: CreatePersonaRequest) => void;
  persona?: Persona | null;
  readOnly?: boolean;
  title?: string;
}

const PersonaDialog: React.FC<PersonaDialogProps> = ({ open, onClose, onSave, persona, readOnly = false, title }) => {
  const [formData, setFormData] = useState<CreatePersonaRequest>({
    name: persona?.name || '',
    description: persona?.description || '',
    customInstructions: persona?.customInstructions || '',
    checklist: persona?.checklist || [],
    keyAspects: persona?.keyAspects || [],
  });

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevPersona, setPrevPersona] = useState(persona);

  if (open !== prevOpen || persona !== prevPersona) {
    setPrevOpen(open);
    setPrevPersona(persona);
    setFormData({
      name: persona?.name || '',
      description: persona?.description || '',
      customInstructions: persona?.customInstructions || '',
      checklist: persona?.checklist || [],
      keyAspects: persona?.keyAspects || [],
    });
  }

  const [newAspect, setNewAspect] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAspect = () => {
    if (newAspect.trim() && !formData.keyAspects.includes(newAspect.trim())) {
      setFormData((prev) => ({ ...prev, keyAspects: [...prev.keyAspects, newAspect.trim()] }));
      setNewAspect('');
    }
  };

  const handleRemoveAspect = (aspect: string) => {
    setFormData((prev) => ({ ...prev, keyAspects: prev.keyAspects.filter((a) => a !== aspect) }));
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim() && !formData.checklist.includes(newChecklistItem.trim())) {
      setFormData((prev) => ({ ...prev, checklist: [...prev.checklist, newChecklistItem.trim()] }));
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (item: string) => {
    setFormData((prev) => ({ ...prev, checklist: prev.checklist.filter((i) => i !== item) }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{title || (persona ? 'Edit Persona' : 'Create Persona')}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            disabled={readOnly}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            disabled={readOnly}
          />
          <TextField
            label="Custom Instructions"
            name="customInstructions"
            value={formData.customInstructions}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            disabled={readOnly}
          />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>Key Aspects</Typography>
            {!readOnly && (
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  value={newAspect}
                  onChange={(e) => setNewAspect(e.target.value)}
                  placeholder="Add aspect..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAspect()}
                />
                <Button variant="outlined" onClick={handleAddAspect} startIcon={<AddIcon />}>Add</Button>
              </Box>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {formData.keyAspects.map((aspect) => (
                <Chip
                  key={aspect}
                  label={aspect}
                  onDelete={readOnly ? undefined : () => handleRemoveAspect(aspect)}
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>Checklist</Typography>
            {!readOnly && (
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add item..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                />
                <Button variant="outlined" onClick={handleAddChecklistItem} startIcon={<AddIcon />}>Add</Button>
              </Box>
            )}
            <List sx={{ mt: 1 }}>
              {formData.checklist.map((item) => (
                <ListItem
                  key={item}
                  disablePadding
                  sx={{ 
                    mb: 1, 
                    p: 1.5, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <ListItemText 
                    primary={item} 
                    primaryTypographyProps={{ variant: 'body2' }}
                    sx={{ m: 0 }}
                  />
                  {!readOnly && (
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleRemoveChecklistItem(item)}
                      size="small"
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        {!readOnly && (
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PersonaDialog;

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { personaApi } from '../api/personaApi';
import { reviewApi } from '../api/reviewApi';
import type { Persona } from '../types/persona';

const CodeReviewPage: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [pullRequestUrl, setPullRequestUrl] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingPersonas, setFetchingPersonas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      setFetchingPersonas(true);
      const data = await personaApi.getPersonas();
      setPersonas(data);
    } catch (err) {
      setError('Failed to fetch personas. Please try again later.');
      console.error(err);
    } finally {
      setFetchingPersonas(false);
    }
  };

  const handleTogglePersona = (identifier: string) => {
    setSelectedPersonas((prev) =>
      prev.includes(identifier)
        ? prev.filter((id) => id !== identifier)
        : [...prev, identifier]
    );
  };

  const handleGeneratePrompt = async () => {
    if (!pullRequestUrl) {
      setError('Please provide a pull request URL.');
      return;
    }
    if (selectedPersonas.length === 0) {
      setError('Please select at least one persona.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const prompt = await reviewApi.generatePrompt({
        pullRequestUrl,
        personasIdentifiers: selectedPersonas,
      });
      setGeneratedPrompt(prompt);
    } catch (err) {
      setError('Failed to generate prompt. Please check the URL and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (fetchingPersonas) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Code Review
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Generate a comprehensive code review prompt based on your pull request and selected reviewer personas.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Pull Request URL
          </Typography>
          <TextField
            fullWidth
            placeholder="https://github.com/owner/repo/pull/123"
            value={pullRequestUrl}
            onChange={(e) => setPullRequestUrl(e.target.value)}
            variant="outlined"
            disabled={loading}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Reviewer Personas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select one or more personas to participate in the review.
          </Typography>
          <Grid container spacing={2}>
            {personas.map((persona) => {
              const isSelected = selectedPersonas.includes(persona.identifier);
              return (
                <Grid item xs={12} sm={6} md={4} key={persona.identifier}>
                  <Card
                    sx={{
                      height: '100%',
                      border: isSelected ? '2px solid' : '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      bgcolor: isSelected ? 'rgba(0, 229, 255, 0.08)' : 'background.paper',
                      transition: 'all 0.2s',
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleTogglePersona(persona.identifier)}
                      sx={{ height: '100%', p: 1 }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? 'primary.main' : 'text.primary',
                          }}
                        >
                          {persona.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleGeneratePrompt}
          disabled={loading || !pullRequestUrl || selectedPersonas.length === 0}
          sx={{ py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Code Review Prompt'}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {generatedPrompt && (
        <Paper sx={{ p: 3, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Generated Prompt</Typography>
            <Tooltip title={copySuccess ? 'Copied!' : 'Copy to clipboard'}>
              <Button
                variant="outlined"
                size="small"
                startIcon={copySuccess ? <CheckIcon /> : <ContentCopyIcon />}
                onClick={handleCopyPrompt}
                color={copySuccess ? 'success' : 'primary'}
              >
                Copy the prompt
              </Button>
            </Tooltip>
          </Box>
          <Box
            component="pre"
            sx={{
              p: 2,
              bgcolor: 'rgba(0,0,0,0.2)',
              borderRadius: 1,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {generatedPrompt}
          </Box>
        </Paper>
      )}

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Prompt copied to clipboard"
      />
    </Box>
  );
};

export default CodeReviewPage;

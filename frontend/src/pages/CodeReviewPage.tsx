import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const CodeReviewPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Code Review
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center', mt: 4, borderStyle: 'dashed', borderWidth: 2, borderColor: 'divider', bgcolor: 'transparent' }}>
        <ConstructionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Work in Progress
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Automated AI code review functionality is coming soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CodeReviewPage;

import React from 'react';
import {
  Button,
  TextField,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Alert,
  Grid,
  Stack,
  Box,
} from '@mui/material';
import { AdapterRegistry } from '@dgui/adapters';

export const materialUIAdapter: AdapterRegistry['material-ui'] = {
  button: {
    render: (component, children) => {
      const variantMap: Record<string, any> = {
        default: { variant: 'contained', color: 'primary' },
        outline: { variant: 'outlined', color: 'primary' },
        destructive: { variant: 'contained', color: 'error' },
      };
      
      const variantProps = variantMap[component.props?.variant || 'default'] || {};
      
      return (
        <Button
          {...variantProps}
          disabled={component.props?.disabled}
          className={component.props?.className}
        >
          {component.props?.label || children}
        </Button>
      );
    },
  },
  
  input: {
    render: (component) => (
      <TextField
        type={component.props?.type || 'text'}
        placeholder={component.props?.placeholder}
        value={component.props?.value}
        disabled={component.props?.disabled}
        className={component.props?.className}
        variant="standard"
        fullWidth
      />
    ),
  },
  
  text: {
    render: (component, children) => {
      const content = component.props?.content || children;
      const className = component.props?.className;
      
      // Map common tags to MUI Typography variants
      const tagMap: Record<string, any> = {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        p: 'body1',
        span: 'body2',
      };
      
      const tag = component.props?.tag || 'p';
      const variant = tagMap[tag] || 'body1';
      
      return (
        <Typography
          variant={variant}
          component={tag}
          className={className}
        >
          {content}
        </Typography>
      );
    },
  },
  
  card: {
    render: (component, children) => (
      <Card className={component.props?.className} elevation={2}>
        {component.props?.title && (
          <CardHeader
            title={component.props?.title}
            subheader={component.props?.description}
          />
        )}
        <CardContent>
          {!component.props?.title && component.props?.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {component.props?.description}
            </Typography>
          )}
          {children}
        </CardContent>
      </Card>
    ),
  },
  
  alert: {
    render: (component, children) => {
      const variantMap: Record<string, any> = {
        default: 'info',
        destructive: 'error',
      };
      
      return (
        <Alert
          severity={variantMap[component.props?.variant || 'default']}
          className={component.props?.className}
        >
          {component.props?.message || children}
        </Alert>
      );
    },
  },
  
  container: {
    render: (component, children) => (
      <Box className={component.props?.className} sx={component.props?.style}>
        {children}
      </Box>
    ),
  },
  
  formContainer: {
    render: (component, children) => (
      <Box
        component="form"
        className={component.props?.className}
        sx={{ '& > *': { mb: 2 } }}
      >
        {children}
      </Box>
    ),
  },
  
  grid: {
    render: (component, children) => {
      const columns = component.layout?.columns || 1;
      const gap = component.layout?.gap || 2;
      const columnSpan = 12 / columns;
      
      // Wrap children in Grid items
      const childrenArray = React.Children.toArray(children);
      
      return (
        <Grid
          container
          spacing={gap / 8} // MUI uses 8px base unit
          className={component.props?.className}
          sx={component.props?.style}
        >
          {childrenArray.map((child, index) => (
            <Grid key={index}>
              {child}
            </Grid>
          ))}
        </Grid>
      );
    },
  },
  
  stack: {
    render: (component, children) => {
      const direction = component.layout?.direction || 'column';
      const gap = component.layout?.gap || 1;
      
      return (
        <Stack
          direction={direction === 'column' ? 'column' : 'row'}
          spacing={gap / 8} // MUI uses 8px base unit
          className={component.props?.className}
          sx={component.props?.style}
        >
          {children}
        </Stack>
      );
    },
  },
};
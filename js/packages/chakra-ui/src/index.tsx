import React from 'react';
import {
  Card,
  Box,
  Button,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { AdapterRegistry } from '@dgui/adapters';
import { UIComponent } from '@dgui/schemas';

export const chakraUIAdapter: AdapterRegistry['chakra-ui'] = {
  button: {
    render: (component: UIComponent, children: React.ReactNode) => {
      const isDestructive = component.props?.variant === 'destructive';
      return (
        <Button
          disabled={component.props?.disabled}
          variant={component.props?.variant === 'outline' ? 'outline' : 'solid'}
          size={component.props?.size || 'md'}
          colorScheme={isDestructive ? 'red' : 'teal'}
          className={component.props?.className}
        >
          {component.props?.label || children}
        </Button>
      );
    }
  },
  input: {
    render: (component) => (
      <Input
        type={component.props?.type || 'text'}
        placeholder={component.props?.placeholder}
        value={component.props?.value}
        disabled={component.props?.disabled}
        className={component.props?.className}
      />
    ),
  },
  text: {
    render: (component, children) => {
      return (
        <Text as={component.props?.tag} className={component.props?.className}>
          {component.props?.content || children}
        </Text>
      );
    },
  },
  card: {
    render: (component, children) => (
      <Card className={component.props?.className}>
        {component.props?.title && (
          <CardHeader>
            <Heading size="md">{component.props?.title}</Heading>
            {component.props?.description && (
              <Text>{component.props?.description}</Text>
            )}
          </CardHeader>
        )}
        <CardBody>{children}</CardBody>
      </Card>
    ),
  },
  alert: {
    render: (component, children) => {
      const statusMap: Record<
        string,
        'info' | 'warning' | 'success' | 'error'
      > = {
        default: 'info',
        destructive: 'error',
      };
      return (
        <div>
          {component.props?.message || children}
        </div>
      );
    },
  },
  container: {
    render: (component, children) => (
      <Box className={component.props?.className} style={component.props?.style}>
        {children}
      </Box>
    ),
  },
  formContainer: {
    render: (component, children) => (
      <Box className={component.props?.className}>{children}</Box>
    ),
  },
  grid: {
    render: (component, children) => (
      <Grid
        templateColumns={`repeat(${component.layout?.columns || 1}, 1fr)`}
        gap={component.layout?.gap || 4}
        style={component.props?.style}
      >
        {children}
      </Grid>
    ),
  },
  stack: {
    render: (component, children) => (
      <Stack
        direction={component.layout?.direction || 'column'}
        spacing={component.layout?.gap || 4}
        style={component.props?.style}
      >
        {children}
      </Stack>
    ),
  },
};
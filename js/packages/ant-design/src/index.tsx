import React from 'react';
import { Button, Input, Typography, Card, Alert, Row, Col, Space, Form } from 'antd';
import { AdapterRegistry } from '@dgui/adapters';

const { Text, Title, Paragraph } = Typography;

export const antDesignAdapter: AdapterRegistry['ant-design'] = {
  button: {
    render: (component, children) => {
      const variantMap: Record<string, any> = {
        default: { type: 'primary' },
        outline: { type: 'default' },
        destructive: { type: 'primary', danger: true },
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
      const content = component.props?.content || children;
      const className = component.props?.className;
      
      // Map common tags to Ant Design Typography components
      const tagMap: Record<string, any> = {
        h1: () => <Title level={1} className={className}>{content}</Title>,
        h2: () => <Title level={2} className={className}>{content}</Title>,
        h3: () => <Title level={3} className={className}>{content}</Title>,
        h4: () => <Title level={4} className={className}>{content}</Title>,
        h5: () => <Title level={5} className={className}>{content}</Title>,
        p: () => <Paragraph className={className}>{content}</Paragraph>,
        span: () => <Text className={className}>{content}</Text>,
      };
      
      const tag = component.props?.tag || 'p';
      const Component = tagMap[tag];
      
      return Component ? Component() : <Text className={className}>{content}</Text>;
    },
  },
  
  card: {
    render: (component, children) => (
      <Card
        title={component.props?.title}
        className={component.props?.className}
        extra={component.props?.extra}
      >
        {component.props?.description && (
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            {component.props?.description}
          </Text>
        )}
        {children}
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
          message={component.props?.message || children}
          type={variantMap[component.props?.variant || 'default']}
          showIcon
          className={component.props?.className}
        />
      );
    },
  },
  
  container: {
    render: (component, children) => (
      <div className={component.props?.className} style={component.props?.style}>
        {children}
      </div>
    ),
  },
  
  formContainer: {
    render: (component, children) => (
      <Form
        layout={component.props?.layout || 'vertical'}
        className={component.props?.className}
      >
        {children}
      </Form>
    ),
  },
  
  grid: {
    render: (component, children) => {
      const columns = component.layout?.columns || 1;
      const gap = component.layout?.gap || 16;
      const span = 24 / columns;
      
      // Wrap children in Col components
      const childrenArray = React.Children.toArray(children);
      
      return (
        <Row gutter={gap} className={component.props?.className} style={component.props?.style}>
          {childrenArray.map((child, index) => (
            <Col key={index} span={span}>
              {child}
            </Col>
          ))}
        </Row>
      );
    },
  },
  
  stack: {
    render: (component, children) => {
      const direction = component.layout?.direction || 'vertical';
      const gap = component.layout?.gap || 8;
      
      return (
        <Space
          direction={direction === 'column' ? 'vertical' : 'horizontal'}
          size={gap}
          className={component.props?.className}
          style={{ display: 'flex', ...component.props?.style }}
        >
          {children}
        </Space>
      );
    },
  },
};
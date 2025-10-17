import React from 'react';
import { Button, Input, Typography, Card, Alert, Row, Col, Space } from 'antd';
import { AdapterRegistry } from '@promptius-gui/adapters';
import { ButtonProps, InputProps, TextProps, CardProps, AlertProps, ContainerProps, GridProps, StackProps, ChartProps } from '@promptius-gui/schemas';
import { ComponentFactory } from '@promptius-gui/core';

const { Text, Title, Paragraph } = Typography;

export const antDesignAdapter: AdapterRegistry['ant-design'] = {
  button: {
    render: (component) => {
      const props = component.props as ButtonProps;
      const variantMap: Record<string, any> = {
        primary: { type: 'primary' },
        secondary: { type: 'default' },
        outline: { type: 'default' },
        ghost: { type: 'text' },
        destructive: { type: 'primary', danger: true },
      };
      const variantProps = variantMap[props.variant || 'primary'] || {};
      return (
        <Button {...variantProps} disabled={!!props.disabled} loading={!!props.loading} style={{ width: props.fullWidth ? '100%' : undefined }}>
          {props.label}
        </Button>
      );
    },
  },
  
  input: {
    render: (component) => {
      const props = component.props as InputProps;
      return <Input type={props.type || 'text'} placeholder={props.placeholder} disabled={!!props.disabled} />;
    },
  },
  
  text: {
    render: (component) => {
      const props = component.props as TextProps;
      const tagMap: Record<string, any> = {
        h1: () => <Title level={1}>{props.content}</Title>,
        h2: () => <Title level={2}>{props.content}</Title>,
        h3: () => <Title level={3}>{props.content}</Title>,
        h4: () => <Title level={4}>{props.content}</Title>,
        h5: () => <Title level={5}>{props.content}</Title>,
        // AntD supports levels 1-5; map h6 to 5
        h6: () => <Title level={5}>{props.content}</Title>,
        p: () => <Paragraph>{props.content}</Paragraph>,
        span: () => <Text>{props.content}</Text>,
        label: () => <Text>{props.content}</Text>,
      };
      const tag = props.tag || 'p';
      const Component = tagMap[tag];
      return Component ? Component() : <Text>{props.content}</Text>;
    },
  },
  
  card: {
    render: (component, children) => {
      const props = component.props as CardProps;
      return (
        <Card title={props.title}>
          {props.description && (
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              {props.description}
            </Text>
          )}
          {children}
        </Card>
      );
    },
  },
  
  alert: {
    render: (component) => {
      const props = component.props as AlertProps;
      const typeMap: Record<string, any> = { info: 'info', success: 'success', warning: 'warning', error: 'error' };
      return <Alert message={props.title} description={props.message} type={typeMap[props.variant || 'info']} showIcon />;
    },
  },
  
  container: {
    render: (component, children) => {
      const props = component.props as ContainerProps;
      const style: React.CSSProperties = { maxWidth: props.maxWidth, padding: props.padding, margin: props.centered ? '0 auto' : undefined };
      return <div style={style}>{children}</div>;
    },
  },
  
  // removed: formContainer in new schema
  
  grid: {
    render: (component, children) => {
      const props = component.props as GridProps;
      const childrenArray = React.Children.toArray(children);
      return (
        <Row gutter={props.gap ?? 16}>
          {childrenArray.map((child, index) => (
            <Col key={index} span={24 / (props.columns || 1)}>
              {child}
            </Col>
          ))}
        </Row>
      );
    },
  },
  
  stack: {
    render: (component, children) => {
      const props = component.props as StackProps;
      return (
        <Space direction={(props.direction === 'row' ? 'horizontal' : 'vertical') as any} size={props.gap ?? 8}>
          {children}
        </Space>
      );
    },
  },
  
  chart: {
    render: (component) => {
      const props = component.props as ChartProps;
      const width = props.width ?? 400;
      const height = props.height ?? 200;
      const padding = 24;
      const colors = props.colors || ['#1677ff', '#722ed1', '#389e0d', '#fa8c16'];

      const maxVal = Math.max(1, ...props.series.flatMap(s => s.data));
      const innerWidth = width - padding * 2;
      const innerHeight = height - padding * 2;
      const labels = props.labels || props.series[0]?.data.map((_, i) => String(i + 1)) || [];

      const renderAxesAndAnnotations = (svgChildren: React.ReactNode) => {
        const ticks = props.xAxis?.ticks || labels;
        const showXGrid = !!props.xAxis?.showGrid;
        const showYGrid = !!props.yAxis?.showGrid;
        const yMin = props.yAxis?.min ?? 0;
        const yMax = props.yAxis?.max ?? maxVal;
        const yTicks = 4;
        const yStep = (yMax - yMin) / yTicks;
        const grid: React.ReactNode[] = [];
        if (showYGrid) {
          for (let i = 0; i <= yTicks; i++) {
            const y = innerHeight - (i / yTicks) * innerHeight;
            grid.push(<line key={`y-${i}`} x1={0} y1={y} x2={innerWidth} y2={y} stroke="#eee" strokeDasharray="3 3" />);
          }
        }
        if (showXGrid) {
          const groupCount = ticks.length || 1;
          const step = innerWidth / groupCount;
          for (let i = 1; i < groupCount; i++) {
            const x = i * step;
            grid.push(<line key={`x-${i}`} x1={x} y1={0} x2={x} y2={innerHeight} stroke="#eee" strokeDasharray="3 3" />);
          }
        }
        const xLabels = (
          <g transform={`translate(0, ${innerHeight + 16})`}>
            {ticks.map((t, i) => (
              <text key={i} x={(i + 0.5) * (innerWidth / Math.max(1, ticks.length))} y={0} textAnchor="middle" fontSize={10} fill="#666">{t}</text>
            ))}
          </g>
        );
        const yLabels = (
          <g>
            {Array.from({ length: yTicks + 1 }).map((_, i) => (
              <text key={i} x={-8} y={innerHeight - (i / yTicks) * innerHeight} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#666">{Math.round((yMin + i * yStep) * 100) / 100}</text>
            ))}
          </g>
        );
        const annotations = (props.annotations || []).map((a, i) => {
          const x = a.x != null ? (a.x / labels.length) * innerWidth : undefined;
          const y = a.y != null ? innerHeight - (a.y / maxVal) * innerHeight : undefined;
          return (
            <g key={i}>
              {x != null && <line x1={x} y1={0} x2={x} y2={innerHeight} stroke="#999" strokeDasharray="4 2" />}
              {y != null && <line x1={0} y1={y} x2={innerWidth} y2={y} stroke="#999" strokeDasharray="4 2" />}
              {x != null && y != null && <text x={x + 4} y={y - 4} fontSize={10} fill="#333">{a.label}</text>}
            </g>
          );
        });
        return (
          <g>
            {grid}
            {yLabels}
            {svgChildren}
            {annotations}
            {xLabels}
          </g>
        );
      };

      if (props.chartType === 'bar') {
        const groupCount = labels.length;
        const seriesCount = Math.max(1, props.series.length);
        const groupWidth = innerWidth / groupCount;
        const barWidth = groupWidth / (seriesCount + 1);
        return (
          <div>
            {props.title && <Text strong>{props.title}</Text>}
            <svg width={width} height={height} role="img" aria-label="bar chart">
              <g transform={`translate(${padding}, ${padding})`}>
                {renderAxesAndAnnotations(
                  <g>
                    {props.series.map((s, si) => (
                      <g key={si} fill={colors[si % colors.length]}>
                        {s.data.map((val, i) => {
                          const x = i * groupWidth + si * barWidth;
                          const h = (val / maxVal) * innerHeight;
                          const y = innerHeight - h;
                          return <rect key={i} x={x} y={y} width={barWidth * 0.9} height={h} rx={2} />
                        })}
                      </g>
                    ))}
                  </g>
                )}
              </g>
            </svg>
            {props.showLegend !== false && props.series.some(s => s.name) && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {props.series.map((s, si) => s.name ? (
                  <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 12, height: 12, background: colors[si % colors.length], borderRadius: 2, display: 'inline-block' }} />
                    <Text type="secondary">{s.name}</Text>
                  </div>
                ) : null)}
              </div>
            )}
          </div>
        );
      }

      if (props.chartType === 'line') {
        const groupCount = labels.length;
        const xStep = innerWidth / Math.max(1, groupCount - 1);
        return (
          <div>
            {props.title && <Text strong>{props.title}</Text>}
            <svg width={width} height={height} role="img" aria-label="line chart">
              <g transform={`translate(${padding}, ${padding})`}>
                {renderAxesAndAnnotations(
                  <g>
                    {props.series.map((s, si) => {
                      const points = s.data.map((val, i) => {
                        const x = i * xStep;
                        const y = innerHeight - (val / maxVal) * innerHeight;
                        return `${x},${y}`;
                      }).join(' ');
                      return <polyline key={si} points={points} fill="none" stroke={colors[si % colors.length]} strokeWidth={2} />
                    })}
                  </g>
                )}
              </g>
            </svg>
            {props.showLegend !== false && props.series.some(s => s.name) && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {props.series.map((s, si) => s.name ? (
                  <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 12, height: 12, background: colors[si % colors.length], borderRadius: 2, display: 'inline-block' }} />
                    <Text type="secondary">{s.name}</Text>
                  </div>
                ) : null)}
              </div>
            )}
          </div>
        );
      }

      if (props.chartType === 'pie') {
        const values = props.series[0]?.data || [];
        const total = values.reduce((a, b) => a + b, 0) || 1;
        const cx = width / 2;
        const cy = height / 2;
        const r = Math.min(innerWidth, innerHeight) / 2;
        let acc = 0;
        const arcs = values.map((v, i) => {
          const start = (acc / total) * 2 * Math.PI; acc += v;
          const end = (acc / total) * 2 * Math.PI;
          const x1 = cx + r * Math.cos(start);
          const y1 = cy + r * Math.sin(start);
          const x2 = cx + r * Math.cos(end);
          const y2 = cy + r * Math.sin(end);
          const large = end - start > Math.PI ? 1 : 0;
          const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
          return <path key={i} d={d} fill={colors[i % colors.length]} />
        });
        return (
          <div>
            {props.title && <Text strong>{props.title}</Text>}
            <svg width={width} height={height} role="img" aria-label="pie chart">{arcs}</svg>
          </div>
        );
      }

      return <Text>Unknown chart type</Text>;
    },
  },
};

// Auto-register the adapter when this module is imported
ComponentFactory.registerAdapter('ant-design', antDesignAdapter);

export default antDesignAdapter;
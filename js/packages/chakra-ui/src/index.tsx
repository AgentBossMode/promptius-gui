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
import { ButtonProps, InputProps, TextProps, CardProps, AlertProps, ContainerProps, GridProps, StackProps, ChartProps } from '@dgui/schemas';
import { ComponentFactory } from '@dgui/core';

export const chakraUIAdapter: AdapterRegistry['chakra-ui'] = {
  button: {
    render: (component) => {
      const props = component.props as ButtonProps;
      const isDestructive = props.variant === 'destructive';
      return (
        <Button disabled={!!props.disabled} variant={props.variant === 'outline' ? 'outline' : 'solid'} size={(props.size as any) || 'md'} colorScheme={isDestructive ? 'red' : 'teal'} width={props.fullWidth ? '100%' : undefined} isLoading={!!props.loading}>
          {props.label}
        </Button>
      );
    }
  },
  input: {
    render: (component) => {
      const props = component.props as InputProps;
      return <Input type={props.type || 'text'} placeholder={props.placeholder} isDisabled={!!props.disabled} />;
    },
  },
  text: {
    render: (component) => {
      const props = component.props as TextProps;
      const style: React.CSSProperties = {
        fontWeight: props.bold ? 700 : undefined,
        fontStyle: props.italic ? 'italic' : undefined,
        textAlign: (props.align as any) || undefined,
        color: props.color,
      };
      return <Text as={props.tag as any} style={style}>{props.content}</Text>;
    },
  },
  card: {
    render: (component, children) => {
      const props = component.props as CardProps;
      return (
        <Card>
          {(props.title || props.description) && (
            <CardHeader>
              <Heading size="md">{props.title}</Heading>
              {props.description && <Text>{props.description}</Text>}
            </CardHeader>
          )}
          <CardBody>{children}</CardBody>
        </Card>
      );
    },
  },
  alert: {
    render: (component) => {
      const props = component.props as AlertProps;
      const status = (props.variant || 'info') as any;
      return <Text>{props.title ? `${props.title}: ` : ''}{props.message}</Text>;
    },
  },
  container: {
    render: (component, children) => {
      const props = component.props as ContainerProps;
      return <Box maxW={props.maxWidth} p={(props.padding ?? 16) / 4} mx={props.centered ? 'auto' : undefined}>{children}</Box>;
    },
  },
  grid: {
    render: (component, children) => {
      const props = component.props as GridProps;
      return <Grid templateColumns={`repeat(${props.columns || 1}, 1fr)`} gap={(props.gap ?? 16) / 4}>{children}</Grid>;
    },
  },
  stack: {
    render: (component, children) => {
      const props = component.props as StackProps;
      return <Stack direction={(props.direction || 'column') as any} spacing={(props.gap ?? 8) / 4} align={props.align || 'stretch'}>{children}</Stack>;
    },
  },
  chart: {
    render: (component) => {
      const props = component.props as ChartProps;
      const width = props.width ?? 400;
      const height = props.height ?? 200;
      const padding = 24;
      const colors = props.colors || ['#319795', '#805AD5', '#2F855A', '#DD6B20'];

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
          <Box>
            {props.title && <Heading size="sm" mb={2}>{props.title}</Heading>}
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
              <Box display="flex" gap={2} mt={2} flexWrap="wrap">
                {props.series.map((s, si) => s.name ? (
                  <Box key={si} display="flex" alignItems="center" gap={1}>
                    <Box width={3} height={3} bg={colors[si % colors.length]} borderRadius={1} />
                    <Text fontSize="xs">{s.name}</Text>
                  </Box>
                ) : null)}
              </Box>
            )}
          </Box>
        );
      }

      if (props.chartType === 'line') {
        const groupCount = labels.length;
        const xStep = innerWidth / Math.max(1, groupCount - 1);
        return (
          <Box>
            {props.title && <Heading size="sm" mb={2}>{props.title}</Heading>}
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
              <Box display="flex" gap={2} mt={2} flexWrap="wrap">
                {props.series.map((s, si) => s.name ? (
                  <Box key={si} display="flex" alignItems="center" gap={1}>
                    <Box width={3} height={3} bg={colors[si % colors.length]} borderRadius={1} />
                    <Text fontSize="xs">{s.name}</Text>
                  </Box>
                ) : null)}
              </Box>
            )}
          </Box>
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
          <Box>
            {props.title && <Heading size="sm" mb={2}>{props.title}</Heading>}
            <svg width={width} height={height} role="img" aria-label="pie chart">{arcs}</svg>
          </Box>
        );
      }

      return <Text>Unknown chart type</Text>;
    },
  },
};

// Auto-register the adapter when this module is imported
ComponentFactory.registerAdapter('chakra-ui', chakraUIAdapter);

export default chakraUIAdapter;
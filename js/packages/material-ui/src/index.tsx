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
import { ButtonProps, InputProps, TextProps, CardProps, AlertProps, ContainerProps, GridProps, StackProps, UIComponent, ChartProps } from '@dgui/schemas';

export const materialUIAdapter: AdapterRegistry['material-ui'] = {
  button: {
    render: (component) => {
      const props = component.props as ButtonProps;
      const variantMap: Record<string, any> = {
        primary: { variant: 'contained', color: 'primary' },
        secondary: { variant: 'contained', color: 'secondary' },
        outline: { variant: 'outlined', color: 'primary' },
        ghost: { variant: 'text', color: 'primary' },
        destructive: { variant: 'contained', color: 'error' },
      };
      const variantProps = variantMap[props.variant || 'primary'] || {};
      return (
        <Button {...variantProps} disabled={!!props.disabled} fullWidth={!!props.fullWidth}>
          {props.label}
        </Button>
      );
    },
  },

  input: {
    render: (component) => {
      const props = component.props as InputProps;
      return (
        <TextField
          type={props.type || 'text'}
          placeholder={props.placeholder}
          disabled={!!props.disabled}
          required={!!props.required}
          inputProps={{ maxLength: props.maxLength, minLength: props.minLength }}
          helperText={props.helperText}
          label={props.label}
          defaultValue={props.defaultValue}
          variant="outlined"
          fullWidth
          size={(props.size as any) || 'md'}
        />
      );
    },
  },

  text: {
    render: (component) => {
      const props = component.props as TextProps;
      const tagMap: Record<string, any> = {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        p: 'body1',
        span: 'body2',
        label: 'subtitle2',
      };
      const tag = props.tag || 'p';
      const variant = tagMap[tag] || 'body1';
      const style: React.CSSProperties = {
        fontWeight: props.bold ? 700 : undefined,
        fontStyle: props.italic ? 'italic' : undefined,
        textAlign: (props.align as any) || undefined,
        color: props.color,
      };
      return (
        <Typography variant={variant} component={tag as any} style={style}>
          {props.content}
        </Typography>
      );
    },
  },

  textarea: {
    render: (component) => {
      const props = component.props as any; // map to TextField multiline
      return (
        <TextField
          placeholder={props.placeholder}
          disabled={!!props.disabled}
          required={!!props.required}
          helperText={props.helperText}
          label={props.label}
          defaultValue={props.defaultValue}
          inputProps={{ maxLength: props.maxLength }}
          variant="outlined"
          fullWidth
          multiline
          rows={props.rows || 4}
        />
      );
    },
  },

  card: {
    render: (component, children) => {
      const props = component.props as CardProps;
      return (
        <Card elevation={props.elevation ?? 1} sx={{ p: props.padding ?? 2 }}>
          {(props.title || props.description) && (
            <CardHeader title={props.title} subheader={props.description} />
          )}
          <CardContent>{children}</CardContent>
        </Card>
      );
    },
  },

  alert: {
    render: (component) => {
      const props = component.props as AlertProps;
      const map: Record<string, any> = { info: 'info', success: 'success', warning: 'warning', error: 'error' };
      return <Alert severity={map[props.variant || 'info']}>{props.message}</Alert>;
    },
  },

  container: {
    render: (component, children) => {
      const props = component.props as ContainerProps;
      return (
        <Box sx={{ maxWidth: props.maxWidth, p: (props.padding ?? 2) / 8, mx: props.centered ? 'auto' : undefined }}>
          {children}
        </Box>
      );
    },
  },

  grid: {
    render: (component, children) => {
      const props = component.props as GridProps;
      const childrenArray = React.Children.toArray(children);
      const columns = props.columns || 1;
      const gapPx = props.gap ?? 16;
      return (
        <Box display="grid" gridTemplateColumns={`repeat(${columns}, 1fr)`} gap={`${gapPx}px`}>
          {childrenArray.map((child, index) => (
            <Box key={index}>{child}</Box>
          ))}
        </Box>
      );
    },
  },

  stack: {
    render: (component, children) => {
      const props = component.props as StackProps;
      return (
        <Stack direction={(props.direction || 'column') as any} spacing={(props.gap ?? 8) / 8} alignItems={props.align || 'stretch'}>
          {children}
        </Stack>
      );
    },
  },
  
  chart: {
    render: (component) => {
      const props = component.props as ChartProps;
      const width = props.width ?? 400;
      const height = props.height ?? 200;
      const padding = 24;
      const colors = props.colors || ['#1976d2', '#9c27b0', '#2e7d32', '#ed6c02'];

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

        const showLegend = props.showLegend !== false && props.series.some(s => s.name);
        return (
          <Box>
            {props.title && <Typography variant="subtitle1" sx={{ mb: 1 }}>{props.title}</Typography>}
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
            {showLegend && (
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                {props.series.map((s, si) => (
                  s.name ? (
                    <Box key={si} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: colors[si % colors.length], borderRadius: 0.5 }} />
                      <Typography variant="caption">{s.name}</Typography>
                    </Box>
                  ) : null
                ))}
              </Box>
            )}
          </Box>
        );
      }

      if (props.chartType === 'line') {
        const groupCount = labels.length;
        const xStep = innerWidth / Math.max(1, groupCount - 1);
        const showLegend = props.showLegend !== false && props.series.some(s => s.name);
        return (
          <Box>
            {props.title && <Typography variant="subtitle1" sx={{ mb: 1 }}>{props.title}</Typography>}
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
            {showLegend && (
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                {props.series.map((s, si) => (
                  s.name ? (
                    <Box key={si} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: colors[si % colors.length], borderRadius: 0.5 }} />
                      <Typography variant="caption">{s.name}</Typography>
                    </Box>
                  ) : null
                ))}
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

        const showLegend = props.showLegend !== false;
        return (
          <Box>
            {props.title && <Typography variant="subtitle1" sx={{ mb: 1 }}>{props.title}</Typography>}
            <svg width={width} height={height} role="img" aria-label="pie chart">{arcs}</svg>
            {showLegend && (
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                {(props.series[0]?.data || []).map((_, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: colors[i % colors.length], borderRadius: 0.5 }} />
                    <Typography variant="caption">{props.labels?.[i] || `Slice ${i + 1}`}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        );
      }

      return <Box>Unknown chart type</Box>;
    },
  },
};
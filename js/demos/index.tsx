import '../src/index.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from '../src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../src/components/ui/card';
import { Input } from '../src/components/ui/input';
import { UISchema } from '../packages/schemas';
import UIFactory from '../packages/core/src/index';
import { ChakraProvider } from '@chakra-ui/react';

const demoSchemas = {
  form: {
    metadata: {
      title: 'User Registration',
      description: 'Dynamic form with multiple UI framework support',
      framework: 'shadcn',
      version: '1.0.0',
    },
    root: {
      id: 'root',
      type: 'container',
      props: { maxWidth: 768, padding: 24, centered: true },
      children: [
        {
          id: 'form-card',
          type: 'card',
          props: {
            title: 'Create Account',
            description: 'Fill in your details below',
          },
          children: [
            {
              id: 'form-stack',
              type: 'stack',
              props: { gap: 12 },
              children: [
                {
                  id: 'name-stack',
                  type: 'stack',
                  props: { gap: 12 },
                  children: [
                    {
                      id: 'name-label',
                      type: 'text',
                      props: {
                        tag: 'label',
                        content: 'Full Name',
                      },
                    },
                    {
                      id: 'name-input',
                      type: 'input',
                      props: { placeholder: 'John Doe' },
                    },
                  ],
                },
                {
                  id: 'email-stack',
                  type: 'stack',
                  props: { gap: 12 },
                  children: [
                    {
                      id: 'email-label',
                      type: 'text',
                      props: {
                        tag: 'label',
                        content: 'Email Address',
                      },
                    },
                    {
                      id: 'email-input',
                      type: 'input',
                      props: {
                        type: 'email',
                        placeholder: 'john@example.com',
                      },
                    },
                  ],
                },
                {
                  id: 'alert',
                  type: 'alert',
                  props: {
                    variant: 'info',
                    message: 'Your information is secure and encrypted.',
                  },
                },
                {
                  id: 'button-group',
                  type: 'grid',
                  props: { columns: 2, gap: 12 },
                  children: [
                    {
                      id: 'cancel-btn',
                      type: 'button',
                      props: { label: 'Cancel', variant: 'outline' },
                    },
                    {
                      id: 'submit-btn',
                      type: 'button',
                      props: { label: 'Create Account', variant: 'primary' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  } as UISchema,

  dashboard: {
    metadata: {
      title: 'Analytics Dashboard',
      description: 'A responsive dashboard layout',
      framework: 'shadcn',
      version: '1.0.0',
    },
    root: {
      id: 'root',
      type: 'container',
      props: { maxWidth: 1200, padding: 24, centered: true },
      children: [
        {
          id: 'stats-grid',
          type: 'grid',
          props: { columns: 3, gap: 16 },
          children: [
            {
              id: 'stat-1',
              type: 'card',
              props: { title: 'Total Users' },
              children: [
                {
                  id: 'stat-1-value',
                  type: 'text',
                  props: {
                    tag: 'p',
                    content: '12,345',
                  },
                },
                {
                  id: 'stat-1-change',
                  type: 'text',
                  props: {
                    tag: 'p',
                    content: '+12.5% from last month',
                  },
                },
              ],
            },
            {
              id: 'stat-2',
              type: 'card',
              props: { title: 'Revenue' },
              children: [
                {
                  id: 'stat-2-value',
                  type: 'text',
                  props: {
                    tag: 'p',
                    content: '$98,765',
                  },
                },
                {
                  id: 'stat-2-change',
                  type: 'text',
                  props: {
                    tag: 'p',
                    content: '+8.2% from last month',
                  },
                },
              ],
            },
            {
              id: 'stat-3',
              type: 'card',
              props: { title: 'Active Sessions' },
              children: [
                {
                  id: 'stat-3-value',
                  type: 'text',
                  props: {
                    tag: 'p',
                    content: '432',
                  },
                },
                {
                  id: 'stat-3-change',
                  type: 'text',
                  props: {
                    tag: 'p',
                    content: '+18.7% from last hour',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'alert-section',
          type: 'container',
          props: { padding: 0 },
          children: [
            {
              id: 'success-alert',
              type: 'alert',
              props: {
                variant: 'info',
                message:
                  'System is operating normally. All services are up and running.',
              },
            },
          ],
        },
      ],
    },
  } as UISchema,

  charts: {
    metadata: {
      title: 'Charts Gallery',
      description: 'Bar, Line, and Pie charts rendered via UiSchema',
      framework: 'shadcn',
      version: '1.0.0',
    },
    root: {
      id: 'root',
      type: 'container',
      props: { maxWidth: 1000, padding: 24, centered: true },
      children: [
        {
          id: 'charts-grid',
          type: 'grid',
          props: { columns: 2, gap: 24 },
          children: [
            {
              id: 'bar-card',
              type: 'card',
              props: { title: 'Bar Chart' },
              children: [
                {
                  id: 'bar-chart',
                  type: 'chart',
                  props: {
                    chartType: 'bar',
                    width: 440,
                    height: 220,
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    series: [
                      { name: 'Sales', data: [12, 19, 3, 5, 2, 3] },
                      { name: 'Returns', data: [2, 3, 4, 1, 2, 1] },
                    ],
                    title: 'Monthly Performance',
                    showLegend: true,
                    xAxis: { label: 'Month', ticks: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], showGrid: true },
                    yAxis: { label: 'Units', min: 0, max: 20, showGrid: true },
                    annotations: [{ x: 1, y: 19, label: 'Peak' }],
                  },
                },
              ],
            },
            {
              id: 'line-card',
              type: 'card',
              props: { title: 'Line Chart' },
              children: [
                {
                  id: 'line-chart',
                  type: 'chart',
                  props: {
                    chartType: 'line',
                    width: 440,
                    height: 220,
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    series: [
                      { name: 'Visitors', data: [120, 132, 101, 134, 90, 230, 210] },
                      { name: 'Signups', data: [30, 42, 35, 50, 39, 70, 65] },
                    ],
                    title: 'Traffic Trend',
                    showLegend: true,
                    xAxis: { label: 'Day', ticks: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], showGrid: true },
                    yAxis: { label: 'Count', min: 0, showGrid: true },
                    annotations: [{ x: 5, y: 230, label: 'Campaign' }],
                  },
                },
              ],
            },
            {
              id: 'pie-card',
              type: 'card',
              props: { title: 'Pie Chart' },
              children: [
                {
                  id: 'pie-chart',
                  type: 'chart',
                  props: {
                    chartType: 'pie',
                    width: 440,
                    height: 220,
                    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
                    series: [
                      { name: 'Share', data: [35, 25, 20, 20] },
                    ],
                    title: 'Market Share',
                    showLegend: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  } as unknown as UISchema,
};

function App() {
  const [selectedAdapter, setSelectedAdapter] = useState<string>('material-ui');
  const [selectedDemo, setSelectedDemo] = useState<'form' | 'dashboard' | 'charts' | 'dynamic'>(
    'form'
  );
  const [dynamicSchema, setDynamicSchema] = useState<UISchema | null>(null);
  const [prompt, setPrompt] = useState<string>('');

  const adaptersInfo = [
    {
      id: 'material-ui',
      name: 'Material UI',
      color: 'bg-blue-600',
      ring: 'ring-blue-500',
    },
    {
      id: 'chakra-ui',
      name: 'Chakra UI',
      color: 'bg-teal-500',
      ring: 'ring-teal-500',
    },
    {
      id: 'ant-design',
      name: 'Ant Design',
      color: 'bg-rose-500',
      ring: 'ring-rose-500',
    },
  ];

  const handleGenerateUI = async () => {
    if (!prompt) return;
    try {
      const response = await fetch('http://localhost:8000/generate_ui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      console.log('Generated Schema:', data);
      setDynamicSchema(data);
      setSelectedDemo('dynamic');
    } catch (error) {
      console.error('Error generating UI:', error);
    }
  };

  const currentSchema = selectedDemo === 'dynamic' && dynamicSchema ? dynamicSchema : demoSchemas[selectedDemo];
  const schemaWithAdapter = {
    ...currentSchema,
    metadata: {
      ...currentSchema.metadata,
      framework: selectedAdapter,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
              Dynamic UI Factory
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
            One Schema, Multiple Frameworks. Instantly Rendered.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
          <div className="flex flex-wrap justify-center gap-4 p-2 bg-slate-800/60 rounded-full shadow-lg">
            {adaptersInfo.map((adapter) => (
              <button
                key={adapter.id}
                onClick={() => setSelectedAdapter(adapter.id)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  selectedAdapter === adapter.id
                    ? `${adapter.color} text-white shadow-lg transform scale-105 ${adapter.ring}`
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {adapter.name}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-px h-px sm:h-10 bg-slate-700" />
          <div className="flex justify-center gap-3 p-2 bg-slate-800/60 rounded-full shadow-lg">
            <Button
              variant={selectedDemo === 'form' ? 'secondary' : 'ghost'}
              onClick={() => setSelectedDemo('form')}
              className="text-white hover:bg-slate-700 rounded-full"
            >
              Form Example
            </Button>
            <Button
              variant={selectedDemo === 'dashboard' ? 'secondary' : 'ghost'}
              onClick={() => setSelectedDemo('dashboard')}
              className="text-white hover:bg-slate-700 rounded-full"
            >
              Dashboard Example
            </Button>
            <Button
              variant={selectedDemo === 'charts' ? 'secondary' : 'ghost'}
              onClick={() => setSelectedDemo('charts')}
              className="text-white hover:bg-slate-700 rounded-full"
            >
              Charts Example
            </Button>
             <Button
              variant={selectedDemo === 'dynamic' ? 'secondary' : 'ghost'}
              onClick={() => setSelectedDemo('dynamic')}
              className="text-white hover:bg-slate-700 rounded-full"
            >
              Dynamic
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Generate UI from a Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Input 
                placeholder="e.g., A login form with email and password fields"
                className="bg-slate-700 border-slate-600 text-white"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button onClick={handleGenerateUI}>Generate UI</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-lg border border-slate-700/50 transition-all duration-300 hover:border-slate-600 hover:shadow-purple-500/10">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                JSON Schema
              </CardTitle>
              <CardDescription className="text-slate-400">
                The declarative heart of your UI.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="bg-transparent text-slate-300 p-6 rounded-b-2xl overflow-auto max-h-[60vh] text-sm custom-scrollbar">
                {JSON.stringify(currentSchema, null, 2)}
              </pre>
            </CardContent>
          </div>

          <div className="bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-lg border border-slate-700/50 transition-all duration-300 hover:border-slate-600 hover:shadow-green-500/10">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                Rendered Output
              </CardTitle>
              <CardDescription className="text-slate-400">
                Experience the schema in action.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-lg p-6 min-h-[60vh]">
                {selectedAdapter === 'chakra-ui' ? (
                  <ChakraProvider>
                    <UIFactory
                      key={`${selectedAdapter}-${selectedDemo}`}
                      schema={schemaWithAdapter}
                    />
                  </ChakraProvider>
                ) : (
                  <UIFactory
                    key={`${selectedAdapter}-${selectedDemo}`}
                    schema={schemaWithAdapter}
                  />
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
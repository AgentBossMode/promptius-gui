import '../src/index.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../src/components/ui/card';
import { Alert, AlertDescription } from '../src/components/ui/alert';
import { AlertCircle, CheckCircle2, Package } from 'lucide-react';
import { UISchema } from '../packages/core/src/schemas';
import UIFactory from '../packages/core/src/index';

const demoSchemas = {
  form: {
    version: '1.0.0',
    metadata: {
      title: 'User Registration',
      description: 'Dynamic form with multiple UI framework support',
      framework: 'shadcn',
    },
    root: {
      id: 'root',
      type: 'container',
      props: { className: 'max-w-2xl mx-auto p-6' },
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
              id: 'formContainer',
              type: 'formContainer',
              children: [
                {
                  id: 'name-stack',
                  type: 'stack',
                  layout: { gap: 12 },
                  children: [
                    {
                      id: 'name-label',
                      type: 'text',
                      props: {
                        tag: 'label',
                        content: 'Full Name',
                        className: 'text-sm font-medium',
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
                  layout: { gap: 12 },
                  children: [
                    {
                      id: 'email-label',
                      type: 'text',
                      props: {
                        tag: 'label',
                        content: 'Email Address',
                        className: 'text-sm font-medium',
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
                    variant: 'default',
                    message: 'Your information is secure and encrypted.',
                  },
                },
                {
                  id: 'button-group',
                  type: 'grid',
                  layout: { columns: 2, gap: 12 },
                  children: [
                    {
                      id: 'cancel-btn',
                      type: 'button',
                      props: { label: 'Cancel', variant: 'outline' },
                    },
                    {
                      id: 'submit-btn',
                      type: 'button',
                      props: { label: 'Create Account', variant: 'default' },
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
    version: '1.0.0',
    metadata: {
      title: 'Analytics Dashboard',
      description: 'A responsive dashboard layout',
      framework: 'shadcn',
    },
    root: {
      id: 'root',
      type: 'container',
      props: { className: 'max-w-6xl mx-auto p-6' },
      children: [
        {
          id: 'stats-grid',
          type: 'grid',
          layout: { columns: 3, gap: 16 },
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
                    className: 'text-3xl font-bold',
                  },
                },
                {
                  id: 'stat-1-change',
                  type: 'text',
                  props: {
                    tag: 'p',
                    content: '+12.5% from last month',
                    className: 'text-sm text-green-600 mt-2',
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
                    className: 'text-3xl font-bold text-green-600',
                  },
                },
                {
                  id: 'stat-2-change',
                  type: 'text',
                  props: {
                    tag: 'p',
                    content: '+8.2% from last month',
                    className: 'text-sm text-green-600 mt-2',
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
                    className: 'text-3xl font-bold text-blue-600',
                  },
                },
                {
                  id: 'stat-3-change',
                  type: 'text',
                  props: {
                    tag: 'p',
                    content: '+18.7% from last hour',
                    className: 'text-sm text-green-600 mt-2',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'alert-section',
          type: 'container',
          props: { className: 'mt-6' },
          children: [
            {
              id: 'success-alert',
              type: 'alert',
              props: {
                variant: 'default',
                message: 'System is operating normally. All services are up and running.',
              },
            },
          ],
        },
      ],
    },
  } as UISchema,
};

function App() {
  const [selectedAdapter, setSelectedAdapter] = useState<string>('shadcn');
  const [selectedDemo, setSelectedDemo] = useState<'form' | 'dashboard'>('form');

  const adaptersInfo = [
    { id: 'shadcn', name: 'ShadCN UI', color: 'bg-slate-500' },
    { id: 'material-ui', name: 'Material UI', color: 'bg-blue-600' },
    { id: 'chakra-ui', name: 'Chakra UI', color: 'bg-teal-500' },
    { id: 'ant-design', name: 'Ant Design', color: 'bg-blue-500' },
  ];

  const currentSchema = demoSchemas[selectedDemo];
  const schemaWithAdapter = {
    ...currentSchema,
    metadata: {
      ...currentSchema.metadata,
      framework: selectedAdapter,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧩 JSON-Driven React UI Factory
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Multi-Framework Adapter System
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Switch between UI frameworks and examples dynamically using the same JSON schema
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {adaptersInfo.map((adapter) => (
              <button
                key={adapter.id}
                onClick={() => setSelectedAdapter(adapter.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                  selectedAdapter === adapter.id
                    ? `${adapter.color} text-white scale-105`
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {adapter.name}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-3 mb-4">
            <Button
              variant={selectedDemo === 'form' ? 'default' : 'outline'}
              onClick={() => setSelectedDemo('form')}
            >
              Form Example
            </Button>
            <Button
              variant={selectedDemo === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setSelectedDemo('dashboard')}
            >
              Dashboard Example
            </Button>
          </div>

          <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Active:</strong>{' '}
              <span className="font-mono text-blue-600">{selectedAdapter}</span>
              {' • '}
              <span className="font-mono text-purple-600">{selectedDemo}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>JSON Schema Definition</CardTitle>
                <CardDescription>
                  Framework-agnostic component structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
                  {JSON.stringify(currentSchema, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Rendered UI Output</CardTitle>
                <CardDescription>
                  Same schema, different framework styling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UIFactory key={`${selectedAdapter}-${selectedDemo}`} schema={schemaWithAdapter} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>4 UI Framework Adapters:</strong> ShadCN, Material-UI, Chakra UI, Ant Design
            </AlertDescription>
          </Alert>
          <Alert>
            <Package className="h-4 w-4" />
            <AlertDescription>
              <strong>Adapter Pattern:</strong> Pluggable architecture for unlimited framework support
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

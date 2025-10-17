import '../src/index.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { UISchema } from '@dgui/schemas';
import UIFactory from '@dgui/core';
import '@dgui/material-ui';
import '@dgui/chakra-ui';
import '@dgui/ant-design';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import toast, { Toaster } from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Code2, 
  Eye, 
  Copy, 
  Download, 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  BarChart3,
  Check,
  Loader2,
  Github,
  Star,
  GripVertical
} from 'lucide-react';

const materialUITheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6366f1' },
    secondary: { main: '#ec4899' },
  },
});

// Custom Chakra theme that doesn't interfere with global styles
const chakraTheme = extendTheme({
  styles: {
    global: {
      // Reset only within the ChakraProvider scope
      'html, body': {
        fontFamily: 'inherit',
        lineHeight: 'inherit',
        color: 'inherit',
        backgroundColor: 'transparent',
      },
    },
  },
  config: {
    // Disable Chakra's CSS reset
    cssVarPrefix: 'chakra',
  },
});

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
                      props: { tag: 'label', content: 'Full Name' },
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
                      props: { tag: 'label', content: 'Email Address' },
                    },
                    {
                      id: 'email-input',
                      type: 'input',
                      props: { type: 'email', placeholder: 'john@example.com' },
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
                  props: { tag: 'p', content: '12,345' },
                },
                {
                  id: 'stat-1-change',
                  type: 'text',
                  props: { tag: 'p', content: '+12.5% from last month' },
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
                  props: { tag: 'p', content: '$98,765' },
                },
                {
                  id: 'stat-2-change',
                  type: 'text',
                  props: { tag: 'p', content: '+8.2% from last month' },
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
                  props: { tag: 'p', content: '432' },
                },
                {
                  id: 'stat-3-change',
                  type: 'text',
                  props: { tag: 'p', content: '+18.7% from last hour' },
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
                message: 'System is operating normally. All services are up and running.',
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
                    ],
                    title: 'Traffic Trend',
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
  const [selectedDemo, setSelectedDemo] = useState<'form' | 'dashboard' | 'charts' | 'dynamic'>('form');
  const [dynamicSchema, setDynamicSchema] = useState<UISchema | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [serverReady, setServerReady] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [schemaWidth, setSchemaWidth] = useState<number>(50); // Percentage
  const [isResizing, setIsResizing] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const ping = async () => {
      try {
        const res = await fetch('http://localhost:8000/health', { method: 'GET' });
        if (isMounted) setServerReady(res.ok);
      } catch {
        if (isMounted) setServerReady(false);
      }
    };
    ping();
    const id = setInterval(ping, 30000);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, []);

  // Resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = document.querySelector('.resize-container');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      const clampedWidth = Math.min(Math.max(newWidth, 20), 80); // Min 20%, Max 80%
      setSchemaWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const adaptersInfo = [
    { id: 'material-ui', name: 'Material UI', color: 'indigo' },
    { id: 'chakra-ui', name: 'Chakra UI', color: 'teal' },
    { id: 'ant-design', name: 'Ant Design', color: 'rose' },
  ];

  const demos = [
    { id: 'form', label: 'Registration Form', icon: FileText },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'charts', label: 'Charts', icon: BarChart3 },
    { id: 'dynamic', label: 'AI Generated', icon: Sparkles, disabled: !dynamicSchema }
  ];

  const handleGenerateUI = async () => {
    if (!prompt) return;
    try {
      setErrorMsg('');
      setIsGenerating(true);
      const response = await fetch('http://localhost:8000/generate_ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setDynamicSchema(data);
      setSelectedDemo('dynamic');
      toast.success('UI generated successfully!');
    } catch (error) {
      setErrorMsg('Server not reachable. Start the backend and try again.');
      toast.error('Failed to generate UI');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSchema = selectedDemo === 'dynamic' && dynamicSchema ? dynamicSchema : demoSchemas[selectedDemo];
  const schemaWithAdapter = {
    ...currentSchema,
    metadata: { ...currentSchema.metadata, framework: selectedAdapter },
  };

  const currentSchemaString = useMemo(() => JSON.stringify(currentSchema, null, 2), [currentSchema]);

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(currentSchemaString);
      toast.success('Schema copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownloadJSON = () => {
    try {
      const blob = new Blob([currentSchemaString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(currentSchema as any)?.metadata?.title?.replace(/\s+/g, '-').toLowerCase() || 'schema'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Schema downloaded!');
    } catch {
      toast.error('Failed to download');
    }
  };

  const currentAdapter = adaptersInfo.find(a => a.id === selectedAdapter);
  const currentDemoInfo = demos.find(d => d.id === selectedDemo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dynamic UI Factory</h1>
                <p className="text-xs text-slate-500">One schema, multiple frameworks</p>
              </div>
            </div>
            <a 
              href="https://github.com/" 
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Star on GitHub</span>
              <Star className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Bar */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Framework Selector */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">Framework</h3>
            <div className="flex flex-wrap gap-2">
              {adaptersInfo.map((adapter) => (
                <button
                  key={adapter.id}
                  onClick={() => setSelectedAdapter(adapter.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-colors ${
                    selectedAdapter === adapter.id
                      ? `border-${adapter.color}-300 bg-${adapter.color}-50 text-${adapter.color}-700`
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium">{adapter.name}</span>
                  {selectedAdapter === adapter.id && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Demo Selector */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3">Demo</h3>
            <div className="flex flex-wrap gap-2">
              {demos.map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.id}
                    onClick={() => {
                      if (!demo.disabled) {
                        setSelectedDemo(demo.id as any);
                      }
                    }}
                    disabled={demo.disabled}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-colors ${
                      demo.disabled
                        ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                        : selectedDemo === demo.id
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{demo.label}</span>
                    {selectedDemo === demo.id && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Generation */}
        <Card className="mb-8 border-2 border-indigo-100">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg">Generate UI with AI</CardTitle>
            </div>
            <CardDescription>Describe your UI and watch it come to life</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 max-w-xl">
              <Input 
                placeholder="A modern login form with email and password..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleGenerateUI} 
                disabled={!serverReady || isGenerating || !prompt}
                className="bg-indigo-600 hover:bg-indigo-700 px-6 whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            {errorMsg && (
              <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {errorMsg}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Split View */}
        <div className="resize-container flex flex-col md:flex-row gap-6" style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
          {/* Schema Panel */}
          <Card 
            className="border-2 flex flex-col h-[700px]" 
            style={{ width: `${schemaWidth}%`, minWidth: '200px' }}
          >
            <CardHeader className="border-b bg-slate-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-slate-600" />
                  <CardTitle className="text-lg">Schema</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyJSON}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                    <Download className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  fontSize: '0.875rem',
                  height: '100%',
                  overflow: 'auto',
                }}
                showLineNumbers
              >
                {currentSchemaString}
              </SyntaxHighlighter>
            </CardContent>
          </Card>

          {/* Resize Handle */}
          <div 
            className={`flex w-6 bg-slate-100 hover:bg-slate-200 cursor-col-resize transition-all duration-200 group ${
              isResizing ? 'bg-indigo-200 hover:bg-indigo-300' : ''
            }`}
            onMouseDown={handleMouseDown}
            style={{ minHeight: '700px' }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
                <div className="flex flex-col gap-0.5">
                  <div className="w-0.5 h-1 bg-slate-400 rounded-full"></div>
                  <div className="w-0.5 h-1 bg-slate-400 rounded-full"></div>
                  <div className="w-0.5 h-1 bg-slate-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <Card 
            className="border-2 flex flex-col h-[700px]" 
            style={{ width: `${100 - schemaWidth}%`, minWidth: '200px' }}
          >
            <CardHeader className="border-b bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-lg">Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-auto">
              <div className="h-full rounded-lg bg-white border-2 border-dashed border-slate-200 p-4">
                {selectedAdapter === 'chakra-ui' ? (
                  <ChakraProvider theme={chakraTheme}>
                    <UIFactory key={`${selectedAdapter}-${selectedDemo}`} schema={schemaWithAdapter} />
                  </ChakraProvider>
                ) : selectedAdapter === 'material-ui' ? (
                  <ThemeProvider theme={materialUITheme}>
                    <UIFactory key={`${selectedAdapter}-${selectedDemo}`} schema={schemaWithAdapter} />
                  </ThemeProvider>
                ) : (
                  <UIFactory key={`${selectedAdapter}-${selectedDemo}`} schema={schemaWithAdapter} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>Built with Dynamic UI Factory • One schema, infinite possibilities</p>
        </footer>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
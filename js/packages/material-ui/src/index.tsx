import React from 'react';
import { AdapterRegistry } from '@dgui/adapters';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const materialUIAdapter: AdapterRegistry['material-ui'] = {
  button: {
    render: (component, children) => {
      const variantMap: Record<string, string> = {
        default: 'bg-blue-600 hover:bg-blue-700 text-white',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        destructive: 'bg-red-600 hover:bg-red-700 text-white',
      };
      return (
        <button
          disabled={component.props?.disabled}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            variantMap[component.props?.variant || 'default']
          } ${component.props?.className || ''} disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wide shadow-md`}
        >
          {component.props?.label || children}
        </button>
      );
    },
  },
  input: {
    render: (component) => (
      <div className="relative">
        <input
          type={component.props?.type || 'text'}
          placeholder={component.props?.placeholder}
          value={component.props?.value}
          disabled={component.props?.disabled}
          className={`w-full px-3 py-3 border-b-2 border-gray-400 focus:border-blue-600 outline-none transition-colors bg-transparent ${
            component.props?.className || ''
          }`}
        />
      </div>
    ),
  },
  text: {
    render: (component, children) => {
      const Tag = component.props?.tag || 'p';
      return React.createElement(
        Tag,
        { className: `${component.props?.className || ''} text-gray-800` },
        component.props?.content || children
      );
    },
  },
  card: {
    render: (component, children) => (
      <div className={`bg-white rounded shadow-lg overflow-hidden ${component.props?.className || ''}`}>
        {component.props?.title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{component.props?.title}</h3>
            {component.props?.description && (
              <p className="text-sm text-gray-600 mt-1">{component.props?.description}</p>
            )}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    ),
  },
  alert: {
    render: (component, children) => {
      const colorMap: Record<string, string> = {
        default: 'bg-blue-50 border-blue-500 text-blue-900',
        destructive: 'bg-red-50 border-red-500 text-red-900',
      };
      return (
        <div className={`p-4 border-l-4 flex items-start gap-3 ${colorMap[component.props?.variant || 'default']}`}>
          {component.props?.variant === 'destructive' ? (
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
          )}
          <p className="text-sm">{component.props?.message || children}</p>
        </div>
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
      <div className={component.props?.className}>{children}</div>
    ),
  },
  grid: {
    render: (component, children) => (
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${component.layout?.columns || 1}, 1fr)`,
          gap: `${component.layout?.gap || 4}px`,
          ...component.props?.style,
        }}
      >
        {children}
      </div>
    ),
  },
  stack: {
    render: (component, children) => (
      <div
        className="flex"
        style={{
          flexDirection: component.layout?.direction || 'column',
          gap: `${component.layout?.gap || 8}px`,
          ...component.props?.style,
        }}
      >
        {children}
      </div>
    ),
  },
};
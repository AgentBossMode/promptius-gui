import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdapterRegistry } from '@dgui/adapters';

export const antDesignAdapter: AdapterRegistry['ant-design'] = {
  button: {
    render: (component, children) => {
      const variantMap: Record<string, string> = {
        default: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
        outline: 'bg-white border-2 border-blue-500 text-blue-500 hover:text-blue-600 hover:border-blue-600',
        destructive: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
      };
      return (
        <button
          disabled={component.props?.disabled}
          className={`px-4 py-1.5 rounded border transition-colors font-normal ${
            variantMap[component.props?.variant || 'default']
          } ${component.props?.className || ''} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {component.props?.label || children}
        </button>
      );
    },
  },
  input: {
    render: (component) => (
      <input
        type={component.props?.type || 'text'}
        placeholder={component.props?.placeholder}
        value={component.props?.value}
        disabled={component.props?.disabled}
        className={`w-full px-3 py-1.5 border border-gray-300 rounded hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all ${
          component.props?.className || ''
        }`}
      />
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
      <div className={`bg-white rounded-sm border border-gray-200 overflow-hidden ${component.props?.className || ''}`}>
        {component.props?.title && (
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h3 className="text-base font-semibold text-gray-900">{component.props?.title}</h3>
            {component.props?.description && (
              <p className="text-sm text-gray-500 mt-1">{component.props?.description}</p>
            )}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    ),
  },
  alert: {
    render: (component, children) => {
      const styleMap: Record<string, string> = {
        default: 'bg-blue-50 border-blue-200 text-blue-800',
        destructive: 'bg-red-50 border-red-200 text-red-800',
      };
      return (
        <div className={`p-3 rounded-sm border flex items-start gap-2 ${styleMap[component.props?.variant || 'default']}`}>
          {component.props?.variant === 'destructive' ? (
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
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
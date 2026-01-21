/**
 * Component Templates Library
 * Pre-built templates and examples for AI generation
 */

export const COMPONENT_TEMPLATES = {
  button: {
    name: 'Button',
    description: 'Interactive button component with variants',
    code: `export default function Button({ children, variant = 'primary', onClick }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  }
  
  return (
    <button
      onClick={onClick}
      className={\`px-6 py-2 rounded-lg font-semibold transition-colors \${variants[variant]}\`}
    >
      {children}
    </button>
  )
}`,
    example: `<Button variant="primary" onClick={() => alert('Clicked!')}>
  Click Me
</Button>`,
  },

  card: {
    name: 'Card',
    description: 'Container component with shadow and padding',
    code: `export default function Card({ title, children, footer }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  )
}`,
    example: `<Card 
  title="Example Card" 
  footer={<Button>Action</Button>}
>
  <p>Card content goes here</p>
</Card>`,
  },

  input: {
    name: 'Input',
    description: 'Text input with label and error handling',
    code: `export default function Input({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        className={\`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent \${
          error ? 'border-red-500' : 'border-gray-300'
        }\`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}`,
    example: `<Input 
  label="Email" 
  type="email" 
  placeholder="you@example.com"
  error="Invalid email"
/>`,
  },

  modal: {
    name: 'Modal',
    description: 'Overlay modal dialog component',
    code: `export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        {title && (
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        )}
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}`,
    example: `<Modal 
  isOpen={true} 
  onClose={() => {}} 
  title="Welcome"
>
  <p>Modal content</p>
</Modal>`,
  },

  badge: {
    name: 'Badge',
    description: 'Small status indicator or label',
    code: `export default function Badge({ children, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
  }
  
  return (
    <span className={\`inline-block px-3 py-1 text-xs font-semibold rounded-full \${colors[color]}\`}>
      {children}
    </span>
  )
}`,
    example: `<Badge color="green">Active</Badge>`,
  },

  alert: {
    name: 'Alert',
    description: 'Notification or alert message component',
    code: `export default function Alert({ type = 'info', title, children, onClose }) {
  const types = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }
  
  return (
    <div className={\`p-4 border-l-4 rounded-lg \${types[type]}\`}>
      <div className="flex items-start justify-between">
        <div>
          {title && <h4 className="font-bold mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}`,
    example: `<Alert type="success" title="Success!">
  Your changes have been saved.
</Alert>`,
  },
}

export const STYLE_PRESETS = {
  modern: {
    name: 'Modern',
    description: 'Clean, minimal design with rounded corners',
    classes: 'rounded-lg shadow-lg',
  },
  classic: {
    name: 'Classic',
    description: 'Traditional design with subtle borders',
    classes: 'border border-gray-300 shadow-sm',
  },
  bold: {
    name: 'Bold',
    description: 'High contrast with strong borders',
    classes: 'border-4 border-black shadow-2xl',
  },
}

export function getTemplateByName(name) {
  return COMPONENT_TEMPLATES[name.toLowerCase()] || null
}

export function getAllTemplates() {
  return Object.entries(COMPONENT_TEMPLATES).map(([key, template]) => ({
    key,
    ...template,
  }))
}

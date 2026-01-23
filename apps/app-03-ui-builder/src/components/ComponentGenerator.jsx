import { useState } from "react";
import { Wand2, Loader } from "lucide-react";
import {
  getTemplateByName,
  COMPONENT_TEMPLATES,
} from "../lib/component-templates";

export default function ComponentGenerator({ onGenerate, isLoading }) {
  const [description, setDescription] = useState("");
  const [componentType, setComponentType] = useState("");
  const [includeProps, setIncludeProps] = useState(true);
  const [includeStyles, setIncludeStyles] = useState(true);

  const handleGenerate = async () => {
    if (!description.trim() || isLoading) return;

    // Check if it matches a template
    const template = getTemplateByName(componentType || description);

    if (template) {
      onGenerate({
        code: template.code,
        description: template.description,
        example: template.example,
        dependencies: ["react", "lucide-react"],
      });
      return;
    }

    // Generate custom component using real AI
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Generate a React component based on this description: ${description}

Component Type: ${componentType || "auto-detect"}
Include Props: ${includeProps}
Use Tailwind CSS: ${includeStyles}

Requirements:
1. Export as default function
2. Use modern React patterns (hooks, functional components)
3. Include Tailwind CSS classes for styling
4. Add prop validation comments
5. Include example usage in JSDoc comment
6. Make it production-ready

Return ONLY the component code, no explanations.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedCode =
        data.content || data.message || "Error generating component";

      onGenerate({
        code: generatedCode,
        description: `AI-generated ${componentType || "component"}: ${description}`,
        example: `<CustomComponent />`,
        dependencies: ["react", "lucide-react"],
      });
    } catch (error) {
      console.error("Component generation error:", error);
      // Fallback to basic generation if API fails
      const fallbackCode = generateComponent(description, {
        includeProps,
        includeStyles,
        type: componentType,
      });

      onGenerate({
        code: fallbackCode,
        description: `Basic ${componentType || "component"} (AI unavailable): ${description}`,
        example: `<CustomComponent />`,
        dependencies: ["react", "lucide-react"],
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Describe Your Component
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., A pricing card with three tiers, icons, and a call-to-action button..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          rows={4}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Component Type
          </label>
          <select
            value={componentType}
            onChange={(e) => setComponentType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          >
            <option value="">Auto-detect</option>
            {Object.entries(COMPONENT_TEMPLATES).map(([key, template]) => (
              <option key={key} value={key}>
                {template.name}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Options
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeProps}
              onChange={(e) => setIncludeProps(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 text-purple-600"
            />
            <span className="text-sm text-gray-700">Include Props</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeStyles}
              onChange={(e) => setIncludeStyles(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 text-purple-600"
            />
            <span className="text-sm text-gray-700">
              Include Tailwind Styles
            </span>
          </label>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !description.trim()}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Component
          </>
        )}
      </button>
    </div>
  );
}

function generateComponent(description, options) {
  const { includeProps, includeStyles, type } = options;

  // Simple component generation
  const componentName = type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : "CustomComponent";

  const propsSignature = includeProps
    ? "{ children, className, ...props }"
    : "{ children }";

  const styleClasses = includeStyles
    ? "className={`p-6 bg-white rounded-lg shadow-lg ${className || ''}`}"
    : "className={className}";

  return `export default function ${componentName}(${propsSignature}) {
  return (
    <div ${styleClasses} {...props}>
      {/* ${description} */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          ${componentName}
        </h2>
        <p className="text-gray-600">
          This component was generated from your description.
          Customize it to match your exact requirements.
        </p>
        {children}
      </div>
    </div>
  )
}`;
}

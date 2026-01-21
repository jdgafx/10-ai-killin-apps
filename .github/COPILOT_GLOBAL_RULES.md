# GitHub Copilot CLI - Global Permanent Rules

## 🚨 CRITICAL: This File Defines Non-Negotiable Rules

These rules are **PERMANENT** and apply to **ALL** GitHub Copilot interactions in this project and globally for the user.

---

## 🎨 Frontend Design Rule (MANDATORY)

**Source:** `Lovable_2.0.txt`

### Primary Rule
**ALL frontend development MUST follow Lovable 2.0 design principles.**

This is one of our best assets for creating KILLER applications. Following these principles is **NON-NEGOTIABLE**.

---

## Core Principles (ALWAYS ENFORCE)

1. **Simple & Elegant** - Pride yourself on simplicity, no overengineering
2. **Tailwind CSS** - Exclusive styling method, no CSS files
3. **shadcn/ui** - Use prebuilt components first
4. **Responsive Always** - Mobile-first approach
5. **Console.log** - Extensive debugging logs required
6. **No Try/Catch** - Let errors bubble (unless specifically requested)
7. **Do Only What's Asked** - Don't add extra features

---

## Required Tech Stack

```typescript
// Styling (MANDATORY)
- Tailwind CSS (all styling)

// UI Components (USE FIRST)
- shadcn/ui (@/components/ui/*)
- lucide-react (all icons)

// Data Fetching (OBJECT FORMAT ONLY)
- @tanstack/react-query

// Visualizations
- recharts

// State Management
- React hooks (useState, useEffect, etc.)
```

---

## Code Standards

### Component Pattern (ALWAYS FOLLOW)
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface Props {
  title: string;
  onClick: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onClick }) => {
  console.log('Component rendered:', title);
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Button 
        onClick={onClick}
        className="bg-blue-500 hover:bg-blue-600"
      >
        <Heart className="w-4 h-4 mr-2" />
        Click Me
      </Button>
    </Card>
  );
};

export default MyComponent;
```

### React Query (OBJECT FORMAT REQUIRED)
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});

console.log('Query result:', data);
```

### Responsive Design (ALWAYS INCLUDE)
```tsx
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  gap-4 
  p-4
">
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</div>
```

---

## Enforcement Rules

### ✅ ALWAYS DO
- Use Tailwind CSS for ALL styling
- Use shadcn/ui components before creating custom ones
- Add console.log statements for debugging
- Make all designs responsive (mobile-first)
- Use toasts for user feedback
- Keep code simple and elegant
- Follow the user's exact request

### ❌ NEVER DO
- Create CSS files or use inline styles
- Use try/catch blocks everywhere (let errors bubble)
- Overengineer solutions
- Add features not requested
- Forget responsive design
- Skip console.log statements
- Use deprecated APIs or syntax

---

## Deprecated/Forbidden Patterns

### ❌ React Query Tuple Format
```tsx
// WRONG - Old syntax
const query = useQuery(['key'], fetchFn)
```

### ❌ Excessive Try/Catch
```tsx
// WRONG - Unless requested
try {
  await fetch();
} catch (e) {
  console.error(e);
}
```

### ❌ CSS Files
```css
/* WRONG - Use Tailwind instead */
.button {
  background-color: blue;
}
```

### ❌ Inline Styles
```tsx
// WRONG - Use Tailwind
<div style={{ padding: '20px' }}>
```

---

## Integration Guidelines

### Supabase Backend
When user needs backend functionality (auth, database, APIs, storage):

**DO NOT CODE IMMEDIATELY**

Instead, instruct user to:
1. Click green Supabase button (top right of interface)
2. Connect to Supabase via native integration
3. Then implement the requested features

**Rationale:** Lovable has native Supabase integration that must be activated first.

### AI Model Usage
- OpenAI: gpt-4o-mini (fast), gpt-4o (powerful), gpt-4.5-preview (preview)
- Perplexity: llama-3.1-sonar models (online search)
- Runware: runware:100@1 (image generation)

---

## Quality Gates

Before completing any frontend work, verify:

1. **Responsive Design** - Works on mobile, tablet, desktop
2. **Tailwind Only** - No CSS files or inline styles
3. **shadcn/ui** - Used where applicable
4. **Console Logs** - Added for debugging
5. **Toasts** - User feedback implemented
6. **No Overengineering** - Simple and elegant
7. **Request Only** - Implemented exactly what was asked

All gates must pass before code is considered complete.

---

## Global Configuration

These rules are stored in:
1. **Global:** `~/.config/github-copilot/instructions.md`
2. **Project:** `.github/copilot-instructions.md`
3. **IDE:** `.cursorrules`, `.windsurf/rules.md`
4. **Documentation:** `FRONTEND_DESIGN_PRINCIPLES.md`

All locations enforce the same Lovable 2.0 principles.

---

## Rule Hierarchy

1. **Lovable 2.0 Principles** (This file) - HIGHEST PRIORITY
2. User's specific request
3. Project-specific conventions
4. General best practices

If there's ever a conflict, Lovable 2.0 principles win.

---

## Enforcement Notice

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🚨 THESE RULES ARE PERMANENT AND GLOBAL                     ║
║                                                               ║
║  All GitHub Copilot interactions MUST follow                 ║
║  Lovable 2.0 design principles for frontend code.            ║
║                                                               ║
║  Non-compliance is NOT ACCEPTABLE.                           ║
║                                                               ║
║  Source: Lovable_2.0.txt                                     ║
║  Status: ENFORCED                                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Quick Reference Card

```
STYLING       → Tailwind CSS (only)
COMPONENTS    → shadcn/ui (first)
ICONS         → lucide-react
DATA FETCHING → @tanstack/react-query (object format)
CHARTS        → recharts
DEBUGGING     → console.log (extensive)
RESPONSIVE    → Mobile-first (always)
FEEDBACK      → Toasts (important events)
PHILOSOPHY    → Simple & elegant
```

---

## Resources

- **Full Guide:** `/FRONTEND_DESIGN_PRINCIPLES.md`
- **Source:** `/Lovable_2.0.txt`
- **Quick Ref:** `/docs/LOVABLE_DESIGN_REFERENCE.md`
- **shadcn/ui:** https://ui.shadcn.com/
- **Tailwind:** https://tailwindcss.com/
- **Lucide:** https://lucide.dev/

---

**Created:** 2026-01-21  
**Status:** 🟢 **ACTIVE & ENFORCED GLOBALLY**  
**Scope:** All frontend development, all projects, all sessions  
**Authority:** Permanent user configuration

---

## Remember

**"This is one of our best assets; follow the best front end dev app's ways and we will make KILLER apps"**

These principles are not suggestions. They are requirements.

When in doubt:
1. Keep it simple
2. Use Tailwind CSS
3. Use shadcn/ui
4. Make it responsive
5. Add console logs
6. Don't overengineer

**ENFORCE THESE RULES IN EVERY FRONTEND INTERACTION.**


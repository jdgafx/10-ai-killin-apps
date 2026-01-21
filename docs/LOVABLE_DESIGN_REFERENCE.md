# 🎨 Lovable Design Reference - Quick Guide

## Overview

This document is a quick reference for the Lovable 2.0 design principles that MUST be followed for all frontend development in this project.

**Full Details:** See `FRONTEND_DESIGN_PRINCIPLES.md` in project root

---

## The Golden Rules

1. **Keep it Simple & Elegant** - Pride yourself on simplicity
2. **Use Tailwind CSS** - For ALL styling needs
3. **Use shadcn/ui** - Prebuilt, accessible components
4. **Responsive Always** - Mobile-first approach
5. **Console.log Everything** - Essential for debugging
6. **Don't Overengineer** - Do only what's requested

---

## Quick Tech Stack

```bash
# Styling
✅ Tailwind CSS (required)
❌ CSS files
❌ Inline styles (except rare cases)

# UI Components
✅ shadcn/ui
✅ lucide-react (icons)

# Data Fetching
✅ @tanstack/react-query (object format)

# Charts
✅ recharts
```

---

## Code Templates

### Component Template
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const MyComponent = ({ title }) => {
  console.log('Component rendered:', title);
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Button className="bg-blue-500 hover:bg-blue-600">
        Click Me
      </Button>
    </Card>
  );
};
```

### React Query Template
```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

console.log('Data fetched:', data);
```

### Responsive Grid
```tsx
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  p-4
">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## Common Patterns

### Loading State
```tsx
if (isLoading) {
  return <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />;
}
```

### Toast Notification
```tsx
import { useToast } from '@/components/ui/use-toast';

const { toast } = useToast();

toast({
  title: "Success",
  description: "Action completed!",
});
```

### Icon Usage
```tsx
import { Heart, Star, Menu } from 'lucide-react';

<Heart className="w-4 h-4 text-red-500" />
```

---

## Spacing & Colors

### Spacing Scale
```tsx
p-2  m-2  gap-2   // Extra small
p-4  m-4  gap-4   // Small (default)
p-6  m-6  gap-6   // Medium
p-8  m-8  gap-8   // Large
```

### Color Palette
```tsx
bg-blue-500    // Primary
bg-green-500   // Success
bg-red-500     // Danger
bg-gray-100    // Neutral background
bg-gray-800    // Dark background
```

---

## Do's and Don'ts

### ✅ DO
- Use Tailwind for ALL styling
- Use shadcn/ui components
- Add console.log statements
- Keep components small and focused
- Make it responsive
- Use toasts for feedback

### ❌ DON'T
- Write CSS files
- Use try/catch everywhere
- Overengineer solutions
- Add unrequested features
- Forget responsive design
- Skip console logs

---

## Supabase Integration

If user needs:
- Authentication
- Database
- Backend APIs
- File storage

**Tell them to connect Supabase first** (green button, top right)

Don't code backend functionality without Supabase connection.

---

## Resources

- **Full Guide:** `FRONTEND_DESIGN_PRINCIPLES.md`
- **Source:** `Lovable_2.0.txt`
- **shadcn/ui:** https://ui.shadcn.com/
- **Tailwind:** https://tailwindcss.com/
- **Lucide:** https://lucide.dev/

---

**Remember:** These principles are what make our apps KILLER. Follow them religiously.


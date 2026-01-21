# 🎨 FRONTEND DESIGN PRINCIPLES - PERMANENT RULE

## ⚠️ CRITICAL: ALWAYS FOLLOW THESE PRINCIPLES

**Source:** `Lovable_2.0.txt` - One of our best assets for creating KILLER apps

**Rule:** All frontend development in this project MUST follow the Lovable.dev design principles and best practices outlined below. This is non-negotiable for maintaining world-class UI/UX quality.

---

## 🏆 Core Philosophy

**"Take great pride in keeping things simple and elegant"**

- Don't overengineer the code
- Focus on the user's request - make minimum changes needed
- Don't do more than what the user asks for
- Keep components small, focused, and maintainable

---

## 🎯 Essential Design Principles

### 1. **Always Generate Responsive Designs**
- Mobile-first approach
- Use Tailwind CSS responsive utilities
- Test across device sizes

### 2. **Tailwind CSS - Primary Styling Method**
- Use Tailwind classes extensively for:
  - Layout (flex, grid)
  - Spacing (p-*, m-*, gap-*)
  - Colors (bg-*, text-*)
  - Typography (text-*, font-*)
  - Responsive design (sm:, md:, lg:, xl:)
- Avoid inline styles unless absolutely necessary

### 3. **shadcn/ui - Component Library**
- ALWAYS try to use shadcn/ui components first
- These are prebuilt, accessible, and production-ready
- Import and use them directly
- Create new components only if shadcn doesn't have what you need
- Available at: https://ui.shadcn.com/

### 4. **User Feedback with Toasts**
- Use toast components to inform users about important events
- Success, error, warning, info states
- Clear, concise messaging

---

## 📦 Tech Stack & Libraries

### Required Libraries (Already Installed)

1. **lucide-react** - Icons
   ```tsx
   import { Heart, Star, Menu } from 'lucide-react'
   ```

2. **recharts** - Charts & Graphs
   ```tsx
   import { LineChart, BarChart, PieChart } from 'recharts'
   ```

3. **@tanstack/react-query** - Data Fetching
   ```tsx
   // ALWAYS use object format
   const { data, isLoading, error } = useQuery({
     queryKey: ['todos'],
     queryFn: fetchTodos,
   });
   ```
   - Use `onSettled` instead of deprecated `onError`
   - Object format is required (not the old tuple format)

4. **shadcn/ui** - UI Components
   - Button, Card, Dialog, Sheet, Toast, etc.
   - Import from `@/components/ui/*`

---

## 🚫 What NOT to Do

### 1. **Don't Use Try/Catch Unless Requested**
```tsx
// ❌ DON'T DO THIS (unless user specifically asks)
try {
  await fetchData();
} catch (error) {
  console.error(error);
}

// ✅ DO THIS - Let errors bubble up
await fetchData(); // Errors will bubble back to you for fixing
```

**Why:** Errors need to bubble up so you can see and fix them. Try/catch hides issues.

### 2. **Don't Overengineer**
- Don't add complex error handling unprompted
- Don't add fallback mechanisms unless requested
- Don't add loading states everywhere unless needed
- Keep it simple, keep it clean

### 3. **Don't Do More Than Asked**
- If user asks for a button, make a button
- Don't add animations, tooltips, or extra features unless requested
- Stay focused on the specific request

### 4. **Don't Use Deprecated APIs**
- ❌ Old React Query syntax (tuple format)
- ❌ `onError` property (use `onSettled` or `options.meta.onError`)
- ❌ Deprecated OpenAI models (gpt-4-vision-preview, text-davinci)

---

## ✅ Best Practices

### 1. **Console Logs for Debugging**
```tsx
console.log('User clicked button:', buttonId);
console.log('API response:', data);
```
- Use extensively during development
- Helps track code flow
- Essential for debugging

### 2. **Component Structure**
```tsx
// Small, focused, single-responsibility components
const UserCard = ({ user }) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-gray-600">{user.email}</p>
    </Card>
  );
};
```

### 3. **Proper String Escaping in JSX**
```tsx
// ❌ WRONG - Unescaped quotes
setQuote('I can't do this')

// ✅ CORRECT - Properly escaped
setQuote("I can't do this")
// or
setQuote('I can\'t do this')
```

### 4. **Responsive Design Pattern**
```tsx
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  gap-4
  p-4
">
  {/* Cards */}
</div>
```

---

## 🎨 Styling Guidelines

### Color Palette (Tailwind)
```tsx
// Primary actions
className="bg-blue-500 hover:bg-blue-600"

// Success states
className="bg-green-500 text-white"

// Danger/Delete
className="bg-red-500 hover:bg-red-600"

// Neutral
className="bg-gray-100 text-gray-800"
```

### Spacing System
```tsx
// Consistent spacing
className="p-4 m-2 gap-4"  // Small
className="p-6 m-4 gap-6"  // Medium
className="p-8 m-6 gap-8"  // Large
```

### Typography
```tsx
className="text-sm"     // Small text
className="text-base"   // Body text
className="text-lg"     // Large text
className="text-xl"     // Heading
className="text-2xl"    // Large heading

className="font-normal"
className="font-semibold"
className="font-bold"
```

---

## 🔧 Integration Patterns

### Supabase Integration
**IMPORTANT:** If user needs backend functionality:
- Authentication (login/logout)
- Database storage
- Backend APIs
- File storage

**DO NOT CODE.** Instead, tell user to:
1. Click the green Supabase button (top right)
2. Connect to Supabase using native integration
3. Then you can help implement features

Link to docs: https://docs.lovable.dev/integrations/supabase/

### AI Model Integration
```tsx
// OpenAI (use latest models)
- gpt-4o-mini (fast, cheap, vision)
- gpt-4o (powerful, expensive, vision)
- gpt-4.5-preview (preview, very powerful)

// Perplexity (online search)
- llama-3.1-sonar-small-128k-online (8B)
- llama-3.1-sonar-large-128k-online (70B)
- llama-3.1-sonar-huge-128k-online (405B)

// Runware (image generation)
- runware:100@1 (default model)
```

---

## 📝 Code Writing Rules

### File Organization
```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── Button.tsx       # Custom components
│   └── UserCard.tsx
├── utils/
│   ├── api.ts           # API utilities
│   └── helpers.ts       # Helper functions
├── hooks/
│   └── useUser.ts       # Custom hooks
└── lib/
    └── config.ts        # Configuration
```

### Component Pattern
```tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Button onClick={onClick} className="w-full">
        Click Me
      </Button>
    </div>
  );
};

export default MyComponent;
```

---

## 🎯 Quality Checklist

Before completing any frontend work, verify:

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Tailwind CSS used for all styling
- [ ] shadcn/ui components used where applicable
- [ ] Console logs added for debugging
- [ ] No unnecessary try/catch blocks
- [ ] No overengineering or extra features
- [ ] Proper string escaping in JSX
- [ ] User feedback via toasts for important actions
- [ ] Clean, simple, elegant code
- [ ] Only implemented what was requested

---

## 🚀 Example: Perfect Component

```tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface UserCardProps {
  userId: string;
}

const UserCard: React.FC<UserCardProps> = ({ userId }) => {
  const { toast } = useToast();
  
  // Data fetching with React Query (object format)
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const handleLike = () => {
    console.log('User liked:', userId);
    toast({
      title: "Success",
      description: "User liked successfully!",
    });
  };

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />;
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {user?.name}
          </h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        
        <Button
          onClick={handleLike}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Heart className="w-4 h-4 mr-2" />
          Like
        </Button>
      </div>
    </Card>
  );
};

export default UserCard;
```

---

## 📖 References

**Primary Source:** `/home/chris/dev/10-ai-killin-apps/Lovable_2.0.txt`

**Official Resources:**
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/
- Lucide Icons: https://lucide.dev/
- React Query: https://tanstack.com/query/latest
- Lovable Docs: https://docs.lovable.dev/

---

## 🎯 REMEMBER

**"This is one of our best assets; follow the best front end dev app's ways and we will make KILLER apps"**

Every frontend component, every piece of UI, every interaction should follow these principles. This is how we create world-class applications that users love.

**When in doubt:**
1. Keep it simple
2. Use Tailwind CSS
3. Use shadcn/ui
4. Make it responsive
5. Add console logs
6. Don't overengineer

---

**Created:** 2026-01-21  
**Status:** 🟢 **PERMANENT RULE - ALWAYS FOLLOW**  
**Applies To:** All frontend development in this project and future projects

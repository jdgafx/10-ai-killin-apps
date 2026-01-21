# GitHub Copilot - Project Instructions

## 🎨 MANDATORY RULE: Lovable 2.0 Frontend Design Principles

**CRITICAL:** All frontend development in this project MUST follow Lovable 2.0 design principles from `Lovable_2.0.txt`.

This is a **permanent, non-negotiable rule** for maintaining world-class UI/UX quality.

---

## Quick Reference

### Always Use
✅ **Tailwind CSS** - Exclusive styling method  
✅ **shadcn/ui** - UI component library  
✅ **lucide-react** - Icons  
✅ **@tanstack/react-query** - Data fetching (object format)  
✅ **Console.log** - Extensive debugging  
✅ **Responsive design** - Mobile-first approach  
✅ **Toast notifications** - User feedback  

### Never Use
❌ CSS files or inline styles  
❌ Try/catch everywhere  
❌ Overengineered solutions  
❌ Unrequested features  
❌ Deprecated React Query syntax  

---

## Core Philosophy

**"Keep things simple and elegant. Don't overengineer. Do only what's requested."**

---

## Code Templates

### Component Pattern
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const MyComponent: React.FC<Props> = ({ title }) => {
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

### React Query (Object Format)
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## Quality Checklist

Every component must:
- [ ] Be responsive (mobile, tablet, desktop)
- [ ] Use Tailwind CSS exclusively
- [ ] Use shadcn/ui where applicable
- [ ] Include console.log for debugging
- [ ] Have toast notifications for feedback
- [ ] Be simple and elegant

---

## Full Documentation

See `/FRONTEND_DESIGN_PRINCIPLES.md` for complete guidelines.

**Source:** `Lovable_2.0.txt`

---

**Status:** 🟢 **ENFORCED FOR ALL FRONTEND CODE**

# Frontend Design Rules - Quick Summary

## 🎨 One Rule to Rule Them All

**ALL frontend development MUST follow Lovable 2.0 design principles**

Source: `Lovable_2.0.txt` - Our best asset for KILLER apps

---

## The 7 Commandments

1. **Thou shalt use Tailwind CSS exclusively**
2. **Thou shalt use shadcn/ui components first**
3. **Thou shalt make all designs responsive**
4. **Thou shalt use console.log extensively**
5. **Thou shalt keep code simple and elegant**
6. **Thou shalt not overengineer**
7. **Thou shalt do only what is requested**

---

## Global Enforcement

These rules are enforced in:
- ✅ `~/.config/github-copilot/instructions.md` (Global)
- ✅ `.github/copilot-instructions.md` (Project)
- ✅ `.github/COPILOT_GLOBAL_RULES.md` (Reference)
- ✅ `.cursorrules` (Cursor IDE)
- ✅ `FRONTEND_DESIGN_PRINCIPLES.md` (Full docs)
- ✅ `docs/LOVABLE_DESIGN_REFERENCE.md` (Quick ref)

---

## Code Pattern

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Component = ({ title }) => {
  console.log('Rendered:', title);
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      <Button className="bg-blue-500 hover:bg-blue-600">
        Click Me
      </Button>
    </Card>
  );
};
```

---

## Status

🟢 **PERMANENT GLOBAL RULE - ALWAYS ENFORCED**


# UI Components

## 🎨 Design System

Study Sphere uses Tailwind CSS and Radix UI primitives for consistent, accessible components.

## 🏗️ Component Structure

```
src/components/ui/       # Base UI components
├── button.tsx          # Button variants
├── card.tsx           # Container components
├── dialog.tsx         # Modal dialogs
├── input.tsx          # Form inputs
├── textarea.tsx       # Text areas
├── select.tsx         # Dropdown selects
├── checkbox.tsx       # Checkboxes
├── switch.tsx         # Toggle switches
├── badge.tsx          # Status badges
├── progress.tsx       # Progress bars
├── flashcard.tsx      # Custom flashcard component
└── ...               # Other UI primitives
```

## 🎯 Design Tokens

### Colors
- **Primary**: Dark text and buttons
- **Secondary**: Light backgrounds
- **Muted**: Subtle backgrounds
- **Accent**: Highlighted elements
- **Destructive**: Error states

### Typography
- **Sans**: Geist Sans (primary font)
- **Mono**: Geist Mono (code font)

## 🧩 Key Components

### Button Component
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
  }
);
```

### Card Component
```typescript
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
```

## 🎨 Theme Support

### Dark/Light Mode
- System preference detection
- Manual theme switching
- Consistent color schemes
- Accessible contrast ratios

### CSS Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
}
```

## ♿ Accessibility Features

### Accessibility Implementation Flow
```mermaid
flowchart TD
    A[Component Development] --> B[WCAG 2.1 AA Guidelines]
    B --> C[Keyboard Navigation]
    B --> D[Screen Reader Support]
    B --> E[Color Contrast]
    B --> F[Focus Management]
    
    C --> G[Tab Order]
    C --> H[Keyboard Shortcuts]
    C --> I[Enter/Space Actions]
    
    D --> J[ARIA Labels]
    D --> K[ARIA Descriptions]
    D --> L[Semantic HTML]
    
    E --> M[Contrast Ratio 4.5:1]
    E --> N[Color Independence]
    
    F --> O[Focus Indicators]
    F --> P[Focus Trapping]
    F --> Q[Skip Links]
    
    G --> R[Accessible Component]
    H --> R
    I --> R
    J --> R
    K --> R
    L --> R
    M --> R
    N --> R
    O --> R
    P --> R
    Q --> R
```

### Component Accessibility Flow
```mermaid
flowchart TD
    A[User Interaction] --> B{Input Method}
    B -->|Mouse| C[Click Handler]
    B -->|Keyboard| D[Key Handler]
    B -->|Screen Reader| E[ARIA Announcements]
    
    C --> F[Visual Feedback]
    D --> G[Keyboard Navigation]
    E --> H[Semantic Information]
    
    F --> I[Focus Styles]
    G --> J[Tab Management]
    H --> K[Role Descriptions]
    
    I --> L[Accessible Action]
    J --> L
    K --> L
    
    L --> M[State Update]
    M --> N[Screen Reader Notification]
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint system:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## 🎯 Component Usage

### Component Hierarchy Flow
```mermaid
flowchart TD
    A[App Layout] --> B[Theme Provider]
    B --> C[Navigation Components]
    B --> D[Page Components]
    
    C --> E[Navbar]
    C --> F[Theme Toggle]
    
    D --> G[Auth Pages]
    D --> H[Dashboard Pages]
    
    G --> I[Login Form]
    G --> J[Register Form]
    
    H --> K[Notes Page]
    H --> L[Flashcards Page]
    H --> M[Chat Page]
    H --> N[Tasks Page]
    
    K --> O[Notes Grid]
    O --> P[Note Card]
    P --> Q[Button, Input, Textarea]
    
    L --> R[Flashcard Component]
    R --> S[Card, Button, Badge]
    
    M --> T[Chat Interface]
    T --> U[Message List, Input, Button]
    
    N --> V[Task List]
    V --> W[Task Item]
    W --> X[Checkbox, Badge, Button]
```

### Form Components Flow
```mermaid
flowchart TD
    A[Form Container] --> B[Form Fields]
    B --> C[Input Components]
    B --> D[Selection Components]
    B --> E[Action Components]
    
    C --> F[Input]
    C --> G[Textarea]
    C --> H[Label]
    
    D --> I[Select]
    D --> J[Checkbox]
    D --> K[Switch]
    
    E --> L[Button]
    E --> M[Submit Handler]
    
    F --> N[Validation]
    G --> N
    I --> N
    J --> N
    K --> N
    
    N --> O{Valid?}
    O -->|Yes| P[Form Submission]
    O -->|No| Q[Show Errors]
```

### Layout Components Flow
```mermaid
flowchart TD
    A[Page Layout] --> B[Card Container]
    B --> C[Card Header]
    B --> D[Card Content]
    B --> E[Card Footer]
    
    C --> F[Card Title]
    C --> G[Card Description]
    
    D --> H[Main Content]
    D --> I[Interactive Elements]
    
    E --> J[Action Buttons]
    E --> K[Status Indicators]
    
    I --> L[Forms]
    I --> M[Lists]
    I --> N[Data Display]
    
    L --> O[Input Fields]
    L --> P[Buttons]
    
    M --> Q[Scrollable Areas]
    M --> R[Item Cards]
    
    N --> S[Progress Bars]
    N --> T[Badges]
    N --> U[Tooltips]
```

### Theme System Flow
```mermaid
flowchart TD
    A[Theme Provider] --> B[Detect System Preference]
    B --> C{User Override?}
    C -->|Yes| D[Use User Setting]
    C -->|No| E[Use System Setting]
    
    D --> F[Apply Theme]
    E --> F
    
    F --> G[Update CSS Variables]
    G --> H[Component Re-render]
    H --> I[Theme Toggle Update]
    
    J[User Clicks Toggle] --> K[Switch Theme]
    K --> L[Save Preference]
    L --> D
```

### Responsive Design Flow
```mermaid
flowchart TD
    A[Screen Size Detection] --> B{Breakpoint Check}
    B -->|< 640px| C[Mobile Layout]
    B -->|640px - 768px| D[Small Tablet]
    B -->|768px - 1024px| E[Tablet Layout]
    B -->|1024px - 1280px| F[Desktop Layout]
    B -->|> 1280px| G[Large Desktop]
    
    C --> H[Stack Vertically]
    C --> I[Hide Secondary Nav]
    C --> J[Compact Buttons]
    
    D --> K[2-Column Grid]
    E --> L[3-Column Grid]
    F --> M[Sidebar + Main]
    G --> N[Wide Layout]
    
    H --> O[Apply Mobile Styles]
    I --> O
    J --> O
    K --> P[Apply Tablet Styles]
    L --> P
    M --> Q[Apply Desktop Styles]
    N --> Q
```

### Form Example with Components
```tsx
<form>
  <Input placeholder="Enter text..." />
  <Textarea placeholder="Enter description..." />
  <Select>
    <SelectItem value="option1">Option 1</SelectItem>
  </Select>
  <Button type="submit">Submit</Button>
</form>
```

### Layout Example with Components
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

## 🔧 Configuration

Components are configured via `components.json`:
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```
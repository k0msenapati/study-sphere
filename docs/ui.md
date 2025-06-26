# UI Components and Design System Documentation

## Overview
Study Sphere implements a comprehensive design system built on modern UI principles, accessibility standards, and consistent user experience patterns. This document details the UI components, design tokens, interaction patterns, and implementation guidelines.

## Design Philosophy

### Design Principles
1. **Accessibility First**: WCAG 2.1 AA compliance for inclusive design
2. **Consistency**: Unified visual language across all components
3. **Scalability**: Modular components that scale with the application
4. **Performance**: Optimized components for fast rendering
5. **Responsiveness**: Mobile-first design for all screen sizes

### Visual Identity
- **Clean and Modern**: Minimalist interface focusing on content
- **Educational Focus**: Design elements that enhance learning
- **Professional Appearance**: Suitable for academic environments
- **Friendly Accessibility**: Welcoming but serious educational tone

## Design System Foundation

### Color System

#### Primary Colors
```typescript
// Tailwind CSS Custom Colors
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Primary brand color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  }
}
```

#### Semantic Colors
- **Success**: Green variants for positive actions and feedback
- **Warning**: Amber variants for caution and important notices
- **Error**: Red variants for errors and destructive actions
- **Info**: Blue variants for informational content

#### Background System
- **Light Mode**: Clean whites and subtle grays
- **Dark Mode**: Deep backgrounds with appropriate contrast
- **Surface Elevation**: Card-based layout with subtle shadows

### Typography Scale

#### Font Family
```css
font-family: 
  ui-sans-serif, 
  system-ui, 
  -apple-system, 
  BlinkMacSystemFont, 
  "Segoe UI", 
  Roboto, 
  "Helvetica Neue", 
  Arial, 
  "Noto Sans", 
  sans-serif;
```

#### Type Scale
- **Heading 1**: 2.25rem (36px) - Page titles
- **Heading 2**: 1.875rem (30px) - Section headers
- **Heading 3**: 1.5rem (24px) - Subsection headers
- **Heading 4**: 1.25rem (20px) - Component titles
- **Body Large**: 1.125rem (18px) - Important content
- **Body**: 1rem (16px) - Standard text
- **Body Small**: 0.875rem (14px) - Secondary text
- **Caption**: 0.75rem (12px) - Labels and metadata

#### Font Weights
- **Light**: 300 - Subtle text elements
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Component labels
- **Bold**: 700 - Headings and strong emphasis

### Spacing System

#### Spacing Scale (Tailwind)
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px
```

#### Usage Guidelines
- **4px (1)**: Icon spacing, border radius
- **8px (2)**: Tight spacing, compact layouts
- **16px (4)**: Standard spacing between elements
- **24px (6)**: Section spacing
- **32px (8)**: Large component spacing
- **64px (16)**: Page section separation

### Border Radius System
- **Small**: 0.125rem (2px) - Badges, small elements
- **Default**: 0.375rem (6px) - Buttons, inputs
- **Medium**: 0.5rem (8px) - Cards, containers
- **Large**: 0.75rem (12px) - Modal dialogs
- **Full**: 9999px - Circular elements

## Component Library

### Base Components (`src/components/ui/`)

#### Button Component (`button.tsx`)

##### Variants
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    }
  }
)
```

##### Usage Examples
```tsx
// Primary action button
<Button variant="default">Save Changes</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete Note</Button>

// Icon-only button
<Button variant="ghost" size="icon">
  <PlusIcon className="h-4 w-4" />
</Button>
```

#### Card Component (`card.tsx`)

##### Structure
```tsx
<Card>
  <CardHeader>
    <CardTitle>Component Title</CardTitle>
    <CardDescription>Component description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions or metadata */}
  </CardFooter>
</Card>
```

##### Styling Features
- **Elevation**: Subtle shadow for depth
- **Responsive**: Adapts to container width
- **Accessibility**: Proper ARIA labels and roles
- **Interactive States**: Hover and focus states

#### Input Components

##### Text Input (`input.tsx`)
```tsx
<Input
  type="text"
  placeholder="Enter your note title..."
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="w-full"
/>
```

##### Textarea (`textarea.tsx`)
```tsx
<Textarea
  placeholder="Write your thoughts here..."
  value={content}
  onChange={(e) => setContent(e.target.value)}
  rows={5}
/>
```

##### Select Component (`select.tsx`)
```tsx
<Select onValueChange={setCategory}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="study">Study Notes</SelectItem>
    <SelectItem value="research">Research</SelectItem>
    <SelectItem value="personal">Personal</SelectItem>
  </SelectContent>
</Select>
```

#### Dialog Components (`dialog.tsx`)

##### Modal Structure
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description for accessibility
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Feature-Specific Components

#### Flashcard Component (`flashcard.tsx`)

##### Interactive Flashcard
```tsx
<div className="flashcard-container">
  <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
    <div className="flashcard-front">
      <div className="question">
        {flashcard.question}
      </div>
    </div>
    <div className="flashcard-back">
      <div className="answer">
        {flashcard.answer}
      </div>
    </div>
  </div>
</div>
```

##### CSS Animation
```css
.flashcard {
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
}

.flashcard.flipped {
  transform: rotateY(180deg);
}

.flashcard-front,
.flashcard-back {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
}

.flashcard-back {
  transform: rotateY(180deg);
}
```

#### Notes Grid Component (`notes-grid.tsx`)

##### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {notes.map((note) => (
    <Card key={note.id} className="note-card">
      <CardHeader>
        <CardTitle className="line-clamp-1">{note.title}</CardTitle>
        <div className="flex flex-wrap gap-1">
          {note.categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-sm max-w-none line-clamp-3"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <time className="text-sm text-muted-foreground">
          {formatDate(note.modifiedAt)}
        </time>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <DeleteIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  ))}
</div>
```

#### Progress Components

##### Progress Bar (`progress.tsx`)
```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>{progress}%</span>
  </div>
  <Progress value={progress} className="w-full" />
</div>
```

##### Circular Progress
```tsx
<div className="relative inline-flex items-center justify-center">
  <svg className="w-16 h-16 transform -rotate-90">
    <circle
      cx="32"
      cy="32"
      r="28"
      stroke="currentColor"
      strokeWidth="4"
      fill="transparent"
      className="text-gray-200"
    />
    <circle
      cx="32"
      cy="32"
      r="28"
      stroke="currentColor"
      strokeWidth="4"
      fill="transparent"
      strokeDasharray={circumference}
      strokeDashoffset={offset}
      className="text-primary transition-all duration-300"
    />
  </svg>
  <span className="absolute text-sm font-medium">
    {percentage}%
  </span>
</div>
```

## Layout Components

### Navigation Component (`navbar.tsx`)

#### Authenticated Navigation
```tsx
<nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container mx-auto px-4">
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <BookIcon className="h-6 w-6" />
          <span className="font-bold">Study Sphere</span>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <NavLink href="/dashboard/notes">Notes</NavLink>
          <NavLink href="/dashboard/flashcards">Flashcards</NavLink>
          <NavLink href="/dashboard/quizzes">Quizzes</NavLink>
          <NavLink href="/dashboard/chat">Study Buddy</NavLink>
          <NavLink href="/dashboard/todos">Tasks</NavLink>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <UserMenu />
      </div>
    </div>
  </div>
</nav>
```

#### Mobile Navigation
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <MenuIcon className="h-6 w-6" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <nav className="grid gap-6 text-lg font-medium">
      <Link href="/dashboard/notes" className="flex items-center gap-2">
        <NotebookIcon className="h-5 w-5" />
        Notes
      </Link>
      <Link href="/dashboard/flashcards" className="flex items-center gap-2">
        <CardsIcon className="h-5 w-5" />
        Flashcards
      </Link>
      {/* Additional nav items */}
    </nav>
  </SheetContent>
</Sheet>
```

### Theme System

#### Theme Provider (`theme-provider.tsx`)
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

#### Theme Toggle (`theme-toggle.tsx`)
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => setTheme("light")}>
      Light
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("dark")}>
      Dark
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("system")}>
      System
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Animation and Interactions

### Framer Motion Integration

#### Page Transitions
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  {/* Page content */}
</motion.div>
```

#### Component Animations
```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", duration: 0.3 }}
    >
      {/* Animated content */}
    </motion.div>
  )}
</AnimatePresence>
```

#### Stagger Children
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      {/* Item content */}
    </motion.div>
  ))}
</motion.div>
```

## Responsive Design

### Breakpoint System
```typescript
// Tailwind CSS Breakpoints
const breakpoints = {
  sm: '640px',   // Small screens (phones)
  md: '768px',   // Medium screens (tablets)
  lg: '1024px',  // Large screens (laptops)
  xl: '1280px',  // Extra large screens (desktops)
  '2xl': '1536px' // 2x extra large screens
}
```

### Responsive Patterns

#### Grid Layouts
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Responsive grid items */}
</div>
```

#### Typography Scaling
```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>
```

#### Spacing Adjustments
```tsx
<div className="p-4 sm:p-6 lg:p-8">
  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
    {/* Responsive spacing */}
  </div>
</div>
```

## Accessibility Features

### ARIA Implementation
```tsx
<button
  aria-label="Delete note"
  aria-describedby="delete-description"
  onClick={handleDelete}
>
  <DeleteIcon className="h-4 w-4" />
</button>
<div id="delete-description" className="sr-only">
  This action cannot be undone
</div>
```

### Keyboard Navigation
```tsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Interactive Element
</div>
```

### Screen Reader Support
```tsx
<div className="sr-only">
  Page loaded successfully. You are now on the dashboard.
</div>

<main aria-label="Main content">
  {/* Page content */}
</main>
```

### Focus Management
```tsx
useEffect(() => {
  if (isOpen) {
    // Focus the first interactive element
    const firstInput = modalRef.current?.querySelector('input, button, select, textarea');
    firstInput?.focus();
  }
}, [isOpen]);
```

## Icon System

### Lucide React Icons
```tsx
import {
  BookIcon,
  NotebookIcon,
  BrainIcon,
  MessageSquareIcon,
  CheckSquareIcon,
  SettingsIcon,
  UserIcon,
  PlusIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  DownloadIcon,
  ShareIcon,
  HeartIcon,
  StarIcon
} from 'lucide-react';
```

### Icon Usage Guidelines
- **Size Consistency**: Use standardized sizes (16px, 20px, 24px)
- **Semantic Meaning**: Icons should reinforce text meaning
- **Accessibility**: Always provide alternative text or ARIA labels
- **Color Inheritance**: Icons inherit text color by default

## Error States and Loading

### Error Boundaries
```tsx
<ErrorBoundary
  fallback={
    <div className="text-center p-8">
      <AlertTriangleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-4">
        We're sorry, but something unexpected happened.
      </p>
      <Button onClick={resetError}>Try Again</Button>
    </div>
  }
>
  {children}
</ErrorBoundary>
```

### Loading States
```tsx
{isLoading ? (
  <div className="flex items-center justify-center p-8">
    <LoaderIcon className="h-6 w-6 animate-spin mr-2" />
    <span>Loading...</span>
  </div>
) : (
  <div>{content}</div>
)}
```

### Empty States
```tsx
<div className="text-center p-8">
  <InboxIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
  <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
  <p className="text-muted-foreground mb-4">
    Create your first note to get started with organizing your thoughts.
  </p>
  <Button onClick={handleCreateNote}>
    <PlusIcon className="h-4 w-4 mr-2" />
    Create Note
  </Button>
</div>
```

This comprehensive UI documentation ensures consistent, accessible, and maintainable user interface components throughout the Study Sphere application.

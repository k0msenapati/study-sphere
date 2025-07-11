"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlowchartTemplate } from "@/lib/flowcharts/types"
import { 
  GitBranch, 
  Users, 
  Database, 
  Code, 
  Brain, 
  Clock,
  Workflow,
  Building,
  GraduationCap,
  Rocket
} from "lucide-react"

const templates: FlowchartTemplate[] = [
  // Business & Management
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Standard project lifecycle workflow',
    concept: 'Project management lifecycle from initiation to closure',
    chartType: 'flowchart',
    complexity: 'detailed',
    category: 'Business',
    mermaidCode: `flowchart TD
    A[Project Initiation] --> B[Planning Phase]
    B --> C[Execution Phase]
    C --> D[Monitoring & Control]
    D --> E{Issues Found?}
    E -->|Yes| F[Corrective Action]
    F --> C
    E -->|No| G[Project Closure]
    D --> H[Status Reporting]
    H --> D`
  },
  {
    id: 'user-authentication',
    name: 'User Authentication',
    description: 'Login and authentication flow',
    concept: 'User authentication and authorization process',
    chartType: 'sequence',
    complexity: 'detailed',
    category: 'Technology',
    mermaidCode: `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    U->>F: Enter credentials
    F->>B: Login request
    B->>D: Validate user
    D->>B: User data
    B->>B: Generate JWT
    B->>F: Return token
    F->>U: Login success`
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning Pipeline',
    description: 'End-to-end ML workflow',
    concept: 'Machine learning model development and deployment pipeline',
    chartType: 'flowchart',
    complexity: 'comprehensive',
    category: 'Technology',
    mermaidCode: `flowchart TD
    A[Data Collection] --> B[Data Preprocessing]
    B --> C[Feature Engineering]
    C --> D[Model Selection]
    D --> E[Training]
    E --> F{Model Performance OK?}
    F -->|No| G[Hyperparameter Tuning]
    G --> E
    F -->|Yes| H[Model Validation]
    H --> I[Deployment]
    I --> J[Monitoring]
    J --> K{Performance Degraded?}
    K -->|Yes| L[Retrain Model]
    L --> E
    K -->|No| J`
  },
  {
    id: 'customer-journey',
    name: 'Customer Journey',
    description: 'Customer experience mapping',
    concept: 'Customer journey from awareness to advocacy',
    chartType: 'flowchart',
    complexity: 'detailed',
    category: 'Business',
    mermaidCode: `flowchart LR
    A[Awareness] --> B[Interest]
    B --> C[Consideration]
    C --> D[Purchase]
    D --> E[Onboarding]
    E --> F[Usage]
    F --> G[Support]
    G --> H[Renewal/Upsell]
    H --> I[Advocacy]
    I --> A`
  },
  // Educational
  {
    id: 'learning-process',
    name: 'Learning Process',
    description: 'Educational learning cycle',
    concept: 'Student learning and assessment process',
    chartType: 'flowchart',
    complexity: 'detailed',
    category: 'Education',
    mermaidCode: `flowchart TD
    A[Learning Objective] --> B[Pre-assessment]
    B --> C[Content Delivery]
    C --> D[Practice Activities]
    D --> E[Formative Assessment]
    E --> F{Understanding Achieved?}
    F -->|No| G[Remediation]
    G --> C
    F -->|Yes| H[Summative Assessment]
    H --> I[Performance Analysis]
    I --> J[Next Learning Objective]`
  },
  {
    id: 'research-method',
    name: 'Research Methodology',
    description: 'Scientific research process',
    concept: 'Academic research methodology from hypothesis to publication',
    chartType: 'flowchart',
    complexity: 'comprehensive',
    category: 'Education',
    mermaidCode: `flowchart TD
    A[Research Question] --> B[Literature Review]
    B --> C[Hypothesis Formation]
    C --> D[Research Design]
    D --> E[Data Collection]
    E --> F[Data Analysis]
    F --> G{Results Support Hypothesis?}
    G -->|Yes| H[Draw Conclusions]
    G -->|No| I[Revise Hypothesis]
    I --> D
    H --> J[Write Report]
    J --> K[Peer Review]
    K --> L{Accepted?}
    L -->|No| M[Revisions]
    M --> J
    L -->|Yes| N[Publication]`
  },
  // Technical
  {
    id: 'software-development',
    name: 'Software Development',
    description: 'SDLC process flow',
    concept: 'Software development lifecycle from requirements to deployment',
    chartType: 'flowchart',
    complexity: 'detailed',
    category: 'Technology',
    mermaidCode: `flowchart TD
    A[Requirements] --> B[Analysis & Design]
    B --> C[Implementation]
    C --> D[Testing]
    D --> E{Bugs Found?}
    E -->|Yes| F[Bug Fixing]
    F --> D
    E -->|No| G[Code Review]
    G --> H{Review Passed?}
    H -->|No| I[Code Refactoring]
    I --> G
    H -->|Yes| J[Deployment]
    J --> K[Maintenance]`
  },
  {
    id: 'database-design',
    name: 'Database Design',
    description: 'Database design methodology',
    concept: 'Database design process from requirements to implementation',
    chartType: 'flowchart',
    complexity: 'detailed',
    category: 'Technology',
    mermaidCode: `flowchart TD
    A[Requirements Analysis] --> B[Conceptual Design]
    B --> C[ER Modeling]
    C --> D[Logical Design]
    D --> E[Normalization]
    E --> F[Physical Design]
    F --> G[Implementation]
    G --> H[Testing]
    H --> I{Performance OK?}
    I -->|No| J[Optimization]
    J --> F
    I -->|Yes| K[Deployment]`
  },
  // Mind Maps
  {
    id: 'startup-mindmap',
    name: 'Startup Planning',
    description: 'Startup business planning mindmap',
    concept: 'Startup business planning and strategy development',
    chartType: 'mindmap',
    complexity: 'comprehensive',
    category: 'Business',
    mermaidCode: `mindmap
  root((Startup Planning))
    Market Research
      Target Audience
      Competitor Analysis
      Market Size
    Business Model
      Revenue Streams
      Cost Structure
      Value Proposition
    Product Development
      MVP Design
      Technology Stack
      User Experience
    Funding
      Bootstrapping
      Angel Investors
      Venture Capital
    Team Building
      Co-founders
      Key Hires
      Advisors
    Legal & Compliance
      Business Structure
      Intellectual Property
      Regulations`
  },
  {
    id: 'study-strategy',
    name: 'Study Strategy',
    description: 'Effective study techniques mindmap',
    concept: 'Comprehensive study strategy and learning techniques',
    chartType: 'mindmap',
    complexity: 'detailed',
    category: 'Education',
    mermaidCode: `mindmap
  root((Study Strategy))
    Planning
      Goal Setting
      Time Management
      Study Schedule
    Active Learning
      Note Taking
      Summarizing
      Teaching Others
    Memory Techniques
      Spaced Repetition
      Mnemonics
      Visual Aids
    Practice
      Problem Solving
      Mock Tests
      Flashcards
    Environment
      Study Space
      Distractions
      Resources`
  }
]

const categories = [
  { id: 'all', name: 'All Templates', icon: GitBranch },
  { id: 'Business', name: 'Business', icon: Building },
  { id: 'Technology', name: 'Technology', icon: Code },
  { id: 'Education', name: 'Education', icon: GraduationCap },
]

interface FlowchartTemplatesProps {
  onSelectTemplate: (template: FlowchartTemplate) => void
}

export function FlowchartTemplates({ onSelectTemplate }: FlowchartTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState<FlowchartTemplate | null>(null)

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Flowchart Templates
          </CardTitle>
          <CardDescription>
            Start with pre-built templates for common use cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="outline">{template.chartType}</Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {template.complexity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectTemplate(template)
                            }}
                          >
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedTemplate.name} Preview</span>
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
              >
                Close Preview
              </Button>
            </CardTitle>
            <CardDescription>
              {selectedTemplate.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => onSelectTemplate(selectedTemplate)}
                className="flex-1"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Use This Template
              </Button>
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(selectedTemplate.mermaidCode)}
              >
                Copy Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

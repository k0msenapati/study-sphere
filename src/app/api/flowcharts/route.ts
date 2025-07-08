import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { concept, chartType, complexity } = await req.json()

    if (!concept) {
      return NextResponse.json(
        { error: 'Concept is required' },
        { status: 400 }
      )
    }

    // Enhanced Mermaid code generation using more sophisticated templates
    const mermaidCode = generateAdvancedMermaidCode(concept, chartType, complexity)

    return NextResponse.json({
      mermaidCode,
      success: true
    })
  } catch (error) {
    console.error('Error generating flowchart:', error)
    return NextResponse.json(
      { error: 'Failed to generate flowchart' },
      { status: 500 }
    )
  }
}

function generateAdvancedMermaidCode(
  concept: string,
  chartType: string = 'flowchart',
  complexity: string = 'detailed'
): string {
  const sanitizedConcept = concept.replace(/[^a-zA-Z0-9\s]/g, '').trim()
  const conceptWords = sanitizedConcept.split(' ')
  const shortConcept = conceptWords.slice(0, 3).join(' ')

  const templates: Record<string, Record<string, (concept: string) => string>> = {
    flowchart: {
      simple: (concept) => `flowchart TD
    A[Start: ${concept}] --> B[Process]
    B --> C[End]`,
      
      detailed: (concept) => `flowchart TD
    A[Initialize: ${concept}] --> B{Input Valid?}
    B -->|Yes| C[Process Request]
    B -->|No| D[Show Error]
    C --> E[Generate Output]
    E --> F{Quality Check}
    F -->|Pass| G[Success]
    F -->|Fail| H[Retry]
    H --> C
    D --> I[End]
    G --> I`,
      
      comprehensive: (concept) => `flowchart TD
    A[Start: ${concept}] --> B[Initialize System]
    B --> C{Authentication Required?}
    C -->|Yes| D[Authenticate User]
    C -->|No| E[Process Input]
    D --> F{Auth Success?}
    F -->|No| G[Access Denied]
    F -->|Yes| E
    E --> H[Validate Input]
    H --> I{Input Valid?}
    I -->|No| J[Error Handling]
    I -->|Yes| K[Core Processing]
    K --> L[Business Logic]
    L --> M{Processing Success?}
    M -->|No| N[Error Recovery]
    M -->|Yes| O[Generate Response]
    O --> P[Format Output]
    P --> Q[Logging & Audit]
    Q --> R[Return Result]
    J --> S[User Feedback]
    N --> S
    G --> S
    S --> T[End]
    R --> T`
    },

    sequence: {
      simple: (concept) => `sequenceDiagram
    participant User
    participant System
    User->>System: Request ${concept}
    System->>User: Response`,
      
      detailed: (concept) => `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    
    U->>F: Initiate ${concept}
    F->>B: Process Request
    B->>D: Query Data
    D->>B: Return Results
    B->>F: Processed Data
    F->>U: Display Results`,
      
      comprehensive: (concept) => `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant S as Service
    participant D as Database
    participant C as Cache
    participant Q as Queue
    
    U->>F: Request ${concept}
    F->>A: API Call
    A->>A: Validate Request
    A->>S: Forward Request
    S->>C: Check Cache
    alt Cache Hit
        C->>S: Return Cached Data
    else Cache Miss
        S->>D: Query Database
        D->>S: Return Data
        S->>C: Update Cache
    end
    S->>Q: Log Event
    S->>A: Return Response
    A->>F: API Response
    F->>U: Display Result`
    },

    mindmap: {
      simple: (concept) => `mindmap
  root((${shortConcept}))
    Aspect 1
    Aspect 2
    Aspect 3`,
      
      detailed: (concept) => `mindmap
  root((${shortConcept}))
    Planning
      Requirements
      Analysis
      Design
    Implementation
      Development
      Testing
      Deployment
    Maintenance
      Monitoring
      Updates
      Support`,
      
      comprehensive: (concept) => `mindmap
  root((${shortConcept}))
    Strategy
      Vision
      Goals
      Objectives
      KPIs
    Planning
      Requirements Analysis
      Resource Allocation
      Timeline Development
      Risk Assessment
    Execution
      Development Phase
      Quality Assurance
      User Testing
      Deployment
    Operations
      Monitoring
      Performance Optimization
      User Support
      Maintenance
    Innovation
      Feedback Collection
      Improvement Ideas
      Future Enhancements
      Technology Updates`
    },

    class: {
      simple: (concept) => {
        const className = conceptWords[0]?.replace(/[^a-zA-Z]/g, '') || 'Entity'
        return `classDiagram
    class ${className} {
        +property1: string
        +property2: number
        +method1()
        +method2()
    }`
      },
      
      detailed: (concept) => {
        const className = conceptWords[0]?.replace(/[^a-zA-Z]/g, '') || 'Entity'
        const relatedClass = conceptWords[1]?.replace(/[^a-zA-Z]/g, '') || 'RelatedEntity'
        return `classDiagram
    class ${className} {
        -id: string
        -name: string
        -status: string
        +getId(): string
        +getName(): string
        +setStatus(status: string)
        +process()
    }
    
    class ${relatedClass} {
        -id: string
        -value: number
        +getValue(): number
        +update(value: number)
    }
    
    ${className} --> ${relatedClass} : uses`
      },
      
      comprehensive: (concept) => {
        const baseClass = conceptWords[0]?.replace(/[^a-zA-Z]/g, '') || 'BaseEntity'
        const childClass = conceptWords[1]?.replace(/[^a-zA-Z]/g, '') || 'ChildEntity'
        const serviceClass = conceptWords[2]?.replace(/[^a-zA-Z]/g, '') || 'Service'
        return `classDiagram
    class ${baseClass} {
        <<abstract>>
        -id: string
        -createdAt: Date
        -updatedAt: Date
        +getId(): string
        +getCreatedAt(): Date
        +update()
        +delete()
    }
    
    class ${childClass} {
        -name: string
        -status: string
        -properties: Map
        +getName(): string
        +setStatus(status: string)
        +addProperty(key: string, value: any)
        +process()
        +validate(): boolean
    }
    
    class ${serviceClass} {
        -repository: Repository
        -logger: Logger
        +create(entity: ${childClass}): ${childClass}
        +findById(id: string): ${childClass}
        +update(entity: ${childClass}): ${childClass}
        +delete(id: string): boolean
        +findAll(): ${childClass}[]
    }
    
    interface Repository {
        <<interface>>
        +save(entity: Entity): Entity
        +findById(id: string): Entity
        +delete(id: string): boolean
    }
    
    ${baseClass} <|-- ${childClass}
    ${serviceClass} --> ${childClass} : manages
    ${serviceClass} --> Repository : uses`
      }
    },

    state: {
      simple: (concept) => `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start ${concept}
    Processing --> Complete
    Complete --> [*]`,
      
      detailed: (concept) => `stateDiagram-v2
    [*] --> Initialized
    Initialized --> Ready: Setup Complete
    Ready --> Processing: Begin ${concept}
    Processing --> Validating: Process Complete
    Validating --> Success: Valid
    Validating --> Error: Invalid
    Error --> Processing: Retry
    Success --> [*]
    Error --> [*]: Give Up`,
      
      comprehensive: (concept) => `stateDiagram-v2
    [*] --> Initialization
    Initialization --> Configuration: System Start
    Configuration --> Authentication: Config Complete
    Authentication --> Ready: Auth Success
    Authentication --> Error: Auth Failed
    
    Ready --> Processing: Start ${concept}
    Processing --> Validation: Initial Processing
    Validation --> BusinessLogic: Valid Input
    Validation --> InputError: Invalid Input
    
    BusinessLogic --> DataAccess: Logic Complete
    DataAccess --> ResponseGeneration: Data Retrieved
    DataAccess --> DataError: Data Error
    
    ResponseGeneration --> Success: Response Ready
    Success --> Cleanup: Process Complete
    Cleanup --> Ready: Cleanup Done
    
    InputError --> ErrorHandling
    DataError --> ErrorHandling
    ErrorHandling --> Retry: Recoverable
    ErrorHandling --> Failure: Non-recoverable
    
    Retry --> Processing: Retry Attempt
    Failure --> [*]
    Error --> [*]`
    }
  }

  const generator = templates[chartType]?.[complexity] || templates.flowchart.detailed
  return generator(sanitizedConcept)
}

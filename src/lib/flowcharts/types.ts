export interface Flowchart {
  id: string
  title: string
  description: string
  mermaidCode: string
  chartType: 'flowchart' | 'sequence' | 'class' | 'state' | 'entity-relationship' | 'mindmap' | 'timeline'
  createdAt: Date
  updatedAt: Date
}

export interface FlowchartTemplate {
  id: string
  name: string
  description: string
  concept: string
  chartType: Flowchart['chartType']
  complexity: 'simple' | 'detailed' | 'comprehensive'
  mermaidCode: string
  category: string
}

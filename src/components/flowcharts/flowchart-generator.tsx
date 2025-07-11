"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Wand2 } from "lucide-react"

interface FlowchartGeneratorProps {
  onGenerate: (concept: string, chartType: string, complexity: string) => void
  isGenerating: boolean
}

export function FlowchartGenerator({ onGenerate, isGenerating }: FlowchartGeneratorProps) {
  const [concept, setConcept] = useState("")
  const [chartType, setChartType] = useState("flowchart")
  const [complexity, setComplexity] = useState("detailed")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (concept.trim()) {
      onGenerate(concept, chartType, complexity)
    }
  }

  const exampleConcepts = [
    "User registration process",
    "Online shopping workflow",
    "Software bug fixing procedure",
    "Project approval process",
    "Data backup strategy",
    "Customer support ticket flow"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Flowchart Generator
        </CardTitle>
        <CardDescription>
          Describe your process or concept, and AI will create a visual flowchart
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="concept">Concept or Process Description</Label>
            <Textarea
              id="concept"
              placeholder="Describe the process, workflow, or concept you want to visualize..."
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <div className="text-sm text-muted-foreground">
              <p className="mb-1">Examples:</p>
              <div className="flex flex-wrap gap-1">
                {exampleConcepts.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setConcept(example)}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-xs"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chartType">Chart Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flowchart">Flowchart</SelectItem>
                  <SelectItem value="sequence">Sequence Diagram</SelectItem>
                  <SelectItem value="class">Class Diagram</SelectItem>
                  <SelectItem value="state">State Diagram</SelectItem>
                  <SelectItem value="entity-relationship">ER Diagram</SelectItem>
                  <SelectItem value="mindmap">Mind Map</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity Level</Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={!concept.trim() || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Flowchart...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Flowchart
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

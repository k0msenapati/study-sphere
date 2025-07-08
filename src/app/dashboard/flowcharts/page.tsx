"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { CopilotTextarea } from "@copilotkit/react-textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  GitBranch,
  Download,
  Copy,
  RefreshCw,
  Sparkles,
  FileText,
  Zap,
  Eye,
  Code,
  Save,
  Share,
  Settings,
} from "lucide-react"
import { FlowchartProvider, useFlowcharts } from "@/lib/flowcharts/flowcharts-provider"
import { FlowchartGenerator } from "@/components/flowcharts/flowchart-generator"
import { FlowchartViewer } from "@/components/flowcharts/flowchart-viewer"
import { FlowchartTemplates } from "@/components/flowcharts/flowchart-templates"

interface Flowchart {
  id: string
  title: string
  description: string
  mermaidCode: string
  chartType:
    | "flowchart"
    | "sequence"
    | "class"
    | "state"
    | "entity-relationship"
    | "mindmap"
    | "timeline"
  createdAt: Date
  updatedAt: Date
}

function FlowchartsComponent() {
  const { flowcharts, createFlowchart, updateFlowchart, deleteFlowchart } = useFlowcharts()
  const [activeTab, setActiveTab] = useState("generate")
  const [currentFlowchart, setCurrentFlowchart] = useState<Flowchart | null>(null)
  const [concept, setConcept] = useState("")
  const [chartType, setChartType] = useState<Flowchart["chartType"]>("flowchart")
  const [complexity, setComplexity] = useState<"simple" | "detailed" | "comprehensive">("detailed")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // Make flowcharts data readable to Copilot
  useCopilotReadable({
    description: "List of user's flowcharts and current generation state",
    value: JSON.stringify({
      flowcharts,
      currentConcept: concept,
      chartType,
      complexity,
      generatedCode,
      isGenerating,
    }),
  })

  // Copilot action for generating flowcharts
  useCopilotAction({
    name: "generateFlowchart",
    description:
      "Generate a Mermaid flowchart from a concept description. This will analyze the provided concept and create a visual flowchart using Mermaid syntax.",
    parameters: [
      {
        name: "concept",
        type: "string",
        description: "The concept, process, or idea to visualize in the flowchart",
        required: true,
      },
      {
        name: "chartType",
        type: "string",
        description:
          "Type of chart: flowchart, sequence, class, state, entity-relationship, mindmap, or timeline",
        required: false,
      },
      {
        name: "complexity",
        type: "string",
        description: "Level of detail: simple, detailed, or comprehensive",
        required: false,
      },
      {
        name: "title",
        type: "string",
        description: "Title for the flowchart",
        required: false,
      },
    ],
    handler: async (args: {
      concept: string
      chartType?: string
      complexity?: string
      title?: string
    }) => {
      try {
        setIsGenerating(true)
        setConcept(args.concept)

        const selectedChartType = (args.chartType as Flowchart["chartType"]) || chartType
        const selectedComplexity =
          (args.complexity as "simple" | "detailed" | "comprehensive") || complexity

        if (args.chartType) {
          setChartType(selectedChartType)
        }
        if (args.complexity) {
          setComplexity(selectedComplexity)
        }
        if (args.title) {
          setTitle(args.title)
        }

        // Use the API to generate flowchart with CopilotKit integration
        const response = await fetch("/api/generate-flowchart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            concept: args.concept,
            chartType: selectedChartType,
            complexity: selectedComplexity,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(
            `Failed to generate flowchart: ${response.status} ${response.statusText} - ${errorText}`
          )
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || "Failed to generate flowchart")
        }

        // Validate that we received valid Mermaid code
        if (!result.mermaidCode || typeof result.mermaidCode !== "string") {
          throw new Error("Invalid response: No Mermaid code received")
        }

        setGeneratedCode(result.mermaidCode)
        setActiveTab("preview")

        return `Successfully generated a ${selectedChartType} flowchart for "${args.concept}". The flowchart shows ${selectedComplexity} level detail. You can now preview, edit, or save the flowchart.`
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to generate flowchart"
        return `Error: ${errorMessage}. Please try again with a clearer concept description.`
      } finally {
        setIsGenerating(false)
      }
    },
  })

  // Copilot action for saving flowcharts
  useCopilotAction({
    name: "saveFlowchart",
    description: "Save the current generated flowchart to the user's collection",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Title for the flowchart",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Description of what the flowchart represents",
        required: false,
      },
    ],
    handler: async (args: { title: string; description?: string }) => {
      try {
        if (!generatedCode) {
          return "No flowchart to save. Please generate a flowchart first."
        }

        const newFlowchart: Flowchart = {
          id: `flowchart_${Date.now()}`,
          title: args.title,
          description: args.description || "",
          mermaidCode: generatedCode,
          chartType,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        await createFlowchart(newFlowchart)
        setTitle("")
        setDescription("")
        setActiveTab("library")

        return `Flowchart "${args.title}" has been saved successfully to your library!`
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to save flowchart"
        return `Error: ${errorMessage}. Please try again.`
      }
    },
  })

  const handleSave = async () => {
    if (!generatedCode || !title) return

    const newFlowchart: Flowchart = {
      id: `flowchart_${Date.now()}`,
      title,
      description,
      mermaidCode: generatedCode,
      chartType,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await createFlowchart(newFlowchart)
    setTitle("")
    setDescription("")
    setActiveTab("library")
  }

  const handleGenerate = async () => {
    if (!concept) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-flowchart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concept,
          chartType,
          complexity,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to generate flowchart: ${response.status} ${response.statusText} - ${errorText}`
        )
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to generate flowchart")
      }

      // Validate that we received valid Mermaid code
      if (!result.mermaidCode || typeof result.mermaidCode !== "string") {
        throw new Error("Invalid response: No Mermaid code received")
      }

      setGeneratedCode(result.mermaidCode)
      setActiveTab("preview")
    } catch (error) {
      console.error("Failed to generate flowchart:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Flowchart Generator</h1>
          <p className="text-muted-foreground">
            Create visual flowcharts and diagrams from concepts using AI
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI Powered
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <GitBranch className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Generate New Flowchart
              </CardTitle>
              <CardDescription>
                Describe your concept and let AI create a visual flowchart for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="concept">Concept or Process</Label>
                <CopilotTextarea
                  id="concept"
                  placeholder="Describe the concept, process, or workflow you want to visualize... (e.g., 'User authentication process', 'Machine learning pipeline', 'Project management workflow')"
                  value={concept}
                  onChange={e => setConcept(e.target.value)}
                  className="min-h-[100px]"
                  autosuggestionsConfig={{
                    textareaPurpose:
                      "Describe a concept or process to be visualized as a flowchart",
                    chatApiConfigs: {
                      suggestionsApiConfig: {
                        maxTokens: 20,
                        stop: ["\n", "."],
                      },
                    },
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chartType">Chart Type</Label>
                  <Select
                    value={chartType}
                    onValueChange={value => setChartType(value as Flowchart["chartType"])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart type" />
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
                  <Select
                    value={complexity}
                    onValueChange={value =>
                      setComplexity(value as "simple" | "detailed" | "comprehensive")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity" />
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
                onClick={handleGenerate}
                disabled={!concept || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Flowchart...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Flowchart
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {generatedCode ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Flowchart Preview
                  </CardTitle>
                  <CardDescription>Preview and customize your generated flowchart</CardDescription>
                </CardHeader>
                <CardContent>
                  <FlowchartViewer mermaidCode={generatedCode} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Mermaid Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={generatedCode}
                    onChange={e => setGeneratedCode(e.target.value)}
                    className="font-mono text-sm min-h-[200px]"
                    placeholder="Mermaid code will appear here..."
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(generatedCode)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([generatedCode], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `${title || concept || "flowchart"}.mmd`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    Save Flowchart
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Enter a title for your flowchart..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Add a description..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={!title || !generatedCode}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save to Library
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Flowchart Generated</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Generate a flowchart first to see the preview
                </p>
                <Button onClick={() => setActiveTab("generate")}>Go to Generator</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Flowchart Library
              </CardTitle>
              <CardDescription>View and manage your saved flowcharts</CardDescription>
            </CardHeader>
            <CardContent>
              {flowcharts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flowcharts.map(flowchart => (
                    <Card
                      key={flowchart.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{flowchart.title}</CardTitle>
                          <Badge variant="outline">{flowchart.chartType}</Badge>
                        </div>
                        {flowchart.description && (
                          <CardDescription className="text-sm">
                            {flowchart.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            Created: {flowchart.createdAt.toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setGeneratedCode(flowchart.mermaidCode)
                                setActiveTab("preview")
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(flowchart.mermaidCode)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Saved Flowcharts</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first flowchart to get started
                  </p>
                  <Button onClick={() => setActiveTab("generate")}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Flowchart
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <FlowchartTemplates
            onSelectTemplate={template => {
              setConcept(template.concept)
              setChartType(template.chartType)
              setComplexity(template.complexity)
              setActiveTab("generate")
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function FlowchartsPage() {
  return (
    <FlowchartProvider>
      <FlowchartsComponent />
    </FlowchartProvider>
  )
}

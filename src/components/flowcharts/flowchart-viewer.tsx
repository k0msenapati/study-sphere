"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface FlowchartViewerProps {
	mermaidCode: string;
	className?: string;
}

export function FlowchartViewer({
	mermaidCode,
	className = "",
}: FlowchartViewerProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current || !mermaidCode) return;

		// Initialize Mermaid with better error handling
		mermaid.initialize({
			startOnLoad: false,
			theme: "default",
			securityLevel: "loose",
			flowchart: {
				htmlLabels: true,
				curve: "linear",
				useMaxWidth: true,
				wrappingWidth: 200,
			},
			sequence: {
				diagramMarginX: 50,
				diagramMarginY: 10,
				actorMargin: 50,
				width: 150,
				height: 65,
				boxMargin: 10,
				boxTextMargin: 5,
				noteMargin: 10,
				messageMargin: 35,
				mirrorActors: true,
				bottomMarginAdj: 1,
				useMaxWidth: true,
			},
			mindmap: {
				padding: 10,
				maxNodeWidth: 200,
				useMaxWidth: true,
			},
			themeVariables: {
				primaryColor: "#007acc",
				primaryTextColor: "#000000",
				primaryBorderColor: "#005b99",
				lineColor: "#333333",
			},
		});

		const renderChart = async () => {
			try {
				// Clear previous content
				if (containerRef.current) {
					containerRef.current.innerHTML = "";
				}

				// Validate and sanitize the Mermaid code
				const sanitizedCode = mermaidCode.trim();
				if (!sanitizedCode) {
					throw new Error("Empty Mermaid code");
				}

				// Generate unique ID for this chart
				const chartId = `mermaid-chart-${Date.now()}-${Math.random()
					.toString(36)
					.substr(2, 9)}`;

				// Parse and render the chart
				let parseResult;
				try {
					parseResult = await mermaid.parse(sanitizedCode);
				} catch (parseError) {
					throw new Error(
						`Mermaid parse error: ${
							parseError instanceof Error
								? parseError.message
								: "Invalid syntax"
						}`,
					);
				}

				if (!parseResult) {
					throw new Error("Invalid Mermaid syntax - parse returned false");
				}

				const { svg } = await mermaid.render(chartId, sanitizedCode);

				if (containerRef.current) {
					containerRef.current.innerHTML = svg;

					// Add some styling to the SVG
					const svgElement = containerRef.current.querySelector("svg");
					if (svgElement) {
						svgElement.style.maxWidth = "100%";
						svgElement.style.height = "auto";
					}
				}
			} catch (error) {
				console.error("Error rendering Mermaid chart:", error);
				if (containerRef.current) {
					const errorMessage =
						error instanceof Error ? error.message : "Unknown error";
					const isParseError = errorMessage.includes("Parse error");
					const isSyntaxError = errorMessage.includes("syntax");

					let userFriendlyMessage = "Please check your Mermaid syntax";
					if (isParseError) {
						userFriendlyMessage =
							"The flowchart code contains syntax errors. Please try regenerating or editing the code.";
					} else if (isSyntaxError) {
						userFriendlyMessage =
							"Invalid flowchart syntax. The generated code may contain unsupported characters.";
					}

					containerRef.current.innerHTML = `
            <div class="flex items-center justify-center p-8 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <div class="text-center">
                <div class="text-red-600 dark:text-red-400 font-medium mb-2">Error rendering chart</div>
                <div class="text-red-500 dark:text-red-300 text-sm mb-2">
                  ${userFriendlyMessage}
                </div>
                <div class="text-xs text-red-400 dark:text-red-500 font-mono">
                  ${errorMessage}
                </div>
              </div>
            </div>`;
				}
			}
		};

		renderChart();
	}, [mermaidCode]);

	return (
		<div
			ref={containerRef}
			className={`w-full min-h-[200px] flex items-center justify-center ${className}`}
		/>
	);
}

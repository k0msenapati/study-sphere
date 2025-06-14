// app/dashboard/roadmap/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { TextMessage, Role } from "@copilotkit/runtime-client-gql";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";

export default function RoadmapPage() {
  const [query, setQuery] = useState("");
  const [userLevel, setUserLevel] = useState("beginner");
  const [displayedReply, setDisplayedReply] = useState("");
  const [isDownloadEnabled, setIsDownloadEnabled] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const { visibleMessages, appendMessage, isLoading } = useCopilotChat();

  useEffect(() => {
    const last = visibleMessages.at(-1);
    if (last instanceof TextMessage && last.role === Role.Assistant) {
      simulateTyping(last.content);
      setIsDownloadEnabled(true);
    }
  }, [visibleMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayedReply("");
    setIsDownloadEnabled(false);
    const prompt = `Create a learning roadmap for "${query}" tailored for a "${userLevel}" learner.`;
    appendMessage(new TextMessage({ role: Role.User, content: prompt }));
    setQuery("");
  };

  const simulateTyping = (text: string) => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) {
        setDisplayedReply((p) => p + text[i]);
        i++;
        autoscroll();
      } else clearInterval(iv);
    }, 4);
  };

  const autoscroll = () => {
    if (responseRef.current) {
      window.scrollTo({
        top: responseRef.current.scrollHeight + responseRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    const formatted = displayedReply
      .replace(/#/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "•")
      .replace(/<br\s*\/?>/g, "\n");
    const lines = doc.splitTextToSize(formatted, 180);
    let y = 10;
    lines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 10;
    });
    doc.save("Roadmap.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Generate Your Personalized Roadmap
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Python in 100 days"
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <div className="flex justify-center gap-4">
          {["beginner", "intermediate", "advanced"].map((lvl) => (
            <label key={lvl} className="flex items-center gap-1">
              <input
                type="radio"
                value={lvl}
                checked={userLevel === lvl}
                onChange={(e) => setUserLevel(e.target.value)}
              />
              {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="w-52 bg-blue-600 text-white py-2 rounded-md block mx-auto"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Submit"}
        </button>
      </form>

      <div ref={responseRef} className="bg-gray-50 p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-2">Response:</h2>
        <ReactMarkdown>
          {displayedReply.replace(/<br\s*\/?>/g, "\n")}
        </ReactMarkdown>
      </div>

      <div className="text-center">
        <button
          onClick={downloadAsPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-md mx-auto"
          disabled={!isDownloadEnabled}
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}

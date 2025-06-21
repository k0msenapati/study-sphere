// app/dashboard/roadmaps/page.tsx
"use client";

import { useState } from "react";

export default function RoadmapPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      src: "/images/roadmap1.png",
      alt: "Roadmap 1",
    },
    {
      src: "/images/roadmap2.png",
      alt: "Roadmap 2",
    },
    // Add more images if needed
  ];

  const handleDownload = (src: string) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = src.split("/").pop() || "roadmap.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Choose Your Roadmap</h1>
      <div className="grid grid-cols-1 gap-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            className="cursor-pointer rounded shadow hover:scale-105 transition-transform"
            onClick={() => setSelectedImage(img.src)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative max-w-lg w-full">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setSelectedImage(null)}
            >
              ✖
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-auto rounded"
            />
            <button
              onClick={() => handleDownload(selectedImage)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

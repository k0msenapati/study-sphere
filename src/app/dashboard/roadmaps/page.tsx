// app/dashboard/roadmaps/page.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const RoadmapPage = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);

  const roadmaps = [
    {
      src: "/images/datascience.png",
      alt: "datascience Roadmap",
      componentPath: "datascience",
    },
    {
      src: "/images/devops.png",
      alt: "devops Roadmap",
      componentPath: "devops",
    },
    {
      src: "/images/machinelearning.png",
      alt: "machinelearning Roadmap",
      componentPath: "machinelearning",
    },
    {
      src: "/images/mern.png",
      alt: "MERN Roadmap",
      componentPath: "mern",
    },
    {
      src: "/images/nodejs.png",
      alt: "Node.js Roadmap",
      componentPath: "nodejs",
    },
    {
      src: "/images/python.png",
      alt: "python Roadmap",
      componentPath: "python",
    },
  ];

  const DynamicMDX = selectedRoadmap
    ? dynamic(() => import(`../roadmap/${selectedRoadmap}.mdx`))
    : null;

  const handleClose = () => setSelectedRoadmap(null);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {!selectedRoadmap ? (
        <>
          <h1 className="text-2xl font-bold text-center">
            Choose Your Roadmap
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {roadmaps.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={img.alt}
                className="cursor-pointer rounded shadow hover:scale-105 transition-transform"
                onClick={() => setSelectedRoadmap(img.componentPath)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link href="/dashboard/airoadmap">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 transition">
                Tailor your own roadmap
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div className="relative bg-white p-4 rounded shadow">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
          >
            ✖
          </button>
          {DynamicMDX && <DynamicMDX />}
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;

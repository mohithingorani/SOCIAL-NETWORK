"use client";
import axios from "axios";
import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import avsdf from "cytoscape-avsdf"

cytoscape.use(avsdf)

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface Node{
    data: { id: string; label: string }
}

interface Edge{
    data: { id: string; source: string; target: string }
}

export default function Graph() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
function createCyInstance(graphData:GraphData) {
  const cy = cytoscape({
    container: containerRef.current,
    elements: graphData,
    layout: {
      name: "avsdf",
      nodeSeparation: 80, // space between nodes
      animate: true,
      fit: true,
    } as any,
    style: [    
      {
        selector: "grid",
        style: {
          label: "data(label)",
          width: 40,
          height: 40,
          "background-color": "#2563eb",
          "border-opacity": 0.8,
          "font-size": 10,
          color: "#ffffff",
          "font-weight": "bold",
          "text-valign": "center",
          "text-halign": "center",
          "transition-property": "background-color, width, height",
        },
      },

      {
        selector: "node:selected",
        style: {
          "background-color": "#10b981",
          width: 50,
          height: 50,
        },
      },

      {
        selector: "edge",
        style: {
          width: 2,
          "line-color": "#93c5fd", // lighter blue
          "curve-style": "bezier",
          "target-arrow-shape": "none", // no arrows
          "source-arrow-shape": "none",
          opacity: 0.8,
        },
      },

      {
        selector: "edge:selected",
        style: {
          "line-color": "#10b981",
          width: 3,
        },
      },

    ],
  });

  return cy;
}

  async function getNodesAndEdges() {
    const nodesAndEdges = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/graph`
    );
    setGraphData(nodesAndEdges.data);
  }

  useEffect(() => {
    getNodesAndEdges();
  }, []);


  useEffect(() => {
    if (!graphData) return;
    const cy = createCyInstance(graphData);
    return () => cy.destroy();
  }, [graphData]);


  return (
    <div className="w-[100%]  h-[900px]" ref={containerRef}></div>
  );
}

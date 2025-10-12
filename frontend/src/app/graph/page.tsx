"use client"
import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
export default function Graph() {
  const containerRef = useRef<HTMLDivElement>(null);
//   function createCyInstance(elements: any) {
//     const cy = cytoscape({
//       container: containerRef.current,
//       elements,
//       layout: { name: "cose" },
//       style: [
//         {
//           selector: "node",
//           style: {
//             label: "data(label)",
//             width: 20,
//             height: 20,
//             "background-color": "#0074D9",
//             color: "#000000ff",
//             "font-size": 5,
//             "text-valign": "center",
//             "text-halign": "center",
//           },
//         },
//         {
//           selector: "edge",
//           style: {
//             width: 2,
//             "line-color": "#000000ff",
//             "target-arrow-shape": "triangle",
//             "target-arrow-color": "#aaa",
//             "curve-style": "bezier",
//           },
//         },
//       ],
//     });
//     return cy;
//   }

//   useEffect(()=>{
//     createCyInstance(elements);
//   },[])
  return (
    <div className="text-white">
      <div ref={containerRef}></div>
    </div>
  );
}

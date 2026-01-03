"use client";

import React from "react";
import { DiagramNode } from "@/types/diagram";
import { cn } from "@/lib/utils";

interface DiagramRendererProps {
  node: DiagramNode;
  isRoot?: boolean;
}

const BorderClass = "border-black dark:border-white";
const TextClass = "text-black dark:text-white";

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({
  node,
  isRoot = false,
}) => {
  const commonClasses = cn(
    "flex flex-col w-full text-sm",
    TextClass,
    !isRoot && "border-t-0", // Prevent double borders
    isRoot && `border-2 ${BorderClass}`
  );

  // Helper to ensure we render a sequence properly
  const renderChildren = (children?: DiagramNode[]) => {
    if (!children || children.length === 0) return null;
    return children.map((child, idx) => (
      <DiagramRenderer key={child.id || idx} node={child} />
    ));
  };

  switch (node.type) {
    case "sequence":
      return (
        <div className={cn("flex flex-col w-full", !isRoot && "border-l-0 border-r-0")}>
          {renderChildren(node.children)}
        </div>
      );

    case "statement":
      return (
        <div className={cn("p-2 border-b-2 last:border-b-0", BorderClass)}>
          {node.text}
        </div>
      );

    case "if":
      return (
        <div className={cn("flex flex-col w-full border-b-2 last:border-b-0", BorderClass)}>
          {/* Header with triangle split */}
          <div className={cn("relative h-20 w-full border-b-2 overflow-hidden bg-gray-50/50 dark:bg-white/5", BorderClass)}>
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
               {/* Left diagonal to bottom center */}
               <line
                 x1="0"
                 y1="0"
                 x2="50"
                 y2="100"
                 stroke="currentColor"
                 strokeWidth="1.5"
                 className={TextClass}
                 vectorEffect="non-scaling-stroke"
               />
               {/* Right diagonal to bottom center */}
               <line
                 x1="100%"
                 y1="0"
                 x2="50"
                 y2="100"
                 stroke="currentColor"
                 strokeWidth="1.5"
                 className={TextClass}
                 vectorEffect="non-scaling-stroke"
               />
            </svg>
            
            {/* Condition Text (Top Center) */}
            <div className="absolute inset-x-0 top-2 flex justify-center text-center px-10">
              <span className="font-bold z-10 break-words">{node.condition}</span>
            </div>

            {/* True Label (Top Left cornerish) */}
            <div className="absolute left-3 top-8">
               <span className="font-bold text-xs text-green-600 dark:text-green-400">T</span>
            </div>

             {/* False Label (Top Right cornerish) */}
            <div className="absolute right-3 top-8">
               <span className="font-bold text-xs text-red-600 dark:text-red-400">F</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex w-full">
            <div className={cn("flex-1 border-r-2 flex flex-col", BorderClass)}>
              {renderChildren(node.trueBlock)}
              {(!node.trueBlock || node.trueBlock.length === 0) && (
                  <div className="p-4 text-center text-gray-400 text-xs italic">Empty</div>
              )}
            </div>
            <div className="flex-1 flex flex-col">
              {renderChildren(node.falseBlock)}
               {(!node.falseBlock || node.falseBlock.length === 0) && (
                  <div className="p-4 text-center text-gray-400 text-xs italic">Empty</div>
              )}
            </div>
          </div>
        </div>
      );

    case "loop":
      return (
        <div className={cn("flex flex-col w-full border-b-2 last:border-b-0", BorderClass)}>
            {/* Loop Header - L Shape Style */}
            <div className={cn("flex flex-row w-full h-full")}>
                {/* Left bar (L-shape side) */}
                <div className={cn("w-8 border-r-2 shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800", BorderClass)}>
                    <span className="text-xs -rotate-90 whitespace-nowrap font-bold">LOOP</span>
                </div>
                
                <div className="flex flex-col flex-1">
                     {/* Condition */}
                    <div className={cn("p-2 border-b-2 font-bold bg-gray-50 dark:bg-gray-900", BorderClass)}>
                        {node.condition}
                    </div>
                    {/* Body */}
                    <div className="flex flex-col w-full">
                        {renderChildren(node.children)}
                    </div>
                </div>
            </div>
        </div>
      );

    default:
      return (
        <div className="p-2 border-b border-red-500 text-red-500">
          Unknown Node: {node.type}
        </div>
      );
  }
};

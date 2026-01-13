import React, { useEffect, useRef } from 'react';
import { OsintTool } from '../types';
import { ToolCard } from './ToolCard';

interface ToolListProps {
  tools: OsintTool[];
  activeToolId: number;
  onActiveChange: (id: number) => void;
}

export const ToolList: React.FC<ToolListProps> = ({ tools, activeToolId, onActiveChange }) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer with specific thresholds to detect centering
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-id'));
            if (!isNaN(id)) {
              onActiveChange(id);
            }
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: '-45% 0px -45% 0px', // Active when element is in the middle 10% of screen
        threshold: 0,
      }
    );

    // Observe all tool cards
    const elements = document.querySelectorAll('.tool-section');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [tools, onActiveChange]);

  return (
    <div className="space-y-48">
      {tools.map((tool) => (
        <div 
            key={tool.id} 
            id={`tool-${tool.id}`}
            data-id={tool.id} 
            className="tool-section scroll-mt-32"
        >
          <ToolCard tool={tool} isActive={tool.id === activeToolId} />
        </div>
      ))}
      <div className="h-[50vh]"></div> {/* Spacer for bottom scroll */}
    </div>
  );
};
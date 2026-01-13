
/// <reference types="node" />

import React, { useState, useRef } from 'react';
import { OsintTool } from '../types';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ToolCardProps {
  tool: OsintTool;
  isActive: boolean; 
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setSelectedFileName(e.target.files[0].name);
        setResult('');
        setGeneratedImage(null);
    }
  };

  const handleRun = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!inputValue && !file) return;
    
    setIsLoading(true);
    setResult('');
    setGeneratedImage(null);

    try {
        const ai = new GoogleGenerativeAI(process.env.API_KEY as string);
        
        let prompt = '';
        let imagePart = null;

        if (tool.inputType === 'file' && file) {
            const base64 = await fileToBase64(file);
            // Default to image/jpeg if type is missing, to ensure API accepts it (though browser usually supplies it)
            const mimeType = file.type || 'image/jpeg';
            imagePart = { inlineData: { mimeType, data: base64 } };
            prompt = `Analyze this file using ${tool.name}. Return realistic terminal output showing detailed metadata like Camera Model, ISO, Date/Time, Location, etc.`;
        } else {
            const cmd = tool.commandTemplate?.replace('{INPUT}', inputValue) || inputValue;
            prompt = `Simulate running the command: "${cmd}" using ${tool.name}. Provide the output as if it were a real CLI tool. Keep it concise.`;
        }

        // 1. Generate Text Output
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);

        setResult(response.response.text() || "Command executed.");

        // 2. Special Handling for Instaloader (Simulate Image Download)
        if (tool.name === 'Instaloader') {
             try {
                const imgPrompt = `A photorealistic instagram lifestyle photo posted by user "${inputValue || 'unknown'}". High quality, modern aesthetic.`;
                const imgModel = ai.getGenerativeModel({ model: 'gemini-1.5-pro' });
                const imgResponse = await imgModel.generateContent(imgPrompt);

                if (imgResponse.response.candidates?.[0]?.content?.parts) {
                    for (const part of imgResponse.response.candidates[0].content.parts) {
                        if (part.inlineData) {
                            const base64String = part.inlineData.data;
                            setGeneratedImage(`data:${part.inlineData.mimeType};base64,${base64String}`);
                            break; 
                        }
                    }
                }
             } catch (imgError) {
                console.error("Failed to generate simulation image:", imgError);
             }
        }

    } catch (e) {
        console.error(e);
        setResult("Error: Could not execute command. Please check your API key or file format.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in-up pl-4 lg:pl-0 max-w-3xl">
        {/* Header Section - No Box, just floating text */}
        <div className="flex flex-col items-start gap-4 mb-12">
            <div className="flex items-center gap-3 opacity-60">
                 <div className="h-[1px] w-8 bg-cyan-500"></div>
                 <span className="text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase">
                     {tool.category}
                 </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                {tool.name}
            </h1>
            
            <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-xl mt-2 border-l border-white/10 pl-6">
                {tool.description}
            </p>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-xl space-y-10">
            {tool.inputType === 'text' && (
                <div className="group relative">
                     <div className="absolute top-0 left-0 text-cyan-500 font-mono text-2xl pt-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
                        ➜
                     </div>
                     <input 
                        type="text" 
                        className="w-full bg-transparent border-b border-white/20 py-4 pl-10 text-2xl font-mono text-white placeholder-white/10 focus:outline-none focus:border-cyan-500 transition-all"
                        placeholder={tool.commandPlaceholder || "Enter target..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRun()}
                        autoFocus
                     />
                </div>
            )}
            
            {tool.inputType === 'file' && (
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex items-center gap-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                 >
                    <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-colors ${selectedFileName ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/20 group-hover:border-cyan-500'}`}>
                        {selectedFileName ? (
                             <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-mono tracking-widest uppercase text-cyan-400">
                            {selectedFileName ? 'File Selected' : 'Upload Target File'}
                        </div>
                        <div className="text-xs text-white/40 mt-1">
                            {selectedFileName || `Supports ${tool.accept || 'all files'}`}
                        </div>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept={tool.accept} 
                        onChange={handleFileChange}
                    />
                 </div>
            )}

            {/* Controls */}
             <div className="flex gap-4">
                {tool.url ? (
                     <a 
                        href={tool.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-white hover:text-cyan-400 transition-colors"
                     >
                        <span>Launch External Tool</span>
                        <span className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                     </a>
                ) : (
                    <button 
                        onClick={handleRun}
                        disabled={isLoading}
                        className="group flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-white hover:text-cyan-400 transition-colors disabled:opacity-50"
                    >
                        <span>{isLoading ? 'Processing...' : 'Execute Sequence'}</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">➜</span>
                    </button>
                )}
             </div>

             {/* Output Area */}
             {(result || generatedImage) && (
                 <div className="mt-12 pt-6 border-t border-dashed border-white/10">
                    <div className="text-xs text-white/30 font-mono mb-4 uppercase tracking-widest flex items-center justify-between">
                        <span>System Output:</span>
                        {generatedImage && <span className="text-cyan-400 animate-pulse">● DATA_RETRIEVED</span>}
                    </div>
                    
                    {/* Console Log */}
                    {result && (
                        <div className="font-mono text-sm text-green-400/90 whitespace-pre-wrap leading-relaxed mb-6">
                            {result}
                        </div>
                    )}

                    {/* Downloaded Asset Simulation */}
                    {generatedImage && (
                        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-white/5 max-w-sm">
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-white/70">
                                2024-10-27_IMG_8829.jpg
                            </div>
                            <img 
                                src={generatedImage} 
                                alt="Downloaded Asset" 
                                className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <div className="text-xs text-white font-mono">Status: DOWNLOADED_SUCCESSFULLY</div>
                            </div>
                        </div>
                    )}
                 </div>
             )}
        </div>
    </div>
  );
};

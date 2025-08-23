"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Pencil, Square, Circle, ArrowRight, Type, Hand, Trash2, Download, Upload, Undo, Redo, MousePointer } from 'lucide-react';

interface Element {
  id: number;
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  roughness?: number;
  points?: { x: number; y: number }[];
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}

interface Point {
  x: number;
  y: number;
}

export const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState('select');
  const [elements, setElements] = useState<Element[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillColor, setFillColor] = useState('transparent');
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Hand' },
    { id: 'pencil', icon: Pencil, label: 'Draw' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  const colors = ['#000000', '#e03131', '#2f9e44', '#1971c2', '#f08c00', '#9c36b5', '#495057'];
  const widths = [1, 2, 4, 8];

  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  }, []);

  const addToHistory = useCallback((newElements: Element[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  }, [history, historyStep]);

  const undo = useCallback(() => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  }, [history, historyStep]);

  const redo = useCallback(() => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  }, [history, historyStep]);

  const createElement = useCallback((type: string, x1: number, y1: number, x2: number, y2: number, options: { strokeColor?: string, strokeWidth?: number, fillColor?: string, text?: string, fontSize?: number, fontFamily?: string, points?: Point[] } = {}): Element => {
    const element: Element = {
      id: Date.now() + Math.random(),
      type,
      x1,
      y1,
      x2,
      y2,
      strokeColor: options.strokeColor || strokeColor,
      strokeWidth: options.strokeWidth || strokeWidth,
      fillColor: options.fillColor || fillColor,
      roughness: 1,
    };

    if (type === 'pencil') {
      element.points = options.points || [];
    }

    if (type === 'text') {
      element.text = options.text || 'Text';
      element.fontSize = options.fontSize || 20;
      element.fontFamily = options.fontFamily || 'Arial';
    }

    return element;
  }, [strokeColor, strokeWidth, fillColor]);

  const isPointInElement = (x: number, y: number, element: Element): boolean => {
    const { type, x1, y1, x2, y2 } = element;
    
    if (type === 'rectangle') {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
    
    if (type === 'ellipse') {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      const radiusX = Math.abs(x2 - x1) / 2;
      const radiusY = Math.abs(y2 - y1) / 2;
      const normalizedX = (x - centerX) / radiusX;
      const normalizedY = (y - centerY) / radiusY;
      return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
    }
    
    if (type === 'pencil' && element.points) {
      return element.points.some(point => {
        const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
        return distance <= element.strokeWidth + 3;
      });
    }
    
    if (type === 'arrow' || type === 'line') {
      const distance = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / 
                      Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
      return distance <= element.strokeWidth + 3;
    }

    if (type === 'text' && element.text) {
      const width = element.text.length * (element.fontSize || 20) * 0.6;
      const height = element.fontSize || 20;
      return x >= x1 && x <= x1 + width && y >= y1 && y <= y1 + height;
    }
    
    return false;
  };

  const getElementAtPosition = (x: number, y: number): Element | undefined => {
    return elements
      .slice()
      .reverse()
      .find(element => isPointInElement(x, y, element));
  };

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: Element) => {
    const { type, x1, y1, x2, y2, strokeColor, strokeWidth, fillColor } = element;
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = fillColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (type) {
      case 'rectangle':
        if (fillColor !== 'transparent') {
          ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        }
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        break;
        
      case 'ellipse':
        ctx.beginPath();
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const radiusX = Math.abs(x2 - x1) / 2;
        const radiusY = Math.abs(y2 - y1) / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        if (fillColor !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
        break;
        
      case 'arrow':
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Draw arrowhead
        const headlen = 20;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
        
      case 'pencil':
        if (element.points && element.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
          ctx.stroke();
        }
        break;
        
      case 'text':
        if (element.text && element.fontSize && element.fontFamily) {
          ctx.font = `${element.fontSize}px ${element.fontFamily}`;
          ctx.fillStyle = strokeColor;
          ctx.fillText(element.text, x1, y1 + element.fontSize);
        }
        break;
    }

    // Draw selection outline
    if (selectedElement && selectedElement.id === element.id) {
      ctx.strokeStyle = '#1971c2';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      let bounds = { minX: x1, minY: y1, maxX: x2, maxY: y2 };
      if (type === 'pencil' && element.points) {
        bounds = element.points.reduce((acc, point) => ({
          minX: Math.min(acc.minX, point.x),
          minY: Math.min(acc.minY, point.y),
          maxX: Math.max(acc.maxX, point.x),
          maxY: Math.max(acc.maxY, point.y)
        }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
      }
      
      ctx.strokeRect(
        bounds.minX - 5,
        bounds.minY - 5,
        bounds.maxX - bounds.minX + 10,
        bounds.maxY - bounds.minY + 10
      );
      ctx.setLineDash([]);
    }
  }, [selectedElement]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    elements.forEach(element => drawElement(ctx, element));
  }, [elements, drawElement]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);
    
    if (tool === 'select') {
      const element = getElementAtPosition(point.x, point.y);
      if (element) {
        setSelectedElement(element);
        setIsDragging(true);
        setDragOffset({
          x: point.x - element.x1,
          y: point.y - element.y1
        });
      } else {
        setSelectedElement(null);
      }
      return;
    }

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newElement = createElement('text', point.x, point.y, point.x, point.y, { text });
        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
      }
      return;
    }

    setIsDrawing(true);
    setStartPoint(point);

    if (tool === 'pencil') {
      setCurrentPath([point]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);

    if (isDragging && selectedElement) {
      const newElements = elements.map(el => {
        if (el.id === selectedElement.id) {
          const deltaX = point.x - dragOffset.x - el.x1;
          const deltaY = point.y - dragOffset.y - el.y1;
          
          if (el.type === 'pencil' && el.points) {
            return {
              ...el,
              points: el.points.map(p => ({ x: p.x + deltaX, y: p.y + deltaY }))
            };
          } else {
            return {
              ...el,
              x1: point.x - dragOffset.x,
              y1: point.y - dragOffset.y,
              x2: el.x2 + deltaX,
              y2: el.y2 + deltaY
            };
          }
        }
        return el;
      });
      
      setElements(newElements);
      const updatedSelected = newElements.find(el => el.id === selectedElement.id);
      if (updatedSelected) {
        setSelectedElement(updatedSelected);
      }
      return;
    }

    if (!isDrawing) return;

    if (tool === 'pencil') {
      setCurrentPath(prev => [...prev, point]);
    } else {
      // For shapes, we'll draw a preview on the canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      redraw();
      
      // Draw preview
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fillColor;
      ctx.setLineDash([3, 3]);
      
      if (tool === 'rectangle') {
        if (fillColor !== 'transparent') {
          ctx.fillRect(startPoint.x, startPoint.y, point.x - startPoint.x, point.y - startPoint.y);
        }
        ctx.strokeRect(startPoint.x, startPoint.y, point.x - startPoint.x, point.y - startPoint.y);
      } else if (tool === 'ellipse') {
        ctx.beginPath();
        const centerX = (startPoint.x + point.x) / 2;
        const centerY = (startPoint.y + point.y) / 2;
        const radiusX = Math.abs(point.x - startPoint.x) / 2;
        const radiusY = Math.abs(point.y - startPoint.y) / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        if (fillColor !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
      } else if (tool === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      addToHistory(elements);
      return;
    }

    if (!isDrawing) return;
    
    setIsDrawing(false);
    const point = getMousePos(e);

    if (tool === 'pencil' && currentPath.length > 0) {
      const newElement = createElement('pencil', 0, 0, 0, 0, { points: currentPath });
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      setCurrentPath([]);
    } else if (['rectangle', 'ellipse', 'arrow'].includes(tool)) {
      const newElement = createElement(tool, startPoint.x, startPoint.y, point.x, point.y);
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedElement(null);
    addToHistory([]);
  };

  const deleteSelected = () => {
    if (selectedElement) {
      const newElements = elements.filter(el => el.id !== selectedElement.id);
      setElements(newElements);
      setSelectedElement(null);
      addToHistory(newElements);
    }
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const importCanvas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' && selectedElement) {
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedElement, deleteSelected]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Tools */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {tools.map((toolItem) => (
              <button
                key={toolItem.id}
                onClick={() => setTool(toolItem.id)}
                className={`p-2 rounded transition-colors ${
                  tool === toolItem.id 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                title={toolItem.label}
              >
                <toolItem.icon size={20} />
              </button>
            ))}
          </div>

          {/* Colors */}
          <div className="flex items-center space-x-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  strokeColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="flex items-center space-x-1">
            {widths.map((width) => (
              <button
                key={width}
                onClick={() => setStrokeWidth(width)}
                className={`w-8 h-8 rounded border flex items-center justify-center ${
                  strokeWidth === width ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                <div 
                  className="rounded-full bg-current" 
                  style={{ width: width * 2, height: width * 2 }}
                />
              </button>
            ))}
          </div>

          {/* Fill Color */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Fill:</span>
            <select
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="transparent">None</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={historyStep === 0}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
            title="Undo"
          >
            <Undo size={20} />
          </button>
          
          <button
            onClick={redo}
            disabled={historyStep === history.length - 1}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
            title="Redo"
          >
            <Redo size={20} />
          </button>

          <button
            onClick={deleteSelected}
            disabled={!selectedElement}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
            title="Delete Selected"
          >
            <Trash2 size={20} />
          </button>

          <button
            onClick={clearCanvas}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>

          <button
            onClick={exportCanvas}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded"
            title="Export"
          >
            <Download size={20} />
          </button>

          <label className="p-2 text-gray-600 hover:bg-gray-200 rounded cursor-pointer" title="Import">
            <Upload size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={importCanvas}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full cursor-crosshair"
          style={{ cursor: tool === 'hand' ? 'grab' : tool === 'select' ? 'default' : 'crosshair' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDrawing(false);
            setIsDragging(false);
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t px-4 py-2 text-sm text-gray-600">
        Elements: {elements.length} | Tool: {tools.find(t => t.id === tool)?.label} | 
        {selectedElement && ` Selected: ${selectedElement.type}`}
      </div>
    </div>
  );
};
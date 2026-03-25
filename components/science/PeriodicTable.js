import { useRef, useEffect, useState } from 'react';
import { PERIODIC_ELEMENTS } from './periodic-elements';

const CATEGORY_COLORS = {
  nonmetal: { light: '#a3e635', dark: '#4ade80', lightBg: '#dcfce7', darkBg: '#064e3b' },
  noble: { light: '#d8b4fe', dark: '#a78bfa', lightBg: '#f3e8ff', darkBg: '#3f0f5c' },
  alkali: { light: '#fb7185', dark: '#f87171', lightBg: '#ffe4e6', darkBg: '#500724' },
  alkaline: { light: '#fcd34d', dark: '#fbbf24', lightBg: '#fef3c7', darkBg: '#451a03' },
  metalloid: { light: '#06b6d4', dark: '#22d3ee', lightBg: '#cffafe', darkBg: '#083344' },
  halogen: { light: '#60a5fa', dark: '#93c5fd', lightBg: '#dbeafe', darkBg: '#0c2d6b' },
  transition: { light: '#818cf8', dark: '#a5b4fc', lightBg: '#e0e7ff', darkBg: '#312e81' },
  lanthanide: { light: '#d946ef', dark: '#ec4899', lightBg: '#fae8ff', darkBg: '#500724' },
  actinide: { light: '#ec4899', dark: '#f472b6', lightBg: '#fce7f3', darkBg: '#500724' },
  post: { light: '#cbd5e1', dark: '#94a3b8', lightBg: '#f1f5f9', darkBg: '#1e293b' },
};

function normalizeSymbolList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value instanceof Set) {
    return Array.from(value);
  }

  if (typeof value === 'string' && value.trim()) {
    const raw = value.trim();

    if (raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const parsed = JSON.parse(raw.replace(/'/g, '"'));

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        return raw
          .replace(/[\[\]\"']/g, '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return raw
      .replace(/[\[\]\"']/g, '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (value && typeof value === 'object' && Array.isArray(value.includeSymbols)) {
    return value.includeSymbols;
  }

  return [];
}

function getElementGrid(elements, highlighted = [], includeSymbols = null) {
  const highlightedSet = new Set(normalizeSymbolList(highlighted).map((symbol) => String(symbol || '').trim().toLowerCase()));
  const normalizedIncludeSymbols = normalizeSymbolList(includeSymbols);

  const includeSet = new Set(
    normalizedIncludeSymbols
      .map((symbol) => String(symbol || '').trim().toLowerCase())
      .filter(Boolean)
  );

  const hasIncludeFilter = includeSet.size > 0;

  return elements
    .filter((element) => (hasIncludeFilter ? includeSet.has(element.symbol.toLowerCase()) : true))
    .map((element) => ({
      ...element,
      highlighted: highlightedSet.has(element.symbol.toLowerCase()),
    }));
}

function resolveCellSize(elementCount) {
  if (elementCount <= 18) {
    return 108;
  }

  if (elementCount <= 30) {
    return 92;
  }

  if (elementCount <= 60) {
    return 78;
  }

  if (elementCount <= 90) {
    return 68;
  }

  return 60;
}

function getMassLabel(element) {
  if (typeof element.mass === 'string' && element.mass.trim()) {
    return element.mass.trim();
  }

  if (typeof element.mass === 'number' && Number.isFinite(element.mass)) {
    return String(element.mass);
  }

  return `[${element.number}]`;
}

export default function PeriodicTable(props = {}) {
  const {
    highlighted = [],
    includeSymbols = null,
    showNames = 'auto',
    className = '',
  } = props;

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(false);
  const [scale, setScale] = useState(1);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [hoverScale, setHoverScale] = useState(1);
  const [selectedElement, setSelectedElement] = useState(null);
  const animationRef = useRef(null);
  const elementMapRef = useRef(new Map());

  // Use getElementGrid to properly filter and highlight elements
  const elements = getElementGrid(PERIODIC_ELEMENTS, highlighted, includeSymbols);

  const subsetActive = normalizeSymbolList(includeSymbols).length > 0;
  const shouldShowNames = showNames === true || (showNames === 'auto' && elements.length <= 80);
  const showLegend = !subsetActive;

  useEffect(() => {
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container || elements.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerWidth = container.clientWidth - 16;
    const maxCol = Math.max(...elements.map((e) => e.group));
    const maxRow = Math.max(...elements.map((e) => e.period));

    const cellSize = Math.max(40, Math.floor((containerWidth - 18) / maxCol));
    const padding = 8;
    const canvasWidth = maxCol * cellSize + (maxCol - 1) * 2 + padding * 2;
    const canvasHeight = maxRow * cellSize + (maxRow - 1) * 2 + padding * 2;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(dpr, dpr);

    // Build element map for hover detection
    const elementMap = new Map();

    const drawElement = (element, isHovered = false) => {
      const col = element.group - 1;
      const row = element.period - 1;
      const x = padding + col * (cellSize + 2);
      const y = padding + row * (cellSize + 2);
      let drawSize = cellSize;
      let drawX = x;
      let drawY = y;

      // If hovered, scale up from the element's center
      if (isHovered) {
        drawSize = cellSize * hoverScale;
        drawX = x + cellSize / 2 - drawSize / 2;
        drawY = y + cellSize / 2 - drawSize / 2;
      }

      const category = element.category || 'post';
      const colorPair = CATEGORY_COLORS[category] || CATEGORY_COLORS.post;
      let bgColor = isDark ? colorPair.darkBg : colorPair.lightBg;
      let borderColor = isDark ? colorPair.dark : colorPair.light;
      const textColor = isDark ? '#e2e8f0' : '#1e293b';

      // Highlight styling
      if (element.highlighted) {
        bgColor = '#fbbf24'; // Golden highlight
        borderColor = '#ea580c'; // Orange border
      }

      ctx.fillStyle = bgColor;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = element.highlighted ? 2.5 : 1.5;
      ctx.fillRect(drawX, drawY, drawSize, drawSize);
      ctx.strokeRect(drawX, drawY, drawSize, drawSize);

      // Draw text with pixelated upscaling on hover
      const prevImageSmoothing = ctx.imageSmoothingEnabled;
      if (isHovered) {
        ctx.imageSmoothingEnabled = false; // Disable smoothing for pixelated effect
      }

      ctx.fillStyle = textColor;
      ctx.font = `600 ${Math.max(10, drawSize * 0.12)}px system-ui`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(element.number, drawX + 4, drawY + 3);

      ctx.font = `700 ${Math.max(12, drawSize * 0.35)}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.symbol, drawX + drawSize / 2, drawY + drawSize / 2 - 6);

      if (shouldShowNames) {
        ctx.font = `400 ${Math.max(7, drawSize * 0.08)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(element.name.substring(0, 8), drawX + drawSize / 2, drawY + drawSize / 2 + 4);
      }

      ctx.font = `400 ${Math.max(8, drawSize * 0.1)}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(getMassLabel(element), drawX + drawSize / 2, drawY + drawSize - 3);

      ctx.imageSmoothingEnabled = prevImageSmoothing;
    };

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw all non-hovered elements
    elements.forEach((element) => {
      const col = element.group - 1;
      const row = element.period - 1;
      const x = padding + col * (cellSize + 2);
      const y = padding + row * (cellSize + 2);
      elementMap.set(`${col}-${row}`, { element, x, y, size: cellSize });

      if (hoveredElement?.symbol !== element.symbol) {
        drawElement(element, false);
      }
    });

    // Draw hovered element on top
    if (hoveredElement) {
      drawElement(hoveredElement, true);
    }

    elementMapRef.current = elementMap;
    setScale(cellSize);
  }, [elements, isDark, shouldShowNames, hoveredElement, hoverScale]);

  // Hover animation
  useEffect(() => {
    if (!hoveredElement) {
      setHoverScale(1);
      return;
    }

    let currentScale = hoverScale;
    const targetScale = 1.4;

    const animate = () => {
      currentScale += (targetScale - currentScale) * 0.1;
      if (Math.abs(currentScale - targetScale) > 0.01) {
        setHoverScale(currentScale);
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setHoverScale(targetScale);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [hoveredElement]);

  // Mouse move handler
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dpr = window.devicePixelRatio || 1;
    const canvasX = x / canvas.style.width.replace('px', '') * canvas.width / dpr;
    const canvasY = y / canvas.style.height.replace('px', '') * canvas.height / dpr;

    let foundElement = null;

    elementMapRef.current.forEach(({ element, x: cellX, y: cellY, size }) => {
      if (canvasX >= cellX && canvasX <= cellX + size && canvasY >= cellY && canvasY <= cellY + size) {
        foundElement = element;
      }
    });

    setHoveredElement(foundElement);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dpr = window.devicePixelRatio || 1;
    const canvasX = x / canvas.style.width.replace('px', '') * canvas.width / dpr;
    const canvasY = y / canvas.style.height.replace('px', '') * canvas.height / dpr;

    let foundElement = null;

    elementMapRef.current.forEach(({ element, x: cellX, y: cellY, size }) => {
      if (canvasX >= cellX && canvasX <= cellX + size && canvasY >= cellY && canvasY <= cellY + size) {
        foundElement = element;
      }
    });

    setSelectedElement(foundElement);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredElement(null);
    setHoverScale(1);
  };

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      {showLegend ? (
        <div className="mb-4 rounded-md border border-slate-300 bg-slate-50/90 p-3 text-slate-700 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Element key</p>
          <div className="mt-2 flex flex-wrap items-start gap-3">
            <div className="relative rounded-md border border-slate-400 bg-white p-1.5 dark:border-slate-600 dark:bg-slate-950" style={{ width: '72px', height: '72px' }}>
              <div className="text-[10px] leading-none opacity-75">1</div>
              <div className="mt-1 text-base font-bold leading-none">H</div>
              <div className="mt-1 text-[10px] leading-tight">Hydrogen</div>
              <div className="mt-1 text-[10px] leading-none opacity-80">1.008</div>
            </div>

            <svg width="320" height="84" viewBox="0 0 320 84" className="text-slate-400 dark:text-slate-500">
              <path d="M 0 8 L 44 8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 0 28 L 44 28" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 0 48 L 44 48" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 0 68 L 44 68" stroke="currentColor" strokeWidth="1.5" />
              <text x="52" y="12" fontSize="11" fill="currentColor">Atomic number</text>
              <text x="52" y="32" fontSize="11" fill="currentColor">Symbol</text>
              <text x="52" y="52" fontSize="11" fill="currentColor">Name</text>
              <text x="52" y="72" fontSize="11" fill="currentColor">Atomic mass</text>
            </svg>
          </div>
        </div>
      ) : null}

      <div ref={containerRef} className="overflow-x-auto relative">
        <canvas 
          ref={canvasRef} 
          className="block h-auto cursor-pointer" 
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          onClick={handleCanvasClick}
        />
        
        {selectedElement && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-6 shadow-2xl max-w-sm pointer-events-auto">
              <button
                onClick={() => setSelectedElement(null)}
                className="absolute -top-2 -right-2 w-7 h-7 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center text-base font-semibold transition-colors"
              >
                ✕
              </button>
              
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">{selectedElement.symbol}</div>
                <div className="text-xl font-semibold text-slate-700 dark:text-slate-200">{selectedElement.name}</div>
              </div>
              
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="font-semibold">Atomic Number:</span>
                  <span>{selectedElement.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Atomic Mass:</span>
                  <span>{getMassLabel(selectedElement)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Period:</span>
                  <span>{selectedElement.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Group:</span>
                  <span>{selectedElement.group}</span>
                </div>
                {selectedElement.category && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Category:</span>
                    <span className="capitalize">{selectedElement.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {subsetActive && elements.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          No matching elements were found for the selected subset.
        </p>
      ) : null}
    </div>
  );
}

import React, { useEffect, useRef } from "react";

interface FuzzyTextProps {
  children: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children,
  fontSize = 200, // Responsive font size
  fontWeight = 900,
  fontFamily = "inherit",
  enableHover = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationId: number;
    let isHovering = false;

    const render = () => {
        if (!canvas || !ctx) return;
        
        const width = canvas.width;
        const height = canvas.height;
        
        // Use computed style to match theme color (dark/light mode)
        const computedStyle = getComputedStyle(canvas);
        const textColor = computedStyle.color;

        ctx.clearRect(0, 0, width, height);
        
        // Font settings
        ctx.font = `${fontWeight} ${typeof fontSize === 'number' ? `${fontSize}px` : fontSize} ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = textColor;
        
        // Center coordinates
        const cx = width / 2;
        const cy = height / 2;

        // Draw text (Multi-line support)
        const lines = children.split('\n');
        const numericFontSize = typeof fontSize === 'number' ? fontSize : parseInt(fontSize as string, 10) || 100;
        // Line height factor 0.85 for tight stacking like the design
        const lineHeight = numericFontSize * 0.85; 
        const totalTextHeight = lines.length * lineHeight;
        // Calculate start Y to center the block
        // Shift by half line height because textBaseline is middle
        const startY = cy - (totalTextHeight / 2) + (lineHeight / 2);

        lines.forEach((line, i) => {
            ctx.fillText(line, cx, startY + i * lineHeight);
        });

        // Get pixels
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Apply Noise
        const intensity = isHovering && enableHover ? 0.45 : 0.12;
        
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) {
                if (Math.random() < intensity) {
                    data[i + 3] = 0; 
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);

        animationId = requestAnimationFrame(render);
    };

    const handleResize = () => {
        const parent = canvas.parentElement;
        if (parent) {
            const rect = parent.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    const onMouseEnter = () => isHovering = true;
    const onMouseLeave = () => isHovering = false;

    if (enableHover) {
        canvas.addEventListener('mouseenter', onMouseEnter);
        canvas.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
        window.removeEventListener('resize', handleResize);
        if (enableHover) {
            canvas.removeEventListener('mouseenter', onMouseEnter);
            canvas.removeEventListener('mouseleave', onMouseLeave);
        }
        cancelAnimationFrame(animationId);
    };
  }, [children, fontSize, fontWeight, fontFamily, enableHover]);

  return <canvas ref={canvasRef} className="w-full h-full cursor-default text-ink" />;
};

export default FuzzyText;
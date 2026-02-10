'use client';

import { useEffect, useRef } from 'react';

interface MatrixRainProps {
    className?: string;
}

const MatrixRain = ({ className }: MatrixRainProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Characters - Katakana + Latin
        const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charArray = chars.split('');

        const fontSize = 16;
        let columns = width / fontSize;

        // Array to store the vertical position of the drops
        // Initialize with random starting positions for a more natural look
        let drops: number[] = [];

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let isMouseActive = false;

        const initDrops = () => {
            columns = width / fontSize;
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100; // Random start above screen
            }
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initDrops();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseActive = true;

            // Reset activity after a delay
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                isMouseActive = false;
            }, 2000);
        };

        let mouseTimeout: NodeJS.Timeout;

        // Initial setup
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        const draw = () => {
            // Translucent black background to create trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#0F0'; // Matrix Green
            ctx.font = `${fontSize}px monospace`;

            // Add glow effect
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(0, 255, 0, 0.5)";

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = charArray[Math.floor(Math.random() * charArray.length)];

                // Mouse interaction logic
                const columnX = i * fontSize;
                const distX = Math.abs(columnX - mouseX);

                // Determine if this drop is near mouse vertically 
                // We use the current drop position estimate
                const currentY = drops[i] * fontSize;
                const distY = Math.abs(currentY - mouseY);

                // If mouse is close, highlight
                let isHighlighted = false;
                if (isMouseActive && distX < 100 && distY < 100) {
                    ctx.fillStyle = '#CFFFCD'; // Brighter whitish-green near mouse
                    ctx.shadowColor = "rgba(200, 255, 200, 0.8)";
                    ctx.shadowBlur = 15;
                    isHighlighted = true;
                } else {
                    // Randomly make some characters brighter
                    if (Math.random() > 0.98) {
                        ctx.fillStyle = '#8F8';
                        ctx.shadowColor = "rgba(100, 255, 100, 0.8)";
                    } else {
                        ctx.fillStyle = '#0F0';
                        ctx.shadowColor = "rgba(0, 255, 0, 0.5)";
                    }
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset styles
                if (isHighlighted) {
                    ctx.fillStyle = '#0F0';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = "rgba(0, 255, 0, 0.5)";
                }

                // Reset drop to top randomly after it crosses screen
                // Adding randomness to the reset to prevent patterns
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Move drop down
                // Speed variation based on column for depth effect
                drops[i]++;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(mouseTimeout);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
        />
    );
};

export default MatrixRain;

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
        // const chars = '0100101010010001010100010100101001001000010010001001000101000101001000101111010110110001001111110100111101001010101011010101111001000010010010001100010010100100110010001001010010010001101100110010001010100101001011100011010010010100101001';
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

                // Coordinates
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                let drawX = x;
                let drawY = y;

                // Obstacle Interaction (Mouse)
                const dist = Math.hypot(x - mouseX, y - mouseY);
                const obstacleRadius = 150; // Interaction radius

                if (isMouseActive && dist < obstacleRadius) {
                    // Calculate repulsion
                    const angle = Math.atan2(y - mouseY, x - mouseX);
                    // Force is stronger closer to center
                    const force = (obstacleRadius - dist) / obstacleRadius;
                    const power = 120; // Pixel displacement power - Strong Jump

                    drawX += Math.cos(angle) * force * power;
                    drawY += Math.sin(angle) * force * power;

                    // Highlight interaction
                    ctx.fillStyle = '#CFFFCD';
                    ctx.shadowColor = "rgba(200, 255, 200, 0.8)";
                    ctx.shadowBlur = 15;
                } else {
                    // Standard Matrix style
                    if (Math.random() > 0.98) {
                        ctx.fillStyle = '#8F8';
                        ctx.shadowColor = "rgba(100, 255, 100, 0.8)";
                    } else {
                        ctx.fillStyle = '#0F0';
                        ctx.shadowColor = "rgba(0, 255, 0, 0.5)";
                    }
                }

                ctx.fillText(text, drawX, drawY);

                // Reset drop to top randomly after it crosses screen
                // Adding randomness to the reset to prevent patterns
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Move drop down
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

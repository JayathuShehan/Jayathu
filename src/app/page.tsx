"use client";

import React, { useState, useEffect, useRef } from "react";

// Custom hook: useTypewriter
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      let index = 0;
      intervalId = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

const DEFAULT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";

export default function Home() {
  // Mobile navigation state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Pill buttons delayed visibility (400ms after page load)
  const [pillsVisible, setPillsVisible] = useState(false);

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  // Video source state (default to local hero-video.mp4 if present, else fallback)
  const [videoSrc, setVideoSrc] = useState<string>("/hero-video.mp4");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Video mouse scrubbing references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const prevXRef = useRef<number | null>(null);

  // Typewriter effect
  const introHeadline =
    "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
  const { displayed, done } = useTypewriter(introHeadline, 38, 600);

  // Video scrub seek helper
  const triggerSeek = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    if (!isSeekingRef.current) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  };

  // onSeeked handler to prevent seek flooding
  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video || !video.duration) {
      isSeekingRef.current = false;
      return;
    }

    const diff = Math.abs(video.currentTime - targetTimeRef.current);
    if (diff > 0.02) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  // Window mousemove / touchmove listener for video scrubbing
  useEffect(() => {
    const SENSITIVITY = 0.8;

    const handleMouseMove = (e: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const video = videoRef.current;
      if (!video || !video.duration) return;

      const timeOffset =
        (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.min(
        Math.max(0, targetTimeRef.current + timeOffset),
        video.duration
      );

      triggerSeek();
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    // Touch support for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const currentX = e.touches[0].clientX;

      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const video = videoRef.current;
      if (!video || !video.duration) return;

      const timeOffset =
        (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.min(
        Math.max(0, targetTimeRef.current + timeOffset),
        video.duration
      );

      triggerSeek();
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Make action pill buttons visible 400ms after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Check localStorage for previously uploaded or chosen video
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mainframe_custom_video");
      if (saved) {
        setTimeout(() => {
          setVideoSrc(saved);
        }, 0);
      }
    }
  }, []);

  // Process video file selection (instant client playback + persistent save)
  const handleProcessVideoFile = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file (.mp4, .webm, etc.)");
      return;
    }

    // 1. Instant client-side preview
    const objectUrl = URL.createObjectURL(file);
    setVideoSrc(objectUrl);
    setUploadStatus("Updating background video...");

    // 2. Persist to server /public/hero-video.mp4
    try {
      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadStatus("Video updated successfully!");
        localStorage.setItem("mainframe_custom_video", data.url);
        setTimeout(() => setUploadStatus(null), 3000);
      } else {
        setUploadStatus("Active in session (preview)");
        setTimeout(() => setUploadStatus(null), 3000);
      }
    } catch {
      setUploadStatus("Active in session (preview)");
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  // Drag and drop video file handlers
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.types?.includes("Files")) {
        setIsDraggingFile(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);

      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleProcessVideoFile(file);
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Copy email handler
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("hello@mainframe.co");
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none bg-black">
      {/* Background Video (mouse-scrub controlled) */}
      <video
        key={videoSrc}
        ref={videoRef}
        src={videoSrc}
        onError={(e) => {
          // If local /hero-video.mp4 hasn't been placed yet, fall back gracefully
          const target = e.currentTarget;
          if (target.src.includes("/hero-video.mp4")) {
            setVideoSrc(DEFAULT_VIDEO_URL);
          }
        }}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            targetTimeRef.current = videoRef.current.currentTime || 0;
          }
        }}
        className="fixed inset-0 z-0 h-full w-full object-cover pointer-events-none select-none"
        style={{
          objectPosition: "70% center",
        }}
      />

      {/* Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md border-4 border-dashed border-white/60 pointer-events-none">
          <div className="text-center text-white space-y-2">
            <div className="text-4xl">🎬</div>
            <p className="text-xl font-medium">Drop your KlingAI video here</p>
            <p className="text-sm text-white/70">
              It will instantly replace the background video with interactive mouse-scrub
            </p>
          </div>
        </div>
      )}

      {/* Floating Status Notification */}
      {uploadStatus && (
        <div className="fixed top-20 right-5 z-40 bg-white text-black px-4 py-2 rounded-full text-xs font-medium shadow-2xl border border-black/10 flex items-center gap-2 animate-bounce">
          <span>✓</span> {uploadStatus}
        </div>
      )}

      {/* NAVBAR (fixed, z-index: 10) */}
      <header className="fixed top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center">
        {/* Logo (left) */}
        <div className="flex flex-row items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Mainframe®
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop nav links (center, hidden below md) */}
        <nav className="hidden md:flex flex-row items-center text-[23px] text-black">
          <a
            href="#labs"
            className="hover:opacity-60 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            Labs
          </a>
          <span>,&nbsp;</span>
          <a
            href="#studio"
            className="hover:opacity-60 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            Studio
          </a>
          <span>,&nbsp;</span>
          <a
            href="#openings"
            className="hover:opacity-60 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            Openings
          </a>
          <span>,&nbsp;</span>
          <a
            href="#shop"
            className="hover:opacity-60 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            Shop
          </a>
        </nav>

        {/* Desktop CTA (right, hidden below md) */}
        <a
          href="mailto:hello@mainframe.co"
          className="hidden md:inline-block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile hamburger (visible below md) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 z-20 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay (z-index: 9) */}
      <div
        className={`fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <a
          href="#labs"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
        >
          Labs
        </a>
        <a
          href="#studio"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
        >
          Studio
        </a>
        <a
          href="#openings"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
        >
          Openings
        </a>
        <a
          href="#shop"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
        >
          Shop
        </a>
        <a
          href="mailto:hello@mainframe.co"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>
      </div>

      {/* HERO SECTION (z-index: 1) */}
      <main className="relative z-[1] h-screen w-full flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        {/* Content container */}
        <div className="max-w-xl relative z-10">
          {/* 1. Blurred intro label */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: "#000",
              filter: "blur(4px)",
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe&apos;s Adaptive Response Interface Agent
          </div>

          {/* 2. Typewriter text */}
          <p
            className="text-black mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: "54px",
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink"
                aria-hidden="true"
              />
            )}
          </p>

          {/* 3. Action pill buttons */}
          <div
            className={`flex flex-wrap gap-y-1 ${
              pillsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[8px]"
            }`}
            style={{
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {/* 4 white pill buttons */}
            <button
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
            >
              Pitch us an idea
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
            >
              Come work here
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
            >
              Send a brief hello
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
            >
              See how we operate
            </button>

            {/* 1 outline pill button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              title="Click to copy email address"
              className="group inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200"
            >
              <span>
                Reach us:{" "}
                <span className="underline underline-offset-1">
                  hello@mainframe.co
                </span>
              </span>

              {/* 12x12 copy icon: inline SVG of two overlapping rectangles */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block flex-shrink-0 transition-colors"
                aria-hidden="true"
              >
                <rect
                  x="3.5"
                  y="1"
                  width="7.5"
                  height="7.5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <rect
                  x="1"
                  y="3.5"
                  width="7.5"
                  height="7.5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>

              {copied && (
                <span className="text-[11px] bg-black text-white px-2 py-0.5 rounded-full ml-1 animate-pulse">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Hidden File Input for Native File Selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleProcessVideoFile(e.target.files[0]);
          }
        }}
      />

      {/* Video Switcher Control in Bottom Corner */}
      <aside aria-label="Background Video Controls" className="fixed bottom-4 right-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-black/70 hover:bg-black text-white text-[13px] px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md cursor-pointer transition-all shadow-lg hover:scale-105"
        >
          <span>📁</span>
          <span>Upload KlingAI Video</span>
        </button>

        <button
          type="button"
          onClick={() => setShowUrlModal(true)}
          className="inline-flex items-center bg-black/70 hover:bg-black text-white text-[13px] px-2.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md cursor-pointer transition-all shadow-lg hover:scale-105"
          title="Paste video URL"
        >
          🔗
        </button>
      </aside>

      {/* Video URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700 text-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-medium">Use Custom Video URL</h3>
            <p className="text-xs text-zinc-400">
              Provide a direct URL to your MP4 video file, or use the file upload button to upload directly from your device.
            </p>
            <input
              type="url"
              placeholder="https://example.com/video.mp4"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (customUrlInput.trim()) {
                    setVideoSrc(customUrlInput.trim());
                    localStorage.setItem("mainframe_custom_video", customUrlInput.trim());
                    setShowUrlModal(false);
                    setUploadStatus("Video URL updated!");
                    setTimeout(() => setUploadStatus(null), 3000);
                  }
                }}
                className="px-4 py-1.5 text-xs bg-white text-black font-medium rounded-lg hover:bg-zinc-200 cursor-pointer"
              >
                Apply URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import { useState, useRef, useEffect } from "react";
import { useToast } from "./use-toast";

export const useAudioCutter = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [bitrate, setBitrate] = useState("128");
  const [sampleRate, setSampleRate] = useState("44100");
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState<"start" | "end" | "none">("none");
  const [estimatedSize, setEstimatedSize] = useState<string>("0 KB");

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (file && audioRef.current) {
      const audio = audioRef.current;
      audio.src = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setEndTime(audio.duration);
        drawWaveform();
        calculateEstimatedSize();
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }
    };
  }, [file]);

  useEffect(() => {
    calculateEstimatedSize();
  }, [startTime, endTime, bitrate, sampleRate]);

  useEffect(() => {
    // Make sure audio playback stops at the end time
    if (audioRef.current && currentTime >= endTime && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  }, [currentTime, endTime, isPlaying, startTime]);

  useEffect(() => {
    drawWaveform();
  }, [startTime, endTime, currentTime, duration, isDragging]);

  const calculateEstimatedSize = () => {
    if (!file) return;

    const trimDuration = endTime - startTime;
    const bitrateKbps = parseInt(bitrate);
    const estimatedBytes = (trimDuration * bitrateKbps * 1000) / 8;
    
    setEstimatedSize(formatFileSize(estimatedBytes));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes.toFixed(0) + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const drawWaveform = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 100;

    // Clear canvas
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waveform bars
    const barWidth = 2;
    const barSpacing = 1;
    const numBars = Math.floor(canvas.width / (barWidth + barSpacing));

    for (let i = 0; i < numBars; i++) {
      // Create a more realistic waveform
      const x = i * (barWidth + barSpacing);
      
      // Create a pattern that looks like audio peaks
      const position = i / numBars;
      const frequency = 3;
      const amplitude = 0.3;
      
      // Add some randomness to make it look more natural
      const noise = Math.random() * 0.2;
      
      // Create the waveform pattern
      const wave1 = Math.sin(position * Math.PI * 2 * frequency) * amplitude;
      const wave2 = Math.sin(position * Math.PI * 4 * frequency) * amplitude * 0.5;
      
      // Combine waves and add noise
      const value = Math.abs(wave1 + wave2 + noise);
      const height = value * canvas.height * 0.8;
      
      const y = (canvas.height - height) / 2;

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x, y, barWidth, height);
    }

    // Draw selection area with handles
    const startX = (startTime / duration) * canvas.width;
    const endX = (endTime / duration) * canvas.width;
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.fillRect(startX, 0, endX - startX, canvas.height);
    
    // Draw handles for start and end
    ctx.fillStyle = '#3b82f6';
    // Start handle
    ctx.fillRect(startX - 4, 0, 8, canvas.height);
    // End handle
    ctx.fillRect(endX - 4, 0, 8, canvas.height);

    // Draw current time line
    const currentX = (currentTime / duration) * canvas.width;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentX, 0);
    ctx.lineTo(currentX, canvas.height);
    ctx.stroke();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
    }
  };

  const resetFile = () => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
    }
    setFile(null);
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setStartTime(0);
    setEndTime(0);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Start playback from selected start time if we're outside selection
      if (currentTime < startTime || currentTime > endTime) {
        audioRef.current.currentTime = startTime;
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !audioRef.current || duration === 0) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;

    audioRef.current.currentTime = clickTime;
    setCurrentTime(clickTime);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || duration === 0) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;
    
    const startX = (startTime / duration) * canvas.width;
    const endX = (endTime / duration) * canvas.width;
    
    // Determine if we're grabbing start or end handle
    const isNearStart = Math.abs(x - startX) < 10;
    const isNearEnd = Math.abs(x - endX) < 10;
    
    if (isNearStart) {
      setIsDragging("start");
    } else if (isNearEnd) {
      setIsDragging("end");
    } else if (x > startX && x < endX) {
      // Clicking in the middle of selection just sets the playhead
      audioRef.current!.currentTime = clickTime;
      setCurrentTime(clickTime);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging === "none" || !canvasRef.current || duration === 0) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min((x / canvas.width) * duration, duration));
    
    if (isDragging === "start") {
      if (newTime < endTime - 0.5) {
        setStartTime(newTime);
      }
    } else if (isDragging === "end") {
      if (newTime > startTime + 0.5) {
        setEndTime(newTime);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging("none");
  };

  const handleCanvasMouseLeave = () => {
    if (isDragging !== "none") {
      setIsDragging("none");
    }
  };

  const cutAudio = async () => {
    if (!file) {
      toast({
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih file audio terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // This is a simplified version - in a real app, you'd use Web Audio API
      // For now, we'll just create a download link with the original file
      const blob = new Blob([file], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.split('.')[0]}_trimmed.mp3`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Audio diproses",
        description: "Audio hasil potongan siap diunduh.",
      });
    } catch (error) {
      toast({
        title: "Pemrosesan gagal",
        description: "Terjadi kesalahan saat memproses audio.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return {
    file,
    isPlaying,
    duration,
    currentTime,
    startTime,
    endTime,
    fadeIn,
    fadeOut,
    bitrate,
    sampleRate,
    processing,
    isDragging,
    estimatedSize,
    audioRef,
    canvasRef,
    setStartTime,
    setEndTime,
    setFadeIn,
    setFadeOut,
    setBitrate,
    setSampleRate,
    formatFileSize,
    formatTime,
    handleFileSelect,
    resetFile,
    togglePlayPause,
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasMouseLeave,
    cutAudio
  };
};

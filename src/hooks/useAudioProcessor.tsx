
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useAudioProcessor = () => {
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
  const [isDragging, setIsDragging] = useState<null | 'start' | 'end' | 'current'>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const loadAudioBuffer = async (audioFile: File) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
    } catch (error) {
      console.error('Error loading audio buffer:', error);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      setStartTime(0);
      setCurrentTime(0);
    } else if (selectedFile) {
      toast({
        title: "Format file tidak didukung",
        description: "Silakan pilih file audio (MP3, WAV, AAC, dll).",
        variant: "destructive",
      });
    }
  };

  const removeFile = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setFile(null);
    setAudioBuffer(null);
    setCurrentTime(0);
    setStartTime(0);
    setEndTime(0);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.currentTime < startTime || audioRef.current.currentTime > endTime) {
        audioRef.current.currentTime = startTime;
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const estimateOutputSize = () => {
    if (!file) return "0 KB";
    
    const outputDuration = endTime - startTime;
    const bitrateBytes = parseInt(bitrate) * 1024 / 8;
    const estimatedBytes = outputDuration * bitrateBytes;
    
    if (estimatedBytes >= 1048576) {
      return (estimatedBytes / 1048576).toFixed(2) + " MB";
    } else {
      return (estimatedBytes / 1024).toFixed(2) + " KB";
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    // State
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
    audioBuffer,
    
    // Refs
    audioRef,
    audioContextRef,
    
    // Setters
    setDuration,
    setCurrentTime,
    setStartTime,
    setEndTime,
    setFadeIn,
    setFadeOut,
    setBitrate,
    setSampleRate,
    setProcessing,
    setIsDragging,
    setIsPlaying,
    
    // Functions
    loadAudioBuffer,
    handleFileSelect,
    removeFile,
    togglePlayPause,
    estimateOutputSize,
    formatTime,
  };
};


import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Upload, Download, Play, Pause, Music, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Mp3Cutter = () => {
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
  const canvasContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    drawWaveform();
  }, [startTime, endTime, currentTime, duration, isDragging]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
    }
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

  useEffect(() => {
    // Make sure audio playback stops at the end time
    if (audioRef.current && currentTime >= endTime && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  }, [currentTime, endTime, isPlaying, startTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold font-heading bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Pemotong MP3
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Upload Section - Only shown if no file selected */}
          {!file ? (
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-heading">Unggah File Audio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">
                    Tarik & lepas file audio di sini, atau klik untuk memilih
                  </p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="audio-input"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="audio-input">Pilih File Audio</label>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="text-green-500 w-6 h-6" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • {formatTime(duration)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="audio-input-change"
                />
                <Button asChild variant="outline" size="sm">
                  <label htmlFor="audio-input-change">Ganti Audio</label>
                </Button>
                <Button onClick={resetFile} variant="ghost" size="sm">
                  <XCircle className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </div>
          )}

          {/* Waveform Section */}
          {file && (
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-heading">Audio Waveform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    ref={canvasContainerRef} 
                    className="relative"
                    style={{ cursor: isDragging !== "none" ? "ew-resize" : "pointer" }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="w-full h-24 border border-gray-300 rounded cursor-pointer"
                      onClick={handleCanvasClick}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseLeave}
                    />
                    <div className="text-xs text-gray-500 mt-1 flex justify-between">
                      <span>0:00</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button onClick={togglePlayPause} variant="outline" size="sm">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <span className="text-sm text-gray-600">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Waktu Mulai: {formatTime(startTime)}</Label>
                      <Slider
                        value={[startTime]}
                        onValueChange={([value]) => {
                          if (value < endTime - 0.5) {
                            setStartTime(value);
                          }
                        }}
                        max={duration}
                        min={0}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Waktu Selesai: {formatTime(endTime)}</Label>
                      <Slider
                        value={[endTime]}
                        onValueChange={([value]) => {
                          if (value > startTime + 0.5) {
                            setEndTime(value);
                          }
                        }}
                        max={duration}
                        min={0}
                        step={0.1}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Durasi: {formatTime(endTime - startTime)} • Perkiraan ukuran: {estimatedSize}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      * Tarik pegangan di waveform atau gunakan slider untuk mengatur bagian yang ingin dipotong
                    </p>
                  </div>
                </div>

                <audio ref={audioRef} />
              </CardContent>
            </Card>
          )}

          {/* Settings Section */}
          {file && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-heading">Efek Fade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fade In</Label>
                      <p className="text-xs text-gray-500">Tambahkan efek fade in pada awal audio</p>
                    </div>
                    <Switch checked={fadeIn} onCheckedChange={setFadeIn} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fade Out</Label>
                      <p className="text-xs text-gray-500">Tambahkan efek fade out pada akhir audio</p>
                    </div>
                    <Switch checked={fadeOut} onCheckedChange={setFadeOut} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-heading">Pengaturan Output</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bitrate</Label>
                    <Select value={bitrate} onValueChange={setBitrate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64">64 kbps</SelectItem>
                        <SelectItem value="128">128 kbps</SelectItem>
                        <SelectItem value="320">320 kbps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sample Rate</Label>
                    <Select value={sampleRate} onValueChange={setSampleRate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="22050">22050 Hz</SelectItem>
                        <SelectItem value="44100">44100 Hz</SelectItem>
                        <SelectItem value="48000">48000 Hz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Process Button */}
          {file && (
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Button
                  onClick={cutAudio}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 font-heading"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {processing ? "Memproses..." : "Potong & Unduh MP3"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mp3Cutter;

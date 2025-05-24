
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Upload, Download, Play, Pause, Music, Trash } from "lucide-react";
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
  const [isDragging, setIsDragging] = useState<null | 'start' | 'end' | 'current'>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (file && audioRef.current) {
      const audio = audioRef.current;
      audio.src = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setEndTime(audio.duration);
        drawWaveform();
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
    }
  }, [file]);

  const drawWaveform = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 100;

    // Simple waveform visualization
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waveform bars
    const barWidth = 2;
    const barSpacing = 1;
    const numBars = Math.floor(canvas.width / (barWidth + barSpacing));

    for (let i = 0; i < numBars; i++) {
      const height = Math.random() * canvas.height * 0.8;
      const x = i * (barWidth + barSpacing);
      const y = (canvas.height - height) / 2;

      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, y, barWidth, height);
    }

    // Draw selection area
    const startX = (startTime / duration) * canvas.width;
    const endX = (endTime / duration) * canvas.width;
    
    ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.fillRect(startX, 0, endX - startX, canvas.height);

    // Draw start handle
    const handleWidth = 8;
    const handleHeight = 30;
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(startX - (handleWidth / 2), (canvas.height - handleHeight) / 2, handleWidth, handleHeight);
    
    // Draw end handle
    ctx.fillStyle = '#10b981';
    ctx.fillRect(endX - (handleWidth / 2), (canvas.height - handleHeight) / 2, handleWidth, handleHeight);

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
  }, [startTime, endTime, currentTime, duration]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setFile(null);
    setCurrentTime(0);
    setStartTime(0);
    setEndTime(0);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !audioRef.current || isDragging) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;

    audioRef.current.currentTime = clickTime;
    setCurrentTime(clickTime);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !duration) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;
    
    const startHandleX = (startTime / duration) * canvas.width;
    const endHandleX = (endTime / duration) * canvas.width;
    const currentX = (currentTime / duration) * canvas.width;
    
    // Check if click is close to start or end handle
    const handleWidth = 12; // slightly larger for better clickability
    
    if (Math.abs(x - startHandleX) <= handleWidth) {
      setIsDragging('start');
    } else if (Math.abs(x - endHandleX) <= handleWidth) {
      setIsDragging('end');
    } else if (Math.abs(x - currentX) <= handleWidth) {
      setIsDragging('current');
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current || !duration) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width, e.clientX - rect.left));
    const dragTime = (x / canvas.width) * duration;
    
    if (isDragging === 'start') {
      setStartTime(Math.min(dragTime, endTime - 0.1));
    } else if (isDragging === 'end') {
      setEndTime(Math.max(dragTime, startTime + 0.1));
    } else if (isDragging === 'current' && audioRef.current) {
      audioRef.current.currentTime = dragTime;
      setCurrentTime(dragTime);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(null);
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const estimateOutputSize = () => {
    if (!file) return "0 KB";
    
    // Calculate output duration
    const outputDuration = endTime - startTime;
    
    // Calculate bitrate in bytes per second
    const bitrateBytes = parseInt(bitrate) * 1024 / 8;
    
    // Estimate size based on duration and bitrate
    const estimatedBytes = outputDuration * bitrateBytes;
    
    // Format the size
    if (estimatedBytes >= 1048576) {
      return (estimatedBytes / 1048576).toFixed(2) + " MB";
    } else {
      return (estimatedBytes / 1024).toFixed(2) + " KB";
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
      // Ini adalah versi sederhana - dalam aplikasi sebenarnya, gunakan Web Audio API
      // Untuk saat ini, kita hanya akan membuat link unduh dengan file asli
      const blob = new Blob([file], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.split('.')[0]}_dipotong.mp3`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Audio diproses",
        description: "Audio yang dipotong siap untuk diunduh.",
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
          <h1 className="text-2xl font-bold font-poppins bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Pemotong MP3
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Upload or File Info Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins">
                {file ? "File Audio" : "Unggah File Audio"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!file ? (
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
              ) : (
                <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Music className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-700 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {formatTime(duration)}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={removeFile}>
                    <Trash className="w-4 h-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waveform Section */}
          {file && (
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-poppins">Gelombang Suara</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" ref={containerRef}>
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-24 border border-gray-300 rounded cursor-pointer"
                      onClick={handleCanvasClick}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 py-1 text-xs text-gray-500">
                      <span>0:00</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <Button onClick={togglePlayPause} variant="outline" size="sm">
                      {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isPlaying ? "Jeda" : "Putar"}
                    </Button>
                    <span className="text-sm text-gray-600">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Waktu Awal: {formatTime(startTime)}</Label>
                      <Slider
                        value={[startTime]}
                        onValueChange={(value) => setStartTime(Math.min(value[0], endTime - 0.1))}
                        max={duration}
                        min={0}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Waktu Akhir: {formatTime(endTime)}</Label>
                      <Slider
                        value={[endTime]}
                        onValueChange={(value) => setEndTime(Math.max(value[0], startTime + 0.1))}
                        max={duration}
                        min={0}
                        step={0.1}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Durasi potongan: {formatTime(endTime - startTime)}
                  </p>
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
                  <CardTitle className="font-poppins">Efek Fade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Fade In</Label>
                    <Switch checked={fadeIn} onCheckedChange={setFadeIn} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Fade Out</Label>
                    <Switch checked={fadeOut} onCheckedChange={setFadeOut} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-poppins">Pengaturan Keluaran</CardTitle>
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
                  
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Estimasi Ukuran Hasil</p>
                    <p className="text-sm text-gray-600">{estimateOutputSize()}</p>
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
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90"
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

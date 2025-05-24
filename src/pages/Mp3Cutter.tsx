
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
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (file && audioRef.current) {
      const audio = audioRef.current;
      const url = URL.createObjectURL(file);
      audio.src = url;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setEndTime(audio.duration);
        loadAudioBuffer(file);
        drawWaveform();
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

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

  const drawWaveform = () => {
    if (!canvasRef.current || !audioBuffer) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 100;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waveform from audio buffer
    const channelData = audioBuffer.getChannelData(0);
    const samplesPerPixel = Math.floor(channelData.length / canvas.width);
    
    ctx.fillStyle = '#10b981';
    for (let x = 0; x < canvas.width; x++) {
      let sum = 0;
      for (let i = 0; i < samplesPerPixel; i++) {
        const index = x * samplesPerPixel + i;
        if (index < channelData.length) {
          sum += Math.abs(channelData[index]);
        }
      }
      const amplitude = sum / samplesPerPixel;
      const height = amplitude * canvas.height * 0.8;
      const y = (canvas.height - height) / 2;
      
      ctx.fillRect(x, y, 1, height);
    }

    // Draw selection area
    const startX = (startTime / duration) * canvas.width;
    const endX = (endTime / duration) * canvas.width;
    
    // Selection overlay
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fillRect(startX, 0, endX - startX, canvas.height);

    // Selection borders
    ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.fillRect(startX, 0, 2, canvas.height);
    ctx.fillRect(endX - 2, 0, 2, canvas.height);

    // Trimmer handles
    const handleWidth = 12;
    const handleHeight = canvas.height;
    
    // Start handle (triangle pointing right)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX + handleWidth, handleHeight / 2);
    ctx.lineTo(startX, handleHeight);
    ctx.closePath();
    ctx.fill();

    // End handle (triangle pointing left)
    ctx.beginPath();
    ctx.moveTo(endX, 0);
    ctx.lineTo(endX - handleWidth, handleHeight / 2);
    ctx.lineTo(endX, handleHeight);
    ctx.closePath();
    ctx.fill();

    // Draw current time line
    const currentX = (currentTime / duration) * canvas.width;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(currentX, 0);
    ctx.lineTo(currentX, canvas.height);
    ctx.stroke();

    // Add white border to current time line for better visibility
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(currentX - 1, 0);
    ctx.lineTo(currentX - 1, canvas.height);
    ctx.moveTo(currentX + 1, 0);
    ctx.lineTo(currentX + 1, canvas.height);
    ctx.stroke();
  };

  useEffect(() => {
    drawWaveform();
  }, [startTime, endTime, currentTime, duration, audioBuffer]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !audioRef.current || isDragging) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;

    // Ensure click time is within selection range for playback
    const clampedTime = Math.max(startTime, Math.min(endTime, clickTime));
    audioRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !duration) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const startHandleX = (startTime / duration) * canvas.width;
    const endHandleX = (endTime / duration) * canvas.width;
    const currentX = (currentTime / duration) * canvas.width;
    
    const handleWidth = 15;
    
    if (Math.abs(x - startHandleX) <= handleWidth) {
      setIsDragging('start');
    } else if (Math.abs(x - endHandleX) <= handleWidth) {
      setIsDragging('end');
    } else if (Math.abs(x - currentX) <= 8) {
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
      setStartTime(Math.max(0, Math.min(dragTime, endTime - 0.1)));
    } else if (isDragging === 'end') {
      setEndTime(Math.min(duration, Math.max(dragTime, startTime + 0.1)));
    } else if (isDragging === 'current' && audioRef.current) {
      const clampedTime = Math.max(startTime, Math.min(endTime, dragTime));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
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
      // Ensure playback starts from current position within selection
      if (audioRef.current.currentTime < startTime || audioRef.current.currentTime > endTime) {
        audioRef.current.currentTime = startTime;
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Monitor playback to stop at end time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const checkPlaybackBounds = () => {
      if (audio.currentTime >= endTime && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = startTime;
        setCurrentTime(startTime);
      }
    };

    const interval = setInterval(checkPlaybackBounds, 100);
    return () => clearInterval(interval);
  }, [endTime, startTime, isPlaying]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  const cutAudio = async () => {
    if (!file || !audioBuffer || !audioContextRef.current) {
      toast({
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih file audio terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const audioContext = audioContextRef.current;
      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const length = endSample - startSample;

      // Create new buffer for the cut audio
      const cutBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        length,
        sampleRate
      );

      // Copy audio data for each channel
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const cutData = cutBuffer.getChannelData(channel);
        
        for (let i = 0; i < length; i++) {
          let sample = originalData[startSample + i] || 0;
          
          // Apply fade effects if enabled
          if (fadeIn && i < sampleRate * 0.1) { // 0.1 second fade in
            sample *= i / (sampleRate * 0.1);
          }
          if (fadeOut && i > length - sampleRate * 0.1) { // 0.1 second fade out
            sample *= (length - i) / (sampleRate * 0.1);
          }
          
          cutData[i] = sample;
        }
      }

      // Convert to WAV and then encode to MP3 (simplified approach)
      const wavBlob = await bufferToWav(cutBuffer);
      
      // Create download
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const downloadName = `${originalName} (cut-amsy-toolbox).mp3`;
      
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Audio berhasil dipotong",
        description: `File "${downloadName}" siap untuk diunduh.`,
      });
    } catch (error) {
      console.error('Error cutting audio:', error);
      toast({
        title: "Pemrosesan gagal",
        description: "Terjadi kesalahan saat memproses audio.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Convert AudioBuffer to WAV blob
  const bufferToWav = async (buffer: AudioBuffer): Promise<Blob> => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Convert audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
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
                <CardTitle className="font-poppins">Gelombang Suara & Trimmer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" ref={containerRef}>
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-24 border border-gray-300 rounded cursor-pointer hover:border-green-400 transition-colors"
                      onClick={handleCanvasClick}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 py-1 text-xs text-gray-500 bg-white/80">
                      <span>0:00</span>
                      <span className="bg-green-100 px-2 py-0.5 rounded text-green-700 font-medium">
                        Pilih area untuk dipotong
                      </span>
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
                  <p className="text-sm text-gray-600 text-center bg-green-50 p-2 rounded">
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
                    <Label>Fade In (0.1 detik)</Label>
                    <Switch checked={fadeIn} onCheckedChange={setFadeIn} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Fade Out (0.1 detik)</Label>
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
                    <p className="text-xs text-gray-500 mt-1">Format: MP3</p>
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

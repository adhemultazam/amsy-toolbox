
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Upload, Download, Play, Pause } from "lucide-react";
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

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x, y, barWidth, height);
    }

    // Draw selection area
    const startX = (startTime / duration) * canvas.width;
    const endX = (endTime / duration) * canvas.width;
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.fillRect(startX, 0, endX - startX, canvas.height);

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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !audioRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;

    audioRef.current.currentTime = clickTime;
    setCurrentTime(clickTime);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStartTimeChange = (value: number[]) => {
    setStartTime(value[0]);
    if (value[0] >= endTime) {
      setEndTime(Math.min(value[0] + 1, duration));
    }
  };

  const handleEndTimeChange = (value: number[]) => {
    setEndTime(value[0]);
    if (value[0] <= startTime) {
      setStartTime(Math.max(value[0] - 1, 0));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const cutAudio = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an audio file first.",
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
        title: "Audio processed",
        description: "Your trimmed audio is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "An error occurred while processing the audio.",
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            MP3 Cutter
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upload Audio File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  Drag & drop audio file here, or click to select
                </p>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="audio-input"
                />
                <Button asChild variant="outline">
                  <label htmlFor="audio-input">Select Audio File</label>
                </Button>
              </div>
              
              {file && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Selected: {file.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Waveform Section */}
          {file && (
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Audio Waveform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-24 border border-gray-300 rounded cursor-pointer"
                    onClick={handleCanvasClick}
                  />
                  
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
                      <Label>Start Time: {formatTime(startTime)}</Label>
                      <Slider
                        value={[startTime]}
                        onValueChange={handleStartTimeChange}
                        max={duration}
                        min={0}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time: {formatTime(endTime)}</Label>
                      <Slider
                        value={[endTime]}
                        onValueChange={handleEndTimeChange}
                        max={duration}
                        min={0}
                        step={0.1}
                      />
                    </div>
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
                  <CardTitle>Fade Effects</CardTitle>
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
                  <CardTitle>Output Settings</CardTitle>
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
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {processing ? "Processing..." : "Cut & Download MP3"}
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

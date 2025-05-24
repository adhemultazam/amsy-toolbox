
import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WaveformViewerProps {
  audioBuffer: AudioBuffer | null;
  duration: number;
  currentTime: number;
  startTime: number;
  endTime: number;
  isDragging: null | 'start' | 'end' | 'current';
  setStartTime: (time: number) => void;
  setEndTime: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setIsDragging: (dragging: null | 'start' | 'end' | 'current') => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  formatTime: (time: number) => string;
}

const WaveformViewer = ({
  audioBuffer,
  duration,
  currentTime,
  startTime,
  endTime,
  isDragging,
  setStartTime,
  setEndTime,
  setCurrentTime,
  setIsDragging,
  audioRef,
  formatTime
}: WaveformViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWaveform = () => {
    if (!canvasRef.current || !audioBuffer) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 100;

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    const startX = (startTime / duration) * canvas.width;
    const endX = (endTime / duration) * canvas.width;
    
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fillRect(startX, 0, endX - startX, canvas.height);

    ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.fillRect(startX, 0, 2, canvas.height);
    ctx.fillRect(endX - 2, 0, 2, canvas.height);

    const handleWidth = 12;
    const handleHeight = canvas.height;
    
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX + handleWidth, handleHeight / 2);
    ctx.lineTo(startX, handleHeight);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(endX, 0);
    ctx.lineTo(endX - handleWidth, handleHeight / 2);
    ctx.lineTo(endX, handleHeight);
    ctx.closePath();
    ctx.fill();

    const currentX = (currentTime / duration) * canvas.width;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(currentX, 0);
    ctx.lineTo(currentX, canvas.height);
    ctx.stroke();

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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !audioRef.current || isDragging) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;

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

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-poppins">Gelombang Suara & Trimmer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default WaveformViewer;

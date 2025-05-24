
import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Play, Pause } from "lucide-react";

interface AudioWaveformProps {
  currentTime: number;
  duration: number;
  startTime: number;
  endTime: number;
  isPlaying: boolean;
  estimatedSize: string;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: () => void;
  onCanvasMouseLeave: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDragging: "start" | "end" | "none";
  formatTime: (time: number) => string;
}

const AudioWaveform = ({
  currentTime,
  duration,
  startTime,
  endTime,
  isPlaying,
  estimatedSize,
  onStartTimeChange,
  onEndTimeChange,
  onPlayPause,
  onCanvasClick,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onCanvasMouseLeave,
  canvasRef,
  isDragging,
  formatTime
}: AudioWaveformProps) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading">Audio Waveform</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className="relative"
            style={{ cursor: isDragging !== "none" ? "ew-resize" : "pointer" }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-24 border border-gray-300 rounded cursor-pointer"
              onClick={onCanvasClick}
              onMouseDown={onCanvasMouseDown}
              onMouseMove={onCanvasMouseMove}
              onMouseUp={onCanvasMouseUp}
              onMouseLeave={onCanvasMouseLeave}
            />
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>0:00</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={onPlayPause} variant="outline" size="sm">
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
                    onStartTimeChange(value);
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
                    onEndTimeChange(value);
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
      </CardContent>
    </Card>
  );
};

export default AudioWaveform;

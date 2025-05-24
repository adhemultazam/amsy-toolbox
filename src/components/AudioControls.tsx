
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from "lucide-react";

interface AudioControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  startTime: number;
  endTime: number;
  onTogglePlayPause: () => void;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  formatTime: (time: number) => string;
}

const AudioControls = ({
  isPlaying,
  currentTime,
  duration,
  startTime,
  endTime,
  onTogglePlayPause,
  onStartTimeChange,
  onEndTimeChange,
  formatTime
}: AudioControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Button onClick={onTogglePlayPause} variant="outline" size="sm">
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
            onValueChange={(value) => onStartTimeChange(Math.min(value[0], endTime - 0.1))}
            max={duration}
            min={0}
            step={0.1}
          />
        </div>
        <div className="space-y-2">
          <Label>Waktu Akhir: {formatTime(endTime)}</Label>
          <Slider
            value={[endTime]}
            onValueChange={(value) => onEndTimeChange(Math.max(value[0], startTime + 0.1))}
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
  );
};

export default AudioControls;

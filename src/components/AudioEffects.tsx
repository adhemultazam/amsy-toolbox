
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface AudioEffectsProps {
  fadeIn: boolean;
  fadeOut: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
  onFadeInChange: (value: boolean) => void;
  onFadeOutChange: (value: boolean) => void;
  onFadeInDurationChange: (value: number) => void;
  onFadeOutDurationChange: (value: number) => void;
}

const AudioEffects = ({
  fadeIn,
  fadeOut,
  fadeInDuration,
  fadeOutDuration,
  onFadeInChange,
  onFadeOutChange,
  onFadeInDurationChange,
  onFadeOutDurationChange
}: AudioEffectsProps) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-poppins">Efek Fade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Fade In ({fadeInDuration.toFixed(1)} detik)</Label>
            <Switch checked={fadeIn} onCheckedChange={onFadeInChange} />
          </div>
          {fadeIn && (
            <div className="pt-2">
              <Slider
                value={[fadeInDuration]}
                min={0.1}
                max={2.0}
                step={0.1}
                onValueChange={(values) => onFadeInDurationChange(values[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1s</span>
                <span>2.0s</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Fade Out ({fadeOutDuration.toFixed(1)} detik)</Label>
            <Switch checked={fadeOut} onCheckedChange={onFadeOutChange} />
          </div>
          {fadeOut && (
            <div className="pt-2">
              <Slider
                value={[fadeOutDuration]}
                min={0.1}
                max={2.0}
                step={0.1}
                onValueChange={(values) => onFadeOutDurationChange(values[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1s</span>
                <span>2.0s</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioEffects;

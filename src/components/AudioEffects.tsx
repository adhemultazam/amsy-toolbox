
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AudioEffectsProps {
  fadeIn: boolean;
  fadeOut: boolean;
  onFadeInChange: (value: boolean) => void;
  onFadeOutChange: (value: boolean) => void;
}

const AudioEffects = ({ fadeIn, fadeOut, onFadeInChange, onFadeOutChange }: AudioEffectsProps) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-poppins">Efek Fade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Fade In (0.1 detik)</Label>
          <Switch checked={fadeIn} onCheckedChange={onFadeInChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Fade Out (0.1 detik)</Label>
          <Switch checked={fadeOut} onCheckedChange={onFadeOutChange} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioEffects;

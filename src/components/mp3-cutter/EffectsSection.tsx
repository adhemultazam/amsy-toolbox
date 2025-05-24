
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EffectsSectionProps {
  fadeIn: boolean;
  fadeOut: boolean;
  onFadeInChange: (checked: boolean) => void;
  onFadeOutChange: (checked: boolean) => void;
}

const EffectsSection = ({
  fadeIn,
  fadeOut,
  onFadeInChange,
  onFadeOutChange
}: EffectsSectionProps) => {
  return (
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
          <Switch checked={fadeIn} onCheckedChange={onFadeInChange} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Fade Out</Label>
            <p className="text-xs text-gray-500">Tambahkan efek fade out pada akhir audio</p>
          </div>
          <Switch checked={fadeOut} onCheckedChange={onFadeOutChange} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EffectsSection;

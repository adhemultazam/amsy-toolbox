
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OutputSettingsProps {
  bitrate: string;
  sampleRate: string;
  onBitrateChange: (value: string) => void;
  onSampleRateChange: (value: string) => void;
}

const OutputSettings = ({
  bitrate,
  sampleRate,
  onBitrateChange,
  onSampleRateChange
}: OutputSettingsProps) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading">Pengaturan Output</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Bitrate</Label>
          <Select value={bitrate} onValueChange={onBitrateChange}>
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
          <Select value={sampleRate} onValueChange={onSampleRateChange}>
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
  );
};

export default OutputSettings;

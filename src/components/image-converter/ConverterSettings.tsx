
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ConverterSettingsProps {
  outputFormat: string;
  quality: number[];
  stripMetadata: boolean;
  resizeEnabled: boolean;
  width: string;
  height: string;
  onOutputFormatChange: (value: string) => void;
  onQualityChange: (value: number[]) => void;
  onStripMetadataChange: (value: boolean) => void;
  onResizeEnabledChange: (value: boolean) => void;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onConvert: () => void;
  converting: boolean;
  hasFiles: boolean;
}

const ConverterSettings = ({
  outputFormat,
  quality,
  stripMetadata,
  resizeEnabled,
  width,
  height,
  onOutputFormatChange,
  onQualityChange,
  onStripMetadataChange,
  onResizeEnabledChange,
  onWidthChange,
  onHeightChange,
  onConvert,
  converting,
  hasFiles
}: ConverterSettingsProps) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading">Pengaturan Konversi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Output Format */}
        <div className="space-y-2">
          <Label>Format Keluaran</Label>
          <Select value={outputFormat} onValueChange={onOutputFormatChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="svg+xml">SVG</SelectItem>
              <SelectItem value="gif">GIF</SelectItem>
              <SelectItem value="bmp">BMP</SelectItem>
              <SelectItem value="tiff">TIFF</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            * Konversi format khusus seperti HEIC hanya untuk file keluaran
          </p>
        </div>

        {/* Quality */}
        <div className="space-y-2">
          <Label>Kualitas Gambar: {quality[0]}%</Label>
          <Slider
            value={quality}
            onValueChange={onQualityChange}
            max={100}
            min={1}
            step={1}
          />
        </div>

        {/* Strip Metadata */}
        <div className="flex items-center justify-between">
          <div>
            <Label>Hapus Metadata</Label>
            <p className="text-xs text-gray-500">Menghapus data EXIF dan komentar untuk mengurangi ukuran file</p>
          </div>
          <Switch
            checked={stripMetadata}
            onCheckedChange={onStripMetadataChange}
          />
        </div>

        {/* Resize Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Ubah Ukuran Gambar</Label>
              <p className="text-xs text-gray-500">Tetap kosong untuk mempertahankan ukuran asli</p>
            </div>
            <Switch
              checked={resizeEnabled}
              onCheckedChange={onResizeEnabledChange}
            />
          </div>
          
          {resizeEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lebar (px)</Label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => onWidthChange(e.target.value)}
                  placeholder="Lebar"
                />
              </div>
              <div className="space-y-2">
                <Label>Tinggi (px)</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => onHeightChange(e.target.value)}
                  placeholder="Tinggi"
                />
              </div>
            </div>
          )}
        </div>

        {/* Convert Button */}
        <Button
          onClick={onConvert}
          disabled={!hasFiles || converting}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 font-heading"
        >
          <Download className="w-4 h-4 mr-2" />
          {converting ? "Mengkonversi..." : "Konversi & Unduh"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConverterSettings;

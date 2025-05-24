
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Music, XCircle } from "lucide-react";

interface UploadSectionProps {
  file: File | null;
  duration: number;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  formatFileSize: (bytes: number) => string;
  formatTime: (time: number) => string;
}

const UploadSection = ({
  file,
  duration,
  onFileSelect,
  onReset,
  formatFileSize,
  formatTime
}: UploadSectionProps) => {
  if (!file) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-heading">Unggah File Audio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">
              Tarik & lepas file audio di sini, atau klik untuk memilih
            </p>
            <input
              type="file"
              accept="audio/*"
              onChange={onFileSelect}
              className="hidden"
              id="audio-input"
            />
            <Button asChild variant="outline">
              <label htmlFor="audio-input">Pilih File Audio</label>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Music className="text-green-500 w-6 h-6" />
        <div>
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-gray-500">
            {formatFileSize(file.size)} • {formatTime(duration)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="file"
          accept="audio/*"
          onChange={onFileSelect}
          className="hidden"
          id="audio-input-change"
        />
        <Button asChild variant="outline" size="sm">
          <label htmlFor="audio-input-change">Ganti Audio</label>
        </Button>
        <Button onClick={onReset} variant="ghost" size="sm">
          <XCircle className="w-4 h-4 mr-1" />
          Hapus
        </Button>
      </div>
    </div>
  );
};

export default UploadSection;

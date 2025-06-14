
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Music, Trash } from "lucide-react";

interface AudioUploadProps {
  file: File | null;
  duration: number;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  formatTime: (time: number) => string;
}

const AudioUpload = ({ file, duration, onFileSelect, onRemoveFile, formatTime }: AudioUploadProps) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-poppins">
          {file ? "File Audio" : "Unggah File Audio"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">
              Tarik & lepas file audio di sini, atau klik untuk memilih
            </p>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
              id="audio-input"
            />
            <Button asChild variant="outline">
              <label htmlFor="audio-input">Pilih File Audio</label>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Music className="w-5 h-5 text-green-600" />
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {formatTime(duration)}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onRemoveFile}>
              <Trash className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioUpload;

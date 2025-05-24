
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";
import { FileWithPreview } from "../../types/imageConverter";

interface UploadSectionProps {
  files: FileWithPreview[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

const UploadSection = ({ files, onAddFiles, onRemoveFile }: UploadSectionProps) => {
  const handleFilesDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic')
    );
    
    onAddFiles(droppedFiles);
  }, [onAddFiles]);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onAddFiles(selectedFiles);
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading">Unggah Gambar</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
          onDrop={handleFilesDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">
            Tarik & lepas gambar di sini, atau klik untuk memilih
          </p>
          <input
            type="file"
            multiple
            accept="image/*,.heic"
            onChange={handleFilesSelect}
            className="hidden"
            id="file-input"
          />
          <Button asChild variant="outline">
            <label htmlFor="file-input">Pilih Gambar</label>
          </Button>
        </div>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-gray-700">File yang Dipilih:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative border rounded-md overflow-hidden bg-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 z-10 p-1 h-auto bg-white/80 hover:bg-white rounded-full"
                    onClick={() => onRemoveFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                    {file.preview ? (
                      <img 
                        src={file.preview} 
                        alt={file.name} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Image className="w-12 h-12 mb-2 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {file.name.toLowerCase().endsWith('.heic') ? 'HEIC Preview Tidak Tersedia' : 'Preview Tidak Tersedia'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        Ukuran asli: {file.originalSize}
                      </p>
                      {file.convertedSize && (
                        <p className="text-xs text-green-500">
                          Setelah konversi: {file.convertedSize}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadSection;

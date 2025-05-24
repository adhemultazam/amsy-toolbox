
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Upload, Download, X, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface FileWithPreview extends File {
  preview?: string;
  originalSize?: string;
  convertedSize?: string;
}

const ImageConverter = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [quality, setQuality] = useState([90]);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    // Clean up previews when component unmounts
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const handleFilesDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic')
    );
    
    addFilesWithPreview(droppedFiles);
  }, []);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFilesWithPreview(selectedFiles);
  };

  const addFilesWithPreview = (newFiles: File[]) => {
    const filesWithPreview = newFiles.map(file => {
      const fileWithPreview = file as FileWithPreview;
      
      // For regular images
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      // For HEIC files, we'll display a placeholder
      else if (file.name.toLowerCase().endsWith('.heic')) {
        // Use a placeholder image for HEIC files
        fileWithPreview.preview = undefined;
      }
      
      fileWithPreview.originalSize = formatFileSize(file.size);
      return fileWithPreview;
    });
    
    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const convertImages = async () => {
    if (files.length === 0) {
      toast({
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih setidaknya satu file gambar.",
        variant: "destructive",
      });
      return;
    }

    setConverting(true);
    
    try {
      const updatedFiles = [...files];
      
      for (let i = 0; i < files.length; i++) {
        const convertedBlob = await convertSingleImage(files[i]);
        if (convertedBlob) {
          // Update file with estimated converted size
          updatedFiles[i].convertedSize = formatFileSize(convertedBlob.size);
          
          // Download
          const url = URL.createObjectURL(convertedBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${files[i].name.split('.')[0]}_converted.${outputFormat}`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
      
      setFiles(updatedFiles);
      
      toast({
        title: "Konversi selesai",
        description: `Berhasil mengkonversi ${files.length} gambar.`,
      });
    } catch (error) {
      toast({
        title: "Konversi gagal",
        description: "Terjadi kesalahan selama proses konversi.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setConverting(false);
    }
  };

  const convertSingleImage = (file: File): Promise<Blob | null> => {
    return new Promise((resolve) => {
      // If it's a HEIC file, we need special handling (in a real app you'd use a library)
      if (file.name.toLowerCase().endsWith('.heic')) {
        // Simplified HEIC handling (in a real app you'd use heic2any or similar)
        // Just creating a mock blob for demonstration
        setTimeout(() => {
          const mockBlob = new Blob([file], { type: 'image/jpeg' });
          resolve(mockBlob);
        }, 500);
        return;
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        let newWidth = img.width;
        let newHeight = img.height;
        
        if (resizeEnabled && width && height) {
          newWidth = parseInt(width);
          newHeight = parseInt(height);
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(null);
          }
        }, `image/${outputFormat}`, quality[0] / 100);
      };
      
      img.onerror = () => {
        resolve(null);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold font-heading bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Konverter Gambar
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
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
                          onClick={() => removeFile(index)}
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

          {/* Settings Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading">Pengaturan Konversi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Output Format */}
              <div className="space-y-2">
                <Label>Format Keluaran</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
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
                  onValueChange={setQuality}
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
                  onCheckedChange={setStripMetadata}
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
                    onCheckedChange={setResizeEnabled}
                  />
                </div>
                
                {resizeEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Lebar (px)</Label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Lebar"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tinggi (px)</Label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Tinggi"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Convert Button */}
              <Button
                onClick={convertImages}
                disabled={files.length === 0 || converting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 font-heading"
              >
                <Download className="w-4 h-4 mr-2" />
                {converting ? "Mengkonversi..." : "Konversi & Unduh"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;

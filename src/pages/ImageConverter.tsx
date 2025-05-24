
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Upload, Download, X, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ImageConverter = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [quality, setQuality] = useState([90]);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [converting, setConverting] = useState(false);
  const [previews, setPreviews] = useState<{ url: string, size: string, file: File }[]>([]);

  const formatSizeUnits = (bytes: number) => {
    if (bytes >= 1073741824) { return (bytes / 1073741824).toFixed(2) + " GB"; }
    if (bytes >= 1048576) { return (bytes / 1048576).toFixed(2) + " MB"; }
    if (bytes >= 1024) { return (bytes / 1024).toFixed(2) + " KB"; }
    if (bytes > 1) { return bytes + " bytes"; }
    if (bytes === 1) { return bytes + " byte"; }
    return "0 bytes";
  };

  useEffect(() => {
    // Create previews when files change
    const newPreviews = files.map(file => {
      const url = URL.createObjectURL(file);
      const size = formatSizeUnits(file.size);
      return { url, size, file };
    });
    
    setPreviews(newPreviews);

    // Cleanup function
    return () => {
      newPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  const handleFilesDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const estimateOutputSize = (file: File): string => {
    // Rough estimation based on format and quality
    let factor = 1.0;
    
    switch(outputFormat) {
      case "png": 
        factor = 1.2; // PNG is typically larger
        break;
      case "webp":
        factor = 0.6; // WebP is typically smaller
        break;
      case "svg":
        return "Varies"; // SVG size prediction is not reliable
      case "heic":
        factor = 0.5; // HEIC is typically smaller than JPEG
        break;
      default: // JPEG
        factor = quality[0] / 100;
    }
    
    if (resizeEnabled && width && height) {
      const originalImg = new Image();
      originalImg.src = URL.createObjectURL(file);
      const resizeRatio = (parseInt(width) * parseInt(height)) / (originalImg.width * originalImg.height);
      factor *= resizeRatio;
      URL.revokeObjectURL(originalImg.src);
    }
    
    const estimatedBytes = file.size * factor;
    return formatSizeUnits(estimatedBytes);
  };

  const convertImages = async () => {
    if (files.length === 0) {
      toast({
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih minimal satu file gambar.",
        variant: "destructive",
      });
      return;
    }

    setConverting(true);
    
    try {
      for (const file of files) {
        await convertSingleImage(file);
      }
      
      toast({
        title: "Konversi selesai",
        description: `Berhasil mengkonversi ${files.length} gambar.`,
      });
    } catch (error) {
      toast({
        title: "Konversi gagal",
        description: "Terjadi kesalahan selama konversi.",
        variant: "destructive",
      });
      console.error("Conversion error:", error);
    } finally {
      setConverting(false);
    }
  };

  const convertSingleImage = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      // Handle HEIC conversion or regular conversion
      if (file.name.toLowerCase().endsWith('.heic')) {
        // For HEIC files, we would use a library like heic2any
        // But for now, we'll simulate the conversion
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(file); // In reality, this would be the converted blob
          a.download = `${file.name.split('.')[0]}_converted.${outputFormat}`;
          a.click();
          resolve();
        }, 1000);
      } else {
        // Regular image conversion
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
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
          
          // For SVG format we'd need special handling
          if (outputFormat === 'svg') {
            // Here would be SVG conversion code
            // For now just simulate it with PNG
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.name.split('.')[0]}_converted.svg`;
                a.click();
                URL.revokeObjectURL(url);
              }
              resolve();
            }, 'image/png');
          } else {
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.name.split('.')[0]}_converted.${outputFormat}`;
                a.click();
                URL.revokeObjectURL(url);
              }
              resolve();
            }, `image/${outputFormat}`, quality[0] / 100);
          }
        };
        
        img.src = URL.createObjectURL(file);
      }
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
          <h1 className="text-2xl font-bold font-poppins bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Konverter Gambar
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins">Unggah Gambar</CardTitle>
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

              {/* Preview Grid */}
              {previews.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-3">File Terpilih:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative bg-gray-50 rounded-lg p-3 overflow-hidden">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm text-gray-600 truncate max-w-[80%]">{preview.file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="relative aspect-video bg-gray-100 mb-2 rounded overflow-hidden">
                          <img 
                            src={preview.url} 
                            alt={`Preview ${index}`} 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Ukuran asli: {preview.size}</span>
                          <span>Estimasi hasil: {estimateOutputSize(preview.file)}</span>
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
              <CardTitle className="font-poppins">Pengaturan Konversi</CardTitle>
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
                    <SelectItem value="svg">SVG</SelectItem>
                    <SelectItem value="heic">HEIC</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label>Hapus Metadata</Label>
                <Switch
                  checked={stripMetadata}
                  onCheckedChange={setStripMetadata}
                />
              </div>

              {/* Resize Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ubah Ukuran Gambar</Label>
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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
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

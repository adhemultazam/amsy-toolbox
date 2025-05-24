
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Upload, Download, X } from "lucide-react";
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

  const handleFilesDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertImages = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image file.",
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
        title: "Conversion completed",
        description: `Successfully converted ${files.length} image(s).`,
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "An error occurred during conversion.",
        variant: "destructive",
      });
    } finally {
      setConverting(false);
    }
  };

  const convertSingleImage = (file: File): Promise<void> => {
    return new Promise((resolve) => {
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Image Converter
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                onDrop={handleFilesDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  Drag & drop images here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilesSelect}
                  className="hidden"
                  id="file-input"
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-input">Select Images</label>
                </Button>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-medium text-gray-700">Selected Files:</h3>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600 truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Conversion Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Output Format */}
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <Label>Image Quality: {quality[0]}%</Label>
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
                <Label>Strip Metadata</Label>
                <Switch
                  checked={stripMetadata}
                  onCheckedChange={setStripMetadata}
                />
              </div>

              {/* Resize Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Resize Image</Label>
                  <Switch
                    checked={resizeEnabled}
                    onCheckedChange={setResizeEnabled}
                  />
                </div>
                
                {resizeEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Width (px)</Label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Width"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Height"
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
                {converting ? "Converting..." : "Convert & Download"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;

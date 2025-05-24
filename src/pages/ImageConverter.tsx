
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import UploadSection from "@/components/image-converter/UploadSection";
import ConverterSettings from "@/components/image-converter/ConverterSettings";
import { useImageConverter } from "@/hooks/useImageConverter";

const ImageConverter = () => {
  const {
    files,
    outputFormat,
    quality,
    stripMetadata,
    resizeEnabled,
    width,
    height,
    converting,
    setOutputFormat,
    setQuality,
    setStripMetadata,
    setResizeEnabled,
    setWidth,
    setHeight,
    addFilesWithPreview,
    removeFile,
    convertImages,
  } = useImageConverter();

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
          <UploadSection 
            files={files}
            onAddFiles={addFilesWithPreview}
            onRemoveFile={removeFile}
          />

          {/* Settings Section */}
          <ConverterSettings
            outputFormat={outputFormat}
            quality={quality}
            stripMetadata={stripMetadata}
            resizeEnabled={resizeEnabled}
            width={width}
            height={height}
            onOutputFormatChange={setOutputFormat}
            onQualityChange={setQuality}
            onStripMetadataChange={setStripMetadata}
            onResizeEnabledChange={setResizeEnabled}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
            onConvert={convertImages}
            converting={converting}
            hasFiles={files.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;

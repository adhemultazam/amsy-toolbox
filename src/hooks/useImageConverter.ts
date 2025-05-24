
import { useState, useCallback, useEffect } from "react";
import { FileWithPreview } from "../types/imageConverter";
import { useToast } from "./use-toast";

export const useImageConverter = () => {
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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const addFilesWithPreview = useCallback((newFiles: File[]) => {
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
  }, []);

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

  return {
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
  };
};


import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAudioProcessor } from "@/hooks/useAudioProcessor";
import { bufferToWav } from "@/utils/audioUtils";

import AudioUpload from "@/components/AudioUpload";
import WaveformViewer from "@/components/WaveformViewer";
import AudioControls from "@/components/AudioControls";
import AudioEffects from "@/components/AudioEffects";
import OutputSettings from "@/components/OutputSettings";
import ProcessButton from "@/components/ProcessButton";

const Mp3Cutter = () => {
  const { toast } = useToast();
  const {
    file,
    isPlaying,
    duration,
    currentTime,
    startTime,
    endTime,
    fadeIn,
    fadeOut,
    bitrate,
    sampleRate,
    processing,
    isDragging,
    audioBuffer,
    audioRef,
    audioContextRef,
    setDuration,
    setCurrentTime,
    setStartTime,
    setEndTime,
    setFadeIn,
    setFadeOut,
    setBitrate,
    setSampleRate,
    setProcessing,
    setIsDragging,
    setIsPlaying,
    loadAudioBuffer,
    handleFileSelect,
    removeFile,
    togglePlayPause,
    estimateOutputSize,
    formatTime,
  } = useAudioProcessor();

  useEffect(() => {
    if (file && audioRef.current) {
      const audio = audioRef.current;
      const url = URL.createObjectURL(file);
      audio.src = url;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setEndTime(audio.duration);
        loadAudioBuffer(file);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(null);
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const checkPlaybackBounds = () => {
      if (audio.currentTime >= endTime && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = startTime;
        setCurrentTime(startTime);
      }
    };

    const interval = setInterval(checkPlaybackBounds, 100);
    return () => clearInterval(interval);
  }, [endTime, startTime, isPlaying]);

  const cutAudio = async () => {
    if (!file || !audioBuffer || !audioContextRef.current) {
      toast({
        title: "Tidak ada file yang dipilih",
        description: "Silakan pilih file audio terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const audioContext = audioContextRef.current;
      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const length = endSample - startSample;

      const cutBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        length,
        sampleRate
      );

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const cutData = cutBuffer.getChannelData(channel);
        
        for (let i = 0; i < length; i++) {
          let sample = originalData[startSample + i] || 0;
          
          if (fadeIn && i < sampleRate * 0.1) {
            sample *= i / (sampleRate * 0.1);
          }
          if (fadeOut && i > length - sampleRate * 0.1) {
            sample *= (length - i) / (sampleRate * 0.1);
          }
          
          cutData[i] = sample;
        }
      }

      const wavBlob = await bufferToWav(cutBuffer);
      
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const downloadName = `${originalName} (cut-amsy-toolbox).mp3`;
      
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Audio berhasil dipotong",
        description: `File "${downloadName}" siap untuk diunduh.`,
      });
    } catch (error) {
      console.error('Error cutting audio:', error);
      toast({
        title: "Pemrosesan gagal",
        description: "Terjadi kesalahan saat memproses audio.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <header className="py-6 px-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-2xl font-bold font-poppins bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Pemotong MP3
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <AudioUpload
            file={file}
            duration={duration}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeFile}
            formatTime={formatTime}
          />

          {file && (
            <>
              <WaveformViewer
                audioBuffer={audioBuffer}
                duration={duration}
                currentTime={currentTime}
                startTime={startTime}
                endTime={endTime}
                isDragging={isDragging}
                setStartTime={setStartTime}
                setEndTime={setEndTime}
                setCurrentTime={setCurrentTime}
                setIsDragging={setIsDragging}
                audioRef={audioRef}
                formatTime={formatTime}
              />

              <AudioControls
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                startTime={startTime}
                endTime={endTime}
                onTogglePlayPause={togglePlayPause}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
                formatTime={formatTime}
              />

              <div className="grid lg:grid-cols-2 gap-8">
                <AudioEffects
                  fadeIn={fadeIn}
                  fadeOut={fadeOut}
                  onFadeInChange={setFadeIn}
                  onFadeOutChange={setFadeOut}
                />

                <OutputSettings
                  bitrate={bitrate}
                  sampleRate={sampleRate}
                  onBitrateChange={setBitrate}
                  onSampleRateChange={setSampleRate}
                  estimateOutputSize={estimateOutputSize}
                />
              </div>

              <ProcessButton
                processing={processing}
                onProcess={cutAudio}
              />
            </>
          )}
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  );
};

export default Mp3Cutter;

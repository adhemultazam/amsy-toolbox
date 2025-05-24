
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import UploadSection from "@/components/mp3-cutter/UploadSection";
import AudioWaveform from "@/components/mp3-cutter/AudioWaveform";
import EffectsSection from "@/components/mp3-cutter/EffectsSection";
import OutputSettings from "@/components/mp3-cutter/OutputSettings";
import { useAudioCutter } from "@/hooks/useAudioCutter";

const Mp3Cutter = () => {
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
    estimatedSize,
    audioRef,
    canvasRef,
    setStartTime,
    setEndTime,
    setFadeIn,
    setFadeOut,
    setBitrate,
    setSampleRate,
    formatFileSize,
    formatTime,
    handleFileSelect,
    resetFile,
    togglePlayPause,
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasMouseLeave,
    cutAudio
  } = useAudioCutter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold font-heading bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Pemotong MP3
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <UploadSection
            file={file}
            duration={duration}
            onFileSelect={handleFileSelect}
            onReset={resetFile}
            formatFileSize={formatFileSize}
            formatTime={formatTime}
          />

          {/* Waveform Section */}
          {file && (
            <AudioWaveform
              currentTime={currentTime}
              duration={duration}
              startTime={startTime}
              endTime={endTime}
              isPlaying={isPlaying}
              estimatedSize={estimatedSize}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              onPlayPause={togglePlayPause}
              onCanvasClick={handleCanvasClick}
              onCanvasMouseDown={handleCanvasMouseDown}
              onCanvasMouseMove={handleCanvasMouseMove}
              onCanvasMouseUp={handleCanvasMouseUp}
              onCanvasMouseLeave={handleCanvasMouseLeave}
              canvasRef={canvasRef}
              isDragging={isDragging}
              formatTime={formatTime}
            />
          )}

          {/* Settings Sections */}
          {file && (
            <div className="grid lg:grid-cols-2 gap-8">
              <EffectsSection
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
              />
            </div>
          )}

          {/* Process Button */}
          {file && (
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Button
                  onClick={cutAudio}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 font-heading"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {processing ? "Memproses..." : "Potong & Unduh MP3"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default Mp3Cutter;

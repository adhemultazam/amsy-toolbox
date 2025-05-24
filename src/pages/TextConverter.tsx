
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import InputSection from "@/components/text-converter/InputSection";
import OutputSection from "@/components/text-converter/OutputSection";
import ConverterOptions from "@/components/text-converter/ConverterOptions";
import { useTextConverter } from "@/hooks/useTextConverter";

const TextConverter = () => {
  const {
    inputText,
    setInputText,
    outputText,
    activeConverter,
    converters,
    handleConvert,
    copyToClipboard,
    clearText
  } = useTextConverter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="py-6 px-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold font-heading bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Konverter Format Teks
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <InputSection
            inputText={inputText}
            onInputChange={setInputText}
            onClear={clearText}
          />

          {/* Output Section */}
          <OutputSection 
            outputText={outputText}
            onCopy={copyToClipboard}
          />
        </div>

        {/* Conversion Options */}
        <ConverterOptions
          converters={converters}
          inputText={inputText}
          activeConverter={activeConverter}
          onConvert={handleConvert}
        />

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Pilih jenis konversi di atas untuk mengubah teks Anda secara instan
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleConvert(activeConverter)}
              disabled={!inputText}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 font-heading"
            >
              Konversi Teks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextConverter;

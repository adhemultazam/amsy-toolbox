
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, ToggleLeft, Scissors, AlignLeft, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const TextConverter = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeConverter, setActiveConverter] = useState("uppercase");

  const converters = [
    {
      id: "uppercase",
      name: "HURUF BESAR",
      description: "Mengubah ke HURUF BESAR",
      convert: (text: string) => text.toUpperCase(),
      gradient: "from-red-500 to-pink-600",
      icon: ArrowUpDown
    },
    {
      id: "lowercase",
      name: "huruf kecil",
      description: "mengubah ke huruf kecil",
      convert: (text: string) => text.toLowerCase(),
      gradient: "from-blue-500 to-cyan-600",
      icon: ArrowUpDown
    },
    {
      id: "titlecase",
      name: "Huruf Awal Kapital",
      description: "Mengubah Ke Huruf Awal Kapital",
      convert: (text: string) => text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      gradient: "from-purple-500 to-indigo-600",
      icon: ArrowUpDown
    },
    {
      id: "sentencecase",
      name: "Kalimat biasa",
      description: "Mengubah ke kalimat biasa",
      convert: (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      gradient: "from-green-500 to-emerald-600",
      icon: AlignLeft
    },
    {
      id: "togglecase",
      name: "ToGgLe CaSe",
      description: "BeRgAnTiAn HuRuF bEsAr DaN kEcIl",
      convert: (text: string) => {
        return text.split('').map((char, index) => 
          index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
        ).join('');
      },
      gradient: "from-orange-500 to-yellow-600",
      icon: ToggleLeft
    },
    {
      id: "trimtext",
      name: "Potong Spasi",
      description: "Menghilangkan spasi berlebih",
      convert: (text: string) => {
        return text.replace(/\s+/g, ' ').trim();
      },
      gradient: "from-teal-500 to-cyan-600",
      icon: Scissors
    },
    {
      id: "removelinebreaks",
      name: "Hapus Baris",
      description: "Menghilangkan semua jeda baris",
      convert: (text: string) => {
        return text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
      },
      gradient: "from-gray-500 to-slate-600",
      icon: AlignLeft
    },
  ];

  const handleConvert = (converterId: string) => {
    const converter = converters.find(c => c.id === converterId);
    if (converter && inputText) {
      const result = converter.convert(inputText);
      setOutputText(result);
      setActiveConverter(converterId);
    }
  };

  const copyToClipboard = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      toast({
        title: "Tersalin!",
        description: "Teks berhasil disalin ke clipboard.",
      });
    }
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

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
          <h1 className="text-2xl font-bold font-poppins bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Konverter Format Teks
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins">Masukkan Teks</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ketik atau tempel teks Anda di sini..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {inputText.length} karakter
                </span>
                <Button onClick={clearText} variant="outline" size="sm">
                  Bersihkan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins">Hasil Konversi</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Hasil konversi akan muncul di sini..."
                value={outputText}
                readOnly
                className="min-h-[200px] resize-none bg-gray-50"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {outputText.length} karakter
                </span>
                <Button
                  onClick={copyToClipboard}
                  disabled={!outputText}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Salin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Options */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="font-poppins">Opsi Konversi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {converters.map((converter) => {
                const IconComponent = converter.icon;
                return (
                  <Button
                    key={converter.id}
                    onClick={() => handleConvert(converter.id)}
                    disabled={!inputText}
                    variant={activeConverter === converter.id ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-start gap-2 ${
                      activeConverter === converter.id
                        ? `bg-gradient-to-r ${converter.gradient} text-white hover:opacity-90`
                        : 'hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium text-sm">{converter.name}</span>
                    </div>
                    <span className="text-xs opacity-80 text-left leading-tight">
                      {converter.description}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Pilih jenis konversi di atas untuk mengubah teks Anda secara instan
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => handleConvert(activeConverter)}
              disabled={!inputText}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
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

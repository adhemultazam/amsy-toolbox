
import { useState } from "react";
import { ConverterType } from "../types/textConverter";
import { ArrowUp, ArrowDown, Type, RefreshCw, Scissors, Delete } from "lucide-react";
import { useToast } from "./use-toast";

export const useTextConverter = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeConverter, setActiveConverter] = useState("uppercase");

  const converters: ConverterType[] = [
    {
      id: "uppercase",
      name: "HURUF BESAR",
      description: "Ubah ke SEMUA KAPITAL",
      convert: (text: string) => text.toUpperCase(),
      gradient: "from-red-500 to-pink-600",
      icon: ArrowUp
    },
    {
      id: "lowercase",
      name: "huruf kecil",
      description: "ubah ke semua huruf kecil",
      convert: (text: string) => text.toLowerCase(),
      gradient: "from-blue-500 to-cyan-600",
      icon: ArrowDown
    },
    {
      id: "titlecase",
      name: "Huruf Judul",
      description: "Ubah Ke Huruf Judul",
      convert: (text: string) => text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      gradient: "from-purple-500 to-indigo-600",
      icon: Type
    },
    {
      id: "sentencecase",
      name: "Kalimat biasa",
      description: "Huruf besar awal kalimat",
      convert: (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      gradient: "from-green-500 to-emerald-600",
      icon: Type
    },
    {
      id: "togglecase",
      name: "ToGgLe CaSe",
      description: "BerGanTiaN bEsAr kEcIl",
      convert: (text: string) => {
        return text.split('').map((char, idx) => 
          idx % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
        ).join('');
      },
      gradient: "from-orange-500 to-yellow-600",
      icon: RefreshCw
    },
    {
      id: "trim",
      name: "Pangkas Spasi",
      description: "Hapus spasi di awal & akhir",
      convert: (text: string) => text.trim(),
      gradient: "from-teal-500 to-cyan-600",
      icon: Scissors
    },
    {
      id: "remove-line-breaks",
      name: "Hapus Baris Baru",
      description: "Menghapus semua pemisah baris",
      convert: (text: string) => text.replace(/(\r\n|\n|\r)/gm, " "),
      gradient: "from-gray-500 to-slate-600",
      icon: Delete
    },
    {
      id: "sentencecase-standard",
      name: "Kalimat standar",
      description: "Huruf besar setelah titik",
      convert: (text: string) => {
        return text.replace(/(^\s*|\.\s+)([a-z])/gm, function(match, p1, p2) {
          return p1 + p2.toUpperCase();
        });
      },
      gradient: "from-violet-500 to-purple-600",
      icon: Type
    }
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
        title: "Disalin!",
        description: "Teks berhasil disalin ke clipboard.",
      });
    }
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

  return {
    inputText,
    setInputText,
    outputText,
    activeConverter,
    converters,
    handleConvert,
    copyToClipboard,
    clearText
  };
};

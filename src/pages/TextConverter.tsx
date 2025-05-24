
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy } from "lucide-react";
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
      name: "UPPERCASE",
      description: "Convert to ALL CAPS",
      convert: (text: string) => text.toUpperCase(),
      gradient: "from-red-500 to-pink-600"
    },
    {
      id: "lowercase",
      name: "lowercase",
      description: "convert to all small letters",
      convert: (text: string) => text.toLowerCase(),
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      id: "titlecase",
      name: "Title Case",
      description: "Convert To Title Case",
      convert: (text: string) => text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      id: "sentencecase",
      name: "Sentence case",
      description: "Convert to sentence case",
      convert: (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: "camelcase",
      name: "camelCase",
      description: "convertToCamelCase",
      convert: (text: string) => {
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, '');
      },
      gradient: "from-orange-500 to-yellow-600"
    },
    {
      id: "pascalcase",
      name: "PascalCase",
      description: "ConvertToPascalCase",
      convert: (text: string) => {
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '');
      },
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      id: "snakecase",
      name: "snake_case",
      description: "convert_to_snake_case",
      convert: (text: string) => {
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
      },
      gradient: "from-gray-500 to-slate-600"
    },
    {
      id: "kebabcase",
      name: "kebab-case",
      description: "convert-to-kebab-case",
      convert: (text: string) => {
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-');
      },
      gradient: "from-violet-500 to-purple-600"
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
        title: "Copied!",
        description: "Text copied to clipboard successfully.",
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Text Case Converter
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type or paste your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {inputText.length} characters
                </span>
                <Button onClick={clearText} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Output Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Converted text will appear here..."
                value={outputText}
                readOnly
                className="min-h-[200px] resize-none bg-gray-50"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {outputText.length} characters
                </span>
                <Button
                  onClick={copyToClipboard}
                  disabled={!outputText}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Options */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle>Conversion Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {converters.map((converter) => (
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
                  <span className="font-medium text-sm">{converter.name}</span>
                  <span className="text-xs opacity-80 text-left leading-tight">
                    {converter.description}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Select a conversion type above to transform your text instantly
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => handleConvert(activeConverter)}
              disabled={!inputText}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
            >
              Convert Text
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextConverter;

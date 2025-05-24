
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, AudioLinesIcon, TypeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const tools = [
    {
      id: "image-converter",
      title: "Image Converter",
      description: "Convert images to different formats with quality control and resizing options",
      icon: ImageIcon,
      gradient: "from-blue-500 to-purple-600",
      path: "/image-converter"
    },
    {
      id: "mp3-cutter",
      title: "MP3 Cutter",
      description: "Trim and edit audio files with visual waveform and fade effects",
      icon: AudioLinesIcon,
      gradient: "from-green-500 to-teal-600",
      path: "/mp3-cutter"
    },
    {
      id: "text-converter",
      title: "Text Case Converter",
      description: "Transform text between different cases like uppercase, lowercase, and more",
      icon: TypeIcon,
      gradient: "from-orange-500 to-red-600",
      path: "/text-converter"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AMSY TOOLS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Koleksi tools online yang powerful dan mudah digunakan untuk kebutuhan konversi dan editing Anda
          </p>
        </div>
      </header>

      {/* Tools Grid */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link key={tool.id} to={tool.path} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                      <Button className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 transition-opacity border-0 text-white font-medium`}>
                        Mulai Gunakan
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            © 2024 AMSY TOOLS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

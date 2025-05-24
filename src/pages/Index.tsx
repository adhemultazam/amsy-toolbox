
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, AudioLinesIcon, TypeIcon, FileTextIcon, CalendarIcon, BarChart3Icon } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const tools = [
    {
      id: "image-converter",
      title: "Konverter Gambar",
      description: "Konversi gambar ke berbagai format dengan pengaturan kualitas dan ukuran",
      icon: ImageIcon,
      gradient: "from-blue-500 to-purple-600",
      path: "/image-converter"
    },
    {
      id: "mp3-cutter",
      title: "Pemotong MP3",
      description: "Potong dan edit file audio dengan tampilan gelombang suara dan efek fade",
      icon: AudioLinesIcon,
      gradient: "from-green-500 to-teal-600",
      path: "/mp3-cutter"
    },
    {
      id: "text-converter",
      title: "Konverter Teks",
      description: "Ubah format teks antara huruf besar, huruf kecil, dan berbagai format lainnya",
      icon: TypeIcon,
      gradient: "from-orange-500 to-red-600",
      path: "/text-converter"
    },
    {
      id: "pdf-tools",
      title: "Alat PDF",
      description: "Segera Hadir - Gabungkan, kompres, dan edit file PDF dengan mudah",
      icon: FileTextIcon,
      gradient: "from-red-500 to-pink-600",
      path: "#",
      comingSoon: true
    },
    {
      id: "calendar-tools",
      title: "Konverter Kalender",
      description: "Segera Hadir - Konversi tanggal antara berbagai sistem kalender",
      icon: CalendarIcon,
      gradient: "from-indigo-500 to-blue-600",
      path: "#",
      comingSoon: true
    },
    {
      id: "data-visualizer",
      title: "Visualisasi Data",
      description: "Segera Hadir - Buat grafik dan visualisasi dari data CSV atau Excel",
      icon: BarChart3Icon,
      gradient: "from-purple-500 to-violet-600",
      path: "#",
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AMSY TOOLS
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Koleksi alat online yang praktis dan mudah digunakan untuk kebutuhan konversi dan editing Anda
          </p>
        </div>
      </header>

      {/* Tools Grid */}
      <section className="px-4 pb-12 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link 
                  key={tool.id} 
                  to={tool.path} 
                  className={`group ${tool.comingSoon ? 'pointer-events-none' : ''}`}
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-800 font-heading">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                      <Button 
                        className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 transition-opacity border-0 text-white font-medium`}
                        disabled={tool.comingSoon}
                      >
                        {tool.comingSoon ? 'Segera Hadir' : 'Mulai Gunakan'}
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

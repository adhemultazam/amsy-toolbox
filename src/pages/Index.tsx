
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, AudioLinesIcon, TypeIcon, CalendarIcon, FileTextIcon, BarChartIcon, FileIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const tools = [
    {
      id: "image-converter",
      title: "Konverter Gambar",
      description: "Konversi gambar ke berbagai format dengan kontrol kualitas dan opsi pengubahan ukuran",
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
      title: "Konverter Format Teks",
      description: "Ubah teks ke berbagai format seperti huruf besar, huruf kecil, dan lainnya",
      icon: TypeIcon,
      gradient: "from-orange-500 to-red-600",
      path: "/text-converter"
    },
    {
      id: "pdf-tools",
      title: "Coming Soon",
      description: "Segera Hadir - Kompres, gabungkan, dan pisahkan file PDF dengan mudah",
      icon: CalendarIcon,
      gradient: "from-red-500 to-pink-600",
      path: "#",
      comingSoon: true
    },
    {
      id: "calendar-maker",
      title: "Coming Soon",
      description: "Segera Hadir - Buat kalender kustom yang dapat dicetak dengan berbagai desain",
      icon: CalendarIcon,
      gradient: "from-indigo-500 to-blue-600",
      path: "#",
      comingSoon: true
    },
    {
      id: "markdown-editor",
      title: "Coming Soon",
      description: "Segera Hadir - Edit dan pratinjau dokumen markdown dengan antarmuka yang intuitif",
      icon: CalendarIcon,
      gradient: "from-purple-500 to-indigo-600",
      path: "#",
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Single Full Screen Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header Content */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              AMSY TOOLBOX
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-sans">
              Koleksi alat online yang powerful dan mudah digunakan untuk kebutuhan konversi dan pengeditan Anda
            </p>
          </div>

          {/* Tools Grid */}
          <div>
            <h2 className="text-2xl md:text-3xl font-poppins font-semibold text-center mb-12">Alat yang Tersedia</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Link key={tool.id} to={tool.path} className={`group ${tool.comingSoon ? "pointer-events-none" : ""}`}>
                    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-800 font-poppins">
                          {tool.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                          {tool.description}
                        </CardDescription>
                        <Button className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 transition-opacity border-0 text-white font-medium`}>
                          {tool.comingSoon ? "Segera Hadir" : "Mulai Gunakan"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 font-sans">
            © 2024 AMSY TOOLBOX. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

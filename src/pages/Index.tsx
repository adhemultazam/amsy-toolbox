
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, AudioLinesIcon, TypeIcon, CalendarIcon, FileTextIcon } from "lucide-react";
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
      id: "veo-prompt-generator",
      title: "Veo 3 Prompt Generator",
      description: "Buat prompt konsisten untuk Google Veo 3 dengan struktur yang tepat.",
      icon: FileTextIcon,
      gradient: "from-red-500 to-pink-600",
      path: "/veo-prompt-generator",
      comingSoon: false,
    },
    {
      id: "calendar-maker",
      title: "Coming Soon",
      description: "Segera Hadir",
      icon: CalendarIcon,
      gradient: "from-indigo-500 to-blue-600",
      path: "#",
      comingSoon: true
    },
    {
      id: "markdown-editor",
      title: "Coming Soon",
      description: "Segera Hadir",
      icon: CalendarIcon,
      gradient: "from-purple-500 to-indigo-600",
      path: "#",
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Main Content Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-20">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header Content */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              AMSY TOOLBOX
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-sans">
              Koleksi alat online yang powerful dan mudah digunakan untuk berbagai kebutuhanmu
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Link key={tool.id} to={tool.path} className={`group ${tool.comingSoon ? "pointer-events-none" : ""}`}>
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto rounded-2xl bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg md:text-xl font-semibold text-gray-800 font-poppins">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                        {tool.description}
                      </CardDescription>
                      <Button className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 transition-opacity border-0 text-white font-medium text-sm md:text-base`}>
                        {tool.comingSoon ? "Segera Hadir" : "Mulai Gunakan"}
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
          <p className="text-gray-500 font-sans">
            © 2024 AMSY TOOLBOX. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ImageConverter from "./pages/ImageConverter";
import Mp3Cutter from "./pages/Mp3Cutter";
import TextConverter from "./pages/TextConverter";
import VeoPromptGenerator from "./pages/VeoPromptGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/image-converter" element={<ImageConverter />} />
          <Route path="/mp3-cutter" element={<Mp3Cutter />} />
          <Route path="/text-converter" element={<TextConverter />} />
          <Route path="/veo-prompt-generator" element={<VeoPromptGenerator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

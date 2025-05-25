
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface ProcessButtonProps {
  processing: boolean;
  onProcess: () => void;
}

const ProcessButton = ({ processing, onProcess }: ProcessButtonProps) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardContent className="pt-6">
        <Button
          onClick={onProcess}
          disabled={processing}
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Potong & Unduh MP3
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProcessButton;

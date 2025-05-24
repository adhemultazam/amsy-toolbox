
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface OutputSectionProps {
  outputText: string;
  onCopy: () => void;
}

const OutputSection = ({ outputText, onCopy }: OutputSectionProps) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading">Hasil Konversi</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Teks hasil konversi akan muncul di sini..."
          value={outputText}
          readOnly
          className="min-h-[200px] resize-none bg-gray-50"
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {outputText.length} karakter
          </span>
          <Button
            onClick={onCopy}
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
  );
};

export default OutputSection;

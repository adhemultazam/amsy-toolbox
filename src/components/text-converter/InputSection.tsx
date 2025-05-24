
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface InputSectionProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onClear: () => void;
}

const InputSection = ({ inputText, onInputChange, onClear }: InputSectionProps) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading">Teks Masukan</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Ketik atau tempel teks Anda di sini..."
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          className="min-h-[200px] resize-none"
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {inputText.length} karakter
          </span>
          <Button onClick={onClear} variant="outline" size="sm">
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputSection;

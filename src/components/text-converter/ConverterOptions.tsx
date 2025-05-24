
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConverterButton from "./ConverterButton";
import { ConverterType } from "../../types/textConverter";

interface ConverterOptionsProps {
  converters: ConverterType[];
  inputText: string;
  activeConverter: string;
  onConvert: (id: string) => void;
}

const ConverterOptions = ({
  converters,
  inputText,
  activeConverter,
  onConvert
}: ConverterOptionsProps) => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm mt-8">
      <CardHeader>
        <CardTitle className="font-heading">Pilihan Konversi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {converters.map((converter) => (
            <ConverterButton
              key={converter.id}
              id={converter.id}
              name={converter.name}
              description={converter.description}
              gradient={converter.gradient}
              icon={converter.icon}
              isActive={activeConverter === converter.id}
              disabled={!inputText}
              onClick={() => onConvert(converter.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConverterOptions;


import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ConverterButtonProps {
  id: string;
  name: string;
  description: string;
  gradient: string;
  icon: LucideIcon;
  isActive: boolean;
  disabled: boolean;
  onClick: () => void;
}

const ConverterButton = ({
  id,
  name,
  description,
  gradient,
  icon: IconComponent,
  isActive,
  disabled,
  onClick
}: ConverterButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={isActive ? "default" : "outline"}
      className={`h-auto p-4 flex flex-col items-start gap-2 ${
        isActive
          ? `bg-gradient-to-r ${gradient} text-white hover:opacity-90`
          : 'hover:border-gray-400'
      }`}
    >
      <div className="flex items-center gap-2">
        <IconComponent className="w-4 h-4" />
        <span className="font-medium text-sm">{name}</span>
      </div>
      <span className="text-xs opacity-80 text-left leading-tight">
        {description}
      </span>
    </Button>
  );
};

export default ConverterButton;


import { LucideIcon } from "lucide-react";

export interface ConverterType {
  id: string;
  name: string;
  description: string;
  convert: (text: string) => string;
  gradient: string;
  icon: LucideIcon;
}

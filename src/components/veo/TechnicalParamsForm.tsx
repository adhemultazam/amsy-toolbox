
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface TechnicalParamsFormProps {
    visualQuality: string;
    setVisualQuality: (value: string) => void;
    negativePrompt: string;
    setNegativePrompt: (value: string) => void;
    handleEnhance: (currentText: string, setText: (text: string) => void, fieldName: string) => Promise<void>;
    isEnhancing: boolean;
}

const TechnicalParamsForm: React.FC<TechnicalParamsFormProps> = ({
    visualQuality,
    setVisualQuality,
    negativePrompt,
    setNegativePrompt,
    handleEnhance,
    isEnhancing,
}) => {
    const EnhanceButton = ({ fieldName, textValue, setTextValue }: { fieldName: string, textValue: string, setTextValue: (value: string) => void }) => (
        <Button variant="ghost" size="sm" onClick={() => handleEnhance(textValue, setTextValue, fieldName)} disabled={isEnhancing || !textValue} className="text-xs">
            <Wand2 className="w-3 h-3 mr-1" />
            {isEnhancing ? '...' : 'AI Enhance'}
        </Button>
    );

    return (
        <div className="p-2 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-red-800">Parameter Teknis dan Tambahan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                     <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="visualQuality" className="text-sm font-medium">Kualitas Visual</Label>
                        <EnhanceButton fieldName="Kualitas Visual" textValue={visualQuality} setTextValue={setVisualQuality} />
                    </div>
                    <Input id="visualQuality" placeholder="resolusi 8K, warna tajam, high dynamic range" value={visualQuality} onChange={(e) => setVisualQuality(e.target.value)} className="placeholder:text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="negativePrompt" className="text-sm font-medium">Negative Prompt</Label>
                        <EnhanceButton fieldName="Negative Prompt" textValue={negativePrompt} setTextValue={setNegativePrompt} />
                    </div>
                    <Textarea id="negativePrompt" placeholder="noise, blur, kartun, teks, watermark" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} rows={3} className="placeholder:text-sm" />
                </div>
            </div>
        </div>
    );
};

export default TechnicalParamsForm;

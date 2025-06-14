
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TechnicalParamsFormProps {
    visualQuality: string;
    setVisualQuality: (value: string) => void;
    negativePrompt: string;
    setNegativePrompt: (value: string) => void;
}

const TechnicalParamsForm: React.FC<TechnicalParamsFormProps> = ({
    visualQuality,
    setVisualQuality,
    negativePrompt,
    setNegativePrompt,
}) => {
    return (
        <div className="p-2 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-red-800">Parameter Teknis dan Tambahan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-sm font-medium">Kualitas Visual</Label><Input placeholder="resolusi 8K, warna tajam, high dynamic range" value={visualQuality} onChange={(e) => setVisualQuality(e.target.value)} className="placeholder:text-sm" /></div>
                <div className="space-y-2 md:col-span-2"><Label htmlFor="negativePrompt" className="text-sm font-medium">Negative Prompt</Label><Textarea id="negativePrompt" placeholder="noise, blur, kartun, teks, watermark" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} rows={3} className="placeholder:text-sm" /></div>
            </div>
        </div>
    );
};

export default TechnicalParamsForm;

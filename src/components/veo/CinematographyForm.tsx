
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cameraMovements } from '@/data/veoConstants';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface CinematographyFormProps {
    cameraMovement: string;
    setCameraMovement: (value: string) => void;
    lighting: string;
    setLighting: (value: string) => void;
    artStyle: string;
    setArtStyle: (value: string) => void;
    handleEnhance: (currentText: string, setText: (text: string) => void, fieldName: string) => Promise<void>;
    isEnhancing: boolean;
}

const CinematographyForm: React.FC<CinematographyFormProps> = ({
    cameraMovement,
    setCameraMovement,
    lighting,
    setLighting,
    artStyle,
    setArtStyle,
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
        <div className="p-2 bg-sky-50 rounded-lg border border-sky-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-sky-800">Sinematografi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label className="text-sm font-medium">Gerakan Kamera</Label>
                    <Select value={cameraMovement} onValueChange={setCameraMovement}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{cameraMovements.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="lighting" className="text-sm font-medium">Pencahayaan</Label>
                        <EnhanceButton fieldName="Pencahayaan" textValue={lighting} setTextValue={setLighting} />
                    </div>
                    <Input id="lighting" placeholder="senja yang dramatis, menyoroti siluet" value={lighting} onChange={(e) => setLighting(e.target.value)} className="placeholder:text-sm" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="artStyle" className="text-sm font-medium">Gaya Video/Art Style</Label>
                        <EnhanceButton fieldName="Gaya Video/Art Style" textValue={artStyle} setTextValue={setArtStyle} />
                    </div>
                    <Input id="artStyle" placeholder="sinematik ala film indie" value={artStyle} onChange={(e) => setArtStyle(e.target.value)} className="placeholder:text-sm" />
                </div>
            </div>
        </div>
    );
};

export default CinematographyForm;

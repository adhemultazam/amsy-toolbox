
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface AudioFormProps {
    characterVoice: string;
    setCharacterVoice: (value: string) => void;
    ambienceSound: string;
    setAmbienceSound: (value: string) => void;
    dialogue: string;
    setDialogue: (value: string) => void;
    handleEnhance: (currentText: string, setText: (text: string) => void, fieldName: string) => Promise<void>;
    isEnhancing: boolean;
}

const AudioForm: React.FC<AudioFormProps> = ({
    characterVoice,
    setCharacterVoice,
    ambienceSound,
    setAmbienceSound,
    dialogue,
    setDialogue,
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
        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-amber-800">Audio</h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="characterVoice" className="text-sm font-medium">Detail Suara Karakter</Label>
                        <EnhanceButton fieldName="Detail Suara Karakter" textValue={characterVoice} setTextValue={setCharacterVoice} />
                    </div>
                    <Textarea id="characterVoice" placeholder="Suara ibu yang lembut dan menenangkan." value={characterVoice} onChange={(e) => setCharacterVoice(e.target.value)} rows={4} className="placeholder:text-sm" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="ambienceSound" className="text-sm font-medium">Suara Lingkungan/Ambiance</Label>
                        <EnhanceButton fieldName="Suara Lingkungan/Ambiance" textValue={ambienceSound} setTextValue={setAmbienceSound} />
                    </div>
                    <Textarea id="ambienceSound" placeholder="Hembusan angin sepoi-sepoi, deburan air danau yang kecil." value={ambienceSound} onChange={(e) => setAmbienceSound(e.target.value)} className="placeholder:text-sm" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="dialogue" className="text-sm font-medium">Dialog Karakter</Label>
                        <EnhanceButton fieldName="Dialog Karakter" textValue={dialogue} setTextValue={setDialogue} />
                    </div>
                    <Textarea id="dialogue" placeholder="Indah ya, Nak, ciptaan Tuhan." value={dialogue} onChange={(e) => setDialogue(e.target.value)} rows={3} className="placeholder:text-sm" />
                </div>
            </div>
        </div>
    );
};

export default AudioForm;

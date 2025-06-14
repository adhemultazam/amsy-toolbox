
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AudioFormProps {
    characterVoice: string;
    setCharacterVoice: (value: string) => void;
    ambienceSound: string;
    setAmbienceSound: (value: string) => void;
    dialogue: string;
    setDialogue: (value: string) => void;
}

const AudioForm: React.FC<AudioFormProps> = ({
    characterVoice,
    setCharacterVoice,
    ambienceSound,
    setAmbienceSound,
    dialogue,
    setDialogue,
}) => {
    return (
        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-amber-800">Audio</h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2"><Label htmlFor="characterVoice" className="text-sm font-medium">Detail Suara Karakter</Label><Textarea id="characterVoice" placeholder="Suara ibu yang lembut dan menenangkan." value={characterVoice} onChange={(e) => setCharacterVoice(e.target.value)} rows={4} className="placeholder:text-sm" maxLength={1000} /></div>
                <div className="space-y-2"><Label htmlFor="ambienceSound" className="text-sm font-medium">Suara Lingkungan/Ambiance</Label><Textarea id="ambienceSound" placeholder="Hembusan angin sepoi-sepoi, deburan air danau yang kecil." value={ambienceSound} onChange={(e) => setAmbienceSound(e.target.value)} className="placeholder:text-sm" maxLength={1000} /></div>
                <div className="space-y-2"><Label htmlFor="dialogue" className="text-sm font-medium">Dialog Karakter</Label><Textarea id="dialogue" placeholder="Indah ya, Nak, ciptaan Tuhan." value={dialogue} onChange={(e) => setDialogue(e.target.value)} rows={3} className="placeholder:text-sm" maxLength={2000} /></div>
            </div>
        </div>
    );
};

export default AudioForm;

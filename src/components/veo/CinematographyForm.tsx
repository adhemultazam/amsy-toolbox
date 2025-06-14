
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cameraMovements } from '@/data/veoConstants';

interface CinematographyFormProps {
    cameraMovement: string;
    setCameraMovement: (value: string) => void;
    lighting: string;
    setLighting: (value: string) => void;
    artStyle: string;
    setArtStyle: (value: string) => void;
}

const CinematographyForm: React.FC<CinematographyFormProps> = ({
    cameraMovement,
    setCameraMovement,
    lighting,
    setLighting,
    artStyle,
    setArtStyle,
}) => {
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
                <div className="space-y-2"><Label className="text-sm font-medium">Pencahayaan</Label><Input placeholder="senja yang dramatis, menyoroti siluet" value={lighting} onChange={(e) => setLighting(e.target.value)} className="placeholder:text-sm" /></div>
                <div className="space-y-2"><Label className="text-sm font-medium">Gaya Video/Art Style</Label><Input placeholder="sinematik ala film indie" value={artStyle} onChange={(e) => setArtStyle(e.target.value)} className="placeholder:text-sm" /></div>
            </div>
        </div>
    );
};

export default CinematographyForm;

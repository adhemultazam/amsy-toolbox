
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EnvironmentFormProps {
    settingAndTime: string;
    setSettingAndTime: (value: string) => void;
    atmosphere: string;
    setAtmosphere: (value: string) => void;
}

const EnvironmentForm: React.FC<EnvironmentFormProps> = ({
    settingAndTime,
    setSettingAndTime,
    atmosphere,
    setAtmosphere,
}) => {
    return (
        <div className="p-2 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-green-800">Lingkungan dan Atmosfer</h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2"><Label htmlFor="settingAndTime" className="text-sm font-medium">Latar Tempat & Waktu</Label><Textarea id="settingAndTime" placeholder="Danau yang tenang memantulkan warna langit jingga, beberapa perahu nelayan tradisional bersandar di kejauhan." value={settingAndTime} onChange={(e) => setSettingAndTime(e.target.value)} rows={3} className="placeholder:text-sm" /></div>
                <div className="space-y-2"><Label htmlFor="atmosphere" className="text-sm font-medium">Suasana Keseluruhan</Label><Textarea id="atmosphere" placeholder="hangat, hening, dan syahdu" value={atmosphere} onChange={(e) => setAtmosphere(e.target.value)} className="placeholder:text-sm" /></div>
            </div>
        </div>
    );
};

export default EnvironmentForm;

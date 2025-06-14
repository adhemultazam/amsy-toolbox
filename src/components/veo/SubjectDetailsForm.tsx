
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SubjectDetailsFormProps {
    sceneTitle: string;
    setSceneTitle: (value: string) => void;
    characterDescription: string;
    setCharacterDescription: (value: string) => void;
    characterAction: string;
    setCharacterAction: (value: string) => void;
    characterExpression: string;
    setCharacterExpression: (value: string) => void;
}

const SubjectDetailsForm: React.FC<SubjectDetailsFormProps> = ({
    sceneTitle,
    setSceneTitle,
    characterDescription,
    setCharacterDescription,
    characterAction,
    setCharacterAction,
    characterExpression,
    setCharacterExpression,
}) => {
    return (
        <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-purple-800">Detail Subjek dan Aksi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2"><Label htmlFor="sceneTitle" className="text-sm font-medium">Judul Scene</Label><Input id="sceneTitle" placeholder="Ibu dan anak di tepi danau Toba saat senja" value={sceneTitle} onChange={(e) => setSceneTitle(e.target.value)} className="placeholder:text-sm" /></div>
                <div className="space-y-2 md:col-span-2"><Label htmlFor="characterDescription" className="text-sm font-medium">Deskripsi Karakter Inti</Label><Textarea id="characterDescription" placeholder="Seorang ibu berusia 40-an mengenakan ulos, dan anak laki-lakinya berusia 8 tahun, keduanya duduk di dermaga kayu." value={characterDescription} onChange={(e) => setCharacterDescription(e.target.value)} rows={5} className="placeholder:text-sm" /></div>
                <div className="space-y-2"><Label htmlFor="characterAction" className="text-sm font-medium">Aksi Karakter</Label><Textarea id="characterAction" placeholder="Ibu mengelus rambut anaknya sambil menunjuk ke arah matahari terbenam." value={characterAction} onChange={(e) => setCharacterAction(e.target.value)} className="placeholder:text-sm" /></div>
                <div className="space-y-2"><Label htmlFor="characterExpression" className="text-sm font-medium">Ekspresi Karakter</Label><Textarea id="characterExpression" placeholder="penuh kasih dan damai" value={characterExpression} onChange={(e) => setCharacterExpression(e.target.value)} className="placeholder:text-sm" /></div>
            </div>
        </div>
    );
};

export default SubjectDetailsForm;

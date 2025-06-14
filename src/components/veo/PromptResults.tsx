
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PromptResultsProps {
    indonesianPrompt: string;
    setIndonesianPrompt: (value: string) => void;
    englishPrompt: string;
    copyToClipboard: (text: string, lang: string) => void;
}

const PromptResults: React.FC<PromptResultsProps> = ({
    indonesianPrompt,
    setIndonesianPrompt,
    englishPrompt,
    copyToClipboard,
}) => {
    return (
        <div className="sticky top-8">
            <Card className="bg-purple-100 border-2 border-purple-300 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Hasil Prompt</CardTitle>
                    <CardDescription className="text-sm text-gray-500">Berikut adalah prompt yang dihasilkan.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-base sm:text-lg font-semibold">Bahasa Indonesia</Label>
                        <Textarea value={indonesianPrompt} onChange={(e) => setIndonesianPrompt(e.target.value)} rows={15} className="mt-2 font-mono text-sm" />
                        <Button onClick={() => copyToClipboard(indonesianPrompt, "Indonesia")} className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white">Salin Prompt Indonesia</Button>
                    </div>
                    <div>
                        <Label className="text-base sm:text-lg font-semibold">Bahasa Inggris</Label>
                        <Textarea value={englishPrompt} readOnly rows={15} className="mt-2 font-mono text-sm bg-gray-100" />
                        <Button onClick={() => copyToClipboard(englishPrompt, "Inggris")} className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white">Salin Prompt Inggris</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PromptResults;

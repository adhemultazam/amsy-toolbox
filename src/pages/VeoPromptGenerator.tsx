
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import SubjectDetailsForm from '@/components/veo/SubjectDetailsForm';
import EnvironmentForm from '@/components/veo/EnvironmentForm';
import CinematographyForm from '@/components/veo/CinematographyForm';
import AudioForm from '@/components/veo/AudioForm';
import TechnicalParamsForm from '@/components/veo/TechnicalParamsForm';
import PromptResults from '@/components/veo/PromptResults';

const VeoPromptGenerator = () => {
    const [sceneTitle, setSceneTitle] = useState('');
    const [characterDescription, setCharacterDescription] = useState('');
    const [characterVoice, setCharacterVoice] = useState('');
    const [characterAction, setCharacterAction] = useState('');
    const [characterExpression, setCharacterExpression] = useState('');
    const [settingAndTime, setSettingAndTime] = useState('');
    const [cameraMovement, setCameraMovement] = useState('Tracking Shot');
    const [lighting, setLighting] = useState('');
    const [artStyle, setArtStyle] = useState('');
    const [visualQuality, setVisualQuality] = useState('');
    const [atmosphere, setAtmosphere] = useState('');
    const [ambienceSound, setAmbienceSound] = useState('');
    const [dialogue, setDialogue] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');

    const [indonesianPrompt, setIndonesianPrompt] = useState('');
    const [englishPrompt, setEnglishPrompt] = useState('');

    const handleGeneratePrompt = () => {
        const state = { sceneTitle, characterDescription, characterVoice, characterAction, characterExpression, settingAndTime, cameraMovement, lighting, artStyle, visualQuality, atmosphere, ambienceSound, dialogue, negativePrompt };
        const isProvided = (value: string) => value && value.trim() !== '';

        // Indonesian Prompt
        const characterStr = isProvided(state.characterDescription) ? `tentang ${state.characterDescription}` : 'tentang sebuah subjek';
        const actionStr = isProvided(state.characterAction) ? `yang sedang ${state.characterAction}` : '';
        const expressionStr = isProvided(state.characterExpression) ? ` dengan ekspresi ${state.characterExpression}` : '';
        const settingStr = isProvided(state.settingAndTime) ? ` di ${state.settingAndTime}` : '';
        const atmosphereStr = isProvided(state.atmosphere) ? ` dalam suasana ${state.atmosphere}` : '';

        const mainDesc = `Buat video bergaya ${state.artStyle || 'realistis'} ${characterStr} ${actionStr}${expressionStr}${settingStr}${atmosphereStr}.`.replace(/ ,/g, ',').replace(/ \./g, '.').replace(/  +/g, ' ').trim();

        const cinematographyDesc = `Gunakan pergerakan kamera ${state.cameraMovement || 'statis'} dengan pencahayaan ${state.lighting || 'alami'}.`;

        let audioDesc = 'Tanpa audio.';
        const audioParts = [];
        if (isProvided(state.dialogue)) audioParts.push(`Dialog: "${state.dialogue}"`);
        if (isProvided(state.characterVoice)) audioParts.push(`Deskripsi suara: ${state.characterVoice}`);
        if (isProvided(state.ambienceSound)) audioParts.push(`Suara lingkungan: ${state.ambienceSound}`);
        if (audioParts.length > 0) {
            audioDesc = audioParts.join('. ');
        }

        const techSpec = isProvided(state.visualQuality) ? `Spesifikasi teknis: ${state.visualQuality}.` : '';

        const idPrompt = [mainDesc, cinematographyDesc, audioDesc, techSpec]
            .filter(Boolean)
            .join('\n\n');
        
        const finalIdPrompt = `${idPrompt}\n\n**Prompt Negatif:**\nHindari: ${state.negativePrompt || 'tidak ada'}.`;

        // English Prompt
        const enCharacterStr = isProvided(state.characterDescription) ? `about ${state.characterDescription}` : 'about a subject';
        const enActionStr = isProvided(state.characterAction) ? ` who is ${state.characterAction}` : '';
        const enExpressionStr = isProvided(state.characterExpression) ? ` with an expression of ${state.characterExpression}` : '';
        const enSettingStr = isProvided(state.settingAndTime) ? ` at ${state.settingAndTime}` : '';
        const enAtmosphereStr = isProvided(state.atmosphere) ? ` in an atmosphere of ${state.atmosphere}` : '';

        const enMainDesc = `Create a ${state.artStyle || 'realistic'} style video ${enCharacterStr}${enActionStr}${enExpressionStr}${enSettingStr}${enAtmosphereStr}.`.replace(/ ,/g, ',').replace(/ \./g, '.').replace(/  +/g, ' ').trim();
        
        const enCinematographyDesc = `Use ${state.cameraMovement || 'static'} camera movement with ${state.lighting || 'natural'} lighting.`;

        let enAudioDesc = 'No audio.';
        const enAudioParts = [];
        if (isProvided(state.dialogue)) enAudioParts.push(`Dialogue: "${state.dialogue}"`); // Dialogue not translated
        if (isProvided(state.characterVoice)) enAudioParts.push(`Voice description: ${state.characterVoice}`);
        if (isProvided(state.ambienceSound)) enAudioParts.push(`Ambient sound: ${state.ambienceSound}`);
        if (enAudioParts.length > 0) {
            enAudioDesc = enAudioParts.join('. ');
        }

        const enTechSpec = isProvided(state.visualQuality) ? `Technical specifications: ${state.visualQuality}.` : '';

        const enPrompt = [enMainDesc, enCinematographyDesc, enAudioDesc, enTechSpec]
            .filter(Boolean)
            .join('\n\n');
            
        const finalEnPrompt = `${enPrompt}\n\n**Negative Prompt:**\nAvoid: ${state.negativePrompt || 'none'}.`;

        setIndonesianPrompt(finalIdPrompt);
        setEnglishPrompt(finalEnPrompt);
        
        toast({
          title: "Prompt Berhasil Dibuat!",
          description: "Hasil prompt telah ditampilkan di samping.",
        });
    };

    const copyToClipboard = (text: string, lang: string) => {
        navigator.clipboard.writeText(text);
        toast({
          title: `Prompt Bahasa ${lang} Disalin!`,
          description: "Anda dapat menempelkannya di mana saja.",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Halaman Utama
                    </Link>
                </div>

                <div className={cn("grid grid-cols-1 items-start", indonesianPrompt && englishPrompt && "lg:grid-cols-2 lg:gap-8")}>
                    <Card className="mb-8 lg:mb-0">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Wand2 className="w-8 h-8 text-purple-600" />
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-800 sm:text-2xl">Veo 3 Prompt Generator</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Buat prompt terstruktur untuk Google Veo 3 dengan mudah.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <SubjectDetailsForm 
                                sceneTitle={sceneTitle} setSceneTitle={setSceneTitle}
                                characterDescription={characterDescription} setCharacterDescription={setCharacterDescription}
                                characterAction={characterAction} setCharacterAction={setCharacterAction}
                                characterExpression={characterExpression} setCharacterExpression={setCharacterExpression}
                            />
                            
                            <EnvironmentForm
                                settingAndTime={settingAndTime} setSettingAndTime={setSettingAndTime}
                                atmosphere={atmosphere} setAtmosphere={setAtmosphere}
                            />

                            <CinematographyForm
                                cameraMovement={cameraMovement} setCameraMovement={setCameraMovement}
                                lighting={lighting} setLighting={setLighting}
                                artStyle={artStyle} setArtStyle={setArtStyle}
                            />
                           
                            <AudioForm
                                characterVoice={characterVoice} setCharacterVoice={setCharacterVoice}
                                ambienceSound={ambienceSound} setAmbienceSound={setAmbienceSound}
                                dialogue={dialogue} setDialogue={setDialogue}
                            />

                            <TechnicalParamsForm
                                visualQuality={visualQuality} setVisualQuality={setVisualQuality}
                                negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt}
                            />
                            
                            <div>
                                <Button onClick={handleGeneratePrompt} className="w-full text-lg py-6 bg-purple-600 hover:bg-purple-700">
                                    <Wand2 className="w-5 h-5 mr-2" />
                                    Buat Prompt
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {indonesianPrompt && englishPrompt && (
                        <PromptResults 
                            indonesianPrompt={indonesianPrompt}
                            setIndonesianPrompt={setIndonesianPrompt}
                            englishPrompt={englishPrompt}
                            copyToClipboard={copyToClipboard}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VeoPromptGenerator;

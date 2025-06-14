
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const cameraMovements = [
    { value: 'Static', label: 'Static (Statis)' },
    { value: '3D Rotation', label: '3D Rotation (Rotasi 3D)' },
    { value: 'Arc Shot', label: 'Arc Shot (Tembakan Busur)' },
    { value: 'Crane Shot', label: 'Crane Shot (Tembakan Derek)' },
    { value: 'Dolly In', label: 'Dolly In (Dolly Masuk)' },
    { value: 'Dolly Out', label: 'Dolly Out (Dolly Keluar)' },
    { value: 'Drone Shot / Aerial View', label: 'Drone Shot / Aerial View (Tembakan Drone)' },
    { value: 'Dutch Angle / Canted Angle', label: 'Dutch Angle (Sudut Belanda)' },
    { value: 'Handheld', label: 'Handheld (Genggam)' },
    { value: 'Pan Left', label: 'Pan Left (Geser Kiri)' },
    { value: 'Pan Right', label: 'Pan Right (Geser Kanan)' },
    { value: 'Pedestal Down', label: 'Pedestal Down (Turun)' },
    { value: 'Pedestal Up', label: 'Pedestal Up (Naik)' },
    { value: 'Steadicam', label: 'Steadicam (Steadicam)' },
    { value: 'Tilt Down', label: 'Tilt Down (Miring ke Bawah)' },
    { value: 'Tilt Up', label: 'Tilt Up (Miring ke Atas)' },
    { value: 'Tracking Shot', label: 'Tracking Shot (Tembakan Mengikuti)' },
    { value: 'Truck Left', label: 'Truck Left (Geser Kiri)' },
    { value: 'Truck Right', label: 'Truck Right (Geser Kanan)' },
    { value: 'Whip Pan', label: 'Whip Pan (Geser Cepat)' },
    { value: 'Zoom In', label: 'Zoom In (Perbesar)' },
    { value: 'Zoom Out', label: 'Zoom Out (Perkecil)' },
];

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
          description: "Hasil prompt telah ditampilkan di bawah.",
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
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Halaman Utama
                    </Link>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <Wand2 className="w-8 h-8 text-purple-600" />
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-800">Veo 3 Prompt Generator</CardTitle>
                                <CardDescription>Buat prompt terstruktur untuk Google Veo 3 dengan mudah.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Kategori: Detail Subjek dan Aksi */}
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h3 className="text-lg font-semibold mb-4 text-purple-800">Detail Subjek dan Aksi</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 md:col-span-2"><Label htmlFor="sceneTitle">Judul Scene</Label><Input id="sceneTitle" placeholder="terminal bus malam" value={sceneTitle} onChange={(e) => setSceneTitle(e.target.value)} /></div>
                                <div className="space-y-2 md:col-span-2"><Label htmlFor="characterDescription">Deskripsi Karakter Inti</Label><Textarea id="characterDescription" placeholder="Seorang vlogger wanita muda asal Minang berusia 27 tahun. Perawakan/Bentuk Tubuh: tubuh mungil, tinggi 158cm..." value={characterDescription} onChange={(e) => setCharacterDescription(e.target.value)} rows={5} /></div>
                                <div className="space-y-2"><Label htmlFor="characterAction">Aksi Karakter</Label><Textarea id="characterAction" placeholder="berjalan di sekitar terminal bus malam sambil melihat-lihat aktivitas penumpang dan pedagang." value={characterAction} onChange={(e) => setCharacterAction(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="characterExpression">Ekspresi Karakter</Label><Textarea id="characterExpression" placeholder="Karakter menunjukkan ekspresi kagum dan antusias, sering tersenyum sambil melirik kamera." value={characterExpression} onChange={(e) => setCharacterExpression(e.target.value)} /></div>
                            </div>
                        </div>

                        {/* Kategori: Lingkungan dan Atmosfer */}
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="text-lg font-semibold mb-4 text-green-800">Lingkungan dan Atmosfer</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2"><Label htmlFor="settingAndTime">Latar Tempat & Waktu</Label><Textarea id="settingAndTime" placeholder="latar tempat: di terminal bus antar kota malam hari, terdapat pedagang kaki lima..." value={settingAndTime} onChange={(e) => setSettingAndTime(e.target.value)} rows={3} /></div>
                                <div className="space-y-2"><Label htmlFor="atmosphere">Suasana Keseluruhan</Label><Textarea id="atmosphere" placeholder="Suasana sibuk, ramai, dengan kesan perjalanan malam yang hidup dan dinamis meskipun hujan." value={atmosphere} onChange={(e) => setAtmosphere(e.target.value)} /></div>
                            </div>
                        </div>

                        {/* Kategori: Sinematografi */}
                        <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                            <h3 className="text-lg font-semibold mb-4 text-sky-800">Sinematografi</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2"><Label>Gerakan Kamera</Label>
                                    <Select value={cameraMovement} onValueChange={setCameraMovement}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{cameraMovements.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2"><Label>Pencahayaan</Label><Input placeholder="natural dari lampu jalan dan lampu bus, pantulan cahaya pada aspal basah." value={lighting} onChange={(e) => setLighting(e.target.value)} /></div>
                                <div className="space-y-2"><Label>Gaya Video/Art Style</Label><Input placeholder="cinematic realistis" value={artStyle} onChange={(e) => setArtStyle(e.target.value)} /></div>
                            </div>
                        </div>

                        {/* Kategori: Audio */}
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <h3 className="text-lg font-semibold mb-4 text-amber-800">Audio</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2"><Label htmlFor="characterVoice">Detail Suara Karakter</Label><Textarea id="characterVoice" placeholder="Dia berbicara dengan suara wanita muda yang hangat dan penuh semangat. Nada: mezzo-soprano..." value={characterVoice} onChange={(e) => setCharacterVoice(e.target.value)} rows={4} /></div>
                                <div className="space-y-2"><Label htmlFor="ambienceSound">Suara Lingkungan/Ambiance</Label><Textarea id="ambienceSound" placeholder="SOUND: suara mesin bus menyala, pengumuman dari pengeras suara, derai hujan ringan..." value={ambienceSound} onChange={(e) => setAmbienceSound(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="dialogue">Dialog Karakter</Label><Textarea id="dialogue" placeholder="Karakter berkata: Tiap kota punya terminal kayak gini, dan aku suka banget suasana malamnya…" value={dialogue} onChange={(e) => setDialogue(e.target.value)} rows={3} /></div>
                            </div>
                        </div>

                         {/* Kategori: Parameter Teknis dan Tambahan */}
                         <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <h3 className="text-lg font-semibold mb-4 text-red-800">Parameter Teknis dan Tambahan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Kualitas Visual</Label><Input placeholder="Resolusi 4K" value={visualQuality} onChange={(e) => setVisualQuality(e.target.value)} /></div>
                                <div className="space-y-2 md:col-span-2"><Label htmlFor="negativePrompt">Negative Prompt</Label><Textarea id="negativePrompt" placeholder="teks di layar, subtitle, tulisan di video, font, logo, distorsi, artefak..." value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} rows={3} /></div>
                            </div>
                        </div>
                        
                        <div>
                            <Button onClick={handleGeneratePrompt} className="w-full text-lg py-6 bg-purple-600 hover:bg-purple-700">
                                <Wand2 className="w-5 h-5 mr-2" />
                                Buat Prompt
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {indonesianPrompt && englishPrompt && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Hasil Prompt</CardTitle>
                            <CardDescription>Berikut adalah prompt yang dihasilkan dalam Bahasa Indonesia dan Inggris.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-lg font-semibold">Bahasa Indonesia (Dapat Diedit)</Label>
                                <Textarea value={indonesianPrompt} onChange={(e) => setIndonesianPrompt(e.target.value)} rows={15} className="mt-2 font-mono text-sm" />
                                <Button onClick={() => copyToClipboard(indonesianPrompt, "Indonesia")} variant="outline" className="mt-2 w-full">Salin Prompt Indonesia</Button>
                            </div>
                            <div>
                                <Label className="text-lg font-semibold">Bahasa Inggris (Final)</Label>
                                <Textarea value={englishPrompt} readOnly rows={15} className="mt-2 font-mono text-sm bg-gray-100" />
                                <Button onClick={() => copyToClipboard(englishPrompt, "Inggris")} variant="outline" className="mt-2 w-full">Salin Prompt Inggris</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default VeoPromptGenerator;

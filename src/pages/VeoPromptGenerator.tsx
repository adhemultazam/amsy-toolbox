
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
    const [sceneTitle, setSceneTitle] = useState('terminal bus malam');
    const [characterDescription, setCharacterDescription] = useState('Seorang vlogger wanita muda asal Minang berusia 27 tahun. Perawakan/Bentuk Tubuh: tubuh mungil, tinggi 158cm, bentuk badan proporsional. warna kulit: sawo matang cerah. Rambut: ikal sebahu, hitam kecokelatan, diikat setengah ke belakang. Wajah: wajah oval, alis tebal alami, mata hitam besar, senyum ramah, pipi merona, bibir natural dengan sentuhan lip tint. Pakaian: mengenakan jaket parasut warna kuning mustard dan celana panjang hitam, membawa ransel kecil.');
    const [characterVoice, setCharacterVoice] = useState('Dia berbicara dengan suara wanita muda yang hangat dan penuh semangat. Nada: mezzo-soprano. Timbre: bersahabat dan enerjik. Aksen/Logat: logat Indonesia dengan sentuhan khas Minang halus, berbicara murni dalam Bahasa Indonesia. Cara Berbicara: tempo sedang-cepat, gaya bicara lincah dan ekspresif. PENTING: Seluruh dialog harus dalam Bahasa Indonesia dengan pengucapan natural dan jelas. Pastikan suara karakter ini konsisten di seluruh video.');
    const [characterAction, setCharacterAction] = useState('berjalan di sekitar terminal bus malam sambil melihat-lihat aktivitas penumpang dan pedagang.');
    const [characterExpression, setCharacterExpression] = useState('Karakter menunjukkan ekspresi kagum dan antusias, sering tersenyum sambil melirik kamera.');
    const [settingAndTime, setSettingAndTime] = useState('latar tempat: di terminal bus antar kota malam hari, terdapat pedagang kaki lima di pinggir jalur keberangkatan, beberapa bus berjajar dengan lampu menyala. Waktu: malam hari, hujan rintik-rintik.');
    const [cameraMovement, setCameraMovement] = useState('Tracking Shot');
    const [lighting, setLighting] = useState('natural dari lampu jalan dan lampu bus, pantulan cahaya pada aspal basah.');
    const [artStyle, setArtStyle] = useState('cinematic realistis');
    const [visualQuality, setVisualQuality] = useState('Resolusi 4K');
    const [atmosphere, setAtmosphere] = useState('Suasana sibuk, ramai, dengan kesan perjalanan malam yang hidup dan dinamis meskipun hujan.');
    const [ambienceSound, setAmbienceSound] = useState('SOUND: suara mesin bus menyala, pengumuman dari pengeras suara, derai hujan ringan, dan percakapan samar antar penumpang dan pedagang.');
    const [dialogue, setDialogue] = useState('Karakter berkata: Tiap kota punya terminal kayak gini, dan aku suka banget suasana malamnya… hangat walau gerimis begini. Rasanya kayak perjalanan baru mau dimulai.');
    const [negativePrompt, setNegativePrompt] = useState('teks di layar, subtitle, tulisan di video, font, logo, distorsi, artefak, anomali, wajah ganda, anggota badan cacat, tangan tidak normal, orang tambahan, objek mengganggu, kualitas rendah, buram, glitch, suara robotik, suara pecah.');

    const [indonesianPrompt, setIndonesianPrompt] = useState('');
    const [englishPrompt, setEnglishPrompt] = useState('');

    const handleGeneratePrompt = () => {
        const state = { sceneTitle, characterDescription, characterVoice, characterAction, characterExpression, settingAndTime, cameraMovement, lighting, artStyle, visualQuality, atmosphere, ambienceSound, dialogue, negativePrompt };
        
        const idPrompt = `**Judul Adegan:** ${state.sceneTitle}\n\n**Prompt Lengkap (Bahasa Indonesia):**\nSebuah video bergaya **${state.artStyle}** yang menampilkan adegan di **${state.settingAndTime}**. Fokus utama pada karakter dengan deskripsi: **${state.characterDescription}**. Karakter ini terlihat sedang melakukan aksi **${state.characterAction}**, sambil menunjukkan ekspresi **${state.characterExpression}**. Suara karakter konsisten dengan detail berikut: **${state.characterVoice}**. Suasana keseluruhan video terasa **${state.atmosphere}**, didukung oleh suara lingkungan seperti **${state.ambienceSound}**. Secara visual, video ini memiliki kualitas **${state.visualQuality}** dengan pencahayaan **${state.lighting}**. Gerakan kamera yang digunakan adalah **${state.cameraMovement}**, menciptakan nuansa sinematik yang mendalam.\n\n**Dialog Karakter (Bahasa Indonesia):**\nDIALOG: ${state.dialogue}\n\n**Prompt Negatif:**\nHindari: ${state.negativePrompt}.`;
        
        const enPrompt = `**Scene Title:** ${state.sceneTitle}\n\n**Full Prompt (English):**\nA **${state.artStyle}** style video showcasing a scene set at **${state.settingAndTime}**. The main focus is on a character with the following description: **${state.characterDescription}**. This character is seen performing the action of **${state.characterAction}**, while showing an expression of **${state.characterExpression}**. The character's voice is consistent with these details: **${state.characterVoice}**. The overall atmosphere of the video feels **${state.atmosphere}**, supported by ambient sounds such as **${state.ambienceSound}**. Visually, the video has **${state.visualQuality}** quality with **${state.lighting}** lighting. The camera movement used is **${state.cameraMovement}**, creating a deep cinematic feel.\n\n**Character Dialogue (in Indonesian):**\nDIALOGUE: ${state.dialogue}\n\n**Negative Prompt:**\nAvoid: ${state.negativePrompt}.`;

        setIndonesianPrompt(idPrompt);
        setEnglishPrompt(enPrompt);
        
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
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Form Inputs */}
                        <div className="space-y-2"><Label htmlFor="sceneTitle">1. Judul Scene</Label><Input id="sceneTitle" value={sceneTitle} onChange={(e) => setSceneTitle(e.target.value)} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="characterDescription">2. Deskripsi Karakter Inti</Label><Textarea id="characterDescription" value={characterDescription} onChange={(e) => setCharacterDescription(e.target.value)} rows={6} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="characterVoice">3. Detail Suara Karakter</Label><Textarea id="characterVoice" value={characterVoice} onChange={(e) => setCharacterVoice(e.target.value)} rows={5} /></div>
                        <div className="space-y-2"><Label htmlFor="characterAction">4. Aksi Karakter</Label><Textarea id="characterAction" value={characterAction} onChange={(e) => setCharacterAction(e.target.value)} /></div>
                        <div className="space-y-2"><Label htmlFor="characterExpression">5. Ekspresi Karakter</Label><Textarea id="characterExpression" value={characterExpression} onChange={(e) => setCharacterExpression(e.target.value)} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="settingAndTime">6. Latar Tempat & Waktu</Label><Textarea id="settingAndTime" value={settingAndTime} onChange={(e) => setSettingAndTime(e.target.value)} rows={4} /></div>
                        
                        <Card className="md:col-span-2 p-4 bg-white border">
                            <h3 className="text-lg font-semibold mb-3">7. Detail Visual Tambahan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2"><Label>Gerakan Kamera</Label>
                                    <Select value={cameraMovement} onValueChange={setCameraMovement}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{cameraMovements.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2"><Label>Pencahayaan</Label><Input value={lighting} onChange={(e) => setLighting(e.target.value)} /></div>
                                <div className="space-y-2"><Label>Gaya Video/Art Style</Label><Input value={artStyle} onChange={(e) => setArtStyle(e.target.value)} /></div>
                                <div className="space-y-2"><Label>Kualitas Visual</Label><Input value={visualQuality} onChange={(e) => setVisualQuality(e.target.value)} /></div>
                            </div>
                        </Card>

                        <div className="space-y-2"><Label htmlFor="atmosphere">8. Suasana Keseluruhan</Label><Textarea id="atmosphere" value={atmosphere} onChange={(e) => setAtmosphere(e.target.value)} /></div>
                        <div className="space-y-2"><Label htmlFor="ambienceSound">9. Suara Lingkungan/Ambiance</Label><Textarea id="ambienceSound" value={ambienceSound} onChange={(e) => setAmbienceSound(e.target.value)} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="dialogue">10. Dialog Karakter</Label><Textarea id="dialogue" value={dialogue} onChange={(e) => setDialogue(e.target.value)} rows={3} /></div>
                        <div className="space-y-2 md:col-span-2"><Label htmlFor="negativePrompt">11. Negative Prompt</Label><Textarea id="negativePrompt" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} rows={3} /></div>
                        
                        <div className="md:col-span-2">
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


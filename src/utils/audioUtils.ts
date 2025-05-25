
export const bufferToWav = async (buffer: AudioBuffer): Promise<Blob> => {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bytesPerSample = 2;
  const blockAlign = numberOfChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;
  const bufferSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, bufferSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
};

// Fungsi baru untuk konversi ke MP3
// Ganti import
// import lamejs from 'lamejs';
import lamejs from '@breezystack/lamejs';

// Sisanya tetap sama
export const bufferToMp3 = async (buffer: AudioBuffer, bitrate: number = 128): Promise<Blob> => {
  const channels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitrate);
  const mp3Data: Uint8Array[] = [];
  
  // Ukuran sampel harus kelipatan 576 untuk memudahkan encoder
  const sampleBlockSize = 1152;
  
  // Konversi data float ke int16
  const leftData = new Int16Array(buffer.length);
  const rightData = channels === 2 ? new Int16Array(buffer.length) : null;
  
  // Ambil data dari channel
  for (let i = 0; i < buffer.length; i++) {
    // Konversi dari float32 [-1,1] ke int16 [-32768,32767]
    const left = Math.max(-1, Math.min(1, buffer.getChannelData(0)[i]));
    leftData[i] = left * 0x7FFF;
    
    if (channels === 2 && rightData) {
      const right = Math.max(-1, Math.min(1, buffer.getChannelData(1)[i]));
      rightData[i] = right * 0x7FFF;
    }
  }
  
  // Proses encoding per blok
  for (let i = 0; i < buffer.length; i += sampleBlockSize) {
    const leftChunk = leftData.subarray(i, i + sampleBlockSize);
    let mp3buf;
    
    if (channels === 2 && rightData) {
      const rightChunk = rightData.subarray(i, i + sampleBlockSize);
      mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    } else {
      mp3buf = mp3encoder.encodeBuffer(leftChunk);
    }
    
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }
  
  // Selesaikan encoding
  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }
  
  return new Blob(mp3Data, { type: 'audio/mp3' });
};

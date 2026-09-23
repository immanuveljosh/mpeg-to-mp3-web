import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const getFFmpeg = async (onProgress?: (progress: number) => void): Promise<FFmpeg> => {
  if (ffmpeg) {
    if (onProgress) {
      ffmpeg.on('progress', ({ progress }) => {
        onProgress(progress);
      });
    }
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();
  
  if (onProgress) {
    ffmpeg.on('progress', ({ progress }) => {
      onProgress(progress);
    });
  }

  // Load ffmpeg.wasm
  await ffmpeg.load();

  return ffmpeg;
};

export const convertMpegToMp3 = async (
  file: File,
  bitrate: string,
  sampleRate: string,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const instance = await getFFmpeg(onProgress);

  const inputName = `input_${file.name.replace(/\s+/g, '_')}`;
  const outputName = `output_${Date.now()}.mp3`;

  // Write the file to memory
  await instance.writeFile(inputName, await fetchFile(file));

  // Run the conversion command
  // e.g. ffmpeg -i input.mpeg -b:a 192k -ar 44100 output.mp3
  await instance.exec([
    '-i', inputName,
    '-b:a', `${bitrate}k`,
    '-ar', sampleRate,
    outputName
  ]);

  // Read the resulting file
  const data = await instance.readFile(outputName);
  
  // Clean up memory
  await instance.deleteFile(inputName);
  await instance.deleteFile(outputName);

  return new Blob([data as any], { type: 'audio/mpeg' });
};

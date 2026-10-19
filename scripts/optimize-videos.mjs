// Nén video hero trong source-videos thành bản web (bỏ âm thanh, faststart) + ảnh poster (public/videos/hero).
// Chạy: npm run videos
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'node:fs';
import path from 'node:path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const SRC = 'source-videos';
const OUT = 'public/videos/hero';

// Tên gốc -> tên dùng trong src/components/Hero.jsx
const NAMES = {
  'vid1.mp4': 'clip1',
  'vid2.mp4': 'clip2',
};

const run = (cmd) => new Promise((resolve, reject) => cmd.on('end', resolve).on('error', reject).run());

fs.mkdirSync(OUT, { recursive: true });
for (const [file, name] of Object.entries(NAMES)) {
  const input = path.join(SRC, file);
  if (!fs.existsSync(input)) continue;
  await run(
    ffmpeg(input)
      .noAudio()
      .videoCodec('libx264')
      .outputOptions(['-crf 30', '-preset slow', '-pix_fmt yuv420p', '-vf scale=-2:min(1280\\,ih)', '-movflags +faststart'])
      .output(path.join(OUT, `${name}.mp4`))
  );
  await run(ffmpeg(input).seekInput(1).outputOptions(['-frames:v 1', '-q:v 4']).output(path.join(OUT, `${name}.jpg`)));
  console.log(name, (fs.statSync(path.join(OUT, `${name}.mp4`)).size / 1e6).toFixed(2), 'MB');
}

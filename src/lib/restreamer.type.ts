export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface Resolution {
  url: "rtmp://localhost:1935/7f457e98-1f68-4160-b904-f90a32bd9da4.stream?token=12345678";
  format: "flv";
  index: 0;
  stream: 0;
  language: "und";
  type: "audio";
  codec: "aac";
  coder: "aac";
  bitrate_kbps: 163;
  duration_sec: 0.005;
  fps: 0;
  pix_fmt: "";
  width: 0;
  height: 0;
  sampling_hz: 48000;
  layout: "stereo";
  channels: 2;
}

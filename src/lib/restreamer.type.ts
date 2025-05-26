export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface Stream {
  url: string;
  format: string;
  index: number;
  stream: number;
  language: string;
  type: "audio" | "video" | string; // string fallback for possible future types
  codec: string;
  coder: string;
  bitrate_kbps: number;
  duration_sec: number;
  fps: number;
  pix_fmt: string;
  width: number;
  height: number;
  sampling_hz: number;
  layout: string;
  channels: number;
}

export interface Probe {
  streams: Stream[];
  log: string[];
}

export interface Meta {
  meta: {
    name: string;
    description: string;
    author: {
      name: string;
      description: string;
    };
  };
  license: string;
}

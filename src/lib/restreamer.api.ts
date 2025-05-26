import { probeProcess } from "./payload/probe_process";
import type { TokenResponse } from "./restreamer.type";

let _token: TokenResponse | null = null;
const token = async () => {
  if (_token) return _token.access_token;
  const res = await restreamerApi.login();
  _token = res;
  return _token.access_token;
};

export const restreamerApi = {
  login: async (): Promise<TokenResponse> => {
    const res = await fetch(`${Bun.env.RESTREAMER_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: Bun.env.RESTREAMER_USERNAME,
        password: Bun.env.RESTREAMER_PASSWORD,
      }),
    });
    if (!res.ok) {
      throw new Error(`Login failed: ${res.statusText}`);
    }
    const data = (await res.json()) as TokenResponse;
    return data;
  },
  createRtmpServer: () => {
    const url = new URL(Bun.env.RESTREAMER_URL!);
    // Converts to rtmps when needed thanks to https
    const protocol = url.protocol.replace("http", "rtmp");
    const host = `${protocol}//${url.hostname}`;
    const id: string = crypto.randomUUID();
    return {
      id,
      url: `${host}/${id}.stream/${Bun.env.RESTREAMER_RTMP_TOKEN}`,
    };
  },
  createProbeProcess: async (id: string) => {
    const TOKEN = await token();
    const res = await fetch(`${Bun.env.RESTREAMER_URL}/api/v3/process`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(probeProcess(id)),
    });
    if (!res.ok) {
      throw new Error(`Failed creating probe process: ${res.statusText}`);
    }
    const data = (await res.json()) as any;
    return data;
  },
  getStreamResolution: async (id: string) => {
    const TOKEN = await token();
    const res = await fetch(
      `${Bun.env.RESTREAMER_URL}/api/v3/process/restreamer-ui%3Aingest%3A${id}_probe/probe`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed getting stream resolution: ${res.statusText}`);
    }
    const data = (await res.json()) as any;
    return data;
  },
  createChannel: (id: string) => {
    return fetch(`${Bun.env.RESTREAMER_URL}/api/channel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test",
        description: "test",
        type: "rtmp",
        input: {
          type: "rtmp",
          url: "rtmp://localhost:1935/live/test",
        },
        output: {
          type: "rtmp",
          url: "rtmp://localhost:1935/live/test",
        },
      }),
    });
  },
};

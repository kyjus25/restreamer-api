import type { Meta, Stream } from "../restreamer.type";

export const channelMetadata = (id: string, streams: Stream[], meta: Meta) => ({
  version: "1.14.0",
  sources: [
    {
      type: "network",
      settings: {
        mode: "push",
        address: `{rtmp,name=${id}.stream}`,
        username: "",
        password: "",
        push: {
          type: "rtmp",
          name: id,
        },
        rtsp: {
          udp: false,
          stimeout: 5000000,
        },
        http: {
          readNative: true,
          forceFramerate: false,
          framerate: 25,
          userAgent: "",
          referer: "",
          http_proxy: "",
        },
        general: {
          analyzeduration: 5000000,
          analyzeduration_rtmp: 3000000,
          analyzeduration_http: 20000000,
          probesize: 5000000,
          max_probe_packets: 2500,
          fflags: ["genpts"],
          thread_queue_size: 512,
          copyts: false,
          start_at_zero: false,
          use_wallclock_as_timestamps: false,
          avoid_negative_ts: "auto",
        },
      },
      inputs: [
        {
          address: `{rtmp,name=${id}.stream}`,
          options: [
            "-fflags",
            "+genpts",
            "-thread_queue_size",
            512,
            "-probesize",
            5000000,
            "-analyzeduration",
            3000000,
            "-rtmp_enhanced_codecs",
            "hvc1,av01,vp09",
          ],
        },
      ],
      streams,
    },
    {
      type: "",
      settings: {},
      inputs: [],
      streams: [],
    },
  ],
  profiles: [
    {
      audio: {
        source: 0,
        stream: 0,
        encoder: {
          coder: "copy",
          settings: {},
          mapping: {
            global: [],
            local: ["-codec:a", "copy"],
            filter: [],
          },
        },
        decoder: {
          coder: "default",
          settings: {},
          mapping: {
            global: [],
            local: [],
            filter: [],
          },
        },
        filter: {
          graph: "",
          settings: {},
        },
        coder: "copy",
      },
      video: {
        source: 0,
        stream: 1,
        encoder: {
          coder: "copy",
          settings: {},
          mapping: {
            global: [],
            local: ["-codec:v", "copy"],
            filter: [],
          },
        },
        decoder: {
          coder: "default",
          settings: {},
          mapping: {
            global: [],
            local: [],
            filter: [],
          },
        },
        filter: {
          graph: "",
          settings: {},
        },
      },
      custom: {
        selected: false,
        stream: 0,
      },
    },
  ],
  streams: [
    {
      url: "",
      index: 0,
      stream: 0,
      type: "video",
      codec: "h264",
      width: 1280,
      height: 720,
      pix_fmt: "",
      sampling_hz: 0,
      layout: "",
      channels: 0,
    },
    {
      url: "",
      index: 0,
      stream: 1,
      type: "audio",
      codec: "aac",
      width: 0,
      height: 0,
      pix_fmt: "",
      sampling_hz: 48000,
      layout: "stereo",
      channels: 2,
    },
  ],
  control: {
    hls: {
      lhls: false,
      segmentDuration: 2,
      listSize: 6,
      cleanup: true,
      version: 3,
      storage: "memfs",
      master_playlist: true,
    },
    rtmp: {
      enable: false,
    },
    srt: {
      enable: false,
    },
    process: {
      autostart: true,
      reconnect: true,
      delay: 15,
      staleTimeout: 30,
      low_delay: false,
    },
    snapshot: {
      enable: true,
      interval: 60,
    },
    limits: {
      cpu_usage: 0,
      memory_mbytes: 0,
      waitfor_seconds: 5,
    },
  },
  player: {},
  ...meta,
});

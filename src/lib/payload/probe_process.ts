// Create a process that probes the video for resolutions
export const probeProcess = (id: string) => ({
  id: `restreamer-ui:ingest:${id}_probe`,
  type: "ffmpeg",
  reference: id,
  input: [
    {
      id: "input_0",
      address: `{rtmp,name=${id}.stream}`,
      options: [
        "-fflags",
        "+genpts",
        "-thread_queue_size",
        "512",
        "-probesize",
        "5000000",
        "-analyzeduration",
        "3000000",
        "-rtmp_enhanced_codecs",
        "hvc1,av01,vp09",
      ],
    },
  ],
  output: [
    {
      id: "output_0",
      address: "-",
      options: ["-dn", "-sn", "-codec", "copy", "-f", "null"],
    },
  ],
  options: [],
  reconnect: false,
  reconnect_delay_seconds: 0,
  autostart: false,
  stale_timeout_seconds: 0,
  limits: {
    cpu_usage: 0,
    memory_mbytes: 0,
    waitfor_seconds: 0,
  },
});

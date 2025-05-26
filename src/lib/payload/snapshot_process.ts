export const snapshotProcess = (id: string) => ({
  type: "ffmpeg",
  id: `restreamer-ui:ingest:${id}_snapshot`,
  reference: id,
  input: [
    {
      id: "input_0",
      address: `{memfs}/${id}.m3u8`,
      options: [],
    },
  ],
  output: [
    {
      id: "output_0",
      address: `{memfs}/${id}.jpg`,
      options: ["-vframes", "1", "-f", "image2", "-update", "1"],
      cleanup: [
        {
          pattern: `memfs:/${id}.jpg`,
          purge_on_delete: true,
        },
      ],
    },
  ],
  options: ["-err_detect", "ignore_err"],
  autostart: true,
  reconnect: true,
  reconnect_delay_seconds: 60,
  stale_timeout_seconds: 30,
});

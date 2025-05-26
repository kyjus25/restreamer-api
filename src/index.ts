import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { restreamerApi } from "./lib/restreamer.api";
import { channelProcess } from "./lib/payload/channel_process";
import { snapshotProcess } from "./lib/payload/snapshot_process";
import { probeProcess } from "./lib/payload/probe_process";

const app = new Elysia()
  .use(
    swagger({
      provider: "swagger-ui",
      documentation: {
        info: {
          title: "Restreamer API",
          version: "1.0.0",
          description: "Simplified endpoints for Restreamer",
        },
      },
    })
  )
  // .get("/", () => `${Bun.env.RESTREAMER_API_URL}`)
  .post("/create/rtmp", () => restreamerApi.createRtmpServer(), {
    tags: ["create"],
  })
  .post("/create/channel/:id", async (req) => {
    const id: string = req.params.id;
    const createProbeProcess = await restreamerApi.createProcess(
      probeProcess(id)
    );
    const probeStream = await restreamerApi.probeStream(id);
    await restreamerApi.deleteProbeProcess(id);

    if (probeStream.streams.length === 0) {
      throw new Error("No stream tracks found. Are you streaming?");
    }
    // console.log("PROBE", probeStream);

    const createChannelProcess = await restreamerApi.createProcess(
      channelProcess(id)
    );
    // console.log("CHANNEL PROCESS", createChannelProcess);

    const createChannelMetadata = await restreamerApi.putChannelMetadata(
      id,
      probeStream.streams,
      {
        meta: {
          name: id,
          description: "Test",
          author: {
            name: "Justin",
            description: "Meeeee!",
          },
        },
        license: "CC BY 4.0",
      }
    );
    // console.log("METADATA", createChannelMetadata);

    const createSnapshotProcess = await restreamerApi.createProcess(
      snapshotProcess(id)
    );
    // console.log("SNAPSHOT PROCESS", createSnapshotProcess);

    return true;
  })
  .listen(3000);

console.log(
  `🦊 Restreamer API is running at ${app.server?.hostname}:${app.server?.port}`
);

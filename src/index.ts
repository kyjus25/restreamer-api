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
    // 1. Create probe process that will get the stream tracks
    await restreamerApi.createProcess(probeProcess(id));
    // 2. Get the stream tracks
    const probeStream = await restreamerApi.probeStream(id);
    // 3. Delete the stream process
    await restreamerApi.deleteProbeProcess(id);
    // Error if stream is not playing
    if (probeStream.streams.length === 0) {
      throw new Error("No stream tracks found. Are you streaming?");
    }
    // 4. Create channel process
    await restreamerApi.createProcess(channelProcess(id));
    // 5. Update channel metadata and stream tracks
    await restreamerApi.putChannelMetadata(id, probeStream.streams, {
      meta: {
        name: id,
        description: "Test",
        author: {
          name: "Justin",
          description: "Meeeee!",
        },
      },
      license: "CC BY 4.0",
    });
    // 6. Create snapshot process for UI images
    await restreamerApi.createProcess(snapshotProcess(id));
    // Return successful
    return true;
  })
  .listen(3000);

console.log(
  `🦊 Restreamer API is running at ${app.server?.hostname}:${app.server?.port}`
);

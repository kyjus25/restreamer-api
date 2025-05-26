import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { restreamerApi } from "./lib/restreamer.api";

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
  .post("/create/channel", async () => {
    const id = "7f457e98-1f68-4160-b904-f90a32bd9da4";
    // const createProbeProcess = await restreamerApi.createProbeProcess(id);
    const getSteamResolution = await restreamerApi.getStreamResolution(id);
    console.log(getSteamResolution);
    return true;
  })
  .listen(3000);

console.log(
  `🦊 Restreamer API is running at ${app.server?.hostname}:${app.server?.port}`
);

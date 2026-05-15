import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg } from "./ffmpeg";
import { buildBlurFilter } from "./videoFilters";
import type { RemovalBox, VideoDimensions } from "../types/editor";

export async function exportCleanVideo(
  file: File, 
  boxes: RemovalBox[], 
  previewDims: VideoDimensions, 
  actualDims: VideoDimensions,
  onProgress?: (progress: number) => void
) {
  const ffmpeg = await getFFmpeg();
  
  if (onProgress) {
    ffmpeg.on("progress", ({ progress }) => {
      onProgress(progress);
    });
  }

  const inputName = "input.mp4";
  const outputName = "output.mp4";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const filter = buildBlurFilter(boxes, previewDims, actualDims);

  const args = filter
    ? [
        "-i", inputName,
        "-filter_complex", filter,
        "-map", `[v${boxes.length}]`,
        "-map", "0:a?", // Copy audio if it exists
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        outputName,
      ]
    : ["-i", inputName, "-c", "copy", outputName];

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  
  // Clean up
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return URL.createObjectURL(
    new Blob([(data as Uint8Array).buffer], { type: "video/mp4" })
  );
}

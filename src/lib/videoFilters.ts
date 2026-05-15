import type { RemovalBox, VideoDimensions } from "../types/editor";

export function buildBlurFilter(boxes: RemovalBox[], previewDims: VideoDimensions, actualDims: VideoDimensions) {
  if (boxes.length === 0) return "";

  const scaleX = actualDims.width / previewDims.width;
  const scaleY = actualDims.height / previewDims.height;

  const filters: string[] = [];

  boxes.forEach((box, index) => {
    const input = index === 0 ? "[0:v]" : `[v${index}]`;
    const output = `[v${index + 1}]`;
    
    const x = Math.round(box.x * scaleX);
    const y = Math.round(box.y * scaleY);
    const w = Math.round(box.width * scaleX);
    const h = Math.round(box.height * scaleY);

    // Filter chain: split base, crop a chunk, blur it, then overlay it back on the base.
    // We use [vX] as a label for the intermediate stages.
    filters.push(
      `${input}split[base${index}][tmp${index}];` +
      `[tmp${index}]crop=${w}:${h}:${x}:${y},boxblur=20:1[blur${index}];` +
      `[base${index}][blur${index}]overlay=${x}:${y}${output}`
    );
  });

  return filters.join(";");
}

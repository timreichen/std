// Copyright 2018-2025 the Deno authors. MIT license.

export function detach(
  buffer: Uint8Array,
  maxSize: number,
): [Uint8Array, number] {
  const originalSize = buffer.length;
  if (buffer.byteOffset) {
    const b = new Uint8Array(buffer.buffer);
    b.set(buffer);
    buffer = b.subarray(0, originalSize);
  }
  // deno-lint-ignore no-explicit-any
  buffer = new Uint8Array((buffer.buffer as any).transfer(maxSize));
  buffer.set(buffer.subarray(0, originalSize), maxSize - originalSize);
  return [buffer, maxSize - originalSize];
}

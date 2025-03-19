// Copyright 2018-2025 the Deno authors. MIT license.

import { assertEquals } from "@std/assert";
import { toText } from "@std/streams";
import { toBytes } from "@std/streams/unstable-to-bytes";
import { FixedChunkStream } from "@std/streams/unstable-fixed-chunk-stream";
import { encodeBase32 } from "./unstable_base32.ts";
import {
  Base32DecoderStream,
  Base32EncoderStream,
} from "./unstable_base32_stream.ts";

Deno.test("Base32EncoderStream() with normal format", async () => {
  for (const format of ["Base32", "Base32Hex", "Base32Crockford"] as const) {
    const readable = (await Deno.open("./deno.lock"))
      .readable
      .pipeThrough(new FixedChunkStream(1021))
      .pipeThrough(new Base32EncoderStream({ format, output: "string" }));

    assertEquals(
      await toText(readable),
      encodeBase32(await Deno.readFile("./deno.lock"), format),
      format,
    );
  }
});

Deno.test("Base32EncoderStream() with raw format", async () => {
  for (
    const format of [
      "Base32",
      "Base32Hex",
      "Base32Crockford",
    ] as const
  ) {
    const readable = (await Deno.open("./deno.lock"))
      .readable
      .pipeThrough(new FixedChunkStream(1021))
      .pipeThrough(new Base32EncoderStream({ format, output: "bytes" }));

    assertEquals(
      await toBytes(readable),
      new TextEncoder().encode(
        encodeBase32(
          await Deno.readFile("./deno.lock"),
          format,
        ),
      ),
      format,
    );
  }
});

Deno.test("Base32DecoderStream() with normal format", async () => {
  for (const format of ["Base32", "Base32Hex", "Base32Crockford"] as const) {
    const readable = (await Deno.open("./deno.lock"))
      .readable
      .pipeThrough(new Base32EncoderStream({ format, output: "string" }))
      .pipeThrough(new TextEncoderStream())
      .pipeThrough(new FixedChunkStream(1021))
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new Base32DecoderStream({ format, input: "string" }));

    assertEquals(
      await toBytes(readable),
      await Deno.readFile("./deno.lock"),
    );
  }
});

Deno.test("Base32DecoderStream() with raw format", async () => {
  for (
    const format of [
      "Base32",
      "Base32Hex",
      "Base32Crockford",
    ] as const
  ) {
    const readable = (await Deno.open("./deno.lock"))
      .readable
      .pipeThrough(new Base32EncoderStream({ format, output: "bytes" }))
      .pipeThrough(new FixedChunkStream(1021))
      .pipeThrough(new Base32DecoderStream({ format, input: "bytes" }));

    assertEquals(
      await toBytes(readable),
      await Deno.readFile("./deno.lock"),
    );
  }
});

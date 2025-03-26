// Copyright 2018-2025 the Deno authors. MIT license.

import { stringify } from "./mod.ts";
import { assertEquals } from "@std/assert";

Deno.test({
  name: "stringify() creates spaces around equal sign with pretty option",
  fn() {
    assertEquals(stringify({ a: "b" }, { pretty: true }), "a = b");
  },
});

Deno.test({
  name: "stringify() creates section header with nested object",
  fn() {
    assertEquals(
      stringify({ keyA: "1977-05-25", section1: { keyA: 100 } }),
      "keyA=1977-05-25\n[section1]\nkeyA=100",
    );
  },
});

Deno.test({
  name: "stringify() handles replacer option",
  fn() {
    assertEquals(
      stringify(
        { a: new Date("1977-05-25") },
        { replacer: (_, val) => val?.toJSON() },
      ),
      "a=1977-05-25T00:00:00.000Z",
    );
    assertEquals(
      stringify(
        { dates: { a: new Date("1977-05-25") } },
        { replacer: (_, val) => val?.toJSON() },
      ),
      "[dates]\na=1977-05-25T00:00:00.000Z",
    );
  },
});
Deno.test({
  name: "stringify() handles number value",
  fn() {
    assertEquals(stringify({ a: 100 }), "a=100");
    assertEquals(stringify({ a: 100 }, { pretty: true }), "a = 100");
  },
});

Deno.test({
  name: "stringify() handles string value",
  fn() {
    assertEquals(stringify({ a: "b" }), "a=b");
    assertEquals(stringify({ a: "123foo" }), "a=123foo");
    assertEquals(stringify({ a: "foo" }), "a=foo");
  },
});

Deno.test({
  name: "stringify() handles boolean value",
  fn() {
    assertEquals(stringify({ a: true }), "a=true");
    assertEquals(stringify({ a: false }), "a=false");
  },
});

Deno.test({
  name: "stringify() handles null and undefined value",
  fn() {
    assertEquals(stringify({ a: null }), "a=null");
    assertEquals(stringify({ a: undefined }), "a=undefined");
  },
});

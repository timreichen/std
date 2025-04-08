// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

// deno-lint-ignore deno-style-guide/exported-function-args-maximum
export function exponentialBackoffWithJitter(
  cap: number,
  base: number,
  attempt: number,
  multiplier: number,
  jitter: number,
) {
  const exp = Math.min(cap, base * multiplier ** attempt);
  return (1 - jitter * Math.random()) * exp;
}

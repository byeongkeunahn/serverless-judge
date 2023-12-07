import API from "./wasm-clang/shared.js";

export async function runCpp(src, stdin, argv) {
  let stdout = [];
  const options = {
    async readBuffer(filename) {
      const response = await fetch(filename);
      return response.arrayBuffer();
    },

    async compileStreaming(filename) {
      // TODO: make compileStreaming work. It needs the server to use the
      // application/wasm mimetype.
      if (false && WebAssembly.compileStreaming) {
        return WebAssembly.compileStreaming(fetch(filename));
      } else {
        const response = await fetch(filename);
        return WebAssembly.compile(await response.arrayBuffer());
      }
    },

    hostWrite(str) { stdout.push(str); },

    "stdinStr": new TextDecoder('utf8').decode(stdin),
    "memfs": "lib/wasm-clang/memfs",
    "sysroot": "lib/wasm-clang/sysroot.tar",
    "clang": "lib/wasm-clang/clang.wasm",
    "lld": "lib/wasm-clang/lld.wasm"
  };
  const api = new API(options);
  try {
    const exitCode = await api.compileLinkRun(src);
  } catch(err) {
  }
  return stdout.join("");
}
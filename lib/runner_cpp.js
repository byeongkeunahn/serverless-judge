import API from "./wasm-clang/shared.js";

let wasm_id = 0;

export async function getCppRunner(src, argv) {
  let stdout = [];
  let logmsg = [];
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

    hostWrite(str) {
      logmsg.push(str);
      if (!str.startsWith('\x1b')) {
        stdout.push(str);
      }
    },

    "memfs": "lib/wasm-clang/memfs.wasm",
    "sysroot": "lib/wasm-clang/sysroot.tar",
    "clang": "lib/wasm-clang/clang.wasm",
    "lld": "lib/wasm-clang/lld.wasm"
  };
  const api = new API(options);
  const wasm_name = wasm_id.toString();
  wasm_id += 1;
  try {
    const runner = await api.compileLinkGetRunner(src, wasm_name);
    return async (stdin) => {
      try {
        stdout.splice(0, stdout.length); // reset stdout to be sure
        const exitCode = await runner(new TextDecoder('utf8').decode(stdin));
      } catch(err) {
        throw new Error(String(err) + "\n\nLog:\n" + logmsg.join(""));
      }
      const output = stdout.join("");
      stdout.splice(0, stdout.length); // reset stdout
      return output;
    };
  } catch(err) {
    throw new Error(String(err) + "\n\nLog:\n" + logmsg.join(""));
  }
}

export async function runCpp(src, stdin, argv) {
  const runner = await getCppRunner(src, argv);
  return await runner(stdin);
}
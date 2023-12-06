import init, { pyExec } from "./rustpython/rustpython_wasm.js";

let loaded = false;

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return '\\x' + ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

window.runSolution = async function runSolution(src, stdin) {
  if (!loaded) {
    loaded = true;
    await init();
  }
  let stdout = [];
  const write_stdout = (str) => {
	stdout.push(str);
  }
  let prefix = String.raw`import io
import sys
sys.stdin = io.StringIO("` + toHexString(stdin) + String.raw`")
sys.stderr = None
del io
del sys
__name__ = "__main__"
quit = exit
`
  try {
    pyExec(prefix + src, { "stdout": write_stdout });
  } catch (err) {
    /* we catch the error here for SystemExit */
    if (err.name != "SystemExit") {
      throw err;
    }
  }
  return stdout.join("");
}
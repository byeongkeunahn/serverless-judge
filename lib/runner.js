import init, { vmStore } from "./rustpython/rustpython_wasm.js";

let loaded = false;
let vm_count = 0;

export async function createPythonVm() {
  if (!loaded) {
    await init();
    loaded = true;
  }
  const vm_id = vm_count.toString();
  vm_count += 1;
  const vm = vmStore.init(vm_id, false);
  return [vm_id, vm];
}

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return '\\x' + ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

window.runSolution = async function runSolution(src, stdin) {
  const [vm_id, vm] = await createPythonVm();
  let stdout = [];
  vm.setStdout((str) => {
    stdout.push(str);
  });
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
    vm.exec(prefix + src);
  } catch (err) {
    /* we catch the error here for SystemExit */
    if (err.name != "SystemExit") {
      throw err;
    }
  } finally {
     vmStore.destroy(vm_id);
  }
  return stdout.join("");
}
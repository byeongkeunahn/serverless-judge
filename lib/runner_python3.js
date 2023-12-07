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
  if (byteArray == undefined || byteArray == null) {
    return '';
  }
  return Array.from(byteArray, function(byte) {
    return '\\x' + ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

export async function runPython3(src, stdin, argv) {
  const [vm_id, vm] = await createPythonVm();
  let stdout = [];
  vm.setStdout((str) => {
    stdout.push(str);
  });
  const my_argv = ["main.py"];
  if (argv) {
    for (var i = 0; i < argv.length; i++) {
      my_argv.push(argv[i].toString());
    }
  }
  vm.addToScope("my_argv", my_argv);
  let prefix = String.raw`import io
import sys
sys.stdin = io.StringIO("` + toHexString(stdin) + String.raw`")
sys.stderr = None
sys.argv = my_argv
del my_argv
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
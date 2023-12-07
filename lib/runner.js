import { runPython3 } from "./runner_python3.js";
import { runCpp } from "./runner_cpp.js";

export function createRunner(language, src, argv) {
  if (language == "python3") {
    return function (stdin) {
      return runPython3(src, stdin, argv);
    };
  } else if (language == "cpp") {
    return function (stdin) {
      return runCpp(src, stdin, argv);
    };
  }
  throw Error("Unsupported language \"" + language.toString() + "\"");
}
window.runSolution = async function runSolution(language, src, stdin, argv) {
  const runner = createRunner(language, src, argv);
  return runner(stdin);
}
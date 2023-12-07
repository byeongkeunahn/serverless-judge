import { runPython3 } from "./runner_python3.js";

export function createRunner(language, src, argv) {
  if (language == "python3") {
    return function (stdin) {
      return runPython3(src, stdin, argv);
    };
  }
  throw Error("Unsupported language \"" + language.toString() + "\"");
}
window.runSolution = async function runSolution(language, src, stdin, argv) {
  const runner = createRunner(language, src, argv);
  return runner(stdin);
}
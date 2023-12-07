import { runPython3 } from "./runner_python3.js";
import { getCppRunner, runCpp } from "./runner_cpp.js";

export async function createRunner(language, src, argv) {
  if (language == "python3") {
    return async function (stdin) {
      return runPython3(src, stdin, argv);
    };
  } else if (language == "cpp") {
    return await getCppRunner(src, argv);
  }
  throw Error("Unsupported language \"" + language.toString() + "\"");
}
window.runSolution = async function runSolution(language, src, stdin, argv) {
  const runner = await createRunner(language, src, argv);
  return await runner(stdin);
}
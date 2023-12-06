function canonicalize(str) {
  return str.split();
}
function check_equal(x, y) {
  if (x.length != y.length) return false;
  for (var i = 0; i < x.length; i++) {
    if (x[i] != y[i]) return false;
  }
  return true;
}

window.judgeSolution = async function judgeSolution(src, manifest) {
  const solver = await fetch(manifest.solver.name).then((response) => response.text());
  for (const test of manifest.tests) {
    const input_str = await fetch(test.path).then((response) => response.text()).then((out) => out.replace("\r", ""));
    const input = new TextEncoder('utf8').encode(input_str);
    const correct_answer_str = await window.runSolution(solver, input);
    const output_str = await window.runSolution(src, input);
	const correct_answer = canonicalize(correct_answer_str);
    const output = canonicalize(output_str);
    if (!check_equal(correct_answer, output)) {
      return {
        "verdict": false,
        "input": input_str,
        "correct_answer": correct_answer_str,
        "output": output_str
      };
    }
  }
  return {
    "verdict": true
  };
}
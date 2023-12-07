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

async function judgeSolutionSingle(solver, src, input_str) {
  const input = new TextEncoder('utf8').encode(input_str);
  const correct_answer_str = await window.runSolution(solver, input);
  let output_str = "";
  try {
    output_str = await window.runSolution(src, input);
  } catch (err) {
    return {
      "verdict": false,
      "input": input_str,
      "correct_answer": correct_answer_str,
      "output": "Program exited with runtime error:\n" + String(err)
    };
  }
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
  return {
    "verdict": true
  };
}

window.judgeSolution = async function judgeSolution(src, manifest) {
  const solver = await fetch(manifest.solver.name).then((response) => response.text());
  for (const test of manifest.tests) {
    if (test.type == "static") {
      const input_str = await fetch(test.path).then((response) => response.text()).then((out) => out.replace("\r", ""));
      const result = await judgeSolutionSingle(solver, src, input_str);
      if (!result.verdict) {
        return result;
      }
    } else if (test.type == "dynamic") {
      const generator = await fetch(test.path).then((response) => response.text());
      const input_str = await window.runSolution(generator, null, test.argv);
      const result = await judgeSolutionSingle(solver, src, input_str);
      if (!result.verdict) {
        return result;
      }
    } else /* test.type == "stress" */ {
      const generator = await fetch(test.path).then((response) => response.text());
      for (var i = 0; i < test.max_try_count; i++) {
        const input_str = await window.runSolution(generator, null);
        const result = await judgeSolutionSingle(solver, src, input_str);
        if (!result.verdict) {
          return result;
        }
      }
    }
  }
  return {
    "verdict": true
  };
}
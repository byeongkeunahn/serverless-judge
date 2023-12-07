function encode_utf8(str) {
  return new TextEncoder('utf8').encode(str);
}
function canonicalize(str) {
  return str.split(/\s+/);
}
function check_equal(x, y) {
  if (x.length != y.length) return false;
  for (var i = 0; i < x.length; i++) {
    if (x[i] != y[i]) return false;
  }
  return true;
}
function abbreviate(str, max_length) {
  if (str.length > max_length) {
    return str.substring(0, max_length) + "...(" + (str.length - max_length).toString() + " more characters)";
  } else {
    return str;
  }
}

async function judgeSolutionSingle(solver, src, input_str) {
  const input = encode_utf8(input_str);
  const correct_answer_str = await window.runSolution(solver, input);
  let output_str = "";
  try {
    output_str = await window.runSolution(src, input);
  } catch (err) {
    return {
      "verdict": false,
      "input": abbreviate(input_str, 1024),
      "correct_answer": abbreviate(correct_answer_str, 1024),
      "output": "Program exited with runtime error:\n" + abbreviate(String(err), 2048)
    };
  }
  const correct_answer = canonicalize(correct_answer_str);
  const output = canonicalize(output_str);
  if (!check_equal(correct_answer, output)) {
    return {
      "verdict": false,
      "input": abbreviate(input_str, 1024),
      "correct_answer": abbreviate(correct_answer_str, 1024),
      "output": abbreviate(output_str, 1024),
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
        const input_str = await window.runSolution(generator, encode_utf8(i.toString()));
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
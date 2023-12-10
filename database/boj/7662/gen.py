import random
import sys
test_cases = int(sys.argv[1])
use_large_num = int(sys.argv[2]) == 1

def generate():
  if random.randint(0, 1) == 0:
    P = random.randint(6, 7)
    if use_large_num and random.randint(0, 9) < 3:
      OFFSET = random.randint(-(2**31), (2**31) - 1 - P)
    else:
      OFFSET = random.randint(-4, -3)
    MIN, MAX = OFFSET, OFFSET + P
  else:
    MIN, MAX = -(2**31), (2**31) - 1
  queries = random.randint(1, 100)
  input_str = ["{0}\n".format(queries)]
  for _ in range(queries):
    t = random.randint(0, 1)
    if t == 0:
      input_str.append("I {0}\n".format(random.randint(MIN, MAX)))
    else:
      input_str.append("D {0}\n".format(random.randint(0, 1) * 2 - 1))
  return "".join(input_str)

out = ["{0}\n".format(test_cases)]
for _ in range(test_cases):
  out.append(generate())
out = "".join(out)
print(out)
import random
import sys
test_cases = int(sys.argv[1])
out = ["{0}\n".format(test_cases)]
for _ in range(test_cases):
  a = random.randint(1, 100)
  b = random.randint(1, 1_000_000)
  out.append("{0} {1}\n".format(a, b))
out = "".join(out)
print(out)
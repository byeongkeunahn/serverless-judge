import random
import sys

thresh = random.randint(1, 9)

def rand_char():
  t = random.randint(0, 9)
  out1 = " " if t < thresh else ""
  out2 = chr(ord('A') + random.randint(0, 1) * (ord('a') - ord('A')) + random.randint(0, 25))
  return out1 + out2

out_len_target = random.randint(1, int(sys.argv[1]))
out, out_len = [], 0
while out_len < out_len_target:
  x = rand_char()
  out.append(x)
  out_len += len(x)

out = "".join(out)[:out_len_target]
if random.randint(0, 9) < thresh and out[-1] != ' ':
  if len(out) == 1:
    out = " "
  elif out[-2] == ' ':
    out = out[:-2] + out[-1] + out[-2]
  else:
    out = out[-1] + ' '
print(out)
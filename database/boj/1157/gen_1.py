import string
import random
n = random.randint(1, 101)
out = []
for _ in range(n):
    c = random.choice(string.ascii_letters)
    out.append(c)
print("".join(out))
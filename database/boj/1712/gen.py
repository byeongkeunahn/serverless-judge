import math
import random

def rand_interval_exp(min_val, max_val):
    out = random.uniform(math.log(min_val) - 1e-4, math.log(max_val) + 1e-4)
    out = int(math.exp(out))
    out = min(out, max_val)
    out = max(out, min_val)
    return out

MIN, MAX = 1, 21 * 10**8
t = random.randint(0, 9)
if t < 3:
    MAX = 10**4

A = rand_interval_exp(MIN, MAX)
B = rand_interval_exp(MIN, MAX)
C = rand_interval_exp(MIN, MAX)

test_type = random.randint(0, 5)
if test_type == 0:
    pass
elif test_type == 1:
    C = B
elif test_type == 2:
    if B == MAX:
        B -= 1
    C = rand_interval_exp(B + 1, MAX)
elif test_type == 3:
    if B == 1:
        B += 1
    C = rand_interval_exp(1, B - 1)
elif test_type == 4:
    B = rand_interval_exp(1, 1_000_000)
    C = rand_interval_exp(B + 1, MAX)
    delta = C - B
    A = rand_interval_exp(1, MAX // delta) * delta
elif test_type == 5:
    A = rand_interval_exp(MAX // 10, MAX)
    B = rand_interval_exp(MAX // 10, MAX)
    C = rand_interval_exp(max(B - 10_000, MIN), min(B + 10_000, MAX))

print(A, B, C)
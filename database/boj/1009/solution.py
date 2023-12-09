A, A_index = [], 0
def n():
  global A, A_index
  while len(A) == A_index:
    A, A_index = [int(x) for x in input().split() if len(x.strip()) > 0], 0
  out = A[A_index]
  A_index += 1
  return out

test_cases = n()
for _ in range(test_cases):
  a, b = n() % 10, n()
  if b >= 5:
    b -= (b - 5) // 4 * 4
  out = 1
  for _ in range(b):
    out *= a
  out %= 10
  if out == 0:
    out = 10
  print(out)
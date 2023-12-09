A, B, C = [int(x) for x in input().split() if len(x.strip()) > 0]
if B >= C:
  print(-1)
else:
  delta = C - B
  print(A // delta + 1)
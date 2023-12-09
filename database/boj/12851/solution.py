from collections import deque

N, K = map(int, input().split())
max_len = min(200_001, max(N, K) * 2 + 1)
dist = [200_001 for _ in range(max_len)]
cnt = [0 for _ in range(max_len)]

q = deque()
dist[N] = 0
cnt[N] = 1
q.append((dist[N], N))

while len(q) > 0:
  dist_x, x = q.popleft()
  if dist_x > dist[x]:
    continue
  ys = []
  if x - 1 >= 0:
    ys.append(x - 1)
  if x + 1 < len(dist):
    ys.append(x + 1)
  if 2 * x < len(dist):
    ys.append(2 * x)
  for y in ys:
    dist_y = dist[x] + 1
    if dist_y < dist[y]:
      dist[y], cnt[y] = dist_y, cnt[x]
      q.append((dist[y], y))
    elif dist_y == dist[y]:
      cnt[y] += cnt[x]

print(dist[K])
print(cnt[K])
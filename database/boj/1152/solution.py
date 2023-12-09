x = input()
ans = 0
was_space = True
for c in x:
  is_space = ord(c) <= 32
  if was_space and not is_space:
    ans += 1
  was_space = is_space
print(ans)
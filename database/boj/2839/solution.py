n = int(input().strip())
if n >= 15:
    decrement = n // 15 - 1
else:
    decrement = 0
n, ans = n - 15 * decrement, decrement * 3
for cnt_5kg in reversed(range(6)):
    for cnt_3kg in range(10):
        if n == 3 * cnt_3kg + 5 * cnt_5kg:
            ans += cnt_3kg
            ans += cnt_5kg
            print(ans)
            exit()
print(-1)
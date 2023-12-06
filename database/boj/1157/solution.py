x = input().strip().upper()
occurrence = dict()
max_val = 0
for c in x:
    if c in occurrence:
        occurrence[c] += 1
    else:
        occurrence[c] = 1
    max_val = max(max_val, occurrence[c])
argmax = None
for c in occurrence:
    if occurrence[c] == max_val:
        if argmax is not None:
            print("?")
            exit()
        argmax = c
print(argmax)
import sys
out = []
for i in range(1, len(sys.argv), 2):
    if i + 1 >= len(sys.argv):
        break
    out.append(sys.argv[i] * int(sys.argv[i + 1]))
out = "".join(out)
print(out)
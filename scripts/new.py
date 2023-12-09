import shutil
import sys

if len(sys.argv) != 2:
    print("Usage: python3 scripts/new.py path/to/new/problem")
    exit()

path = "database/" + sys.argv[1]
shutil.copytree("scripts/new-template", path)
print("Created {0}".format(path))

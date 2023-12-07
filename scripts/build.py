import copy
import json
import os
import shutil

def build(src, dst):
    print(src, dst)
    manifest_path = "/".join([src, "manifest.json"])
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    output = {}
    for k, v in manifest.items():
        match k:
            case "metadata" | "cfg" | "judge":
                output[k] = copy.deepcopy(v)
            case "solver":
                output[k] = copy.deepcopy(v)
                output[k]["name"] = "/".join([src, output[k]["name"]])
            case "tests":
                output[k] = []
                for test in v:
                    match test["type"]:
                        case "static":
                            if "auto-discovery" in test and test["auto-discovery"]:
                                for d in os.listdir(src):
                                    dd = "/".join([src, d])
                                    if os.path.isfile(dd) and d.startswith("data"):
                                        output[k].append({ "type": "static", "path": dd })
                            else:
                                x = copy.deepcopy(test)
                                x["path"] = "/".join([src, x["path"]])
                                output[k].append(x)
                        case "dynamic" | "stress":
                            x = copy.deepcopy(test)
                            x["path"] = "/".join([src, x["path"]])
                            output[k].append(x)
                        case _:
                           raise Exception("build: {0} contains invalid test type \"{1}\"".format(manifest_path, test["type"]))
            case _:
                raise Exception("build: {0} contains invalid key \"{1}\"".format(manifest_path, k))
    with open("/".join([dst, "manifest.json"]), 'w') as f:
        f.write(json.dumps(output, indent=4))

def discover(src, dst):
    os.makedirs(dst, exist_ok=True)
    manifest_path = os.path.join(src, "manifest.json")
    if os.path.isfile(manifest_path):
        build(src, dst)
    else:
        for f in os.listdir(src):
            g = "/".join([src, f])
            if os.path.isdir(g):
                discover(g, "/".join([dst, f]))

def run(src, dst):
    shutil.rmtree(dst)
    os.mkdir(dst)
    discover(src, dst)

if __name__ == "__main__":
    run("database", "database-compiled")
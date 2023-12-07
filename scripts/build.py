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
    compiled_manifest_path = "/".join([dst, "manifest.json"])
    with open(compiled_manifest_path, 'w') as f:
        f.write(json.dumps(output, indent=4))
    return '    <a href="judge.html?manifest={0}">Test for {1}</a><br>\n'.format(compiled_manifest_path, output["metadata"]["src"])

def discover(src, dst):
    out = []
    os.makedirs(dst, exist_ok=True)
    manifest_path = os.path.join(src, "manifest.json")
    if os.path.isfile(manifest_path):
        out.append(build(src, dst))
    else:
        for f in os.listdir(src):
            g = "/".join([src, f])
            if os.path.isdir(g):
                out += discover(g, "/".join([dst, f]))
    return out

def run(src, dst):
    shutil.rmtree(dst)
    os.mkdir(dst)
    out = discover(src, dst)
    with open("scripts/index-template.html", 'r') as f:
        index_template = f.read()
    index_template = index_template.replace("$$$$judge_list$$$$", "".join(out))
    with open("index.html", "w") as f:
        f.write(index_template)

if __name__ == "__main__":
    run("database", "database-compiled")
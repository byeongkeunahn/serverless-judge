# serverless-judge
 Client-based implementation of online judge.

 To use this web application, please visit [https://serverless-judge.github.io/](https://serverless-judge.github.io/).

## Contribution guide
 1. Fork this repository.
 2. Prepare a Python 3 environment with version 3.11 or greater.
 3. Run `python3 scripts/new.py path/to/new/problem`. For Baekjoon Online Judge problems, please use `python3 scripts/new.py boj/1000` with `1000` replaced with the problem number.
 4. Add a solution and input data. You can reference existing solutions and data to figure out how to do this.
 5. Run `python3 scripts/build.py`. Please make sure that the build succeeds and that the newly written judge works on your local environment. One way to do this is to open the local repository's root folder in Visual Studio Code, install the `Live Server` extension, and click `Go Live` on the right bottom. The newly written judge should appear on the website root (index.html).
 6. Commit, push, and create a pull request on this repository.
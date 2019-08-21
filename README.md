# Exercise solutions

The solutions are divided into 3 files:

- General => [main.rs](src/main.rs)
- Python => [ipython notebook](src/Python Programming Tests.ipynb) or
  [exported python source code](src/PythonProgrammingTests.py)
- JavaScript => [question.js](src/question.js)

Please read the source codes to get the detail of my solutions.


## General

The solution is implemented in rust, so you can run the test with `cargo test`.
You can write your own test cases in the test module at the bottom of the
[main.rs](src/main.rs) to check the correctness.

If you don't have `rust` installed, you can follow
https://www.rust-lang.org/tools/install to install rust.

Note: I have used 1 third party library for the big number operation since the
calculation of first 100 Fibonacci even number is too large to be stored in the
primitive integer data type. To avoid integer overflow, I use `rug` for the big
number calculation.


## Python

The solution is written in ipython notebook (`jupyter`) with `python3` and
setting that up with `pipenv`. You can follow [pipenv
doc](https://docs.pipenv.org/en/latest/install/#installing-pipenv) for the
installation of pipenv if you don't have one installed.

Once you have `pipenv`, run the following command to start the notebook server

```sh
# Install dependencies, i.e. jupyter
$ pipenv install

# Start the jupyter server
$ pipenv run jupyter notebook

# Follow the instruction of the output to open the notebook and check the
# solutions
```

Or just open the [ipython notebook](src/Python Programming Tests.ipynb) file or
[exported python source code](src/PythonProgrammingTests.py) file to read the
source codes.


## JavaScript

Open the [index.html](src/index.html) file with your browser to check the
output. The implementation details is in the [question.js](src/question.js)
file.

It is written in plain-old-Javascript.

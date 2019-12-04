# 🔬👷Testing all my npm packages

[![Build Status](https://travis-ci.org/ayonious/my-npm-packages-tester.svg?branch=master)](https://travis-ci.org/ayonious/my-npm-packages-tester)


Just testing all my npm packages directly downloading them from npmjs.
Nothing better than a real end to end testing.


## How this works

* This is a project that has all my npmjs packages as dependency. And in the tests I have written all the important tests of all my npmjs packages.

* Every time there is a npmjs package update(in any of my npmpjs packages), this repo will update that package (using renovate bot) and trigger a PR.

* If the pr succeeds, it will be merged and means all was good. No action needed from me anymore :)

* If the pr fails, I will see the email and know something went wrong. Gotta fix it manually then

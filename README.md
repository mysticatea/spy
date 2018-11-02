# @mysticatea/spy

[![npm version](https://img.shields.io/npm/v/@mysticatea/spy.svg)](https://www.npmjs.com/package/@mysticatea/spy)
[![Downloads/month](https://img.shields.io/npm/dm/@mysticatea/spy.svg)](http://www.npmtrends.com/@mysticatea/spy)
[![Build Status](https://travis-ci.com/mysticatea/spy.svg?branch=master)](https://travis-ci.org/mysticatea/spy)
[![Coverage Status](https://codecov.io/gh/mysticatea/spy/branch/master/graph/badge.svg)](https://codecov.io/gh/mysticatea/spy)
[![Dependency Status](https://david-dm.org/mysticatea/spy.svg)](https://david-dm.org/mysticatea/spy)

A spy library for TypeScript.


## 💿 Installation

Use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/).

```bash
npm install --save-dev @mysticatea/spy
```

**Requirements:**

- Node.js 6.0.0 and over.
- TypeScript 3.1 and over.


## 📖 Usage

```ts
import { spy } from "@mysticatea/spy"

//------------------------------------------------------------------------------
// Create a spy function.
const func1 = spy()

// Call it.
func1()

// Check it.
console.log(func1.calls.length) //→ 1
console.log(func1.calls[0]) //→ { type: "return", this: undefined, arguments: [], return: undefined }
console.log(func1.returnedCalls.length) //→ 1
console.log(func1.returnedCalls[0]) //→ { type: "return", this: undefined, arguments: [], return: undefined }
console.log(func1.thrownCalls.length) //→ 0

//------------------------------------------------------------------------------
// Create a spy function with that behavior.
const func2 = spy((value: number): string => {
    if (value < 0) {
        throw new Error("oops!")
    }
    return String(value)
})
// func2 is `(value: number) => string` and some additional properties.

// Call it.
const retv2 = func2(777)
try { func2(-1) } catch { /*ignore*/ }

// Check it.
console.log(retv2) //→ "777"
console.log(func2.calls.length) //→ 2
console.log(func2.calls[0]) //→ { type: "return", this: undefined, arguments: [1], return: "1" }
console.log(func2.calls[1]) //→ { type: "throw", this: undefined, arguments: [-1], throw: [object Error] }
console.log(func2.returnedCalls.length) //→ 1
console.log(func2.returnedCalls[0]) //→ { type: "return", this: undefined, arguments: [1], return: "1" }
console.log(func2.thrownCalls.length) //→ 1
console.log(func2.thrownCalls[0]) //→ { type: "throw", this: undefined, arguments: [-1], throw: [object Error] }
```


## 📚 API Reference

### s = spy(func?)

**Parameters:**

Name | Type | Description
:----|:-----|:------------
`TThis` | `*` | This is a type parameter which should be inferred as the `this` type of `func`. If `func` is omitted, this is `undefined`.
`TArguments` | `* extends any[]` | This is a type parameter which should be inferred as the arguments type of `func`. If `func` is omitted, this is `[]`.
`TReturn` | `*` | This is a type parameter which should be inferred as the return type of `func`. If `func` is omitted, this is `void`.
`func` | `((this: TThis, ...args: TArguments) => TReturn)|undefined` | Optional behavior of the spy.

**Return value:**

Name | Type | Description
:----|:-----|:------------
- | [Spy<TThis, TArguments, TReturn>](src/index.ts#L2) | The created spy function.

The created spy function has the type `(this: TThis, ...args: TArguments) => TReturn`. This should be the same type of `func`.

**Details:**

Create a spy function.

The spy function will record the call information of itself.
You can access the information with `calls` property and something like.

See below for spy's properties.

### s.calls

The array of call information.

The element of this array has the following properties:

Name | Type | Description
:----|:-----|:------------
`type` | `string` | The result type of this call. If the behavior of this spy has thrown an error, this is `"throw"`. Otherwise, this is `"return"`.
`this` | `TThis` | The `this` value of this call.
`arguments` | `TArguments` | The arguments of this call.
`return` | `TReturn` | The return value of this call. This exists only if `type === "return"`.
`throw` | `any` | The thrown value of this call. This exists only if `type === "throw"`.

### s.firstCall

This is equivalent to `s.calls[0]`.

### s.lastCall

This is equivalent to `s.calls[s.calls.length - 1]`.

### s.returnedCalls

The array of call information, only the call which returned a value successfully.

This is equivalent to `s.calls.filter(c => c.type === "return")`.

### s.firstReturnedCall

This is equivalent to `s.returnedCalls[0]`.

### s.lastReturnedCall

This is equivalent to `s.returnedCalls[s.returnedCalls.length - 1]`.

### s.thrownCalls

The array of call information, only the call which threw an error.

This is equivalent to `s.calls.filter(c => c.type === "throw")`.

### s.firstThrownCall

This is equivalent to `s.thrownCalls[0]`.

### s.lastThrownCall

This is equivalent to `s.thrownCalls[s.thrownCalls.length - 1]`.

### s.reset()

Clear the `s.calls` in order to reuse this spy.


## ⚠️ Known Issues

### TypeScript cannot infer the `this` type of methods

```ts
const box = {
    value: 0,
    set(value: number): void {
        this.value = value
    },
}

const f = spy(box.set)
f.calls[0].this //→ inferred to `{}` rather than `typeof box`!

// Workaround:
const f1 = spy<(this: typeof box, value: number) => void>(box.set)
f.calls[0].this //→ correct `typeof box`.
```


## 📰 Changelog

- [GitHub Releases](https://github.com/mysticatea/spy/releases)


## 🍻 Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

### Development Tools

- `npm test` runs tests and measures coverage.
- `npm run build` compiles TypeScript source code into `dist` directory.
- `npm run clean` removes the temporary files which are created by `npm test` and `npm run build`.
- `npm run lint` runs ESLint.
- `npm run watch` runs tests with `--watch` option.

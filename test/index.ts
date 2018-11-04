import assert from "assert"
import { spy } from "../src"

describe("'spy' function", () => {
    it("should return a function.", () => {
        const f = spy()
        f()
        assert.strictEqual(typeof f, "function")
    })

    it("should return a function which calls the given function.", () => {
        let called = false
        const f = spy(() => {
            called = true
        })
        f()
        assert.strictEqual(called, true)
    })

    it("should return a function which calls the given method.", () => {
        const box = {
            value: 0,
            set(value: number): void {
                this.value = value
            },
        }
        box.set = spy(box.set)

        box.set(1)
        assert.strictEqual(box.value, 1)
    })

    it("should return a function which return the return value of the given function.", () => {
        const f = spy(() => 777)
        const retv = f()
        assert.strictEqual(retv, 777)
    })

    it("should return a function which throw the thrown error of the given function.", () => {
        const f = spy(() => {
            throw 666 //eslint-disable-line no-throw-literal
        })
        let error: any = undefined
        try {
            f()
        } catch (e) {
            error = e
        }
        assert.strictEqual(error, 666)
    })
})

describe("'Spy' object:", () => {
    describe("'calls' property", () => {
        it("should be an array.", () => {
            const f = spy()
            assert(Array.isArray(f.calls))
        })

        it("should be empty before calling the spy.", () => {
            const f = spy()
            assert.strictEqual(f.calls.length, 0)
        })

        it("should contain call information after called one time.", () => {
            const f = spy()
            f()
            assert.strictEqual(f.calls.length, 1)
            assert.deepStrictEqual(f.calls[0], {
                type: "return",
                this: undefined,
                arguments: [],
                return: undefined,
            })
        })

        it("should contain call information after called one time -- with args.", () => {
            const f = spy()
            f.call(1, 2, 3)
            assert.strictEqual(f.calls.length, 1)
            assert.deepStrictEqual(f.calls[0], {
                type: "return",
                this: 1,
                arguments: [2, 3],
                return: undefined,
            })
        })

        it("should contain call information after called one time -- with args and return value.", () => {
            const f = spy(() => -1)
            f.call(1, 2, 3)
            assert.strictEqual(f.calls.length, 1)
            assert.deepStrictEqual(f.calls[0], {
                type: "return",
                this: 1,
                arguments: [2, 3],
                return: -1,
            })
        })

        it("should contain call information after called two times -- with args and return value.", () => {
            const f = spy(() => -1)
            f.call(1, 2, 3)
            f.call(4, 5)
            assert.strictEqual(f.calls.length, 2)
            assert.deepStrictEqual(f.calls[0], {
                type: "return",
                this: 1,
                arguments: [2, 3],
                return: -1,
            })
            assert.deepStrictEqual(f.calls[1], {
                type: "return",
                this: 4,
                arguments: [5],
                return: -1,
            })
        })

        it("should contain call information regardless returned or thrown.", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            f(false)
            try {
                f(true)
            } catch {
                // ignore
            }
            assert.strictEqual(f.calls.length, 2)
            assert.deepStrictEqual(f.calls[0], {
                type: "return",
                this: undefined,
                arguments: [false],
                return: 1,
            })
            assert.deepStrictEqual(f.calls[1], {
                type: "throw",
                this: undefined,
                arguments: [true],
                throw: -1,
            })
        })
    })

    describe("'firstCall' property", () => {
        it("should be null before calling the spy.", () => {
            const f = spy()
            assert.strictEqual(f.firstCall, null)
        })

        it("should be 'f.calls[0]' after calling the spy one time.", () => {
            const f = spy()
            f()
            assert.strictEqual(f.firstCall, f.calls[0])
        })

        it("should be 'f.calls[0]' after calling the spy two times.", () => {
            const f = spy()
            f()
            f()
            assert.strictEqual(f.firstCall, f.calls[0])
        })
    })

    describe("'lastCall' property", () => {
        it("should be null before calling the spy.", () => {
            const f = spy()
            assert.strictEqual(f.lastCall, null)
        })

        it("should be 'f.calls[f.calls.length - 1]' after calling the spy one time.", () => {
            const f = spy()
            f()
            assert.strictEqual(f.lastCall, f.calls[f.calls.length - 1])
        })

        it("should be 'f.calls[f.calls.length - 1]' after calling the spy two times.", () => {
            const f = spy()
            f()
            f()
            assert.strictEqual(f.lastCall, f.calls[f.calls.length - 1])
        })
    })

    describe("'returnedCalls' property", () => {
        it("should be an array.", () => {
            const f = spy()
            assert(Array.isArray(f.returnedCalls))
        })

        it("should be empty before calling the spy.", () => {
            const f = spy()
            assert.strictEqual(f.returnedCalls.length, 0)
        })

        it("should contain call information that `call.type === 'return'` in `f.calls` after calling the spy one time.", () => {
            const f = spy()
            f()
            assert.strictEqual(f.returnedCalls.length, 1)
            assert.strictEqual(f.returnedCalls[0], f.calls[0])
        })

        it("should contain call information that `call.type === 'return'` in `f.calls` after calling the spy two times.", () => {
            const f = spy()
            f()
            f()
            assert.strictEqual(f.returnedCalls.length, 2)
            assert.strictEqual(f.returnedCalls[0], f.calls[0])
            assert.strictEqual(f.returnedCalls[1], f.calls[1])
        })

        it("should not contain call information that `call.type === 'throw'`.", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            f(false)
            try {
                f(true)
            } catch {
                // ignore
            }
            f(false)
            assert.strictEqual(f.calls.length, 3)
            assert.strictEqual(f.returnedCalls.length, 2)
            assert.strictEqual(f.returnedCalls[0], f.calls[0])
            assert.strictEqual(f.returnedCalls[1], f.calls[2])
        })

        it("should not contain call information that `call.type === 'throw'`. (2)", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            try {
                f(true)
            } catch {
                // ignore
            }
            f(false)
            try {
                f(true)
            } catch {
                // ignore
            }
            assert.strictEqual(f.calls.length, 3)
            assert.strictEqual(f.returnedCalls.length, 1)
            assert.strictEqual(f.returnedCalls[0], f.calls[1])
        })
    })

    describe("'firstReturnedCall' property", () => {
        it("should be null before calling the spy.", () => {
            const f = spy()
            assert.strictEqual(f.firstReturnedCall, null)
        })

        it("should be 'f.returnedCalls[0]' after calling the spy one time.", () => {
            const f = spy()
            f()
            assert.strictEqual(f.firstReturnedCall, f.returnedCalls[0])
        })

        it("should be 'f.returnedCalls[0]' after calling the spy two times.", () => {
            const f = spy()
            f()
            f()
            assert.strictEqual(f.firstReturnedCall, f.returnedCalls[0])
        })

        it("should be 'f.returnedCalls[0]' after calling the spy even if `f.calls[0]` was thrown.", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            try {
                f(true)
            } catch {
                // ignore
            }
            f(false)
            assert.strictEqual(f.firstReturnedCall, f.returnedCalls[0])
        })

        it("should be null after calling the spy even if all calls were thrown.", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            try {
                f(true)
            } catch {
                // ignore
            }
            try {
                f(true)
            } catch {
                // ignore
            }
            assert.strictEqual(f.firstReturnedCall, null)
        })
    })

    describe("'lastReturnedCall' property", () => {
        it("should be null before calling the spy.", () => {
            const f = spy()
            assert.strictEqual(f.lastReturnedCall, null)
        })

        it("should be 'f.returnedCalls[f.returnedCalls.length - 1]' after calling the spy one time.", () => {
            const f = spy()
            f()
            assert.strictEqual(
                f.lastReturnedCall,
                f.returnedCalls[f.returnedCalls.length - 1],
            )
        })

        it("should be 'f.returnedCalls[f.returnedCalls.length - 1]' after calling the spy two times.", () => {
            const f = spy()
            f()
            f()
            assert.strictEqual(
                f.lastReturnedCall,
                f.returnedCalls[f.returnedCalls.length - 1],
            )
        })

        it("should be 'f.returnedCalls[f.returnedCalls.length - 1]' after calling the spy even if `f.calls[f.calls.length - 1]` was thrown.", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            f(false)
            try {
                f(true)
            } catch {
                // ignore
            }
            assert.strictEqual(
                f.lastReturnedCall,
                f.returnedCalls[f.returnedCalls.length - 1],
            )
        })

        it("should be null after calling the spy even if all calls were thrown.", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            try {
                f(true)
            } catch {
                // ignore
            }
            try {
                f(true)
            } catch {
                // ignore
            }
            assert.strictEqual(f.lastReturnedCall, null)
        })
    })

    describe("'thrownCalls' property", () => {
        it("should be an array.", () => {
            const f = spy()
            assert(Array.isArray(f.thrownCalls))
        })

        it("should be empty before calling the spy.", () => {
            const f = spy()
            assert.strictEqual(f.thrownCalls.length, 0)
        })

        it("should contain call information that `call.type === 'throw'` in `f.calls` after calling the spy one time.", () => {
            const f = spy(() => {
                throw new Error()
            })
            try {
                f()
            } catch {
                // ignore
            }
            assert.strictEqual(f.thrownCalls.length, 1)
            assert.strictEqual(f.thrownCalls[0], f.calls[0])
        })

        it("should contain call information that `call.type === 'throw'` in `f.calls` after calling the spy two times.", () => {
            const f = spy(() => {
                throw new Error()
            })
            try {
                f()
            } catch {
                // ignore
            }
            try {
                f()
            } catch {
                // ignore
            }
            assert.strictEqual(f.thrownCalls.length, 2)
            assert.strictEqual(f.thrownCalls[0], f.calls[0])
            assert.strictEqual(f.thrownCalls[1], f.calls[1])
        })

        it("should not contain call information that `call.type === 'return'`.", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            try {
                f(true)
            } catch {
                // ignore
            }
            f(false)
            try {
                f(true)
            } catch {
                // ignore
            }
            assert.strictEqual(f.calls.length, 3)
            assert.strictEqual(f.thrownCalls.length, 2)
            assert.strictEqual(f.thrownCalls[0], f.calls[0])
            assert.strictEqual(f.thrownCalls[1], f.calls[2])
        })

        it("should not contain call information that `call.type === 'return'`. (2)", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            f(false)
            try {
                f(true)
            } catch {
                // ignore
            }
            f(false)
            assert.strictEqual(f.calls.length, 3)
            assert.strictEqual(f.thrownCalls.length, 1)
            assert.strictEqual(f.thrownCalls[0], f.calls[1])
        })
    })

    describe("'firstThrownCall' property", () => {
        it("should be null before calling the spy.", () => {
            const f = spy(() => {
                throw new Error()
            })
            assert.strictEqual(f.firstThrownCall, null)
        })

        it("should be 'f.thrownCalls[0]' after calling the spy one time.", () => {
            const f = spy(() => {
                throw new Error()
            })
            try {
                f()
            } catch {
                // ignore
            }
            assert.strictEqual(f.firstThrownCall, f.thrownCalls[0])
        })

        it("should be 'f.thrownCalls[0]' after calling the spy two times.", () => {
            const f = spy(() => {
                throw new Error()
            })
            try {
                f()
            } catch {
                // ignore
            }
            try {
                f()
            } catch {
                // ignore
            }
            assert.strictEqual(f.firstThrownCall, f.thrownCalls[0])
        })

        it("should be 'f.thrownCalls[0]' after calling the spy even if `f.calls[0]` was returned.", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            f(false)
            try {
                f(true)
            } catch {
                // ignore
            }
            assert.strictEqual(f.firstThrownCall, f.thrownCalls[0])
        })

        it("should be null after calling the spy even if all calls were returned.", () => {
            const f = spy()
            f()
            f()
            assert.strictEqual(f.firstThrownCall, null)
        })
    })

    describe("'lastThrownCall' property", () => {
        it("should be null before calling the spy.", () => {
            const f = spy(() => {
                throw new Error()
            })
            assert.strictEqual(f.lastThrownCall, null)
        })

        it("should be 'f.thrownCalls[f.thrownCalls.length - 1]' after calling the spy one time.", () => {
            const f = spy(() => {
                throw new Error()
            })
            try {
                f()
            } catch {
                // ignore
            }
            assert.strictEqual(
                f.lastThrownCall,
                f.thrownCalls[f.thrownCalls.length - 1],
            )
        })

        it("should be 'f.thrownCalls[f.thrownCalls.length - 1]' after calling the spy two times.", () => {
            const f = spy(() => {
                throw new Error()
            })
            try {
                f()
            } catch {
                // ignore
            }
            try {
                f()
            } catch {
                // ignore
            }
            assert.strictEqual(
                f.lastThrownCall,
                f.thrownCalls[f.thrownCalls.length - 1],
            )
        })

        it("should be 'f.thrownCalls[f.thrownCalls.length - 1]' after calling the spy even if `f.calls[f.calls.length - 1]` was returned.", () => {
            const f = spy((toThrow: boolean) => {
                if (toThrow) {
                    throw -1 //eslint-disable-line no-throw-literal
                }
                return 1
            })
            try {
                f(true)
            } catch {
                // ignore
            }
            f(false)
            assert.strictEqual(
                f.lastThrownCall,
                f.thrownCalls[f.thrownCalls.length - 1],
            )
        })

        it("should be null after calling the spy even if all calls were returned.", () => {
            const f = spy()
            f()
            f()
            assert.strictEqual(f.lastThrownCall, null)
        })
    })

    describe("'reset' method", () => {
        it("should be a function.", () => {
            const f = spy()
            assert.strictEqual(typeof f.reset, "function")
        })

        it("should do nothing before calling the spy.", () => {
            const f = spy()
            f.reset()
            assert.strictEqual(f.calls.length, 0)
        })

        it("should clear `f.calls`.", () => {
            const f = spy()
            f()
            assert.strictEqual(f.calls.length, 1)
            f.reset()
            assert.strictEqual(f.calls.length, 0)
            assert.strictEqual(f.calls[0], undefined)
        })
    })

    describe("'toString' method", () => {
        it("should be a function.", () => {
            const f = spy()
            assert.strictEqual(typeof f.toString, "function")
        })

        it("should return the original function with a comment. (noop)", () => {
            const f = spy()
            assert.strictEqual(f.toString(), "/* The spy of */ function(){}")
        })

        it("should return the original function with a comment. (with f)", () => {
            const f0 = function original(): number {
                return 777
            }
            const f = spy(f0)
            assert.strictEqual(f.toString(), `/* The spy of */ ${f0}`)
        })
    })
})

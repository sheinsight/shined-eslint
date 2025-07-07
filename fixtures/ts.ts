function A(a: number, b: number): number
function A(a: number | string, b: number | string): string | number {
  return +a + +b
}

export function main() {
  new Promise(async (resolve, reject) => {
    var a = `s`
    if (true) {
      debugger
    } else {
    }
    throw a
  })
}

const a: 's' = 's'

var c = 1

const arr = [1, 2, 3]

arr.forEach((element) => {
  console.log(element)
})

export const num = 123

type A = {}

interface B {}

async function test() {}

test().then(() => {})

const reg = /a|a/

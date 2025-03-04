import React from 'react'

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

async function test() {}

test().then(() => {})

const reg = /a|a/

export function BBLTest() {
  var myText = 'myText'

  const _jsxTest = <button type="button">按钮</button>

  return (
    <div>
      测试一下
      <img src="#" alt="你好" />
      {myText}
      {[1, 2].map((e) => (
        <div dangerouslySetInnerHTML={{ __html: '<a>123</a>' }}>{e}</div>
      ))}
      <img src="/icon.png" />
    </div>
  )
}

export class MyComponent extends React.Component {
  constructor(props: object) {
    super(props)
    this.state = { count: 0 }
  }

  changeState() {
    this.state = {}
  }
}

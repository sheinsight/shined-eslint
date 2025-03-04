<script setup lang="ts">
{
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

type A = {}

interface B {}

async function test() {}

test().then(() => {})

const reg = /a|a/

var msg = 'Hello, Vue 3.0 + TypeScript!'
</script>

<template>
  <h1>{{ Date.now() == 100 }}</h1>
  <img src="/icon.png" />
</template>

<style>
h1 {
  color: #333;
}
</style>

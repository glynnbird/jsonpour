import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, createReadStream  } from 'node:fs'
import * as jsonpour from '../index.js'

const PATH = './tests/jsonl.jsonl'
const contents = readFileSync(PATH, 'utf8').split('\n')
  .map((str) => { if (str.length > 0) { return JSON.parse(str)} else { return null}})
  .filter((obj) => { return obj !== null })

test('should be able to stream through JSONL objects', async () => {
  return new Promise((resolve, reject) => {
    const results = []
    const rs = createReadStream(PATH)
    rs
      .pipe(jsonpour.parse())
      .on('data', function(d) {
        results.push(d)
      })
      .on('finish', function() {
        // console.log(results.length, contents.length)
        assert.deepEqual(results, contents)
        resolve()
      })
      .on('error', reject)
  })
})

test('should be able to stream through JSONL objects to get contents', async () => {
  return new Promise((resolve, reject) => {
    const results = []
    const rs = createReadStream(PATH)
    const expected = contents.map((obj) => { return obj._id})
    rs
      .pipe(jsonpour.parse('._id'))
      .on('data', function(d) {
        results.push(d)
      })
      .on('finish', function() {
        assert.deepEqual(results, expected)
        resolve()
      })
      .on('error', reject)
  })
})




import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, createReadStream  } from 'node:fs'
import * as jsonpour from '../index.js'

const PATH = './tests/changes.txt'
const contents = JSON.parse(readFileSync(PATH, 'utf8'))



test('should be able to extract the documents from a changes feed', async () => {
  return new Promise((resolve, reject) => {
    const results = []
    const rs = createReadStream(PATH)
    rs
      .pipe(jsonpour.parse('results.*.doc'))
      .pipe(jsonpour.stringify)
      .on('data', function(str) {
        results.push(str)
      })
      .on('finish', function() {
        assert.deepEqual(results, contents.results.map((c) => { return JSON.stringify(c.doc)+'\n' }))
        resolve()
      })
      .on('error', reject)
  })
})


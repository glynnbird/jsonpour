
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
      .on('data', function(d) {
        results.push(d)
      })
      .on('finish', function() {
        assert.deepEqual(results, contents.results.map((c) => { return c.doc }))
        resolve()
      })
      .on('error', function(e) {
        console.log('ERROR', e)
        reject(e)
      
      } )
  })
})

test('should be able to extract the ids from a changes feed', async () => {
  return new Promise((resolve, reject) => {
    const results = []
    const rs = createReadStream(PATH)
    rs
      .pipe(jsonpour.parse('results.*.id'))
      .on('data', function(d) {
        results.push(d)
      })
      .on('finish', function() {
        assert.deepEqual(results, contents.results.map((c) => { return c.id }))
        resolve()
      })
      .on('error', reject)
  })
})

test('should be able to extract the seq from a changes feed', async () => {
  return new Promise((resolve, reject) => {
    const results = []
    const rs = createReadStream(PATH)
    rs
      .pipe(jsonpour.parse('results.*.seq'))
      .on('data', function(d) {
        results.push(d)
      })
      .on('finish', function() {
        assert.deepEqual(results, contents.results.map((c) => { return c.seq }))
        resolve()
      })
      .on('error', reject)
  })
})

test('should be able to extract the changes from a changes feed', async () => {
  return new Promise((resolve, reject) => {
    const results = []
    const rs = createReadStream(PATH)
    rs
      .pipe(jsonpour.parse('results.*.changes'))
      .on('data', function(d) {
        results.push(d)
      })
      .on('finish', function() {
        assert.deepEqual(results, contents.results.map((c) => { return c.changes }))
        resolve()
      })
      .on('error', reject)
  })
})

test('should be able to extract the last_seq from a changes feed', async () => {
  return new Promise((resolve, reject) => {
    let last_seq = null
    const rs = createReadStream(PATH)
    rs
      .pipe(jsonpour.parse('last_seq'))
      .on('data', function(d) {
        last_seq = d
      })
      .on('finish', function() {
        assert.equal(last_seq, contents.last_seq)
        resolve()
      })
      .on('error', reject)
  })
})



const jsonpour = require('..')
const fs = require('fs')
const PATH = './tests/jsonl.jsonl'
const contents = fs.readFileSync(PATH, 'utf8').split('\n')
  .map((str) => { if (str.length > 0) { return JSON.parse(str)} else { return null}})
  .filter((obj) => { return obj !== null })

test('should be able to stream through JSONL objects', async () => {
  return new Promise((resolve, reject) => {
    const results = []
    const rs = fs.createReadStream(PATH)
    rs
      .pipe(jsonpour.parse())
      .on('data', function(d) {
        results.push(d)
      })
      .on('finish', function() {
        // console.log(results.length, contents.length)
        expect(results).toEqual(contents)
        resolve()
      })
      .on('error', reject)
  })
})

test('should be able to stream through JSONL objects to get contents', async () => {
  return new Promise((resolve, reject) => {
    const results = []
    const rs = fs.createReadStream(PATH)
    const expected = contents.map((obj) => { return obj._id})
    rs
      .pipe(jsonpour.parse('._id'))
      .on('data', function(d) {
        results.push(d)
      })
      .on('finish', function() {
        expect(results).toEqual(expected)
        resolve()
      })
      .on('error', reject)
  })
})


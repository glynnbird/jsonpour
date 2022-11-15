
const jsonpour = require('..')
const fs = require('fs')
const PATH = './tests/changes.txt'
const contents = JSON.parse(fs.readFileSync(PATH, 'utf8'))

test('should be able to extract the documents from a changes feed', async () => {
  return new Promise((resolve, reject) => {
    const results = []
    const rs = fs.createReadStream(PATH)
    rs
      .pipe(jsonpour.parse('results.*.doc'))
      .pipe(jsonpour.stringify)
      .on('data', function(str) {
        results.push(str)
      })
      .on('finish', function() {
        expect(results).toEqual(contents.results.map((c) => { return JSON.stringify(c.doc)+'\n' }))
        resolve()
      })
      .on('error', reject)
  })
})


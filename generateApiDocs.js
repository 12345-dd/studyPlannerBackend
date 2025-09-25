const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')

const routesDir = path.join(__dirname, 'src','routes')
const outFile = 'apiDoc.md'

function genDocs() {
  fs.readdir(routesDir, (err, files) => {
    if (err) {
      console.error('could not read routes dir', err)
      return;
    }

    let docs = '## API Documentation\n\n'

    let pending = files.length
    if (!pending) return fs.writeFile(outFile, docs, () => {})

    files.forEach(f => {
      const filePath = path.join(routesDir, f)
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('failed reading', f, err)
        } else {
          let desc = ''
          let query = []
          let body = []
          let header = []
          const lines = data.split('\n')

          lines.forEach(line => {
            const l = line.trim()

            if (l.startsWith('// @api')) {
              desc = l.replace('// @api', '').trim()
            }

            if (l.startsWith('// @query')) {
              query = l.replace('// @query', '').trim().split(",").map(p => p.trim())
            }

            if (l.startsWith('// @body')) {
              body = l.replace('// @body', '').trim().split(",").map(p => p.trim())
            }

            if (l.startsWith('// @header')) {
              header = l.replace('// @header', '').trim().split(",").map(p => p.trim())
            }

            if (l.startsWith('router.')) {
              const m = l.match(/router\.(\w+)\(/)
              const r = l.match(/\(['"`](.*?)['"`]/)

              if (m && r) {
                const method = m[1].toUpperCase()
                const route = r[1]

                docs += `### [${method}] ${route}\n`
                docs += `Description: ${desc || '-'}\n`

                const path = route.match(/:([a-zA-Z0-9_]+)/g)
                if(path) {
                  docs += `Path Params: `
                  path.forEach(p => {
                    docs += `${p.slice(1)}\n`
                  })
                }

                if(query.length > 0){
                  docs +=  `Query Params:\n`
                  query.forEach(p => {
                    docs += `- ${p}\n`
                  })
                }

                if(body.length > 0){
                  docs += `Body Params:\n`
                  body.forEach(p => {
                    docs += `- ${p}\n`
                  })
                }

                if(header.length > 0){
                  docs += `Header Params:\n`
                  header.forEach(p => {
                    docs += `- ${p}\n`
                  })
                }
                docs += '\n'
              }
              desc = ''
              query = []
              body = []
              header = []
            }
          })
        }

        if (!--pending) {
          fs.writeFile(outFile, docs, err => {
            if (err) console.error('error writing doc', err)
            else console.log('docs updated', new Date().toLocaleTimeString())
          })
        }
      })
    })
  })
}

genDocs()

chokidar.watch(routesDir).on('change', f => {
  console.log('changed:', f)
  genDocs()
})






const fs = require('fs')
const http = require('http')
const url = require('url')

const replaceTemplate = require('./modules/replaceTemplate')

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf8'
)
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf8'
)
const tempBook = fs.readFileSync(
  `${__dirname}/templates/template-book.html`,
  'utf8'
)

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true)
  // OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' })

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('')
    const output = tempOverview.replace('{%BOOK_CARDS%}', cardsHtml)

    res.end(output)

    // BOOK PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' })
    const book = dataObj[query.id]
    const output = replaceTemplate(tempBook, book)

    res.end(output)

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' })
    res.end(data)

    // NOT FOUND
  } else {
    res.writeHead(404, { 'Content-Type': 'text/' })
    res.end('<h1>Page not found!</h1>')
  }
})

server.listen(8080, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000')
})

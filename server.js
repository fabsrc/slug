const app = require('express')()
const db = require('dirty')('link.db')
const emojis = require('emojis-list')
const validUrl = require('valid-url')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req, res) => {
  if (!validUrl.isUri(req.body.link)) return res.status(400).send('400')

  let count = 0
  db.forEach(function (key, val) { count += 1 })
  count = Math.floor(count / emojis.length)

  let emojiLink = ''
  do {
    for (let i = count; i >= 0; i--) {
      emojiLink += emojis[Math.random() * emojis.length | 0]
    }
  } while (db.get(emojiLink))

  console.log(req.body.link, '>', emojiLink)

  db.set(emojiLink, req.body.link)
  res.send(emojiLink)
})

app.get('/:l', (req, res) => {
  let link = db.get(req.params.l)

  console.log(req.params.l, '>', link)

  if (!link) return res.redirect('/')

  res.redirect(link)
})

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`))

app.listen(process.env.PORT || 1234, console.log('🐌'))

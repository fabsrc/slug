const app = require('express')()
const db = require('dirty')('link.db')
const emojis = require('emojis-list')
const validUrl = require('valid-url')
const bodyParser = require('body-parser')

app.use(bodyParser.text())

app.post('/', (req, res) => {
  if (!validUrl.isUri(req.body)) return res.status(400).send('400')

  let emojilink
  let count = 0
  do {
    count++
    emojilink = emojis[Math.random() * emojis.length | 0]
    if (count >= emojis.length) {
      emojilink += emojis[Math.random() * emojis.length | 0]
    }
  } while (db.get(emojilink))

  console.log(req.body, emojilink)

  db.set(emojilink, req.body)
  res.send(emojilink)
})

app.get('/:l', (req, res) => {
  let link = db.get(req.params.l)

  console.log(req.params.l, link)

  if (!link) return res.redirect('/')

  res.redirect(link)
})

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`))

app.listen(process.env.PORT || 1234, console.log('🐜'))


import express, { Response, Request } from 'express'
const app = express()
const port = 3000
const a = 5

app.get('/', (req: Response, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

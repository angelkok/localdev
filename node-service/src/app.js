const express = require('express')
const app = express()
const port = 8001

app.get('/', (req, res) => {
  res.send('Node-service: Hello World!!!')
})

app.get('/status', (req, res) => {
    res.json({
        status: "This is version 1"
    })

})

app.listen(port, () => {
  console.log(`Node app listening on port ${port}`)
})

import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

const express = require('express')
const app = express()
const port = 8001

app.get('/', (req: any, res: any) => {
  res.send('Node-ts-service: Hello World!!!')
})

app.get('/status', (req: any, res: any) => {
    res.json({
        status: "This is version 1"
    })

})

app.listen(port, () => {
  console.log(`Node app listening on port ${port}`)
})

import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import express, { Request, Response } from 'express';
const app = express()
const port = 8001

app.get('/', (req: Request, res: Response) => {
  res.send('Node-ts-service: Hello World!!!')
})

app.get('/status', (req: Request, res: Response) => {
    res.json({
        status: "This is version 1"
    })

})

app.listen(port, () => {
  console.log(`Node app listening on port ${port}`)
})

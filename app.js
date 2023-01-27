require('dotenv').config()
require('express-async-errors')
let express=require('express')
let app=express()

let notFound=require('./middleware/not-found')
let errorHandlerMiddleware=require('./middleware/error-handler')
let connectDB=require('./db/connect')


let helmet=require('helmet')
let xss=require('xss-clean')
let cors=require('cors')
let rateLimiter=require('express-rate-limit')

//swagger

let swaggerUI=require('swagger-ui-express')
let YAML=require('yamljs')
let swaggerDocument=YAML.load('./swagger.yaml')

//routers

let auth_router=require('./routes/auth')
let jobs_router=require('./routes/jobs')
let authentication=require('./middleware/authentication')

//middlewares
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
}))

//security
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())



app.get('/',(req,res)=>{
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})

app.use('/api-Docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth',auth_router)
app.use('/api/v1/jobs',authentication,jobs_router)

app.use(notFound)
app.use(errorHandlerMiddleware)

let port=process.env.PORT || 3000

let start=async ()=>{
  try{
  await connectDB(process.env.MONGO_URI)
  app.listen(port,()=>{
    console.log(`listening on port${port}`)
  })
}catch(error)
{
  console.log(error)
}
}

start()

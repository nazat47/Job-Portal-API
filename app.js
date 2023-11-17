require('dotenv').config();
require('express-async-errors');
const auths=require('./routes/auth')
const express = require('express');
const app = express();

const authRouter=require('./routes/auth')
const jobsRouter=require('./routes/jobs')


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const authenticateUser=require('./middleware/authentication')
const helmet=require('helmet')
const cors=require('cors')
const xss=require('xss-clean')
const rateLimit=require('express-rate-limit')
const swaggerUI=require('swagger-ui-express')
const YAML=require('yamljs')

const swagggerDoc=YAML.load('./swagger.yaml')

app.use(express.json());
// extra packages
app.set('trust proxy',1)
app.use(rateLimit({
  windowMs:15*60*1000,
  max:100
}))
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/',(req,res)=>{
  res.send('<h1>Job Portal API</h1> <a href="/api-docs">Documentation</a>')
})
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swagggerDoc))
// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

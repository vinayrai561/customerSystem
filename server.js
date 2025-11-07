import express from 'express';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
dotenv.config();
const app=express();
const port=process.env.PORT || 3000;

app.use(express.json());
app.use('/api/customer',customerRoutes);
app.use('/api/agent',agentRoutes);

app.get('/health',(req,res)=>{
   res.send('OK');
});

app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(`Example app listening at http://localhost:${port}/api/agent/getAgentHtml`);
    console.log(`Example app listening at http://localhost:${port}/api/customer/getCustomerHtml`);
});
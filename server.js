require('dotenv').config();
const express = require('express');
const path = require('path');
const leadRoutes = require('./src/leadRoutes');
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit:'16kb' }));
app.use(express.urlencoded({ extended:false, limit:'16kb' }));
app.use(express.static(path.join(__dirname,'public')));
app.use('/api/leads', leadRoutes);
app.get('/api/health', (req,res) => res.json({ success:true, message:'Berg Junior Coach API funcionando.' }));
app.use((req,res) => res.status(404).json({ success:false, message:'Rota não encontrada.' }));
app.use((err,req,res,next) => {
 if (err.status === 400 || err.status === 413) return res.status(err.status).json({ success:false, message:'Dados inválidos ou muito grandes.' });
 console.error(err);
 res.status(500).json({ success:false, message:'Erro interno do servidor.' });
});
if (require.main === module) app.listen(process.env.PORT || 3000, () => console.log(`Servidor em http://localhost:${process.env.PORT || 3000}`));
module.exports = app;

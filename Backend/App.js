import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import { router } from "./Router/router.js";

import cors from 'cors'

const app = express();

app.use(cors({
    origin: true //globalThis.process?.env?.FRONT_URI
}))

app.use(express.json()); // trata JSON
app.use(express.urlencoded({extended:true})) //trataBody

// middleware simples de log para debug
app.use((req, res, next) => {
  console.log('>>> REQ', req.method, req.url);
  next();
});

// montar o router (import estático acima)
app.use('/', router);
console.log('Router montado em /');

// rota de teste temporária para confirmar que POST /add chega ao servidor
app.post('/add-test', (req, res) => res.json({ ok: true, msg: 'add-test ok' }));

// log das rotas no momento da montagem (para debug)
try {
    console.log('Rotas no router (router.stack):', router.stack.map(l => l.route ? l.route.path : l.name));
    console.log('Rotas no app (app._router.stack):', (app._router && app._router.stack) ? app._router.stack.map(l => l.route ? l.route.path : l.name) : []);
} catch (e) {
    console.error('Erro ao logar rotas:', e.message || e);
}

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
        .then(() => app.emit("OK"))
        .catch((err) => {
                console.error("Erro ao conectar ao MongoDB:", err.message || err);
                process.exit(1);
        });

// Rota de debug para listar rotas registradas
const listRoutes = () => {
    const details = [];
    const stack = app._router && app._router.stack;
    if (!stack) return details;
    stack.forEach((layer, i) => {
        const item = {
            index: i,
            name: layer.name || null,
            path: layer.route ? layer.route.path : null,
            methods: layer.route ? Object.keys(layer.route.methods) : null,
            hasHandleStack: !!(layer.handle && layer.handle.stack),
            handleStackLen: layer.handle && layer.handle.stack ? layer.handle.stack.length : 0
        };
        // if the layer is a router, include its inner routes
        if (layer.handle && layer.handle.stack) {
            item.inner = layer.handle.stack.map(h => h.route ? { path: h.route.path, methods: Object.keys(h.route.methods) } : { name: h.name });
        }
        details.push(item);
    });
    return details;
};

app.get('/debug/routes', (req, res) => res.json(listRoutes()));

const port = process.env.PORT || 3000;

app.on("OK",() =>{
    app.listen(port, () => {
        console.log(`Servidor Rodando em http://localhost:${port}`)
    })
})

// Log das rotas registradas (ajuda a debugar 'Cannot POST /add')
// rotas registradas já expostas via /debug/routes

const api = {
    router: express.Router(),
}

api.router.use("*",(req,res,next)=>{
    console.log(">>> ",req.baseUrl,req.query);
    next();
})

api.router.use("/list-wallet", (req,res,next)=>{
    db.methods.listWallet(req.query.limit, req.query.skip)
    .then(wallets=>res.send({data:wallets||[]}));
})
api.router.use("/get-wallet", (req,res,next)=>{
    db.methods.getWallet(req.query.account, req.query.password)
    .then(wallet=> (wallet)? res.send({data:wallet}) : res.status(404).send({err:'Not Found!'}) );
})
api.router.use("/add-wallet", (req,res,next)=>{
    db.methods.addWallet(req.query.name, req.query.password)
    .then(wallet=> (wallet)? res.send({data:wallet}) : res.status(400).send({err:'Bad Request!'}) );
})
api.router.use("/set-wallet", (req,res,next)=>{
    db.methods.setWallet(req.query.id, req.query.password, req.query.key, req.query.value)
    .then(status=> (status)? res.send({msg:"OK!"}) : res.status(400).send({err:'Bad Request!'}) );
})
api.router.use("/list-transaction", (req,res,next)=>{
    db.methods.listTransaction(req.query.limit, req.query.skip)
    .then(transactions=>res.send({data:transactions||[]}));
})
api.router.use("/send", (req,res,next)=>{
    db.methods.send(req.query.id, req.query.password, req.query.targetId, req.query.amount, req.query.fee, req.query.description)
    .then(status=> (status)? res.send({msg:"OK!"}) : res.status(400).send({err:'Bad Request!'}) );
})

module.exports = api;
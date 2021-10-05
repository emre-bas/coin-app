const ui = {
    router: express.Router(),
}

ui.router.use(express.static('./src/ui/static'));

ui.router.get("/:page", (req,res,next)=>{
    res.sendFile("./src/ui/static/index.html", {root:"./"})
});

module.exports = ui;
const ui = {
    router: express.Router(),
}

ui.router.use(express.static('./src/ui/static'));

module.exports = ui;
class MainController {
    static async showMainPage(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        res.render('main', { user: req.session.user });
    }
}

module.exports = MainController;
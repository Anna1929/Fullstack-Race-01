class NotFoundController {
    static showNotFoundPage(req, res) {
        res.status(404).render('404');
    }
}

module.exports = NotFoundController;
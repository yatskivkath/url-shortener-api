// pagesController.js
// Implementation of the ejs pages controller

async function homePage(req, res) {
    res.render('home');
}

async function loginPage(req, res) {
    res.render('login');
}

async function registerPage(req, res) {
    res.render('register');
}

async function dashboardPage(req, res) {
    res.render('dashboard');
}

async function adminPage(req, res) {
    res.render('admin');
}

module.exports = {
    homePage,
    loginPage,
    registerPage,
    dashboardPage,
    adminPage,
};

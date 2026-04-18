'use strict';

/**
 * requireAdmin – middleware that guards all /dhanrubi/* routes.
 * If the session has adminLoggedIn = true, proceed; else redirect to login.
 */
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.adminLoggedIn === true) {
        return next();
    }
    // Not authenticated → redirect to hidden admin login
    return res.redirect('/dhanrubi/login');
};

module.exports = { requireAdmin };

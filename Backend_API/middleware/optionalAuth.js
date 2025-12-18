// middleware/optionalAuth.js
const supabaseAdmin = require("../config/supabaseAdmin");

module.exports = async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            req.user = null;
            return next();
        }

        const token = authHeader.replace("Bearer ", "");

        const { data } = await supabaseAdmin.auth.getUser(token);

        req.user = data?.user
            ? {
                id: data.user.id,
                email: data.user.email,
            }
            : null;

        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

// middleware/validateRequest.js
module.exports = function validateRequest(requiredFields = []) {
    return (req, res, next) => {
        for (const field of requiredFields) {
            if (req.body[field] === undefined) {
                return res.status(400).json({
                    message: `Missing required field: ${field}`,
                });
            }
        }
        next();
    };
};

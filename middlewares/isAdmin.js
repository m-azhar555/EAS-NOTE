const isAdmin = (req, res, next) => {
if (req.user.role !== 'admin') {
return res.status(403).json({ message: "Access Denied! Sirf Admin ye access kar sakta hai." });
}
next();
};

module.exports = isAdmin;
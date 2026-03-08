const isManager = (req, res, next) => {
// req.user humein fetchuser middleware se milta hai
if (req.user.role !== 'manager' && req.user.role !== 'admin') {
return res.status(403).json({ message: "Access Denied! Sirf Managers ya Admin ye dekh sakte hain." });
}
next();
};

module.exports = isManager;
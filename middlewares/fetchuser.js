const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
const token = req.header('auth-token');
if (!token) {
return res.status(401).send({ error: "Access Denied! Login zaroori hai." });
}
try {
const data = jwt.verify(token, process.env.JWT_SECRET);
req.user = data;
next();
} catch (error) {
res.status(401).send({ error: "Invalid Token!" });
}
}

module.exports = fetchuser;
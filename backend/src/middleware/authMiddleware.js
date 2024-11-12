const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (requiredRoles = []) => (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        // Verificar que el rol del usuario esté en los roles requeridos
        if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
            return res.status(403).json({ message: "Acceso denegado, rol no autorizado" });
        }

        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};

module.exports = auth;

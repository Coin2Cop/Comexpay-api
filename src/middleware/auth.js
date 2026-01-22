const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado o no autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregamos los datos decodificados al objeto `req` para usarlos después
    next(); // Continuar al siguiente middleware o ruta
  } catch (error) {
    res.status(403).json({ message: 'Token no válido' });
  }
};

const restrictTo = (roles) => (req, res, next) => {
  console.log(req.user)
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
  }
  next();
};

module.exports = { verifyToken, restrictTo };

import pool from "./db.js"; // Conexión a la base de datos
//import bcrypt from "bcrypt"; // Úsalo si decides implementar bcrypt en lugar de MD5

// Mostrar el formulario de inicio de sesión
export const mostrarFormularioLogin = (req, res) => {
  res.render("pages/login"); // Asegúrate de que tienes una vista llamada "login"
};

// Procesar el inicio de sesión
export const procesarLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ? AND status = 1", [email]);

    if (rows.length === 0) {
      return res.status(401).send("Usuario no encontrado o inactivo");
    }

    const usuario = rows[0];

    // Validar contraseña
    const passwordCorrecto = usuario.password === password; // Reemplaza con bcrypt.compare() si usas bcrypt

    if (!passwordCorrecto) {
      return res.status(401).send("Contraseña incorrecta");
    }

    // Autenticación exitosa: Guardar en sesión o token
    req.session.usuario = { id: usuario.id_usuario, nombre: usuario.nombre };
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
};

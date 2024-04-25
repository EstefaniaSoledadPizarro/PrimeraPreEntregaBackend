import { isValidPassword } from '../utils/functionsUtils.js';
import userModel from '../dao/models/userModel.js';

export const auth = async function (req, res, next) {
    const { email, password } = req.query;

    try {
        
        const isAdmin = (email === "adminCoder@coder.com" && password === "adminCod3r123");

       
        if (!isAdmin) {
            req.session.failLogin = false;
            const result = await userModel.findOne({ email: req.body.email }).lean();
            if (!result) {
                req.session.failLogin = true;
                return res.redirect("http://localhost:8080/products/login?error=Usuario no encontrado");
            }

            if (!isValidPassword(result, req.body.password)) {
                req.session.failLogin = true;
                return res.redirect("http://localhost:8080/products/login?error=Contraseña incorrecta");
            }

        
            delete result.password;

           
            req.session.user = result;
            req.session.admin = false; // El usuario no es administrador

            console.log('Datos del usuario almacenados en la sesión:', req.session.user);

            return res.redirect("http://localhost:8080/products");
        } else {
           
            req.session.user = { first_name }; 
            req.session.admin = true; // El usuario es administrador

            console.log('Datos del administrador almacenados en la sesión:', req.session.user);

            return res.redirect("http://localhost:8080/products");
        }
    } catch (error) {
        console.error('Error durante la autenticación:', error);
        req.session.failLogin = true;
        return res.redirect("http://localhost:8080/products/login");
    }
};
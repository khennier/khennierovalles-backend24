import User from '../models/User.js';
import Cart from '../models/cart.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Registro de usuario
export const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        // Verificar si el correo electrónico está presente
        if (!email) {
            return res.status(400).json({ error: 'El correo electrónico es obligatorio.' });
        }

        // Verificar si el correo electrónico ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }

        // Encriptar la contraseña
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Crear el nuevo usuario
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        await newUser.save();

        // Crear un carrito asociado al usuario
        const cart = new Cart({ userId: newUser._id, products: [] });
        await cart.save();

        newUser.cart = cart._id;
        await newUser.save();

        // Redirigir a la página de login
        res.redirect('/login');
    } catch (err) {
        console.error('Error al registrar el usuario:', err.message);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// Login de usuario
export const loginUser = async (req, res) => {
    const { email, password } = req.body;  // Cambiado de username a email

    try {
        // 1. Busca el usuario en la base de datos por email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("toy aca 1")
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // 2. Verifica si la contraseña ingresada coincide con la hasheada
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log("toy aca 2")
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // 3. Genera el token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'backend', { expiresIn: '1h' });

        // 4. Enviar el token al frontend en la respuesta JSON (no en la sesión)
        res.status(200).json({ token });

    } catch (err) {
        console.error('Error al iniciar sesión:', err.message);
        console.log("toy aca 3")
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};



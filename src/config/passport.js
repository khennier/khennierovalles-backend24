import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import dotenv from 'dotenv';
import passport from 'passport';  

dotenv.config();  // Para cargar las variables de entorno

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'backend',  
};

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);  // Buscar el usuario por ID
        if (user) {
            return done(null, user);  // Si se encuentra, devolver el usuario
        } else {
            return done(null, false);  // Si no, devolver false
        }
    } catch (error) {
        return done(error, false);  // Manejar errores
    }
});

passport.use(jwtStrategy);  

export default passport; 

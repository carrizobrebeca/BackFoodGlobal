
// passport.js
const { Usuario } = require('./db')

require('dotenv').config(); // Asegúrate de que dotenv esté configurado


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://back-foodglobal-pf.up.railway.app/auth/google/callback' // Debe coincidir con el URI de redireccionamiento autorizado
},
  async (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    // Aquí puedes buscar o crear el usuario en tu base de datos
    try {
      let user = await Usuario.findOne({ where: { googleID: profile.id } });
      console.log({ user });

      if (!user) {
        user = await Usuario.create({
          googleID: profile.id,
          nombre: profile.name.givenName,
          email: profile._json.email,
          apellido: profile.name.familyName,
          rol: "admin"
        })

      }
      done(null, user);
    } catch (err) {
      console.log(err);

      done(err, null);
    }
  }));



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Usuario.findByPk(id);
  done(null, user);
});

import bcrypt from 'bcryptjs';
import User from '../models/Users';
import { generateToken } from '../utils/createJWTUserAuth';

export class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const checkUserExist = await User.findOne({ where: { email: email } });
      if (!checkUserExist) {
        return res.status(400).json({
          errors:
            'E-mail incorreto ou usuário não cadastrado no sistema. Verifique seus dados.'
        });
      }

      const hashedPassword = bcrypt.compareSync(
        password,
        checkUserExist.password
      );

      if (!hashedPassword) {
        return res.status(400).json({ errors: 'Senha incorreta.' });
      }

      const token = generateToken(checkUserExist, res);

      req.session.userId = checkUserExist.id;
      req.session.userRole = checkUserExist.role;

      req.session.save(() => {
        res.status(200).json({
          token,
          user: {
            name: checkUserExist.name,
            email,
            role: checkUserExist.role
          }
        });
      });
    } catch (e) {
      res.status(500).json({
        errors: 'Ocorreu um erro desconhecido ao fazer login. Tente novamente!'
      });
    }
  }
}

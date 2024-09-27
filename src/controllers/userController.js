import Users from "../models/Users.js";
import bcrypt from "bcryptjs";

export class User {
  static async store(req, res) {
    const { name, cpf: numCpf, email, password } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashPassword = bcrypt.hashSync(password, salt);

    try {

      const checkUserEmail = await Users.findOne({ where: { email: email } });
      const checkUserCpf = await Users.findOne({ where: { cpf: numCpf } });
      if (checkUserCpf || checkUserEmail) {
        return res.status(400).json({ errors: "Usuário já cadastrado no sistema." })
      }

      const userCreate = {
        name: name,
        cpf: numCpf,
        email: email,
        password: hashPassword,
        role: "comum"
      }

      await Users.create(userCreate);

      req.session.userId = userCreate.id;

      res.status(200).json({ success: "Usuário criado com sucesso." })
    } catch (e) {
      console.log(e);
      res.status(500).json({ errors: "Ocorreu um erro desconhecido ao criar sua conta. Tente novamente!" })
    }
  }
}
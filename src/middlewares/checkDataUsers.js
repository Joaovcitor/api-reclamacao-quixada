import { cpf } from "cpf-cnpj-validator";
import validator from "validator";

const { isEmail, isEmpty } = validator;

export function checkDataBodyUser(req, res, next) {
  const { name, cpf: numCpf, email, password, confirmePassword } = req.body;

  if (!isEmail(email)) {
    return res.status(400).json({ errors: "E-mail é inválido, verifique o e-mail digitado." })
  }

  if (!cpf.isValid(numCpf)) {
    return res.status(400).json({ errors: "CPF é inválido" })
  }

  if (isEmpty(name)) {
    return res.status(400).json({ errors: "Nome não pode ficar em branco" })
  }

  if (isEmpty(password) || isEmpty(confirmePassword)) {
    return res.status(400).json({ errors: "Senha e confirme a senha não podem ficar vazio" })
  }

  if (password !== confirmePassword) {
    return res.status(400).json({ errors: "Senhas não são iguais" })
  }

  next()

}
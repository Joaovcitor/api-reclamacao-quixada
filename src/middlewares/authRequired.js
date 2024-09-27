function authRequired(req, res, next) {
  const user = req.session.userId;

  if (!user) {
    return res.status(403).json({ errors: "Você precisa está logado!" })
  }

  next()
}
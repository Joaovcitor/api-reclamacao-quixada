import jwt from 'jsonwebtoken';

export function generateToken(user, res) {
  const token = jwt.sign(
    { userId: user.id, userRole: user.role },
    process.env.SECRET_JWT,
    { expiresIn: '8h' }
  );

  res.cookie('token', token, { httpOnly: true, secure: true });

  return token;
}

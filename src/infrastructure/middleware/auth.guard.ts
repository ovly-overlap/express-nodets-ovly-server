// 인증/인가

const authGuard = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

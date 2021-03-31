const passport = require('passport');

//POST login route (optional, everyone has access)
exports.authenticate = function (req, res, next) {
  const {
    body: { email, password }
  } = req;

  console.log('email in basic contoller', req.body)

  const user = {};
  user.email = email;
  user.password = password;
  if (!user.email) {
    return res.status(200).json({
      status: false,
      message: 'Email is required',
      debug: req.body
    });
  }

  if (!user.password) {
    return res.status(200).json({
      status: false,
      message: 'Password is required',
      data: []
    });
  }

  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return res.status(200).json({
          status: false,
          message: 'Credentials Invalid',
          data: []
        });
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        return res.json({ status: true, message: 'Logged in successfully!!', data: { user: user.toAuthJSON() } });
      }
      return res.status(200).json({
        status: false,
        message: 'Credentials Invalid',
        data: []
      });
      //   return status(400).info;
    }
  )(req, res, next);
};

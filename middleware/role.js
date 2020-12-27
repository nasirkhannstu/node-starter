const User = require("../models/User");

module.exports = function (role) {
    return async (req, res, next) => {
      const user = await User.findById(req.user.id).select("-password");
      console.log(user);
      req.authUser = user;
      if (user.role !== role) {
        return res.status(401).send("Not Allowed");
      }
      next();
    };
};

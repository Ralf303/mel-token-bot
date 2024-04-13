import db from "./config.js";
import User from "./models/user-model.js";

export default new (class dbService {
  getUser = async (id, firstName) => {
    try {
      let user = await User.findOne({
        where: { id },
      });

      if (!user) {
        user = await User.create({ id, firstname: firstName });
      } else if (firstName && user.firstname != firstName) {
        user = await user.update({ firstname: firstName });
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  connect = async () => {
    try {
      await db.authenticate();
      console.log("Connection has been established successfully.");
      await db.sync();
      console.log("All models were synchronized successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  };

  check = async (id, firstName) => {
    try {
      const isUser = await User.findOne({ where: { id } });

      if (isUser) {
        return false;
      }

      await User.create({ id, firstname: firstName });
      return true;
    } catch (error) {
      console.error(error);
    }
  };

  isAdmin = async (id) => {
    try {
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return false;
      }

      return user.isAdmin;
    } catch (error) {
      console.error(error);
    }
  };

  makeAdmin = async (id) => {
    try {
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return false;
      }

      await user.update({ isAdmin: true });
      return true;
    } catch (error) {
      console.error(error);
    }
  };
})();

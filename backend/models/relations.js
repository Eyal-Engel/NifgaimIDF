const { DataTypes } = require("sequelize");
const User = require("./schemas/NifgaimUser");
const Command = require("./schemas/NifgaimCommand");

// one to many relation (command as many users)
Command.hasMany(User, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
User.belongsTo(Command);

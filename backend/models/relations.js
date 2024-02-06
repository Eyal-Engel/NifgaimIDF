const { DataTypes } = require("sequelize");
const User = require("./schemas/NifgaimUser");
const Command = require("./schemas/NifgaimCommand");
const Graveyard = require("./schemas/NifgaimGraveyard");
const Halal = require("./schemas/NifgaimHalal");
const LeftOver = require("./schemas/NifgaimLeftOver");
const SoldierAccompanied = require("./schemas/NifgaimSoldierAccompanied");

// one to many relation (command as many users)
Command.hasMany(User, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
User.belongsTo(Command);

// one to many relation (Graveyard as many Halals)
Graveyard.hasMany(Halal, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
Halal.belongsTo(Graveyard);

// one to many relation (Halal as many SoldierAccompanieds)
Halal.hasMany(SoldierAccompanied, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
SoldierAccompanied.belongsTo(Halal);

// one to many relation (LeftOver as many Halals)
Halal.hasMany(LeftOver, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
LeftOver.belongsTo(Halal);

// one to many relation (command as many halals)
Command.hasMany(Halal, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
Halal.belongsTo(Command);

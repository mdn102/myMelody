'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.playlist.belongsTo(models.user)
      models.playlist.hasMany(models.comment)
      models.playlist.hasMany(models.track)
      models.playlist.belongsToMany(models.tag, {through: 'playliststags'})
    }
  };
  playlist.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'playlist',
  });
  return playlist;
};
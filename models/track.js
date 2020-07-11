'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class track extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.track.belongsTo(models.user)
      models.track.belongsTo(models.playlist)
    }
  };
  track.init({
    song: DataTypes.STRING,
    artist: DataTypes.STRING,
    album: DataTypes.STRING,
    playlistId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'track',
  });
  return track;
};
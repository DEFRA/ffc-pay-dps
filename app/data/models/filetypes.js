module.exports = (sequelize, DataTypes) => {
  const fileType = sequelize.define('fileType', {
    fileTypeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fileType: DataTypes.STRING
  },
  {
    tableName: 'fileTypes',
    freezeTableName: true,
    timestamps: false
  })
  fileType.associate = function (models) {
    fileType.hasMany(models.batch, {
      foreignKey: 'fileTypeId',
      as: 'batches'
    })
  }
  return fileType
}

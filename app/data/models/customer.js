module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define('customer', {
    customerId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    traderId: DataTypes.STRING,
    frn: DataTypes.STRING
  },
  {
    tableName: 'customers',
    freezeTableName: true,
    timestamps: false
  })
  return customer
}

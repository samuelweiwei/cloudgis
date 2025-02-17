const { DataTypes, NOW } = require('sequelize');
// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
    sequelize.define('users', {
        // The following specification of the 'id' attribute could be omitted
        // since it is the default.
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
        },
        createTime: {
            field: 'create_time',
            type: DataTypes.DATE,
            defaultValue: NOW
        },
        updateTime: {
            field: 'update_time',
            type: DataTypes.DATE,
            defaultValue: NOW
        },
    }, {
        createdAt: 'createTime', // Use 'creationDate'substitute'createdAt'
        updatedAt: 'updateTime' // Use'modificationDate'substitute'updatedAt'
    });
};

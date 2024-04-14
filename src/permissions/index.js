// index.js
// Implementation of the ABAC permissions util with casl

const { AbilityBuilder, createMongoAbility } = require('@casl/ability');

const { USER_ROLES } = require('../constants/databaseConstants');
const adminPermissions = require('./adminPermissions');
const userPermissions = require('./userPermissions');
const { Forbidden } = require('../errors/errors');

const rolePermissions = {
    [USER_ROLES.ADMIN]: adminPermissions,
    [USER_ROLES.USER]: userPermissions,
};

function defineAbilityFor(user) {
    const builder = new AbilityBuilder(createMongoAbility);

    if (typeof rolePermissions[user.role] === 'function') {
        rolePermissions[user.role](user, builder);
    } else {
        throw new Forbidden('No permission');
    }

    return builder.build();
}

module.exports = defineAbilityFor;

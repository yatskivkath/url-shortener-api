// adminPermissions.js
// Definition of the admin permissions

const { actions, subjects } = require('../constants/permissionsConstants');

module.exports = (user, { can, cannot }) => {
    can(actions.MANAGE, subjects.ALL);
};

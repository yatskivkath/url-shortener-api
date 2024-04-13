// userPermissions.js
// Definition of the user permissions

const { actions, subjects } = require('../constants/permissionsConstants');

module.exports = (user, { can, cannot }) => {
    can(actions.MANAGE, subjects.URL, { user_id: user.id });
    can(actions.READ, subjects.URL);
};
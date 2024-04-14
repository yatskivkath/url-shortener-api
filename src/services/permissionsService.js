// permissionsService.js
// Implementation of the permissions service

const { ForbiddenError, subject } = require('@casl/ability');

const defineAbilityFor = require('../permissions/index.js');

/**
 * Check if the user has permissions to perform the action on the subject
 * @param {Object} userToCheck user object
 * @param {Object} subjectToCheck subject object
 * @param {string} actionType action type
 * @param {string} subjectType subject type
 * @returns {void}
 */
function checkPermissions(
    userToCheck,
    subjectToCheck,
    actionType,
    subjectType
) {
    const ability = defineAbilityFor(userToCheck);
    ForbiddenError.from(ability).throwUnlessCan(
        actionType,
        subject(subjectType, subjectToCheck)
    );
}

module.exports = {
    checkPermissions,
};

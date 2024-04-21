// permissionsService.js
// Implementation of the permissions service

const { ForbiddenError, subject } = require('@casl/ability');

const { Forbidden } = require('../errors/errors.js');
const defineAbilityFor = require('../permissions/index.js');
const logger = require('../../logger.js');

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

    logger.log({
        level: 'debug',
        message: 'Checking permissions for user',
        params: {
            user: userToCheck,
            subject: subjectToCheck,
            action: actionType,
            subjectType: subjectType,
        },
    });

    try {
        ForbiddenError.from(ability).throwUnlessCan(
            actionType,
            subject(subjectType, subjectToCheck)
        );
    } catch (error) {
        throw new Forbidden('No permission');
    }
}

module.exports = {
    checkPermissions,
};

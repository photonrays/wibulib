import * as util from './util';

/***********************
 * FUNCTION DEFINITIONS
 ***********************/

/**
 * Search for a scanlation group.
 * 
 * @param {GetSearchGroupRequestOptions} [options] See {@link GetSearchGroupRequestOptions}
 * @returns A promise that resolves to a {@link GetSearchGroupResponse} object.
 * Will resolve to a {@link ErrorResponse} object on error.
 */
export const getSearchGroup = function (options) {
    const qs = util.buildQueryStringFromOptions(options);
    const path = `/group${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

// Kenjugs (06/06/2022) TODO: Implement functionality for `POST /group`
// export const createGroup = function (token, options) { };

/**
 * Get info about a specific scanlation group by their ID.
 * 
 * @param {string} groupId UUID formatted string.
 * @param {GetGroupIdRequestOptions} [options] See {@link GetGroupIdRequestOptions}
 * @returns A promise that resolves to a {@link GetGroupIdResponse} object.
 * Will resolve to a {@link ErrorResponse} object on error.
 */
export const getGroupId = function (groupId, options) {
    if (groupId === undefined) {
        return Promise.reject('ERROR - getGroupId: Parameter `groupId` cannot be undefined');
    } else if (groupId === '') {
        return Promise.reject('ERROR - getGroupId: Parameter `groupId` cannot be blank');
    }

    const qs = util.buildQueryStringFromOptions(options);
    const path = `/group/${groupId}${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

// Kenjugs (06/07/2022) TODO: Implement functionality for `PUT /group/{id}`
// export const updateGroupId = function (token, groupId, options) { };

// Kenjugs (06/07/2022) TODO: Implement functionality for `DELETE /group/{id}`
// export const deleteGroupId = function (token, groupId) { };

// Kenjugs (06/07/2022) TODO: Implement functionality for `POST /group/{id}/follow`
// export const followGroupId = function (token, groupId) { };

// Kenjugs (06/07/2022) TODO: Implement functionality for `DELETE /group/{id}/follow`
// export const unfollowGroupId = function (token, groupId) { };

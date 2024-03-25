import * as util from './util';


/***********************
 * FUNCTION DEFINITIONS
 ***********************/

/**
 * Search for author based on search criteria
 * 
 * @param {GetAuthorRequestOptions} [options] See {@link GetAuthorRequestOptions}
 * @returns A promise that resolves to a {@link GetAuthorResponse} object.
 * Can also resolve to an {@link ErrorResponse} object.
 */
export const getAuthor = function (options) {
    const qs = util.buildQueryStringFromOptions(options);
    const path = `/author${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};


/**
 * Get author info by ID
 * 
 * @param {string} id UUID formatted string
 * @param {GetAuthorIdRequestOptions} [options] See {@link GetAuthorIdRequestOptions}
 * @returns A promise that resolves to a {@link GetAuthorIdResponse} object.
 * Can also resolve to an {@link ErrorResponse} object.
 */
export const getAuthorId = function (id, options) {
    if (id === undefined) {
        return Promise.reject('ERROR - getAuthorId: Parameter `id` cannot be undefined');
    } else if (id === '') {
        return Promise.reject('ERROR - getAuthorId: Parameter `id` cannot be blank');
    }

    const qs = util.buildQueryStringFromOptions(options);
    const path = `/author/${id}${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};
import * as util from './util';


/***********************
 * FUNCTION DEFINITIONS
 ***********************/

/**
 * Search for manga covers based on some search criteria.
 * 
 * @param {GetCoverRequestOptions} [options] See {@link GetCoverRequestOptions}
 * @returns A promise that resolves to a {@link GetCoverResponse} object.
 * Can also resolve to an {@link ErrorResponse} object.
 */
export const getCover = function (options) {
    const qs = util.buildQueryStringFromOptions(options);
    const path = `/cover${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

/**
 * Get manga cover art by ID.
 * 
 * @param {string} id UUID formatted string.
 * @param {GetCoverIdRequestOptions} [options] See {@link GetCoverIdRequestOptions}
 * @returns A promise that resolves to a {@link GetCoverIdResponse} object.
 * Can also reject to an {@link ErrorResponse} object.
 */
export const getCoverId = function (id, options) {
    if (id === undefined) {
        return Promise.reject('ERROR - getCoverId: Parameter `id` cannot be undefined');
    } else if (id === '') {
        return Promise.reject('ERROR - getCoverId: Parameter `id` cannot be blank');
    }

    const qs = util.buildQueryStringFromOptions(options);
    const path = `/cover/${id}${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

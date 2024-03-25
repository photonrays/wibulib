import * as util from './util';

/**
 * Gets a list of chapters based on search options.
 * 
 * @param {GetChapterRequestOptions} [options] See {@link GetChapterRequestOptions}
 * @returns A promise that resolves to a {@link GetChapterResponse} object.
 * Can also reject to an {@link ErrorResponse} object.
 */
export const getChapter = function (options) {
    const qs = util.buildQueryStringFromOptions(options);
    const path = `/chapter${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

/**
 * Gets information about a specific manga chapter.
 * 
 * @param {string} id UUID formatted string
 * @param {GetChapterIdRequestOptions} [options] See {@link GetChapterIdRequestOptions}
 * @returns A promise that resolves to a {@link GetChapterIdResponse} object.
 * Can also reject to an {@link ErrorResponse} object.
 */
export const getChapterId = function (id, options) {
    if (id === undefined) {
        return Promise.reject('ERROR - getChapterId: Parameter `id` cannot be undefined');
    } else if (id === '') {
        return Promise.reject('ERROR - getChapterId: Parameter `id` cannot be blank');
    }

    const qs = util.buildQueryStringFromOptions(options);
    const path = `/chapter/${id}${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

/**
 * Update a chapter by ID.
 * 
 * @param {string} id UUID formatted string
 * @param {PutChapterIdRequestOptions} options See {@link PutChapterIdRequestOptions}
 * @param {AuthenticationToken} token See {@link AuthenticationToken}
 * @returns A promise that resolves to a {@link PutChapterIdResponse} object.
 * Can also reject to an {@link ErrorResponse} object.
 */
export const putChapterId = function (id, options, token) {
    if (id === undefined) {
        return Promise.reject('ERROR - putChapterId: Parameter `id` cannot be undefined');
    } else if (id === '') {
        return Promise.reject('ERROR - putChapterId: Parameter `id` cannot be blank');
    } else if (options === undefined) {
        return Promise.reject('ERROR - putChapterId: Parameter `options` cannot be undefined');
    } else if (!('version' in options)) {
        return Promise.reject('ERROR - putChapterId: Parameter `options` missing required property `version`');
    }

    const req = {
        body: options,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const path = `/chapter/${id}`;

    try {
        const httpsRequestOptions = util.addTokenAuthorization(token, req);
        return util.createHttpsRequestPromise('PUT', path, httpsRequestOptions);
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Delete a chapter by ID.
 * 
 * @param {string} id UUID formatted string
 * @param {AuthenticationToken} token See {@link AuthenticationToken}
 * @returns A promise that resolves to a {@link DeleteChapterIdResponse} object.
 * Can also reject to an {@link ErrorResponse} object.
 */
export const deleteChapterId = function (id, token) {
    if (id === undefined) {
        return Promise.reject('ERROR - deleteChapterId: Parameter `id` cannot be undefined');
    } else if (id === '') {
        return Promise.reject('ERROR - deleteChapterId: Parameter `id` cannot be blank');
    }

    const path = `/chapter/${id}`;

    try {
        const httpsRequestOptions = util.addTokenAuthorization(token);
        return util.createHttpsRequestPromise('DELETE', path, httpsRequestOptions);
    } catch (error) {
        return Promise.reject(error);
    }
};
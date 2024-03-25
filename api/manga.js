import * as util from './util.js';

/**
 * Search for manga.
 * 
 * @param {GetSearchMangaRequestOptions} [options] See {@link GetSearchMangaRequestOptions}
 * @returns A promise that resolves to a {@link GetSearchMangaResponse} object.
 * Will resolve to a {@link ErrorResponse} object on error.
 */
export const getSearchManga = function (options) {
    const qs = util.buildQueryStringFromOptions(options);
    const path = `/manga${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

/**
 * Get reading status of ALL manga for logged User. If `status` is given,
 * returns a filtered list with only that specific reading status.
 * 
 * @param {AuthenticationToken} token See {@link AuthenticationToken}
 * @param {MangaReadingStatus} [status] See {@link MangaReadingStatus}
 * @returns A promise that resolves to a {@link GetMangaStatusResponse} object.
 * Will resolve to a {@link ErrorResponse} object on error.
 */
export const getMangaStatus = function (token, status) {
    const qs = util.buildQueryStringFromOptions({ status: status });
    const path = `/manga/status${qs}`;

    try {
        const httpsRequestOptions = util.addTokenAuthorization(token);
        return util.createHttpsRequestPromise('GET', path, httpsRequestOptions);
    } catch (err) {
        return Promise.reject(err);
    }
};

/**
 * Gets the feed of chapters for the given manga.
 * 
 * @param {string} id UUID formatted string.
 * @param {GetMangaIdFeedRequestOptions} [options] See {@link GetMangaIdFeedRequestOptions}
 * @returns A promise that resolves to a {@link GetMangaIdFeedResponse} object.
 * Will resolve to a {@link ErrorResponse} object on error.
 */
export const getMangaIdFeed = function (id, options) {
    if (id === undefined) {
        return Promise.reject('ERROR - getMangaIdFeed: Parameter `id` cannot be undefined');
    } else if (id === '') {
        return Promise.reject('ERROR - getMangaIdFeed: Parameter `id` cannot be blank');
    }

    const qs = util.buildQueryStringFromOptions(options);
    const path = `/manga/${id}/feed${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

/**
 * Get aggregate manga volume and chapter data.
 * 
 * @param {string} id UUID formatted string.
 * @param {GetMangaIdAggregateRequestOptions} [options] See {@link GetMangaIdAggregateRequestOptions}
 * @returns A promise that resolves to a {@link GetMangaIdAggregateResponse} object.
 * Will resolve to a {@link ErrorResponse} object on error.
 */
export const getMangaIdAggregate = function (id, options) {
    if (id === undefined) {
        return Promise.reject('ERROR - getMangaIdAggregate: Parameter `id` cannot be undefined');
    } else if (id === '') {
        return Promise.reject('ERROR - getMangaIdAggregate: Parameter `id` cannot be blank');
    }

    const qs = util.buildQueryStringFromOptions(options);
    const path = `/manga/${id}/aggregate${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

/**
 * Get manga information by ID.
 * 
 * @param {string} id UUID formatted string.
 * @param {GetMangaIdRequestOptions} [options] See {@link GetMangaIdRequestOptions}
 * @returns A promise that resolves to a {@link GetMangaIdResponse} object.
 * Will resolve to a {@link ErrorResponse} object on error.
 */
export const getMangaId = function (id, options) {
    if (id === undefined) {
        return Promise.reject('ERROR - getMangaId: Parameter `id` cannot be undefined');
    } else if (id === '') {
        return Promise.reject('ERROR - getMangaId: Parameter `id` cannot be blank');
    }

    const qs = util.buildQueryStringFromOptions(options);
    const path = `/manga/${id}${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

// Kenjugs (06/06/2022) TODO: Implement functionality for `PUT /manga/{id}`
// export const updateMangaId = function (id, options) { };

// Kenjugs (06/06/2022) TODO: Implement functionality for `DELETE /manga/{id}`
// export const deleteMangaId = function (id) { };

// Kenjugs (06/24/2022) TODO: Implement functionality for `DELETE /manga/{id}/follow`
// export const unfollowMangaId = function (id) { };

// Kenjugs (06/24/2022) TODO: Implement functionality for `POST /manga/{id}/follow`
// export const followMangaId = function (id) { };

/**
 * Get a list of chapters that have been marked as read for a given manga.
 * 
 * @param {AuthenticationToken} token See {@link AuthenticationToken}
 * @param {string} id UUID formatted string.
 * @returns A promise that resolves to a {@link GetMangaIdReadMarkersResponse} object.
 */
export const getMangaIdReadMarkers = function (token, id) {
    if (id === undefined) {
        return Promise.reject('ERROR - getMangaIdReadMarkers: Parameter `id` cannot be undefined');
    } else if (id === '') {
        return Promise.reject('ERROR - getMangaIdReadMarkers: Parameter `id` cannot be blank');
    }

    const path = `/manga/${id}/read`;

    try {
        const httpsRequestOptions = util.addTokenAuthorization(token);
        return util.createHttpsRequestPromise('GET', path, httpsRequestOptions);
    } catch (err) {
        return Promise.reject(err);
    }
};

/**
 * Get a list of chapters that have been marked as read grouped by manga.
 * 
 * @param {AuthenticationToken} token See {@link AuthenticationToken}
 * @param {GetMangaReadMarkersRequestOptions} options See {@link GetMangaReadMarkersRequestOptions}
 * @returns A promise that resolves to a {@link GetMangaReadMarkersResponse} object.
 */
export const getMangaReadMarkers = function (token, options) {
    if (options === undefined) {
        return Promise.reject('ERROR - getMangaReadMarkers: Parameter `options` cannot be undefined');
    } else if (!('ids' in options)) {
        return Promise.reject('ERROR - getMangaReadMarkers: Parameter `options` missing required property `ids`');
    }

    const qs = util.buildQueryStringFromOptions(options);
    const path = `/manga/read${qs}`;

    try {
        const httpsRequestOptions = util.addTokenAuthorization(token);
        return util.createHttpsRequestPromise('GET', path, httpsRequestOptions);
    } catch (err) {
        return Promise.reject(err);
    }
};

/**
 * Get a random manga.
 * 
 * @param {GetMangaRandomRequestOptions} [options] See {@link GetMangaRandomRequestOptions}
 * @returns A promise that resolves to a {@link GetMangaRandomResponse} object
 */
export const getMangaRandom = function (options) {
    const qs = util.buildQueryStringFromOptions(options);
    const path = `/manga/random${qs}`;
    return util.createHttpsRequestPromise < GetMangaRandomResponse > ('GET', path);
};

/**
 * Get manga tag list. This function takes no parameters.
 * 
 * @returns A promise that resolves to a {@link GetMangaTagResponse} object
 */
export const getMangaTag = function () {
    const path = `/manga/tag`;
    return util.createHttpsRequestPromise('GET', path);
};

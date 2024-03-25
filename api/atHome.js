import * as util from './util';

/**
 * Get MangaDex@Home server URL.
 * 
 * @param {string} chapterId UUID formatted string
 * @param {GetAtHomeServerChapterIdRequestOptions} [options] See {@link GetAtHomeServerChapterIdRequestOptions}
 * @returns A promise that resolves to a {@link GetAtHomeServerChapterIdResponse} object.
 * Can also resolve to an {@link ErrorResponse} object.
 */
export const getAtHomeServerChapterId = function (chapterId, options) {
    if (chapterId === undefined) {
        return Promise.reject('ERROR - getAtHomeServerChapterId: Parameter `chapterId` cannot be undefined');
    } else if (chapterId === '') {
        return Promise.reject('ERROR - getAtHomeServerChapterId: Parameter `chapterId` cannot be blank');
    }

    const qs = util.buildQueryStringFromOptions(options);
    const path = `/at-home/server/${chapterId}${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};

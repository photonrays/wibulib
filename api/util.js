import axios from "axios";

const MANGADEX_API_URL = 'https://api.mangadex.org';

const transformArrayForQueryString = function (name, array = undefined) {
    let qs = '';

    if (array === undefined || array.length === 0) {
        return qs;
    }

    for (const s of array) {
        if (qs === '') {
            qs += `${name}[]=${s}`;
        } else {
            qs += `&${name}[]=${s}`;
        }
    }

    return qs;
};

export const buildQueryStringFromOptions = function (options) {
    const queryParams = [];

    if (options === undefined || Object.keys(options).length === 0) {
        return '';
    }

    for (const key of Object.keys(options)) {
        if (options[key] instanceof Array) {
            queryParams.push(transformArrayForQueryString(key, options[key]));
        } else if (options[key] instanceof Date) {
            if (!isNaN(options[key])) {
                /** @type {Date} */
                const d = options[key];
                queryParams.push(`${key}=${d.toISOString().substring(0, d.toISOString().indexOf('.'))}`);
            }
        } else if (key === 'order') {
            const order = options[key];

            for (const o of Object.keys(order)) {
                queryParams.push(`order[${o}]=${order[o]}`);
            }
        } else {
            queryParams.push(`${key}=${options[key]}`);
        }
    }

    const ret = `?${queryParams.join('&')}`;
    return ret === '?' ? '' : ret;
};


export const createHttpsRequestPromise = function (method, path, options) {
    if (method === undefined) {
        return Promise.reject('ERROR - createHttpsRequestPromise: Parameter `method` cannot be undefined');
    } else if (method === '') {
        return Promise.reject('ERROR - createHttpsRequestPromise: Parameter `method` cannot be blank');
    } else if (path === undefined) {
        return Promise.reject('ERROR - createHttpsRequestPromise: Parameter `path` cannot be undefined');
    } else if (path === '') {
        return Promise.reject('ERROR - createHttpsRequestPromise: Parameter `path` cannot be blank');
    }

    console.log('call api...', path)
    const httpsRequestOptions = {
        method: method,
        url: `${MANGADEX_API_URL}${path}`,
        headers: {
            'User-Agent': 'wibulib'
        }
    };


    if (options && ('body' in options)) {
        delete options.body;
    }

    // merge the options object if it was provided
    if (options) {
        Object.assign(httpsRequestOptions, options);
    }

    return new Promise((resolve, reject) => {
        axios(httpsRequestOptions).then(res => {
            const resObj = {
                data: res.data,
                statusCode: res.status,
                statusMessage: res.statusText,
            }
            resolve(resObj)
        }).catch(err => console.error(err))
    });
};

export const addTokenAuthorization = function (token, request) {
    if (token === undefined) {
        throw new Error('ERROR - addTokenAuthorization: Parameter `token` cannot be undefined');
    } else if (!('session' in token)) {
        throw new Error('ERROR - addTokenAuthorization: Parameter `token` missing required property `session`');
    }

    const headers = request?.headers;

    const o = {
        ...request,
        headers: {
            Authorization: `Bearer ${token.session}`,
            ...headers
        }
    };

    return o;
};


export const isErrorResponse = function (res) {
    if (!res) return false;
    return res.errors !== undefined;
};
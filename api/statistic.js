import { GetMangasStatisticResponse } from './schema';
import * as util from './util';

export const getMangasStatistic = function (options) {
    const qs = util.buildQueryStringFromOptions(options);
    const path = `/statistics/manga${qs}`;

    return util.createHttpsRequestPromise('GET', path);
};
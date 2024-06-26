import { getChapter } from "../api/chapter"
import useSWR from 'swr'
import { Includes, MangaContentRating, Order } from "../api/static";
import useLatestUpdateMangas from "./useLatestUpdateMangas";


export default function useLatestChapters(page) {
    let requestParams = {
        limit: 64,
        offset: (page - 1) * 64,
        includes: [Includes.SCANLATION_GROUP, Includes.USER],
        order: { readableAt: Order.DESC },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.SUGGESTIVE],
        translatedLanguage: ['en']
    };
    const { data, isLoading, error, mutate } = useSWR(['lastestChapter', page], () => getChapter(requestParams))
    const successData = data && data.data.result === "ok" && (data.data)
    const latestChapters = {}

    if (successData && !isLoading) {
        for (const chapter of successData.data) {
            const mangaId = chapter.relationships?.filter(rela => rela.type == "manga")[0].id
            if (!latestChapters[mangaId]) {
                latestChapters[mangaId] = []
            }
            latestChapters[mangaId].push(chapter)
        }
    }

    return useLatestUpdateMangas({ latestChapters: latestChapters, chaptersLoading: isLoading, chapterError: error, page, mutate })
}

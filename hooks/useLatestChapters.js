import { getChapter } from "../api/chapter"
import useSWR from 'swr'
import { Includes, MangaContentRating, Order } from "../api/static";


export default function useLatestChapters(page) {
    const date = new Date;
    let requestParams = {
        limit: 64,
        offset: (page - 1) * 64,
        includes: [Includes.SCANLATION_GROUP],
        order: { readableAt: Order.DESC },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.EROTICA, MangaContentRating.SUGGESTIVE, MangaContentRating.PORNOGRAPHIC],
        translatedLanguage: ['vi']
    };
    const { data, isLoading, error } = useSWR(['lastestChapter', page, date.getMinutes()], () => getChapter(requestParams))
    const successData = data && data.data.result === "ok" && (data.data)
    const latestChapters = {}

    if (successData && !isLoading) {
        for (const chapter of successData.data) {
            const mangaId = chapter.relationships?.[1].id
            if (!latestChapters[mangaId]) {
                latestChapters[mangaId] = []
            }
            latestChapters[mangaId].push(chapter)
        }
    }

    return { latestChapters: latestChapters, chaptersLoading: isLoading, chapterError: error }
}

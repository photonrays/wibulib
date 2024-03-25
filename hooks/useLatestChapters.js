import { getChapter } from "../api/chapter"
import useSWR from 'swr'
import { Includes, MangaContentRating, Order } from "../api/static";


export default function useLatestChapters(page) {
    const requestParams = {
        limit: 64,
        offset: (page - 1) * 64,
        includes: [Includes.SCANLATION_GROUP],
        order: { readableAt: Order.DESC },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.EROTICA, MangaContentRating.SUGGESTIVE, MangaContentRating.PORNOGRAPHIC],
        translatedLanguage: ['vi']
    };
    const { data, isLoading } = useSWR(['lastestChapter', page], () => getChapter(requestParams))
    const successData = data && data.data.result === "ok" && (data.data)

    return { chapters: successData, chaptersLoading: isLoading }
}

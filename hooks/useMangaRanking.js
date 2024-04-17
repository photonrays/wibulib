import { Includes, MangaContentRating, Order } from "../api/static"
import useSearchManga from "./useSearchManga"

export default function useMangaRanking() {
    const requestParams = {
        includes: [Includes.COVER_ART],
        order: {
            followedCount: Order.DESC,
        },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.SUGGESTIVE],
        hasAvailableChapters: "true",
        availableTranslatedLanguage: ['en'],
    }

    return useSearchManga(requestParams)
}
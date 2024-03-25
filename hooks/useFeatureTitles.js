import { Includes, MangaContentRating, Order } from "../api/static"
import useSearchManga from "./useSearchManga"

export default function useFeaturedTitles() {
    const createdAtSince = new Date(Date.now() - 30 * 24 * 3600 * 1000)

    const requestParams = {
        includes: [Includes.COVER_ART, Includes.ARTIST, Includes.AUTHOR],
        order: {
            followedCount: Order.DESC,
        },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.SUGGESTIVE],
        hasAvailableChapters: "true",
        availableTranslatedLanguage: ['vi'],
        createdAtSince: createdAtSince.toISOString().slice(0, -13) + "00:00:00"
    }

    return useSearchManga(requestParams)
}
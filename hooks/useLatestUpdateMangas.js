import useSWR from 'swr'
import { getSearchManga } from '../api/manga';
import { Includes, MangaContentRating } from '../api/static';

export default function useLatestUpdateMangas({ latestChapters, chaptersLoading, chapterError, page, mutate }) {
    const requestParams = {
        includes: [Includes.COVER_ART],
        ids: Object.keys(latestChapters),
        contentRating: [MangaContentRating.EROTICA, MangaContentRating.PORNOGRAPHIC, MangaContentRating.SAFE, MangaContentRating.SUGGESTIVE],
        hasAvailableChapters: "true",
        availableTranslatedLanguage: ['vi'],
        limit: 64
    };

    const { data, isLoading, error } = useSWR(!chaptersLoading ? ['lastestUpdates', page] : null, () => getSearchManga(requestParams))
    const successData = data && data.data.result === "ok" && (data.data)
    const updates = {}

    if (successData && !isLoading) {
        for (const manga of successData.data) {
            updates[manga.id] = { manga, chapterList: latestChapters[manga.id] }
        }
    }

    return { latestUpdates: updates, latestUpdatesLoading: isLoading, mutateLatestChapter: mutate }
}
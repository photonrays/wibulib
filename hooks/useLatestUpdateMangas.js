import useLatestChapters from "./useLatestChapters";
import useSWR from 'swr'


export default function useLatestUpdateMangas() {
    const date = new Date;
    const { latestChapters, chaptersLoading, chapterError } = useLatestChapters()

    const requestParams = {
        includes: [Includes.COVER_ART],
        ids: Object.keys(latestChapters),
        contentRating: [MangaContentRating.EROTICA, MangaContentRating.PORNOGRAPHIC, MangaContentRating.SAFE, MangaContentRating.SUGGESTIVE],
        hasAvailableChapters: "true",
        availableTranslatedLanguage: ['vi'],
        limit: 64
    };

    const { data, isLoading, error } = useSWR(['latestUpdateMangas', date.getMinutes()], () => getSearchManga(requestParams))


    useEffect(() => {
        if (Object.entries(latestChapters).length > 0) {
            const requestParams = {
                includes: [Includes.COVER_ART],
                ids: Object.keys(latestChapters),
                contentRating: [MangaContentRating.EROTICA, MangaContentRating.PORNOGRAPHIC, MangaContentRating.SAFE, MangaContentRating.SUGGESTIVE],
                hasAvailableChapters: "true",
                availableTranslatedLanguage: ['vi'],
                limit: 64
            };
            getSearchManga(requestParams).then(data => {
                const updates = {}
                data.data.data.forEach(manga => updates[manga.id] = { manga, chapterList: latestChapters[manga.id] });
                setLatestUpdates(updates)
            }).catch(err => console.log(err))
        }
    }, [latestChapters, chaptersLoading, chapterError])


}
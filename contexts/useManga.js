import { getSearchManga } from "../api/manga";
import { createContext, useContext, useState, useEffect } from "react";
import useLatestChapters from "../hooks/useLatestChapters";
import { Includes, MangaContentRating } from "../api/static";

export const MangaContext = createContext({
    manga: null,
    setManga: () => null,
    latestUpdates: {},
    setLatestUpdates: () => null,
});

export function MangaProvider({ children }) {
    const [manga, setManga] = useState(null)
    const [latestChapters, setLatestChapters] = useState({})
    const [latestUpdates, setLatestUpdates] = useState({});

    const { chapters, chaptersLoading } = useLatestChapters(1)

    useEffect(() => {
        if (chapters && !chaptersLoading) {
            const updates = {}
            for (const chapter of chapters.data) {
                const mangaId = chapter.relationships?.[1].id
                if (!updates[mangaId]) {
                    updates[mangaId] = []
                }
                updates[mangaId].push(chapter)
                setLatestChapters(updates)
            }
        }
    }, [chapters, chaptersLoading])


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
    }, [latestChapters])

    return (
        <MangaContext.Provider value={{ manga, setManga, latestUpdates, setLatestUpdates }}>
            {children}
        </MangaContext.Provider>
    );
}

export const useManga = () => useContext(MangaContext);

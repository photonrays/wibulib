import { getMangaId, getMangaIdFeed, getSearchManga } from "../api/manga";
import { createContext, useContext, useState, useEffect } from "react";
import useLatestChapters from "../hooks/useLatestChapters";
import { Includes, MangaContentRating, Order } from "../api/static";
import { getChapterId } from "../api/chapter";

export const MangaContext = createContext({
    manga: null,
    updateManga: () => null,
    mangaFeed: null,
    latestUpdates: {},
    updateMangaByChapterId: () => null,
});

export function MangaProvider({ children }) {
    const [manga, setManga] = useState(null)
    const [latestUpdates, setLatestUpdates] = useState({});
    const [mangaFeed, setMangaFeed] = useState()

    const { latestChapters, chaptersLoading } = useLatestChapters(1)

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
    }, [chaptersLoading])

    const updateManga = async (id) => {
        const { data } = await getMangaId(id, {
            includes: [Includes.COVER_ART, Includes.ARTIST, Includes.AUTHOR, Includes.CHAPTER, Includes.TAG],
        })
        if (data && data.data) {
            setManga(data.data)
        }
    }

    const updateMangaByChapterId = async (cid) => {
        const { data } = await getChapterId(cid)
        if (data && data.data) {
            updateManga(data.data.relationships?.[1].id)
        }
    }

    useEffect(() => {
        const getCurrentMangaFeed = async (id) => {
            const requestParams = {
                limit: 500,
                includes: [Includes.SCANLATION_GROUP, Includes.USER],
                order: { volume: Order.DESC, chapter: Order.DESC },
                contentRating: [MangaContentRating.SAFE, MangaContentRating.EROTICA, MangaContentRating.SUGGESTIVE, MangaContentRating.PORNOGRAPHIC],
                translatedLanguage: ['vi']
            };
            const { data } = await getMangaIdFeed(id, requestParams)
            if (data) {
                setMangaFeed(data.data)
            }
        }
        if (manga) {
            getCurrentMangaFeed(manga.id)
        }
    }, [manga])

    return (
        <MangaContext.Provider value={{ manga, updateManga, mangaFeed, latestUpdates, updateMangaByChapterId }}>
            {children}
        </MangaContext.Provider>
    );
}

export const useManga = () => useContext(MangaContext);

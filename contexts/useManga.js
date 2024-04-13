import { getMangaId, getMangaIdFeed } from "../api/manga";
import { createContext, useContext, useState, useEffect } from "react";
import { Includes, MangaContentRating, Order } from "../api/static";
import { getChapterId } from "../api/chapter";

export const MangaContext = createContext({
    manga: null,
    updateManga: () => null,
    mangaFeed: null,
    updateMangaByChapterId: () => null,
    clearManga: () => null,
});

export function MangaProvider({ children }) {
    const [manga, setManga] = useState(null)
    const [mangaFeed, setMangaFeed] = useState()

    const updateManga = async (id) => {
        if (id) {
            const { data } = await getMangaId(id, {
                includes: [Includes.COVER_ART, Includes.ARTIST, Includes.AUTHOR, Includes.CHAPTER, Includes.TAG],
            })
            if (data && data.data) {
                setManga(data.data)
            }
        }
    }

    const updateMangaByChapterId = async (cid) => {
        const { data } = await getChapterId(cid)
        if (data && data.data) {
            updateManga(data.data.relationships.filter(rela => rela.type == "manga")[0].id)
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

    const clearManga = () => {
        setManga(null)
        setMangaFeed()
    }

    return (
        <MangaContext.Provider value={{ manga, updateManga, mangaFeed, updateMangaByChapterId, clearManga }}>
            {children}
        </MangaContext.Provider>
    );
}

export const useManga = () => useContext(MangaContext);

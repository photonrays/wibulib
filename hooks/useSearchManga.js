import useSWR from 'swr'
import { Manga as MangaApi } from '../api'
import { Includes } from '../api/static'

export default function useSearchManga(options) {
    if (!options.includes) {
        options.includes = [Includes.COVER_ART]
    }
    const { data, error, isLoading, mutate } = useSWR(['search-manga', options], () => MangaApi.getSearchManga(options))
    const successData = data && data.data.result === "ok" && (data.data)

    return { data: successData, error, isLoading, mutate }
}
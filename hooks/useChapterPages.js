import useSWR from "swr"
import { getAtHomeServerChapterId } from "../api/atHome"

export default function useChapterPages(chapterId) {
    const { data, isLoading, error } = useSWR(chapterId ? ['chapter-pages', chapterId] : null, () => getAtHomeServerChapterId(chapterId, {
        forcePort443: false
    }))
    const successData = data && data.data?.chapter
    const pages = successData ? successData.data.map(originalData => `${data.data.baseUrl}/data/${successData.hash}/${originalData}`) : []

    return { pages, isLoading, error }
}
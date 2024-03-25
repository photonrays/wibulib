export function getMangaTitle(manga) {
    if (!manga) return ""
    return manga.attributes.altTitles.find(t => t['vi'])?.['vi'] || manga.attributes.title?.['en'] || Object.values(manga.attributes.title)?.[0] || "No title";
}

export function getMangaTitleByChapter(chapter) {
    if (!chapter || !chapter.manga || !chapter.manga.attributes) return ""
    return chapter.manga.attributes.altTitles.find(t => t['vi'])?.['vi'] || chapter.manga.attributes.title?.['en'] || Object.values(chapter.manga.attributes.title)?.[0] || "No title";
}


export function getAltMangaTitle(manga) {
    if (!manga) return ""
    return manga.attributes.altTitles.find(t => t['vi']) && manga.attributes.title?.['en'] ||
        manga.attributes.altTitles.find(t => t['en'])?.['en'] ||
        manga.attributes.altTitles.find(t => t['jp-ro'])?.['jp-ro'] ||
        manga.attributes.altTitles.find(t => t['ja'])?.['ja'] || "";
}
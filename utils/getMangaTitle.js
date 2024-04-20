export function getMangaTitle(manga) {
    if (!manga) return ""
    return manga.attributes.title?.['en'] || Object.values(manga.attributes.title)?.[0] || "No title";
}

export function getMangaTitleByChapter(chapter) {
    if (!chapter || !chapter.relationships || !chapter?.relationships?.find((rela) => rela.type == 'manga')) return ""
    return chapter?.relationships?.find((rela) => rela.type == 'manga')?.attributes?.title?.['en'] ||
        Object.values(chapter?.relationships?.find((rela) => rela.type == 'manga')?.attributes?.title)?.[0] ||
        "No title";
}


export function getAltMangaTitle(manga) {
    if (!manga) return ""
    return manga.attributes.title?.['en'] ||
        manga.attributes.altTitles.find(t => t['en'])?.['en'] ||
        manga.attributes.altTitles.find(t => t['jp-ro'])?.['jp-ro'] ||
        manga.attributes.altTitles.find(t => t['ja'])?.['ja'] || "";
}
export default function getChapterTitle(chapter) {
    if (!chapter) return ""
    else if (chapter.attributes.volume && chapter.attributes.chapter && chapter.attributes.title) return `Vol.${chapter.attributes.volume} Ch.${chapter.attributes.chapter} - ${chapter.attributes.title}`
    else if (chapter.attributes.chapter && chapter.attributes.title) return `Ch.${chapter.attributes.chapter} - ${chapter.attributes.title}`
    else if (chapter.attributes.chapter) return `Ch.${chapter.attributes.chapter}`
    return "Oneshot"
}
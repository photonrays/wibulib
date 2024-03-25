export default function getChapterTitle(chapter) {
    if (!chapter) return ""
    else if (chapter.attributes.volume && chapter.attributes.chapter && chapter.attributes.title) return `Chương ${chapter.attributes.chapter}  Tập ${chapter.attributes.volume} - ${chapter.attributes.title}`
    else if (chapter.attributes.chapter && chapter.attributes.title) return `Chương ${chapter.attributes.chapter} - ${chapter.attributes.title}`
    else if (chapter.attributes.chapter) return `Chương ${chapter.attributes.chapter}`
    return "Oneshot"
}
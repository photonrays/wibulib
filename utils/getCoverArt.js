import { images } from "../constants"

export default function getCoverArt(manga) {
    const CORS = process.env.CORS_URL;
    const placeholder = images.cover

    if (!manga) return placeholder;
    if (manga.relationships?.[2].attributes?.fileName) {
        return `https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships[2].attributes.fileName}.256.jpg`;
    }
    return placeholder;
}

import { images } from "../constants"
import { encode as btoa } from 'base-64'

export default function getCoverArt(manga) {
    const CORS = process.env.NEW_CORS_URL;
    const placeholder = images.cover

    if (!manga) return placeholder;
    if (manga.relationships?.[2].attributes?.fileName) {
        const encodedUrl = btoa(`https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships[2].attributes.fileName}.256.jpg`).replace(/\+/g, "-").replace(/\//g, "_")

        return `${CORS}/v1/image/${encodedUrl}`;
    }
    return placeholder;
}

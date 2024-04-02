import { images } from "../constants"
import { encode as btoa } from 'base-64'

const CORS = process.env.NEW_CORS_URL;

export default function getCoverArt(manga) {
    const placeholder = images.cover

    if (!manga) return placeholder;
    const coverArtRelationship = manga.relationships?.find((rela) => rela.type == 'cover_art')

    if (coverArtRelationship) {
        const encodedUrl = btoa(`https://uploads.mangadex.org/covers/${manga.id}/${coverArtRelationship.attributes.fileName}.256.jpg`).replace(/\+/g, "-").replace(/\//g, "_")

        return `${CORS}/v1/image/${encodedUrl}`;
    }
    return placeholder;
}

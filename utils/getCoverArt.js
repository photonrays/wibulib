import { images } from "../constants"

export default function getCoverArt(manga) {
    const placeholder = images.cover

    if (!manga) return placeholder;
    const coverArtRelationship = manga.relationships?.find((rela) => rela.type == 'cover_art')

    if (coverArtRelationship) {
        return `https://uploads.mangadex.org/covers/${manga.id}/${coverArtRelationship.attributes.fileName}.256.jpg`;
    }
    return placeholder;
}

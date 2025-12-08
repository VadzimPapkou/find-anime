import type { TSearchFormState } from "../features/search-form/search-form.tsx";

export const constructAniDBUrl = (formState: TSearchFormState): string => {
    const baseUrl = 'https://anidb.net/anime/';
    const params = new URLSearchParams();

    params.append('noalias', '1');
    params.append('do.update', 'Search');
    params.append('view', "grid");

    if (formState.episodesMin) {
        params.append('eps.min', formState.episodesMin.toString());
    }

    if (formState.startYear && formState.startYear.length === 2) {
        const [start, end] = formState.startYear;
        params.append('airdate.start', `${ start.year() }-?-?`);
        params.append('airdate.end', `${ end.year() }-?-?`);
    }

    if (formState.sortType) {
        const direction = formState.sortDirection === 'desc' ? '0.2' : '0.1';

        if (formState.sortType === 'rating') {
            params.append('orderby.rating', direction);
        } else if (formState.sortType === 'year') {
            params.append('orderby.airdate', direction);
        }
    }

    if (formState.tags) {
        if (formState.tags.length > 0) {
            params.append('atags.include', formState.tags.join(', '));
        }
    }

    if (formState.minRating) {
        params.append('rating.min', formState.minRating + "");
    }

    if (formState.animeTypes) {
        for(const animeType of formState.animeTypes) {
            params.append(`type.${ animeType }`, "1");
        }
    }

    return `${ baseUrl }?${ params.toString() }`;
};
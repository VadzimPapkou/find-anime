import type { TSearchFormState } from "./search-form.tsx";

export const constructAniDBUrl = (formState: TSearchFormState, tagsNamesMap?: Map<number, string>): string => {
    const baseUrl = 'https://anidb.net/anime/';
    const params = new URLSearchParams();

    params.append('noalias', '1');
    params.append('do.update', 'Search');

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
            params.append('orderby.year', direction);
        }
    }

    if (formState.tags && tagsNamesMap) {
        const tagNames: string[] = [];
        for (const tagId of formState.tags) {
            const tagName = tagsNamesMap.get(tagId);
            if (tagName) {
                tagNames.push(tagName);
            }
        }
        
        if (tagNames.length > 0) {
            // Join tag names with comma and space (e.g., "fantasy, romance")
            params.append('atags.include', tagNames.join(', '));
        }
    }

    return `${ baseUrl }?${ params.toString() }`;
};
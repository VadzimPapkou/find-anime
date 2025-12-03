import type { TSearchFormState } from "./search-form.tsx";

export const constructAniDBUrl = (formState: TSearchFormState): string => {
    const baseUrl = 'https://anidb.net/anime/';
    const params = new URLSearchParams();

    // Параметры по умолчанию
    params.append('noalias', '1');
    params.append('do.update', 'Search');

    // Эпизоды
    if (formState.episodesMin) {
        params.append('eps.min', formState.episodesMin.toString());
    }

    // Годы выпуска
    if (formState.startYear && formState.startYear.length === 2) {
        const [start, end] = formState.startYear;
        params.append('airdate.start', `${start.year()}-?-?`);
        params.append('airdate.end', `${end.year()}-?-?`);
    }

    // Сортировка
    if (formState.sortType) {
        const direction = formState.sortDirection === 'desc' ? '0.1' : '0.2';

        if (formState.sortType === 'rating') {
            params.append('orderby.rating', direction);
        } else if (formState.sortType === 'year') {
            params.append('orderby.year', direction);
        }
    }

    return `${baseUrl}?${params.toString()}`;
};
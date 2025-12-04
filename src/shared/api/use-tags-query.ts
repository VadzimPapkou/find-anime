import { useQuery } from "@tanstack/react-query";
import Papa from 'papaparse'

type TUseTagsQueryParams = {language?: 'rus' | 'eng'};

export function useTagsQuery(params: TUseTagsQueryParams = {language: 'rus'}) {
    return useQuery({
        queryKey: ["tags", params],
        queryFn: () => fetchTags(params)
    });
}

export type TTag = {
    id: number;
    name: string;
    animeCount: number;
    description: string;
}

async function fetchTags(params: TUseTagsQueryParams): Promise<TTag[]> {
    const response = await fetch(`/tags-${params.language}.csv`);
    const text = await response.text();
    const parsed = Papa.parse<[string, string, string, string]>(text);
    return parsed.data.slice(1).map(([id, name, animeCount, description]) => ({
        id: +id,
        name,
        animeCount: +animeCount,
        description
    })).sort((a, b) => b.animeCount - a.animeCount);
}

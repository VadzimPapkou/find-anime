import { useQuery } from "@tanstack/react-query";
import Papa from 'papaparse'
import type { TLanguage } from "../types/language.ts";

type TUseTagsQueryParams = {language?: TLanguage};

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
    nameId: string;
}

async function fetchTags(params: TUseTagsQueryParams): Promise<TTag[]> {
    const response = await fetch(`/tags-${params.language}.csv`);
    const text = await response.text();
    const parsed = Papa.parse<[string, string, string, string, string]>(text);
    return parsed.data.slice(1).map(([id, name, animeCount, description, nameId]) => ({
        id: +id,
        name,
        animeCount: +animeCount,
        description,
        nameId
    })).sort((a, b) => b.animeCount - a.animeCount);
}

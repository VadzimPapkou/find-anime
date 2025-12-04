import { useQuery } from "@tanstack/react-query";
import Papa from 'papaparse'

export function useTagsQuery() {
    return useQuery({
        queryKey: ["tags"],
        queryFn: () => fetchTags()
    });
}

export type TTag = {
    id: number;
    name: string;
    animeCount: number;
    description: string;
}

async function fetchTags(): Promise<TTag[]> {
    const response = await fetch("/tags.csv");
    const text = await response.text();
    const parsed = Papa.parse<[string, string, string, string]>(text);
    return parsed.data.slice(1).map(([id, name, animeCount, description]) => ({
        id: +id,
        name,
        animeCount: +animeCount,
        description
    })).sort((a, b) => b.animeCount - a.animeCount);
}

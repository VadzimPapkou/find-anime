import { useQuery } from "@tanstack/react-query";
import Papa from 'papaparse';

export function useTagsNamesQuery() {
    return useQuery({
        queryKey: ["tags-names"],
        queryFn: fetchTagsNames
    });
}

async function fetchTagsNames(): Promise<Map<number, string>> {
    const response = await fetch('/tag-id-to-name.csv');
    const text = await response.text();
    const parsed = Papa.parse<[string, string]>(text, { skipEmptyLines: true });
    
    const map = new Map<number, string>();
    
    // Skip header row (first row)
    for (let i = 1; i < parsed.data.length; i++) {
        const [idStr, name] = parsed.data[i];
        if (idStr && name) {
            const id = Number.parseInt(idStr.trim(), 10);
            if (!Number.isNaN(id)) {
                map.set(id, name.trim());
            }
        }
    }
    
    return map;
}


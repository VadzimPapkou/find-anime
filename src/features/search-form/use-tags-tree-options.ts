import { useMemo } from "react";
import type { TLanguage } from "../../shared/types/language.ts";
import type { useTagsQuery } from "../../shared/api/use-tags-query.ts";
import type { useTagsTree } from "../../shared/api/use-tags-tree.ts";
import { tagsTranslationsOverrides } from "./translations.tsx";

type TreeSelectNode = {
    value: string;
    title: string;
    children?: TreeSelectNode[];
    key?: string;
};

type UseTagsTreeOptionsParams = {
    tagsTreeQuery: ReturnType<typeof useTagsTree>;
    tagsQuery: ReturnType<typeof useTagsQuery>;
    language: TLanguage;
};

export function useTagsTreeOptions({ tagsTreeQuery, tagsQuery, language }: UseTagsTreeOptionsParams) {
    return useMemo(() => {
        if (!tagsTreeQuery.data) return undefined;

        if (language === 'eng') return tagsTreeQuery.data;

        // Создаем карту переводов из tagsQuery
        // nameId - это английское название, которое совпадает с title в дереве
        // name - это переведенное название
        const tagsTranslationsMap = new Map<string, string>();
        if (tagsQuery.data) {
            tagsQuery.data.forEach(tag => {
                // Используем nameId как ключ для сопоставления с title узлов дерева
                if (tag.nameId) {
                    tagsTranslationsMap.set(tag.nameId, tag.name);
                }
            });
        }

        // Получаем переводы из searchFormTranlations как fallback
        const fallbackTranslations = tagsTranslationsOverrides[language] || {};

        // Рекурсивно применяем переводы к узлам дерева
        const applyTranslations = (nodes: TreeSelectNode[]): TreeSelectNode[] => {
            return nodes.map(node => {
                // Сначала пытаемся взять перевод из tagsQuery, если нет - из searchFormTranlations
                const translatedTitle = tagsTranslationsMap.get(node.title) 
                    || fallbackTranslations[node.title] 
                    || node.title;
                
                return {
                    ...node,
                    title: translatedTitle,
                    children: node.children ? applyTranslations(node.children) : undefined
                };
            });
        };

        return applyTranslations(tagsTreeQuery.data);
    }, [tagsTreeQuery.data, tagsQuery.data, language]);
}


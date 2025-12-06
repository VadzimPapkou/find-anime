import { useQuery } from "@tanstack/react-query";
import { baseApiUrl } from "./base-url.ts";

// Правильный тип для TreeSelect
type TreeSelectNode = {
    value: string;
    title: string;
    children?: TreeSelectNode[];
    key?: string; // Для совместимости
};

export function useTagsTree() {
    return useQuery({
        queryKey: ['tags-tree'],
        queryFn: fetchTagsTree
    })
}

async function fetchTagsTree(): Promise<TreeSelectNode[]> {
    const response = await fetch(`${baseApiUrl}/tags-tree.md`);
    const text = await response.text();
    return parseMarkdownToTreeSelect(text);
}

function parseMarkdownToTreeSelect(markdown: string): TreeSelectNode[] {
    const lines = markdown.split('\n');
    const result: TreeSelectNode[] = [];
    const stack: { node: TreeSelectNode; level: number }[] = [];


    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Пропускаем пустые строки и строки без звездочек
        if (trimmedLine.length === 0 || !trimmedLine.startsWith('* ')) {
            continue;
        }

        // Определяем уровень вложенности
        const leadingSpaces = line.match(/^(\s*)\*/)?.[1]?.length || 0;
        const level = Math.floor(leadingSpaces / 4);
        const name = trimmedLine.substring(2);

        // Создаем узел для TreeSelect
        const node: TreeSelectNode = {
            value: name,
            title: name,
            key: name,
            children: []
        };

        // Удаляем из стека все узлы с уровнем >= текущего
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        // Добавляем узел в нужное место
        if (stack.length === 0) {
            result.push(node);
        } else {
            const parent = stack[stack.length - 1].node;
            // Убедимся, что children существует
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(node);
        }

        // Добавляем текущий узел в стек
        stack.push({node, level});
    }

    return result;
}
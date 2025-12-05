import { useQuery } from "@tanstack/react-query";

export function useTagsTree() {
    return useQuery({
        queryKey: ['tags-tree'],
        queryFn: fetchTagsTree
    })
}

async function fetchTagsTree(): Promise<TreeNode[]> {
    const response = await fetch('/tags-tree.md');
    const text = await response.text();
    return parseMarkdownToTree(text);
}

interface TreeNode {
    name: string;
    level: number;
    children: TreeNode[];
}

function parseMarkdownToTree(markdown: string): TreeNode[] {
    const lines = markdown.split('\n');
    const result: TreeNode[] = [];
    const stack: { node: TreeNode; level: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Пропускаем пустые строки и строки без звездочек
        if (trimmedLine.length === 0 || !trimmedLine.startsWith('* ')) {
            continue;
        }

        const leadingSpaces = line.match(/^(\s*)\*/)?.[1]?.length || 0;
        const level = Math.floor(leadingSpaces / 4);
        const name = trimmedLine.substring(2); // Убираем "* "

        const node: TreeNode = {
            name,
            level,
            children: []
        };

        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        if (stack.length === 0) {
            result.push(node);
        } else {
            stack[stack.length - 1].node.children.push(node);
        }

        stack.push({ node, level });
    }

    return result;
}
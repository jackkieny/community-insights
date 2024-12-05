import { parseDocument } from 'htmlparser2';

export const handleConvertContent = (htmlContent: string): string => {
  const document = parseDocument(htmlContent);
  let result = '';
  let insideList = false;

  const traverse = (node: any, nextNode: any = null) => {
    if (node.type === 'text') {
      result += node.data.replace(/\n/g, '\\n');
    } else if (node.type === 'tag') {
      if (node.name === 'p') {
        node.children.forEach((child: any) => traverse(child));
        if (!insideList) {
          result += '\\n';
        }
      } else if (node.name === 'ol') {
        result += '[ol:1]';
        insideList = true;
        node.children.forEach((child: any) => traverse(child));
        insideList = false;
        if (nextNode && nextNode.name !== 'li') {
          result += '\\n';
        }
      } else if (node.name === 'ul') {
        result += '[ul]';
        insideList = true;
        node.children.forEach((child: any) => traverse(child));
        insideList = false;
        if (nextNode && nextNode.name !== 'li') {
          result += '\\n';
        }
      } else if (node.name === 'li') {
        result += '[li]';
        node.children.forEach((child: any) => traverse(child));
      }
    }
  };

  document.children.forEach((node, index) => {
    const nextNode = document.children[index + 1];
    traverse(node, nextNode);
  });

  // Remove any trailing newlines
  result = result.replace(/\\n+$/, '');

  return result;
};
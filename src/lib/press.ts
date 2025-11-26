export type PressItem = {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  publishedDate: string; // ISO date string
  addedDate: string; // When it was added to the system
};

// Dynamic press items loading from JSON file
function loadPressItems(): PressItem[] {
  // Only load from filesystem on server-side
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const pressPath = path.join(process.cwd(), 'data', 'press.json');
      
      // Read JSON file
      const fileContent = fs.readFileSync(pressPath, 'utf-8');
      const pressArray = JSON.parse(fileContent);
      return pressArray;
    } catch (e) {
      console.error('Error loading press items from JSON:', e);
      return [];
    }
  }
  // Client-side: return empty array
  return [];
}

export function getPressItemById(id: string): PressItem | undefined {
  return loadPressItems().find((item) => item.id === id);
}

export function getAllPressItems(): PressItem[] {
  return loadPressItems()
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

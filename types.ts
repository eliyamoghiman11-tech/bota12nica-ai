export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface PlantAnalysis {
  plantName: string;
  careInstructions: string;
  confidence?: string;
}

export enum AppMode {
  IDENTIFY = 'IDENTIFY',
  CHAT = 'CHAT',
}

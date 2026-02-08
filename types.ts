
export interface Quote {
  id: number;
  text: string;
  author: string;
}

export interface LoveWord {
  lang: string;
  text: string;
}

export interface Letter {
  id: number;
  title: string;
  content: string;
  date: string;
}

export type AppStage = 'intro' | 'valentine' | 'gallery' | 'universe' | 'letters';

export interface NavTabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

export interface ThemeProps {
  theme?: 'light' | 'dark';
}

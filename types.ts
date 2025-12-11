export interface Project {
  id: number;
  title: string;
  description: string;
  badges: string[];
  image: string;
  links: {
    github: string;
    demo: string;
  };
}

export interface TimelineItem {
  id: number;
  year: string;
  title: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
}
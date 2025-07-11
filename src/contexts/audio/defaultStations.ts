
import { RadioStation } from '@/hooks/audio/types';

export const defaultStations: RadioStation[] = [
  { 
    id: "soma-groove-salad",
    name: "SomaFM - Groove Salad", 
    url: "https://ice2.somafm.com/groovesalad-128-mp3",
    fallbackUrl: "https://ice6.somafm.com/groovesalad-128-mp3"
  },
  { 
    id: "soma-drone-zone",
    name: "SomaFM - Drone Zone", 
    url: "https://ice4.somafm.com/dronezone-128-mp3",
    fallbackUrl: "https://ice6.somafm.com/dronezone-128-mp3"
  },
  { 
    id: "soma-deep-space-one",
    name: "SomaFM - Deep Space One", 
    url: "https://ice4.somafm.com/deepspaceone-128-mp3",
    fallbackUrl: "https://ice6.somafm.com/deepspaceone-128-mp3"
  },
  {
    id: "soma-secret-agent",
    name: "SomaFM - Secret Agent",
    url: "https://ice4.somafm.com/secretagent-128-mp3",
    fallbackUrl: "https://ice6.somafm.com/secretagent-128-mp3"
  },
  { 
    id: "soma-lush",
    name: "SomaFM - Lush", 
    url: "https://ice4.somafm.com/lush-128-mp3",
    fallbackUrl: "https://ice6.somafm.com/lush-128-mp3"
  }
];

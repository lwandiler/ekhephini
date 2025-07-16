
import { RadioStation } from '@/hooks/audio/types';

export const defaultStations: RadioStation[] = [
  {
    id: "mcr-969",
    name: "MCRS 96.9 FM",
    url: "https://streamlive-edge-01.broadsmart-streaming.co.za:5443/mdda/streams/mcr128kbps.m3u8",
    fallbackUrl: "https://ice2.somafm.com/groovesalad-128-mp3", // Different fallback URL
    description: "Moutse Community Radio Station - Your trusted voice in the community",
    genre: "Community Radio",
    location: "Moutse, South Africa"
  },
  {
    id: "soma-groove",
    name: "SomaFM - Groove Salad",
    url: "https://ice1.somafm.com/groovesalad-128-mp3",
    fallbackUrl: "https://ice2.somafm.com/groovesalad-128-mp3",
    description: "A nicely chilled plate of ambient/downtempo beats and grooves",
    genre: "Ambient",
    location: "San Francisco, CA"
  },
  {
    id: "kexp",
    name: "KEXP 90.3 FM",
    url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3",
    fallbackUrl: "https://kexp.streamguys1.com/kexp128.mp3",
    description: "Independent music from Seattle",
    genre: "Alternative",
    location: "Seattle, WA"
  }
];

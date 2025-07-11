
import { RadioStation } from '../types';

export function useChangeStation() {
  const changeStation = (
    direction: 'next' | 'prev',
    currentStation: number,
    stations: RadioStation[],
    setCurrentStation: (value: number) => void,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    retryCount: React.MutableRefObject<number>
  ) => {
    let newStation = currentStation;
    
    if (direction === 'next') {
      newStation = (currentStation + 1) % stations.length;
    } else {
      newStation = (currentStation - 1 + stations.length) % stations.length;
    }
    
    console.log(`Changing to ${direction} station: ${stations[newStation].name}`);
    setCurrentStation(newStation);
    setIsLoading(true);
    setStreamError(null);
    retryCount.current = 0;
  };

  return { changeStation };
}

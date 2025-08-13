import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShowWithFormattedTime } from '@/services/api/showsService';

function getCurrentDayName(): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date());
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function isNowBetween(start: string, end: string): boolean {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (Number.isNaN(s) || Number.isNaN(e)) return false;
  if (e >= s) {
    return minutes >= s && minutes < e;
  } else {
    // Overnight schedule (e.g., 22:00 - 02:00)
    return minutes >= s || minutes < e;
  }
}

export const useCurrentShow = () => {
  const [currentShow, setCurrentShow] = useState<ShowWithFormattedTime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentShow = async () => {
    setLoading(true);
    try {
      const day = getCurrentDayName();
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .eq('day_of_week', day);

      if (error) {
        console.error('useCurrentShow: error fetching shows', error);
        setCurrentShow(null);
        return;
      }

      const list = Array.isArray(data) ? data : [];
      const nowShow = list
        .filter((s: any) => s.start_time && s.end_time)
        .filter((s: any) => isNowBetween(s.start_time as string, s.end_time as string))
        .sort((a: any, b: any) => toMinutes(b.start_time as string) - toMinutes(a.start_time as string))[0];

      if (nowShow) {
        const start = nowShow.start_time as string;
        const end = nowShow.end_time as string;
        const formatted = `${start} - ${end}`;
        setCurrentShow({
          id: nowShow.id,
          title: nowShow.title,
          startTime: start,
          endTime: end,
          formattedTime: formatted,
          host: nowShow.host ?? '',
          time: formatted,
          description: nowShow.description ?? '',
          day_of_week: nowShow.day_of_week ?? day,
          image_url: nowShow.image_url ?? null,
        });
      } else {
        setCurrentShow(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentShow();
    const id = setInterval(fetchCurrentShow, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return { currentShow, loading };
};

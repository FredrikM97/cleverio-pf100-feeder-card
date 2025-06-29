// Mealplan state utilities 
export interface FeedingTime {
  time: string;
  portion: number;
  daysMask: number;
  enabled: boolean;
}
export function getNextSchedule(feedingTimes: FeedingTime[]): string {
  if (!feedingTimes || feedingTimes.length === 0) return '-';
  const enabled = feedingTimes.filter(t => t.enabled);
  if (enabled.length === 0) return '-';
  enabled.sort((a, b) => a.time.localeCompare(b.time));
  return enabled[0].time;
}
// Returns an array of total food per day, index 0=Monday, 6=Sunday
export function getTotalFoodPerDay(feedingTimes: FeedingTime[]): number[] {
  const totals = Array(7).fill(0);
  feedingTimes.forEach(t => {
    if (!t.enabled) return;
    for (let i = 0; i < 7; i++) {
      if (t.daysMask & (1 << i)) {
        totals[i] += t.portion;
      }
    }
  });
  return totals;
}
// Returns total food for a given day index (0=Monday, 6=Sunday)
export function getTodaysFoodGrams(feedingTimes: FeedingTime[], dayIdx: number): number {
  let total = 0;
  feedingTimes.forEach(t => {
    if (!t.enabled) return;
    if (t.daysMask & (1 << dayIdx)) {
      total += t.portion;
    }
  });
  return total;
}
export function decodeMealPlanData(base64String: string): FeedingTime[] {
    if (!base64String || base64String === 'unknown') return [];
    let binary: string;
    try { binary = atob(base64String); } catch { throw new Error('Invalid base64'); }
    const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
    if (bytes.length % 5 !== 0) throw new Error('Invalid meal plan length');
    const mealPlan: FeedingTime[] = [];
    for (let i = 0; i < bytes.length; i += 5) {
        const [daysBits, hour, minute, portion, status] = bytes.slice(i, i + 5);
        mealPlan.push({
            time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            daysMask: daysBits,
            portion: portion || 1,
            enabled: status === 1
        });
    }
    return mealPlan;
}

export function encodeMealPlanData(feedingTimes: FeedingTime[]): string {
    const bytes: number[] = [];
    feedingTimes.forEach(item => {
        const [hour, minute] = item.time.split(":").map(Number);
        bytes.push(
            item.daysMask,
            hour,
            minute,
            Number(item.portion),
            item.enabled ? 1 : 0
        );
    });
    return btoa(String.fromCharCode(...bytes));
}

export function parseFeedingTime(str: string): { time: string; portion: number; days: string[] } {
  // Expects format: '08:00,2,Monday,Tuesday'
  const [time, portion, ...days] = str.split(',');
  return {
    time,
    portion: Number(portion),
    days
  };
}
export function formatFeedingTime(obj: { time: string; portion: number; days: string[] }): string {
  // Returns format: '08:00,2,Monday,Tuesday'
  return [obj.time, obj.portion, ...obj.days].join(',');
}

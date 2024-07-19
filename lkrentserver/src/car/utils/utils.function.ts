export function parseRelativeTimeToDate(relativeTime: string): Date {
    const now = new Date();
    if (relativeTime.includes('giờ tới')) {
      const hours = parseInt(relativeTime.split(' ')[0]);
      now.setHours(now.getHours() + hours);
    } else if (relativeTime.includes('tuần tới')) {
      const weeks = parseInt(relativeTime.split(' ')[0]);
      now.setDate(now.getDate() + (weeks * 7));
    }
    return now;
  }
  
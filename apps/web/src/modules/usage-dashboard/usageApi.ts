import config from '../../config/config';

const STORAGE_KEY = 'roisalen_usage_admin_secret';

export function getStoredAdminSecret(): string {
  return sessionStorage.getItem(STORAGE_KEY) ?? '';
}

export function setStoredAdminSecret(secret: string): void {
  if (secret) {
    sessionStorage.setItem(STORAGE_KEY, secret);
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export interface ActiveMeetingRow {
  organisation: string;
  organisationName: string;
  queueLength: number;
  currentSpeakerLabel: string | null;
}

export interface RecentMeetingRow {
  organisation: string;
  organisationName: string;
  eventCount: number;
  lastActivity: string;
  firstActivityInPeriod: string;
}

export interface UsageSummary {
  generatedAt: string;
  activeMeetings: ActiveMeetingRow[];
  recentMeetingsLast30Days: RecentMeetingRow[];
}

export async function fetchUsageSummary(secret: string): Promise<UsageSummary> {
  const res = await fetch(`${config.apiUrl}/usage/summary`, {
    headers: { 'X-Admin-Secret': secret },
  });
  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (res.status === 503) {
    await res.json().catch(() => undefined);
    throw new Error('NOT_CONFIGURED');
  }
  if (!res.ok) {
    throw new Error(`HTTP_${res.status}`);
  }
  return res.json() as Promise<UsageSummary>;
}

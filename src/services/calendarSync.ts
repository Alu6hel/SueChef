import { CaseFile } from '../types';
import { sound } from './soundEngine';

export interface CalendarEventDef {
  uid: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  alarmsDaysBefore?: number[];
}

export class CalendarSyncService {
  private static formatDateToIcs(date: Date, isAllDay: boolean = true): string {
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());

    if (isAllDay) {
      return `${year}${month}${day}`;
    }

    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  public static generateIcsContent(events: CalendarEventDef[], calendarName: string = 'SueChef Court Deadlines'): string {
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SueChef Legal Technology Suite//Pro Se Litigation Docket//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${calendarName}`,
      'X-WR-TIMEZONE:UTC'
    ];

    events.forEach(evt => {
      const dtStart = this.formatDateToIcs(evt.startDate, true);
      const nextDay = new Date(evt.startDate.getTime() + 24 * 60 * 60 * 1000);
      const dtEnd = this.formatDateToIcs(evt.endDate || nextDay, true);
      const nowStr = this.formatDateToIcs(new Date(), false);

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${evt.uid}@suechef.app`);
      lines.push(`DTSTAMP:${nowStr}`);
      lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
      lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
      lines.push(`SUMMARY:${evt.title.replace(/[,;]/g, ' ')}`);
      lines.push(`DESCRIPTION:${evt.description.replace(/\n/g, '\\n').replace(/[,;]/g, ' ')}`);
      if (evt.location) {
        lines.push(`LOCATION:${evt.location.replace(/[,;]/g, ' ')}`);
      }
      lines.push('STATUS:CONFIRMED');

      // Add alarms
      const alarms = evt.alarmsDaysBefore || [14, 3, 1];
      alarms.forEach((days, idx) => {
        lines.push('BEGIN:VALARM');
        lines.push(`ACTION:DISPLAY`);
        lines.push(`DESCRIPTION:REMINDER: ${evt.title}`);
        lines.push(`TRIGGER:-P${days}D`);
        lines.push('END:VALARM');
      });

      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  public static generateCaseDocketEvents(caseFile: CaseFile): CalendarEventDef[] {
    const events: CalendarEventDef[] = [];
    const pName = caseFile.parties.find(p => p.role === 'plaintiff')?.name || 'Plaintiff';
    const dName = caseFile.parties.find(p => p.role === 'defendant')?.name || 'Defendant';

    // 1. Demand Letter Deadline
    const demandDateStr = caseFile.pleadings.demandLetter.demandDate || caseFile.createdAt || new Date().toISOString();
    const demandDays = caseFile.pleadings.demandLetter.responseDeadlineDays || 10;
    const demandStart = new Date(demandDateStr);
    const demandDeadline = new Date(demandStart.getTime() + demandDays * 24 * 60 * 60 * 1000);
    
    events.push({
      uid: `demand_${caseFile.id}`,
      title: `⚖️ Pre-Suit Demand Cure Deadline: ${pName} v. ${dName}`,
      description: `Formal pre-suit demand letter expiration. If ${dName} has not tendered settlement payment by today, proceed immediately to file complaint in court.`,
      startDate: demandDeadline,
      location: `${caseFile.county || 'Local'} Superior / Small Claims Court`,
      alarmsDaysBefore: [7, 3, 1]
    });

    // 2. Service of Process Deadline (FRCP Rule 4(m) / 90-day clock)
    const filingDate = new Date(demandDeadline.getTime() + 7 * 24 * 60 * 60 * 1000);
    const serviceDeadline = new Date(filingDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    events.push({
      uid: `service_deadline_${caseFile.id}`,
      title: `🚨 Service of Process 90-Day Bar Date (Rule 4(m))`,
      description: `Mandatory service deadline. Proof of Service affidavit must be executed and filed with the court clerk to prevent dismissal without prejudice.`,
      startDate: serviceDeadline,
      location: `${caseFile.county || 'Local'} Court Clerk Window`,
      alarmsDaysBefore: [30, 14, 3, 1]
    });

    // 3. Statute of Limitations Deadlines from SolDocket
    if (caseFile.solDocket && caseFile.solDocket.length > 0) {
      caseFile.solDocket.forEach(item => {
        const expDate = new Date(item.expirationDate);
        events.push({
          uid: `sol_${item.id}`,
          title: `🛑 STATUTE OF LIMITATIONS EXPIRES: ${item.title}`,
          description: `FINAL STATUTORY DEADLINE: Under applicable state limitations period (${item.statutoryLimitYears} years), all rights to file suit for this cause of action will be permanently barred after today. File complaint immediately.`,
          startDate: expDate,
          location: `${caseFile.state} Civil Court`,
          alarmsDaysBefore: [60, 30, 14, 3, 1]
        });
      });
    }

    // 4. Trial / Small Claims Hearing Date
    const trialDate = new Date(serviceDeadline.getTime() + 45 * 24 * 60 * 60 * 1000);
    events.push({
      uid: `trial_${caseFile.id}`,
      title: `🏛️ Court Hearing / Trial Appearance: ${caseFile.title}`,
      description: `Court hearing before Judge or Magistrate. Bring 3 printed copies of SueChef Master Court Filing Packet, Evidence Exhibit Binder with SHA-256 certifications, and Trial Script.`,
      startDate: trialDate,
      location: `${caseFile.county || 'County'} Courthouse, Small Claims / Civil Division`,
      alarmsDaysBefore: [14, 7, 3, 1]
    });

    return events;
  }

  public static exportDocketToCalendar(caseFile: CaseFile): { success: boolean; eventCount: number } {
    sound.playDocketStamp();
    const events = this.generateCaseDocketEvents(caseFile);
    const icsString = this.generateIcsContent(events, `SueChef Docket - ${caseFile.title}`);

    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanTitle = caseFile.title.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `${cleanTitle}_Court_Deadlines.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, eventCount: events.length };
  }
}

import evidenceFile from './data/evidence.json';
import type { CalendarStatus, HistoryDateEvidence, HistoryRecord, HistorySiteEvidence, HistorySource, HistoryTime } from './historyModel';

type DateEvidence = Omit<HistoryDateEvidence, 'sources'> & { status: CalendarStatus; sources: string[] };
type PlaceEvidence = Pick<HistorySiteEvidence, 'scope' | 'radiusMeters'> & {
  name: string; latitude: number; longitude: number; note: string; sources: string[]; timeZone?: string;
};
type SourceKeys<T> = T extends { kind: string } ? Omit<T, 'sources'> & { sources?: string[] } : never;
type StoredTime<T> = T extends { source: HistorySource; clockBasis: infer B }
  ? Omit<T, 'source' | 'clockBasis'> & { source: string; clockBasis: SourceKeys<B> } : T;
type Evidence = {
  date?: DateEvidence;
  place?: PlaceEvidence;
  time?: StoredTime<HistoryTime>;
  event?: { name: string; note: string; sources: string[] };
};

const { records, revisions, sources } = evidenceFile as {
  records: Record<string, Evidence>;
  revisions: Record<string, { baseRecordHash: string; recordHash: string }>;
  sources: Record<string, HistorySource>;
};

const lookup = (ids: string[]) => ids.map(id => sources[id]);

export function applyHistoryEvidence(record: HistoryRecord): HistoryRecord {
  const entry = records[record.id];
  if (!entry) return record;
  const revision = revisions[record.id];
  if (revision?.baseRecordHash !== record.provenance.recordHash) throw new Error(`Outdated history evidence: ${record.id}`);
  const enriched: HistoryRecord = { ...record, provenance: { ...record.provenance, ...revision } };
  if (entry.event) {
    const { name, note, sources } = entry.event;
    enriched.name = name;
    enriched.eventEvidence = { note, sources: lookup(sources) };
  }
  if (entry.date) {
    const { status, sources, ...fields } = entry.date;
    enriched.date = { ...record.date, status, evidence: { ...fields, sources: lookup(sources) } };
  }
  if (entry.place) {
    const { scope, radiusMeters, sources, ...observer } = entry.place;
    const links = lookup(sources);
    enriched.place = { ...record.place, observer: { ...observer, source: links[links.length - 1].url,
      precision: scope === 'site' ? 'historical-site' : 'representative' },
    evidence: { scope, coordinateSystem: 'WGS84', radiusMeters, sources: links } };
  }
  if (entry.time) {
    if (entry.time.precision === 'date-only') enriched.time = entry.time;
    else {
      const { clockBasis, source, ...details } = entry.time;
      const links = lookup(clockBasis.sources ?? []);
      enriched.time = { ...details, source: sources[source], clockBasis: { ...clockBasis, sources: links } };
    }
  }
  return enriched;
}

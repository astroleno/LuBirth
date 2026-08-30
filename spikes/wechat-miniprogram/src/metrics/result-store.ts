import { RESULT_SCHEMA_VERSION, type RunResult } from './result-schema.ts';

export type FileSystemAdapter = {
  exists(path: string): Promise<boolean>;
  ensureDirectory(path: string): Promise<void>;
  writeText(path: string, content: string): Promise<void>;
};

function assertSafeId(id: string, field: string): void {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(id)) {
    throw new Error(`${field} contains unsafe path characters`);
  }
}

export class ResultStore {
  private readonly resultsDirectory: string;
  private readonly runsDirectory: string;
  private readonly fs: FileSystemAdapter;

  constructor(
    rootDirectory: string,
    fs: FileSystemAdapter,
  ) {
    this.fs = fs;
    this.resultsDirectory = `${rootDirectory.replace(/\/$/, '')}/results`;
    this.runsDirectory = `${this.resultsDirectory}/runs`;
  }

  async writeRun(run: RunResult): Promise<string> {
    assertSafeId(run.runId, 'runId');
    const path = `${this.runsDirectory}/${run.runId}.json`;
    await this.ensureDirectory(this.runsDirectory);
    if (await this.fs.exists(path)) {
      throw new Error(`Run ${run.runId} already exists; raw evidence is immutable`);
    }
    await this.fs.writeText(path, JSON.stringify(run, null, 2));
    return path;
  }

  async writeSummary(summaryId: string, runIds: string[]): Promise<string> {
    assertSafeId(summaryId, 'summaryId');
    for (const runId of runIds) assertSafeId(runId, 'runId');
    const path = `${this.resultsDirectory}/${summaryId}.json`;
    await this.ensureDirectory(this.resultsDirectory);
    await this.fs.writeText(path, JSON.stringify({
      schemaVersion: RESULT_SCHEMA_VERSION,
      summaryId,
      runIds: [...runIds],
    }, null, 2));
    return path;
  }

  private async ensureDirectory(path: string): Promise<void> {
    if (!(await this.fs.exists(path))) await this.fs.ensureDirectory(path);
  }
}

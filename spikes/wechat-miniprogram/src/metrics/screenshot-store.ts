export interface ScreenshotFileSystem {
  exists(path: string): Promise<boolean>;
  ensureDirectory(path: string): Promise<void>;
  copyFile(source: string, destination: string): Promise<void>;
}

export class ScreenshotStore {
  private readonly resultRoot: string;
  private readonly fileSystem: ScreenshotFileSystem;

  constructor(
    resultRoot: string,
    fileSystem: ScreenshotFileSystem,
  ) {
    this.resultRoot = resultRoot;
    this.fileSystem = fileSystem;
  }

  async persist(temporaryPath: string, runId: string): Promise<string> {
    if (!/^[a-zA-Z0-9_-]+$/.test(runId)) throw new Error('runId contains unsafe path characters');
    const directory = `${this.resultRoot.replace(/\/$/, '')}/screenshots`;
    const destination = `${directory}/${runId}.png`;
    await this.fileSystem.ensureDirectory(directory);
    if (await this.fileSystem.exists(destination)) {
      throw new Error(`screenshot already exists for runId ${runId}`);
    }
    await this.fileSystem.copyFile(temporaryPath, destination);
    return destination;
  }
}

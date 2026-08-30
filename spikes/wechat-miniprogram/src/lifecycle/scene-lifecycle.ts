type Disposable = { dispose(): void };

type SceneLifecycleOptions = {
  requestFrame(callback: (timestamp: number) => void): number;
  cancelFrame(id: number): void;
  renderFrame(timestamp: number): void;
  scene: Disposable;
  runtime: Disposable;
  assets: Disposable & { handleMemoryWarning(): void };
};

export class SceneLifecycle {
  private readonly options: SceneLifecycleOptions;
  private state: 'hidden' | 'visible' | 'unloaded' = 'hidden';
  private frameId: number | null = null;
  private showCount = 0;
  private hideCount = 0;
  private memoryWarningCount = 0;

  constructor(options: SceneLifecycleOptions) {
    this.options = options;
  }

  onShow(): void {
    if (this.state === 'unloaded' || this.state === 'visible') return;
    this.state = 'visible';
    this.showCount += 1;
    this.scheduleFrame();
  }

  onHide(): void {
    if (this.state !== 'visible') return;
    this.state = 'hidden';
    this.hideCount += 1;
    this.cancelScheduledFrame();
  }

  onMemoryWarning(): void {
    if (this.state === 'unloaded') return;
    this.memoryWarningCount += 1;
    this.options.assets.handleMemoryWarning();
  }

  onUnload(): void {
    if (this.state === 'unloaded') return;
    this.state = 'unloaded';
    this.cancelScheduledFrame();
    this.options.scene.dispose();
    this.options.assets.dispose();
    this.options.runtime.dispose();
  }

  snapshot() {
    return {
      state: this.state,
      showCount: this.showCount,
      hideCount: this.hideCount,
      memoryWarningCount: this.memoryWarningCount,
      frameActive: this.frameId !== null,
    };
  }

  private readonly frame = (timestamp: number) => {
    this.frameId = null;
    if (this.state !== 'visible') return;
    this.options.renderFrame(timestamp);
    this.scheduleFrame();
  };

  private scheduleFrame(): void {
    if (this.frameId !== null || this.state !== 'visible') return;
    this.frameId = this.options.requestFrame(this.frame);
  }

  private cancelScheduledFrame(): void {
    if (this.frameId === null) return;
    this.options.cancelFrame(this.frameId);
    this.frameId = null;
  }
}

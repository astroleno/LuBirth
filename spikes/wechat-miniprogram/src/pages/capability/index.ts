import baseline from '../../astro/web-baseline.json';
import { computeAstroSnapshot, computeAstroSnapshots, runSourceCharacterization } from '../../astro/entry.ts';
import { createWechatTextureLoader, type MiniProgramTextureLoader } from '../../assets/texture-loader.ts';
import { SCENARIOS } from '../../config/scenarios.ts';
import {
  finalizeRun,
  createRunResult,
  type DeviceMetadata,
  type SourceFingerprint,
} from '../../metrics/result-schema.ts';
import { ResultStore, type FileSystemAdapter } from '../../metrics/result-store.ts';
import { ScreenshotStore, type ScreenshotFileSystem } from '../../metrics/screenshot-store.ts';
import {
  LifecycleEvidenceSession,
  type LifecycleEvidencePersistence,
  type LifecycleEvidenceState,
  type LifecycleEventRecord,
  type LifecycleSummary,
} from '../../lifecycle/lifecycle-evidence-session.ts';
import { R108OfficialAdapter } from '../../runtime/r108-official-adapter.ts';
import { R160Adapter } from '../../runtime/r160-adapter.ts';
import {
  compareLoadedSceneConfig,
  type LoadedSceneConfig,
} from '../../runtime/loaded-config.ts';
import type { RuntimeRoute, RuntimeSession } from '../../runtime/runtime-contract.ts';
import { LubirthCapabilityScene } from '../../scene/lubirth-capability-scene.ts';
import { RunHarness } from '../../tests/harness-self-test.ts';
import { createAstroParityReport, type AstroSnapshot } from '../../tests/astro-parity-test.ts';
import { summarizeAssetTier } from '../../tests/asset-tier-test.ts';
import {
  captureFrameWindow,
  evaluateBaselinePerformance,
  evaluateBenchmarkStatus,
  FrameWindowAbort,
  firstStableFrame,
  runPairedPipBenchmark,
} from '../../tests/performance-benchmark-test.ts';
import { runRuntimeCapabilityTest } from '../../tests/runtime-capability-test.ts';
import { runSceneCapabilityTest } from '../../tests/scene-capability-test.ts';

function collectDeviceMetadata(): DeviceMetadata {
  const system = typeof wx.getSystemInfoSync === 'function' ? wx.getSystemInfoSync() : {};
  const device = typeof wx.getDeviceInfo === 'function' ? wx.getDeviceInfo() : {};
  const appBase = typeof wx.getAppBaseInfo === 'function' ? wx.getAppBaseInfo() : {};
  const rawPlatform = device.platform ?? system.platform ?? 'unknown';
  const platform = rawPlatform === 'devtools'
    ? 'devtools'
    : rawPlatform === 'ios' || rawPlatform === 'android'
      ? rawPlatform
      : 'unknown';
  return {
    platform,
    model: device.model ?? system.model,
    osVersion: device.system ?? system.system,
    wechatVersion: appBase.version ?? system.version,
    baseLibraryVersion: appBase.SDKVersion ?? system.SDKVersion,
    dpr: device.pixelRatio ?? system.pixelRatio,
    screenWidth: device.screenWidth ?? system.screenWidth,
    screenHeight: device.screenHeight ?? system.screenHeight,
  };
}

function hasRealAppId(): boolean {
  try {
    const appId = wx.getAccountInfoSync?.().miniProgram?.appId;
    return Boolean(appId && appId !== 'touristappid');
  } catch {
    return false;
  }
}

function createFileSystemAdapter(): FileSystemAdapter {
  const manager = wx.getFileSystemManager();
  return {
    exists: (path) => new Promise((resolve) => {
      manager.access({ path, success: () => resolve(true), fail: () => resolve(false) });
    }),
    ensureDirectory: (path) => new Promise((resolve, reject) => {
      manager.mkdir({
        dirPath: path,
        recursive: true,
        success: () => resolve(),
        fail: (error: unknown) => reject(error),
      });
    }),
    writeText: (path, content) => new Promise((resolve, reject) => {
      manager.writeFile({
        filePath: path,
        data: content,
        encoding: 'utf8',
        success: () => resolve(),
        fail: (error: unknown) => reject(error),
      });
    }),
  };
}

function makeRunId(scenarioId: string): string {
  return `${scenarioId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapTouches(event: any) {
  return Array.from(event.touches ?? []).map((touch: any) => ({
    id: touch.identifier ?? touch.id ?? 0,
    x: touch.clientX ?? touch.x ?? touch.pageX ?? 0,
    y: touch.clientY ?? touch.y ?? touch.pageY ?? 0,
  }));
}

function createScreenshotFileSystem(): ScreenshotFileSystem {
  const manager = wx.getFileSystemManager();
  return {
    exists: (path) => new Promise((resolve) => {
      manager.access({ path, success: () => resolve(true), fail: () => resolve(false) });
    }),
    ensureDirectory: (path) => new Promise((resolve, reject) => {
      manager.mkdir({
        dirPath: path,
        recursive: true,
        success: () => resolve(),
        fail: (error: unknown) => reject(error),
      });
    }),
    copyFile: (source, destination) => new Promise((resolve, reject) => {
      manager.copyFile({
        srcPath: source,
        destPath: destination,
        success: () => resolve(),
        fail: (error: unknown) => reject(error),
      });
    }),
  };
}

async function captureCanvasScreenshot(
  canvas: any,
  runId: string,
): Promise<{ persistentPath?: string; error?: string }> {
  if (typeof wx.canvasToTempFilePath !== 'function') {
    return { error: 'wx.canvasToTempFilePath unavailable' };
  }
  const temporaryPath = await new Promise<string>((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvas,
      fileType: 'png',
      quality: 1,
      success: (result: any) => resolve(result.tempFilePath),
      fail: (error: unknown) => reject(error instanceof Error ? error : new Error(String(error))),
    });
  });
  try {
    const store = new ScreenshotStore(`${wx.env.USER_DATA_PATH}/results`, createScreenshotFileSystem());
    return { persistentPath: await store.persist(temporaryPath, runId) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

function createLifecyclePersistence(): LifecycleEvidencePersistence {
  const manager = wx.getFileSystemManager();
  const root = `${wx.env.USER_DATA_PATH}/results/lifecycle`;
  const activePath = `${root}/active.json`;
  const ensureDirectory = (path: string) => {
    try {
      manager.mkdirSync(path, true);
    } catch (error) {
      const message = String(error);
      if (!/exist/i.test(message)) throw error;
    }
  };
  const readJson = <T>(path: string): T | null => {
    try {
      const value = manager.readFileSync(path, 'utf8');
      return JSON.parse(String(value)) as T;
    } catch {
      return null;
    }
  };
  const writeImmutableJson = (directory: string, path: string, value: unknown) => {
    ensureDirectory(directory);
    try {
      manager.accessSync(path);
      throw new Error(`immutable lifecycle evidence already exists: ${path}`);
    } catch (error) {
      if (/already exists/.test(String(error))) throw error;
    }
    manager.writeFileSync(path, JSON.stringify(value, null, 2), 'utf8');
  };
  return {
    loadActive: () => readJson<LifecycleEvidenceState>(activePath),
    saveActive: (state) => {
      ensureDirectory(root);
      manager.writeFileSync(activePath, JSON.stringify(state, null, 2), 'utf8');
    },
    writeEvent: (event: LifecycleEventRecord) => {
      const directory = `${root}/events`;
      writeImmutableJson(directory, `${directory}/${event.runId}.json`, event);
    },
    writeSummary: (summary: LifecycleSummary) => {
      const directory = `${root}/summaries`;
      writeImmutableJson(directory, `${directory}/${summary.runId}.json`, summary);
    },
  };
}

function rendererResourceCount(renderer: any): number {
  const memory = renderer?.info?.memory;
  const programs = Array.isArray(renderer?.info?.programs) ? renderer.info.programs.length : 0;
  return Number(memory?.geometries ?? 0) + Number(memory?.textures ?? 0) + programs;
}

function snapshotRendererInfo(renderer: any) {
  return renderer.info ? {
    render: { ...renderer.info.render },
    memory: { ...renderer.info.memory },
    programs: Array.isArray(renderer.info.programs) ? renderer.info.programs.length : null,
  } : null;
}

async function captureStableSceneFrames(
  session: RuntimeSession,
  scene: LubirthCapabilityScene,
  loadStartedAt: number,
  initialShaderErrorCount: number,
  abort: FrameWindowAbort,
) {
  const observations: Array<{
    timestampMs: number;
    coreTexturesReady: boolean;
    shaderErrorCount: number;
    resourceGeneration: number;
  }> = [];
  await new Promise<void>((resolve, reject) => {
    let frameId: number | null = null;
    let completed = false;
    let unsubscribe: () => void = () => undefined;
    const complete = () => {
      if (completed) return;
      completed = true;
      if (frameId !== null) session.cancelFrame(frameId);
      frameId = null;
      unsubscribe();
      resolve();
    };
    const frame = (timestamp: number) => {
      frameId = null;
      if (abort.aborted) {
        complete();
        return;
      }
      try {
        scene.render(timestamp);
        const glError = typeof session.gl.getError === 'function' ? session.gl.getError() : session.gl.NO_ERROR;
        observations.push({
          timestampMs: Date.now() - loadStartedAt,
          coreTexturesReady: true,
          shaderErrorCount: initialShaderErrorCount + (glError === session.gl.NO_ERROR ? 0 : 1),
          resourceGeneration: 1,
        });
        if (observations.length >= 11) complete();
        else frameId = session.requestFrame(frame);
      } catch (error) {
        completed = true;
        unsubscribe();
        reject(error);
      }
    };
    unsubscribe = abort.subscribe(complete);
    if (!completed) frameId = session.requestFrame(frame);
  });
  return { observations, stable: firstStableFrame(observations), interrupted: abort.aborted };
}

Page({
  data: {
    scenarioLabels: SCENARIOS.map((scenario) => scenario.label),
    scenarioIndex: 0,
    assetTier: '2k',
    pipEnabled: true,
    runtimeRoute: 'r160',
    running: false,
    hasResult: false,
    statusText: '等待运行',
    statusTone: 'inconclusive',
    resultJson: '尚无结果',
    lifecycleActive: false,
    lifecycleStatus: '未开始生命周期压力测试',
  },

  canvas: null as any,
  canvasWidth: 0,
  canvasHeight: 0,
  harness: null as RunHarness | null,
  runtimeSession: null as RuntimeSession | null,
  capabilityScene: null as LubirthCapabilityScene | null,
  assetLoader: null as MiniProgramTextureLoader | null,
  frameId: null as number | null,
  pageVisible: true,
  pageUnloaded: false,
  latestResult: '',
  memoryWarningHandler: null as ((warning: unknown) => void) | null,
  contextLostHandler: null as ((event: any) => void) | null,
  contextRestoredHandler: null as ((event: any) => void) | null,
  benchmarkAbort: null as FrameWindowAbort | null,
  stableFrameAbort: null as FrameWindowAbort | null,
  highQualityDisabled: false,
  loadedRuntimeRoute: null as RuntimeRoute | null,
  loadedSceneConfig: null as LoadedSceneConfig | null,
  loadedSceneStatus: null as 'pass' | 'fail' | 'unsupported' | 'inconclusive' | null,
  lifecyclePersistence: null as LifecycleEvidencePersistence | null,
  lifecycleEvidence: null as LifecycleEvidenceSession | null,

  onLoad() {
    this.lifecyclePersistence = createLifecyclePersistence();
    if (this.lifecyclePersistence.loadActive()) {
      this.lifecycleEvidence = LifecycleEvidenceSession.open(this.lifecyclePersistence);
      const state = this.lifecycleEvidence.snapshot();
      this.setData({
        lifecycleActive: true,
        lifecycleStatus: `会话 ${state.sessionId}：已重入 ${state.reentryCount}/10 次`,
      });
    }
  },

  onReady() {
    wx.createSelectorQuery()
      .select('#webgl')
      .fields({ node: true, size: true })
      .exec((result: Array<{ node?: unknown; width?: number; height?: number }>) => {
        this.canvas = result?.[0]?.node ?? null;
        this.canvasWidth = result?.[0]?.width ?? 0;
        this.canvasHeight = result?.[0]?.height ?? 0;
        this.setData({
          statusText: this.canvas ? 'Canvas 已就绪' : 'Canvas 获取失败',
          statusTone: this.canvas ? 'pass' : 'fail',
        });
        if (this.canvas?.addEventListener) {
          this.contextLostHandler = (event: any) => {
            event.preventDefault?.();
            this.harness?.recordLifecycle('context-lost');
            this.recordLifecycleEvidence('context-lost');
            this.stopSceneLoop();
            this.setData({ statusText: 'WebGL context lost', statusTone: 'fail' });
          };
          this.contextRestoredHandler = () => {
            this.harness?.recordLifecycle('context-restored');
            this.recordLifecycleEvidence('context-restored');
            this.setData({ statusText: 'WebGL context restored', statusTone: 'inconclusive' });
            if (this.pageVisible) this.startSceneLoop();
          };
          this.canvas.addEventListener('webglcontextlost', this.contextLostHandler);
          this.canvas.addEventListener('webglcontextrestored', this.contextRestoredHandler);
        }
      });
    this.memoryWarningHandler = (warning: unknown) => {
      this.highQualityDisabled = true;
      const baselineTextures = this.assetLoader?.handleMemoryWarning();
      const downgraded = Boolean(
        baselineTextures
        && this.data.assetTier === '8k'
        && this.runtimeSession
        && this.capabilityScene,
      );
      this.harness?.recordLifecycle('memory-warning', JSON.stringify({ warning, action: downgraded ? 'released-8k-and-restored-2k' : 'disabled-8k-upgrade' }));
      this.recordLifecycleEvidence('memory-warning', JSON.stringify({ warning, action: downgraded ? 'released-8k-and-restored-2k' : 'disabled-8k-upgrade' }));
      if (downgraded) {
        this.rebuildSceneWithTextures(baselineTextures!);
        this.setData({ assetTier: '2k', statusText: '收到内存告警，已释放 8K 并恢复 2K', statusTone: 'inconclusive' });
      }
    };
    wx.onMemoryWarning?.(this.memoryWarningHandler);
  },

  onScenarioChange(event: any) {
    const scenarioIndex = Number(event.detail.value);
    if (this.data.running || scenarioIndex === this.data.scenarioIndex) return;
    this.disposeLoadedScene();
    this.setData({ scenarioIndex });
  },

  onTierChange(event: any) {
    const tier = event.currentTarget.dataset.tier;
    if (tier === '8k' && this.highQualityDisabled) {
      this.setData({ statusText: '本次页面生命周期已因内存告警禁用 8K', statusTone: 'unsupported' });
      return;
    }
    if (this.data.running || tier === this.data.assetTier) return;
    this.disposeLoadedScene();
    this.setData({ assetTier: tier });
  },

  onPipToggle(event: any) {
    if (this.data.running) return;
    const enabled = Boolean(event.detail.value);
    this.setData({ pipEnabled: enabled });
    this.capabilityScene?.pip.setEnabled(enabled);
  },

  startLifecycleTest() {
    if (!this.lifecyclePersistence) this.lifecyclePersistence = createLifecyclePersistence();
    if (!this.lifecycleEvidence) {
      this.lifecycleEvidence = LifecycleEvidenceSession.open(this.lifecyclePersistence);
      if (this.pageVisible) this.lifecycleEvidence.record('show');
    }
    this.lifecycleEvidence.recordResourceCount(rendererResourceCount(this.runtimeSession?.renderer));
    const state = this.lifecycleEvidence.snapshot();
    this.setData({
      lifecycleActive: true,
      lifecycleStatus: `会话 ${state.sessionId}：已重入 ${state.reentryCount}/10 次，请持续运行并反复退出/进入页面`,
    });
  },

  finishLifecycleTest() {
    if (!this.lifecycleEvidence) {
      this.setData({ lifecycleStatus: '没有活动的生命周期测试会话' });
      return;
    }
    this.lifecycleEvidence.recordResourceCount(rendererResourceCount(this.runtimeSession?.renderer));
    const summary = this.lifecycleEvidence.complete();
    this.lifecycleEvidence = null;
    this.latestResult = JSON.stringify(summary, null, 2);
    this.setData({
      lifecycleActive: false,
      lifecycleStatus: `生命周期测试完成：${summary.evaluation.status}`,
      hasResult: true,
      resultJson: this.latestResult,
      statusText: `生命周期验证：${summary.evaluation.status}`,
      statusTone: summary.evaluation.status,
    });
  },

  recordLifecycleFault(event: any) {
    const type = event.currentTarget.dataset.type as 'black-screen' | 'crash';
    this.recordLifecycleEvidence(type, 'manual-observation');
  },

  recordLifecycleEvidence(
    type: Parameters<LifecycleEvidenceSession['record']>[0],
    detail?: string,
    updateUi = true,
  ) {
    if (!this.lifecycleEvidence) return;
    try {
      this.lifecycleEvidence.record(type, detail);
      if (updateUi) {
        const state = this.lifecycleEvidence.snapshot();
        this.setData({ lifecycleStatus: `会话 ${state.sessionId}：已重入 ${state.reentryCount}/10 次，事件 ${state.eventRunIds.length} 条` });
      }
    } catch (error) {
      if (updateUi) this.setData({ lifecycleStatus: `生命周期证据写入失败：${String(error)}` });
    }
  },

  onRuntimeRouteChange(event: any) {
    const runtimeRoute = event.currentTarget.dataset.route;
    if (this.data.running || runtimeRoute === this.data.runtimeRoute) return;
    this.disposeLoadedRuntime();
    this.setData({ runtimeRoute });
  },

  selectedSceneConfig(assetSource: LoadedSceneConfig['assetSource']): LoadedSceneConfig {
    return {
      runtimeRoute: this.data.runtimeRoute,
      assetTier: this.data.assetTier,
      scenarioId: SCENARIOS[this.data.scenarioIndex].id,
      assetSource,
    };
  },

  disposeLoadedScene() {
    this.stopSceneLoop();
    this.capabilityScene?.dispose();
    this.assetLoader?.dispose();
    this.capabilityScene = null;
    this.assetLoader = null;
    this.loadedSceneConfig = null;
    this.loadedSceneStatus = null;
  },

  disposeLoadedRuntime() {
    this.disposeLoadedScene();
    this.runtimeSession?.dispose();
    this.runtimeSession = null;
    this.loadedRuntimeRoute = null;
  },

  rebuildSceneWithTextures(textures: any) {
    if (!this.runtimeSession) return;
    this.stopSceneLoop();
    this.capabilityScene?.dispose();
    const scenario = SCENARIOS[this.data.scenarioIndex];
    const astro = computeAstroSnapshot({
      id: scenario.id,
      utc: scenario.utc,
      latDeg: scenario.observer.latDeg,
      lonDeg: scenario.observer.lonDeg,
    });
    this.capabilityScene = new LubirthCapabilityScene({
      THREE: this.runtimeSession.THREE,
      renderer: this.runtimeSession.renderer,
      scenario,
      assetTier: '2k',
      textures,
      astro,
      pipEnabled: this.data.pipEnabled,
      pipResolution: 256,
      viewportWidth: this.canvasWidth,
      viewportHeight: this.canvasHeight,
    });
    this.loadedSceneConfig = {
      runtimeRoute: this.loadedRuntimeRoute ?? this.data.runtimeRoute,
      assetTier: '2k',
      scenarioId: scenario.id,
      assetSource: 'remote',
    };
    this.loadedSceneStatus = 'inconclusive';
    if (this.pageVisible) this.startSceneLoop();
  },

  createHarness(kind: string) {
    const device = collectDeviceMetadata();
    const scenario = SCENARIOS[this.data.scenarioIndex];
    const startedAt = new Date().toISOString();
    const run = createRunResult({
      runId: makeRunId(`${scenario.id}-${this.data.assetTier}-${kind}`),
      scenarioId: `${scenario.id}-${this.data.assetTier}`,
      startedAt,
      source: {
        revision: __SPIKE_BUILD__.revision,
        dirty: __SPIKE_BUILD__.dirty,
        dependencyLockSha256: __SPIKE_BUILD__.dependencyLockSha256,
        assetManifestSha256: __SPIKE_BUILD__.assetManifestSha256,
        astroSourceSha256: __SPIKE_BUILD__.astroSourceSha256,
      },
      device,
      prerequisites: {
        appId: hasRealAppId(),
        resourceDomain: /^https:\/\//.test(__RESOURCE_BASE_URL__),
        physicalDevice: device.platform === 'ios' || device.platform === 'android',
      },
    });
    this.harness = new RunHarness(run);
    return this.harness;
  },

  async persistHarnessResult() {
    if (!this.harness) throw new Error('Harness is not initialized');
    const final = finalizeRun(this.harness.snapshot());
    const resultJson = JSON.stringify(final, null, 2);
    const store = new ResultStore(wx.env.USER_DATA_PATH, createFileSystemAdapter());
    await store.writeRun(final);
    this.latestResult = resultJson;
    this.setData({
      running: false,
      hasResult: true,
      statusText: `验证完成：${final.status}`,
      statusTone: final.status,
      resultJson,
    });
    return final;
  },

  async runHarness() {
    if (this.data.running) return;
    this.setData({ running: true, statusText: '运行证据契约自测…', statusTone: 'inconclusive' });
    this.createHarness('harness');
    await this.harness.runTest('harness serialization', 'harness', () => ({
      status: 'pass',
      metrics: {
        canvasReady: Boolean(this.canvas),
        pipEnabled: Boolean(this.data.pipEnabled),
        assetTier: this.data.assetTier,
      },
    }));
    try {
      await this.persistHarnessResult();
    } catch (error) {
      this.setData({
        running: false,
        hasResult: Boolean(this.latestResult),
        statusText: `结果写入失败：${String(error)}`,
        statusTone: 'fail',
      });
    }
  },

  async runRuntime() {
    if (this.data.running) return;
    if (!this.canvas || !this.canvasWidth || !this.canvasHeight) {
      this.setData({ statusText: 'Canvas 尚未就绪', statusTone: 'fail' });
      return;
    }
    this.disposeLoadedRuntime();
    this.setData({ running: true, statusText: `测试 ${this.data.runtimeRoute}…`, statusTone: 'inconclusive' });
    const harness = this.createHarness(`runtime-${this.data.runtimeRoute}`);
    const Adapter = this.data.runtimeRoute === 'r108' ? R108OfficialAdapter : R160Adapter;
    const adapter = new Adapter();
    const options = {
      cssWidth: this.canvasWidth,
      cssHeight: this.canvasHeight,
      dpr: collectDeviceMetadata().dpr ?? 1,
      antialias: true,
      alpha: false,
    };
    let firstSession: RuntimeSession | null = null;
    await harness.runTest(`${this.data.runtimeRoute} renderer capability`, 'runtime', () => {
      firstSession = adapter.create(this.canvas, options);
      const result = runRuntimeCapabilityTest(firstSession);
      return {
        status: result.status,
        metrics: {
          threeVersion: result.threeVersion,
          maxTextureSize: result.capability.maxTextureSize,
          maxRenderbufferSize: result.capability.maxRenderbufferSize,
          derivativeShader: result.cases.derivativeShader,
          renderTarget: result.cases.renderTarget,
        },
        notes: [JSON.stringify(result)],
      };
    });
    await harness.runTest(`${this.data.runtimeRoute} dispose and recreate`, 'runtime-lifecycle', () => {
      firstSession?.dispose();
      const recreated = adapter.create(this.canvas, options);
      const result = runRuntimeCapabilityTest(recreated);
      this.runtimeSession = recreated;
      this.loadedRuntimeRoute = recreated.route;
      return {
        status: result.status,
        metrics: {
          recreated: result.status === 'pass',
          threeVersion: result.threeVersion,
          actualRuntimeRoute: recreated.route,
        },
        notes: [JSON.stringify(result)],
      };
    });
    try {
      await this.persistHarnessResult();
    } catch (error) {
      this.setData({ running: false, statusText: `运行时结果写入失败：${String(error)}`, statusTone: 'fail' });
    }
  },

  async runAstro() {
    if (this.data.running) return;
    this.setData({ running: true, statusText: '运行天文一致性测试…', statusTone: 'inconclusive' });
    const harness = this.createHarness('astro-parity');
    await harness.runTest('shared astro source parity', 'astro', () => {
      const miniprogramCases = computeAstroSnapshots();
      const miniprogramFingerprint: SourceFingerprint = {
        revision: __SPIKE_BUILD__.revision,
        dirty: __SPIKE_BUILD__.dirty,
        dependencyLockSha256: __SPIKE_BUILD__.dependencyLockSha256,
        assetManifestSha256: __SPIKE_BUILD__.assetManifestSha256,
        astroSourceSha256: __SPIKE_BUILD__.astroSourceSha256,
      };
      const parity = createAstroParityReport({
        webCases: baseline.cases as AstroSnapshot[],
        miniprogramCases,
        webFingerprint: baseline.sourceFingerprint as SourceFingerprint,
        miniprogramFingerprint,
      });
      const characterization = runSourceCharacterization();
      const characterizationPassed = [
        characterization.auto,
        characterization.full,
        characterization.moon,
      ].every((suite) => suite.passed === suite.total);
      return {
        status: parity.status === 'fail' || !characterizationPassed
          ? 'fail'
          : parity.status,
        metrics: {
          sourceFingerprintMatched: parity.fingerprint.status === 'pass',
          fingerprintMismatchCount: parity.fingerprint.mismatches.length,
          caseCount: parity.cases.length,
          autoPassed: characterization.auto.passed,
          fullPassed: characterization.full.passed,
          moonPassed: characterization.moon.passed,
        },
        notes: [JSON.stringify({ parity, miniprogramCases, characterization })],
      };
    });
    try {
      await this.persistHarnessResult();
    } catch (error) {
      this.setData({ running: false, statusText: `天文结果写入失败：${String(error)}`, statusTone: 'fail' });
    }
  },

  async runScene() {
    if (this.data.running) return;
    if (!this.runtimeSession || this.loadedRuntimeRoute !== this.data.runtimeRoute) await this.runRuntime();
    if (!this.runtimeSession || this.loadedRuntimeRoute !== this.data.runtimeRoute) {
      this.setData({ statusText: '运行时未就绪，无法创建场景', statusTone: 'fail' });
      return;
    }
    this.setData({ running: true, statusText: '编译核心场景与 PIP…', statusTone: 'inconclusive' });
    const harness = this.createHarness('scene-capability');
    const scenario = SCENARIOS[this.data.scenarioIndex];
    const astro = computeAstroSnapshot({
      id: scenario.id,
      utc: scenario.utc,
      latDeg: scenario.observer.latDeg,
      lonDeg: scenario.observer.lonDeg,
    });
    await harness.runTest('production-representative scene shaders and PIP', 'scene', async () => {
      this.stopSceneLoop();
      this.disposeLoadedScene();
      this.capabilityScene = new LubirthCapabilityScene({
        THREE: this.runtimeSession!.THREE,
        renderer: this.runtimeSession!.renderer,
        scenario,
        assetTier: this.data.assetTier,
        astro,
        pipEnabled: this.data.pipEnabled,
        pipResolution: 256,
        viewportWidth: this.canvasWidth,
        viewportHeight: this.canvasHeight,
      });
      this.loadedSceneConfig = this.selectedSceneConfig('fallback');
      const result = runSceneCapabilityTest(
        this.capabilityScene,
        this.runtimeSession!.renderer,
        this.runtimeSession!.gl,
      );
      this.loadedSceneStatus = result.status;
      const screenshot = await captureCanvasScreenshot(this.canvas, harness.snapshot().runId);
      return {
        status: result.status,
        metrics: {
          shaderPrograms: result.shaderPrograms,
          pipResolution: 256,
          pipEnabled: Boolean(this.data.pipEnabled),
          singleDirectionalLight: result.invariants.singleDirectionalLight,
          actualRuntimeRoute: this.loadedSceneConfig.runtimeRoute,
          actualAssetTier: this.loadedSceneConfig.assetTier,
          actualScenarioId: this.loadedSceneConfig.scenarioId,
          actualAssetSource: this.loadedSceneConfig.assetSource,
        },
        notes: [JSON.stringify({ result, astro, screenshot, loadedConfig: this.loadedSceneConfig })],
      };
    });
    this.startSceneLoop();
    try {
      await this.persistHarnessResult();
    } catch (error) {
      this.setData({ running: false, statusText: `场景结果写入失败：${String(error)}`, statusTone: 'fail' });
    }
  },

  async runAssets() {
    if (this.data.running) return;
    if (!this.runtimeSession || this.loadedRuntimeRoute !== this.data.runtimeRoute) await this.runRuntime();
    if (!this.runtimeSession || this.loadedRuntimeRoute !== this.data.runtimeRoute) {
      this.setData({ statusText: '运行时未就绪，无法验证纹理', statusTone: 'fail' });
      return;
    }
    this.setData({ running: true, statusText: `加载 ${this.data.assetTier} 资源…`, statusTone: 'inconclusive' });
    const harness = this.createHarness(`assets-${this.data.assetTier}`);
    const resourceDomainReady = /^https:\/\//.test(__RESOURCE_BASE_URL__);
    await harness.runTest(`${this.data.assetTier} remote texture and GPU upload`, 'assets', async () => {
      if (!resourceDomainReady) {
        return {
          status: 'inconclusive',
          metrics: { assetTier: this.data.assetTier, resourceDomainReady: false },
          notes: ['Build with SPIKE_RESOURCE_BASE_URL set to an approved HTTPS resource domain.'],
        };
      }

      this.stopSceneLoop();
      this.capabilityScene?.dispose();
      this.assetLoader?.dispose();
      this.capabilityScene = null;
      this.assetLoader = null;
      this.loadedSceneConfig = null;
      this.loadedSceneStatus = null;
      const loader = createWechatTextureLoader(this.runtimeSession!, __RESOURCE_BASE_URL__);
      this.assetLoader = loader;
      const loadStartedAt = Date.now();
      const tierResult = await loader.loadTier(this.data.assetTier);
      const summary = summarizeAssetTier(this.data.assetTier, tierResult.results);
      const scenario = SCENARIOS[this.data.scenarioIndex];
      const astro = computeAstroSnapshot({
        id: scenario.id,
        utc: scenario.utc,
        latDeg: scenario.observer.latDeg,
        lonDeg: scenario.observer.lonDeg,
      });
      let sceneResult: ReturnType<typeof runSceneCapabilityTest> | null = null;
      let stableFrame: Awaited<ReturnType<typeof captureStableSceneFrames>> | null = null;
      if (tierResult.status === 'pass') {
        this.capabilityScene = new LubirthCapabilityScene({
          THREE: this.runtimeSession!.THREE,
          renderer: this.runtimeSession!.renderer,
          scenario,
          assetTier: this.data.assetTier,
          textures: tierResult.textures,
          astro,
          pipEnabled: this.data.pipEnabled,
          pipResolution: 256,
          viewportWidth: this.canvasWidth,
          viewportHeight: this.canvasHeight,
        });
        this.loadedSceneConfig = this.selectedSceneConfig('remote');
        sceneResult = runSceneCapabilityTest(
          this.capabilityScene,
          this.runtimeSession!.renderer,
          this.runtimeSession!.gl,
        );
        const abort = new FrameWindowAbort();
        this.stableFrameAbort = abort;
        try {
          stableFrame = await captureStableSceneFrames(
            this.runtimeSession!,
            this.capabilityScene,
            loadStartedAt,
            sceneResult.shaderLogs.length,
            abort,
          );
        } finally {
          if (this.stableFrameAbort === abort) this.stableFrameAbort = null;
        }
      }
      const screenshot = sceneResult
        ? await captureCanvasScreenshot(this.canvas, harness.snapshot().runId)
        : null;
      const serializableAssets = tierResult.results.map(({ texture: _texture, ...entry }) => entry);
      const status = tierResult.status !== 'pass'
        ? tierResult.status
        : sceneResult?.status === 'fail'
          ? 'fail'
          : sceneResult?.status === 'pass' && stableFrame?.stable && !stableFrame.interrupted
            ? 'pass'
            : 'inconclusive';
      this.loadedSceneStatus = this.loadedSceneConfig ? status : null;
      return {
        status,
        metrics: {
          assetTier: this.data.assetTier,
          assetCount: summary.assetCount,
          passedAssetCount: summary.passedAssetCount,
          cacheHitCount: summary.cacheHitCount,
          totalBytes: summary.totalBytes,
          totalDownloadMs: summary.totalDownloadMs,
          totalDecodeMs: summary.totalDecodeMs,
          totalUploadMs: summary.totalUploadMs,
          sceneRendered: sceneResult?.status === 'pass',
          firstStableFrameMs: stableFrame?.stable?.timestampMs ?? null,
          actualRuntimeRoute: this.loadedSceneConfig?.runtimeRoute ?? this.loadedRuntimeRoute,
          actualAssetTier: this.loadedSceneConfig?.assetTier ?? null,
          actualScenarioId: this.loadedSceneConfig?.scenarioId ?? null,
          actualAssetSource: this.loadedSceneConfig?.assetSource ?? null,
        },
        notes: [JSON.stringify({ summary, assets: serializableAssets, sceneResult, stableFrame, screenshot, loadedConfig: this.loadedSceneConfig })],
      };
    });
    this.startSceneLoop();
    try {
      await this.persistHarnessResult();
    } catch (error) {
      this.setData({ running: false, statusText: `资源结果写入失败：${String(error)}`, statusTone: 'fail' });
    }
  },

  async runBenchmark() {
    if (this.data.running) return;
    const requestedConfig = this.selectedSceneConfig('remote');
    const initialConfigCheck = compareLoadedSceneConfig(this.loadedSceneConfig, requestedConfig);
    if (!initialConfigCheck.matches || this.loadedSceneStatus !== 'pass') await this.runAssets();
    if (!this.runtimeSession) {
      this.setData({ statusText: '运行时未就绪，无法执行性能基准', statusTone: 'fail' });
      return;
    }
    this.setData({ running: true, statusText: '检查真机性能前置条件…', statusTone: 'inconclusive' });
    const harness = this.createHarness(`performance-${this.data.assetTier}`);
    const device = collectDeviceMetadata();
    const configCheck = compareLoadedSceneConfig(this.loadedSceneConfig, requestedConfig);
    const prerequisitesReady = hasRealAppId()
      && /^https:\/\//.test(__RESOURCE_BASE_URL__)
      && (device.platform === 'ios' || device.platform === 'android')
      && Boolean(this.capabilityScene && this.assetLoader)
      && configCheck.matches
      && this.loadedSceneStatus === 'pass';

    await harness.runTest(`${this.data.assetTier} baseline and paired PIP benchmark`, 'performance', async () => {
      if (!prerequisitesReady || !this.capabilityScene || !this.runtimeSession) {
        return {
          status: 'inconclusive',
          metrics: {
            realAppId: hasRealAppId(),
            resourceDomain: /^https:\/\//.test(__RESOURCE_BASE_URL__),
            physicalDevice: device.platform === 'ios' || device.platform === 'android',
            productionAssetsReady: Boolean(this.assetLoader && this.capabilityScene),
            loadedConfigMatched: configCheck.matches,
          },
          notes: [JSON.stringify({ requestedConfig, actualConfig: this.loadedSceneConfig, mismatches: configCheck.mismatches })],
        };
      }

      const scenario = SCENARIOS[this.data.scenarioIndex];
      const abort = new FrameWindowAbort();
      this.benchmarkAbort = abort;
      const capture = () => captureFrameWindow({
        requestFrame: this.runtimeSession!.requestFrame,
        cancelFrame: this.runtimeSession!.cancelFrame,
        warmupMs: scenario.performance.warmupMs,
        durationMs: scenario.performance.durationMs,
        abort,
      });
      try {
        const rendererBefore = snapshotRendererInfo(this.runtimeSession.renderer);
        this.capabilityScene.pip.setEnabled(false);
        const baseline = evaluateBaselinePerformance(await capture());
        this.capabilityScene.pip.setResolution(256);
        const pip256 = await runPairedPipBenchmark({
          resolution: 256,
          rounds: scenario.performance.pairedRounds,
          setPipEnabled: (enabled) => this.capabilityScene!.pip.setEnabled(enabled),
          capture,
        });
        this.capabilityScene.pip.setResolution(512);
        const pip512 = await runPairedPipBenchmark({
          resolution: 512,
          rounds: scenario.performance.pairedRounds,
          setPipEnabled: (enabled) => this.capabilityScene!.pip.setEnabled(enabled),
          capture,
        });
        const rendererAfter = snapshotRendererInfo(this.runtimeSession.renderer);
        const glError = this.runtimeSession.gl.getError();
        const noGlError = glError === this.runtimeSession.gl.NO_ERROR;
        const status = evaluateBenchmarkStatus({
          baselineStatus: baseline.status,
          pip256Status: pip256.status,
          pip512Status: pip512.status,
          interrupted: abort.aborted,
          noGlError,
        });
        return {
          status,
          metrics: {
            assetTier: this.data.assetTier,
            baselineMedianFps: baseline.summary.medianFps,
            baselineP95FrameMs: baseline.summary.p95FrameMs,
            pip256MedianDeltaMs: pip256.medianDeltaMs,
            pip512MedianDeltaMs: pip512.medianDeltaMs,
            pairedRounds: scenario.performance.pairedRounds,
            glError,
            actualRuntimeRoute: this.loadedSceneConfig.runtimeRoute,
            actualAssetTier: this.loadedSceneConfig.assetTier,
            actualScenarioId: this.loadedSceneConfig.scenarioId,
            actualAssetSource: this.loadedSceneConfig.assetSource,
          },
          notes: [JSON.stringify({ baseline, pip256, pip512, rendererBefore, rendererAfter, interrupted: abort.aborted, loadedConfig: this.loadedSceneConfig })],
        };
      } finally {
        this.capabilityScene?.pip.setResolution(256);
        this.capabilityScene?.pip.setEnabled(Boolean(this.data.pipEnabled));
        if (this.benchmarkAbort === abort) this.benchmarkAbort = null;
      }
    });
    try {
      await this.persistHarnessResult();
    } catch (error) {
      this.setData({ running: false, statusText: `性能结果写入失败：${String(error)}`, statusTone: 'fail' });
    }
  },

  startSceneLoop() {
    if (!this.pageVisible || this.pageUnloaded || !this.runtimeSession || !this.capabilityScene || this.frameId !== null) return;
    const frame = (timestamp: number) => {
      this.frameId = null;
      if (this.pageUnloaded) {
        this.recordLifecycleEvidence('post-unload-frame', undefined, false);
        return;
      }
      this.capabilityScene?.render(timestamp);
      if (this.runtimeSession && this.capabilityScene) {
        this.frameId = this.runtimeSession.requestFrame(frame);
      }
    };
    this.frameId = this.runtimeSession.requestFrame(frame);
  },

  stopSceneLoop() {
    if (this.frameId === null || !this.runtimeSession) return;
    this.runtimeSession.cancelFrame(this.frameId);
    this.frameId = null;
  },

  async runAll() {
    await this.runRuntime();
    await this.runAstro();
    await this.runScene();
    await this.runAssets();
  },

  copyLatestResult() {
    if (!this.latestResult) return;
    wx.setClipboardData({ data: this.latestResult });
  },

  onTouchStart(event: unknown) {
    this.capabilityScene?.touchController.onTouchStart(mapTouches(event));
  },
  onTouchMove(event: unknown) {
    this.capabilityScene?.touchController.onTouchMove(mapTouches(event));
  },
  onTouchEnd(event: unknown) {
    this.capabilityScene?.touchController.onTouchEnd(mapTouches(event));
  },
  onTouchCancel(_event: unknown) {
    this.capabilityScene?.touchController.cancel();
  },

  onHide() {
    this.pageVisible = false;
    this.benchmarkAbort?.abort();
    this.stableFrameAbort?.abort();
    this.stopSceneLoop();
    this.harness?.onHide();
    this.recordLifecycleEvidence('hide');
  },

  onShow() {
    this.pageVisible = true;
    this.harness?.onShow();
    this.recordLifecycleEvidence('show');
    this.startSceneLoop();
  },

  onUnload() {
    this.pageUnloaded = true;
    this.harness?.onUnload();
    this.recordLifecycleEvidence('unload', undefined, false);
    this.benchmarkAbort?.abort();
    this.stableFrameAbort?.abort();
    this.stopSceneLoop();
    this.capabilityScene?.dispose();
    this.assetLoader?.dispose();
    this.runtimeSession?.dispose();
    if (this.lifecycleEvidence) {
      try {
        this.lifecycleEvidence.recordResourceCount(0);
      } catch {
        // Unload must continue even if local evidence storage is unavailable.
      }
    }
    if (this.canvas?.removeEventListener && this.contextLostHandler) {
      this.canvas.removeEventListener('webglcontextlost', this.contextLostHandler);
    }
    if (this.canvas?.removeEventListener && this.contextRestoredHandler) {
      this.canvas.removeEventListener('webglcontextrestored', this.contextRestoredHandler);
    }
    if (this.memoryWarningHandler) wx.offMemoryWarning?.(this.memoryWarningHandler);
  },
});

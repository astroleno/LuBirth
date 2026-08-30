export type TouchPoint = { id: number; x: number; y: number };

export type OrbitState = {
  azimuthDeg: number;
  elevationDeg: number;
  distance: number;
};

type OrbitOptions = OrbitState & {
  minDistance: number;
  maxDistance: number;
  minElevationDeg?: number;
  maxElevationDeg?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function touchDistance(touches: TouchPoint[]): number {
  if (touches.length < 2) return 0;
  return Math.hypot(touches[1].x - touches[0].x, touches[1].y - touches[0].y);
}

export class TouchCameraController {
  private readonly camera: any;
  private state: OrbitState;
  private readonly minDistance: number;
  private readonly maxDistance: number;
  private readonly minElevationDeg: number;
  private readonly maxElevationDeg: number;
  private viewportWidth = 1;
  private viewportHeight = 1;
  private previousTouches: TouchPoint[] = [];
  private pinchStartDistance = 0;
  private pinchStartCameraDistance = 0;

  constructor(camera: any, options: OrbitOptions) {
    this.camera = camera;
    this.state = {
      azimuthDeg: options.azimuthDeg,
      elevationDeg: options.elevationDeg,
      distance: options.distance,
    };
    this.minDistance = options.minDistance;
    this.maxDistance = options.maxDistance;
    this.minElevationDeg = options.minElevationDeg ?? -85;
    this.maxElevationDeg = options.maxElevationDeg ?? 85;
    this.applyCamera();
  }

  setViewport(width: number, height: number): void {
    this.viewportWidth = Math.max(1, width);
    this.viewportHeight = Math.max(1, height);
  }

  onTouchStart(touches: TouchPoint[]): void {
    this.previousTouches = touches.map((touch) => ({ ...touch }));
    if (touches.length >= 2) {
      this.pinchStartDistance = touchDistance(touches);
      this.pinchStartCameraDistance = this.state.distance;
    }
  }

  onTouchMove(touches: TouchPoint[]): void {
    if (touches.length >= 2) {
      if (this.previousTouches.length < 2) this.onTouchStart(touches);
      const currentPinch = touchDistance(touches);
      if (currentPinch > 0 && this.pinchStartDistance > 0) {
        this.state.distance = clamp(
          this.pinchStartCameraDistance * this.pinchStartDistance / currentPinch,
          this.minDistance,
          this.maxDistance,
        );
      }
    } else if (touches.length === 1 && this.previousTouches.length === 1) {
      const previous = this.previousTouches[0];
      const current = touches[0];
      this.state.azimuthDeg -= (current.x - previous.x) / this.viewportWidth * 180;
      this.state.elevationDeg = clamp(
        this.state.elevationDeg + (current.y - previous.y) / this.viewportHeight * 120,
        this.minElevationDeg,
        this.maxElevationDeg,
      );
    }
    this.previousTouches = touches.map((touch) => ({ ...touch }));
    this.applyCamera();
  }

  onTouchEnd(touches: TouchPoint[] = []): void {
    this.previousTouches = touches.map((touch) => ({ ...touch }));
    if (touches.length < 2) {
      this.pinchStartDistance = 0;
      this.pinchStartCameraDistance = this.state.distance;
    }
  }

  cancel(): void {
    this.previousTouches = [];
    this.pinchStartDistance = 0;
  }

  snapshot(): OrbitState {
    return { ...this.state };
  }

  private applyCamera(): void {
    const azimuth = this.state.azimuthDeg * Math.PI / 180;
    const elevation = this.state.elevationDeg * Math.PI / 180;
    const horizontal = this.state.distance * Math.cos(elevation);
    this.camera.position.set(
      horizontal * Math.sin(azimuth),
      this.state.distance * Math.sin(elevation),
      horizontal * Math.cos(azimuth),
    );
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateMatrixWorld?.();
  }
}

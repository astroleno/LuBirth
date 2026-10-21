export const MAX_GLASS_CONTROLS = 12;
export const GLASS_CONTROL_SELECTOR = '.btn, .music-player button';

export interface GlassControlState {
  element: HTMLElement;
  hover: number;
  press: number;
  clientX: number;
  clientY: number;
  animation: Animation;
}

/** Delegate input once; the existing scene frame drives material and DOM together. */
export class GlassControlInteractions {
  private states = new Map<HTMLElement, GlassControlState>();
  private hovered: HTMLElement | null = null;
  private pressed: HTMLElement | null = null;
  private pointerId: number | null = null;
  private key: string | null = null;
  private lastTime = 0;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  constructor(private root: HTMLElement) {
    root.addEventListener('pointermove', this.pointerMove);
    root.addEventListener('pointerleave', this.pointerLeave);
    root.addEventListener('pointerdown', this.pointerDown);
    root.addEventListener('keydown', this.keyDown);
    root.addEventListener('focusout', this.focusOut);
    window.addEventListener('pointerup', this.pointerUp);
    window.addEventListener('pointercancel', this.pointerUp);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('blur', this.reset);
    document.addEventListener('visibilitychange', this.visibilityChange);
  }

  sync(elements: Set<HTMLElement>) {
    for (const [element, state] of this.states) {
      if (elements.has(element)) continue;
      state.animation.cancel();
      element.removeAttribute('data-glass-control');
      this.states.delete(element);
      if (this.hovered === element) this.hovered = null;
      if (this.pressed === element) this.reset();
    }
    for (const element of elements) {
      if (this.states.has(element)) continue;
      // A paused animation changes compositor transforms without mutating style
      // attributes or making the material's layout cache dirty on every frame.
      const animation = element.animate([{ transform: 'scale(1)' }, { transform: 'scale(.96)' }], {
        duration: 1000, fill: 'both',
      });
      animation.pause();
      animation.currentTime = 0;
      element.setAttribute('data-glass-control', '');
      this.states.set(element, { element, animation, hover: 0, press: 0, clientX: NaN, clientY: NaN });
    }
  }

  get(element: HTMLElement) { return this.states.get(element)!; }

  update(now: number) {
    const dt = this.lastTime ? Math.min(now - this.lastTime, 64) : 16;
    this.lastTime = now;
    for (const state of this.states.values()) {
      const enabled = !state.element.matches(':disabled');
      if (!enabled && this.pressed === state.element) this.reset();
      const hover = enabled && this.hovered === state.element && state.element.matches(':hover') ? 1 : 0;
      const press = enabled && this.pressed === state.element ? 1 : 0;
      state.hover += (hover - state.hover) * (1 - Math.exp(-dt / 55));
      state.press += (press - state.press) * (1 - Math.exp(-dt / (press ? 35 : 65)));
      if (!enabled) { state.hover = state.press = 0; }
      if (this.reducedMotion.matches) { state.hover = hover; state.press = press; }
      if (Math.abs(state.press - press) < .001) state.press = press;
      if (Math.abs(state.hover - hover) < .001) state.hover = hover;
      const time = this.reducedMotion.matches ? 0 : state.press * 1000;
      if (state.animation.currentTime !== time) state.animation.currentTime = time;
    }
  }

  scale(state: GlassControlState) { return 1 - Number(state.animation.currentTime ?? 0) * .00004; }

  private target(event: Event) {
    const element = event.target instanceof Element ? event.target.closest<HTMLElement>(GLASS_CONTROL_SELECTOR) : null;
    return element && this.states.has(element) && !element.matches(':disabled') ? element : null;
  }
  private point(element: HTMLElement | null, event: PointerEvent) {
    const state = element && this.states.get(element);
    if (state) { state.clientX = event.clientX; state.clientY = event.clientY; }
  }
  private pointerMove = (event: PointerEvent) => {
    const target = this.target(event);
    this.hovered = event.pointerType === 'touch' ? null : target;
    this.point(target, event);
  };
  private pointerLeave = () => { this.hovered = null; };
  private pointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary) return;
    this.pressed = this.target(event);
    this.pointerId = event.pointerId;
    this.key = null;
    this.point(this.pressed, event);
  };
  private pointerUp = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId) return;
    this.pressed = null;
    this.pointerId = null;
    if (event.pointerType === 'touch') this.hovered = null;
  };
  private keyDown = (event: KeyboardEvent) => {
    if (event.key !== ' ' && event.key !== 'Enter') return;
    this.pressed = this.target(event);
    this.key = event.key;
    this.pointerId = null;
    const state = this.pressed && this.states.get(this.pressed);
    if (state) { state.clientX = state.clientY = NaN; }
  };
  private keyUp = (event: KeyboardEvent) => {
    if (event.key !== this.key) return;
    this.pressed = null;
    this.key = null;
  };
  private focusOut = (event: FocusEvent) => {
    if (this.key && event.target === this.pressed) this.reset();
  };
  private reset = () => {
    this.hovered = this.pressed = null;
    this.pointerId = null;
    this.key = null;
  };
  private visibilityChange = () => { if (document.hidden) this.reset(); };

  dispose() {
    this.sync(new Set());
    this.root.removeEventListener('pointermove', this.pointerMove);
    this.root.removeEventListener('pointerleave', this.pointerLeave);
    this.root.removeEventListener('pointerdown', this.pointerDown);
    this.root.removeEventListener('keydown', this.keyDown);
    this.root.removeEventListener('focusout', this.focusOut);
    window.removeEventListener('pointerup', this.pointerUp);
    window.removeEventListener('pointercancel', this.pointerUp);
    window.removeEventListener('keyup', this.keyUp);
    window.removeEventListener('blur', this.reset);
    document.removeEventListener('visibilitychange', this.visibilityChange);
  }
}

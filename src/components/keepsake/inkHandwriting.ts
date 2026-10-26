/** Glyph-anchored wet ink, adapted from TongyeGuanmi's production loader.
 * Only this small opening surface draws; completed ink becomes a static SVG.
 */
export function inkCanvasSize(width: number, height: number, deviceDpr: number) {
  const w = Number.isFinite(width) ? Math.max(1, width) : 1;
  const h = Number.isFinite(height) ? Math.max(1, height) : 1;
  const dpr = Math.min(1.5, Number.isFinite(deviceDpr) ? Math.max(.5, deviceDpr) : 1);
  const ratio = Math.min(dpr, Math.sqrt(160_000 / (w * h)));
  return [Math.max(1, Math.floor(w * ratio)), Math.max(1, Math.floor(h * ratio))] as const;
}

const VERTEX = `attribute vec2 position; varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const FRAGMENT = `precision highp float;
varying vec2 uv;
uniform vec2 resolution;
uniform float progress;
uniform float elapsed;
uniform float characters;
uniform float seed;
uniform sampler2D glyphTexture;
uniform sampler2D indexTexture;
float hash(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+34.37);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float value=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);
 for(int i=0;i<4;i++){value+=noise(p)*a;p=r*p*2.02+7.13;a*=.5;}return value;}
float glyph(vec2 p){vec2 inside=step(vec2(0.),p)*step(p,vec2(1.));
 return texture2D(glyphTexture,vec2(p.x,1.-p.y)).a*inside.x*inside.y;}
void main(){
 float p=clamp(progress,0.,1.);
 vec4 owner=texture2D(indexTexture,vec2(uv.x,1.-uv.y));
 float charIndex=floor(clamp(owner.r*characters,0.,max(characters-.001,0.)));
 // The last glyph must finish at p=1 for both four- and five-character phrases.
 float charStart=charIndex*.48/max(characters-1.,1.);
 float charP=clamp((p-charStart)/.52,0.,1.);
 float ease=smoothstep(0.,1.,charP),energy=sin(ease*3.14159265);
 vec2 q=vec2(uv.x*resolution.x/resolution.y,uv.y);
 vec2 origin=vec2(seed*.0017,charIndex*4.2);
 vec2 warp=vec2(fbm(q*2.2+origin+vec2(1.7,4.1)-elapsed*.035),
                fbm(q*2.2+origin+vec2(8.3,2.2)+elapsed*.028))-.5;
 float coarse=fbm(q*7.6+warp*1.5+origin+vec2(0.,-elapsed*.045));
 float vein=fbm(q*21.+warp*2.+origin+vec2(elapsed*.055,charIndex*2.2));
 float pore=fbm(q*58.-warp*2.6+origin+vec2(-elapsed*.12,elapsed*.09));
 float ink=coarse*.56+vein*.30+pore*.14;
 float threshold=mix(.90,.18,ease);
 float flow=smoothstep(threshold-.12,threshold+.10,ink+ease*.16);
 flow=max(flow,smoothstep(.70,.98,ease));
 float edge=1.-smoothstep(0.,.15,abs(ink+ease*.16-threshold));
 edge*=smoothstep(.04,.32,ease)*(1.-smoothstep(.70,1.,ease));
 vec2 px=1./max(resolution,vec2(1.));float base=glyph(uv),spread=3.8+energy*2.4;
 float wet=base;
 wet=max(wet,glyph(uv+px*vec2(spread,0.))*.76);
 wet=max(wet,glyph(uv-px*vec2(spread,0.))*.76);
 wet=max(wet,glyph(uv+px*vec2(0.,spread))*.76);
 wet=max(wet,glyph(uv-px*vec2(0.,spread))*.76);
 wet=max(wet,glyph(uv+px*vec2(spread*.68))*.66);
 wet=max(wet,glyph(uv-px*vec2(spread*.68))*.66);
 vec2 grid=q*vec2(78.,24.)+warp*1.6+origin+vec2(elapsed*.045,-elapsed*.035);
 vec2 cell=floor(grid),point=fract(grid)-.5;
 point+=(vec2(hash(cell+vec2(17.1,3.7)),hash(cell+vec2(5.2,11.9)))-.5)*.26;
 float radius=mix(.08,.24,hash(cell+vec2(23.4,8.8)));
 float gate=smoothstep(.72,.985,hash(cell+vec2(7.4,19.3)));
 float drop=(1.-smoothstep(radius,radius+.08,length(point)))*gate;
 float bead=smoothstep(.80,.992,hash(floor((q+warp*.34)*resolution.y*.125+origin)));
 float droplets=(bead*.34+drop*.72)*edge*(.24+energy*.78);
 float alpha=clamp(base*flow+wet*(edge*.24+droplets*.62),0.,1.);
 alpha*=smoothstep(.002,.08,owner.a);
 vec3 cream=vec3(230.,221.,202.)/255.;
 vec3 color=mix(cream,vec3(1.,.96,.86),clamp(edge*.3+droplets,0.,.84));
 if(p>=.9999){alpha=base;color=cream;}
 gl_FragColor=vec4(color*alpha,alpha);
}`;

type Options = {
  canvas: HTMLCanvasElement; glyph: HTMLImageElement; indexUrl: string;
  characters: number; durationMs: number; seed: number;
  onState: (state: 'revealing' | 'complete' | 'fallback') => void;
  onComplete: () => void;
};

export function mountInkHandwriting(options: Options): () => void {
  const { canvas } = options;
  let disposed = false, finished = false, running = false;
  let frame = 0, draws = 0, startedAt: number | null = null, pausedAt: number | null = null;
  let pausedMs = 0, nextDraw = 0;
  let holdTimer: ReturnType<typeof setTimeout> | undefined;
  let maskTimer: ReturnType<typeof setTimeout> | undefined;
  let gl: WebGLRenderingContext | null = null;
  let buffer: WebGLBuffer | null = null, program: WebGLProgram | null = null;
  const shaders: WebGLShader[] = [], textures: WebGLTexture[] = [];
  const scratch: HTMLCanvasElement[] = [];
  const mask = new Image(); mask.crossOrigin = 'anonymous';
  let resize = () => {};

  const release = () => {
    cancelAnimationFrame(frame); frame = 0;
    clearTimeout(maskTimer); clearTimeout(holdTimer);
    mask.onload = mask.onerror = null;
    mask.removeAttribute('src');
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onLost);
    if (gl) {
      textures.forEach(texture => gl!.deleteTexture(texture));
      shaders.forEach(shader => gl!.deleteShader(shader));
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      gl = null;
    }
    scratch.forEach(surface => { surface.width = surface.height = 0; });
  };
  const fallback = () => {
    if (disposed || finished) return;
    finished = true; running = false; release();
    canvas.dataset.inkStatus = 'fallback';
    options.onState('fallback'); options.onComplete();
  };
  const onLost = (event: Event) => { event.preventDefault(); fallback(); };
  const onResize = () => { if (!disposed && !finished) resize(); };
  const onVisibility = () => {
    if (disposed || finished || !running) return;
    cancelAnimationFrame(frame); frame = 0;
    if (document.hidden) {
      pausedAt = startedAt === null ? null : performance.now();
    } else {
      if (pausedAt !== null) pausedMs += performance.now() - pausedAt;
      pausedAt = null; nextDraw = 0; frame = requestAnimationFrame(tick);
    }
  };
  let draw = (_progress: number, _elapsed: number) => {};
  const tick = (now: number) => {
    frame = 0;
    if (disposed || finished || document.hidden) return;
    startedAt ??= now;
    const elapsedMs = Math.max(0, now - startedAt - pausedMs);
    const progress = Math.min(1, elapsedMs / options.durationMs);
    if (!nextDraw || now + 2 >= nextDraw || progress === 1) {
      draw(progress, elapsedMs / 1000);
      draws++;
      canvas.dataset.inkFrames = String(draws);
      canvas.dataset.inkProgress = progress.toFixed(4);
      nextDraw = nextDraw ? nextDraw + (Math.floor(Math.max(0, now - nextDraw) / (1000 / 30)) + 1) * (1000 / 30) : now + 1000 / 30;
    }
    if (progress === 1) {
      finished = true; running = false;
      canvas.dataset.inkStatus = 'complete'; options.onState('complete');
      holdTimer = setTimeout(() => { if (!disposed) options.onComplete(); }, 200);
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (disposed || finished) return;
    clearTimeout(maskTimer);
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true });
      if (!gl) return fallback();
      const context = gl;
      for (const [type, source] of [[context.VERTEX_SHADER, VERTEX], [context.FRAGMENT_SHADER, FRAGMENT]] as const) {
        const shader = context.createShader(type);
        if (!shader) throw new Error('Ink shader unavailable');
        shaders.push(shader); context.shaderSource(shader, source); context.compileShader(shader);
        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) throw new Error('Ink shader did not compile');
      }
      program = context.createProgram(); buffer = context.createBuffer();
      if (!program || !buffer) throw new Error('Ink resources unavailable');
      shaders.forEach(shader => context.attachShader(program!, shader)); context.linkProgram(program);
      if (!context.getProgramParameter(program, context.LINK_STATUS)) throw new Error('Ink program did not link');
      context.useProgram(program); context.bindBuffer(context.ARRAY_BUFFER, buffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW);
      const position = context.getAttribLocation(program, 'position');
      context.enableVertexAttribArray(position); context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
      const uniform = (name: string) => context.getUniformLocation(program!, name);
      const resolution = uniform('resolution'), progress = uniform('progress'), elapsed = uniform('elapsed');
      context.uniform1f(uniform('characters'), options.characters); context.uniform1f(uniform('seed'), options.seed);
      for (const [index, name] of ['glyphTexture', 'indexTexture'].entries()) {
        const texture = context.createTexture(); if (!texture) throw new Error('Ink texture unavailable');
        textures.push(texture); context.activeTexture(context.TEXTURE0 + index); context.bindTexture(context.TEXTURE_2D, texture);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
        context.uniform1i(uniform(name), index); scratch.push(document.createElement('canvas'));
      }
      resize = () => {
        const rect = canvas.getBoundingClientRect();
        const [width, height] = inkCanvasSize(rect.width, rect.height, window.devicePixelRatio);
        if (canvas.width === width && canvas.height === height && canvas.dataset.inkReady) return;
        canvas.width = width; canvas.height = height; context.viewport(0, 0, width, height);
        context.uniform2f(resolution, width, height);
        [options.glyph, mask].forEach((image, index) => {
          const surface = scratch[index]; surface.width = width; surface.height = height;
          const painter = surface.getContext('2d'); if (!painter) throw new Error('Ink mask preparation unavailable');
          painter.drawImage(image, 0, 0, width, height);
          context.activeTexture(context.TEXTURE0 + index); context.bindTexture(context.TEXTURE_2D, textures[index]);
          context.pixelStorei(context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, surface);
        });
        canvas.dataset.inkReady = 'true';
      };
      draw = (p, seconds) => {
        context.clearColor(0, 0, 0, 0); context.clear(context.COLOR_BUFFER_BIT);
        context.uniform1f(progress, p); context.uniform1f(elapsed, seconds); context.drawArrays(context.TRIANGLES, 0, 3);
      };
      resize();
      window.addEventListener('resize', onResize, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      canvas.addEventListener('webglcontextlost', onLost);
      canvas.dataset.inkStatus = 'revealing';
      options.onState('revealing'); running = true;
      if (!document.hidden) frame = requestAnimationFrame(tick);
    } catch { fallback(); }
  };
  mask.onload = start; mask.onerror = fallback;
  maskTimer = setTimeout(fallback, 4000);
  mask.src = options.indexUrl;
  return () => {
    if (disposed) return;
    disposed = true; running = false; release(); canvas.dataset.inkStatus = 'disposed';
  };
}

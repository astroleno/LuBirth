export type ScreenPoint = [number, number];
export type ScreenRect = { x: number; y: number; w: number; h: number };
export type LabelCandidate = { id: string; anchor: ScreenPoint; w: number; h: number;
  priority: number; cardinal?: boolean; figure?: ScreenPoint[] };
export type PlacedLabel = ScreenRect & { slot: string };

export const rectsOverlap = (a: ScreenRect, b: ScreenRect, gap = 0) =>
  a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y;

/** Convex projected portrait quad, including its rotated silhouette envelope.
 * Use its edges rather than its axis-aligned box so diagonal drawings still leave usable sky.
 */
export function overlapsFigure(rect: ScreenRect, polygon: ScreenPoint[], gap = 6) {
  if (polygon.length < 3) return false;
  const corners: ScreenPoint[] = [[rect.x-gap,rect.y-gap],[rect.x+rect.w+gap,rect.y-gap],
    [rect.x+rect.w+gap,rect.y+rect.h+gap],[rect.x-gap,rect.y+rect.h+gap]];
  const axes: ScreenPoint[] = [[1,0],[0,1],...polygon.map((p,i): ScreenPoint => {
    const q=polygon[(i+1)%polygon.length];return [p[1]-q[1],q[0]-p[0]];
  })];
  return axes.every(([x,y])=>{
    const a=corners.map(p=>p[0]*x+p[1]*y),b=polygon.map(p=>p[0]*x+p[1]*y);
    return Math.max(...a)>=Math.min(...b) && Math.max(...b)>=Math.min(...a);
  });
}

/** Screen labels move into nearby negative space; stars and figure registration never move. */
export function layoutSkyLabels(labels: LabelCandidate[], viewport: { width: number; height: number },
  obstructions: ScreenRect[], limit: number, previous: ReadonlyMap<string, PlacedLabel> = new Map(),
  figureObstacles?: ScreenPoint[][]) {
  const placed = new Map<string, PlacedLabel>(), figures=figureObstacles??labels.filter(l=>l.figure).map(l=>l.figure!);
  const envelopes=figures.map(p=>{const xs=p.map(v=>v[0]),ys=p.map(v=>v[1]);return {p,
    bounds:{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)}};});
  let count=0;
  const inside=(r:ScreenRect)=>r.x>=12 && r.y>=16 && r.x+r.w<=viewport.width-12 && r.y+r.h<=viewport.height-16;
  for(const label of [...labels].sort((a,b)=>b.priority-a.priority)){
    if(!label.cardinal && count>=limit)continue;
    const [x,y]=label.anchor,w=label.w,h=label.h;
    let maxTravel=110;
    const options: PlacedLabel[]=[{x:x-w/2,y:y+9,w,h,slot:'anchor'}];
    if(label.figure){
      const xs=label.figure.map(p=>p[0]),ys=label.figure.map(p=>p[1]);
      const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys),cx=(left+right)/2;
      maxTravel=Math.max(110,Math.min(170,Math.hypot(right-left,bottom-top)*.75));
      options.push({x:cx-w/2,y:bottom+10,w,h,slot:'below'},
        {x:x-w-14,y:y+9,w,h,slot:'foot-left'},{x:x+14,y:y+9,w,h,slot:'foot-right'},
        {x:right+12,y:(top+bottom-h)/2,w,h,slot:'right'},
        {x:left-w-12,y:(top+bottom-h)/2,w,h,slot:'left'},
        {x:cx-w/2,y:top-h-12,w,h,slot:'above'},
        {x:x-w/2,y:y+33,w,h,slot:'lower'});
    }
    // A fixed portrait disc can cover an otherwise valid caption anchor. Offer
    // nearby edges before giving up, while keeping the caption tied to its stars.
    const anchor=options[0];
    obstructions.forEach((obstacle,index)=>{
      if(!rectsOverlap(anchor,obstacle,10))return;
      options.push({x:anchor.x,y:obstacle.y+obstacle.h+12,w,h,slot:`obstacle-${index}-below`},
        {x:obstacle.x-w-12,y:anchor.y,w,h,slot:`obstacle-${index}-left`},
        {x:obstacle.x+obstacle.w+12,y:anchor.y,w,h,slot:`obstacle-${index}-right`},
        {x:anchor.x,y:obstacle.y-h-12,w,h,slot:`obstacle-${index}-above`});
    });
    const oldSlot=previous.get(label.id)?.slot;
    const stable=options.find(o=>o.slot===oldSlot);
    const candidates=stable ? [stable,...options.filter(o=>o!==stable)] : options;
    const chosen=candidates.find(r=>inside(r) && Math.hypot(r.x+r.w/2-x,r.y+r.h/2-y)<=maxTravel
      && !obstructions.some(o=>rectsOverlap(r,o,10))
      && ![...placed.values()].some(o=>rectsOverlap(r,o,8))
      && !envelopes.some(({p,bounds})=>rectsOverlap(r,bounds,6)&&overlapsFigure(r,p)));
    if(!chosen)continue;
    placed.set(label.id,chosen);if(!label.cardinal)count++;
  }
  return placed;
}

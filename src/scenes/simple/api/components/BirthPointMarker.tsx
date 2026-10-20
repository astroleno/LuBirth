import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { SimpleComposition } from '../../../../types/SimpleComposition';
import { calculateBirthPointLocalFrame } from '../../utils/birthPointAlignment';

interface BirthPointMarkerProps {
  composition: SimpleComposition;
  earthSize: number;
}

function createMarkerTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create birth-point marker texture');

  const center = 64;
  const glow = context.createRadialGradient(center, center, 5, center, center, 52);
  glow.addColorStop(0, 'rgba(255,255,255,0.32)');
  glow.addColorStop(0.45, 'rgba(255,255,255,0.10)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, 128, 128);

  context.beginPath();
  context.arc(center, center, 36, 0, Math.PI * 2);
  context.strokeStyle = 'rgba(255,255,255,0.92)';
  context.lineWidth = 7;
  context.stroke();

  context.beginPath();
  context.arc(center, center, 22, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
  context.strokeStyle = 'rgba(255,255,255,0.95)';
  context.lineWidth = 5;
  context.stroke();

  context.beginPath();
  context.arc(center, center, 6, 0, Math.PI * 2);
  context.fillStyle = '#ffffff';
  context.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** A camera-facing locator anchored to the selected birthplace on the globe. */
export function BirthPointMarker({ composition, earthSize }: BirthPointMarkerProps) {
  const longitudeDeg = composition.birthPointLongitudeDeg ?? 0;
  const latitudeDeg = composition.birthPointLatitudeDeg ?? 0;
  const markerSize = composition.birthPointMarkerSize ?? 0.1;
  const markerColor = composition.birthPointMarkerColor ?? '#ff0000';

  const markerTexture = useMemo(() => createMarkerTexture(markerColor), [markerColor]);
  useEffect(() => () => markerTexture.dispose(), [markerTexture]);

  const birthPointPosition = useMemo(() => {
    const localFrame = calculateBirthPointLocalFrame(longitudeDeg, latitudeDeg);
    return localFrame.p.multiplyScalar(earthSize * 1.018);
  }, [earthSize, latitudeDeg, longitudeDeg]);

  if (!composition.showBirthPointMarker) return null;

  const iconSize = Math.max(markerSize * 4, earthSize * 0.09);
  return (
    <group position={birthPointPosition}>
      <sprite scale={[iconSize, iconSize, 1]} renderOrder={30}>
        <spriteMaterial
          map={markerTexture}
          transparent
          alphaTest={0.02}
          depthTest
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}

// Build-time source for reflection-v1.bin.gz; never loaded by the public page.
// Bundle for a WebGL browser with Three.js 0.180.0, call bakeReflection(renderer),
// then save the returned ArrayBuffer as a gzip file (compression is done once).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function bakeReflection(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const target = pmrem.fromScene(room,.04,.1,100,{size:64});
  const buffer = new ArrayBuffer(8+target.width*target.height*8);
  const header = new DataView(buffer);
  header.setUint32(0,target.width,true);header.setUint32(4,target.height,true);
  renderer.readRenderTargetPixels(target,0,0,target.width,target.height,new Uint16Array(buffer,8));
  target.dispose();room.dispose();pmrem.dispose();
  return buffer;
}

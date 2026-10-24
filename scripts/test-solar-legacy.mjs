import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'vite';
const cacheDir = await mkdtemp(join(tmpdir(), 'lubirth-solar-'));
const vite = await createServer({configFile:false,cacheDir,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
  for (const [path, entry] of [['autoTests','runAutoTests'],['fullLightingAutoTest','runFullLightingValidation'],['moonPhaseAutoTests','runMoonPhaseAutoTests']]) {
    const module = await vite.ssrLoadModule('/src/astro/'+path+'.ts');
    const result = module[entry]();
    assert.ok(result.total > 0, 'Empty validation is not a pass');
    assert.equal(result.passed, result.total, entry);
  }
} finally { await vite.close(); await rm(cacheDir,{recursive:true,force:true}); }

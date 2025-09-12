[plugin:vite:react-babel] /Users/zuobowen/Documents/GitHub/LuBirth/src/SimpleTest.tsx: Identifier 'toUTCFromLocal' has already been declared. (77:9)
  80 |
/Users/zuobowen/Documents/GitHub/LuBirth/src/SimpleTest.tsx:77:9
75 |  import { logger } from './utils/logger';
76 |  import { alignLongitudeOnly } from './scenes/simple/api/shotRig';
77 |  import { toUTCFromLocal } from './astro/ephemeris';
   |           ^
78 |  import { getMoonPhase } from './scenes/simple/api/moonPhase';
79 |  import { calculateMoonPhase } from './scenes/simple/utils/moonPhaseCalculator';
    at constructor (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:367:19)
    at TypeScriptParserMixin.raise (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:6630:19)
    at TypeScriptScopeHandler.declareName (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:4899:21)
    at TypeScriptParserMixin.declareNameFromIdentifier (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:7594:16)
    at TypeScriptParserMixin.checkIdentifier (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:7590:12)
    at TypeScriptParserMixin.checkLVal (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:7529:12)
    at TypeScriptParserMixin.finishImportSpecifier (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:14271:10)
    at TypeScriptParserMixin.parseImportSpecifier (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:14428:17)
    at TypeScriptParserMixin.parseImportSpecifier (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:10171:18)
    at TypeScriptParserMixin.parseNamedImportSpecifiers (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:14407:36)
    at TypeScriptParserMixin.parseImportSpecifiersAndAfter (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:14247:37)
    at TypeScriptParserMixin.parseImport (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:14240:17)
    at TypeScriptParserMixin.parseImport (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:9441:26)
    at TypeScriptParserMixin.parseStatementContent (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:12881:27)
    at TypeScriptParserMixin.parseStatementContent (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:9532:18)
    at TypeScriptParserMixin.parseStatementLike (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:12772:17)
    at TypeScriptParserMixin.parseModuleItem (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:12749:17)
    at TypeScriptParserMixin.parseBlockOrModuleBlockBody (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:13321:36)
    at TypeScriptParserMixin.parseBlockBody (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:13314:10)
    at TypeScriptParserMixin.parseProgram (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:12630:10)
    at TypeScriptParserMixin.parseTopLevel (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:12620:25)
    at TypeScriptParserMixin.parse (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:14497:10)
    at TypeScriptParserMixin.parse (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:10149:18)
    at parse (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/parser/lib/index.js:14531:38)
    at parser (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/core/lib/parser/index.js:41:34)
    at parser.next (<anonymous>)
    at normalizeFile (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/core/lib/transformation/normalize-file.js:64:37)
    at normalizeFile.next (<anonymous>)
    at run (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/core/lib/transformation/index.js:22:50)
    at run.next (<anonymous>)
    at transform (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/core/lib/transform.js:22:33)
    at transform.next (<anonymous>)
    at step (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/gensync/index.js:261:32)
    at /Users/zuobowen/Documents/GitHub/LuBirth/node_modules/gensync/index.js:273:13
    at async.call.result.err.err (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/gensync/index.js:223:11)
    at /Users/zuobowen/Documents/GitHub/LuBirth/node_modules/gensync/index.js:189:28
    at /Users/zuobowen/Documents/GitHub/LuBirth/node_modules/@babel/core/lib/gensync-utils/async.js:67:7
    at /Users/zuobowen/Documents/GitHub/LuBirth/node_modules/gensync/index.js:113:33
    at step (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/gensync/index.js:287:14)
    at /Users/zuobowen/Documents/GitHub/LuBirth/node_modules/gensync/index.js:273:13
    at async.call.result.err.err (/Users/zuobowen/Documents/GitHub/LuBirth/node_modules/gensync/index.js:223:11
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts.
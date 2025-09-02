[plugin:vite:react-babel] F:\github\LuBirth\src\App.tsx: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (622:8)
  625 |             <div className="row">
F:/github/LuBirth/src/App.tsx:622:8
627|                       value={Math.round((((comp as any)?.broadStrength ?? 0.4)*100))}
628|                       onChange={(e) => setComp(v => ({ ...v, broadStrength: parseFloat(e.target.value)/100 }))} />
629|                <input className="input" type="range" min={1} max={200} step={1}
   |                                                               ^
630|                       value={(comp as any)?.broadShiny ?? 20}
631|                       onChange={(e) => setComp(v => ({ ...v, broadShiny: parseFloat(e.target.value) }))} />
    at constructor (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:367:19)
    at TypeScriptParserMixin.raise (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:6630:19)
    at TypeScriptParserMixin.jsxParseElementAt (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:4775:18)
    at TypeScriptParserMixin.jsxParseElement (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:4782:17)
    at TypeScriptParserMixin.parseExprAtom (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:4792:19)
    at TypeScriptParserMixin.parseExprSubscripts (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11081:23)
    at TypeScriptParserMixin.parseUpdate (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11066:21)
    at TypeScriptParserMixin.parseMaybeUnary (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11046:23)
    at TypeScriptParserMixin.parseMaybeUnary (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:9857:18)
    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10899:61)
    at TypeScriptParserMixin.parseExprOps (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10904:23)
    at TypeScriptParserMixin.parseMaybeConditional (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10881:23)
    at TypeScriptParserMixin.parseMaybeAssign (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10831:21)
    at F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:9795:39
    at TypeScriptParserMixin.tryParse (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:6938:20)
    at TypeScriptParserMixin.parseMaybeAssign (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:9795:18)
    at F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10800:39
    at TypeScriptParserMixin.allowInAnd (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:12432:12)
    at TypeScriptParserMixin.parseMaybeAssignAllowIn (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10800:17)
    at TypeScriptParserMixin.parseMaybeAssignAllowInOrVoidPattern (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:12499:17)
    at TypeScriptParserMixin.parseParenAndDistinguishExpression (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11679:28)
    at TypeScriptParserMixin.parseExprAtom (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11331:23)
    at TypeScriptParserMixin.parseExprAtom (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:4797:20)
    at TypeScriptParserMixin.parseExprSubscripts (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11081:23)
    at TypeScriptParserMixin.parseUpdate (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11066:21)
    at TypeScriptParserMixin.parseMaybeUnary (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11046:23)
    at TypeScriptParserMixin.parseMaybeUnary (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:9857:18)
    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10899:61)
    at TypeScriptParserMixin.parseExprOpBaseRightExpr (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10986:34)
    at TypeScriptParserMixin.parseExprOpRightExpr (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10981:21)
    at TypeScriptParserMixin.parseExprOp (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10947:27)
    at TypeScriptParserMixin.parseExprOp (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:9394:18)
    at TypeScriptParserMixin.parseExprOps (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10908:17)
    at TypeScriptParserMixin.parseMaybeConditional (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10881:23)
    at TypeScriptParserMixin.parseMaybeAssign (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10831:21)
    at TypeScriptParserMixin.parseMaybeAssign (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:9806:20)
    at TypeScriptParserMixin.parseExpressionBase (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10784:23)
    at F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10780:39
    at TypeScriptParserMixin.allowInAnd (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:12432:12)
    at TypeScriptParserMixin.parseExpression (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10780:17)
    at TypeScriptParserMixin.jsxParseExpressionContainer (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:4665:31)
    at TypeScriptParserMixin.jsxParseElementAt (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:4744:36)
    at TypeScriptParserMixin.jsxParseElement (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:4782:17)
    at TypeScriptParserMixin.parseExprAtom (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:4792:19)
    at TypeScriptParserMixin.parseExprSubscripts (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11081:23)
    at TypeScriptParserMixin.parseUpdate (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11066:21)
    at TypeScriptParserMixin.parseMaybeUnary (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:11046:23)
    at TypeScriptParserMixin.parseMaybeUnary (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:9857:18)
    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10899:61)
    at TypeScriptParserMixin.parseExprOps (F:\github\LuBirth\node_modules\@babel\parser\lib\index.js:10904:23
Click outside, press Esc key, or fix the code to dismiss.
You can also disable this overlay by setting server.hmr.overlay to false in vite.config.ts.
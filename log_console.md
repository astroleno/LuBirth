[plugin:vite:react-babel] /Users/zuobowen/Documents/GitHub/LuBirth_2/src/App.tsx: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (622:8)
  625 |             <input className="input" type="range" min={256} max={1024} step={128}
/Users/zuobowen/Documents/GitHub/LuBirth_2/src/App.tsx:622:8
620|            </div>
621|          </div>
622|          <div className="row" style={{ marginBottom: 8 }}>
   |          ^
623|            <div className="col">
624|              <label className="label">月球RenderTarget分辨率: {comp.moonRenderTargetSize ?? 512}</label>
    at constructor (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:367:19)
    at TypeScriptParserMixin.raise (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:6630:19)
    at TypeScriptParserMixin.jsxParseElementAt (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:4775:18)
    at TypeScriptParserMixin.jsxParseElement (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:4782:17)
    at TypeScriptParserMixin.parseExprAtom (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:4792:19)
    at TypeScriptParserMixin.parseExprSubscripts (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11081:23)
    at TypeScriptParserMixin.parseUpdate (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11066:21)
    at TypeScriptParserMixin.parseMaybeUnary (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11046:23)
    at TypeScriptParserMixin.parseMaybeUnary (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:9857:18)
    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10899:61)
    at TypeScriptParserMixin.parseExprOps (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10904:23)
    at TypeScriptParserMixin.parseMaybeConditional (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10881:23)
    at TypeScriptParserMixin.parseMaybeAssign (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10831:21)
    at /Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:9795:39
    at TypeScriptParserMixin.tryParse (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:6938:20)
    at TypeScriptParserMixin.parseMaybeAssign (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:9795:18)
    at /Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10800:39
    at TypeScriptParserMixin.allowInAnd (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:12432:12)
    at TypeScriptParserMixin.parseMaybeAssignAllowIn (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10800:17)
    at TypeScriptParserMixin.parseMaybeAssignAllowInOrVoidPattern (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:12499:17)
    at TypeScriptParserMixin.parseParenAndDistinguishExpression (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11679:28)
    at TypeScriptParserMixin.parseExprAtom (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11331:23)
    at TypeScriptParserMixin.parseExprAtom (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:4797:20)
    at TypeScriptParserMixin.parseExprSubscripts (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11081:23)
    at TypeScriptParserMixin.parseUpdate (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11066:21)
    at TypeScriptParserMixin.parseMaybeUnary (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11046:23)
    at TypeScriptParserMixin.parseMaybeUnary (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:9857:18)
    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10899:61)
    at TypeScriptParserMixin.parseExprOpBaseRightExpr (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10986:34)
    at TypeScriptParserMixin.parseExprOpRightExpr (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10981:21)
    at TypeScriptParserMixin.parseExprOp (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10947:27)
    at TypeScriptParserMixin.parseExprOp (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:9394:18)
    at TypeScriptParserMixin.parseExprOps (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10908:17)
    at TypeScriptParserMixin.parseMaybeConditional (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10881:23)
    at TypeScriptParserMixin.parseMaybeAssign (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10831:21)
    at TypeScriptParserMixin.parseMaybeAssign (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:9806:20)
    at TypeScriptParserMixin.parseExpressionBase (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10784:23)
    at /Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10780:39
    at TypeScriptParserMixin.allowInAnd (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:12432:12)
    at TypeScriptParserMixin.parseExpression (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10780:17)
    at TypeScriptParserMixin.jsxParseExpressionContainer (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:4665:31)
    at TypeScriptParserMixin.jsxParseElementAt (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:4744:36)
    at TypeScriptParserMixin.jsxParseElement (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:4782:17)
    at TypeScriptParserMixin.parseExprAtom (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:4792:19)
    at TypeScriptParserMixin.parseExprSubscripts (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11081:23)
    at TypeScriptParserMixin.parseUpdate (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11066:21)
    at TypeScriptParserMixin.parseMaybeUnary (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:11046:23)
    at TypeScriptParserMixin.parseMaybeUnary (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:9857:18)
    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:10899:61)
    at TypeScriptParserMixin.parseExprOps (/Users/zuobowen/Documents/GitHub/LuBirth_2/node_modules/@babel/parser/lib/index.js:1
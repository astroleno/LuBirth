client:495 [vite] connecting...
main.tsx:3  GET http://localhost:5173/src/App.tsx?t=1756750588041 net::ERR_ABORTED 500 (Internal Server Error)
content.js:1402 [AeScape] 准备初始化悬浮球
content.js:33 [AeScape] 悬浮球系统初始化开始
content.js:156 [AeScape] URL检查: http://localhost:5173/, 应排除: false
content.js:1444 [AeScape] 内容脚本已加载
client:618 [vite] connected.
content.js:167 [AeScape] 用户设置检查: false
content.js:1967 Preloaded 316 local cards to cache
content.js:2110 Starting periodic update mechanism...
content.js:2122 Periodic update started with 180s interval
content.js:1972 Force preloading more content...
content.js:1995 Force preloading quotes: 5 cards needed
content.js:1995 Force preloading facts: 9 cards needed
content.js:1200  GET https://numbersapi.com/random/trivia net::ERR_CONNECTION_CLOSED
fetchFactCards @ content.js:1200
fetchNewCardFromAPI @ content.js:1066
forcePreloadMoreContent @ content.js:2013
(anonymous) @ content.js:367
setTimeout
init @ content.js:366
await in init
WaitWiki @ content.js:330
(anonymous) @ content.js:2255
content.js:1098 Failed to fetch new card from facts: Error: Facts API error: 网络连接失败
    at WaitWiki.fetchFactCards (content.js:1223:13)
    at async WaitWiki.fetchNewCardFromAPI (content.js:1066:19)
    at async WaitWiki.forcePreloadMoreContent (content.js:2013:15)
fetchNewCardFromAPI @ content.js:1098
await in fetchNewCardFromAPI
forcePreloadMoreContent @ content.js:2013
(anonymous) @ content.js:367
setTimeout
init @ content.js:366
await in init
WaitWiki @ content.js:330
(anonymous) @ content.js:2255
content.js:1995 Force preloading advice: 5 cards needed
content.js:1995 Force preloading catfacts: 12 cards needed

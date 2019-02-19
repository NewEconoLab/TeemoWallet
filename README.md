# Chrome Extension (built with TypeScript + React)
本人英语不好可能下面的表述会有语法错误
> This project is a boilerplate project to allow you to quickly build chrome extensions using TypeScript and React.

## Building

1.  Clone repo
2.  `npm i`
3.  `npm run dev` to compile once or `npm run watch` to run the dev task in watch mode
4.  `npm run build` to build a production (minified) version

## Installation

1.  Complete the steps to build the project above
2.  Go to [_chrome://extensions_](chrome://extensions) in Google Chrome
3.  With the developer mode checkbox ticked, click **Load unpacked extension...** and select the _dist_ folder from this repo

## 合并
1. 保持当前分支代码最新 并 push
2. 切到master 分枝， 并 拉取最新代码
3. 在master 分枝， git merge  （需要合并的分枝）
4. master push 到github

3 的 操作表示  把 xx 分枝 合并进master
const path = require("path");

module.exports = {
  entry: {
    inject:path.join(__dirname,"src/app/inject.ts"),
    content: path.join(__dirname,'src/app/content.ts'),
    background: path.join(__dirname,'src/app/background.ts'),
    popup: path.join(__dirname, "src/view/popup/index.tsx"),
    notifyPage: path.join(__dirname, "src/view/notify/index.tsx"),
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        exclude: /node_modules/,
        test: /\.less$/,
        use: [
          {
            loader: require.resolve("style-loader") // Creates style nodes from JS strings
          },
          {
            loader: require.resolve("css-loader") // Translates CSS into CommonJS
          },
          {
            loader: require.resolve("less-loader") // Compiles Sass to CSS
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};

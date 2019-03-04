const path = require("path");

module.exports = {
  entry: {
    // inject:path.join(__dirname,"src/app/inject.ts"),
    // content: path.join(__dirname,'src/app/content.ts'),
    index: path.join(__dirname, "src/view/popup/index.tsx"),
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
      },
      { 
        exclude: /node_modules/,
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        use:[
          {
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
          }
        ]
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },   
  devServer:{
    //设置基本目录结构
    contentBase:"./dist",
    //服务器的IP地址，可以使用IP也可以使用localhost
    host:'localhost',
    //服务端压缩是否开启
    compress:true,
    //配置服务端口号
    port:8080
  },
};

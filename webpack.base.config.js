var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// var ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var WebpackChunkHash = require("webpack-chunk-hash");

const isProd = process.env.NODE_ENV === "production";
var entry = {
  app: "./app/index/index.js",
  vendor: ["jquery", "vue", "vuex", "vue-router"],  // 第三方公共库
}
module.exports = {
  devtool: isProd ? false : 'eval-source-map',
  // entry:['webpack-hot-middleware/client', path.resolve(__dirname, './app/index/index.js')],
  // entry: {
  //   app: [path.resolve(__dirname, './app/index/index.js')],
  //   vendor: ["jquery", "vue", "vuex", "vue-router"],  // 第三方公共库
  // },
  entry: isProd ? entry : Object.assign(entry, { hot: ["webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000"] }),
  output: {
    path: path.resolve(__dirname, "./build"),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    // crossOriginLoading: false
  },
  resolve: { //当webpack试图去加载模块的时候，它默认是查找以 .js 结尾的文件的，它并不知道 .vue 结尾的文件是什么鬼玩意儿，所以我们要在配置文件中告诉webpack，遇到 .vue 结尾的也要去加载，
    extensions: ['', '.js', '.vue'],
    // root: path.resolve("./app"), //处理根目录
    alias: {
      "common": path.resolve(__dirname, "./app/common")
    }
  },
  // externals: { //不会打包到bundle中，只是在运行中去外部获取扩展包
  //   'AMap': 'AMap'
  // },
  module: {
    loaders: [
      //使用vue-loader 加载 .vue 结尾的文件
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel?presets=es2015',
        exclude: /node_modules/ //忽略此文件夹，加快编译速度
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.jade$/,
        loader: 'jade'
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /node_modules$/,
        loader: 'url?limit=2000&name=[name].[ext]' //limit:当你图片大小小于这个限制的时候，会自动启用base64编码图片，一并打包到输出文件，减少http请求，from memory cache
      },
      {
        test: /\.css?$/,
        loader: ExtractTextPlugin.extract("vue-style-loader", "css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]") // 处理css
      },
      //  {
      //   test: /\.css$/,
      //   loader: 'style-loader!css-loader'
      // },
         {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
    ]
  },
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract("css"),
      less: ExtractTextPlugin.extract("css!less")
    }
  },
  plugins: isProd ? [
    // new webpack.ProvidePlugin({ //页面可使用下列jquery属性
    //     $ : "jquery",
    //     jQuery : "jquery",
    //     "window.jQuery" : "jquery"
    // }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   // filename: 'app/index/index.html',
    //   template: './app/index/index.html',
    //   inject: true
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ["vendor"], //把入口文件里面的vendor(第三方依赖)数组打包成vendors.js，然后在index.html引入
    //   // minChunks: Infinity,
    // }),
    //压缩代码
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("[name]-[chunkhash].css"),	//单独使用style标签加载css并设置其路径


    // new WebpackChunkHash(),
    // new ChunkManifestPlugin({                      // --弃用（vendor很少改变，那打包名不变即可达到浏览器从缓存读取的效果。）
    //   filename: "chunk-manifest.json",
    //   manifestVariable: "webpackManifest"
    // })



    //  new webpack.DefinePlugin({
    //         'process.env.NODE_ENV': '"development"'
    //     }),
    //  new webpack.NoErrorsPlugin()
  ] : [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin("[name]-[chunkhash].css")
    ]
}

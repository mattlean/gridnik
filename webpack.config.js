const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
  entry: './src/main.jsx',
  output: {
    path: `${__dirname}/dist`,
    filename: 'main.js',
    libraryTarget: 'commonjs2',
  },
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/plugin-transform-react-jsx'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: {
    application: 'application',
    commands: 'commands',
    scenegraph: 'scenegraph',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}

if (process.env.DEV) {
  console.log('\n🤖 DEVELOPER MODE ACTIVATED 🤖\n') // eslint-disable-line
  config.output.path = __dirname
} else {
  config.output.path = `${__dirname}/dist`
  config.plugins = [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: 'images/*' }, { from: 'manifest.json' }],
    }),
  ]
}

module.exports = config

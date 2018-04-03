const webpack = require('webpack')

const rules = {
	jsx : {
		test : /\.jsx$/,
		use : ['react-hot-loader/webpack', {
			loader: 'babel-loader',
			options: { presets : ['env', 'react']}
		}],
		exclude : ['/node_modules/', 'public']
	},

	/*js : {
		test 	: /\.js$/,
		loader 	: 'babel-loader',
		exclude : ['/node_modules/', 'public']
	},

	css : {
		test 	: /\.css$/,
		use 	: [
			'style-loader',
			'css-loader'
		],
		exclude : ['/node_modules/', 'public']
	},

	less : {
		test 	: /\.less$/,
		use 	: [
			'style-loader',
			'css-loader',
			'less-loader'
		],
		exclude : ['/node_modules/', 'public']
	},*/
}



module.exports = {
	entry: './client/index.jsx',
	output: {
		path: __dirname + 'public',
		publicPath: 'build/',
		filename: 'script.js'
	},
	module: {
		rules: [rules.jsx]
	},
	devServer : {
		//historyApiFallback	: true,
		proxy: {
			'*' : {
				target: 'http://localhost:3000'
			}
		},
	}
}
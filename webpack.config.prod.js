import webpack from 'webpack';
import path from 'path';


export default {
    entry: './App.js',
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ],
    module: {
        loaders: [
            { test: /\.js$/, include: path.join(__dirname, ''), exclude: path.join(__dirname, 'node_modules'), loaders: ['babel-loader'] },
            {
                test: /(\.css)$/,
                include: [
                    path.join(__dirname, 'node_modules')
                ], 
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.(woff|woff2)$/, loader: 'url-loader?prefix=font/&limit=5000' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' }
        ]
    }
};
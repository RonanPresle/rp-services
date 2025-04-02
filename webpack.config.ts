import path from 'path';
import fs from 'fs';
import { Configuration } from 'webpack';
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin';
import dotenv from 'dotenv'
dotenv.config();
module.exports = (argv: { mode: string }): Configuration => {
    const isDevelopment = argv.mode === 'development';
    const productsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf-8')
    );

    return {
        output: {
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        plugins: [
            new HtmlBundlerPlugin({
                entry: [
                    { import: './generated/index.html', filename: 'index.html' },
                    ...['about', 'gallery', 'contact'].map(
                        
                        (page) => {
                            return {
                                import: `./generated/pages/${page}.html`,
                                filename: `${page}.html`,
                            }
                        }),
                    ...Object.keys(productsData.products).map((key) => {
                        return {
                            import: `./generated/products/${key}.html`,
                            filename: `products/${key}.html`,
                        }
                    }),
                ],
                loaderOptions: {
                    root: path.join(__dirname, '.'),
                },
                js: {
                    filename: 'js/[name].[contenthash:8].js', // Output JS filename
                },
                css: {
                    filename: 'css/[name].[contenthash:8].css', // Output CSS filename
                },
                data: {
                    ACCESS_KEY: process.env.WEB3FORM_ACCESS_KEY, // Inject the ACCESS_KEY environment variable
                },
                sources: [{ tag: 'a', attributes: ['href'] }],
                minify: false
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'css-loader',
                    ],
                },
                {
                    test: /\.(png|jpe?g|svg)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[hash:8][ext]',
                    },
                },
                {
                    test: /\.ejs$/,
                    loader: 'ejs-loader',
                    options: {
                        esModule: false, // Disable ES module syntax for compatibility
                    },
                },
            ],
        },
    }
};


// module.exports = (env: Env, argv: { mode: string }): Configuration => {
//     const isDevelopment = argv.mode === 'development';
//     const productsData = JSON.parse(
//         fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf-8')
//     );

//     return {
//         entry: './main.js',
//         output: {
//             path: path.resolve(__dirname, 'dist'),
//             filename: '[name].[contenthash].js',
//             clean: true,
//             publicPath: '',

//         },
//         module: {
//             rules: [
//                 {
//                     test: /\.js$/,
//                     exclude: /node_modules/,
//                     use: {
//                         loader: 'babel-loader',
//                         options: {
//                             presets: ['@babel/preset-env'],
//                         },
//                     },
//                 },
//                 {
//                     test: /\.css$/,
//                     use: [
//                         isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
//                         'css-loader',
//                     ],
//                 }, 
//                 {
//                     test: /\.html$/i,
//                     loader: "html-loader",
//                     generator: {
//                         filename: '[name][ext]'
//                     },
//                 },
//                 {
//                     test: /\.(jpe?g|png|gif|svg)$/,
//                     type: 'asset/resource',
//                     generator: {
//                         filename: 'images/[name]-[hash][ext]'
//                     }
//                 }
//             ],
//         },
//         plugins: [
//             new Dotenv(),
//             new MiniCssExtractPlugin({
//                 filename: isDevelopment ? '[name].css' : 'css/[name].[contenthash].css',
//             }),
//             new HtmlWebpackPlugin({
//                 template: './generated/index.html',
//                 filename: 'index.html',
//                 chunks: ['main'],
//             }),
//             ...Object.keys(productsData.products).map((key) =>
//                 new HtmlWebpackPlugin({
//                     template: `./generated/products/${key}.html`,
//                     filename: `products/${key}.html`,
//                     chunks: ['main'],
//                     publicPath: '../',
//                 })
//             ),
//             
//         ],
//         optimization: {
//             minimizer: [
//                 new TerserPlugin(),
//                 new CssMinimizerPlugin(),
//             ],
//             minimize: !isDevelopment,
//         },
//         resolve: {
//             extensions: ['.js'],
//         },
//     };
// };
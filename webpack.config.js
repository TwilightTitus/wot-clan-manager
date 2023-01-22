import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import FileManagerPlugin from "filemanager-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import entries from "./entries.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.resolve(__dirname, "dist");

const getEntry = (entryName) =>{
	return entries.find( ({name}) => name == entryName);
};


export default (env, argv) => {
	const prod = argv.mode == "production";

	return {
		// This option controls if and how source maps are generated.
		// https://webpack.js.org/configuration/devtool/
		devtool: prod ? "source-map" : "inline-source-map",

		// https://webpack.js.org/concepts/entry-points/#multi-page-application
		entry: (() => {
			const result = {};
			for (let entry of entries) {
				const { name, path, type } = entry;
				result[name] = `./client/${type}s/${path ? path : name}/index.js`;
			}
			return result;
		})(),

		// how to write the compiled files to disk
		// https://webpack.js.org/concepts/output/
		output: {
			filename: (pathData) => {
				const name = pathData.chunk.name;
				const {type, target} = getEntry(name);

				const path = target == "root" ? "" : "js/"; 
				const filename = prod ? "[name].[contenthash].min.js" : "[name].js";
				return `${path}${filename}`; 
			  },
			path: `${buildPath}`,
			clean: true,
		},

		// https://webpack.js.org/concepts/loaders/
		module: {
			rules: [
				{
					// https://webpack.js.org/loaders/css-loader/#root
					test: /\.css$/i,
					use: [MiniCssExtractPlugin.loader, "css-loader"],
				},
				{
					// https://webpack.js.org/guides/asset-modules/#resource-assets
					test: /\.(png|jpe?g|gif|svg)$/i,
					type: "asset/resource",
				},
				{
					// https://webpack.js.org/guides/asset-modules/#replacing-inline-loader-syntax
					resourceQuery: /raw/,
					type: "asset/source",
				},
				{
					// https://webpack.js.org/loaders/html-loader/#usage
					resourceQuery: /template/,
					loader: "html-loader",
				},
			],
		},

		// https://webpack.js.org/concepts/plugins/
		plugins: (() => {
			const plugins = [
				new MiniCssExtractPlugin({
					filename: `css/[name].css`,
				}),
			];
			for (let { name, path, type } of entries) {
				if (type == "page") {
					plugins.push(
						new HtmlWebpackPlugin({
							template: `./client/pages/${path ? path : name}/index.html`,
							inject: true,
							chunks: [name],
							filename: path ? `${path}/index.html` : `index.html`,
						}),
					);
				}
			}

			plugins.push(
				new CopyPlugin({
					patterns: (() => {
						const noErrorOnMissing = true;
						const pattern = [
							{ from: "./client/static", to: ".", noErrorOnMissing },
							{ from: "./client/data", to: "data", noErrorOnMissing },
							{ from: "./client/templates", to: "templates", noErrorOnMissing },
							{ from: "./client/webfonts", to: "webfonts", noErrorOnMissing },
						];
						for (let { name, path, type } of entries) {
							pattern.push({ from: `./client/${type}s/${path ? path : name}/statics`, to: `${path ? path : name}`, noErrorOnMissing });
							pattern.push({ from: `./client/${type}s/${path ? path : name}/templates`, to: `templates/${path ? path : name}`, noErrorOnMissing });
							pattern.push({ from: `./client/${type}s/${path ? path : name}/data`, to: `data/${path ? path : name}`, noErrorOnMissing });
							pattern.push({ from: `./client/${type}s/${path ? path : name}/assets`, to: `assets/${path ? path : name}`, noErrorOnMissing });
						}

						return pattern;
					})(),
				}),
			);

			if (prod)
				plugins.push(
					new FileManagerPlugin({
						events: {
							onStart: {
								delete: ["./dist"],
							},
						},
						runTasksInSeries: true,
						runOnceInWatchMode: true,
					}),
				);
			return plugins;
		})(),
		// https://webpack.js.org/configuration/optimization/
		optimization: {
			minimize: prod,
			minimizer: [
				// https://webpack.js.org/plugins/terser-webpack-plugin/
				new TerserPlugin({
					parallel: true,
				}),
				// https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production
				new CssMinimizerPlugin(),
			],
		}
	};
};

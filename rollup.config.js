import alias from "@rollup/plugin-alias"
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
// import {terser} from "rollup-plugin-terser";
import license from "rollup-plugin-license";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/0LiteLib.plugin.js",
        format: "cjs",
        exports: "auto"
    },
    plugins: [
        nodeResolve({
            extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"]
        }),
        typescript(),
        commonjs(),
        // terser({
        //     compress: {
        //         ecma: 2015,
        //         keep_classnames: true,
        //         keep_fnames: true
        //     },
        //     mangle: false
        // }),
        license({
            banner: {
                commentStyle: "none",
                content: {
                    file: "src/meta.txt",
                    encoding: "utf-8"
                }
            }
        })
    ]
};
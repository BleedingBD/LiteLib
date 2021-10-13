import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import {terser} from "rollup-plugin-terser";
import license from "rollup-plugin-license";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/0LiteLib.plugin.js",
        format: "cjs",
        exports: "default"
    },
    plugins: [
        typescript(),
        nodeResolve(),
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
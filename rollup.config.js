import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import {terser} from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
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
        terser({
            compress: {
                ecma: 2019,
                keep_classnames: true,
                keep_fnames: true,
                passes: 3
            },
            mangle: false,
            format: {
                beautify: true,
                ecma: 2019,
                keep_numbers: true,
                indent_level: 4
            }
        }),
        replace({
            preventAssignment: false,
            values: {
                "    ": "\t"
            } 
        }),
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

import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss"
import {terser} from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import license from "rollup-plugin-license";
import {main as outputFile} from "./package.json";

export default {
    input: "src/index.ts",
    output: {
        file: outputFile,
        format: "cjs",
        exports: "auto"
    },
    plugins: [
        nodeResolve(),
        postcss({
            inject: false,
        }),
        typescript({
            tsconfig: "./tsconfig.json"
        }),
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
                commentStyle: "regular",
                content: {
                    file: "src/banner.txt",
                    encoding: "utf-8"
                }
            }
        })
    ]
};

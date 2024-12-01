import * as fs from 'node:fs'
import dedent from 'dedent'
import Day from './src/Day';

const day = process.argv[2] 
const doSample = process.argv[3] != undefined

const input = fs.readFileSync(`./input/${day}${doSample ? '-sample' : ''}.txt`).toString().trim()
const mod = require(`./src/day/${day}`)

const cl  = new (Object.hasOwn(mod, 'default') ? mod.default : mod)(input) as Day
;(async () => {
    const [p1, p2] = await cl.execute()
    console.log(dedent`
        Day ${day}
        -------------------------------
        Part 1: ${p1}
        Part 2: ${p2}
`)
})();
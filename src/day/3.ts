import Day from "../Day";
import _ from 'lodash'; 


export default class DayOne extends Day {
    public regex = /mul\((\d+),(\d+)\)/g
    public regex_toggle = /(?:mul\((\d+),(\d+)\))|(?:(?:don't\(\))|(do\(\)))/g

    
    constructor(raw_input: string) {
        super(raw_input)

        
    }
    async one() {
        let total = 0;
        const matches = this.raw_input.matchAll(this.regex)
        for (const match of matches) {
            total += (parseInt(match[1]) * parseInt(match[2]))
        }

        return total
    }
    async two() {
        let total = 0;
        let enabled = true;
        const matches = this.raw_input.matchAll(this.regex_toggle)
        for (const match of matches) {
            if (match[0] == 'do()') enabled = true
            else if (match[0] == "don't()") enabled = false
            else if (enabled) total += (parseInt(match[1]) * parseInt(match[2]))
        }

        return total
    }
}
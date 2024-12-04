import Day from "../Day";
import _ from 'lodash'; 


export default class DayTwo extends Day {
    public reports_lines: string[]
    public reports: number[][]

    // https://stackoverflow.com/a/7376645
    public hasDuplicates = (array: any[]) => (new Set(array)).size !== array.length;
    public closeDuplicates = (array: any[]) => Math.abs((new Set(array)).size - array.length) > 1;
    public isAscending = (arr: number[]) => arr.every((val, i) => i === 0 || arr[i - 1] <= val);
    public isDescending = (arr: number[]) => arr.every((val, i) => i === 0 || arr[i - 1] >= val);
    
    
    constructor(raw_input: string) {
        super(raw_input)

        this.reports_lines = this.raw_input.split('\n')
        this.reports = this.reports_lines.map(r => r.trim().split(' ').map(i => parseInt(i)))
    }

    public isValid = (report: number[]) => {
        if (this.hasDuplicates(report)) return false

        let differences: number[] = [];
        for (let i = 0; i < report.length - 1; i++) {
            differences.push(Math.abs(report[i] - report[i + 1]));
        }

        if (differences.filter(n => n == 0 || n > 3).length != 0) return false;
        if (!this.isAscending(report) && !this.isDescending(report)) return false;

        return true;
    }
    
    async one() {
        let valids = 0;

        for (const report of this.reports) {
            if (this.isValid(report)) valids++;
        }

        return valids
    }
    async two() {
        let valids = 0;

        

        for (const report of this.reports) { // Yes, it deletes elements. Is it technically bad? Maybe.
            let valid = false;
            if (this.isValid(report)) valid = true;

            for (let i = 0; i < report.length; i++) { 
                let newArray = structuredClone(report)
                newArray.splice(i, 1)

                if (this.isValid(newArray)) valid = true;
            }

            if (valid) valids++;
        }
        

        return valids
    }
}
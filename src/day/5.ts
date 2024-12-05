import Day from "../Day";
import _ from 'lodash'; 


export default class DayFive extends Day {
    public rules_numbers: [number, number][]
    public rules: {[key: number]: number[]} = {} // key -> numbers that must go after it 
    public updates: number[][]
    public incorrect_ordered_updates: number[][] = []

    middleElementOfArray<T = any>(arr: T[]): T {
        return arr[Math.round((arr.length - 1) / 2)];
    }

    constructor(raw_input: string) {
        super(raw_input)

        
        const [ rules, updates ] = raw_input.replaceAll("\r", "").split('\n\n').map(x => x.trim())
        
        this.rules_numbers   = rules.split('\n').map(x => x.trim().split('|').map(d => parseInt(d)) as [number, number])
        this.updates = updates.split('\n').map(x => x.trim().split(',').map(d => parseInt(d)))

        for (const pair of this.rules_numbers) {
            const [before, after] = pair
            console.log(before, after, pair)
            if (!Object.hasOwn(this.rules, before)) this.rules[before] = []
            this.rules[before].push(after)
        }
    }
    
    

    async one() {
        let sum = 0;
        updateLoop: for (const update of this.updates) {
            pageLoop: for (const page of update) {
                const i = update.indexOf(page);
                if (!Object.hasOwn(this.rules, page)) continue pageLoop;
                pageAfterLoop: for (const pageMustBeAfter of this.rules[page]) {
                    const io = update.indexOf(pageMustBeAfter)
                    if (io == -1) continue pageAfterLoop;
                    // console.log({update, page, pageMustBeAfter, i, io})
                    if (i > io) {
                        // console.log(`${io} is after ${i}. Continuing`)
                        this.incorrect_ordered_updates.push(update) // for part two
                        continue updateLoop
                    }
                }
            }
            sum += this.middleElementOfArray(update)
        }
        return sum
    }
    async two() {
        let sum = 0;

        this.incorrect_ordered_updates = this.incorrect_ordered_updates.map(update =>
            update.sort((first, second) => (this.rules[first] ?? []).includes(second) ? -1 : 0)
        )

        for (const update of this.incorrect_ordered_updates) {
            sum += this.middleElementOfArray(update)
        }

        return sum;

    }
}
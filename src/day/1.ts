import Day from "../Day";
import _ from 'lodash'; // first ever time trying lodash!

export default class DayOne extends Day {
    public left_list: number[] = []
    public right_list: number[] = []
    public sorted_left: number[] = []
    public sorted_right: number[] = []
    
    constructor(raw_input: string) {
        super(raw_input)

        for (const row of this.raw_input.split('\n')) {
            const [l, r] = row.split('   ')

            this.left_list.push(parseInt(l))
            this.right_list.push(parseInt(r))
        }

        this.sorted_left = this.left_list.sort((a, b) => a - b)  // 2,3,1 -> 1,2,3
        this.sorted_right = this.right_list.sort((a, b) => a - b)  // 2,3,1 -> 1,2,3
    }
    
    async one() {

        // Starts with smallest at start, goes to biggest at the end
        let sorted_pairs: number[][] = []

        for (let i = 0; i < this.sorted_left.length; i++) {
            sorted_pairs.push([this.sorted_left[i], this.sorted_right[i]])
        }
        
        let distanceTotal = 0;
        for (const pair of sorted_pairs) {
            distanceTotal += Math.abs(pair[0] - pair[1])
        }

        return distanceTotal
    }
    async two() {
        let similarityScore = 0;
        let rightCounts = _.countBy(this.sorted_right)

        for (const element of this.sorted_left) {
            let elCount = rightCounts[element] ?? 0
            similarityScore += element * elCount
        }

        return similarityScore
    }
}
import Day from "../Day";
import _ from 'lodash'; 


export default class DayFour extends Day {
    public XMAS = ['X', 'M', 'A', 'S']
    public DIAGONAL_DOWN_DIRECTIONS = [
        {x:-1, y: -1 },
        {x:1, y: -1 },
    ]
    public DIAGONAL_DIRECTIONS = [
        {x:-1, y: 1 },
        {x:1, y: 1 },
        ...this.DIAGONAL_DOWN_DIRECTIONS,
    ]
    public DIRECTIONS = [
        {x: 1, y: 0 },
        {x:-1, y: 0 },
        {x:0, y: 1 },
        {x:0, y: -1 },
        ...this.DIAGONAL_DIRECTIONS,
    ]

    public board: string[][] = [] // board[y][x]

    public _lastCheckedPos: [number, number] = [0, 0]
    public b(x: number, y: number): string | undefined {
        if (x >= this.board[0].length || y >= this.board.length || x < 0 || y < 0) return undefined
        this._lastCheckedPos = [x, y]
        // console.log(y, x, this.board.length, this.board[0].length, this.board[y])
        try {
            return this.board[y][x]
        } catch (e) {
            console.log(e); debugger;
        }
    }

    public isStartingInDirection(originX: number, originY: number, stepX: number, stepY: number, goal: string[] = this.XMAS): boolean {
        let str = ''
        for (let i = 0; i < goal.length; i++) {
            let t = this.b(originX + (stepX * i), originY + (stepY * i))
            str+=t
            // console.log(t, originX, originY, stepX, stepY)
            // if (t != this.XMAS[i]) return false; 
        }
        // console.log(str)
        return str == goal.join('');
    }

    public isOriginsForXmas = (x: number, y: number): number => {
        let result = 0;
        if (this.b(x, y) != 'X') return 0;

        for (const direction of this.DIRECTIONS) { 
            if (this.isStartingInDirection(x, y, direction.x, direction.y)) result++;
        }
        
        // console.log(`xmas origin @ x: ${x}, y: ${y}`)
        return result;
    }

    public isOriginsForMAS = (x: number, y: number): boolean => {
        const fw = 'MAS'
        const bw = 'SAM'

        for (const direction of this.DIAGONAL_DOWN_DIRECTIONS) { 
            if (this.isStartingInDirection(x, y, direction.x, direction.y, fw.split(''))) return true;
            if (this.isStartingInDirection(x, y, direction.x, direction.y, bw.split(''))) return true;
        }
        
        return false;
    }
    
    constructor(raw_input: string) {
        super(raw_input)

        this.board = raw_input.split('\n').map(x => x.trim().split(''))
    }
    
    
    async one() {
        let occurences = 0;
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                occurences += this.isOriginsForXmas(x, y)
            }
        }

        return occurences;
    }
    
    async two() {
        let occurences = 0;

        
        yL: for (let y = 1; y < this.board.length - 1; y++) {
            xL: for (let x = 1; x < this.board[y].length - 1; x++) {    
                if (this.b(x, y) != 'A') continue xL;
                
                const topLeft = this.b(x - 1, y - 1);
                const topRight = this.b(x - 1, y + 1);
                const bottomLeft = this.b(x + 1, y - 1);
                const bottomRight = this.b(x + 1, y + 1);
                
                // I hate this. this is awful. I hate it. AAAAAAAAAAAAAAAAAAAAAAAAA
                if (
                    (topLeft == 'M' && bottomRight == 'S' && bottomLeft == 'S' && topRight == 'M') ||
                    (topLeft == 'S' && bottomRight == 'M' && bottomLeft == 'M' && topRight == 'S') ||
                    
                    (topLeft == 'S' && bottomRight == 'M' && bottomLeft == 'M' && topRight == 'S') ||
                    (topLeft == 'M' && bottomRight == 'S' && bottomLeft == 'S' && topRight == 'M') ||
                    
                    (topLeft == 'M' && bottomRight == 'S' && bottomLeft == 'M' && topRight == 'S') ||
                    (topLeft == 'S' && bottomRight == 'M' && bottomLeft == 'S' && topRight == 'M') 
                ) {
                    occurences++;
                }
            }
        }

        return occurences
    }
    
    async __two_broken() {
        let occurences = 0;
        let covered_tiles: string[] = []


        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                const tl: [number, number] = [x, y]
                const tr: [number, number] = [x + 2, y]
                const tls = tl.join(',')
                const trs = tr.join(',')
                
                if (covered_tiles.includes(tls) || covered_tiles.includes(trs)) continue
                covered_tiles.push(tls)
                covered_tiles.push(trs)
                
                const a = this.isOriginsForMAS(...tl);
                const b = this.isOriginsForMAS(...tr)
                if (a && b) {
                    occurences++;
                    console.log(`${x}/${y} - ${this.board[y][x]}`)
                }
                // console.log(`${x}/${y} - fw: ${a} bw: ${b}`)
            }
        }

        return occurences;
    }
}
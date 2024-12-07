import Day from "../Day";
import _ from 'lodash'; 

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Tile = '#' | '.' | '^'
interface HitObstacle {
    sourceDirection: Direction
    coordinates: [number, number]
}

export default class DaySix extends Day {
    public GUARD = '^' as const
    public GUARD_COVERED = 'Z' as const
    public board: string[][] = [] // board[y][x]
    public original_board: string[][] = [] // board[y][x]
    public obstacles_hit: HitObstacle[] = []


    public directions = { // x, y
        'UP': [0, -1] as [number, number], // -1 because origin is from top left
        'DOWN': [0, +1] as [number, number], // +1 because origin is from top left
        'RIGHT': [+1, 0] as [number, number],
        'LEFT': [-1, 0] as [number, number],
    } as const

    public hasObstacleBeenHit(obstacle: HitObstacle) {
        const coords = obstacle.coordinates
        for (const hit of this.obstacles_hit) {
            const [x, y] = hit.coordinates
            if (x == coords[0] && y == coords[1]) return true;
        }
        return false;
    }

    public getIndexOfCaret = (board = this.board) => {
        for (let y = 0; y < board.length; y++) {
            const x = board[y].indexOf(this.GUARD) || board[y].indexOf(this.GUARD_COVERED)
            if (x != -1) return [x, y]
        }
        return [-1, -1]
    }

    public b(x: number, y: number, board = this.board): string | undefined {
        if (x >= board[0].length || y >= board.length || x < 0 || y < 0) return undefined
        // console.log(y, x, this.board.length, this.board[0].length, this.board[y])
        try {
            return board[y][x]
        } catch (e) {
            console.log(e); debugger;
        }
    }
    
    constructor(raw_input: string) {
        super(raw_input)   

        this.board = raw_input.split('\n').map(x => x.trim().split(''))
        this.original_board = structuredClone(this.board)
    }
    
    public isWithinBounds(pos: number, size: number) {
        return pos >= 0 && pos < size
    }

    public turnRight90Degrees(direction: Direction): Direction {
        if (direction == 'UP') return 'RIGHT'
        if (direction == 'RIGHT') return 'DOWN'
        if (direction == 'DOWN') return 'LEFT'
        if (direction == 'LEFT') return 'UP'
        throw Error(`${direction} cannot be modified.`)
    }

    public getNewDirection(x: number, y: number, direction: Direction): [Direction, boolean] {
        const step = this.directions[direction]
        const nx = x + step[0]
        const ny = y + step[1]

        if (this.b(nx, ny) == '#') {
            const obstacle = {
                coordinates: [nx, ny],
                sourceDirection: direction
            } as HitObstacle
            
            const data = [this.turnRight90Degrees(direction), this.hasObstacleBeenHit(obstacle)]
            this.obstacles_hit.push(obstacle)
            //@ts-ignore
            return data 
        }
        return [direction, false] // keep forward
    }
    

    async one() {
        let covered = 0;

        var currentDirection: Direction = 'UP'

        let [x, y] = this.getIndexOfCaret()

        do {
            // console.log({x, y, currentDirection, covered})
            if (this.b(x, y) != 'X' && this.b(x, y) != 'Z') covered++; // prevent counting an already covered tile
            this.board[y][x] = this.b(x, y) == this.GUARD ? 'Z' : 'X'
            x += this.directions[currentDirection][0]
            y += this.directions[currentDirection][1]
            var [currentDirection, previouslyHit] = this.getNewDirection(x, y, currentDirection)
            if (previouslyHit) { // won't happen in part 1 and wont care
                console.log(`Started hit a circle at ${x}/${y}`)
                continue;
            }
        } while (this.isWithinBounds(x, this.board[0].length) && this.isWithinBounds(y, this.board.length))


        // console.log(this.board.map(x => x.join('')).join('\n'))
        
        return covered
    }
    async two() {
        let solutions = 0;
        
        const attempts = this.board.length * this.board[0].length
        const run = (localBoard: typeof this.board, max: number = attempts) => {
            var currentDirection: Direction = 'UP'

            let [x, y] = this.getIndexOfCaret(localBoard)
            let i = 0;

            do {
                // console.log({x, y, currentDirection, covered})
                if (x == -1 || y == -1) console.log(localBoard)
                localBoard[y][x] = localBoard[y][x] == this.GUARD ? 'Z' : 'X'
                x += this.directions[currentDirection][0]
                y += this.directions[currentDirection][1]
                // console.log(this.obstacles_hit)
                var [currentDirection, previouslyHit] = this.getNewDirection(x, y, currentDirection)
                if (previouslyHit) { // won't happen in part 1 and wont care
                    console.log(localBoard.map(x => x.join('')).join('\n'))
                    // console.log(Started hit a circle at ${x}/${y})
                    this.obstacles_hit = []
                    return true
                }
            } while (this.isWithinBounds(x, localBoard[0].length) && this.isWithinBounds(y, localBoard.length) && ++i < max)


            // console.log(this.board.map(x => x.join('')).join('\n'))
            
            return false
        }

        const coveredInPartOne: [number,number][] = []
        this.board.forEach((yR, yI) => {
            yR.forEach((xR, xI) => {
                if (xR == 'X' || xR == 'Z') {
                    coveredInPartOne.push([xI, yI])
                }
            })
        })

        console.log(coveredInPartOne)

        for (let i = 0; i < coveredInPartOne.length; i++) {
            const position = coveredInPartOne[i]
            const modifiedBoard = structuredClone(this.original_board)
            if (this.b(position[0], position[1], modifiedBoard) != this.GUARD && this.b(position[0], position[1], modifiedBoard) != this.GUARD_COVERED) modifiedBoard[position[1]][position[0]] = '#'

            console.log(`Running ${i} (${coveredInPartOne[i]})`)
            const canBeCircular = run(modifiedBoard, attempts)
            console.log(`Board choice ${i} - ${canBeCircular}`)
            if (canBeCircular) solutions++;
        }

        return solutions

    }
}
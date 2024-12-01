export default class Day {
    public raw_input: string
    
    constructor(raw: string) {
        this.raw_input = raw
    }

    async execute(): Promise<[string | number, string | number]>{
        return [
            await this.one(),
            await this.two(),
        ]
    }

    async one(): Promise<string | number> {
        return -1
    }

    async two(): Promise<string | number> {
        return -1
    }
}
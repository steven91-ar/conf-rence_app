export abstract class Entity<P> {
    public initialeState: P
    public props: P

    constructor(data: P) {
        this.initialeState = {...data};
        this.props = {...data};

        Object.freeze(this.initialeState);
    }

    update(data: Partial<P>): void {
        this.props = {...this.props, ...data};
    }

    commit(): void {
        this.initialeState = {...this.props};
    }
}
export class ChunckCounter {
  counter = 0;

  public add(): void {
    this.counter++;
  }

  public get(): number {
    return this.counter;
  }
}

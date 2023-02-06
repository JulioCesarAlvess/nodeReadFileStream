export class ChunckCounter {
  static counter = 0;

  public add(): void {
    ChunckCounter.counter++;
  }

  public get(): number {
    return ChunckCounter.counter;
  }
}

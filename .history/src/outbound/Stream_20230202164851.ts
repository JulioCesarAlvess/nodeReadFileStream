import { Readable, Transform } from 'stream';

//Readble é a base dados, a corrente de dados
export class ReadableStream extends Readable {
  constructor() {
    super({
      // objectMode: true,
      highWaterMark: 2,
    });
  }

  _read() {
    for (let index = 0; index < 1000; index++) {
      const person = { id: Date.now() + index, name: `  Julio-${index}` };
      this.push(JSON.stringify(person));
    }
    //avisa que acabaram os dados
    this.push(null);
  }
}
export const readbleStream = new Readable({
  read() {
    for (let index = 0; index < 1000; index++) {
      const person = { id: Date.now() + index, name: `  Julio-${index}` };
      this.push(JSON.stringify(person));
    }
    //avisa que acabaram os dados
    this.push(null);
  },
  highWaterMark: 2,
});

//Transform é usado para alterar um dado dentro da Stream
export const formatData = new Transform({
  transform(chunk, encoding, cb) {
    const result = chunk.toString();
    cb(null, result);
  },
});

export const transform = (chunk, encoding, cb) => {
  const result = chunk.toString();
  cb(null, result);
};

import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateFileEvent } from '../events/create-file.event';

export class FileFactory {
  contas = [];
  folderName = '';
  contasFinalizadas = [];
  eventEmitter: EventEmitter2;

  constructor(contas: string[], eventEmitter: EventEmitter2) {
    this.contas = contas;
    this.eventEmitter = eventEmitter;
  }
  private readonly logger = new Logger(FileFactory.name);

  init(folderName: string) {
    this.contas.forEach((conta) => {
      this.logger.log(`emitindo um evento de csv para a conta ${conta}`);
      this.eventEmitter.emit('create.csv', { account: conta, folderName });
    });
    this.eventEmitter.on('finish.pdf', (event: CreateFileEvent) =>
      this.adicionaContaFinalizada(event.account, folderName),
    );
  }

  adicionaContaFinalizada(conta: string, folderName: string) {
    this.contasFinalizadas.push(conta);
    this.logger.log(`arquivos criados para a conta ${conta}`);
    if (this.contasFinalizadas.length === this.contas.length) {
      this.eventEmitter.emit('create.zip', { folderName });
    }
  }
}

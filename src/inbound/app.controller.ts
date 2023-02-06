import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { generateZipDTO } from 'src/core/dto/generate-zip.dto';
import { GenerateFiles } from 'src/core/usecase/generate-files';

@Controller()
export class AppController {
  constructor(private readonly generateFiles: GenerateFiles) {}

  /*   @Get('/zip')
  getZip(): string {
    this.eventEmitter.emit('create.csv');
    return 'teste';
  } */

  @Post('/zip')
  getZipAccounts(@Body() generateFilesDto: generateZipDTO): string {
    this.generateFiles.execute(generateFilesDto.accounts);

    return 'teste';
  }
}

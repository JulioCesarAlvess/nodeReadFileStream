import { Module } from '@nestjs/common';
import { AppController } from './inbound/app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GenerateCsv } from './core/usecase/generate-csv';
import { GeneratePdf } from './core/usecase/generate-pdf';
import { GenerateZip } from './core/usecase/generate-zip';
import { GenerateFiles } from './core/usecase/generate-files';
import { GenerateHtmlTxt } from './core/usecase/generate-html-txt';
import { GenerateHtml } from './core/usecase/generate-html';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      maxListeners: 0,
    }),
  ],
  controllers: [AppController],
  providers: [
    GenerateCsv,
    GeneratePdf,
    GenerateZip,
    GenerateFiles,
    GenerateHtmlTxt,
    GenerateHtml,
  ],
})
export class AppModule {}

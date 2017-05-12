import {Directive, ElementRef, EventEmitter} from '@angular/core';
import {Ng2Uploader} from '../services/ng2-uploader';

@Directive({
  selector: '[ng-file-select]',
  inputs: ['options: ng-file-select'],
  outputs: ['onUpload', 'onStart', 'onUploaderInit'],
  host: { '(change)': 'onFiles()' }
})
export class NgFileSelect {
  uploader: Ng2Uploader;
  options: any;
  onUploaderInit: EventEmitter<Ng2Uploader> = new EventEmitter();
  onStart: EventEmitter<any> = new EventEmitter();
  onUpload: EventEmitter<any> = new EventEmitter();

  constructor(public el: ElementRef) {
    this.uploader = new Ng2Uploader();
    setTimeout(() => {
      this.uploader.setOptions(this.options);
      this.onUploaderInit.emit(this.uploader);
    });

    this.uploader._emitter.subscribe((data) => {
      if(data.init){
        this.onUpload.emit(data);
      }
      else {
        this.onStart.emit(data);
      }
    });
  }

  onFiles(): void {
    let files = this.el.nativeElement.files;
    if (files.length) {
      this.uploader.addFilesToQueue(files);
    }
  }

  startUpload(): void {
     this.uploader.uploadFilesInQueue();
  }
}
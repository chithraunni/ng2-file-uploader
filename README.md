# ng2-file-uploader

## Angular2 File Uploader

### Installation

```
npm install ng2-file-uploader
```

#### Examples

1. [Basic Example](https://github.com/spartaksun/ng2-file-uploader#basic-example)
2. [Multiple Files Example](https://github.com/spartaksun/ng2-file-uploader#multiple-files-example)
3. [Basic Progressbar Example](https://github.com/spartaksun/ng2-file-uploader#progressbar-example)
4. [Multiple Files Progressbars Example](https://github.com/spartaksun/ng2-file-uploader#multiple-files-progressbars-example)

#### Backend Examples

1. [NodeJS using HapiJS](https://github.com/spartaksun/ng2-file-uploader#backend-example-using-hapijs)
2. [PHP (Plain)](https://github.com/spartaksun/ng2-file-uploader#backend-example-using-plain-php)

### Basic Example

`component.ts`
````typescript
import {Component} from '@angular/core';
import {UPLOAD_DIRECTIVES} from 'ng2-file-uploader/ng2-file-uploader';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/demo.html',
  directives: [UPLOAD_DIRECTIVES],
})
export class DemoApp {
  uploadFile: any;
  postId: number;
  options: Object = {
    url: 'http://localhost:10050/upload',
    params: { 'post_id': this.postId }
  };

  handleUpload(data): void {
    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadFile = data;
    }
  }
}
````

`component.html`
````html
<input type="file" 
       [ng-file-select]="options"
       (onUpload)="handleUpload($event)">

<div>
Response: {{ uploadFile | json }}
</div>
````

### Multiple files example

`component.ts`
````typescript
import {Component} from '@angular/core';
import {UPLOAD_DIRECTIVES} from 'ng2-file-uploader/ng2-file-uploader';

@Component({
  selector: 'basic-multiple',
  templateUrl: 'basic-multiple.html',
  directives: [UPLOAD_DIRECTIVES],
})
export class BasicMultiple {
  uploadedFiles: any[] = [];
  options: Object = {
      url: 'http://localhost:80/upload'
  };

  handleUpload(data): void {
    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadedFiles.push(data);
    }
  }
}
````

`component.html`
````html
<input type="file" 
       style="display:none;"
       [ng-file-select]="options"
       (onUpload)="handleUpload($event)"
       multiple>
</div>

<div>
Response: <br/>{{ uploadedFiles | json }}
</div>
````

### Progressbar example

`component.ts`
````typescript
import {Component, NgZone} from '@angular/core';
import {UPLOAD_DIRECTIVES} from 'ng2-file-uploader/ng2-file-uploader';

@Component({
  selector: 'basic-progressbar',
  templateUrl: 'app/components/basic-progressbar/basic-progressbar.html',
  directives: [UPLOAD_DIRECTIVES],
})
export class BasicProgressbar {
  uploadFile: any;
  uploadProgress: number;
  uploadResponse: Object;
  zone: NgZone;
  options: Object = {
    url: 'http://localhost:80/upload'
  };

  constructor() {
    this.uploadProgress = 0;
    this.uploadResponse = {};
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  handleUpload(data): void {
    this.uploadFile = data;
    this.zone.run(() => {
      this.uploadProgress = data.progress.percent;
    });
    let resp = data.response;
    if (resp) {
      resp = JSON.parse(resp);
      this.uploadResponse = resp;
    }
  }
}
````

`component.html`
````html
<div>
  <label for="file-pb" class="ui small black button right icon upload-button">
      <i class="ion-document icon"></i>
      Choose file
  </label>
  <input type="file" 
         id="file-pb"
         style="display:none;"
         [ng-file-select]="options"
         (onUpload)="handleUpload($event)">
</div>

<div *ngIf="uploadFile">
Progress: {{ uploadProgress }}%
</div>
<div *ngIf="uploadFile">
  <div class="ui indicating olive progress">
    <div class="bar" [style.width]="uploadProgress + '%'"></div>
    <div class="label">Uploading file ({{ uploadProgress }}%)</div>
  </div>
</div>

<div>
Response: <br/>{{ uploadFile | json }}
</div>
````

### Multiple files progressbars example

`component.ts`
````typescript
import {Component, NgZone} from '@angular/core';
import {UPLOAD_DIRECTIVES} from 'ng2-file-uploader/ng2-file-uploader';

@Component({
  selector: 'multiple-progressbar',
  templateUrl: 'app/components/multiple-progressbar/multiple-progressbar.html',
  directives: [UPLOAD_DIRECTIVES]
})
export class MultipleProgressbar {
  uploadFiles: any[];
  uploadProgresses: any[] = [];
  zone: NgZone;
  options: Object = {
    url: 'http://localhost:80/upload'
  };

  constructor() {
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  handleUpload(data): void {
    let id = data.id;
    let index = this.findIndex(id);
    if (index === -1) {
      this.uploadProgresses.push({id: id, percent: 0});
    }
    if (this.uploadProgresses[index]) {
      this.zone.run(() => {
        this.uploadProgresses[index].percent = data.progress.percent;
      });
    }
  }

  findIndex(id: string): number {
    return this.uploadProgresses.findIndex(x => x.id === id);
  }

}
````

`component.html`
````html
<div>
  <label for="files-pb" class="ui small black button right icon upload-button">
      <i class="ion-document-text icon"></i>
      Choose files
  </label>
  <input type="file" 
         id="files-pb"
         style="display:none;"
         [ng-file-select]="options"
         (onUpload)="handleUpload($event)"
         multiple>
</div>

<div class="ui divider"></div>

<div *ngFor="#progressObj of uploadProgresses">
  <div class="ui indicating olive progress">
    <div class="bar" [style.width]="progressObj.percent + '%'"></div>
    <div class="label">Uploading file ({{ progressObj.percent }}%)</div>
  </div>
</div>
````


### Token-authorized call example

`component.ts`
````typescript
import {Component} from '@angular/core';
import {UPLOAD_DIRECTIVES} from 'ng2-file-uploader/ng2-file-uploader';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/demo.html',
  directives: [UPLOAD_DIRECTIVES],
})
export class DemoApp {
  uploadFile: any;
  options: Object = {
    url: 'http://localhost:80/upload',
    withCredentials: true,
    authToken: localStorage.getItem('token'),
    authTokenPrefix: "Bearer" // required only if different than "Bearer"
    
  };

  handleUpload(data): void {
    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadFile = data;
    }
  }
}
````

`component.html`
````html
<input type="file" 
       [ng-file-select]="options"
       (onUpload)="handleUpload($event)">

<div>
Response: {{ uploadFile | json }}
</div>
````

### Custom field name example

You may want to sent file with specific form field name. For that you can use options.fieldName. If not provided then the field will be named "file".

`component.ts`
````typescript
import {Component} from '@angular/core';
import {UPLOAD_DIRECTIVES} from 'ng2-file-uploader/ng2-file-uploader';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/demo.html',
  directives: [UPLOAD_DIRECTIVES],
})
export class DemoApp {
  uploadFile: any;
  options: Object = {
    url: 'http://localhost:80/upload',
    fieldName: 'logo'    
  };

  handleUpload(data): void {
    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadFile = data;
    }
  }
}
````

`component.html`
````html
<input type="file" 
       [ng-file-select]="options"
       (onUpload)="handleUpload($event)">

<div>
Response: {{ uploadFile | json }}
</div>
````

### Backend example using plain PHP

````php
<?php 

header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(array('status' => false));
  exit;
}

$path = 'uploads/';

if (isset($_FILES['file'])) {
  $originalName = $_FILES['file']['name'];
  $ext = '.'.pathinfo($originalName, PATHINFO_EXTENSION);
  $generatedName = md5($_FILES['file']['tmp_name']).$ext;
  $filePath = $path.$generatedName;
  
  if (!is_writable($path)) {
    echo json_encode(array(
      'status' => false,
      'msg'    => 'Destination directory not writable.'
    ));
    exit;
  }

  if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
    echo json_encode(array(
      'status'        => true,
      'originalName'  => $originalName,
      'generatedName' => $generatedName
    ));
  }
}
else {
  echo json_encode(
    array('status' => false, 'msg' => 'No file uploaded.')
  );
  exit;
}

?>
````

### Demos

For more information, examples and usage examples please see [demos](http://ng2-uploader.com)

#### LICENCE

MIT
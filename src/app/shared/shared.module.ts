import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoarderComponent } from './loarder/loarder.component';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    LoarderComponent
  ],
  exports:[
    LoarderComponent,
  ]
})
export class SharedModule { }

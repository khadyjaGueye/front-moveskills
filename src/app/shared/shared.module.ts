import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoarderComponent } from './loarder/loarder.component';
import { CardComponent } from './card/card.component';
import { CountUpDirective } from './directives/count-up.directive';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    LoarderComponent,
    CardComponent,
    CountUpDirective
  ],
  exports: [
    LoarderComponent,
    CardComponent,
    CountUpDirective
  ]
})
export class SharedModule { }

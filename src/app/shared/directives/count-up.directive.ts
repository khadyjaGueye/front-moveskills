import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { CountUp } from 'countup.js';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnChanges {

  @Input() endValue!: number;

  private countUp!: CountUp;

  constructor(private el: ElementRef) { }

  ngOnChanges(): void {
    if (this.endValue !== undefined) {
      this.countUp = new CountUp(this.el.nativeElement, this.endValue, { duration: 2 });
      if (!this.countUp.error) {
        this.countUp.start();
      } else {
        console.error(this.countUp.error);
      }
    }
  }

}

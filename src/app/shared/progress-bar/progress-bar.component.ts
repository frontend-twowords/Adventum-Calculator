import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  @Input() progress = 0;
  @Input() color = '#488aff';

  get clampedProgress(): number {
    if (Number.isNaN(this.progress)) {
      return 0;
    }
    return Math.max(0, Math.min(100, this.progress));
  }
}

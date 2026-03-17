import { Component, Input } from '@angular/core';

@Component({
  selector: 'circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.css']
})
export class CircleProgressComponent {
  @Input() percent = 0;
  @Input() title: string | number = '';
  @Input() radius = 50;
  @Input() outerStrokeWidth = 8;
  @Input() outerStrokeColor = '#e0e0e0';
  @Input() titleColor = '#222';
  @Input() titleFontSize = 16;
  @Input() showTitle = true;
  @Input() showUnits = true;

  // Compatibility inputs used by existing templates.
  @Input() backgroundStrokeWidth = 0;
  @Input() backgroundPadding = 0;
  @Input() space = 0;
  @Input() unitsFontSize = 12;
  @Input() unitsFontWeight: string | number = 400;
  @Input() unitsColor = '#444';
  @Input() outerStrokeGradient = false;
  @Input() outerStrokeGradientStopColor = '#999';
  @Input() outerStrokeLinecap: 'round' | 'butt' | 'square' = 'round';
  @Input() innerStrokeColor = '#fff';
  @Input() innerStrokeWidth = 0;
  @Input() titleFontWeight: string | number = 400;
  @Input() subtitleColor = '#000';
  @Input() subtitleFontWeight: string | number = 400;
  @Input() imageHeight = 0;
  @Input() imageWidth = 0;
  @Input() animation = true;
  @Input() animateTitle = false;
  @Input() animationDuration = 0;
  @Input() showSubtitle = false;
  @Input() showBackground = false;
  @Input() responsive = true;
  @Input() showZeroOuterStroke = false;

  get clampedPercent(): number {
    if (Number.isNaN(this.percent)) {
      return 0;
    }
    return Math.max(0, Math.min(100, this.percent));
  }

  get displayTitle(): string {
    if (this.title === '' || this.title === null || this.title === undefined) {
      return `${this.clampedPercent}`;
    }
    return String(this.title);
  }
}

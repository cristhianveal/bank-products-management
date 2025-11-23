import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: false,
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent {
  @Input() height = '20px';
  @Input() width = '100%';
}
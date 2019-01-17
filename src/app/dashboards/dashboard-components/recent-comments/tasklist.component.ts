import { Component, Input } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TaskListComponent {
  public config: PerfectScrollbarConfigInterface = {};

  @Input()
  title: string;

  constructor() {}
}

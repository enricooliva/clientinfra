import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{
  public config: PerfectScrollbarConfigInterface = {};
  public model: any;

  isLoading: boolean = false;

  constructor(private service: DashboardService) {}

  ngOnInit(): void {    
    this.isLoading = true;
    this.model = this.service.getNotifications().pipe(
      tap(x =>    setTimeout(()=> { this.isLoading = false; }, 0) )
    );
  }

}

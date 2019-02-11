import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{
  
  model: any;

  constructor(private service: DashboardService) {}

  ngOnInit(): void {
    this.model = this.service.getNotifications();
  }

}

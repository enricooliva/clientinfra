import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Convenzione } from '../../convenzione';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-convenzionedetails',
  templateUrl: './convenzionedetails.component.html', 
  styles: []
})
export class ConvenzionedetailsComponent implements OnInit {

  isLoading: boolean=false;
  conv: Convenzione;
  onDestroy$ = new Subject<void>();

  constructor(private service: ApplicationService, private route: ActivatedRoute, protected router: Router) { }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      if (params['id']) {
        this.isLoading = true;
        this.service.clearMessage();
        this.service.getConvenzioneById(params['id']).subscribe((data) => {
          this.conv = data;          
          this.isLoading = false;         
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  get denominazione(){
    if (this.conv && this.conv.aziende)
      return this.conv.aziende.reduce((acc, x)=> acc = acc +' ' + x.denominazione, '');
    return '';
  }

}

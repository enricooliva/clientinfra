import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceQuery } from '../query-builder/query-builder.interfaces';
import { encode, decode } from 'base64-arraybuffer';

@Component({
  template: ` `
})

//ng g c submission/components/roles -s true --spec false -t true


export class BaseResearchComponent implements OnInit {

  protected isLoading = false;
  protected fieldsRow: FormlyFieldConfig[] = [];

  builderoptions: FormlyTemplateOptions;
  
  form = new FormGroup({});

  protected model = {
    data: new Array<any>(),
  };

  protected querymodel = {
    rules: new Array<any>(),
  };

  protected resultMetadata: FormlyFieldConfig[] = []; // = this.fieldsRow;

  protected routeAbsolutePath = 'home/';  

  enableNew = true;

  title = null;

  protected service: ServiceQuery;

  //sessionId ricerca titulus 
  protected sessionId: null;

  constructor(protected router: Router, protected route: ActivatedRoute) {       
  }

  ngOnInit() {
    
  }

  onNew(event) {
    this.router.navigate([this.routeAbsolutePath+'/new']);
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {
      this.router.navigate([this.routeAbsolutePath, event.row.id]);
    }
  }


  onFind(model, reset=true) {
    this.querymodel.rules = model.rules;

    if (reset)
      this.resetQueryModel();

    this.isLoading = true;
    //this.service.clearMessage();
    try {
      this.service.query(this.querymodel).subscribe((data) => {
        const to = this.resultMetadata[0].templateOptions;
        this.isLoading = false;
        this.model = {
          data: data.data
        }

        this.sessionId = data.sessionId;        

        to.page.totalElements = data.total; // data.to;
        to.page.pageNumber = data.current_page - 1;
        to.page.size = data.per_page;

      }, err => {
        this.isLoading = false;
        console.error('Oops:', err.message);
      });
    } catch (e) {
      this.isLoading = false;
      console.error(e);
    }
  }

  onSetPage(pageInfo) {
    if (this.sessionId)
      this.querymodel['sessionId'] = this.sessionId;
    if (pageInfo.limit)
      this.querymodel['limit'] = pageInfo.limit;
    if (this.model.data.length > 0) {
      this.querymodel['page'] = pageInfo.offset + 1;
      this.onFind(this.querymodel, false);
    }
  }

  protected resetQueryModel(){    
    this.querymodel['sessionId'] = null;    
    this.querymodel['page'] = null;
  }

  onExport(){
    //richiamare export dal service
    if (this.model.data.length>0){
      this.isLoading = true;
      this.service.export(this.querymodel).subscribe(file => {
        this.isLoading = false;      

        var blob = new Blob([file]);
        saveAs(blob, "download.csv");

      },
        e => {  this.isLoading = false; console.log(e); }
      );
      
    }
  }

}

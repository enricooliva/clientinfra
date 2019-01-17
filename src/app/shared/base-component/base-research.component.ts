import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceQuery } from '../query-builder/query-builder.interfaces';

@Component({
  template: ` `
})

//ng g c submission/components/roles -s true --spec false -t true


export class BaseResearchComponent implements OnInit {

  protected isLoading = false;
  protected fieldsRow: FormlyFieldConfig[] = [];

  form = new FormGroup({});

  protected model = {
    data: new Array<any>(),
  };

  protected querymodel = {
    rules: new Array<any>(),
  };

  protected resultMetadata: FormlyFieldConfig[] = []; // = this.fieldsRow;

  protected routeAbsolutePath = 'home/';

  title = null;

  protected service: ServiceQuery;

  constructor(protected router: Router, protected route: ActivatedRoute) {       
  }

  ngOnInit() {

  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {
      this.router.navigate([this.routeAbsolutePath, event.row.id]);
    }
  }


  onFind(model) {
    this.querymodel.rules = model.rules;

    this.isLoading = true;
    //this.service.clearMessage();
    try {
      this.service.query(this.querymodel).subscribe((data) => {
        const to = this.resultMetadata[0].templateOptions;
        this.isLoading = false;
        this.model = {
          data: data.data
        }

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
    if (pageInfo.limit)
      this.querymodel['limit'] = pageInfo.limit;
    if (this.model.data.length > 0) {
      this.querymodel['page'] = pageInfo.offset + 1;
      this.onFind(this.querymodel);
    }
  }



}

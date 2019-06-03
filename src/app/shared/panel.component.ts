import { Component, OnChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Clients } from '../client/models/clientModel';


@Component({
  selector: 'pmt-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelComponent implements OnChanges {
  constructor(private _router:Router) { }

  @Input() allClients:Clients[];

  isExpanded:boolean = false;
  filteredClients:Clients[] = [];
  
  ngOnChanges(ch:any) {    
    this.filteredClients = this.allClients;        
  }

  toggleExpander() {
    this.isExpanded = !this.isExpanded;
  }

  filterClients(ev:any){
    this.filteredClients = this.allClients.filter(c => {
      return c.GeneralDetails.ClientName.toLowerCase()
        .lastIndexOf(ev.target.value.toLowerCase()) > -1;
    }).sort((a, b) => {
      var textA = a.GeneralDetails.ClientName.toUpperCase();
      var textB = b.GeneralDetails.ClientName.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }

  selectClient(client:Clients){
    if (client){
      this._router.navigate(['clients/' + client.GeneralDetails.ClientID]);
    }
    else {
      this._router.navigate(['clients/-1']);
    }
  }
}
import { Component, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HousingService } from '../../services/housing.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TuiCardLarge, TuiCardMedium, TuiCell, TuiHeader } from '@taiga-ui/layout';

import { TuiIcon, TuiSurface, TuiButton, TuiDialogService, TuiAlertService, TuiAppearance } from '@taiga-ui/core';
import { TUI_CONFIRM,type TuiConfirmData, TuiBadge, TuiTooltip, TuiLike } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';import { of, switchMap } from 'rxjs';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
@Component({
  selector: 'app-my-listings',
  imports: [
    CommonModule,
    TuiCardLarge,
    AsyncPipe,
    TuiCell,
    TuiIcon,
    TuiBadge,
    RouterLink,
    TuiCardMedium,
    TuiSurface,
    TuiButton,
    TuiAppearance,
    TuiLike
],
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.less'
})
export class MyListingsComponent{
  private readonly housingService=inject(HousingService)
  myListings$=this.housingService.getMyListing()
  private readonly dialogs = inject(TuiResponsiveDialogService);
  private readonly alerts = inject(TuiAlertService);

  @ViewChild('warningHeader') warningHeader!:TemplateRef<any>


    deleteListing(id:number): void {
        const data: TuiConfirmData = {
            content: 'Are you sure you want to delete this listing?',
            // appearance:'negative',
            yes: 'Yes, delete it',
            no: 'Cancel',
            appearance:'negative',
        };

        this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: this.warningHeader,
                size: 'auto',
                closeable:true,
                appearance:'warning',
                bar:true,
                data,
            })
            .subscribe((confirmed) => {
                if (confirmed) {
                    // user clicked Yes  call your delete API
                    this.housingService.deleteListing(id.toString())
                    .pipe(switchMap(() => this.housingService.getMyListing()))
                    .subscribe({
                        next: (listings) => {
                          this.myListings$ = of(listings),
                          this.alerts.open('Listing deleted successfully!',{
                          label:'Deleted',
                          icon:'@tui.circle-check',
                          appearance:'positive',
                        }).subscribe()}
                        ,
                        error: () =>
                          this.alerts.open('Failed to delete listing. Please try again',{
                            label:'Error',
                            icon:'@tui.ban',
                            appearance:'negative',
                          }).subscribe()
                    });
                } else {
                    // user clicked No  optional action
                    this.alerts.open('Deletion cancelled.',{
                      icon:'@tui.octagon-alert',
                      appearance:'warning',
                    }).subscribe();
                }
            });
    }
}


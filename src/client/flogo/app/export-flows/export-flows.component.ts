import { Component, Input, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ERROR_CODE, FlowSummary } from '@flogo/core';
import { AppDetailService } from '@flogo/app/core/apps.service';
import { NotificationsService } from '@flogo/core/notifications';

@Component({
  selector: 'flogo-export-flow',
  templateUrl: 'export-flows.component.html',
  styleUrls: ['export-flows.component.less']
})
export class FlogoExportFlowsComponent {
  @ViewChild('modal')
  modal: BsModalComponent;
  @Input()
  flows: Array<FlowSummary> = [];
  @Input()
  isLegacyExport = false;
  checkedFlows = [];
  checkAllFlows = [];

  constructor(
    private appDetailService: AppDetailService,
    private notificationsService: NotificationsService
  ) {
  }

  public openExport() {
    this.resetForm();
    this.modal.open();
    this.selectAllFlows();
  }

  public closeExport() {
    this.modal.close();
  }

  public selectAllFlows() {
    this.checkedFlows = [];
    this.checkAllFlows = [];
    this.flows.forEach((flow, index) => {
      this.checkAllFlows.push(index);
      this.checkedFlows.push(flow.id);
    });
  }
  public unselectAllFlows() {
    this.checkedFlows = [];
    this.checkAllFlows = [];
  }
  public flowSelect(flowId: string, isChecked: boolean, index) {
    if (isChecked) {
      this.checkedFlows.push(flowId);
      this.checkAllFlows.push(index);
    } else {
      const indexOfFlows = this.checkedFlows.indexOf(flowId);
      const indexOfIndices = this.checkAllFlows.indexOf(index);
      this.checkedFlows.splice(indexOfFlows, 1);
      this.checkAllFlows.splice(indexOfIndices, 1);
    }
  }

  public exportFlows() {
    let flowsToExport;
    if (this.checkedFlows.length === this.flows.length) {
      flowsToExport = [];
    } else {
      flowsToExport = this.checkedFlows;
    }
    return () => this.appDetailService.exportFlow(flowsToExport, this.isLegacyExport)
      .then(appWithFlows => {
        this.closeExport();
        return [{
          fileName: 'flows.json',
          data: appWithFlows
        }];
      }).catch(errRsp => {
        if (errRsp && errRsp.errors && errRsp.errors[0] && errRsp.errors[0].code === ERROR_CODE.HAS_SUBFLOW) {
          this.notificationsService.error({ key: 'DETAILS-EXPORT:CANNOT-EXPORT' });
        } else {
          console.error(errRsp.errors);
          this.notificationsService.error({ key: 'DETAILS-EXPORT:ERROR_UNKNOWN' });
        }
      });
  }

  private resetForm() {
    this.unselectAllFlows();
  }

}

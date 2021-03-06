import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { SharedModule as FlogoSharedModule } from '@flogo-web/lib-client/common';

import { MapperModule } from '../shared/mapper';
import { FlowsListModule } from '../shared/flows-list';
import { TaskConfiguratorComponent } from './task-configurator.component';
import { IteratorComponent } from './iterator/iterator.component';
import { SubFlowComponent } from './subflow/subflow.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    // module dependencies
    NgCommonModule,
    FlogoSharedModule,
    MapperModule,
    FlowsListModule,
  ],
  declarations: [
    IteratorComponent,
    SubFlowComponent,
    TaskConfiguratorComponent,
    SettingsComponent,
  ],
  exports: [TaskConfiguratorComponent],
  providers: [],
})
export class TaskMapperModule {}

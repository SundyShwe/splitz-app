import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GroupListComponent } from './components/group-list/group-list.component';
import { GroupCreateComponent } from './components/group-create/group-create.component';
import { GroupUpdateComponent } from './components/group-update/group-update.component';
import { GroupReportComponent } from './components/group-report/group-report.component';
import { GroupAddMemberComponent } from './components/group-add-member/group-add-member.component';

@NgModule({
  declarations: [
    GroupListComponent,
    GroupCreateComponent,
    GroupUpdateComponent,
    GroupReportComponent,
    GroupAddMemberComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: GroupListComponent, title: 'Group List' },
      {
        path: 'create',
        component: GroupCreateComponent,
        title: 'Create Group',
      },
      {
        path: ':group_id',
        component: GroupUpdateComponent,
        title: 'Update Group',
      },
      {
        path: ':group_id/members',
        component: GroupAddMemberComponent,
        title: 'Add Members to Group',
      },
      {
        path: ':group_id/report',
        component: GroupReportComponent,
        title: 'Expense Report',
      },
      {
        path: ':group_id/bills',
        loadChildren: () =>
          import('../bill/bill.module').then((m) => m.BillModule),
      },
    ]),
  ],
})
export class GroupModule {}

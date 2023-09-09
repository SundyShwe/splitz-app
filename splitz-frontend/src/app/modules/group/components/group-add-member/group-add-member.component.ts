import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/group';

@Component({
  selector: 'app-group-add-member',
  templateUrl: './group-add-member.component.html',
  styleUrls: ['./group-add-member.component.css'],
})
export class GroupAddMemberComponent {
  private groupsService = inject(GroupService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private getSubscription!: Subscription;
  private subscription!: Subscription;
  private notification = inject(ToastrService);

  group_id = '';
  group!: Group;

  myForm = inject(FormBuilder).nonNullable.group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });
  get fullname() {
    return this.myForm.get('fullname') as FormControl;
  }
  get email() {
    return this.myForm.get('email') as FormControl;
  }

  ngOnInit() {
    this.group_id = this.activeRoute.snapshot.paramMap.get(
      'group_id'
    ) as string;
    this.getSubscription = this.groupsService
      .getGroupInfo(this.group_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.group = resp.data;
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });
  }

  onSave() {
    const new_member = {
      group_id: this.group_id,
      fullname: this.fullname.value,
      email: this.email.value,
    };

    this.subscription = this.groupsService
      .addMemberToGroup(new_member)
      .subscribe((resp) => {
        if (resp.success) {
          this.notification.success('New member added to ' + this.group.name);
          this.goToList();
        } else {
          this.notification.error(resp.data);
        }
      });
  }
  goToList() {
    this.router.navigate(['', 'groups']);
  }
  ngOnDestory() {
    if (this.getSubscription) this.getSubscription.unsubscribe();
    if (this.subscription) this.subscription.unsubscribe();
  }
}

import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/group';

@Component({
  selector: 'app-group-update',
  templateUrl: './group-update.component.html',
  styleUrls: ['./group-update.component.css'],
})
export class GroupUpdateComponent {
  private groupsService = inject(GroupService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private subscription!: Subscription;
  private removeSubscription!: Subscription;
  private notification = inject(ToastrService);
  group_id = '';
  group!: Group;

  //Form
  myForm = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    category: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });
  get name() {
    return this.myForm.get('name') as FormControl;
  }
  get description() {
    return this.myForm.get('description') as FormControl;
  }
  get category() {
    return this.myForm.get('category') as FormControl;
  }
  get date() {
    return this.myForm.get('date') as FormControl;
  }

  ngOnInit() {
    this.group_id = this.activeRoute.snapshot.paramMap.get(
      'group_id'
    ) as string;
    this.subscription = this.groupsService
      .getGroupInfo(this.group_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.group = resp.data;
          //set form value
          this.myForm.get('name')?.setValue(this.group.name);
          this.myForm.get('description')?.setValue(this.group.description);
          this.myForm.get('category')?.setValue(this.group.category);
          this.myForm
            .get('date')
            ?.setValue(new Date(this.group.date).toISOString().substr(0, 10));
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });

    //set form value
  }

  //save group
  onSave() {
    const timestamp = new Date(this.date.value).getTime() + 3600 * 1000 * 24;

    const form_data = new FormData();
    form_data.append('name', this.name.value);
    form_data.append('description', this.description.value);
    form_data.append('category', this.category.value);
    form_data.append('date', timestamp + '');

    const data = {
      group_id: this.group_id,
      group: {
        name: this.name.value,
        description: this.description.value,
        category: this.category.value,
        date: timestamp,
      },
    };

    this.subscription = this.groupsService
      .updateGroup(data)
      .subscribe((resp) => {
        if (resp.success) {
          this.notification.success('New Group Added!');
          this.goToList();
        } else {
          this.notification.error(resp.data);
        }
      });
  }

  goToList() {
    this.router.navigate(['', 'groups']);
  }

  addMember(group_id: string) {
    this.router.navigate(['', 'groups', group_id, 'members']);
  }
  viewBills(group_id: string) {
    this.router.navigate(['', 'groups', group_id, 'bills']);
  }
  removeMember(member_id: string) {
    const data = { group_id: this.group_id, member_id: member_id };
    this.removeSubscription = this.groupsService
      .removeMember(data)
      .subscribe((resp) => {
        if (resp.success) {
          this.notification.success('Member removed from the group');

          this.group.members = this.group.members.filter(
            (m) => m.user_id !== member_id
          );
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.removeSubscription) this.removeSubscription.unsubscribe();
  }
}

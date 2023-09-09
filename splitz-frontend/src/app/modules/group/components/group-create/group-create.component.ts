import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { GroupInfo } from '../../interfaces/group';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css'],
})
export class GroupCreateComponent {
  private groupsService = inject(GroupService);
  private router = inject(Router);
  private subscription!: Subscription;
  private notification = inject(ToastrService);

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

  //save group
  onSave() {
    const timestamp = new Date(this.date.value).getTime() + 3600 * 1000 * 24;
    console.log('Group Name : ' + this.name.value);

    const form_data = new FormData();
    form_data.append('name', this.name.value);
    form_data.append('description', this.description.value);
    form_data.append('category', this.category.value);
    form_data.append('date', timestamp + '');

    const group: GroupInfo = {
      name: this.name.value,
      description: this.description.value,
      category: this.category.value,
      date: timestamp,
    };

    console.log(`before calling servie : ${group}`);

    this.subscription = this.groupsService
      .createGroup(group as GroupInfo)
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

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

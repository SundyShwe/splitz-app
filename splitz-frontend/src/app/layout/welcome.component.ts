import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <h2><small>Less stress when sharing expenses</small></h2>
    <div class="card mb-3">
      <div class="card-header">Create a shared group</div>
      <div class="card-body">
        <h5 class="card-title">Group with your friends</h5>
        <p class="card-text">
          Split expenses with any group: trips, housemates, friends, and family.
        </p>
      </div>
    </div>
    <div class="card mb-3">
      <div class="card-header">Track Expenses</div>
      <div class="card-body">
        <h5 class="card-title">Records your shared expenses</h5>
        <p class="card-text">
          Quickly add expenses before you forget who paid.
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-header">View Split Balance</div>
      <div class="card-body">
        <h5 class="card-title">Easy overview between group members</h5>
        <p class="card-text">
          Balance Report of total expenses and who owe how much.
        </p>
      </div>
    </div>
  `,
  styles: [],
})
export class WelcomeComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header />
    <div class="container bg-white p-1 min-vh-90">
      <router-outlet />
    </div>

    <app-footer />
  `,
  styles: [],
})
export class AppComponent {
  title = 'FrontEnd';
}

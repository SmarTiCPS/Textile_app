import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding">
      <a href="/">
        <img
          src="./assets/images/backgrounds/rocket.png"
          class="align-middle m-0"
          alt="logo" style="/* width:-webkit-fill-available; */"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}

import {
	Component
} from '@angular/core';

import {
	HeroesComponent
} from './heroes.component';

@Component({
	selector: 'my-app',
	template: `
	<h1>{{title}}</h1>
	<nav>
	<a routerLink="/dashboard">Dashboard</a>
	<a routerLink="/heroes">Heroes</a>
	</nav>
	<router-outlet></router-outlet>
	`
		//<my-heroes></my-heroes>
})

export class AppComponent {
	title = "Tour of Heroes";
}
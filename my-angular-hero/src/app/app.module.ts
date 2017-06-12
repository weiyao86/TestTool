//https://angular.cn/docs/ts/latest/tutorial/toh-pt5.html
import {
	BrowserModule
} from '@angular/platform-browser';
import {
	NgModule
} from '@angular/core';

import {
	FormsModule
} from '@angular/forms';

import {
	AppComponent
} from './app.component';

import {
	HeroDetailComponent
} from './hero-detail.component';

import {
	DashBoardComponent
} from './dashboard.component';

import {
	HeroesComponent
} from './heroes.component';

import {
	HeroService
} from './hero.service';

//配置路由
import {
	AppRoutingModule
} from './app-routing.module';


@NgModule({
	declarations: [
		AppComponent,
		HeroDetailComponent,
		HeroesComponent,
		DashBoardComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule
	],
	providers: [HeroService],
	bootstrap: [AppComponent]
})

export class AppModule {}
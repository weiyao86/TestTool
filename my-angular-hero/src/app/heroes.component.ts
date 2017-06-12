import {
	Component
} from '@angular/core';

import {
	OnInit
} from '@angular/core';

import {
	Hero
} from './hero';
import {
	HeroService
} from './hero.service';


@Component({
	//selector: "my-heroes",
	templateUrl: './app.hero.html',
	styleUrls: ['styles.css']
})



export class HeroesComponent {
	heroes: Hero[];
	selectedHero: Hero;
	constructor(public heroService: HeroService) {
		//this.heroes = this.heroService.getHeroes();
	}

	//事件注册
	onSelect(hero: Hero): void {
		this.selectedHero = hero;
	}

	getHeroes(): void {
		//延时3s
		// this.heroService.getHeroesSlowly().then(heroes => this.heroes = heroes);
		//正常加载
		this.heroService.getHeroes().then(heroes => this.heroes = heroes);
	}

	ngOnInit(): void {
		console.log('ngOnInit 生命周期钩子')
		this.getHeroes();
	}
}
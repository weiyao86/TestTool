import {
	Component,
	Input,
	OnInit
} from '@angular/core';

import {
	ActivatedRoute,
	Params
} from '@angular/router';

import {
	Location
} from '@angular/common';

import {
	HeroService
} from './hero.service';

import {
	Hero
} from './hero';

import 'rxjs/add/operator/switchmap';

@Component({
	selector: 'hero-detail',
	templateUrl: './hero-detail.html'
})

export class HeroDetailComponent implements OnInit {
	@Input() hero: Hero;

	constructor(
		private heroService: HeroService,
		private route: ActivatedRoute,
		private location: Location
	) {}

	goBack(): void {
		this.location.back();
	}

	ngOnInit(): void {
		this.route.params.switchMap((params: Params) => this.heroService.getHero(+params['id'])).subscribe(hero => this.hero = hero);
	}
}
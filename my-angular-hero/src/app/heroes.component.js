var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@angular/core", "./hero.service", "@angular/router"], function (require, exports, core_1, hero_service_1, router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeroesComponent = (function () {
        function HeroesComponent(heroService, router) {
            this.heroService = heroService;
            this.router = router;
            //this.heroes = this.heroService.getHeroes();
        }
        //事件注册
        HeroesComponent.prototype.onSelect = function (hero) {
            this.selectedHero = hero;
        };
        HeroesComponent.prototype.getHeroes = function () {
            var _this = this;
            //延时3s
            // this.heroService.getHeroesSlowly().then(heroes => this.heroes = heroes);
            //正常加载
            this.heroService.getHeroes().then(function (heroes) { return _this.heroes = heroes; });
        };
        HeroesComponent.prototype.gotoDetail = function () {
            this.router.navigate(['/detail', this.selectedHero.id]);
        };
        HeroesComponent.prototype.add = function (name) {
            var _this = this;
            name = name.trim();
            if (!name)
                return;
            this.heroService.create(name).then(function (hero) {
                _this.heroes.push(hero);
                _this.selectedHero = null;
            });
        };
        HeroesComponent.prototype.delete = function (hero) {
            var _this = this;
            if (confirm("确认删除当前数据")) {
                this.heroService.delete(hero.id).then(function () {
                    _this.heroes = _this.heroes.filter(function (h) { return h !== hero; });
                    if (_this.selectedHero == hero) {
                        _this.selectedHero = null;
                    }
                });
            }
        };
        HeroesComponent.prototype.ngOnInit = function () {
            console.log('ngOnInit 生命周期钩子');
            this.getHeroes();
        };
        return HeroesComponent;
    }());
    HeroesComponent = __decorate([
        core_1.Component({
            //selector: "my-heroes",
            templateUrl: './app.hero.html',
            styleUrls: ['./heroes.component.css']
        }),
        __metadata("design:paramtypes", [hero_service_1.HeroService, router_1.Router])
    ], HeroesComponent);
    exports.HeroesComponent = HeroesComponent;
});

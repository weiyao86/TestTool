var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@angular/core", "@angular/router", "rxjs/Observable", "rxjs/Subject", "./hero-search.service", "rxjs/add/observable/of", "rxjs/add/operator/catch", "rxjs/add/operator/debounceTime", "rxjs/add/operator/distinctUntilChanged"], function (require, exports, core_1, router_1, Observable_1, Subject_1, hero_search_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeroSearchComponent = (function () {
        function HeroSearchComponent(heroSearchService, router) {
            this.heroSearchService = heroSearchService;
            this.router = router;
            this.searchTerms = new Subject_1.Subject();
        }
        HeroSearchComponent.prototype.search = function (term) {
            this.searchTerms
                .next(term);
        };
        HeroSearchComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.heroes = this.searchTerms
                .debounceTime(300)
                .distinctUntilChanged()
                .switchMap(function (term) { return term ? _this.heroSearchService.search(term) : Observable_1.Observable.of([]); })
                .catch(function (error) {
                console.log(error);
                return Observable_1.Observable.of([]);
            });
        };
        HeroSearchComponent.prototype.gotoDetail = function (hero) {
            var link = ['/detail', hero.id];
            this.router.navigate(link);
        };
        return HeroSearchComponent;
    }());
    HeroSearchComponent = __decorate([
        core_1.Component({
            selector: 'hero-search',
            templateUrl: './hero-search.component.html',
            styleUrls: ['./hero-search.component.css'],
            providers: [hero_search_service_1.HeroSearchService]
        }),
        __metadata("design:paramtypes", [hero_search_service_1.HeroSearchService,
            router_1.Router])
    ], HeroSearchComponent);
    exports.HeroSearchComponent = HeroSearchComponent;
});

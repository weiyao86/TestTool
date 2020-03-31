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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVyby1zZWFyY2guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL2hlcm8tc2VhcmNoLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUErQkEsSUFBYSxtQkFBbUI7UUFJL0IsNkJBQ1MsaUJBQW9DLEVBQ3BDLE1BQWM7WUFEZCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1lBQ3BDLFdBQU0sR0FBTixNQUFNLENBQVE7WUFKZixnQkFBVyxHQUFHLElBQUksaUJBQU8sRUFBYyxDQUFDO1FBSzdDLENBQUM7UUFFSixvQ0FBTSxHQUFOLFVBQU8sSUFBWTtZQUNsQixJQUFJLENBQUMsV0FBVztpQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZCxDQUFDO1FBRUEsc0NBQVEsR0FBUjtZQUFBLGlCQVNBO1lBUkEsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVztpQkFDNUIsWUFBWSxDQUFDLEdBQUcsQ0FBQztpQkFDakIsb0JBQW9CLEVBQUU7aUJBQ3RCLFNBQVMsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLHVCQUFVLENBQUMsRUFBRSxDQUFhLEVBQUUsQ0FBQyxFQUExRSxDQUEwRSxDQUFDO2lCQUM3RixLQUFLLENBQUMsVUFBQSxLQUFLO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLEVBQUUsQ0FBYSxFQUFFLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFQSx3Q0FBVSxHQUFWLFVBQVcsSUFBVTtZQUNyQixJQUFJLElBQUksR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUNGLDBCQUFDO0lBQUQsQ0FBQyxBQTdCRCxJQTZCQztJQTdCWSxtQkFBbUI7UUFQL0IsZ0JBQVMsQ0FBQztZQUNWLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsU0FBUyxFQUFFLENBQUMsNkJBQTZCLENBQUM7WUFDMUMsU0FBUyxFQUFFLENBQUMsdUNBQWlCLENBQUM7U0FDOUIsQ0FBQzt5Q0FPMkIsdUNBQWlCO1lBQzVCLGVBQU07T0FOWCxtQkFBbUIsQ0E2Qi9CO0lBN0JZLGtEQUFtQiJ9
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@angular/core", "@angular/router", "@angular/common", "./hero.service", "./hero", "rxjs/add/operator/switchmap"], function (require, exports, core_1, router_1, common_1, hero_service_1, hero_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeroDetailComponent = (function () {
        function HeroDetailComponent(heroService, route, location) {
            this.heroService = heroService;
            this.route = route;
            this.location = location;
        }
        HeroDetailComponent.prototype.goBack = function () {
            this.location.back();
        };
        HeroDetailComponent.prototype.save = function () {
            var _this = this;
            this.heroService.update(this.hero).then(function () { return _this.goBack(); });
        };
        HeroDetailComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.route.params.switchMap(function (params) { return _this.heroService.getHero(+params['id']); }).subscribe(function (hero) { return _this.hero = hero; });
        };
        return HeroDetailComponent;
    }());
    __decorate([
        core_1.Input(),
        __metadata("design:type", hero_1.Hero)
    ], HeroDetailComponent.prototype, "hero", void 0);
    HeroDetailComponent = __decorate([
        core_1.Component({
            selector: 'hero-detail',
            templateUrl: './hero-detail.html'
        }),
        __metadata("design:paramtypes", [hero_service_1.HeroService,
            router_1.ActivatedRoute,
            common_1.Location])
    ], HeroDetailComponent);
    exports.HeroDetailComponent = HeroDetailComponent;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVyby1kZXRhaWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL2hlcm8tZGV0YWlsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUE4QkEsSUFBYSxtQkFBbUI7UUFHL0IsNkJBQ1MsV0FBd0IsRUFDeEIsS0FBcUIsRUFDckIsUUFBa0I7WUFGbEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7WUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7WUFDckIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN4QixDQUFDO1FBRUosb0NBQU0sR0FBTjtZQUNDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsQ0FBQztRQUVELGtDQUFJLEdBQUo7WUFBQSxpQkFFQztZQURBLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLEVBQUUsRUFBYixDQUFhLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRUQsc0NBQVEsR0FBUjtZQUFBLGlCQUVDO1lBREEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBYyxJQUFLLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUFoQixDQUFnQixDQUFDLENBQUM7UUFDOUgsQ0FBQztRQUNGLDBCQUFDO0lBQUQsQ0FBQyxBQXBCRCxJQW9CQztJQW5CUztRQUFSLFlBQUssRUFBRTtrQ0FBTyxXQUFJO3FEQUFDO0lBRFIsbUJBQW1CO1FBTC9CLGdCQUFTLENBQUM7WUFDVixRQUFRLEVBQUUsYUFBYTtZQUN2QixXQUFXLEVBQUUsb0JBQW9CO1NBQ2pDLENBQUM7eUNBTXFCLDBCQUFXO1lBQ2pCLHVCQUFjO1lBQ1gsaUJBQVE7T0FOZixtQkFBbUIsQ0FvQi9CO0lBcEJZLGtEQUFtQiJ9
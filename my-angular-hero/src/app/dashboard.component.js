var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@angular/core", "./hero.service"], function (require, exports, core_1, hero_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DashBoardComponent = (function () {
        function DashBoardComponent(heroService) {
            this.heroService = heroService;
            this.heroes = [];
        }
        ;
        DashBoardComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.heroService.getHeroes().then(function (heroes) { return _this.heroes = heroes.slice(1, 5); });
        };
        return DashBoardComponent;
    }());
    DashBoardComponent = __decorate([
        core_1.Component({
            selector: 'my-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.css']
        }),
        __metadata("design:paramtypes", [hero_service_1.HeroService])
    ], DashBoardComponent);
    exports.DashBoardComponent = DashBoardComponent;
});

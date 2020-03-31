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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9kYXNoYm9hcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQW1CQSxJQUFhLGtCQUFrQjtRQUc5Qiw0QkFBb0IsV0FBd0I7WUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7WUFGNUMsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUUyQixDQUFDO1FBQUEsQ0FBQztRQUVqRCxxQ0FBUSxHQUFSO1lBQUEsaUJBRUM7WUFEQSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQztRQUMvRSxDQUFDO1FBQ0YseUJBQUM7SUFBRCxDQUFDLEFBUkQsSUFRQztJQVJZLGtCQUFrQjtRQU45QixnQkFBUyxDQUFDO1lBQ1YsUUFBUSxFQUFFLGNBQWM7WUFDeEIsV0FBVyxFQUFFLDRCQUE0QjtZQUN6QyxTQUFTLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztTQUN4QyxDQUFDO3lDQUtnQywwQkFBVztPQUhoQyxrQkFBa0IsQ0FROUI7SUFSWSxnREFBa0IifQ==
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVyb2VzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9oZXJvZXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQTJCQSxJQUFhLGVBQWU7UUFHM0IseUJBQW1CLFdBQXdCLEVBQVUsTUFBYztZQUFoRCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtZQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7WUFDbEUsNkNBQTZDO1FBQzlDLENBQUM7UUFFRCxNQUFNO1FBQ04sa0NBQVEsR0FBUixVQUFTLElBQVU7WUFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDMUIsQ0FBQztRQUVELG1DQUFTLEdBQVQ7WUFBQSxpQkFLQztZQUpBLE1BQU07WUFDTiwyRUFBMkU7WUFDM0UsTUFBTTtZQUNOLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQXBCLENBQW9CLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBRUQsb0NBQVUsR0FBVjtZQUNDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQsNkJBQUcsR0FBSCxVQUFJLElBQVk7WUFBaEIsaUJBT0M7WUFOQSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUN0QyxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsS0FBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRUQsZ0NBQU0sR0FBTixVQUFPLElBQVU7WUFBakIsaUJBU0M7WUFSQSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUNyQyxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLElBQUksRUFBVixDQUFVLENBQUMsQ0FBQztvQkFDbEQsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUMvQixLQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztvQkFDMUIsQ0FBQztnQkFDRixDQUFDLENBQUMsQ0FBQztZQUNKLENBQUM7UUFDRixDQUFDO1FBRUQsa0NBQVEsR0FBUjtZQUNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUM5QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUNGLHNCQUFDO0lBQUQsQ0FBQyxBQS9DRCxJQStDQztJQS9DWSxlQUFlO1FBUjNCLGdCQUFTLENBQUM7WUFDVix3QkFBd0I7WUFDeEIsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixTQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztTQUNyQyxDQUFDO3lDQU8rQiwwQkFBVyxFQUFrQixlQUFNO09BSHZELGVBQWUsQ0ErQzNCO0lBL0NZLDBDQUFlIn0=
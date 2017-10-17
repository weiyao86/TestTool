var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@angular/core", "./dashboard.component", "./heroes.component", "./hero-detail.component", "@angular/router"], function (require, exports, core_1, dashboard_component_1, heroes_component_1, hero_detail_component_1, router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var routes = [{
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
        }, {
            path: 'heroes',
            component: heroes_component_1.HeroesComponent
        }, {
            path: 'detail/:id',
            component: hero_detail_component_1.HeroDetailComponent
        }, {
            path: 'dashboard',
            component: dashboard_component_1.DashBoardComponent
        }];
    var AppRoutingModule = (function () {
        function AppRoutingModule() {
        }
        return AppRoutingModule;
    }());
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot(routes)
            ],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    exports.AppRoutingModule = AppRoutingModule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXJvdXRpbmcubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL2FwcC1yb3V0aW5nLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUF1QkEsSUFBTSxNQUFNLEdBQVcsQ0FBQztZQUN2QixJQUFJLEVBQUUsRUFBRTtZQUNSLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLFNBQVMsRUFBRSxNQUFNO1NBQ2pCLEVBQUU7WUFDRixJQUFJLEVBQUUsUUFBUTtZQUNkLFNBQVMsRUFBRSxrQ0FBZTtTQUMxQixFQUFFO1lBQ0YsSUFBSSxFQUFFLFlBQVk7WUFDbEIsU0FBUyxFQUFFLDJDQUFtQjtTQUM5QixFQUFFO1lBQ0YsSUFBSSxFQUFFLFdBQVc7WUFDakIsU0FBUyxFQUFFLHdDQUFrQjtTQUM3QixDQUFDLENBQUE7SUFTRixJQUFhLGdCQUFnQjtRQUE3QjtRQUErQixDQUFDO1FBQUQsdUJBQUM7SUFBRCxDQUFDLEFBQWhDLElBQWdDO0lBQW5CLGdCQUFnQjtRQVA1QixlQUFRLENBQUM7WUFDVCxPQUFPLEVBQUU7Z0JBQ1IscUJBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQzVCO1lBQ0QsT0FBTyxFQUFFLENBQUMscUJBQVksQ0FBQztTQUN2QixDQUFDO09BRVcsZ0JBQWdCLENBQUc7SUFBbkIsNENBQWdCIn0=
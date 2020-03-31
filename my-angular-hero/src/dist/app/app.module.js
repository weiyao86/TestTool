var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@angular/platform-browser", "@angular/core", "@angular/forms", "./app.component", "./hero-detail.component", "./dashboard.component", "./heroes.component", "./hero.service", "./hero-search.component", "@angular/http", "angular-in-memory-web-api", "./in-memory-data.service", "./app-routing.module"], function (require, exports, platform_browser_1, core_1, forms_1, app_component_1, hero_detail_component_1, dashboard_component_1, heroes_component_1, hero_service_1, hero_search_component_1, http_1, angular_in_memory_web_api_1, in_memory_data_service_1, app_routing_module_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppModule = (function () {
        function AppModule() {
        }
        return AppModule;
    }());
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                hero_detail_component_1.HeroDetailComponent,
                heroes_component_1.HeroesComponent,
                dashboard_component_1.DashBoardComponent,
                hero_search_component_1.HeroSearchComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpModule,
                angular_in_memory_web_api_1.InMemoryWebApiModule.forRoot(in_memory_data_service_1.InMemoryDataService)
            ],
            providers: [hero_service_1.HeroService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    exports.AppModule = AppModule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9hcHAubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQTJFQSxJQUFhLFNBQVM7UUFBdEI7UUFBd0IsQ0FBQztRQUFELGdCQUFDO0lBQUQsQ0FBQyxBQUF6QixJQUF5QjtJQUFaLFNBQVM7UUFuQnJCLGVBQVEsQ0FBQztZQUNULFlBQVksRUFBRTtnQkFDYiw0QkFBWTtnQkFDWiwyQ0FBbUI7Z0JBQ25CLGtDQUFlO2dCQUNmLHdDQUFrQjtnQkFDbEIsMkNBQW1CO2FBQ25CO1lBQ0QsT0FBTyxFQUFFO2dCQUNSLGdDQUFhO2dCQUNiLG1CQUFXO2dCQUNYLHFDQUFnQjtnQkFDaEIsaUJBQVU7Z0JBQ1YsZ0RBQW9CLENBQUMsT0FBTyxDQUFDLDRDQUFtQixDQUFDO2FBQ2pEO1lBQ0QsU0FBUyxFQUFFLENBQUMsMEJBQVcsQ0FBQztZQUN4QixTQUFTLEVBQUUsQ0FBQyw0QkFBWSxDQUFDO1NBQ3pCLENBQUM7T0FFVyxTQUFTLENBQUc7SUFBWiw4QkFBUyJ9
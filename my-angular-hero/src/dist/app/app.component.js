var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@angular/core"], function (require, exports, core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppComponent = (function () {
        function AppComponent() {
            this.title = "Tour of Heroes";
        }
        AppComponent.prototype.check = function () {
            console.log('abc');
        };
        return AppComponent;
    }());
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n\t<h1>{{title}}</h1>\n\t<nav>\n\t<a routerLink=\"/dashboard\">Dashboard</a>\n\t<a routerLink=\"/heroes\">Heroes</a>\n\t</nav>\n\t<router-outlet></router-outlet>\n\t"
            //<my-heroes></my-heroes>
        })
    ], AppComponent);
    exports.AppComponent = AppComponent;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9hcHAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQXFCQSxJQUFhLFlBQVk7UUFiekI7WUFjQyxVQUFLLEdBQUcsZ0JBQWdCLENBQUM7UUFLMUIsQ0FBQztRQUhBLDRCQUFLLEdBQUw7WUFDQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BCLENBQUM7UUFDRixtQkFBQztJQUFELENBQUMsQUFORCxJQU1DO0lBTlksWUFBWTtRQWJ4QixnQkFBUyxDQUFDO1lBQ1YsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFBUSxFQUFFLHdLQU9UO1lBQ0EseUJBQXlCO1NBQzFCLENBQUM7T0FFVyxZQUFZLENBTXhCO0lBTlksb0NBQVkifQ==
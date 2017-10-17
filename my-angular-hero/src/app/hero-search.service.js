var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@angular/core", "@angular/http", "rxjs/add/operator/map"], function (require, exports, core_1, http_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeroSearchService = (function () {
        function HeroSearchService(http) {
            this.http = http;
        }
        HeroSearchService.prototype.search = function (term) {
            return this.http
                .get("app/heroes/?name=" + term)
                .map(function (response) { return response.json().data; });
        };
        HeroSearchService.prototype.check = function (id) {
            console.log('check');
        };
        return HeroSearchService;
    }());
    HeroSearchService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], HeroSearchService);
    exports.HeroSearchService = HeroSearchService;
});

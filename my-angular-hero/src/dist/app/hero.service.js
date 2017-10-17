var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@angular/core", "@angular/http", "rxjs/add/operator/toPromise"], function (require, exports, core_1, http_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeroService = (function () {
        function HeroService(http) {
            this.http = http;
            this.heroesUrl = 'api/heroes';
            this.headers = new http_1.Headers({
                'Content-Type': 'application/json'
            });
        }
        HeroService.prototype.getHeroes = function () {
            console.log('getHeroes for http');
            return this.http.get(this.heroesUrl).toPromise().then(function (response) { return response.json().data; }).catch(this.handleError);
        };
        HeroService.prototype.getHeroesSlowly = function () {
            var _this = this;
            return new Promise(function (resolve) {
                setTimeout(function () { return resolve(_this.getHeroes()); }, 3 * 1000);
            });
        };
        HeroService.prototype.getHero = function (id) {
            var url = this.heroesUrl + "/" + id;
            return this.http.get(url).toPromise().then(function (response) {
                return response.json().data;
                //return response => response.json().data as Hero
            }).catch(this.handleError);
            //return this.getHeroes().then(heroes => heroes.find(hero => hero.id == id));
        };
        HeroService.prototype.update = function (hero) {
            var url = this.heroesUrl + "/" + hero.id;
            ;
            return this.http
                .put(url, JSON.stringify(hero), {
                headers: this.headers
            })
                .toPromise().then(function () { return hero; }).catch(this.handleError);
        };
        HeroService.prototype.create = function (name) {
            return this.http
                .post(this.heroesUrl, JSON.stringify({
                name: name
            }), {
                headers: this.headers
            })
                .toPromise().then(function (res) { return res.json().data; }).catch(this.handleError);
        };
        HeroService.prototype.delete = function (id) {
            var url = this.heroesUrl + "/" + id;
            return this.http
                .delete(url, {
                headers: this.headers
            })
                .toPromise()
                .then(function () { return null; }).catch(this.handleError);
        };
        HeroService.prototype.handleError = function (error) {
            console.error('An error occurred', error);
            return Promise.reject(error.message || error);
        };
        return HeroService;
    }());
    HeroService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], HeroService);
    exports.HeroService = HeroService;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVyby5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL2hlcm8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFpQkEsSUFBYSxXQUFXO1FBTXZCLHFCQUFvQixJQUFVO1lBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtZQUx0QixjQUFTLEdBQUcsWUFBWSxDQUFDO1lBQ3pCLFlBQU8sR0FBRyxJQUFJLGNBQU8sQ0FBQztnQkFDN0IsY0FBYyxFQUFFLGtCQUFrQjthQUNsQyxDQUFDLENBQUM7UUFFOEIsQ0FBQztRQUVsQywrQkFBUyxHQUFUO1lBQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQWMsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0gsQ0FBQztRQUVELHFDQUFlLEdBQWY7WUFBQSxpQkFJQztZQUhBLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFBLE9BQU87Z0JBQ3pCLFVBQVUsQ0FBQyxjQUFNLE9BQUEsT0FBTyxDQUFDLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUF6QixDQUF5QixFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQztRQUNKLENBQUM7UUFFRCw2QkFBTyxHQUFQLFVBQVEsRUFBVTtZQUNqQixJQUFNLEdBQUcsR0FBTSxJQUFJLENBQUMsU0FBUyxTQUFJLEVBQUksQ0FBQztZQUV0QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsUUFBUTtnQkFFM0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFZLENBQUM7Z0JBQ3BDLGlEQUFpRDtZQUNsRCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNCLDZFQUE2RTtRQUM5RSxDQUFDO1FBRUQsNEJBQU0sR0FBTixVQUFPLElBQVU7WUFDaEIsSUFBTSxHQUFHLEdBQU0sSUFBSSxDQUFDLFNBQVMsU0FBSSxJQUFJLENBQUMsRUFBSSxDQUFDO1lBQUEsQ0FBQztZQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUk7aUJBQ2QsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMvQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDckIsQ0FBQztpQkFDRCxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXhELENBQUM7UUFFRCw0QkFBTSxHQUFOLFVBQU8sSUFBWTtZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUk7aUJBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLElBQUk7YUFDVixDQUFDLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3JCLENBQUM7aUJBQ0QsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLElBQVksRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUUsQ0FBQztRQUVELDRCQUFNLEdBQU4sVUFBTyxFQUFVO1lBQ2hCLElBQU0sR0FBRyxHQUFNLElBQUksQ0FBQyxTQUFTLFNBQUksRUFBSSxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSTtpQkFDZCxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNaLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTzthQUNyQixDQUFDO2lCQUNELFNBQVMsRUFBRTtpQkFDWCxJQUFJLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFFTyxpQ0FBVyxHQUFuQixVQUFvQixLQUFVO1lBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQ0Ysa0JBQUM7SUFBRCxDQUFDLEFBaEVELElBZ0VDO0lBaEVZLFdBQVc7UUFEdkIsaUJBQVUsRUFBRTt5Q0FPYyxXQUFJO09BTmxCLFdBQVcsQ0FnRXZCO0lBaEVZLGtDQUFXIn0=
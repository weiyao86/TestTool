define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InMemoryDataService = (function () {
        function InMemoryDataService() {
        }
        InMemoryDataService.prototype.createDb = function () {
            var heroes = [{
                    id: 11,
                    name: 'Mr. Nice'
                }, {
                    id: 12,
                    name: 'Narco'
                }, {
                    id: 13,
                    name: 'Bombasto'
                }, {
                    id: 14,
                    name: 'Celeritas'
                }, {
                    id: 15,
                    name: 'Magneta'
                }, {
                    id: 16,
                    name: 'RubberMan'
                }, {
                    id: 17,
                    name: 'Dynama'
                }, {
                    id: 18,
                    name: 'Dr IQ'
                }, {
                    id: 19,
                    name: 'Magma'
                }, {
                    id: 220,
                    name: 'Tornado'
                }];
            return {
                heroes: heroes
            };
        };
        return InMemoryDataService;
    }());
    exports.InMemoryDataService = InMemoryDataService;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW4tbWVtb3J5LWRhdGEuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9pbi1tZW1vcnktZGF0YS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUlBO1FBQUE7UUFxQ0EsQ0FBQztRQXBDQSxzQ0FBUSxHQUFSO1lBQ0MsSUFBSSxNQUFNLEdBQUcsQ0FBQztvQkFDYixFQUFFLEVBQUUsRUFBRTtvQkFDTixJQUFJLEVBQUUsVUFBVTtpQkFDaEIsRUFBRTtvQkFDRixFQUFFLEVBQUUsRUFBRTtvQkFDTixJQUFJLEVBQUUsT0FBTztpQkFDYixFQUFFO29CQUNGLEVBQUUsRUFBRSxFQUFFO29CQUNOLElBQUksRUFBRSxVQUFVO2lCQUNoQixFQUFFO29CQUNGLEVBQUUsRUFBRSxFQUFFO29CQUNOLElBQUksRUFBRSxXQUFXO2lCQUNqQixFQUFFO29CQUNGLEVBQUUsRUFBRSxFQUFFO29CQUNOLElBQUksRUFBRSxTQUFTO2lCQUNmLEVBQUU7b0JBQ0YsRUFBRSxFQUFFLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFdBQVc7aUJBQ2pCLEVBQUU7b0JBQ0YsRUFBRSxFQUFFLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFFBQVE7aUJBQ2QsRUFBRTtvQkFDRixFQUFFLEVBQUUsRUFBRTtvQkFDTixJQUFJLEVBQUUsT0FBTztpQkFDYixFQUFFO29CQUNGLEVBQUUsRUFBRSxFQUFFO29CQUNOLElBQUksRUFBRSxPQUFPO2lCQUNiLEVBQUU7b0JBQ0YsRUFBRSxFQUFFLEdBQUc7b0JBQ1AsSUFBSSxFQUFFLFNBQVM7aUJBQ2YsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxDQUFDO2dCQUNOLE1BQU0sUUFBQTthQUNOLENBQUM7UUFDSCxDQUFDO1FBQ0YsMEJBQUM7SUFBRCxDQUFDLEFBckNELElBcUNDO0lBckNZLGtEQUFtQiJ9
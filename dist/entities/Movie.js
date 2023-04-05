"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const typeorm_1 = require("typeorm");
let Movie = class Movie extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Movie.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: false })
], Movie.prototype, "movieName", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: false })
], Movie.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: false })
], Movie.prototype, "directorName", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { nullable: false })
], Movie.prototype, "releaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true })
], Movie.prototype, "creatorId", void 0);
Movie = __decorate([
    (0, typeorm_1.Entity)()
], Movie);
exports.Movie = Movie;
//# sourceMappingURL=Movie.js.map
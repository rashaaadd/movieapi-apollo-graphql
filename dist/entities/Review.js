"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const typeorm_1 = require("typeorm");
let Review = class Review extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Review.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: false })
], Review.prototype, "movieId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: false })
], Review.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: false })
], Review.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: false })
], Review.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Review.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)()
], Review.prototype, "updatedAt", void 0);
Review = __decorate([
    (0, typeorm_1.Entity)()
], Review);
exports.Review = Review;
//# sourceMappingURL=Review.js.map
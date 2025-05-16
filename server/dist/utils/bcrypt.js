"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hashPassword(password) {
    const salt = bcryptjs_1.default.genSaltSync(+process.env.BCRYPT_SALT_ROUND);
    const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
    return hashedPassword;
}
exports.hashPassword = hashPassword;
function comparePassword(password, hashedPassword) {
    return bcryptjs_1.default.compareSync(password, hashedPassword);
}
exports.comparePassword = comparePassword;

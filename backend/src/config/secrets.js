"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || "ssh";
exports.PORT = process.env.PORT || 3000;

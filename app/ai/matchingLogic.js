"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ai/matchingLogic.js
const natural_1 = __importDefault(require("natural"));
class ItemMatcher {
    constructor(similarityThreshold = 0.7) {
        this.similarityThreshold = similarityThreshold;
    }
    calculateAttributeSimilarity(attribute1, attribute2) {
        return natural_1.default.JaroWinklerDistance(attribute1, attribute2, {});
    }
    calculateOverallSimilarity(lostItem, foundItem) {
        const itemNameSimilarity = this.calculateAttributeSimilarity(lostItem.itemName, foundItem.itemName);
        const colorSimilarity = this.calculateAttributeSimilarity(lostItem.color, foundItem.color);
        const descriptionSimilarity = this.calculateAttributeSimilarity(lostItem.description, foundItem.description);
        const dateTimeSimilarity = this.calculateAttributeSimilarity(lostItem.dateTime, foundItem.dateTime);
        const brandSimilarity = this.calculateAttributeSimilarity(lostItem.brand, foundItem.brand);
        const citySimilarity = this.calculateAttributeSimilarity(lostItem.city, foundItem.city);
        const categorySimilarity = this.calculateAttributeSimilarity(lostItem.category, foundItem.category);
        const N = 7;
        const overallSimilarity = (descriptionSimilarity * 2.5 +
            citySimilarity * 1.9 +
            dateTimeSimilarity * 1.7 +
            categorySimilarity * 1.6 +
            itemNameSimilarity * 1.5 +
            brandSimilarity * 1.5 +
            colorSimilarity) /
            N;
        return overallSimilarity;
    }
    matchItems({ lostItem, foundItems }) {
        let matches = [];
        for (let i = 0; i < foundItems.length; i++) {
            const similarity = this.calculateOverallSimilarity(lostItem, foundItems[i]);
            if (similarity >= this.similarityThreshold) {
                matches.push({
                    foundItemId: foundItems[i].id,
                    similarity,
                });
            }
        }
        matches.sort((a, b) => b.similarity - a.similarity);
        matches = matches.map((match) => [match.foundItemId, match.similarity]);
        return matches;
    }
}
exports.default = ItemMatcher;
//# sourceMappingURL=matchingLogic.js.map
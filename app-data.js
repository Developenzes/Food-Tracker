export default class AppData {
    constructor() {
        this.food = [];
    }

    addFood(id, carbs, protein, fat) {
        this.food.push({
            id: id,
            carbs: Number.parseInt(carbs, 10),
            protein: Number.parseInt(protein, 10),
            fat: Number.parseInt(fat, 10)
        });
    }

    getTotalCarbs() {
        return this.food.reduce((total, current) => {
            return total + current.carbs;
        }, 0);
    }

    getTotalProtein() {
        return this.food.reduce((total, current) => {
            return total + current.protein;
        }, 0);
    }

    getTotalFat() {
        return this.food.reduce((total, current) => {
            return total + current.fat;
        }, 0);
    }

    getTotalCalories() {
        return (this.getTotalCarbs() * 4) + (this.getTotalProtein() * 4) + (this.getTotalFat() * 9);
    }

    removeFood(id) {                
        const idToRemove = id;

        this.food = this.food.filter((item) => item.id !== idToRemove);
    }
}
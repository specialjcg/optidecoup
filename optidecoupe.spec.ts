interface Carton {
    length: number;
    width: number;
}

interface Order {
    carton: Carton;
    quantity: number;
}

interface Coordinate {
    x: number;
    y: number;

}

interface Emplacement {
    carton: Carton;
    coordinate: Coordinate;
}

interface Disposition {
    plaque: Carton;
    emplacements: Emplacement[];
}

const assertPlaqueBigEnough = (plaque: Carton, order: Order) => {
    if (plaque.width < order.carton.width ||
        plaque.length < order.carton.length ||
        cartonArea(plaque) < orderArea(order)) throw new Error();
};

const dispositionFromOrder = (plaque: Carton, order: Order): Disposition => {
    assertPlaqueBigEnough(plaque, order);
    const emplacements = [];
    let line = 0;
    let column = 0;
    for (let i = 0; i < order.quantity; i++) {
        emplacements.push({carton: order.carton, coordinate: {x: column, y: line}})
        if (column + 2 * order.carton.width < plaque.width) {
            column = column + order.carton.width
        } else {
            line = line + order.carton.length;
            column = 0;
        }

    }

    return {plaque, emplacements}
};

const cartonArea = (carton: Carton) => carton.length * carton.width;


const orderArea = (order: Order) => cartonArea(order.carton) * order.quantity;

describe('test optiDecoup', () => {

    it('should have the disposition when carton length and width in order is less than plaque', () => {
        const plaque: Carton = {length: 1, width: 3};
        const order: Order = {carton: {length: 1, width: 2}, quantity: 1};
        const disposition = dispositionFromOrder(plaque, order);
        expect(disposition).toEqual({
            plaque: {length: 1, width: 3},
            emplacements: [{carton: {length: 1, width: 2}, coordinate: {x: 0, y: 0}}]
        });

    });
    it('should return error when plaque width is too small', () => {
        const plaque: Carton = {length: 3, width: 1};
        const order: Order = {carton: {length: 1, width: 2}, quantity: 1};
        expect(() => dispositionFromOrder(plaque, order)).toThrow(Error);

    });

    it('should return error when plaque length is too small', () => {
        const plaque: Carton = {length: 1, width: 3};
        const order: Order = {carton: {length: 2, width: 1}, quantity: 1};
        expect(() => dispositionFromOrder(plaque, order)).toThrow(Error);

    });
    it('should return error when plaque is too small with multiple order', () => {
        const plaque: Carton = {length: 1, width: 1};
        const order: Order = {carton: {length: 1, width: 1}, quantity: 2};
        expect(() => dispositionFromOrder(plaque, order)).toThrow(Error);

    });

    it('should dispose order (1,2) * 2 in plaque (1,5)', () => {
        const plaque: Carton = {length: 1, width: 5};
        const order: Order = {carton: {length: 1, width: 2}, quantity: 2};
        const disposition = dispositionFromOrder(plaque, order);
        expect(disposition).toEqual({
            plaque: {length: 1, width: 5},
            emplacements: [
                {carton: {length: 1, width: 2}, coordinate: {x: 0, y: 0}},
                {carton: {length: 1, width: 2}, coordinate: {x: 2, y: 0}}
            ]
        });

    });
    it('should dispose order (1,2) * 3 in plaque (2,5)', () => {
        const plaque: Carton = {length: 2, width: 5};
        const order: Order = {carton: {length: 1, width: 2}, quantity: 3};
        const disposition = dispositionFromOrder(plaque, order);
        expect(disposition).toEqual({
            plaque: {length: 2, width: 5},
            emplacements: [
                {carton: {length: 1, width: 2}, coordinate: {x: 0, y: 0}},
                {carton: {length: 1, width: 2}, coordinate: {x: 2, y: 0}},
                {carton: {length: 1, width: 2}, coordinate: {x: 0, y: 1}},
            ]
        });

    });
    describe('compute area', () => {
        it('should be 42 when length is 6 and width is 7', () => {
            const carton: Carton = {length: 6, width: 7};
            expect(cartonArea(carton)).toEqual(42)
        });
        it('should sum the area of order', () => {
            const order: Order = {carton: {length: 1, width: 1}, quantity: 4};
            expect(orderArea(order)).toEqual(4)
        });
    });
});

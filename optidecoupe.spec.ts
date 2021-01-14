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

const dispositionFromOrder = (plaque: Carton, order: Order): Disposition => {
    if (plaque.width<order.carton.width) throw new Error();
    return {plaque, emplacements: [{carton: order.carton, coordinate: {x: 0, y: 0}}]}
};

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
        const plaque: Carton = {length: 1, width: 1};
        const order: Order = {carton: {length: 1, width: 2}, quantity: 1};
        expect(()=> dispositionFromOrder(plaque, order)).toThrow(Error);

    });

});

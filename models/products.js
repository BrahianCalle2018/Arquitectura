export const PRODUCT_SCHEMA = "Products";

export default Recarga = {
    name: PRODUCT_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',        
        name: { type: 'string', indexed: true },
        price: { type: 'string', indexed: true },
        version: { type: 'string', default: '' }
    }
};


export const COMPONENTS_SCHEMA = "Components";

export default Recarga = {
    name: COMPONENTS_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',        
        name: { type: 'string', indexed: true },
        price: { type: 'string', indexed: true },
        version: { type: 'string', default: '' }
    }
};


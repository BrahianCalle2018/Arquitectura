import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { ListProducts} from './listProducts';
import { getProducts} from '../services/products.service';

export const TabsBox = (props) => {
    const { loading, products, error } = props    
    const [products, setProducts] = useState([]);


    const initializeProducts = (data, flag) => {
        if (flag) {
            loading(false);
            setProducts(data.products);

            if (data.products.length === 0) {
                error("¡No se encuentraron movimientos!")
                
            }

        } else {
            loading(false);
            alert(data.message);
        }
    }

    const viewProducts = () => {

        if (pageMoves > 0) {
            loading(true);
            getProducts(0, initializeProducts);

        }

    }

    useEffect(() => {
        if (key === 'products') {
            viewProducts();
        } 

    }, [])

    
    return (
        <>
            <div className='col-md-12'>
                <Tabs >
                    <Tab eventKey="moves" title="Movimientos">
                        {products.length > 0 && <ListProducts products={products} />}
                    </Tab>
                    
                </Tabs>
            </div>
        </>
    )
}
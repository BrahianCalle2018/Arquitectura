import { Table, Button } from 'react-bootstrap';
import { ItemProducts,} from './itemProducts';



export const ListProducts = (props) => {
    const { products } = props

    return (
        <>
            <div style={{ marginTop: 15 }}>
                <div className="row">
                    <div className="col">

                    </div>
                    <div className="col">
                        <h3>Productos</h3>
                    </div>
                    <div className="col" >

                        <div className='row' style={{ marginLeft: '40%' }}>
                            <div className="col" >
                                <label style={{ fontSize: 19 }}>Página: {contPage}</label>
                            </div>
                            <div className="col">

                                <Button variant="link" onClick={leftPage}>
                                    <FontAwesomeIcon color={'black'} icon={faChevronLeft} />
                                </Button>
                                <Button variant="link" onClick={rigthPage}>
                                    <FontAwesomeIcon color={'black'} icon={faChevronRight} />
                                </Button>

                            </div>
                        </div>

                    </div>
                </div>
                <Table striped bordered hover variant="info" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Descripción</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((obj, i) => (
                            <ItemProducts key={i} itemMoves={obj} products={products} />
                        ))}

                    </tbody>
                </Table>
            </div>
        </>
    )
}




export const ItemProducts = (props) => {
    const { itemProducts, products } = props;
     

    return (
        <>

            <tr>
                <td>{itemProducts.id}</td>
                <td>{itemProducts.name}</td>
                <td>{itemProducts.description}</td>
                <td>{itemProducts.price}</td>

            </tr>
        </>
    )
}

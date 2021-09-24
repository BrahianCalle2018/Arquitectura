
import { Config } from '../shared/config';

export const getProducts = async (type, page, callback) => {
    const config = await Config();
    let finish = false;
    const args = [[
        0, { tipo: type, pagina: page }
    ]]

    const data = await Desencrypt();
    const params = {
        model: "webservice",
        method: "obtenerDatosProducts",
        args:args,
        kwargs: {}
    }
    setTimeout(() => {
        if (finish) {
            return;
        }
        alert("Tiempo limite excedidoo");
        callback(false, "");
        return;
    }, 30000);

    const client = new Odoo({
        url: config.host,
        port: config.port,
        db: config.database,
        username: data.user,
        password: data.password
    });

    client.connect((err, response) => {
        if (err) {
            return callback(response, false)
        } else {
            client.execute_kw(params.model, params.method, params.args, (err, response) => {
                
                finish = true
                if (err) {
                    callback(err, false);
                    return false;
                }
                
                callback(response, true);
            });
        }
    })

}


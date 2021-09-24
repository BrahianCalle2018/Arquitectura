import { Config, version } from "./shared/config";
import { PRODUCT_SCHEMA } from "./models/products";
import { COMPONENTS_SCHEMA } from ".models/components";
const _getDates = async () => {
    try {
        product_write_date = await AsyncStorage.getItem("product_write_date");
        error_write_date = await AsyncStorage.getItem("error_write_date");
        return [
            product_write_date ? product_write_date : null,
            error_write_date ? error_write_date : null,
            documento_write_date ? documento_write_date : null
        ]
    } catch (error) {
        Alert.alert("Error", 'Error al obtener fechas');
    }
};

export const AuthService = async (user, callBack) => {
    const config = await Config();
    const client = new DataBase({
        host: config.host,
        port: config.port,
        database: config.database,
        username: user.username.toLowerCase(),
        password: user.password
    })
    ToastAndroid.show("Verificando datos de usuario.", ToastAndroid.LONG);
    client.connect((err, response) => {
        if (err) {
            if (err.data && err.data.arguments[0] === "The user needs to be logged-in to initialize his context") {
                AuthService(user, callBack);
                ToastAndroid.show("Recopilando datos", ToastAndroid.SHORT);
                return;
            }
            if (err.data && err.message) {
                Alert.alert("Error", "Usuario y/o contraseña incorrectos");
            } else {
                Alert.alert("Error", "Sin conexion con el servidor");
            }
            callBack(false, 0);
            return;
        }
        if (Object.keys(response.user_context).length === 0) {
            Alert.alert("Error", "Usuario y/o contraseña incorrectos");
            callBack(false, 0);
            return;
        }
        const ids = { uid: response.uid, partner_id: response.partner_id }
        InitializeData(client, ids, callBack);
        return;
    });
}


export const InitializeData = async (client, ids, call) => {
    const dates = await _getDates();
    let finish = false;
    const args = [
        0,
        { version: version, product_write_date: dates[0], error_write_date: dates[1], documento_write_date: dates[2] }
    ]
    const params = {
        model: "movilgo.webservice",
        method: "asignarDatos",
        args: args,
        kwargs: {}
    }
    setTimeout(() => {
        if (finish) {
            return;
        }
        Alert.alert("Tiempo limite excedido, intentelo más tarde");
        call(false, 0);
        return;
    }, 30000)
    return client.rpc_call('/web/dataset/call_kw', params, async (err, response) => {
        finish = true;
        if (err) {
            console.log("ErrorSession", err);
            call(false, 0);
            return false;
        }
        if (response.apklocation) {
            Alert.alert(
                "Actualización",
                "Existe una nuevos datos, desea actualizarlo ahora",
                [
                    {
                        text: "Cancelar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "Actualizar", onPress: () => UpdateApp(response.apklocation) }
                ],
                { cancelable: false }
            );
            call(false, 0);
            return false;
        }
        if (response.productos) {
            await SaveProducts(response.productos, call);
            
        }

        if (response.errores) {
            await SaveErrors(response.errores);
        }
        if (response.permiso) {
            _storeData("Permission", "" + response.permiso);
        }
        await _storeData('session', JSON.stringify(client));
        ToastAndroid.show("¡Bienvenido!", ToastAndroid.SHORT);
        await _storeData('session_ids', JSON.stringify(ids));
        await _storeDates();
        call(true, response.balanceFinal);
        return true;
    });
}

const SaveProducts = async (data) => {
    const products = {};
    if (!data) {
        Alert.alert("Error al obtener datos", "No se encontraron datos en el servidor, por intentelo otra vez, si el problema persiste comuniquese con su empresa.");
        return false
    }
    data.forEach(element => {
        if (element.product_id_name === 'Recargas') {
            if (!products[[PRODUCT_SCHEMA]]) {
                products[[PRODUCT_SCHEMA]] = [];
            }
            products[[PRODUCT_SCHEMA]].push(element)
        } else if (element.categ_id_name === "Componentes" ||
            element.categ_id_name === "Voz" ||
            element.categ_id_name === "Datos" ||
            element.categ_id_name === "Voz y Datos" ||
            element.categ_id_name === "TV" ||
            element.categ_id_name === "Aplicaciones") {
            if (!products[[COMPONENTS_SCHEMA]]) {
                products[[COMPONENTS_SCHEMA]] = [];
            }
            products[[COMPONENTS_SCHEMA]].push(element);
        }else {
            
        }
    });
    
    await insertProductsToDB(products, "product_write_date")
        .then(response => { console.log("insertados", response) })
        .catch(err => {
            console.log(err)
            Alert.alert("Error", "No se obtuvieron datos del servidor")
        });
    return true;
}

export const updateVersion = async (version) => {
    const session = await AsyncStorage.getItem("session");
    const client = new DataBase(JSON.parse(session));
    let finish = false;
    const args = [
        0, {}
    ]
    const params = {
        model: "webservice",
        method: "actualizaProducts",
        args: args,
        kwargs: {}
    }
    setTimeout(() => {
        if (finish) {
            return;
        }
        Alert.alert("Tiempo espera excedido, revise su conexión a internet y vuelva a intentarlo más tarde.");
        return;
    }, 30000)

    client.rpc_call('/web/dataset/call_kw', params, (err, response) => {
        finish = true;
        if (err) {
            console.log("Error update ", err);
            return false;
        }
        if (response) {
            if (response.errores && response.errores.id) {
                const err = {
                    table: "Errors",
                    product: {
                        id: response.errores.id
                    }
                }
                getElementByIdDataBase(err).then(results => {
                    if (results) {
                        Alert.alert(Error, results.comment);
                    } else {
                        Alert.alert(Error, "Movilgo no ha parametrizado el error, Comunicate con nosotros");
                    }

                }).catch(error => console.log(error));
                return false;
            }
            if (parseFloat(version) < parseFloat(response.version)) {
                if (response.apklocation) {
                    Alert.alert(
                        "Actualización",
                        "Existe una nueva versión de este software ¿desea actualizarlo ahora?",
                        [
                            {
                                text: "Cancelar",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "Actualizar", onPress: () => UpdateApp(response.apklocation) }
                        ],
                        { cancelable: false }
                    );
                    return false;
                }
            } else {
                ToastAndroid.showWithGravity(
                    "Usted ya posee la ultima versión",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            }
            return true;
        }
        return false;
    });
}
export const UpdateApp = (url)=>{
    ClearAppData();
    OpenURL(url);
}


import 'dotenv/config'
import { app } from "./app.mjs";
import { connect } from "./db/connection.mjs";

connect()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server is listening at http://localhost:${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("error : ", err)
    })
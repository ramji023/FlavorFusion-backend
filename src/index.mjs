import 'dotenv/config'
import { app } from "./app.mjs";
import { connect } from "./db/connection.mjs";
const port = process.env.PORT || 8001;
connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`server is listening at http://localhost:${port}`);
        })
    })
    .catch((err) => {
        console.log("error : ", err)
    })
const { dbConnection } = require("./src/database/connection");
const { AuthRoutes } = require("./src/routes/Auth/Auth.routes");
const { PropertyRoutes } = require("./src/routes/Properties/Properties.routes");
const { UserRoutes } = require("./src/routes/User/User.routes");
const { logger } = require('./src/utils/logger')

const cors = require('cors')

const express = require('express');
const { firebaseAdmin } = require("./src/utils/firebasClient");
const { ChatRoutes } = require("./src/routes/Chat/Chat.routes");
const app = express()
const port = 4000
app.use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to Accomzy Backend')
}
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/User', UserRoutes)
app.use('/Property', PropertyRoutes)
app.use('/Auth', AuthRoutes)
app.use('/Chat', ChatRoutes)
app.listen(port, () => {
    logger.info(`Accomzy Backend and restAPIs Now Available  at http://localhost:${port}`)
}
)


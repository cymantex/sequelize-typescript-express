### Project Installation
1. `git clone https://github.com/dv16sen/sequelize-typescript-express.git`
2. Install [Node.js](https://nodejs.org/en/) if you don't have it already. You can check if you have it installed by writing `node -v` in a terminal (it should be version 8 or greater).
3. `npm install` (can take several minutes)
4. Install [XAMPP](https://www.apachefriends.org/index.html)

### Start developing
1. Open XAMPP and start MySQL + Apache. You can then view the database under [localhost/phpmyadmin](http://localhost/phpmyadmin)
2. `npm run dev`

### Project Structure:
- **server**: Contains all backend code. Based on [express](https://expressjs.com/) and [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript).
    - **setup:** Files used for the initial server setup.
    - **routes:** Defines the different API endpoints and what arguments they accept. The exported functions will automatically be fetched an called during the server setup.
    - **request:** Defines what the different API endpoints does.
    - **models:** Defines all the different database tables.
    - **utils:** Contains other tools not fitting in the other categories.
- **scripts**: All these files are automatically pulled and added as a program argument for [scripts.ts](./scripts.ts). All files under this folder should export an async function.

### Available Scripts
| Script:                   | Effect:                        |
| --------------------------| ------------------------------ |
| `npm run start`           | Starts the server in production mode and tells it to serve `client/build/index.html` |
| `npm run dev`             | Runs the server in the development mode.<br> The server will restart if you make edits under the server folder.<br> |
| `npm run test`            | Runs all tests under `server/test` |
| `npm run removeDatabase`  | Removes the database with the name defined in [settings.json](./server/settings.json). |
| `npm run defaultDatabase` | First removes any existing database then loads all [defaultData](server/utils/constants/defaultData.ts). |
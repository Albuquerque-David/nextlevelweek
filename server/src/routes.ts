import express from 'express'
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'


const routes = express.Router()
const pointsController = new PointsController();
const itemsController = new ItemsController();


routes.get('/items', itemsController.index)
routes.get('/points/:id',pointsController.show)
routes.get('/points',pointsController.index)
routes.get('/allpoints', pointsController.showAll)


routes.post('/points',pointsController.create)

export default routes;

// Service Pattern
// Repository Pattern (Data Mapper)
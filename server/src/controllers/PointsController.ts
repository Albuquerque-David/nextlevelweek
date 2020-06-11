import knex from '../database/connection';
import {Request, Response} from 'express'

class PointsController 
{
    async showAll (request : Request, response : Response)
    {
        const points = await knex('points').select('*')

        return response.status(400).json({points})
    }

    async show (request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point)
        {
            return response.status(400).json({message: 'Point not found.'});
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')

        return response.json({point, items})
    }
    

    async create (request : Request, response : Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();

        const point = 
        {
            image: "image-https://images.unsplash.com/photo-1573481078935-b9605167e06b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }
    
        const insertedIds = await trx('points').insert(point)
    
        const point_id = insertedIds[0];
    
        const pointItems = items.map((item_id : number) => {
            return {
                item_id,
                point_id,
            }
        })
    
        await trx('point_items').insert(
            pointItems
        )

        await trx.commit();
    
        return response.json({
            id: point_id,
            ...point,
        })
    }

    async index (request: Request, response: Response) {
        //cidade, uf, items (Query params)

        const { city, uf, items } = request.query

        const parsedItems = String(items)
                            .split(',')
                            .map(item => Number(item.trim()))

        const points = await knex('points')
                            .join('point_items', 'points.id', '=', 'point_items.point_id')
                            .whereIn('point_items.item_id', parsedItems)
                            .where('city', String(city))
                            .where('uf', String(uf))
                            .distinct()
                            .select('points.*')

        
        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.156:3333/uploads/${point.image}`,
            };
            });
        
        return response.json(serializedPoints);
    }
}

export default PointsController;
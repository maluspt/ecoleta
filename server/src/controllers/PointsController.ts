import knex from '../database/connection';
import { Request, Response } from 'express';

class PointsController {
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('items_points', 'points.id', '=', 'point_id')
            .whereIn('item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct().select('points.*')

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.15.48:3333/uploads/${point.image}`
            }
        })

        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response) {
        const id = request.params.id;
        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found' });
        }

        const serializedPoints = {
            ...point,
            image_url: `http://192.168.15.48:3333/uploads/${point.image}`,
        };

        const items = await knex('items')
            .join('items_points', 'items.id', '=', 'items_points.item_id')
            .where('point_id', id).select('items.title');

        return response.json({ point: serializedPoints, items });
    }

    async create(request: Request, response: Response) {
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
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedIds = await trx('points').insert(point);
        const point_id = insertedIds[0];

        const itemPoints = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                };
            })

        await trx('items_points').insert(itemPoints);
        await trx.commit();
        return response.json({
            id: point_id,
            ...point,
        });
    }
}


export default PointsController;
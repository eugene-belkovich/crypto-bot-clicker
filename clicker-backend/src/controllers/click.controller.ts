import {inject, injectable} from 'inversify';
import {FastifyReply, FastifyRequest} from 'fastify';
import {TYPES} from '../types/di.types';
import {ClickData, IClickService} from '../interfaces';

@injectable()
export class ClickController {
    constructor(@inject(TYPES.ClickService) private clickService: IClickService) {
    }

    async saveClicks(request: FastifyRequest<{ Body: ClickData[] }>, reply: FastifyReply) {
        const {user} = request.telegramUser;
        const clicks = request.body;

        if (!Array.isArray(clicks) || clicks.length === 0) {
            return reply.status(400).send({error: 'Invalid clicks: expected non-empty array'});
        }

        if (clicks.length > 50) {
            return reply.status(400).send({error: 'Too many clicks in batch: max 50'});
        }

        for (const click of clicks) {
            if (!click.timestamp || typeof click.x !== 'number' || typeof click.y !== 'number') {
                return reply.status(400).send({error: 'Invalid click data: timestamp, x, y are required'});
            }
        }

        await this.clickService.saveClicks(String(user.id), clicks);
        const score = await this.clickService.getScore(String(user.id));

        return reply.send({score});
    }
}

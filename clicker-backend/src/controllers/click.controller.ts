import {inject, injectable} from 'inversify';
import {FastifyReply, FastifyRequest} from 'fastify';
import {TYPES} from '../types/di.types';
import {ClickData, IClickService, IUserService} from '../interfaces';

@injectable()
export class ClickController {
    constructor(
        @inject(TYPES.ClickService) private clickService: IClickService,
        @inject(TYPES.UserService) private userService: IUserService,
    ) {}

    async saveClicks(request: FastifyRequest<{Body: ClickData[]}>, reply: FastifyReply) {
        const {user} = request.telegramUser;
        const clicks = request.body;

        const score = await this.clickService.saveClicks(String(user.id), clicks);
        return reply.send({score});
    }
}

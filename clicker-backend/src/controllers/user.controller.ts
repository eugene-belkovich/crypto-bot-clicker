import {inject, injectable} from 'inversify';
import {FastifyReply, FastifyRequest} from 'fastify';
import {TYPES} from '../types/di.types';
import {IUserService} from '../interfaces';
import {CreateUserDto} from '../dto';
import {validateDto} from '../guards';

@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: IUserService) {
    }

    async getUser(
        request: FastifyRequest<{ Params: { telegramId: string } }>,
        reply: FastifyReply
    ) {
        const {telegramId} = request.params;
        const user = await this.userService.getUser(telegramId);

        if (!user) {
            return reply.status(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: `User with telegramId ${telegramId} not found`,
            });
        }

        return reply.send(user);
    }

    async createOrGetUser(request: FastifyRequest, reply: FastifyReply) {
        const dto = await validateDto(CreateUserDto, request.body);
        const user = await this.userService.getOrCreateUser(dto.telegramId, {
            username: dto.username,
            firstName: dto.firstName,
            lastName: dto.lastName,
        });

        return reply.status(201).send(user);
    }
}

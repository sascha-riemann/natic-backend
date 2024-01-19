import { AuthenticatedUser } from '../authentication/decorators/user-decorator';

export abstract class NaticService<
  EntityType,
  DTOType,
  UpdateType,
  CreateType,
> {
  abstract create(authenticatedUser: AuthenticatedUser, dto: CreateType);
  abstract findAll(...args);
  abstract findOne(id: number);
  abstract update(id: number, dto: UpdateType, ...args);
  abstract remove(id: number);
  abstract setAttributes(
    entity: EntityType,
    dto: CreateType | UpdateType,
    ...args
  ): void;
  abstract entityToDTO(entity: EntityType, ...args): Promise<DTOType> | DTOType;
}

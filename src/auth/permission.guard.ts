import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "./permission.decorator";
import { PermissionService } from "src/user/permission.service";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly permissionService: PermissionService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSION_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredPermissions) return true;

        const { user } = context.switchToHttp().getRequest<{ user?: { userId?: number } }>();
        if (typeof user?.userId !== 'number') {
            throw new ForbiddenException();
        }

        const permissionNames = await this.permissionService.findNamesForUser(user.userId);
        return requiredPermissions.some((permission) => permissionNames.includes(permission));
    }
}
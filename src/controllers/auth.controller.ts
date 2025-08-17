import { Request, Response } from 'express';
import { LdapService } from '../services/ldap.service';
import { LoginRequest } from '../validators/auth.validator';
import { asyncHandler } from '../utils/errorHandler';

export class AuthController {
  private ldapService: LdapService;

  constructor() {
    this.ldapService = new LdapService();
  }

  login = asyncHandler(async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { username, password } = req.body;

    const result = await this.ldapService.authenticate(username, password);

    res.status(200).json({
      success: result.success,
      user: result.user,
      message: result.message,
    });
  });
}
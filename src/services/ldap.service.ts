import { Client } from 'ldapts';
import { env } from '../config/env';
import { createError } from '../utils/errorHandler';

export interface LdapAuthResult {
  success: boolean;
  user?: string;
  message: string;
}

export class LdapService {
  private client: Client;

  constructor() {
    this.client = new Client({
      url: env.LDAP_URL,
      timeout: 10000, // 10 seconds timeout
      connectTimeout: 5000, // 5 seconds connection timeout
    });
  }

  async authenticate(username: string, password: string): Promise<LdapAuthResult> {
    const userDn = `${username}@${env.LDAP_DOMAIN}`;
    const companyUser = `${env.LDAP_COMPANY}\\${username}`;

    try {
      // Attempt to bind with the provided credentials
      await this.client.bind(userDn, password);

      // If bind is successful, unbind and return success
      await this.client.unbind();

      return {
        success: true,
        user: companyUser,
        message: 'Authenticated successfully',
      };
    } catch (error: any) {
      await this.safeUnbind();

      // Handle different types of LDAP errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw createError('LDAP server is unreachable', 503);
      }

      if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
        throw createError('LDAP server timeout', 500);
      }

      // Invalid credentials (bind failure)
      if (error.code === 49 || error.message?.includes('Invalid credentials')) {
        throw createError('Invalid username or password', 401);
      }

      // Other LDAP errors
      console.error('LDAP bind error:', error);
      throw createError('Authentication failed', 500);
    }
  }

  private async safeUnbind(): Promise<void> {
    try {
      await this.client.unbind();
    } catch (error) {
      // Ignore unbind errors
      console.warn('Failed to unbind LDAP client:', error);
    }
  }
}
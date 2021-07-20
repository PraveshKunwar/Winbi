import { PermissionString } from 'discord.js';
import { categories } from '../../typedefs/CommandEvent';
export const name = 'kick';
export const aliases = ['boot'];
export const desc = 'Kick any member from the server.';
export const perms: PermissionString[] | null = [
   'SEND_MESSAGES',
   'KICK_MEMBERS'
];
export const cooldown = 10;
export const category: categories = 'moderation';
export const usage: string | string[] =
   '<prefix>kick <member> <optional reason>';

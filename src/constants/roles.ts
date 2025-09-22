export const ROLES = {
    Admin: 'Admin',
    Manager: 'Manager',
    Technician: 'Technician',
    Client: 'Client',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];



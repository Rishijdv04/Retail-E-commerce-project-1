import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Frontend demonstration only. A client-side digest is not a substitute for server-side password hashing/authentication.
const digest = async (value) => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');
};

const DEMO_ADMIN = { id: 'admin-demo', name: 'SwiftCart Admin', email: 'admin@swiftcart.demo', role: 'admin' };

export const useAuth = create(persist((set, get) => ({
  user: null,
  users: [],
  init: () => {},
  signup: async ({ name, email, password }) => {
    const normalized = email.trim().toLowerCase();
    if (get().users.some((u) => u.email === normalized)) throw new Error('An account with this email already exists.');
    const user = { id: crypto.randomUUID(), name: name.trim(), email: normalized, role: 'customer' };
    const passwordDigest = await digest(password);
    set((s) => ({ users: [...s.users, { ...user, passwordDigest }], user }));
    return user;
  },
  login: async ({ email, password }) => {
    const normalized = email.trim().toLowerCase();
    if (normalized === 'admin@swiftcart.demo' && password === 'Admin@123') { set({ user: DEMO_ADMIN }); return DEMO_ADMIN; }
    const passwordDigest = await digest(password);
    const match = get().users.find((u) => u.email === normalized && u.passwordDigest === passwordDigest);
    if (!match) throw new Error('Email or password is incorrect.');
    const { passwordDigest: storedDigest, ...safeUser } = match;
    set({ user: safeUser }); return safeUser;
  },
  logout: () => set({ user: null }),
  updateProfile: (changes) => set((s) => ({ user: s.user ? { ...s.user, ...changes } : null })),
}), { name: 'swiftcart-demo-auth', partialize: (s) => ({ user: s.user, users: s.users }) }));

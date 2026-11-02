import { create } from 'zustand';
import * as api from '../services/authService';

// Components talk to this store, never to the service directly.
export const useAuth = create((set, get) => {
  const id = () => get().user?.id;
  const setUser = (user) => { set({ user }); return user; };
  const refresh = async () => {
    try {
      const list = await api.listUsers();
      set({ users: list });
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  return {
    user: api.currentUser(),
    ready: false,
    users: [],
    init: async () => {
      const u = await api.ensureSeed();
      set({ user: u, ready: true });
    },
    signup: async (d) => setUser(await api.signup(d)),
    login: async (e, p, o) => setUser(await api.login(e, p, o)),
    logout: () => {
      api.logout();
      set({ user: null, users: [] });
    },
    updateProfile: async (d) => setUser(await api.updateProfile(id(), d)),
    changePassword: async (o, n) => api.changePassword(id(), o, n),
    saveAddress: async (a) => setUser(await api.saveAddress(id(), a)),
    removeAddress: async (aid) => setUser(await api.removeAddress(id(), aid)),
    requestReset: api.requestReset,
    resetPassword: api.resetPassword,
    // admin
    loadUsers: refresh,
    createUser: async (d) => {
      await api.createUser(id(), d);
      await refresh();
    },
    setRole: async (uid, r) => {
      await api.setUserRole(id(), uid, r);
      await refresh();
    },
    setStatus: async (uid, s) => {
      await api.setUserStatus(id(), uid, s);
      await refresh();
    },
    removeUser: async (uid) => {
      await api.deleteUser(id(), uid);
      await refresh();
    },
  };
});

import { create } from 'zustand';
import * as api from '../services/authService';

// Components talk to this store, never to the service directly.
export const useAuth = create((set, get) => {
  const id = () => get().user?.id;
  const setUser = (user) => { set({ user }); return user; };
  const refresh = () => set({ users: api.listUsers(id()) });
  return {
    user: null,
    ready: false,
    users: [],
    init: async () => { await api.ensureSeed(); set({ user: api.currentUser(), ready: true }); },
    signup: async (d) => setUser(await api.signup(d)),
    login: async (e, p, o) => setUser(await api.login(e, p, o)),
    logout: () => { api.logout(); set({ user: null, users: [] }); },
    updateProfile: async (d) => setUser(api.updateProfile(id(), d)),
    changePassword: (o, n) => api.changePassword(id(), o, n),
    saveAddress: async (a) => setUser(api.saveAddress(id(), a)),
    removeAddress: async (aid) => setUser(api.removeAddress(id(), aid)),
    requestReset: api.requestReset,
    resetPassword: api.resetPassword,
    // admin
    loadUsers: refresh,
    createUser: async (d) => { await api.createUser(id(), d); refresh(); },
    setRole: (uid, r) => { api.setUserRole(id(), uid, r); refresh(); },
    setStatus: (uid, s) => { api.setUserStatus(id(), uid, s); refresh(); },
    removeUser: (uid) => { api.deleteUser(id(), uid); refresh(); },
  };
});

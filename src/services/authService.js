import apiClient from './api';

const K = {
  token: 'sc_token',
  user: 'sc_user',
};

const saveSession = (token, user) => {
  if (token) localStorage.setItem(K.token, token);
  if (user) localStorage.setItem(K.user, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(K.token);
  localStorage.removeItem(K.user);
};

export const getToken = () => localStorage.getItem(K.token);

export function currentUser() {
  try {
    const raw = localStorage.getItem(K.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await apiClient.get('/auth/me');
    const user = res.data.user;
    localStorage.setItem(K.user, JSON.stringify(user));
    return user;
  } catch {
    clearSession();
    return null;
  }
}

export async function ensureSeed() {
  try {
    const user = await fetchCurrentUser();
    return user;
  } catch {
    return currentUser();
  }
}

export function logout() {
  clearSession();
}

export async function signup({ name, email, password }) {
  const res = await apiClient.post('/auth/signup', { name, email, password });
  const { token, user } = res.data;
  saveSession(token, user);
  return user;
}

export async function login(email, password, { adminOnly = false } = {}) {
  const res = await apiClient.post('/auth/login', { email, password, adminOnly });
  const { token, user } = res.data;
  saveSession(token, user);
  return user;
}

export async function updateProfile(id, { name, phone }) {
  const res = await apiClient.put('/auth/profile', { name, phone });
  const user = res.data.user;
  saveSession(null, user);
  return user;
}

export async function changePassword(id, oldPw, newPw) {
  const res = await apiClient.put('/auth/password', {
    oldPassword: oldPw,
    newPassword: newPw,
  });
  return res.data;
}

export async function saveAddress(id, address) {
  const res = await apiClient.post('/auth/addresses', address);
  const user = res.data.user;
  saveSession(null, user);
  return user;
}

export async function removeAddress(id, aid) {
  const res = await apiClient.delete(`/auth/addresses/${aid}`);
  const user = res.data.user;
  saveSession(null, user);
  return user;
}

export async function requestReset(email) {
  const res = await apiClient.post('/auth/forgot-password', { email });
  return res.data; // { devCode }
}

export async function resetPassword(email, code, newPw) {
  const res = await apiClient.post('/auth/reset-password', {
    email,
    code,
    newPassword: newPw,
  });
  return res.data;
}

// ---- Admin endpoints ----
export async function listUsers() {
  const res = await apiClient.get('/admin/users');
  return res.data.users || [];
}

export async function createUser(actorId, data) {
  const res = await apiClient.post('/admin/users', data);
  return res.data.user;
}

export async function setUserRole(actorId, id, role) {
  const res = await apiClient.patch(`/admin/users/${id}/role`, { role });
  return res.data.user;
}

export async function setUserStatus(actorId, id, status) {
  const res = await apiClient.patch(`/admin/users/${id}/status`, { status });
  return res.data.user;
}

export async function deleteUser(actorId, id) {
  const res = await apiClient.delete(`/admin/users/${id}`);
  return res.data;
}

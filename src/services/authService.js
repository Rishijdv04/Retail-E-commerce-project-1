// Mock auth backend for the frontend prototype. Everything lives in localStorage.
// Every function has the shape a real REST API would have, so later you can swap
// each body for an axios call (POST /auth/login, etc.).
// NOT SECURE for production: anyone with browser access can read/edit localStorage.

const K = { users: 'sc_users', session: 'sc_session', resets: 'sc_resets', lock: 'sc_lock' };
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const b64 = (b) => btoa(String.fromCharCode(...new Uint8Array(b)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const norm = (e) => String(e).trim().toLowerCase();
const uid = () => crypto.randomUUID();
const users = () => read(K.users, []);
const saveUsers = (u) => write(K.users, u);
const pub = ({ pw, ...u }) => u; // never expose password data

// PBKDF2 + random salt (WebCrypto). Plain-text passwords are never stored.
async function hash(password, salt = crypto.getRandomValues(new Uint8Array(16))) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, key, 256);
  return { salt: b64(salt), hash: b64(bits) };
}
async function verify(password, rec) { return (await hash(password, unb64(rec.salt))).hash === rec.hash; }

function mutate(id, fn) {
  const all = users();
  const i = all.findIndex((x) => x.id === id);
  if (i < 0) throw new Error('User not found.');
  all[i] = fn({ ...all[i] });
  saveUsers(all);
  return pub(all[i]);
}
function assertAdmin(actorId) {
  const a = users().find((x) => x.id === actorId);
  if (!a || a.role !== 'admin' || a.status !== 'active') throw new Error('Admin access required.');
}

// ---- seed: first run creates one admin. CHANGE THIS PASSWORD after first login. ----
let seeding;
export function ensureSeed() {
  seeding ??= (async () => {
    if (users().length) return;
    saveUsers([{ id: uid(), name: 'Platform Admin', email: 'admin@swiftcart.com', role: 'admin', status: 'active',
      phone: '', addresses: [], createdAt: Date.now(), pw: await hash('Admin@12345') }]);
  })();
  return seeding;
}

// ---- session ----
const startSession = (id) => write(K.session, { uid: id, exp: Date.now() + 7 * 864e5 });
export function currentUser() {
  const s = read(K.session, null);
  if (!s || s.exp < Date.now()) return null;
  const u = users().find((x) => x.id === s.uid && x.status === 'active');
  return u ? pub(u) : null;
}
export const logout = () => localStorage.removeItem(K.session);

// ---- customer account ----
export async function signup({ name, email, password }) {
  email = norm(email);
  if (users().some((u) => u.email === email)) throw new Error('An account with this email already exists.');
  const u = { id: uid(), name: name.trim(), email, role: 'customer', status: 'active', phone: '',
    addresses: [], createdAt: Date.now(), pw: await hash(password) };
  saveUsers([...users(), u]);
  startSession(u.id);
  return pub(u);
}

export async function login(email, password, { adminOnly = false } = {}) {
  email = norm(email);
  const locks = read(K.lock, {});
  const l = locks[email];
  if (l && l.until > Date.now()) throw new Error(`Too many attempts. Try again in ${Math.ceil((l.until - Date.now()) / 1000)}s.`);
  const u = users().find((x) => x.email === email);
  const ok = u && (await verify(password, u.pw)) && (!adminOnly || u.role === 'admin');
  if (!ok) {
    const n = (l?.n || 0) + 1;
    locks[email] = { n: n >= 5 ? 0 : n, until: n >= 5 ? Date.now() + 60000 : 0 };
    write(K.lock, locks);
    throw new Error('Incorrect email or password.');
  }
  if (u.status !== 'active') throw new Error('This account is disabled. Contact support.');
  delete locks[email];
  write(K.lock, locks);
  startSession(u.id);
  return pub(u);
}

export const updateProfile = (id, { name, phone }) => mutate(id, (u) => ({ ...u, name: name.trim(), phone: phone.trim() }));

export async function changePassword(id, oldPw, newPw) {
  const u = users().find((x) => x.id === id);
  if (!u || !(await verify(oldPw, u.pw))) throw new Error('Current password is incorrect.');
  const pw = await hash(newPw);
  return mutate(id, (x) => ({ ...x, pw }));
}

// Saved addresses
export const saveAddress = (id, a) => mutate(id, (u) => {
  let list = u.addresses || [];
  const addr = { ...a, id: a.id || uid() };
  if (!list.length) addr.isDefault = true;
  list = a.id ? list.map((x) => (x.id === a.id ? addr : x)) : [...list, addr];
  if (addr.isDefault) list = list.map((x) => ({ ...x, isDefault: x.id === addr.id }));
  return { ...u, addresses: list };
});
export const removeAddress = (id, aid) => mutate(id, (u) => {
  const list = (u.addresses || []).filter((x) => x.id !== aid);
  if (list.length && !list.some((x) => x.isDefault)) list[0] = { ...list[0], isDefault: true };
  return { ...u, addresses: list };
});

// ---- password reset (no email server yet, so the code is returned for demo) ----
export async function requestReset(email) {
  email = norm(email);
  if (!users().some((u) => u.email === email)) return { devCode: null }; // don't reveal which emails exist
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1e6).padStart(6, '0');
  const r = read(K.resets, {});
  r[email] = { code: await hash(code), exp: Date.now() + 10 * 60000 };
  write(K.resets, r);
  return { devCode: code }; // real backend: email this, return nothing
}
export async function resetPassword(email, code, newPw) {
  email = norm(email);
  const r = read(K.resets, {});
  const e = r[email];
  if (!e || e.exp < Date.now() || !(await verify(code, e.code))) throw new Error('That code is invalid or has expired.');
  const pw = await hash(newPw);
  mutate(users().find((x) => x.email === email).id, (x) => ({ ...x, pw }));
  delete r[email];
  write(K.resets, r);
}

// ---- admin: manage users ----
export function listUsers(actorId) { assertAdmin(actorId); return users().map(pub); }
export async function createUser(actorId, { name, email, password, role }) {
  assertAdmin(actorId);
  email = norm(email);
  if (users().some((u) => u.email === email)) throw new Error('A user with this email already exists.');
  const u = { id: uid(), name: name.trim(), email, role, status: 'active', phone: '', addresses: [],
    createdAt: Date.now(), pw: await hash(password) };
  saveUsers([...users(), u]);
  return pub(u);
}
export function setUserRole(actorId, id, role) {
  assertAdmin(actorId);
  if (id === actorId) throw new Error('You cannot change your own role.');
  return mutate(id, (u) => ({ ...u, role }));
}
export function setUserStatus(actorId, id, status) {
  assertAdmin(actorId);
  if (id === actorId) throw new Error('You cannot disable your own account.');
  return mutate(id, (u) => ({ ...u, status }));
}
export function deleteUser(actorId, id) {
  assertAdmin(actorId);
  if (id === actorId) throw new Error('You cannot delete your own account.');
  saveUsers(users().filter((u) => u.id !== id));
}

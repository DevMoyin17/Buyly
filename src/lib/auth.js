import { create } from "zustand";
import { persist } from "zustand/middleware";

const normalizeEmail = (email) => email.trim().toLowerCase();

const createSalt = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const hashPassword = async (password, salt) => {
  const value = `${salt}:${password}`;

  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(value),
    );
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  }

  // Fallback for non-secure contexts (e.g. LAN dev over plain HTTP).
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
};

const toPublicUser = (account) => ({
  id: account.id,
  name: account.name,
  email: account.email,
  createdAt: account.createdAt,
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],

      signUp: async ({ name, email, password }) => {
        const normalizedEmail = normalizeEmail(email);
        const accounts = get().accounts;

        if (accounts.some((account) => account.email === normalizedEmail)) {
          throw new Error("An account with this email already exists. Sign in instead.");
        }

        const salt = createSalt();
        const passwordHash = await hashPassword(password, salt);
        const account = {
          id: createId(),
          name: name.trim(),
          email: normalizedEmail,
          salt,
          passwordHash,
          createdAt: new Date().toISOString(),
        };
        const user = toPublicUser(account);

        set({ accounts: [...accounts, account], user });
        return user;
      },

      signIn: async ({ email, password }) => {
        const normalizedEmail = normalizeEmail(email);
        const account = get().accounts.find((entry) => entry.email === normalizedEmail);

        if (!account) {
          throw new Error("No account found with this email. Create an account to continue.");
        }

        const passwordHash = await hashPassword(password, account.salt);
        if (passwordHash !== account.passwordHash) {
          throw new Error("Incorrect password. Please try again.");
        }

        const user = toPublicUser(account);
        set({ user });
        return user;
      },

      signOut: () => set({ user: null }),
    }),
    {
      name: "glowora-auth",
      partialize: ({ user, accounts }) => ({ user, accounts }),
    },
  ),
);

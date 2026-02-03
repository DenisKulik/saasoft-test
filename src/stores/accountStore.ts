import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { nanoid } from "nanoid"

import type { Account, LabelItem } from "@/types"

export const useAccountStore = defineStore(
  "account",
  () => {
    const accounts = ref<Account[]>([])

    const parseLabels = (labelStr: string): LabelItem[] => {
      if (!labelStr.trim()) return []
      return labelStr
        .split(";")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((text) => ({ text }))
    }

    const addAccount = () => {
      const newAccount: Account = {
        id: nanoid(),
        label: "",
        accountType: "LDAP",
        login: "",
        password: null,
      }
      accounts.value.push(newAccount)
      return newAccount
    }

    const updateAccount = (id: string, updates: Partial<Account>) => {
      const index = accounts.value.findIndex((acc) => acc.id === id)
      if (index !== -1) {
        const current = accounts.value[index]
        if (!current) return

        accounts.value[index] = {
          id: current.id,
          label: updates.label ?? current.label,
          accountType: updates.accountType ?? current.accountType,
          login: updates.login ?? current.login,
          password: updates.password ?? current.password,
        }
      }
    }

    const removeAccount = (id: string) => {
      accounts.value = accounts.value.filter((acc) => acc.id !== id)
    }

    const getAccountById = (id: string) => {
      return computed(() => accounts.value.find((acc) => acc.id === id))
    }

    return {
      accounts,
      addAccount,
      updateAccount,
      removeAccount,
      getAccountById,
      parseLabels,
    }
  },
  {
    persist: {
      key: "account-manager",
      storage: localStorage,
      pick: ["accounts"],
    },
  },
)

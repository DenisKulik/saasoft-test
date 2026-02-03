export type AccountType = "LDAP" | "Локальная"

export interface LabelItem {
  text: string
}

export interface Account {
  id: string
  label: string
  accountType: AccountType
  login: string
  password: string | null
}

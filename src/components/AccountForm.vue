<script setup lang="ts">
import { watch, computed } from "vue"
import { Field, ErrorMessage, useForm, type FieldBindingObject } from "vee-validate"
import { Delete } from "@element-plus/icons-vue"
import { toTypedSchema } from "@vee-validate/zod"

import { createAccountSchema, type AccountFormValues } from "@/schemas/account"
import type { Account } from "@/types"

const { account } = defineProps<{
  account: Account
}>()

const emit = defineEmits<{
  update: [id: string, account: Account]
  remove: [id: string]
}>()

const initialValues = computed<AccountFormValues>(() => ({
  label: account.label || "",
  accountType: account.accountType,
  login: account.login || "",
  password: account.accountType === "Локальная" ? account.password || "" : null,
}))

const { setFieldValue, resetForm, validate, values, errors } = useForm({
  validationSchema: computed(() => toTypedSchema(createAccountSchema())),
  initialValues: initialValues.value,
})

const updateTypeValue = (field: FieldBindingObject<string>, value: "LDAP" | "Локальная") => {
  field.onChange(value)
  handleTypeChange(value)
}

const handleTypeChange = async (value: "LDAP" | "Локальная") => {
  if (value === "LDAP") {
    setFieldValue("password", null, false)
  }
}

const handleRemove = () => {
  emit("remove", account.id)
}

watch(
  values,
  async (newValue) => {
    const { valid } = await validate()
    if (!valid) return
    const updatedAccount: Account = {
      ...account,
      ...newValue,
      label: newValue.label ?? "",
      password: newValue.accountType === "Локальная" ? (newValue.password ?? "") : null,
    }
    emit("update", account.id, updatedAccount)
  },
  { deep: true, immediate: true },
)

watch(
  () => account,
  (newAccount) => {
    resetForm({
      values: {
        label: newAccount.label,
        accountType: newAccount.accountType,
        login: newAccount.login,
        password: newAccount.accountType === "Локальная" ? newAccount.password || "" : null,
      },
    })
  },
  { deep: true },
)
</script>

<template>
  <div class="account-form">
    <form class="account-form__form">
      <div class="account-form__row">
        <div class="account-form__field">
          <label class="account-form__label">Метка</label>
          <Field name="label" v-slot="{ field }">
            <ElInput
              :model-value="field.value"
              :maxlength="50"
              :class="{ 'account-form__control--error': errors.label }"
              placeholder="Например: админ;тест"
              show-word-limit
              @blur="field.onBlur"
              @update:model-value="field.onChange"
            />
          </Field>
          <ErrorMessage name="label" class="account-form__error" />
        </div>

        <div class="account-form__field">
          <label class="account-form__label">Тип записи</label>
          <Field name="accountType" v-slot="{ field }">
            <ElSelect
              :model-value="field.value"
              :class="{ 'account-form__control--error': errors.accountType }"
              placeholder="Выберите тип"
              @update:model-value="updateTypeValue(field, $event)"
            >
              <ElOption label="LDAP" value="LDAP" />
              <ElOption label="Локальная" value="Локальная" />
            </ElSelect>
          </Field>
          <ErrorMessage name="accountType" class="account-form__error" />
        </div>

        <div class="account-form__field">
          <label class="account-form__label">
            Логин
            <span class="account-form__required">*</span>
          </label>
          <Field name="login" v-slot="{ field }">
            <ElInput
              :model-value="field.value"
              :maxlength="100"
              :class="{ 'account-form__control--error': errors.login }"
              placeholder="Введите логин"
              show-word-limit
              @blur="field.onBlur"
              @update:model-value="field.onChange"
            />
          </Field>
          <ErrorMessage name="login" class="account-form__error" />
        </div>

        <div class="account-form__field" v-if="values.accountType === 'Локальная'">
          <label class="account-form__label">
            Пароль
            <span class="account-form__required">*</span>
          </label>
          <Field name="password" v-slot="{ field }">
            <ElInput
              :model-value="field.value"
              :maxlength="100"
              type="password"
              placeholder="Введите пароль"
              show-word-limit
              show-password
              :class="{ 'account-form__control--error': errors.password }"
              @blur="field.onBlur"
              @update:model-value="field.onChange"
            />
          </Field>
          <ErrorMessage name="password" class="account-form__error" />
        </div>

        <div class="account-form__field account-form__field--actions">
          <ElButton type="danger" :icon="Delete" circle @click="handleRemove" class="account-form__delete-btn" />
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.account-form {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  &__form {
    width: 100%;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
  }

  &__field {
    flex: 1;
    min-width: 200px;
    margin-bottom: 0;

    &--actions {
      display: flex;
      align-items: center;
      min-width: 60px;
    }
  }

  &__label {
    display: block;
    font-weight: 500;
    margin-bottom: 8px;
    color: #606266;
    font-size: 14px;
  }

  &__required {
    color: #f56c6c;
    margin-left: 4px;
  }

  &__control--error {
    :deep(.el-input__wrapper),
    :deep(.el-select__wrapper) {
      box-shadow: 0 0 0 1px #f56c6c inset;
    }
  }

  &__delete-btn {
    margin-top: 24px;
  }

  &__error {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 4px;
    min-height: 20px;
  }
}
</style>

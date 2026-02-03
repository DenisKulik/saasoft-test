<script setup lang="ts">
import { storeToRefs } from "pinia"
import { Plus, User, QuestionFilled } from "@element-plus/icons-vue"

import { useAccountStore } from "@/stores/accountStore.ts"

import AccountForm from "@/components/AccountForm.vue"

const accountStore = useAccountStore()
const { accounts } = storeToRefs(accountStore)
const { addAccount, updateAccount, removeAccount } = accountStore
</script>

<template>
  <div class="account-list">
    <div class="account-list__header">
      <div class="account-list__title">
        <h2 class="account-list__heading">Учетные записи</h2>
        <ElButton type="primary" @click="addAccount" :icon="Plus" class="account-list__add-btn" />
      </div>
      <div class="account-list__hint">
        <ElIcon :size="20" color="#909399">
          <QuestionFilled />
        </ElIcon>
        <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
      </div>
    </div>

    <div class="account-list__container">
      <div v-if="accounts.length === 0" class="account-list__empty">
        <ElEmpty description="Нет учетных записей">
          <template #image>
            <ElIcon :size="60" color="#909399">
              <User />
            </ElIcon>
          </template>
        </ElEmpty>
      </div>

      <div v-else class="account-list__items">
        <AccountForm
          v-for="account in accounts"
          :key="account.id"
          :account="account"
          @remove="removeAccount"
          @update="updateAccount"
          class="account-list__item"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.account-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 2px solid #f0f2f5;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__heading {
    margin: 0;
    color: #303133;
    font-size: 24px;
    font-weight: 600;
  }

  &__hint {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: aliceblue;
  }

  &__add-btn {
    height: 40px;
  }

  &__container {
    margin-top: 24px;
  }

  &__empty {
    text-align: center;
    padding: 60px 24px;
    background: #fff;
    border-radius: 12px;
    border: 2px dashed #dcdfe6;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__item {
    transition: all 0.3s ease;
  }
}
</style>

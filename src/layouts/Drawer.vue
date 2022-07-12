<template>
  <q-drawer :model-value="$store.state.app.drawer" show-if-above bordered
            content-class="bg-grey-1" :width="280"
            @update:model-value="$store.commit('app/setDrawer', $event)">
    <q-list class="q-py-md">
      <q-item v-for="m in menus" :key="`menu-${m.name}`" dense class="q-pl-lg"
              :to="m.route" active-class="bg-primary text-white">
        <q-item-section side style="color: inherit">
          <q-icon :name="m.icon" size="1.1rem"/>
        </q-item-section>

        <q-item-section class="q-py-sm q-pl-sm">
          {{ m.label }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'

const menus = computed(() => [
  {
    label: 'Users',
    icon: 'people',
    route: { name: 'users' },
  },
  {
    label: 'Roles',
    icon: 'corporate_fare',
    route: { name: 'roles' },
  },
  {
    label: 'Permissions',
    icon: 'fitbit',
    route: { name: 'perms' },
  },
])
</script>

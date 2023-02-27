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
import _ from 'lodash'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { cns } from 'boot/cns'

const store = useStore()

const hasPerm = store.getters['profile/hasPerm']

const menus = computed(() => _.reject([
  hasPerm(cns.PermMUsr) && {
    label: 'Users',
    icon: 'people',
    route: { name: 'users' },
  },
  hasPerm(cns.PermMRole) && {
    label: 'Roles',
    icon: 'corporate_fare',
    route: { name: 'roles' },
  },
  hasPerm(cns.PermMPerm) && {
    label: 'Permissions',
    icon: 'fitbit',
    route: { name: 'perms' },
  },
  hasPerm(cns.PermMApp) && {
    label: 'Applications',
    icon: 'grid_view',
    route: { name: 'applications' },
  },
  store.getters['profile/isSAdmin'] && {
    label: 'Configurations',
    icon: 'settings',
    route: { name: 'config' },
  },
], x => !x))
</script>

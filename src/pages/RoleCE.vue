<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div>
        <ac-page-toolbar bb>
          <ac-page-title>
            {{ id ? 'Role' : 'Create role' }}
          </ac-page-title>
        </ac-page-toolbar>

        <div class="relative-position" style="min-height: 50px">
          <div v-if="!loading && data" class="row">
            <div class="col-12 col-md-10 col-lg-6">
              <div class="row items-start q-col-gutter-md">
                <!-- active -->
                <div v-if="data.is_system" class="col-12 text-negative">
                  System
                </div>

                <!-- id -->
                <div class="col-12 col-md-6">
                  <q-input outlined
                           :readonly="data.is_system"
                           label="ID"
                           v-model="data.id"/>
                </div>

                <!-- name -->
                <div class="col-12 col-md-6">
                  <q-input outlined
                           :readonly="data.is_system"
                           label="Name"
                           v-model="data.name"/>
                </div>

                <!-- selected-perms -->
                <div class="col-12 col-md-6">
                  <ac-section-title>Selected permissions</ac-section-title>

                  <q-scroll-area visible
                                 :thumb-style="$u.verScrollBarStyle().thumb"
                                 :bar-style="$u.verScrollBarStyle().bar"
                                 style="height: 300px"
                                 class="br1">
                    <q-list separator dense>
                      <q-item v-for="perm in data.perms" :key="`role-perm-${perm}`">
                        <q-item-section>
                          {{ perm }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </div>

                <!-- all-perms -->
                <div v-if="!data.is_system" class="col-12 col-md-6">
                  <ac-section-title>All permissions</ac-section-title>

                  <q-scroll-area visible
                                 :thumb-style="$u.verScrollBarStyle().thumb"
                                 :bar-style="$u.verScrollBarStyle().bar"
                                 style="height: 300px"
                                 class="br1">
                    <q-list separator dense>
                      <q-item v-for="p in perms" :key="`perm-${p.id}`" tag="label" clickable
                              :disable="permsAll && p.id !== $cns.PermAll">
                        <q-item-section side>
                          <q-checkbox dense :model-value="data.perms" :val="p.id"
                                      :disable="permsAll && p.id !== $cns.PermAll"
                                      @update:model-value="onPermsInput" />
                        </q-item-section>

                        <q-item-section>
                          {{ p.id }}
                        </q-item-section>

                        <q-item-section v-if="p.is_system" side>
                          system
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </div>
              </div>

              <template v-if="!data.is_system">
                <div class="q-pt-lg q-pb-md"/>

                <div class="row items-center q-gutter-x-md">
                  <div>
                    <q-btn unelevated :label="isCreating ? 'Create' : 'Save'" color="positive"
                           @click="onSubmitClick"/>
                  </div>

                  <div v-if="!isCreating">
                    <q-btn unelevated label="Delete" color="negative" @click="onDeleteClick"/>
                  </div>
                </div>
              </template>

              <div class="q-pt-lg"/>
            </div>
          </div>

          <ac-spinner :showing="loading"/>
        </div>
      </div>
    </div>

    <router-view/>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n/index'
import { cns } from 'boot/cns'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()
const { t } = useI18n()

const props = defineProps({
  rid: {},
})

const id = computed(() => (parseInt(route.params.role_id) || 0))
const isCreating = computed(() => !id.value)
const loading = ref(false)
const perms = ref([])
const data = ref({
  id: '',
  is_system: false,
  name: '',
  perms: [],
})
const permsAll = computed(() => !!_.find(data.value.perms, x => x === cns.PermAll))

const fetch = () => {
  loading.value = true
  Promise.all([
    fetchData(),
    fetchPerms(),
  ]).catch(err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).then(() => {
    loading.value = false
  })
}

const fetchData = async () => {
  if (isCreating.value) return

  return store.dispatch('role/get', id.value).then(resp => {
    data.value = resp.data
  })
}

const fetchPerms = async () => {
  return store.dispatch('perm/list').then(resp => {
    perms.value = resp.data
  })
}

const onPermsInput = v => {
  if (_.find(v, x => x === cns.PermAll)) {
    v = [cns.PermAll]
  }
  data.value.perms = v
}

const onSubmitClick = () => {
  loading.value = true
  store.dispatch('role/save', {
    id: id.value,
    data: data.value,
  }).then(() => {
    $q.notify({ type: 'positive', message: t('success_perform_msg') })
    router.back()
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).then(() => {
    loading.value = false
  })
}

const onDeleteClick = () => {
  $q.dialog({
    message: 'Are you sure you want to delete the role?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    loading.value = true
    store.dispatch('role/remove', id.value).then(() => {
      $q.notify({ type: 'positive', message: t('success_perform_msg') })
      router.back()
    }, err => {
      $q.notify({ type: 'negative', message: err.data.desc })
    }).then(() => {
      loading.value = false
    })
  })
}

onMounted(fetch)
</script>

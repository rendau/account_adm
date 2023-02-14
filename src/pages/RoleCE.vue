<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div>
        <!-- toolbar -->
        <ac-page-toolbar bb>
          <ac-page-title>
            {{ id ? 'Role' : 'Create role' }}
          </ac-page-title>
        </ac-page-toolbar>

        <div class="relative-position" style="min-height: 50px">
          <div v-if="!loading && data" class="row">
            <div class="col-12 col-md-10 col-lg-6">
              <div class="row items-start q-col-gutter-md">
                <!-- system -->
                <div v-if="!enabled" class="col-12 text-negative">
                  System
                </div>

                <!-- code -->
                <div class="col-12 col-md-4">
                  <q-input outlined
                           :readonly="!enabled"
                           label="Code"
                           v-model="data.code"/>
                </div>

                <!-- name -->
                <div class="col-12 col-md-8">
                  <q-input outlined
                           :readonly="!enabled"
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
                                 class="br1 rounded-borders">
                    <q-list separator dense>
                      <template v-for="app in selectedPermApps">
                        <q-item-label class="text-caption q-pl-sm q-pt-sm">
                          {{ app.name }}
                        </q-item-label>

                        <q-item v-for="p in app.perms" :key="`perm-${p.id}`">
                          <q-item-section>
                            <div class="text-weight-medium">
                              {{ p.code }}
                            </div>

                            <div v-if="p.dsc" class="text-caption text-grey-6">
                              {{ p.dsc }}
                            </div>
                          </q-item-section>

                          <q-item-section v-if="p.is_system" side class="text-caption">
                            system
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-scroll-area>
                </div>

                <!-- all-perms -->
                <div v-if="enabled" class="col-12 col-md-6">
                  <ac-section-title>All permissions</ac-section-title>

                  <q-scroll-area visible
                                 :thumb-style="$u.verScrollBarStyle().thumb"
                                 :bar-style="$u.verScrollBarStyle().bar"
                                 style="height: 300px"
                                 class="br1 rounded-borders">
                    <q-list separator dense>
                      <template v-for="app in permApps">
                        <q-item-label class="text-caption q-pl-sm q-pt-sm">
                          {{ app.name }}
                        </q-item-label>

                        <q-item v-for="p in app.perms" :key="`perm-${p.id}`"
                                tag="label" clickable :disable="app.hasAllPerm && !p.is_all">
                          <q-item-section side>
                            <q-checkbox dense :model-value="data.perm_ids" :val="p.id"
                                        :disable="app.hasAllPerm && !p.is_all"
                                        @update:model-value="onPermsInput"/>
                          </q-item-section>

                          <q-item-section>
                            <div class="text-weight-medium">
                              {{ p.code }}
                            </div>

                            <div v-if="p.dsc" class="text-caption text-grey-6">
                              {{ p.dsc }}
                            </div>
                          </q-item-section>

                          <q-item-section v-if="p.is_system" side class="text-caption">
                            system
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-scroll-area>
                </div>
              </div>

              <!-- actions -->
              <template v-if="enabled">
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
  code: '',
  name: '',
  perm_ids: [],
})

const permApps = computed(() => {
  return _.map(_.uniq(_.map(perms.value, 'app_id')), id => {
    return _.assign({}, _.find(store.state.dic.apps, { id }) || {}, {
      perms: _.filter(perms.value, { app_id: id }),
    })
  })
})
const selectedPermApps = computed(() => {
  return _.filter(_.map(permApps.value, app => {
    let filteredPerms = _.filter(app.perms, p => _.find(data.value.perm_ids, x => x === p.id))
    return _.assign({}, app, {
      perms: filteredPerms,
      hasAllPerm: !!_.find(filteredPerms, { is_all: true }),
    })
  }), x => x.perms.length > 0)
})
const enabled = computed(() => !data.value.is_system)

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
  let prs = _.map(v, id => _.find(perms.value, { id }))
  _.each(_.filter(prs, { is_all: true }), p => {
    prs = _.reject(prs, x => x.app_id === p.app_id && x.id !== p.id)
  })
  data.value.perm_ids = _.map(prs, 'id')
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

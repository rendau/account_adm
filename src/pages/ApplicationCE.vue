<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div>
        <ac-page-toolbar bb>
          <ac-page-title>
            {{ id ? 'Application' : 'Create application' }}
          </ac-page-title>
        </ac-page-toolbar>

        <div class="relative-position" style="min-height: 50px">
          <div v-if="!loading && data" class="row">
            <div class="col-12">
              <div class="row items-start q-col-gutter-md">
                <!-- is_account_app -->
                <div v-if="!enabled" class="col-12 text-negative">
                  System
                </div>

                <!-- name -->
                <div class="col-12 col-md-7">
                  <q-input outlined
                           :readonly="!enabled"
                           label="Name"
                           v-model="data.name"/>
                </div>

                <!-- perm_url -->
                <div class="col-12 col-md-7">
                  <q-input outlined
                           :readonly="!enabled"
                           label="Perm Url"
                           debounce="500"
                           v-model="data.perm_url"
                           @update:model-value="onPermUrlChange">
                    <template v-slot:append v-if="fetchingPerms">
                      <ac-spn size="1.5rem"/>
                    </template>

                    <template v-slot:append v-else-if="permsOk">
                      <q-icon name="task_alt" color="positive" size="1.6rem"/>
                    </template>

                    <template v-slot:after v-if="!isCreating && !permUrlChanged">
                      <q-btn dense no-caps unelevated icon="refresh" label="reload"
                             :loading="syncingPerms" color="secondary" size=".8rem" class="q-px-sm"
                             @click="onSyncPermsClick"/>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>

          <!-- actions -->
          <template v-if="enabled">
            <div class="q-pt-lg q-pb-md"/>

            <div class="row items-center q-gutter-x-md">
              <div>
                <q-btn unelevated :label="isCreating ? 'Create' : 'Save'" color="positive" @click="onSubmitClick"/>
              </div>

              <div v-if="!isCreating">
                <q-btn unelevated label="Delete" color="negative" @click="onDeleteClick"/>
              </div>
            </div>
          </template>

          <div class="q-pt-lg"/>

          <ac-spinner :showing="loading"/>
        </div>
      </div>
    </div>

    <router-view/>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n/index'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()
const { t } = useI18n()

const props = defineProps({
  rid: {},
})

const id = computed(() => (parseInt(route.params.application_id) || 0))
const isCreating = computed(() => !id.value)
const loading = ref(false)
const permUrlChanged = ref(false)
const fetchingPerms = ref(false)
const syncingPerms = ref(false)
const permsOk = ref(false)
const data = ref({
  id: '',
  name: '',
  perm_url: '',
})
const enabled = computed(() => !data.value.is_account_app)

const fetch = () => {
  if (isCreating.value) return

  loading.value = true
  store.dispatch('application/get', id.value).then(resp => {
    data.value = resp.data
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).then(() => {
    loading.value = false
  })
}

const fetchPerms = uri => {
  if (fetchingPerms.value) return
  if (!uri) return

  fetchingPerms.value = true
  store.dispatch('application/fetchPerms', uri).then(resp => {
    permsOk.value = resp.data?.perms?.length > 0
  }, () => {}).then(() => {
    fetchingPerms.value = false
  })
}

const onPermUrlChange = v => {
  if (isCreating.value) return

  permUrlChanged.value = true
  permsOk.value = false

  if (!v) return

  return fetchPerms(v)
}

const onSyncPermsClick = () => {
  if (isCreating.value) return

  syncingPerms.value = true
  store.dispatch('application/syncPerms', id.value).then(() => {
    $q.notify({ type: 'positive', message: t('success_perform_msg') })
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).then(() => {
    syncingPerms.value = false
  })
}

const onSubmitClick = () => {
  loading.value = true
  store.dispatch('application/save', {
    id: id.value,
    data: data.value,
  }).then(() => {
    $q.notify({ type: 'positive', message: t('success_perform_msg') })
    router.back()
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
    loading.value = false
  })
}

const onDeleteClick = () => {
  $q.dialog({
    message: 'Are you sure you want to delete the application?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    loading.value = true
    store.dispatch('application/remove', id.value).then(() => {
      $q.notify({ type: 'positive', message: t('success_perform_msg') })
      router.back()
    }, err => {
      $q.notify({ type: 'negative', message: err.data.desc })
      loading.value = false
    })
  })
}

onMounted(fetch)
</script>

<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div>
        <ac-page-toolbar bb>
          <ac-page-title>
            {{ id ? 'Permission' : 'Create permission' }}
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

                <!-- app_id -->
                <div class="col-12 col-md-6">
                  <q-select options-dense outlined map-options emit-value
                            label="App"
                            :readonly="data.is_system"
                            v-model="data.app_id"
                            :options="appOps"/>
                </div>

                <div class="gt-sm col-6"/>

                <!-- code -->
                <div class="col-12 col-md-6">
                  <q-input outlined
                           :readonly="data.is_system"
                           label="Code"
                           v-model="data.code"/>
                </div>

                <!-- is_all -->
                <div class="col-12 col-md-6">
                  <q-toggle :disable="data.is_system"
                            label="Is All"
                            v-model="data.is_all"/>
                </div>

                <!-- dsc -->
                <div class="col-12">
                  <q-input outlined
                           :readonly="data.is_system"
                           label="Description"
                           v-model="data.dsc"/>
                </div>
              </div>
            </div>
          </div>

          <template v-if="!data.is_system">
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
import { util } from 'boot/util'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()
const { t } = useI18n()

const props = defineProps({
  rid: {},
})

const id = computed(() => (parseInt(route.params.perm_id) || 0))
const isCreating = computed(() => !id.value)
const loading = ref(false)
const data = ref({
  code: '',
  is_all: false,
  app_id: null,
  dsc: '',
  is_system: false,
})
const apps = computed(() => {
  let res = store.state.dic.apps
  if (!data.value.is_system) {
    return _.reject(res, { is_account_app: true })
  }
  return res
})
const appOps = computed(() => util.lOps(apps.value))

const fetch = () => {
  if (isCreating.value) return

  loading.value = true
  store.dispatch('perm/get', id.value).then(resp => {
    data.value = resp.data
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).then(() => {
    loading.value = false
  })
}

const onSubmitClick = () => {
  loading.value = true
  store.dispatch('perm/save', {
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
    message: 'Are you sure you want to delete the permission?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    loading.value = true
    store.dispatch('perm/remove', id.value).then(() => {
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

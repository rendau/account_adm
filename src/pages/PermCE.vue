<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div>
        <ac-page-toolbar bb>
          <ac-page-title>
            {{ id ? 'Edit permission' : 'Create permission' }}
          </ac-page-title>
        </ac-page-toolbar>

        <div class="relative-position" style="min-height: 50px">
          <template v-if="!loading && data">
            <div class="row items-start q-col-gutter-md">
              <!-- active -->
              <div class="col-12 col-md-6">
                <q-toggle label="Is system" v-model="data.is_system"/>
              </div>

              <div class="gt-sm col-6"/>

              <!-- id -->
              <div class="col-12 col-md-6">
                <q-input outlined
                         :disable="!isCreating"
                         label="ID"
                         v-model="data.id"/>
              </div>

              <!-- app -->
              <div class="col-12 col-md-6">
                <q-input outlined
                         label="Application"
                         v-model="data.app"/>
              </div>
            </div>

            <div class="q-pt-lg q-pb-md"/>

            <div>
              <q-btn unelevated :label="id ? 'Save' : 'Create'" color="positive" @click="onSubmitClick"/>
            </div>

            <div class="q-pt-lg"/>
          </template>

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

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()

const props = defineProps({
  rid: {},
})

const id = computed(() => (route.params.perm_id || ''))
const isCreating = computed(() => !id.value)
const loading = ref(false)
const data = ref({
  id: '',
  app: '',
  is_system: false,
  dsc: '',
})

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
  // loading.value = true
  // if (id.value) {
  //   data.value.id = id.value
  // }
  // store.dispatch('prv/save', {
  //   id: id.value,
  //   data: data.value,
  // }).then(() => {
  //   $q.notify({ type: 'positive', message: t('success_perform_msg') })
  //   router.back()
  // }, err => {
  //   $q.notify({ type: 'negative', message: err.data.desc })
  // }).then(() => {
  //   loading.value = false
  // })
}

onMounted(fetch)
</script>

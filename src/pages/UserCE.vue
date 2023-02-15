<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div>
        <!-- toolbar -->
        <ac-page-toolbar bb>
          <ac-page-title>
            {{ id ? 'User' : 'Create user' }}
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

                <!-- phone -->
                <div class="col-12 col-md-4">
                  <q-input outlined
                           :readonly="!enabled"
                           type="tel"
                           label="Phone"
                           v-model="data.phone"
                           mask="# (###) ### ####"
                           unmasked-value
                           prefix="+"
                           :disable="loading"/>
                </div>

                <!-- name -->
                <div class="col-12 col-md-8">
                  <q-input outlined
                           :readonly="!enabled"
                           label="Name"
                           v-model="data.name"/>
                </div>

                <!-- selected-roles -->
                <div class="col-12 col-md-6">
                  <ac-section-title>Selected roles</ac-section-title>

                  <q-scroll-area visible
                                 :thumb-style="$u.verScrollBarStyle().thumb"
                                 :bar-style="$u.verScrollBarStyle().bar"
                                 style="height: 300px"
                                 class="br1 rounded-borders q-py-xs">
                    <q-list separator dense>
                      <q-item v-for="r in selectedRoles" :key="`role-${r.id}`">
                        <q-item-section>
                          <div class="text-weight-medium">
                            {{ r.name }}
                          </div>
                        </q-item-section>

                        <q-item-section v-if="r.is_system" side class="text-caption">
                          system
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-scroll-area>
                </div>

                <!-- all-roles -->
                <div v-if="enabled" class="col-12 col-md-6">
                  <ac-section-title>All permissions</ac-section-title>

                  <q-scroll-area visible
                                 :thumb-style="$u.verScrollBarStyle().thumb"
                                 :bar-style="$u.verScrollBarStyle().bar"
                                 style="height: 300px"
                                 class="br1 rounded-borders q-py-xs">
                    <q-list separator dense>
                      <q-item v-for="r in roles" :key="`role-${r.id}`"
                              tag="label" clickable>
                        <q-item-section side>
                          <q-checkbox dense v-model="data.role_ids" :val="r.id"/>
                        </q-item-section>

                        <q-item-section>
                          <div class="text-weight-medium">
                            {{ r.name }}
                          </div>
                        </q-item-section>

                        <q-item-section v-if="r.is_system" side class="text-caption">
                          system
                        </q-item-section>
                      </q-item>
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

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()
const { t } = useI18n()

const props = defineProps({
  rid: {},
})

const id = computed(() => (parseInt(route.params.user_id) || 0))
const isCreating = computed(() => !id.value)
const loading = ref(false)
const roles = computed(() => store.state.dic.roles)
const data = ref({
  phone: '',
  name: '',
  ava: '',
  role_ids: [],
})
const enabled = computed(() => true)
const selectedRoles = computed(() => _.filter(roles.value, r => _.includes(data.value.role_ids, r.id)))

const fetch = () => {
  if (isCreating.value) return

  store.dispatch('user/get', id.value).then(resp => {
    data.value = resp.data
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).then(() => {
    loading.value = false
  })
}

const onSubmitClick = () => {
  loading.value = true
  store.dispatch('user/save', {
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
    message: 'Are you sure you want to delete the user?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    loading.value = true
    store.dispatch('user/remove', id.value).then(() => {
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
<script setup>
import { DatasetCard } from '@etalab/data.gouv.fr-components'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useReuseStore } from '@/store/ReuseStore'

const router = useRouter()
const reuseStore = useReuseStore()

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const fetchedReuses = ref([])
const loadReuses = async () => {
  fetchedReuses.value = await reuseStore.loadReusesByUrl(props.url)
}

const zIndex = (key) => {
  return { zIndex: fetchedReuses.value.length - key }
}

// const getReusePage = (id) => {
//   return { name: 'reuse_detail', params: { rid: id } }
// }

// const getOrganizationPage = (org) => {
//   if (org && org.id) {
//     if (router.hasRoute('organization_detail')) {
//       return { name: 'organization_detail', params: { oid: org.id } }
//     }
//   }
//   return ''
// }

onMounted(() => {
  loadReuses()
})
</script>

<template>
  <div
    v-if="fetchedReuses.length > 0"
    style="display: flex; flex-wrap: wrap"
    class="datagouv-components fr-col-md-12"
  >
    <span v-for="fr in fetchedReuses" v-bind:key="fr.title">
      <DsfrCard
        style="width: 350px; margin-right: 30px; margin-bottom: 30px"
        alt-img="altImg"
        :img-src="fr.image"
        :link="fr.url"
        :title="fr.title"
      />
    </span>
  </div>
  <div v-else>
    <div
      style="
        height: 50px;
        width: 100%;
        background-color: #a9c8fb;
        line-height: 50px;
        padding-left: 20px;
        border-radius: 5px;
        font-style: italic;
      "
    >
      Pas encore de réutilisation
    </div>
  </div>
</template>

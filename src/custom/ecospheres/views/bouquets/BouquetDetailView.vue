<script setup lang="ts">
import {
  ReadMore,
  OrganizationNameWithCertificate
} from '@etalab/data.gouv.fr-components'
import { onMounted, ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useLoading } from 'vue-loading-overlay'
import { useRouter } from 'vue-router'

import DatasetSimpleList from '@/components/DatasetSimpleList.vue'
import DiscussionsList from '@/components/DiscussionsList.vue'
import ReuseSimpleList from '@/components/ReuseSimpleList.vue'
import config from '@/config'
import BouquetDatasetList, {
  getDatasetListTitle
} from '@/custom/ecospheres/components/BouquetDatasetList.vue'
import type { Theme, Topic, DatasetProperties } from '@/model'
import { useRouteParamsAsString } from '@/router/utils'
import { useTopicStore } from '@/store/TopicStore'
import { useUserStore } from '@/store/UserStore'
import { descriptionFromMarkdown, formatDate } from '@/utils'
import { getOwnerAvatar } from '@/utils/avatar'
import { useSpatialCoverage } from '@/utils/spatial'

const route = useRouteParamsAsString()
const router = useRouter()
const store = useTopicStore()
const loading = useLoading()

const bouquet: Ref<Topic | null> = ref(null)
const theme = ref()
const subtheme = ref()
const selectedTabIndex = ref(0)
const breadcrumbLinks = ref([
  {
    to: '/',
    text: 'Accueil'
  },
  {
    to: '/',
    text: 'Défis'
  }
])
const selectedTheme = ref('')
const spatialCoverage = useSpatialCoverage(bouquet)

const showDiscussions = config.website.discussions.topic.display
const bouquetsType = config.bouquets.type
const bouquetsDisplayAuthor = config.bouquets.display_author

const description = computed(() => descriptionFromMarkdown(bouquet))

const canEdit = computed(() => {
  return useUserStore().hasEditPermissions(bouquet.value as Topic)
})

const datasetsProperties = computed((): DatasetProperties[] => {
  return bouquet.value?.extras['ecospheres:datasets_properties'] ?? []
})

const goToEdit = () => {
  router.push({ name: 'bouquet_edit', params: { bid: bouquet.value?.id } })
}

const getTheme = (themeName: string): Theme => {
  return config.themes.find((theme: Theme) => theme.name === themeName)
}

onMounted(() => {
  const loader = loading.show()
  store
    .load(route.params.bid)
    .then((res) => {
      bouquet.value = res
      breadcrumbLinks.value.push()
    })
    .finally(() => loader.hide())
})
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb class="fr-mb-1v" :links="breadcrumbLinks" />
  </div>
  <div v-if="bouquet" class="fr-container datagouv-components fr-mb-4w">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-12">
        <div class="bouquet__header fr-mb-2v">
          <h1 class="fr-mb-2v fr-mr-2v">{{ bouquet.name }}</h1>
        </div>
        <ReadMore max-height="600">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="description"></div>
        </ReadMore>
      </div>
    </div>

    <DsfrTabs
      class="fr-mt-2w"
      tab-list-name="Groupes d'attributs du bouquet"
      :tab-titles="[{ title: 'Données' }, { title: 'Réutilisations' }]"
      :initial-selected-index="0"
      :selected-tab-index="selectedTabIndex"
      @select-tab="(idx: number) => (selectedTabIndex = idx)"
    >
      <!-- Jeux de données -->
      <DsfrTabContent
        v-if="bouquetsType == 'custom'"
        panel-id="tab-content-0"
        tab-id="tab-0"
        :selected="selectedTabIndex === 0"
      >
        <h2>{{ getDatasetListTitle(datasetsProperties) }}</h2>
        <BouquetDatasetList :datasets="datasetsProperties" />
      </DsfrTabContent>
      <!-- Jeux de données classique -->
      <DsfrTabContent
        v-if="bouquetsType == 'data.gouv.fr'"
        panel-id="tab-content-0"
        tab-id="tab-0"
        :selected="selectedTabIndex === 0"
      >
        <DatasetSimpleList :url="bouquet.datasets.href" />
      </DsfrTabContent>

      <DsfrTabContent
        v-if="bouquetsType == 'data.gouv.fr'"
        panel-id="tab-content-1"
        tab-id="tab-1"
        :selected="selectedTabIndex === 1"
      >
        <ReuseSimpleList :url="bouquet.reuses.href" />
      </DsfrTabContent>
    </DsfrTabs>
  </div>
</template>

<style scoped lang="scss">
.bouquet {
  &__header {
    display: flex;
    align-items: center;
    flex-flow: wrap;
  }
}
</style>

<script setup lang="ts">
import {
  formatRelativeIfRecentDate,
  OrganizationNameWithCertificate,
  useOwnerName
} from '@datagouv/components'
import { toRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import OrganizationLogo from '@/components/OrganizationLogo.vue'
import type { Topic } from '@/model/topic'
import { getOwnerAvatar } from '@/utils/avatar'
import { useExtras } from '@/utils/bouquet'
import { useTopicsConf } from '@/utils/config'
import { useSpatialCoverage } from '@/utils/spatial'
import { useThemeOptions } from '@/utils/theme'

const { topicsSlug } = useTopicsConf()

const props = defineProps({
  bouquet: {
    type: Object as () => Topic,
    required: true
  }
})

const bouquetRef = toRef(props, 'bouquet')
const spatialCoverage = useSpatialCoverage(bouquetRef)

const ownerName = useOwnerName(props.bouquet)

const { theme, subtheme, datasetsProperties } = useExtras(bouquetRef)

const nbData: number = datasetsProperties.value.length

const bouquetLink: RouteLocationRaw = {
  name: `${topicsSlug}_detail`,
  params: { bid: props.bouquet.slug }
}

const { themeColors } = useThemeOptions(theme)
</script>

<template>
  <article
    class="fr-my-md-3w fr-px-3w fr-py-2w border border-default-grey fr-enlarge-link"
  >
    <div
      v-if="bouquet.private"
      class="absolute top-0 fr-grid-row fr-grid-row--middle fr-mt-n3v"
    >
      <p class="fr-badge fr-badge--mention-grey fr-mr-1w">Brouillon</p>
    </div>
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <DsfrTag
          class="fr-card__detail fr-mt-1w fr-mb-1w card__tag"
          :label="subtheme"
        />
      </div>
    </div>
    <div class="fr-grid-row fr-pt-2v">
      <div class="fr-col-12 fr-col-sm-3">
        <OrganizationLogo
          v-if="bouquet.organization"
          :size="64"
          :object="bouquet"
        />
        <div v-else class="border fr-p-1-5v fr-mr-1-5v" style="width: 77px">
          <img
            :src="getOwnerAvatar(bouquet)"
            alt=""
            loading="lazy"
            class="owner-avatar"
            height="64"
            width="64"
          />
        </div>
      </div>
      <div class="fr-col-12 fr-col-sm-9 fr-pl-2v">
        <h3 class="fr-mb-1v fr-grid-row h4">
          <RouterLink :to="bouquetLink" class="text-grey-500">
            {{ bouquet.name }}
          </RouterLink>
        </h3>
        <p
          v-if="bouquet.organization || bouquet.owner"
          class="fr-m-0 fr-text--sm"
        >
          Par
          <template v-if="bouquet.organization">
            <OrganizationNameWithCertificate
              :organization="bouquet.organization"
            />
          </template>
          <template v-else>{{ ownerName }}</template>
        </p>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
      <div class="fr-col-12">
        <p class="fr-m-0 fr-text--sm flex align-center fr-pt-3v">
          <VIcon name="ri:time-line" class="fr-mr-1v text-grey-380" />
          mis à jour {{ formatRelativeIfRecentDate(bouquet.last_modified) }}
        </p>
        <p class="fr-tag fr-mt-2v">
          <VIcon name="ri-database-2-line" class="fr-mr-1v" />
          <span class="fr-mr-1v">
            {{
              `${nbData > 0 ? nbData : 'Aucune'} donnée${nbData > 1 ? 's' : ''}`
            }}
          </span>
        </p>
        <p v-if="spatialCoverage" class="fr-tag fr-ml-1w">
          <VIcon name="ri-map-2-line" class="fr-mr-1v" />
          <span class="fr-mr-1v">
            {{ spatialCoverage.name }}
          </span>
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.owner-avatar {
  margin-bottom: -6px;
  display: inline-block;
}
.card__tag {
  color: v-bind('themeColors.color');
  background-color: v-bind('themeColors.background');
}

.fr-card__detail,
:deep(h3) {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  line-height: inherit;
}
</style>

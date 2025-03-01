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
import { stripFromMarkdown } from '@/utils'
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
  },
  hideDescription: {
    type: Boolean,
    default: false
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
    class="fr-my-1w fr-px-3w fr-py-2w border border-default-grey fr-enlarge-link"
  >
    <div
      v-if="bouquet.private"
      class="absolute top-0 fr-grid-row fr-grid-row--middle fr-mt-n3v"
    >
      <p class="fr-badge fr-badge--mention-grey fr-mr-1w">Brouillon</p>
    </div>
    <div v-if="subtheme" class="fr-grid-row">
      <div class="fr-col-12">
        <DsfrTag
          class="fr-card__detail fr-mt-1w fr-mb-1w card__tag"
          :label="subtheme"
        />
      </div>
    </div>
    <div class="fr-grid-row fr-pt-2v align-center flex-nowrap">
      <div class="fr-col-12 fr-col-sm-2 bouquet-card-col-logo">
        <OrganizationLogo
          v-if="bouquet.organization"
          :size="43"
          :object="bouquet"
        />
        <div v-else class="border fr-p-1-5v fr-mr-1-5v inline-block">
          <img
            :src="getOwnerAvatar(bouquet)"
            alt=""
            loading="lazy"
            class="owner-avatar"
            height="42"
            width="42"
          />
        </div>
      </div>
      <div
        class="fr-col-12 fr-col-sm-10 fr-pl-2v overflow-hidden flex-1-1-auto"
      >
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
    <div v-if="!hideDescription" class="fr-grid-row description fr-mt-3v">
      <p class="fr-mb-1v">{{ stripFromMarkdown(bouquet.description) }}</p>
    </div>

    <p class="fr-mb-2v fr-text--sm flex align-center fr-pt-3v text-grey-380">
      <VIconCustom
        name="time-line"
        class="fr-mr-1w text-grey-380 fr-icon--sm"
      />
      Mis à jour {{ formatRelativeIfRecentDate(bouquet.last_modified) }}
    </p>

    <div class="fr-grid-row">
      <span class="fr-tag fr-mr-2v fr-mb-2v">
        <VIconCustom
          name="database-line"
          class="fr-mr-1v"
          size="lg"
          align="text-top"
        />
        <span class="fr-mr-1v">
          {{
            `${nbData > 0 ? nbData : 'Aucune'} donnée${nbData > 1 ? 's' : ''}`
          }}
        </span>
      </span>

      <span v-if="spatialCoverage" class="fr-tag fr-mb-2v">
        <VIconCustom
          name="road-map-line"
          class="fr-mr-1v"
          size="lg"
          align="text-top"
        />
        <span class="fr-mr-1v">
          {{ spatialCoverage.name }}
        </span>
      </span>
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

.bouquet-card-col-logo {
  max-width: 4.25rem;
}

.description p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

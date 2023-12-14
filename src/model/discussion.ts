import type { User } from '@etalab/data.gouv.fr-components'

import type { GenericResponse } from './api'

interface Discussion {
  discussion: Post[]
  id: string
  subject: Subject
  title: string
}

interface Post {
  content: string
  posted_by: User
  posted_on: string
}

interface Subject {
  class: 'Dataset' | 'Topic'
  id: SubjectId
}

type SubjectId = string

interface DiscussionResponse extends GenericResponse {
  data: Discussion[]
}

export type { Discussion, Post, Subject, SubjectId, DiscussionResponse }
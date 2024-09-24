import {all, takeEvery, take, select, call, put} from 'redux-saga/effects'
import {parse, differenceInCalendarDays} from 'date-fns'
import {includes, flattenDeep} from 'lodash'
import {apiRequest, api} from 'app/sagas'
import qs from 'qs'
import * as actions from './actions'
import imageToBase64 from 'lib/imageToBase64'
import {
  getImportAcitivitesArray,
  getOffset,
  getArchivedOffset,
} from './selectors'
import {getActive, setActive, fetch as fetchClubs} from 'clubs'
import {getIsFetching as getClubIsFetching} from 'clubs/selectors'
import {byId as recurringOptions} from 'activities/components/NewActivityForm/recurringOptions'
import {getActiveMemberId, getActiveType, getIsFetching} from 'user/selectors'

const twoDigits = (n) => (n < 10 ? `0${n}` : n)

const toUTC = (date) =>
  `${date.getUTCFullYear()}-${twoDigits(date.getUTCMonth() + 1)}-${twoDigits(
    date.getUTCDate()
  )}T${twoDigits(date.getUTCHours())}:${twoDigits(date.getUTCMinutes())}`

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

export function* watchFetchActivities() {
  yield takeEvery(actions.fetch.requested, fetchActivities)
}

function* fetchActivities({payload: {limit, archived, all: fetchAll}}) {

    if (!(yield select(getActive))) {
      yield all([put(fetchClubs.requested()), take(setActive)])
    }

    const userId = yield select(getActiveMemberId)
    const activeType = yield select(getActiveType);
    const isGroupLeader = activeType == 2 || activeType == 3;
    const isFetching = yield select(getIsFetching);
    const isClubFetching = yield select(getClubIsFetching);
    if (!isFetching && !isClubFetching && userId != null && isGroupLeader) {

    const {
      club: {id},
      offset,
    } = yield all({
      club: select(getActive),
      offset: select(archived ? getArchivedOffset : getOffset),
    })

    try {
      const {activities, totalCount} = yield call(
        apiRequest,
        `/web/activityoverview/${id}/${archived ? 'archived' : ''}${
          fetchAll ? '' : `?limit=${limit}&offset=${offset}`
        }`
      )

      yield put(actions.fetch.succeeded({archived, activities, totalCount}))
    } catch (error) {
      yield put(actions.fetch.failed(error))
    }
  }
}

function* watchCreate() {
  yield takeEvery(actions.create.requested, create)
}

function* watchadminAttendOrRemoveUserToActivity() {
  yield takeEvery(actions.adminAttendOrRemoveUserToActivity.requested, adminAttendOrRemoveUserToActivity)
}

function* create({
  payload: {
    start,
    end,
    deadline,
    recurring,
    recurringUntill,
    participants: {members, groups},
    commentsEnabled,
    participantsVisible,
    forcedParticipation,
    coverImage,
    images,
    copyFrom,
    amount,
    title,
    responsibleUserId,
    coHostIds,
    sendNotification,
    sharedToPublicCalendar,
    kevinPaymentDisabled,
    ...values
  },
  meta: {resolve, reject},
}) {
  const {id: clubId} = yield select(getActive)

  try {
    const base64HeaderImage = yield call(imageToBase64, coverImage)
    const response = yield call(apiRequest, '/activities/create', {
      method: 'post',
      version: 'v3',
      body: {
        ...values,
        ...(recurringOptions[recurring]
          ? {
              recurringEvery: recurringOptions[recurring].value,
              recurringTimes:
                Math.floor(
                  differenceInCalendarDays(recurringUntill, start) /
                    recurringOptions[recurring].numberOfDays
                ) + 1,
            }
          : {}),
        clubId,
        title,
        responsibleUserId,
        coHostIds,
        commentsDisabled: !commentsEnabled,
        participantListHidden: !participantsVisible,
        start: toUTC(parse(start)),
        end: end ? toUTC(parse(end)) : undefined,
        deadline: deadline ? toUTC(parse(deadline)) : undefined,
        copyFromId: copyFrom,
        coverImageBase64String: base64HeaderImage,
        amount,
        kevinPaymentDisabled,
        sharedToPublicCalendar
      },
    })

    const {
      payload: {
        entities: {activities},
        result,
      },
    } = yield put(actions.create.succeeded(response))

    if (images && images.length > 0 && !copyFrom) {
      yield call(uploadImages, activities[result].id, images)
    }

    if (Array.isArray(members)) {
      yield call(
        inviteMembers,
        activities[result].id,
        [responsibleUserId, ...members],
        !amount && forcedParticipation,
        sendNotification
      )
    }

    if (groups && groups.length > 0) {
      yield call(
        inviteGroups,
        activities[result].id,
        groups,
        !amount && forcedParticipation,
        sendNotification
      )
    }

    yield call(resolve)
    yield put(actions.fetch.requested({all: true}))
  } catch (error) {
    yield put(actions.create.failed(error))
    yield call(reject)
  }
}


export function* adminAttendOrRemoveUserToActivity({
  payload: {
    activityId,
    userId,
    initialStatus
  },
  meta: {resolve, reject},
}) {

  const {id: clubId} = yield select(getActive)
  try {
    const response = yield call(apiRequest, '/activities/AdminAttendOrRemoveUserToActivity', {
      method: 'post',
      version: 'v4',
      body: {
        clubId,
        initialStatus,
        activityId,
        userId
      },
    })
    yield put(actions.adminAttendOrRemoveUserToActivity.succeeded())
    yield call(resolve)
    yield put(actions.fetch.requested({all: true}))
  } catch (error) {
    console.log('error', error)
    yield put(actions.adminAttendOrRemoveUserToActivity.failed(error))
    yield call(reject)
  }

}

function* uploadImages(activityId, files) {
  const formData = new FormData()
  yield all(
    files.map((file, i) =>{
      return call([formData, 'append'], `image${i}`, file, file.name)
    }
    )
  )

  const response = yield call(
    apiRequest,
    `/web/newactivityimages/${activityId}`,
    {
      method: 'post',
      body: formData,
    }
  )

  const paths = yield call([response, 'map'], (image) => image.url)

  yield put(actions.imagesUploadSucceeded({id: activityId, paths}))
}

function* inviteMembers(
  activityId,
  participants,
  forcedParticipation = false,
  sendNotification = true
) {
  const urlParams = qs.stringify(
    {forceattending: forcedParticipation, sendNotification},
    {addQueryPrefix: true}
  )

  const response = yield call(
    apiRequest,
    `/web/activityinviteusers/${activityId}${urlParams}`,
    {
      method: 'post',
      body: {
        '': participants.map((id) =>
          `${id}`.charAt(0) === 'i' ? id.slice(1) : id
        ),
        "tasks": ""
      },
    }
  )

  yield put(
    actions.inviteParticipantsSucceeded({
      id: activityId,
      participants: response || [],
    })
  )
}

export function* inviteGroups(activityId, groups, forcedParticipation = false, sendNotification = true) {
  let url = `/web/activityinvitegroups/${activityId}`;

  if (forcedParticipation) {
    url = updateQueryStringParameter(url, 'forceattending', 'true')
  } else {
    url = updateQueryStringParameter(url, 'forceattending', 'false')
  }
 
  if (sendNotification) {
    url = updateQueryStringParameter(url, 'sendNotification', 'true')
  } else {
    url = updateQueryStringParameter(url, 'sendNotification', 'false')
  }
 
  const response = yield call(
    apiRequest,
    url,
    {
      method: 'post',
      body: {
        '': groups,
      },
    }
  )

  const participants = flattenDeep(response.map((group) => group.users))

  yield put(actions.inviteParticipantsSucceeded({id: activityId, participants}))
}

function* watchRemove() {
  yield takeEvery(actions.remove.requested, remove)
}

function* remove({
  payload: {id, removeAll, message, archived},
  meta: {resolve, reject},
}) {
  const club = yield select(getActive)

  try {
    yield call(
      apiRequest,
      `/web/activityremove/${club.id}${message ? `?message=${message}` : ''}`,
      {
        method: 'post',
        body: {
          activityId: id,
          recurring: removeAll,
        },
      }
    )

    yield put(actions.remove.succeeded({id, removeAll, archived}))
    yield call(resolve)
  } catch (error) {
    yield put(actions.remove.failed(error))
    yield call(reject, error.message)
  }
}

export function* editActivity() {
  while (true) {
    const {
      payload: {
        id,
        title,
        start,
        end,
        type,
        description,
        limit,
        reminder,
        deadline,
        allDay,
        participantsVisible,
        commentsEnabled,
        secretDescription,
        isPublic,
        coverImage,
        images,
        participants,
        prevParticipants,
        editAll,
        location,
        responsibleUserId,
        visibility,
        twoDaysReminder,
        coHostIds,
        sendNotification,
        sharedToPublicCalendar
      },
      meta: {resolve, reject},
    } = yield take(actions.edit.requested)

    const {id: clubId} = yield select(getActive)

    try {
      const base64HeaderImage = yield call(imageToBase64, coverImage)
      const response = yield call(apiRequest, '/activities/update', {
        version: 'v3',
        method: 'post',
        body: {
          clubId,
          activityId: id,
          title,
          type,
          description,
          limit,
          reminder,
          allDay,
          commentsDisabled: !commentsEnabled,
          participantListHidden: !participantsVisible,
          secretDescription,
          isPublic,
          location,
          start: toUTC(parse(start)),
          end: end ? toUTC(parse(end)) : undefined,
          deadline: deadline ? toUTC(parse(deadline)) : undefined,
          recurring: editAll,
          responsibleUserId,
          coverImageBase64String: base64HeaderImage,
          coverImage: !base64HeaderImage ? coverImage : undefined,
          visibility,
          twoDaysReminder,
          coHostIds,
          sendNotification,
          sharedToPublicCalendar
        },
      })

      yield put(
        actions.edit.succeeded({id, values: response, recurring: editAll})
      )

      const newImages = yield call(
        [images, 'filter'],
        (image) => image instanceof File
      )

      if (newImages && newImages.length > 0) {
        yield call(uploadImages, id, newImages)
      }

      const membersWithResponsible = [
        ...participants.members,
        responsibleUserId,
      ]

      // Remove members
      const membersToRemove = prevParticipants.members.filter(
        (prevParticipant) => !includes(membersWithResponsible, prevParticipant)
      )

      if (membersToRemove.length > 0) {
        yield call(
          deleteMembers,
          id,
          membersToRemove.map((member) => ({userId: member})),
          sendNotification
        )
      }

      // Invite new members
      const membersToInvite = membersWithResponsible.filter(
        (participant) => !includes(prevParticipants.members, participant)
      )

      if (membersToInvite.length > 0) {
        yield call(
          inviteMembers,
          id,
          membersToInvite,
          undefined,
          sendNotification
        )
      }

      // Remove groups
      const groupsToRemove = prevParticipants.groups.filter(
        (prevGroup) => !includes(participants.groups, prevGroup)
      )

      if (groupsToRemove.length > 0) {
        yield call(
          deleteGroups,
          id,
          groupsToRemove.map((group) => ({userGroupId: group})),
          sendNotification
        )
      }

      // Invite groups
      const groupsToInvite = participants.groups.filter(
        (group) => !includes(prevParticipants.groups, group)
      )

      if (groupsToInvite.length > 0) {
        yield call(inviteGroups, id, groupsToInvite, false, sendNotification)
      }

      yield put(actions.fetch.requested({all: true}))

      yield call(resolve)
    } catch (error) {
      yield put(actions.edit.failed(error))
      yield call(reject)
    }
  }
}

function* deleteMembers(id, members, sendNotification = true) {

  const urlParams = qs.stringify(
    {forceattending: sendNotification},
    {addQueryPrefix: true}
  )

  yield call(apiRequest, `/activities/${id}/participants${urlParams}`, {
    version: 'v3',
    method: 'delete',
    body: {
      '': members,
    },
  })
}

function* deleteGroups(id, groups, sendNotification = true) {
  const urlParams = qs.stringify(
    {forceattending: sendNotification},
    {addQueryPrefix: true}
  )

  yield call(apiRequest, `/activities/${id}/groups${urlParams}`, {
    version: 'v3',
    method: 'delete',
    body: {
      '': groups,
    },
  })
}

export function* importFlow() {
  while (true) {
    const {
      payload: file,
      meta: {resolve},
    } = yield take(actions.upload.requested)

    const activities = yield call(uploadFile, file)

    yield put(actions.upload.succeeded(activities))
    yield call(resolve)

    yield call(importActivities)
  }
}

function* importActivities() {
  const {id} = yield select(getActive)
  const activities = yield select(getImportAcitivitesArray)

  const {
    meta: {resolve, reject},
  } = yield take(actions.upload.confirm)

  try {
    const response = yield call(apiRequest, `/web/activityimport/${id}`, {
      method: 'post',
      body: {
        '': activities,
      },
    })

    yield put(actions.upload.complete(response))
    yield call(resolve)
  } catch (error) {
    yield call(reject)
  }
}

function* uploadFile(file) {
  const {id} = yield select(getActive)

  const formData = new FormData()
  yield call([formData, 'append'], 'kampprogram', file)

  const response = yield call(apiRequest, `/web/activityparseexceldbu/${id}`, {
    method: 'post',
    body: formData,
  })

  return response
}

export function* addComment() {
  while (true) {
    const {
      payload: {id, comment},
      meta: {resolve, reject},
    } = yield take(actions.addComment.requested)

    try {
      const formData = new FormData()
      formData.append('Comment', comment)
      const response = yield call(apiRequest, `/web/activitycomment/${id}`, {
        method: 'post',
        body: formData,
      })
      yield put(actions.addComment.succeeded({id, comments: response}))
      yield call(resolve)
    } catch (error) {
      yield put(actions.addComment.failed(error))
      yield call(reject)
    }
  }
}

export function* removeHeaderImage() {
  while (true) {
    const {
      payload: {id, url},
    } = yield take(actions.removeImage.requested)

    try {
      yield call(apiRequest, `/web/activityimagedelete/${id}`, {
        method: 'post',
        body: {
          url,
        },
      })

      yield put(actions.removeImage.succeeded({id, url}))
    } catch (error) {
      yield put(actions.removeImage.failed())
    }
  }
}

export function* removeImage() {
  while (true) {
    const {
      payload: {id, url},
    } = yield take(actions.removeImage.requested)

    try {
      yield call(apiRequest, `/web/activityimagedelete/${id}`, {
        method: 'post',
        body: {
          url,
        },
      })

      yield put(actions.removeImage.succeeded({id, url}))
    } catch (error) {
      yield put(actions.removeImage.failed())
    }
  }
}

export function* watchFetchGroups() {
  yield takeEvery(actions.fetchGroups.requested, fetchGroups)
}

function* fetchGroups(action) {
  const {payload: id} = action

  try {
    const response = yield call(apiRequest, `/activities/${id}/groups`, {
      version: 'v3',
    })

    yield put(actions.fetchGroups.succeeded({id, response}))
  } catch (error) {}
}

function* watchFetchStatistics() {
  yield takeEvery(actions.fetchStatistics.requested, fetchStatistics)
}

function* fetchStatistics({payload: {id, archived}, meta: {resolve, reject}}) {
  try {
    const response = yield call(api, `/statistics/activities/${id}`, {
      version: null,
    })

    yield put(actions.fetchStatistics.succeeded({id, archived, ...response}))
    yield call(resolve)
  } catch (error) {
    yield put(actions.fetchStatistics.failed(error.message))
    yield call(reject)
  }
}

export default [
  watchFetchActivities,
  watchCreate,
  watchRemove,
  importFlow,
  editActivity,
  addComment,
  removeImage,
  watchFetchGroups,
  watchFetchStatistics,
  watchadminAttendOrRemoveUserToActivity
]

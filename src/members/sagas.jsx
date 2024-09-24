import {take, race, all, call, select, put, takeEvery} from 'redux-saga/effects'
import qs from 'qs'
import {noop, isEmpty, entries, flatten, omit} from 'lodash'
import {apiRequest, api} from 'app/sagas'
import * as actions from './actions'
import {
  fetch as fetchGroups,
  addMembersToGroups,
  removeMembersFromGroups,
} from 'groups/actions'
import {
  getImportMembersArray,
  getImportExisting,
  getImportRoles,
  getImportGroupsArray,
} from './selectors'
import {getActive, getIsFetching as getClubIsFetching} from 'clubs/selectors'
import {fetch as fetchClubs, setActive} from 'clubs'
import {getActiveMemberId, getActiveType, getIsFetching} from 'user'

function* watchFetchMembers() {
    yield takeEvery(actions.fetch.requested, fetchMembers)
}

function* fetchMembers() {

    if (!(yield select(getActive))) {
      yield all([put(fetchClubs.requested()), take(setActive)])
    }

    const userId = yield select(getActiveMemberId)
    const activeType = yield select(getActiveType);
    const isGroupLeader = activeType == 2 || activeType == 3;
    const isFetching = yield select(getIsFetching);
    const isClubFetching = yield select(getClubIsFetching);
    if (!isClubFetching && !isFetching && userId != null && isGroupLeader) {

    const {id} = yield select(getActive)

    try {
      const {members, inactive} = yield all({
        members: yield call(api, `/web/memberoverview/${id}`),
        inactive: yield call(api, `/web/importoverview/${id}`),
      })

      yield put(actions.fetch.succeeded({members, inactive}))
    } catch (error) {
      yield put(actions.fetch.failed(error))
    }
  }
}

function* watchUpdate() {
  yield takeEvery(actions.update.requested, update)
}

export function* update({
  payload: {id, addGroups, removeGroups, ...values},
  meta: {resolve = noop, reject = noop},
}) {
  const club = yield select(getActive)

  try {
    if (id.toString().charAt(0) !== 'i') {
      const response = yield call(
        apiRequest,
        `/clubs/${club.id}/members/${id}`,
        {
          method: 'patch',
          version: 'v3',
          body: {
            userId: id,
            ...values,
          },
        }
      )
      
      yield put(
        actions.update.succeeded(omit(response, ['groupIds', 'children']))
      )
    } else {
      const response = yield call(
        apiRequest,
        `/user/imported/${id.replace(/\D/g, '')}`,
        {
          method: 'patch',
          version: 'v3',
          body: {
            clubId: club.id,
            type: values.memberType,
          },
        }
      )
      yield put(actions.update.succeeded(response, {inactive: true}))
    }

    if (Array.isArray(addGroups) && addGroups.length > 0) {
      yield put(
        addMembersToGroups.requested({
          groups: addGroups,
          members: [id],
          leader: true,
        })
      )
    }

    if (Array.isArray(removeGroups) && removeGroups.length > 0) {
      yield put(
        removeMembersFromGroups.requested({
          groups: removeGroups,
          members: [id],
        })
      )
    }

    yield call(resolve)
  } catch (error) {
    yield put(actions.update.failed(error))
    yield call(reject)
  }
}

export function* importFlow() {
  while (true) {
    const {
      payload: {file, method},
      meta: {resolve, reject},
    } = yield take(actions.upload.requested)

    try {
      const {
        users: members,
        roles,
        groups,
      } = yield call(uploadFile, file, method)
      yield put(actions.upload.succeeded({members, roles, groups}))
      yield call(resolve)

      yield race({
        watchCreate: call(importMembers),
        clear: take(actions.upload.clear),
      })
    } catch (error) {
      yield all([put(actions.upload.failed()), put(actions.upload.clear())])
      yield call(reject, error.message)
    }
  }
}

function* importMembers() {
  const {id} = yield select(getActive) // getActive.id
  const {
    meta: {resolve, reject},
  } = yield take(actions.upload.confirm)
  const members = yield select(getImportMembersArray)
  const columns = yield select((state) => state.members.importColumns)
  const existing = yield select(getImportExisting)
  const roles = yield select(getImportRoles)
  const groups = yield select(getImportGroupsArray)

  try {
    const parentGroups = groups
      .filter((group) => !group.groupName)
      .map(({userGroupId, department, groupName}) => ({
        department,
        groupName,
        userGroupId: userGroupId || 0,
        title: department,
      }))

    const newParentGroups =
      parentGroups.length > 0
        ? yield call(apiRequest, `/web/import/${id}/groups`, {
            method: 'post',
            body: {
              '': parentGroups,
            },
          })
        : parentGroups

    const childGroups = groups
      .filter((group) => group.groupName)
      .map(({userGroupId, department, groupName, parentUserGroupId}) => ({
        department,
        groupName,
        userGroupId: userGroupId || 0,
        title: groupName,
        parentUserGroupId:
          parentUserGroupId ||
          newParentGroups.find(
            (parentGroup) => parentGroup.department === department
          ).userGroupId,
      }))

    const newChildGroups =
      childGroups.length > 0
        ? yield call(apiRequest, `/web/import/${id}/groups`, {
            method: 'post',
            body: {
              '': childGroups,
            },
          })
        : childGroups

    if (!isEmpty(roles)) {
      yield call(apiRequest, `/web/import/${id}/roles`, {
        method: 'post',
        body: {
          '': entries(roles).map((role) => ({
            RoleTitle: role[0],
            Role: role[1],
          })),
        },
      })
    }

    if (existing.length > 0) {
      yield call(apiRequest, `/clubs/${id}/members/merge`, {
        method: 'patch',
        version: 'v3',
        body: {
          '': existing.map((memberId) => {
            const member = members.find(
              (member) => member.memberId === memberId
            )

            return {
              memberId,
              userId: member.userId,
              groups: member.roles
                ? flatten(
                    member.roles.map(({department, groupName, isLeader}) => {
                      const dep = newChildGroups.find(
                        (group) => group.department === department
                      )
                      const group = newChildGroups.find(
                        (group) => group.groupName === groupName
                      )

                      return [
                        {
                          isLeader,
                          id: group && group.userGroupId,
                        },
                        {
                          isLeader,
                          id: dep && dep.userGroupId,
                        },
                      ].filter((g) => g.id)
                    })
                  )
                : [],
              memberTypeId: member.roles
                ? roles[member.roles[0].roleName]
                : member.memberTypeId,
            }
          }),
        },
      })
    }

    const retouchedMembers = members.map((member) => {
      const values = [
        member.firstName,
        member.surname,
        member.email,
        member.zip,
        member.mobile,
      ]

      return {
        ...member,
        [columns[0].key]: values[0],
        [columns[1].key]: values[1],
        [columns[2].key]: values[2],
        [columns[3].key]: values[3],
        [columns[4].key]: values[4],
        groups: member.roles
          ? flatten(
              member.roles.map(({department, groupName, isLeader}) => {
                const dep = newChildGroups.find(
                  (group) => group.department === department
                )
                const group = newChildGroups.find(
                  (group) => group.groupName === groupName
                )

                return [
                  {
                    isLeader,
                    id: group && group.userGroupId,
                  },
                  {
                    isLeader,
                    id: dep && dep.userGroupId,
                  },
                ].filter((g) => g.id)
              })
            )
          : [],
        memberTypeId: member.roles
          ? roles[member.roles[0].roleName]
          : member.memberTypeId,
      }
    })

    const response = yield call(apiRequest, `/web/importusers/${id}`, {
      method: 'post',
      body: {
        '': retouchedMembers,
      },
    })

    yield put(actions.upload.complete(response))
    yield call(resolve)
    yield all([put(actions.fetch.requested()), put(fetchGroups.requested())])
  } catch (error) {
    yield put(actions.upload.failed())
    yield call(reject)
  }
}

function* uploadFile(file, method) {
  const {id} = yield select(getActive)

  const formData = new FormData()
  yield call([formData, 'append'], 'newmembers', file)

  return yield call(
    apiRequest,
    `/web/${method === 'conventus' ? 'parsecsvconventus' : 'parsecsv'}/${id}`,
    {
      method: 'post',
      body: formData,
    }
  )
}

export function* watchCreate() {
  yield takeEvery(actions.create.requested, create)
}

function* create(action) {
  const {
    payload: {firstName, surname, email, birthdate, zip, address, city, mobile},
    meta: {resolve, reject},
  } = action

  const {id} = yield select(getActive)

  try {
    const response = yield call(apiRequest, `/web/importusers/${id}`, {
      method: 'post',
      body: {
        '': [
          {
            firstName,
            surname,
            email,
            birthdate,
            address,
            zip,
            city,
            mobile,
          },
        ],
      },
    })

    yield put(actions.create.succeeded(response))
    yield call(resolve, response)
  } catch (error) {
    yield put(actions.create.failed())
    yield call(reject, error.message)
  }
}

export function* watchAccpetPending() {
  yield takeEvery(actions.accept.requested, acceptPending)
}

function* acceptPending({payload: memberId}) {
  const {id} = yield select(getActive)

  try {
    yield call(apiRequest, `/clubs/${id}/members/${memberId}/accept`, {
      version: 'v3',
      method: 'patch',
    })

    yield all([
      put(actions.accept.succeeded(memberId)),
      put(actions.fetch.requested()),
      put(fetchGroups.requested()),
    ])
  } catch (error) {
    yield put(actions.accept.failed(error))
  }
}

export function* rejectPending() {
  while (true) {
    const {payload: memberId} = yield take(actions.reject.requested)
    const {id} = yield select(getActive)

    try {
      yield call(apiRequest, `/clubs/${id}/members/${memberId}/reject`, {
        version: 'v3',
        method: 'patch',
      })

      yield put(actions.reject.succeeded(memberId))
    } catch (error) {
      yield put(actions.reject.failed(error))
    }
  }
}

function* watchFetchRelations() {
  yield takeEvery(actions.fetchRelations.requested, fetchRelations)
}

function* fetchRelations({payload: id}) {
  if (`${id}`.charAt(0) === 'i') {
    return
  }

  const club = yield select(getActive)
  
  try {
    const response = yield call(apiRequest, `/clubs/${club.id}/members/${id}`, {
      version: 'v3',
    })

    yield put(actions.fetchRelations.succeeded(response))
  } catch (error) {
    yield put(actions.fetchRelations.failed(error))
  }
}

function* watchAddImportsToGroup() {
  yield takeEvery(actions.addImportsToGroup.requested, addImportsToGroup)
}

function* addImportsToGroup(action) {
  const {
    payload: {memberIds, groupId},
  } = action

  try {
    const response = yield call(apiRequest, `/web/groupaddimports/${groupId}`, {
      method: 'post',
      body: {
        '': memberIds,
      },
    })
    
    yield put(actions.addImportsToGroup.succeeded(response))
  } catch (error) {}
}

function* watchRemoveImportsFromGroup() {
  yield takeEvery(
    actions.removeImportsFromGroup.requested,
    removeImportsFromGroup
  )
}

function* removeImportsFromGroup(action) {
  const {
    payload: {memberIds, groupId},
  } = action

  try {
    const response = yield call(
      apiRequest,
      `/web/groupremoveimports/${groupId}`,
      {
        method: 'post',
        body: {
          '': memberIds,
        },
      }
    )

    yield put(actions.addImportsToGroup.succeeded(response))
  } catch (error) {}
}

function* watchAddToGroups() {
  yield takeEvery(actions.addToGroups.requested, addToGroups)
}

function* addToGroups(action) {
  const {
    payload: {memberId, groups, leader},
    meta: {resolve},
  } = action

  const club = yield select(getActive)

  try {
    yield call(
      apiRequest,
      `/clubs/${club.id}/members/${memberId}/groups?leader=${!!leader}`,
      {
        method: 'patch',
        version: 'v3',
        body: {
          '': groups.map((group) => ({userGroupId: group})),
        },
      }
    )
    yield put(actions.addToGroups.succeeded({memberId, groups}))
    yield call(resolve)
  } catch (error) {
    yield put(actions.addToGroups.failed(error))
    yield call(resolve)
  }
}

function* watchUpdateImport() {
  yield takeEvery(actions.updateImport.requested, updateImport)
}

function* updateImport(action) {
  const {
    payload: {id, ...values},
  } = action
  const {id: clubId} = yield select(getActive)

  try {
    const response = yield call(
      apiRequest,
      `/web/importusers/${clubId}/imported/${id}`,
      {
        method: 'patch',
        body: values,
      }
    )

    yield put(actions.updateImport.succeeded(response))
  } catch (error) {
    yield put(actions.updateImport.failed(error))
  }
}


function* watchDownload() {
  yield takeEvery(actions.download, download)
}

function* download(action) {
  const {
    payload: {groupId, key, direction},
    meta: {resolve, reject},
  } = action

  const {id} = yield select(getActive)
  const parameteres = yield call(
    qs.stringify,
    {
      groupId,
      key,
      direction,
    },
    {addQueryPrefix: true}
  )

  try {
    const response = yield call(
      apiRequest,
      `/clubs/${id}/members/export${parameteres}`,
      {
        returnRaw: true,
        version: 'v3',
      }
    )

    const text = yield call([response, 'text'])
    yield call(resolve, text)
  } catch (error) {
    yield call(reject, error)
  }
}

function* watchDownloadInactive() {
  yield takeEvery(actions.downloadInactive, downloadInactive)
}

function* downloadInactive(action) {
  const {
    meta: {resolve, reject},
  } = action

   const {id} = yield select(getActive)
   

  try {
    const response = yield call(apiRequest, `/club/export/${id}/InactiveFile`,
      {
        returnRaw: true,
        version: 'v3',
      })

    const text = yield call([response, 'text'])
    yield call(resolve, text)
  } catch (error) {
    yield call(reject, error)
  }
}

function* watchDownloadByage() {
  yield takeEvery(actions.downloadByage, downloadByage)
}

function* downloadByage(action) {
  const {
    payload: {fromAge, toAge},
    meta: {resolve, reject}
  } = action

   const {id} = yield select(getActive)
   
  try {
    const response = yield call(apiRequest, `/club/export/${id}/Members/age/${fromAge}/${toAge}`,
      {
        returnRaw: true,
        version: 'v3',
      })

    const text = yield call([response, 'text'])
    yield call(resolve, text)
  } catch (error) {
    yield call(reject, error)
  }
}


function* watchRemove() {
  yield takeEvery(actions.remove.requested, remove)
}

function* remove({payload: {inactive, active}}) {
  const {id} = yield select(getActive)

  try {
    if (active.length > 0) {
      yield call(api, `/clubs/${id}/members`, {
        version: 'v3',
        method: 'delete',
        body: active.map((userId) => ({userId})),
      })
    }

    if (inactive.length > 0) {
      yield call(api, `/web/importusers/${id}/imported`, {
        version: 'v2',
        method: 'delete',
        body: inactive.map((userId) => ({userId: userId.replace(/\D/g, '')})),
      })
    }
    yield put(actions.remove.succeeded({members: [...active, ...inactive]}))
  } catch (error) {
    yield put(actions.remove.failed(error))
  }
}

function* watchUpdateInactive() {
  yield takeEvery(actions.updateInactive.requested, updateInactive)
}

function* updateInactive({
  payload: {dummy, id, ...values},
  meta: {resolve, reject},
}) {
  const {id: clubId} = yield select(getActive)

  try {
    const response = yield call(
      api,
      dummy ? '/user/imported' : '/user/updateuserfromwebbecausedeltasucks',
      {
        version: 'v3',
        method: 'patch',
        body: {
          clubId,
          [dummy ? 'dummyUserId' : 'userId']: id,
          ...values,
        },
      }
    )

    yield put(actions.updateInactive.succeeded(response, {dummy}))

    yield call(resolve)
  } catch (error) {
    yield call(reject, error.message)
  }
}

function* watchFetchStatistics() {
  yield takeEvery(actions.fetchStatistics.requested, fetchStatistics)
}

function* fetchStatistics({
  payload: {id, start, end},
  meta: {resolve, reject},
}) {
  const {id: clubId} = yield select(getActive)

  try {
    const statistics = yield call(
      api,
      `/statistics/users/${id}?clubId=${clubId}&start=${start}&end=${end}`,
      {
        version: null,
      }
    )

    yield put(actions.fetchStatistics.succeeded({id, statistics}))
    yield call(resolve)
  } catch (error) {
    yield put(actions.fetchStatistics.failed(error.message))
    yield call(reject)
  }
}


// GUARDIAN
export function* addGuardian(
  {
    payload: {childUserId, guardianUserId, clubId},
  }
) {
  try {
    const response = yield call(api, `/user/AddGuardianToChild`, {
      version: "v3",
      method: "post",
      body:{
        childUserId: childUserId,
        guardianUserId: guardianUserId,
        clubId: clubId
      }
    });

    yield put(actions.addGuardian.succeeded(response))
  } catch (e) {

    yield put(actions.addGuardian.failed(e.message))
  }
}

function* watchAddGuardian() {
  yield takeEvery(actions.addGuardian.requested, addGuardian)
}


// CHILD
export function* addChild(
  {
    payload: {childUserId, guardianUserId, clubId}
  }
) {
  try {
    const response = yield call(api, `/user/AddChildToGuardian`, {
      version: "v3",
      method: "post",
      body:{
        childUserId: childUserId,
        guardianUserId: guardianUserId,
        clubId: clubId
      }
    });

    yield put(actions.addChild.succeeded(response))
  } catch (e) {
  
    yield put(actions.addChild.failed(e.message))
  }
}

function* watchAddChild() {
  yield takeEvery(actions.addChild.requested, addChild)
}

function* exportStats({payload: {clubId, statSelection}}){
  if (statSelection === 'Aktiviteter'){
    if(clubId === 'all'){
      try {
        const response = yield call(api, `/activities/export/group/3/ActivitiesFile/`, {
          version: "v3",
          returnRaw: true,
      });
      
      yield put(actions.exportStats.succeeded(response))
      yield call(actions.exportStats.succeeded)  
    } catch (e) {
      console.log(e)
    }} 
     else {
        try {

        const response = yield call(api, `/activities/export/group/${clubId}/ActivitiesFile/`, {
          version: "v3",
      });

    } catch (e) {
      console.log(e)
    }} 
}}


function* watchExportStats(){
  yield takeEvery(actions.exportStats.requested, exportStats)
}



export function* createRelation(
  {
    payload: {clubId, currentUser, otherUser, relation}
  }
) {
  try {
    const response = yield call(api, `/user/createrelation`, {
      version: "v3",
      method: "post",
      body:{
        ClubId: clubId,
        CurrentUser: currentUser,
        OtherUser: otherUser,
        Relation: relation
      }
    });
    yield put(actions.createRelation.succeeded(response))
    yield put(actions.fetchRelations.requested(currentUser))
  } catch (e) {
  
    yield put(actions.createRelation.failed(e.message))
  }
}

function* watchCreateRelation() {
  yield takeEvery(actions.createRelation.requested, createRelation)
}

export function* removeRelation(
  {
    payload: {clubId, userUserMapId, id}
  }
) {
  try {
    const response = yield call(api, `/user/RemoveRelation`, {
      version: "v3",
      method: "post",
      body:{
        ClubId: clubId,
        UserUserMapId: userUserMapId

      }
    });
    yield put(actions.removeRelation.succeeded(response))
    yield put(actions.fetchRelations.requested(id))
  } catch (e) {
  
    yield put(actions.removeRelation.failed(e.message))
  }
}

function* watchRemoveRelation() {
  yield takeEvery(actions.removeRelation.requested, removeRelation)
}

export default [
  watchFetchMembers,
  watchCreateRelation,
  watchRemoveRelation,
  watchUpdate,
  watchCreate,
  importFlow,
  watchAccpetPending,
  rejectPending,
  watchAddToGroups,
  watchAddImportsToGroup,
  watchRemoveImportsFromGroup,
  watchUpdateImport,
  watchDownload,
  watchDownloadInactive,
  watchDownloadByage,
  //downloadByage,
  watchRemove,
  watchFetchRelations,
  watchUpdateInactive,
  watchFetchStatistics,
  watchAddGuardian,
  watchAddChild,
  watchExportStats
]

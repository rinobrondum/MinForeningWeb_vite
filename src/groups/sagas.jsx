import {take, all, call, put, select, takeEvery} from 'redux-saga/effects'
import {apiRequest, api} from 'app/sagas'
import {flatten} from 'lodash'
import * as actions from './actions'
import {getActive, getrealBulk} from 'clubs/selectors'
import {getActiveMemberId} from 'user/selectors'

function* fetchGroups() {

  while (true) {
  
      yield take(actions.fetch.requested)
      const club = yield select(getActive)

      try {
        const response = yield call(apiRequest, `/web/groupoverview/${club.id}`)

        yield put(actions.fetch.succeeded(response))
      } catch (error) {
        yield put(actions.fetch.failed(error))
      }
  }
}

function* watchCreate() {
  yield takeEvery(actions.create.requested, create)
}

export function* create({
  payload: {name, parentUserGroupId, subGroups = []},
  meta: {resolve, reject},
}) {
  const club = yield select(getActive)

  try {
    const response = yield call(apiRequest, `/web/groupadd/${club.id}`, {
      method: 'post',
      body: {
        title: name,
        parentUserGroupId,
      },
    })

    yield put(actions.create.succeeded(response))

    if (subGroups.length > 0) {
      yield all(
        subGroups.map((subGroup) =>
          call(
            create,
            actions.create.requested({
              values: {
                ...subGroup,
                parentUserGroupId: response.userGroupId,
              },
            })
          )
        )
      )
    }

    yield call(resolve, response)
  } catch (error) {
    yield put(actions.create.failed(error))
    yield call(reject)
  }
}

function* watchMoveMembersBetweenGruops() {
  yield takeEvery(
    actions.moveMembersBetweenGroups.requested,
    moveMembersBetweenGroups
  )
}

function* moveMembersBetweenGroups({
  payload: {members, from, to},
  meta: {resolve},
}) {
  yield all([
    put(actions.removeMembersFromGroups.requested({members, groups: from})),
    put(actions.addMembersToGroups.requested({members, groups: to})),
    take(actions.removeMembersFromGroups.succeeded),
    take(actions.addMembersToGroups.succeeded),
  ])
  yield call(resolve)
}

function* deleteGroup() {
  while (true) {
    const {
      payload: id,
      meta: {resolve, reject},
    } = yield take(actions.remove.requested)

    const club = yield select(getActive)

    try {
      yield call(apiRequest, `/web/groupdeleterecursive/${club.id}`, {
        method: 'post',
        body: {
          userGroupId: id,
        },
      })
      yield put(actions.remove.succeeded(id))
      yield call(resolve)
      resolve()
    } catch (error) {
      yield put(actions.remove.failed(error))
      yield call(reject)
    }
  }
}

function* editGroup() {
  while (true) {
    const {
      payload: {id, title, maxUsers, open, hiddenForClubMembers, hiddenForClubLeaders},
      meta: {resolve, reject},
    } = yield take(actions.edit.requested)
    try {
      yield call(apiRequest, `/web/groupedit/${id}`, {
        method: 'post',
        body: {
          Title: title,
          maxUsers,
          Open: open,
          HiddenForClubMembers: hiddenForClubMembers,
          HiddenForClubLeaders: hiddenForClubLeaders,
        },
      })
      yield put(actions.edit.succeeded({id, title, maxUsers, open}))
      yield call(resolve)
    } catch (error) {
      yield put(actions.edit.failed(error))
      yield call(reject)
    }
  }
}

function* watchAddMembersToGroups() {
  yield takeEvery(actions.addMembersToGroups.requested, addMembersToGroups)
}

function* addMembersToGroups({
  payload: {active, inactive, groups, leader},
  meta: {resolve},
}) {
  const {addedActive, addedInactive} = yield all({
    addedActive: all(
      active.map((member) => call(addMemberToGroups, member, groups, {leader}))
    ),
      addedInactive: all(
        inactive.map((inactives) => call(addInactivesToGroup, inactives, groups, {leader}))
    ),
  })
  yield put(
    actions.addMembersToGroups.succeeded({
      groups,
      active: flatten(addedActive),
      inactive: flatten(addedInactive),
      leader,
    })
    )
   
  yield call(resolve)
}

function* addMemberToGroups(member, groups, {leader} = {leader: false}) {
  const {id} = yield select(getActive)
  yield call(
    apiRequest,
    `/clubs/${id}/members/${member}/groups?leader=${!!leader}`,
    {
      method: 'patch',
      version: 'v3',
      body: groups.map((userGroupId) => ({userGroupId})),
    }
  )
  return member
}

function* addInactivesToGroup(inactives, group, {leader} = {leader: false}) {
  if (inactives.length > 0) {    
    let bodyRequestInActiveUsers = [];
    group.forEach(userGroup => {
      bodyRequestInActiveUsers.push({
        dummyId: inactives.replace(/\D/g, ''),
        groupId: userGroup,
        isLeader: leader,
      });
    });
    yield call(api, `/web/AddDummyUsersToGroups`, {
      method: 'post',
      body: bodyRequestInActiveUsers,
    })
  }  
 return inactives
}

function* watchRemoveMembersFromGroups() {
  yield takeEvery(
    actions.removeMembersFromGroups.requested,
    removeMembersFromGroups
  )
}

function* removeMembersFromGroups({payload: {inactive, active, groups}}) {
  try {
    const {removedActive, removedInactive} = yield all({
      removedActive: all(
        groups.map((group) => call(removeMembersFromGroup, active, group))
      ),
      removedInactive: all(
        groups.map((group) =>
          call(removeMembersFromGroup, inactive, group, {inactive: true})
        )
      ),
    })

    yield put(
      actions.removeMembersFromGroups.succeeded({
        groups,
        active: flatten(removedActive),
        inactive: flatten(removedInactive),
      })
    )
  } catch (error) {
    console.log(error)
  }
}

function* removeMembersFromGroup(
  members,
  group,
  {inactive} = {inactive: false}
) {
  if (members.length > 0) {
    const ids = members.map((member) => member.toString().replace(/\D/g, ''))

    yield call(
      api,
      `/web/groupremove${inactive ? 'imports' : 'members'}/${group}`,
      {
        method: 'post',
        body: ids,
      }
    )
  }

  return members
}

function* watchFetchStatistics() {
  yield takeEvery(actions.fetchStatistics.requested, fetchStatistics)
}

function* fetchStatistics({
  payload: {id, start, end},
  meta: {resolve, reject},
}) {
  try {
    const statistics = yield call(
      api,
      `/statistics/groups/${id}?start=${start}&end=${end}`,
      {version: null}
    )

    yield put(actions.fetchStatistics.succeeded({id, statistics}))
    yield call(resolve)
  } catch (error) {
    yield put(actions.fetchStatistics.failed(error.message))
    yield call(reject)
  }
}
 function* watchExportGroup() {
   yield takeEvery(
     actions.exportGroup.requested, exportGroup
   )
 }

function* exportGroup({
  payload: {groupId, clubId},
  meta: {resolve, reject},
}) {
  if (groupId === 'all'){
    try {
      const response = yield call(
        apiRequest,
        `/activities/export/club/${clubId}/tasksfile`,
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
  } else {
    try {
    const response = yield call(
      apiRequest,
      `/activities/export/group/${groupId}/tasksfile`,
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
  
}

function* watchExportTasksSelf() {
  yield takeEvery(
    actions.exportTasksself.requested, exportTasksself
  )
}

function* exportTasksself(action) {
 const {
  payload: {groupId},
   meta: {resolve, reject},
 } = action

 try {
   const response = yield call(
     apiRequest,
     `/activities/export/myactivities/tasksfile`,
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
function* watchExportActivities() {
  yield takeEvery(
    actions.exportActivities.requested, exportActivities
  )
}

function* exportActivities({
  payload: {clubId},
  meta: {resolve, reject},
}) {

// using ClubId instead of id gives undefined

 try {
  if (clubId === 'all'){
    const response = yield call(
      apiRequest,
      `/activities/export/club/3/ActivitiesFile`,
      {
        returnRaw: true,
        version: 'v3',
      }
    )
    const text = yield call([response, 'text'])
   yield call(resolve, text)
  } else {
    const response = yield call(
        apiRequest,
        `/activities/export/club/${clubId}/ActivitiesFile`,
        {
          returnRaw: true,
          version: 'v3',
        }
      )
      const text = yield call([response, 'text'])
      yield call(resolve, text)
  }
 } catch (error) {
   yield call(reject, error)
 }
}
function* watchExportMemberActivities() {
  yield takeEvery(
    actions.exportMemberactivities.requested, exportMemberActivities
  )
}

function* exportMemberActivities({
  payload: {groupId, clubId, memberId},
  meta: {resolve, reject},
}) {
 if (groupId === undefined || groupId === 'all'){
  try {
    const response = yield call(
      apiRequest,
      `/activities/export/clubmember/${clubId}/${memberId}/ActivitiesFile`,
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
 } else {
  try {
   const response = yield call(
     apiRequest,
     `/activities/export/groupmember/${groupId}/${memberId}/ActivitiesFile`,
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
}

function* watchExportGroupActivities() {
  yield takeEvery(
    actions.exportGroupActivities.requested, exportGroupActivities
  )
}

function* exportGroupActivities({
  payload: {groupId, clubId},
  meta: {resolve, reject},
}) {

 try {
  if (groupId === 'all'){
    const response = yield call(
      apiRequest,
      `/activities/export/club/${clubId}/ActivitiesFile`,
      {
        returnRaw: true,
        version: 'v3',
      }
    )
    const text = yield call([response, 'text'])
   yield call(resolve, text)
  } else {
    const response = yield call(
        apiRequest,
        `/activities/export/group/${groupId}/ActivitiesFile`,
        {
          returnRaw: true,
          version: 'v3',
        }
      )
      const text = yield call([response, 'text'])
      yield call(resolve, text)
  }
 } catch (error) {
   yield call(reject, error)
 }
}

function* exportMemberTasks({
  payload: {groupId, clubId, memberId},
  meta: {resolve, reject},
}) {
 if (groupId === undefined || groupId === 'all'){
  try {
    const response = yield call(
      apiRequest,
      `/activities/export/club/${clubId}/member/${memberId}/tasksfile`,
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
 } else {
  try {
   const response = yield call(
     apiRequest,
     `/activities/export/group/${groupId}/member/${memberId}/tasksfile`,
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
}

function* watchExportMemberTasks(){
  yield takeEvery(
    actions.exportMemberTasks.requested, exportMemberTasks
  )
}
export default [
  fetchGroups,
  watchCreate,
  deleteGroup,
  editGroup,
  //exportGroup,
  watchExportGroup,
  watchExportTasksSelf,
  watchExportActivities,
  watchExportMemberActivities,
  watchMoveMembersBetweenGruops,
  watchAddMembersToGroups,
  watchRemoveMembersFromGroups,
  watchFetchStatistics,
  watchExportGroupActivities,
  watchExportMemberTasks
]

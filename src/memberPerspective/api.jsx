import qs from 'qs'
import {createSelector} from 'reselect'
import {compact} from 'lodash'
import {format} from 'date-fns'
import camelCaseKeys from 'lib/camelCaseKeys'
import imageToBase64 from 'lib/imageToBase64'
import { date } from 'yup/lib/locale'
import {  values,  sortBy,  orderBy,  uniqBy,  pickBy,  union,  toLower,  get,  includes,  without,  flattenDeep,  uniq,} from 'lodash'
import { getUserId } from 'user'
import getAppUrls from 'jsonFetches/getAppUrls'

class Api {
  constructor({token, memberId, clubId}) {
    this.token = token
    this.memberId = memberId
    this.clubId = clubId
    this.baseUrl = getAppUrls().apiMyOrgUrl;
  }

  // https://gist.github.com/ghinda/8442a57f22099bdb2e34
  objectToFormData(obj, form, namespace) {
    
    var fd = form || new FormData();
    var formKey;
    
    for(var property in obj) {
      if(obj.hasOwnProperty(property)) {
        if(namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }
        // if the property is an object, but not a File,
        // use recursivity.
        if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
          this.objectToFormData(obj[property], fd, property);
        } else {
          // if it's a string or a File object
          fd.append(formKey, obj[property]);
        }
      }
    }
    return fd; 
  };

  request(
    endpoint,
    {method = 'get', version = 'v2', body = null, params = {}, isJson = true, isFormData = false} = {}
  ) {
    const url = compact([
      this.baseUrl,
      version,
      endpoint,
    ]).join('/')

    const urlParams = qs.stringify(params, {addQueryPrefix: true})
    let headers = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };

    if (!isJson && !isFormData) {
      body = this.objectToFormData(body);
    }
    if (isFormData) {
        for (var pair of body.entries()) {
      }
      headers = {
        Authorization: `Bearer ${this.token}`
      };
    }

    return fetch(`${url}${urlParams}`, {
      method: method.toUpperCase(),
      headers: headers,
      body: isJson ? body ? JSON.stringify(body) : undefined : body,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw Error(response.statusText) //  + " body " + response.text())
        }
        return response.json()
      })
      .then(camelCaseKeys)
  }

  // V3 fetch attempt
  request3(
    endpoint,
    {method = 'get', version = 'v3', returnRaw = true, body = null, params = {}, isJson = true, isFormData = false} = {}
  ) {
    const url = compact([
      this.baseUrl,
      version,
      endpoint,
    ]).join('/')

    const urlParams = qs.stringify(params, {addQueryPrefix: true})
    let headers = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };

    if (!isJson && !isFormData) {
      body = this.objectToFormData(body);
    }
    if (isFormData) {
        for (var pair of body.entries()) {
      }
      headers = {
        Authorization: `Bearer ${this.token}`
      };
    }


    return fetch(`${url}${urlParams}`, {
      method: method.toUpperCase(),
      headers: headers,
      returnRaw: true,
      body: isJson ? body ? JSON.stringify(body) : undefined : body,
    })
      .then((response) => {
        if (response.status >= 400) {
          throw Error(response.statusText) //  + " body " + response.text())
        }
        if(returnRaw != true){
          return response.json()
        }
        else{

          return response
        }
        

      })
      .then(camelCaseKeys)
  }

  getUser() {
    return this.request(`user/${this.memberId}`, {version: 'v1'})
  }

  getClubMember(clubId) {
    return this.request(`user/clubmaps`, {version: 'v3'}).then(club => {
      return club.filter(c => c.apiClub.clubId == clubId)[0] // TODO: Refactor - dont use filter, maybe use map?
    })
  }

  getMemberClubs(memberId, noChildren) {
    if (noChildren) {
      return this.request(`user/clubmaps?noChildren=` + noChildren, {version: 'v3'})
    } else {
      return this.request(`user/clubmaps?otherUserId=` + memberId + `&noChildren=` + noChildren, {version: 'v3'})
    }
  }

  getClubs() {
    return this.request(`web/cluboverview`, { method: 'get', version: 'v2'}) // Working ????
  }

  getMember() {
    return this.request(`clubs/${this.clubId}/members/${this.memberId}`, {version: 'v3'}) // Only works if admin.
  }

  getClubMembers(clubId) {
    return this.request(`clubs/${clubId}/members`, { version: 'v3'})
  }

  getClubGroups(clubId) {
    return this.request(`groups/club/${clubId}`, { version: 'v3'})
  }

  getMyGroups(otherUserId) {
    if (otherUserId) {
      return this.request(`groups/club/${this.clubId}/myGroups?otherUserId=${otherUserId}`, { version: 'v3'})
    } else {
      return this.request(`groups/club/${this.clubId}/myGroups`, { version: 'v3'})
    }
  }

  getGroups() {
    return this.request(`groups/club/${this.clubId}`, { version: 'v3'
    })
  }

  createGroupRequest(
    group,
    activeMemberId
  ) {
    var me = this;
    return this.getClubMember(this.clubId).then((club) => {
      return me.request(`usergroup/adduser`, {   
        method: 'post',
        version: 'v2',
        body: {
          ApiUser: {
            UserId: this.memberId
          },
          ApiUserGroup: group,
          ApiUserOther: {
            UserId: activeMemberId
          },
          ApiUserOtherMemberType: club.memberType
        },
        isJson: true
      })
    })
  }

  updateUser({
    firstName,
    surname,
    email,
    mobile,
    address,
    zip,
    city,
    birthdate,
  }) {
    return this.request('user', {
      method: 'patch',
      version: 'v3',
      body: {
        userId: this.memberId,
        firstName,
        surname,
        email,
        mobile,
        address,
        zip,
        city,
        birthdate,
      },
    })
  }

  getChildren() {
    return this.request('user/0/children', {version: 'v3'})
  }

  getActivities({
    limit = 0,
    backwards = false,
    offset = 0,
    clubId = 0,
    filter = 0,
  } = {}) {
    return this.request('wheel/ouractivities', {
      params: {
        limit,
        backwards: Number(backwards),
        offset,
        clubId: 0,
        filter,
        userId: this.memberId,
      },
    })
  }

  exportActivitiesself() {
    return this.request3('activities/export/myactivities/ActivitiesFile', {
      returnRaw: true,
      version: 'v3',
      params: {
userId: this.memberId
      }
    })
  }

  getActivtyDetails(id) {
    return this.request(`activities/${id}`)
  }

  getActivityStatistics({start, end} = {}) {
    return this.request(`statistics/users/${this.memberId}`, {
      version: null,
      params: {
        clubId: this.clubId,
        start: format(start, 'YYYY-MM-DD'), // TODO: refactore dato format til håntering af dato alt efter hvor brugeren kommer fra. (Sprog)
        end: format(end, 'YYYY-MM-DD'),
      },
    })
  }

  // All members that have been directly invited (i.e. not through a group) to
  // an activity.
  getActivityInvitedMembers(id) {
    return this.request(`activities/${id}/participants`, {version: 'v3'})
  }

  // All groups that have been invited to an activity.
  getActivityInvitedGroups(id) {
    return this.request(`activities/${id}/groups`, {version: 'v3'})
  }

  // All members that have been either directly or indirectly invited (i.e.
  // through a group).
  getActivtyMembers(id) {
    return this.request(`activities/users`, {
      method: 'post',
      version: 'v2',
      body: {apiActivity: {activityId: id}, apiUser: {userId: this.memberId}},
    })
  }

  getActivtyComments(id) {
    return this.request('activities/comments', {
      method: 'post',
      body: {apiActivity: {activityId: id}, apiUser: {}},
    })
  }

  getActivtyUserPaymentForCurrentUser(activityId) {
    return this.request('activities/' + activityId + '/payments', {
      method: 'get',
      version: 'v3',
    }).then(result => {
      result = result.filter(a => a.userId == this.memberId);
      if (result.length > 0) {
        return result[0];
      }

      return null;
    })
  }

  createActivtyUserPaymentForCurrentUser(activityId, autoCaptureWithMobilePay = false, currency = "DKK") {
    return this.request('activities/' + activityId + '/payments', {
      method: 'post',
      version: 'v3',
      body: {
        userId: this.memberId,
        autoCaptureWithMobilePay: autoCaptureWithMobilePay,
        currency
      },
    })
  }

  acceptActivtyInvite(id) {
    return this.request('activities/acceptinvite', {
      method: 'post',
      body: {
        apiUser: {
          userId: this.memberId,
        },
        apiActivity: {
          activityId: id,
        },
      },
    })
  }

  cancelActivtyInvite(id) {
    return this.request('activities/setattendingstate', {
      method: 'post',
      body: {
        apiUser: {
          userId: this.memberId,
        },
        apiActivity: {
          activityId: id,
        },
        statusType: 2,
      },
    })
  }

  getMessages() {
    return this.request('clubboards', {version: null})
  }

  markMessageAsRead(id) {
    return this.request(`clubboards/${id}`, {method: 'patch', version: null})
  }

  getPayments() {
    return this.request('payments', {version: 'v3'})
  }

  getPayment(id) {
    return this.request(`payments/clubpayments/${id}`, {version: 'v3'})
  }

  getSponor() {
    return this.request('sponsors/get', {version: 'v2'})
  }

  createChat(
    userIds,
    title,
    image,
    clubId
    ) {     
      return this.request(`chat/createwithclub`, {   
        method: 'post',
        version: 'v3',
        body: {
          userIds: userIds,
          title: title,
          image: image,
          clubId: clubId,
        }
      })
  }

  createGroupChat(
    id,
    ) {     
      return this.request(`chat/groups/${id}`, {   
        method: 'get',
        version: 'v3',
      })
  }

  addUserToChat(
    id,
    newUserIds,
  ){
    return this.request(`chat/${id}/users`, {   
      method: 'put',
      version: 'v3',
      body: newUserIds
    })

  }

  updateChatTitle(
    id,
    title,
  ) {
    return this.request(`chat/${id}/title`, {   
      method: 'patch',
      version: 'v3',
      body: {
        id: id,
        title: title,
      }
    })
  }

  sendChatMessage(
    id,
    message,
    imageUrl,
    ) {
      return this.request(`chat/${id}/message`, {   
        method: 'post',
        version: 'v3',
        body: {   
          id: id,
          userId: this.memberId,
          message: message,       
          imageUrl: imageUrl,
        }    
      })
  }

  getConversations() {
    return this.request(`chat/overviews?includeGroupChats=true`, {version: 'v3'})
  }

  getConversationsMessages(id, limit = 20, offsetChatMessageId = 0, newerThanChatMessageId = 0) {
    return this.request(`chat/${id}/messages?limit=${limit}&offsetId=${offsetChatMessageId}&newerThanId=${newerThanChatMessageId}`, {version: 'v3'})
  }

  getConversationRelations(id){
    return this.request(`chat/${id}/relations`, {version: 'v3'})
  }

  setChatHeaderImg(
    chatId,
    imageUrl,
    ) {
      return this.request(`chat/${chatId}/headerimage`, {   
        method: 'patch',
        version: 'v3',
        body: {   
          chatId: chatId,
          imageUrl: imageUrl,
        }    
      })
  }

  uploadChatImg(
    id,
    formData,
    ) {
      return this.request(`chat/${id}/image`, {   
        method: 'post',
        version: 'v3',
        isJson: false,
        isFormData: true,
        body:formData,
      })
  }


  getUserExemptions() {
    return this.request(`/sponsors/user/exemptions`, {   
      method: 'post',
      version: 'v4',
    })
  } 

  updateUserExemptions(values) {
    return this.request(`/sponsors/user/exemption/update`, {   
      method: 'post',
      version: 'v4',
      body: {   
        EnabledForSelf: values.isEnabledForSelf,
        EnabledForRelations: values.isEnabledForRelations,
      },
    })
  }

  buyUserExemptions(values) {
    return this.request(`/sponsors/user/exemption/order`, {   
      method: 'post',
      version: 'v4',
      body: {   
        Amount: values.amount,
      },
    })
  }


}


export default Api

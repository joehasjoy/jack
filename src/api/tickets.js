import axios from 'axios'
import { token } from './conf'

export function getWorkflows() {
  const header = {
      'appname': 'ops'
  }
  const res = axios({
    method: 'get',
    url: '/ticket/api/v1.0/workflows/',
    headers: header
  })
  return res
}

export function workFlowInit(flowId, username){
  const header = {
    'appname': 'ops'
  }
  const param = {
    'username': username
  }
  const res = axios({
    url: `/ticket/api/v1.0/workflows/${flowId}/init_state/`,
    method: 'get',
    params: param,
    headers: header
  })
  return res
}

export function createTicket(data, username){
  const header = {
    'appname': 'ops'
  }
  data['username'] = username
  const res = axios({
    url: '/ticket/api/v1.0/tickets/',
    headers: header,
    method: 'post',
    data: data
  })
  return res
}

export function getTicket(data, username){
  const header = {
    'appname': 'ops'
  }
  const param = {
    'username': username
  }
  var url = ''
  let keys = Object.keys(data)
  var query = []
  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      query.push(`${keys[i]}=${data[keys[i]]}`)
    }
    url = `/ticket/api/v1.0/tickets/?${query.join('&')}`
  } else {
    url = '/ticket/api/v1.0/tickets/'
  }
  const res = axios({
    url: url,
    method: 'get',
    headers: header,
    params: param
  })
  return res
}

export function getTicketFlowlog(Ticketid, username){
  const header = {
    'appname': 'ops'
  }
  const param = {
    'username': username
  }
  
  const res = axios({
    url: `/ticket/api/v1.0/tickets/${Ticketid}/flowlogs/`,
    method: 'get',
    headers: header,
    params: param
  })
  return res
}

export function getTicketDetail(TicketId, username){
  const header = {
    'appname': 'ops'
  }
  const param = {
    'username': username
  }
  const res = axios({
    url: `/ticket/api/v1.0/tickets/${TicketId}/`,
    method: 'get',
    headers: header,
    params: param
  })
  return res
}

export function getTicketStepList(Ticketid, username) {
  const header = {
    'appname': 'ops'
  }
  const param = {
    'username': username
  }
  const res = axios({
    url: `/ticket/api/v1.0/tickets/${Ticketid}/flowsteps/`,
    method: 'get',
    headers: header,
    params: param
  })
  return res
}

export function getTicketTransitions(Ticketid, username){
  const header = {
    'appname': 'ops'
  }
  const param = {
    'username': username
  }
  const res = axios({
    url: `/ticket/api/v1.0/tickets/${Ticketid}/transitions/`,
    method: 'get',
    headers: header,
    params: param
  })
  return res
}

export function handleTicketAction(data, username) {
  data.data['username'] = username
  const header = {
    'appname': 'ops'
  }
  const res = axios({
    url: `/ticket/api/v1.0/tickets/${data.id}/`,
    method: 'patch',
    headers: header,
    data: data.data
  })
  return res
}

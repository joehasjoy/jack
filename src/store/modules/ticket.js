import { getWorkflows, workFlowInit, createTicket, getTicket, getTicketFlowlog, getTicketDetail, getTicketStepList, getTicketTransitions, handleTicketAction } from '@/api/tickets'


const ticket = {
  state: {
    alias: ''
   
  },

  mutations: {
    GET_ALIAS: (state) => {
      state.alias = localStorage.username + '@oyohotels.cn'
    }

  },

  actions: {
    api_workflows({ commit, state }) {
      return new Promise((resolve, reject) => {
        getWorkflows().then((resp) => {
          resolve(resp)
          }).catch((err) => {
            reject(err)
        });
        commit('GET_ALIAS')
      })
      
    },
    init_workflow({ commit }, args) {
      return new Promise((resolve, reject) => {
        workFlowInit(args, ticket.state.alias).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        });
      })  
    },
    create_ticket({ commit }, args){
      return new Promise((resolve, reject) => {
        createTicket(args, ticket.state.alias).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      })
    },
    get_ticket_list({ commit }, args){
      return new Promise((resolve, reject) => {
        getTicket(args, ticket.state.alias).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      })
    },
    get_ticket_detail({ commit }, args){
      return new Promise((resolve, reject) => {
        getTicketDetail(args, ticket.state.alias).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      })
    },
    get_ticket_flowlog({ commit }, args){
      return new Promise((resolve, reject) => {
        getTicketFlowlog(args, ticket.state.alias).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      })
    },
    get_ticket_step_list({ commit }, args){
      return new Promise((resolve, reject) => {
        getTicketStepList(args, ticket.state.alias).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      })
    },
    get_ticket_transitions({ commit }, args) {
      return new Promise((resolve, reject) => {
        getTicketTransitions(args, ticket.state.alias).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      })
    },
    handle_ticket_action({ commit }, args) {
      return new Promise((resolve, reject) => {
        handleTicketAction(args, ticket.state.alias).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      }) 
    },
  }
}
export default ticket
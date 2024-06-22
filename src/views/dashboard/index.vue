<template>
  <div>
    <el-table :data="userinfo"
    style="width: 100%">
      <el-table-column label="用户名" width="320" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" width="320" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号" width="320" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.employee }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="320" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Validators from '@/utils/validators'

export default {
  name: 'userinfo',
  data () {
    const validatePass1 = (rule, value, callback) => {
      if (value != this.pwdData.passwd) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      userinfo: [],
      rules: {},

    }
  },
  methods: {
    init () {
      this.$store.dispatch('get_user_info').then(resp => {
        const data = {}
        //console.log('userinfo:', resp)
        if(resp.data.data.user_type=='ldap'){
          data['username'] = resp.data.data.user_ldap.attributes.mail[0]
          data['name'] = resp.data.data.user_ldap.attributes.name[0]
          data['employee'] = resp.data.data.user_ldap.attributes.employeeID[0]
          const department = resp.data.data.user_ldap.attributes.distinguishedName[0].split(',')[1].split('=')[1]
          data['department'] = department
          this.userinfo.push(data)
        }else {
          this.$notify.warning({message: '非AD用户或请求错误！'})
        }
      })
    },

  },
  computed: {

  },
  mounted() {
    this.init()
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
